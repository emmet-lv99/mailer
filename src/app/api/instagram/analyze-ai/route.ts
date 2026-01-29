
import { BrutalUserPromptParams, RawAnalysisResult } from "@/app/instagram/types";
import genAI from "@/lib/gemini";
import { BRUTAL_ANALYST_SYSTEM_PROMPT } from "@/lib/prompts/brutal-analyst";
import { INSTAGRAM_ANALYSIS_SCHEMA } from "@/lib/schemas/analysis";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Re-using local prompt builder (or could export it)
// Ideally this should be shared, but copying for safety and speed as prompted by refactor plan.

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
- 구간별 ER:
  - 최근 10개: ${(trendMetrics.periodComparison.recent.er || 0).toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.recent.avgLikes}개)
  - 중간 10개: ${(trendMetrics.periodComparison.middle.er || 0).toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.middle.avgLikes}개)
  - 이전 10개: ${(trendMetrics.periodComparison.oldest.er || 0).toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.oldest.avgLikes}개)
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
- Engagement Rate: ${(metrics.engagementRate || 0).toFixed(2)}%
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
    const { rawData, promptType = 'INSTA' } = body; // rawData is array of RawAnalysisResult

    if (!rawData || !Array.isArray(rawData)) {
      return NextResponse.json({ error: "Invalid raw data" }, { status: 400 });
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
      }
    } catch (e) {
      console.warn("Failed to fetch settings/prompt from DB, using defaults", e);
    }

    const analysisSchema = INSTAGRAM_ANALYSIS_SCHEMA;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: analysisSchema as any,
        temperature: 0.3
      }
    });

    const analyzedResults = await Promise.all(
      rawData.map(async (raw: RawAnalysisResult) => {
        if (!raw.success || !raw.verifiedProfile || !raw.metrics) {
            return {
                username: raw.username,
                success: false,
                error: "Missing required raw data for verification"
            };
        }

        const user = raw.verifiedProfile;
        const posts = raw.recent_posts || [];

        // Prepare posts data (slice for AI context)
        const postsData = posts
          .slice(0, analysisLimit)
          .map((post: any) => {
             // Adapt field names if necessary. Assuming fetch-raw normalized them.
             // fetch-raw puts: likes, comments (number), timestamp.
             // But prompt needs comments text.
             // Oh, fetch-raw might have stripped comments text if I wasn't careful.
             // Checking fetch-raw code: I passed fetchedPosts = postItems directly.
             // Apify postItems often contain `latestComments` or similar.
             // I need to ensure fetch-raw preserves comment text access.
             
             // Re-checking fetch-raw... I mapped `fetchedPosts = postItems.map...`
             // and returned `recent_posts: fetchedPosts`.
             // I verified `latest_comments` is crucial. 
             // In fetch-raw, I did `...p`. So raw Apify fields should be there.
             // Apify fields: `latestComments` usually.
             
            const fanComments = (post.latestComments || post.latest_comments || [])
              .filter((c: any) => c.ownerUsername !== user.username)
              .slice(0, 20);

            return {
              caption: post.caption || '',
              hashtags: post.hashtags || [],
              comments: fanComments.map((c: any) => ({
                username: c.ownerUsername || 'unknown',
                text: c.text || '',
                likes: c.likesCount || c.likes || 0
              }))
            };
          });

        const userPrompt = buildBrutalUserPrompt({
          username: user.username,
          fullName: user.fullName || '',
          biography: user.biography || '',
          followers: user.followers,
          metrics: { 
              ...raw.metrics, 
              erGrade: raw.metrics.erGrade || '미산정',
              // Fix potential type mismatch for avgUploadCycle (number | null -> number w/ fallback handled in string)
           } as any, 
          trendMetrics: raw.trendMetrics || undefined,
          postsData: postsData
        });

        // Prepare images
        // We need to fetch images again here? Or did we pass base64? Passing base64 is heavy.
        // Better to fetch here by URL.
        const imageParts = [];
        for (const post of posts.slice(0, analysisLimit)) {
             // Use displayUrl or imageUrl
             const imgUrl = post.displayUrl || post.imageUrl || post.display_url;
             if (imgUrl) {
                try {
                  const imageResp = await fetch(imgUrl, {
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
                  console.error(`Failed to fetch image for ${user.username} in AI stage`, e);
                }
             }
        }

        try {
          const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
          const result = await model.generateContent([fullPrompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();

          let cleanedText = text
            .replace(/^```json\s*/, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/, '');
          
          let analysis = JSON.parse(cleanedText);
          
          // Re-enforce Source of Truth logic just in case AI overwrites basicStats
          if (!analysis.basicStats) analysis.basicStats = {};
          analysis.basicStats.username = user.username;
          analysis.basicStats.followers = user.followers;
          analysis.basicStats.profilePicUrl = user.profilePicUrl || null;

          return {
            username: user.username,
            analysis, // The qualitative analysis
            verifiedProfile: user, // Pass it back for consistency context
            trendMetrics: raw.trendMetrics,
            success: true
          };

        } catch (error: any) {
          console.error(`AI Analysis failed for ${user.username}`, error);
          return {
            username: user.username,
            success: false,
            error: error.message
          };
        }
      })
    );

    return NextResponse.json({ results: analyzedResults });

  } catch (error: any) {
    console.error("AI Analysis Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
