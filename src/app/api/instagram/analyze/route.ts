import { BrutalUserPromptParams, TrendMetrics } from "@/app/instagram/types";
import genAI from "@/lib/gemini";
import { BRUTAL_ANALYST_SYSTEM_PROMPT } from "@/lib/prompts/brutal-analyst";
import { INSTAGRAM_ANALYSIS_SCHEMA } from "@/lib/schemas/analysis";
import { supabase } from "@/lib/supabase";
import {
  calculateAuthenticity,
  calculateCampaignSuitability,
  calculateEngagementRate,
  getAccountGrade,
  getAccountTier,
  getAverageUploadCycle,
  getLatestPostDate,
  isMarketSuitable,
  isUserActive
} from "@/services/instagram/utils";
import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// Trend Analysis Functions (30-post based)
// ------------------------------------------------------------------

interface PostForTrend {
  likes: number;
  comments: number;
  timestamp: string;
}

function calculateERTrend(posts: PostForTrend[], followers: number): TrendMetrics | null {
  console.log(`[TrendMetrics] Calculating for ${posts.length} posts, followers: ${followers}`);
  
  if (posts.length < 10) {
    // 최소 10개 게시물 필요
    console.log(`[TrendMetrics] Not enough posts (${posts.length} < 10)`);
    return null;
  }

  // 3개 구간으로 분할 (최신순 정렬 가정)
  const recentPosts = posts.slice(0, Math.min(10, posts.length));
  const middlePosts = posts.slice(10, 20);
  const oldestPosts = posts.slice(20, 30);

  // 구간별 ER 계산
  const calcPeriodMetrics = (periodPosts: PostForTrend[]) => {
    if (periodPosts.length === 0) return { er: 0, avgLikes: 0, avgComments: 0 };
    const totalLikes = periodPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalComments = periodPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
    const avgLikes = totalLikes / periodPosts.length;
    const avgComments = totalComments / periodPosts.length;
    const er = followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;
    return { er, avgLikes, avgComments };
  };

  const recent = calcPeriodMetrics(recentPosts);
  const middle = calcPeriodMetrics(middlePosts);
  const oldest = calcPeriodMetrics(oldestPosts);

  // ER 추세 계산 (최근 vs 중간+이전 평균)
  const previousAvgER = middlePosts.length > 0 
    ? (middle.er + (oldestPosts.length > 0 ? oldest.er : middle.er)) / (oldestPosts.length > 0 ? 2 : 1)
    : 0;
  
  const erChangePercent = previousAvgER > 0 
    ? ((recent.er - previousAvgER) / previousAvgER) * 100 
    : 0;

  // 추세 판정
  let erTrend: 'rising' | 'stable' | 'declining';
  if (erChangePercent > 15) {
    erTrend = 'rising';
  } else if (erChangePercent < -15) {
    erTrend = 'declining';
  } else {
    erTrend = 'stable';
  }

  // 평균 업로드 주기 계산
  let avgUploadFrequency = 0;
  if (posts.length >= 2) {
    const timestamps = posts
      .map(p => new Date(p.timestamp).getTime())
      .filter(t => !isNaN(t))
      .sort((a, b) => b - a); // 최신순
    
    if (timestamps.length >= 2) {
      const totalDays = (timestamps[0] - timestamps[timestamps.length - 1]) / (1000 * 60 * 60 * 24);
      avgUploadFrequency = Math.round(totalDays / (timestamps.length - 1));
    }
  }

  return {
    erTrend,
    erChangePercent: Math.round(erChangePercent * 10) / 10,
    avgUploadFrequency,
    totalPosts: posts.length,
    periodComparison: {
      recent: { er: Math.round(recent.er * 100) / 100, avgLikes: Math.round(recent.avgLikes), avgComments: Math.round(recent.avgComments) },
      middle: { er: Math.round(middle.er * 100) / 100, avgLikes: Math.round(middle.avgLikes), avgComments: Math.round(middle.avgComments) },
      oldest: { er: Math.round(oldest.er * 100) / 100, avgLikes: Math.round(oldest.avgLikes), avgComments: Math.round(oldest.avgComments) }
    }
  };
}

function buildBrutalUserPrompt(params: BrutalUserPromptParams): string {
  const { username, fullName, biography, followers, metrics, trendMetrics, postsData } = params;
  
  // 게시글 텍스트 구성
  const postsText = postsData.map((post, i) => {
    const commentsText = post.comments
      .slice(0, 20)
      .map((c, j) => `${j + 1}. @${c.username}: "${c.text}"${c.likes ? ` (${c.likes} 좋아요)` : ''}`)
      .join('\n');
    
    return `
게시글 #${i + 1}:
캡션: ${post.caption || '(없음)'}
해시태그: ${post.hashtags?.join(', ') || '(없음)'}
댓글 수: ${post.comments.length}개

댓글 샘플:
${commentsText || '(댓글 없음)'}`;
  }).join('\n\n---\n');

  // 트렌드 분석 섹션 (30개 게시물 기반)
  const trendText = trendMetrics ? `
**트렌드 분석 (30개 게시물 기반):**
- ER 추세: ${trendMetrics.erTrend === 'rising' ? '📈 상승' : trendMetrics.erTrend === 'declining' ? '📉 하락' : '➡️ 유지'} (${trendMetrics.erChangePercent > 0 ? '+' : ''}${trendMetrics.erChangePercent}%)
- 구간별 ER:
  - 최근 10개: ${trendMetrics.periodComparison.recent.er.toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.recent.avgLikes}개)
  - 중간 10개: ${trendMetrics.periodComparison.middle.er.toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.middle.avgLikes}개)
  - 이전 10개: ${trendMetrics.periodComparison.oldest.er.toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.oldest.avgLikes}개)
- 평균 업로드 주기: ${trendMetrics.avgUploadFrequency}일
` : '';

  // 최적화된 프롬프트 (Data Only)
  return `## 투자심사 대상 인플루언서

**기본 정보:**
- Username: @${username}
- 이름: ${fullName || '미공개'}
- 바이오: ${biography || '없음'}
- 팔로워: ${followers.toLocaleString()}명
- 티어: ${metrics.tier}

**정량 분석 (시스템 계산):**
- Engagement Rate: ${metrics.engagementRate.toFixed(2)}%
- ER 등급: ${metrics.erGrade || '미산정'}
- 신뢰도 점수: ${metrics.authenticityScore}/100
- 가짜 의심: ${metrics.isFake ? '예 ⚠️' : '아니오'}
- 활동 상태: ${metrics.isActive ? '활성' : '비활성'}
- 업로드 주기: ${metrics.avgUploadCycle !== null ? metrics.avgUploadCycle + '일' : '측정 불가'}
- 시장 기준: ${metrics.marketSuitable ? '충족 ✓' : '미달 ✗'}
${trendText}
**캠페인 적합도 (시스템 계산):**
- 협찬: ${metrics.campaignSuitability.sponsorship.grade}급 (${metrics.campaignSuitability.sponsorship.score}점)
- 유료 광고: ${metrics.campaignSuitability.paidAd.grade}급 (${metrics.campaignSuitability.paidAd.score}점)
- 공동구매: ${metrics.campaignSuitability.coPurchase.grade}급 (${metrics.campaignSuitability.coPurchase.score}점)

**게시글 데이터 (최근 10개):**
${postsText}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { users, promptType = 'INSTA' } = body;

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 });
    }

    // Fetch analysis limit and system prompt from DB
    let analysisLimit = 10;
    let systemPrompt = BRUTAL_ANALYST_SYSTEM_PROMPT; // Default fallback
    
    // Validate promptType
    const validPromptType = (promptType === 'INSTA' || promptType === 'INSTA_TARGET') ? promptType : 'INSTA';

    try {
      // Parallel fetch for Settings and Prompt
      const [settingRes, promptRes] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'insta_analysis_limit').single(),
        supabase.from('prompts').select('content').eq('prompt_type', validPromptType).eq('is_default', true).single()
      ]);
      
      if (settingRes.data?.value) {
        analysisLimit = parseInt(settingRes.data.value, 10) || 10;
      }
      
      if (promptRes.data?.content) {
        systemPrompt = promptRes.data.content;
        console.log(`[DB Prompt] Using prompt from database for type: ${validPromptType}`);
        console.log(`[DB Prompt Preview] ${systemPrompt.substring(0, 100)}...`);
      } else {
        console.log(`[DB Prompt] No DB prompt found, using hardcoded fallback`);
      }
    } catch (e) {
      console.warn("Failed to fetch settings/prompt from DB, using defaults", e);
    }

    // Use imported schema for the analysis
    const analysisSchema = INSTAGRAM_ANALYSIS_SCHEMA;

    // Initialize Gemini Model with Strict Schema
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: analysisSchema as any, // Type cast to avoid strict typing issues with specific SDK versions
        temperature: 0.3
      }
    });

    // Process each user
    const analyzedResults = await Promise.all(
      users.map(async (user: any) => {
        const followers = user.followers_count || 0;

        // Pre-calculate metrics
        const tier = getAccountTier(followers);
        const erGrade = getAccountGrade(user);
        const engagementRate = calculateEngagementRate(user);
        const { authenticityScore, isFake } = calculateAuthenticity(user);
        const latestPostDate = getLatestPostDate(user);
        const isActive = isUserActive(latestPostDate);
        const avgUploadCycle = getAverageUploadCycle(user.recent_posts);
        const marketSuitable = isMarketSuitable(user, avgUploadCycle);
        const campaignSuitability = calculateCampaignSuitability(user);

        const preCalculatedMetrics = {
          tier,
          erGrade,
          engagementRate,
          authenticityScore,
          isFake,
          isActive,
          avgUploadCycle,
          marketSuitable,
          campaignSuitability
        };

        // Calculate trend metrics using up to 30 posts
        const allPosts = (user.recent_posts || []).slice(0, 30);
        const postsForTrend = allPosts.map((post: any) => ({
          likes: post.likes || 0,
          comments: post.comments || 0, // [FIX] Match field name from search/route.ts
          timestamp: post.timestamp || ''
        }));
        const trendMetrics = calculateERTrend(postsForTrend, followers);
        console.log(`[TrendMetrics] Result for ${user.username}:`, trendMetrics ? JSON.stringify(trendMetrics) : 'null');

        // Prepare posts data (최근 10개만 AI 분석용)
        const postsData = allPosts
          .slice(0, analysisLimit)
          .map((post: any) => {
            const fanComments = (post.latest_comments || [])
              .filter((c: any) => c.ownerUsername !== user.username)
              .slice(0, 20);

            return {
              caption: post.caption || '',
              hashtags: post.hashtags || [],
              comments: fanComments.map((c: any) => ({
                username: c.ownerUsername || 'unknown',
                text: c.text || '',
                likes: c.likes || 0
              }))
            };
          });

        // Build brutal prompt with trend data
        const userPrompt = buildBrutalUserPrompt({
          username: user.username || '',
          fullName: user.full_name || '',
          biography: user.biography || '',
          followers: followers,
          metrics: { ...preCalculatedMetrics, erGrade: preCalculatedMetrics.erGrade || '미산정' },
          trendMetrics: trendMetrics || undefined,
          postsData: postsData
        });

        // Prepare images
        const imageParts = [];
        for (const post of user.recent_posts.slice(0, analysisLimit)) {
          if (post.imageUrl) {
            try {
              const imageResp = await fetch(post.imageUrl, {
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                  "Referer": "https://www.instagram.com/"
                }
              });

              if (imageResp.ok) {
                const imageBuffer = await imageResp.arrayBuffer();
                imageParts.push({
                  inlineData: {
                    data: Buffer.from(imageBuffer).toString("base64"),
                    mimeType: "image/jpeg"
                  }
                });
              }
            } catch (e) {
              console.error(`Failed to fetch image for ${user.username}`, e);
            }
          }
        }

        try {
          // Call Gemini Vision with brutal system prompt
          const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
          const result = await model.generateContent([fullPrompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();

          // Parse JSON
          let cleanedText = text
            .replace(/^```json\s*/, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/, '');
          
          console.log("=== [DEBUG] RAW AI RESPONSE START ===");
          console.log(cleanedText);
          console.log("=== [DEBUG] RAW AI RESPONSE END ===");

          let analysis = JSON.parse(cleanedText);
          console.log("[DEBUG] Schema-Enforced Parsed Keys:", Object.keys(analysis));
          
          // No more normalization needed! The schema guarantees the structure.
          

          console.log(`[Brutal Analysis Success] ${user.username}`, {
            tier: analysis.investmentAnalyst?.tier,
            decision: analysis.investmentAnalyst?.decision,
            totalScore: analysis.investmentAnalyst?.totalScore,
            // botRatio removed as it's not consistently available in normalized schema
          });
          
          if (!analysis.investmentAnalyst) {
             console.log(`[Analysis Structure Mismatch] Full response for ${user.username}:`, JSON.stringify(analysis, null, 2));
          }

          return {
            username: user.username,
            analysis,
            trendMetrics: trendMetrics || undefined,
            success: true
          };

        } catch (error: any) {
          console.error(`Brutal analysis failed for ${user.username}`, error);
          
          const blockMsg = error.response?.promptFeedback?.blockReason;
          if (blockMsg) {
            console.error(`Blocked Reason: ${blockMsg}`);
          }

          return {
            username: user.username,
            success: false,
            error: error.message || "Unknown error"
          };
        }
      })
    );

    return NextResponse.json({ results: analyzedResults });

  } catch (error: any) {
    console.error("Brutal Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
