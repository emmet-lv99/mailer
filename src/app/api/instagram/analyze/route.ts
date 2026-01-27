import genAI from "@/lib/gemini";
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

// Brutal Investment Analyst System Prompt v4.0
const BRUTAL_ANALYST_SYSTEM_PROMPT = `당신은 인플루언서 협찬 투자심사역(Investment Analyst)입니다.

### 당신의 정체성
- 직책: 광고 예산 배정 책임자
- 성향: 냉소적, 회의적, 수치 집착형
- 목표: 예산 낭비 방지, ROI 극대화
- 원칙: 불확실하면 투자하지 않는다

### 핵심 임무
광고주의 협찬 예산(한정된 자원)을 투자할 가치가 있는 인플루언서를 선별합니다.
당신의 한 마디가 수백만원의 예산 배정을 좌우합니다.

### 평가 철학: 냉혹한 현실주의

**인플루언서는 홍보 상품이다:**
- 광고 노출을 판매하는 상품
- 품질이 떨어지면 폐기 대상
- 가격 대비 성능으로만 평가
- 감정적 동정 일체 불허

**협찬은 투자다:**
- 100만원 협찬 = 150만원 매출 기대
- ROI 50% 미만 = 투자 실패
- 회수 불가능하면 투자 금지
- 리스크는 제로 톨러런스

**팔로워는 잠재 소비자다:**
- 구매하지 않으면 무가치
- "좋아요"는 매출이 아니다
- 댓글 많아도 지갑 안 열면 0원
- 가짜 팔로워 = 사기

### 투자 금지 사유 (즉시 탈락)

1. **가짜 팔로워**: 봇 30% 이상
2. **구매 전환 0**: 구매 의향 키워드 전무
3. **브랜드 리스크**: 부적절한 콘텐츠
4. **카테고리 불일치**: 적합도 50% 미만
5. **비활성**: 티어별 기준 초과

### 투자 등급

**S급 (95-100점): 즉시 투자**
- 구매 키워드 40%+
- 봇 5% 미만
- 브랜드 적합도 95%+
- 판단: "협찬비의 3배는 뽑아낸다"

**A급 (85-94점): 강력 추천**
- 구매 키워드 30-40%
- 봇 5-10%
- 판단: "ROI 150% 이상 기대"

**B급 (70-84점): 조건부 투자**
- 구매 키워드 20-30%
- 봇 10-15%
- 판단: "낮은 단가로만 고려"

**C급 (50-69점): 투자 보류**
- 구매 키워드 10-20%
- 판단: "더 나은 대안 찾기"

**D급 (0-49점): 투자 금지**
- 구매 키워드 10% 미만 또는 봇 25%+
- 판단: "예산 낭비, 논의 불필요"

### 이미지 분석 (냉혹하게)

1. **콘텐츠 품질**: 협찬비 받을 자격 있나?
2. **PPL 스킬**: 제품 노출 능력 있나?
3. **브랜드 안전**: 우리랑 엮어도 되나?
4. **일관성**: 전문가인가 아마추어인가?

### 평가 원칙

1. 팔로워 수는 허상, 오직 구매 전환만 진실
2. "예쁘다"는 매출이 아니다
3. 봇 30% = 사기꾼
4. 불확실하면 투자하지 않는다
5. 감정 배제, 숫자만 본다
6. 긍정적 평가 불필요, 사실만
7. 약점은 신랄하게, 강점은 냉정하게
8. 가격 대비 성능으로만 판단
9. 더 나은 대안 있으면 Pass
10. 의심되면 탈락

### 출력 형식
반드시 JSON 형식. 모든 평가는 냉혹하고 신랄하게. 긍정적 수사 배제, 사실과 숫자로만 말하기.`;

// ------------------------------------------------------------------
// 4. Utility Functions (Prompt Builders)
// ------------------------------------------------------------------

// Optimized Brutal User Prompt - Perfect Match with Few-Shot Examples

interface BrutalUserPromptParams {
  username: string;
  fullName: string;
  biography: string;
  followers: number;
  metrics: {
    tier: string;
    engagementRate: number;
    erGrade: string;
    authenticityScore: number;
    isFake: boolean;
    isActive: boolean;
    avgUploadCycle: number | null;
    marketSuitable: boolean;
    campaignSuitability: {
      sponsorship: { grade: string; score: number };
      paidAd: { grade: string; score: number };
      coPurchase: { grade: string; score: number };
    };
  };
  postsData: Array<{
    caption: string;
    hashtags: string[];
    comments: Array<{
      username: string;
      text: string;
      likes?: number;
    }>;
  }>;
}

function buildBrutalUserPrompt(params: BrutalUserPromptParams): string {
  const { username, fullName, biography, followers, metrics, postsData } = params;
  
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

**캠페인 적합도 (시스템 계산):**
- 협찬: ${metrics.campaignSuitability.sponsorship.grade}급 (${metrics.campaignSuitability.sponsorship.score}점)
- 유료 광고: ${metrics.campaignSuitability.paidAd.grade}급 (${metrics.campaignSuitability.paidAd.score}점)
- 공동구매: ${metrics.campaignSuitability.coPurchase.grade}급 (${metrics.campaignSuitability.coPurchase.score}점)

**게시글 데이터:**
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

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.3  // Lower temperature for consistent harsh evaluation
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

        // Prepare posts data
        const postsData = (user.recent_posts || [])
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

        // Build brutal prompt
        const userPrompt = buildBrutalUserPrompt({
          username: user.username || '',
          fullName: user.full_name || '',
          biography: user.biography || '',
          followers: followers,
          metrics: { ...preCalculatedMetrics, erGrade: preCalculatedMetrics.erGrade || '미산정' },
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
          
          let analysis = JSON.parse(cleanedText);

          // --- Schema Normalization (Korean -> Standard) ---
          // 1. Check for Standard Schema first
          if (!analysis.investmentAnalyst && !analysis.investmentAssessment) {
            
            // 2. Find the "Core Analysis Object"
            // The AI sometimes returns { "심사 결과": ... } or { "GenericUser 투자 심사": ... }
            // LOGS SHOW: "인플루언서_협찬_투자_심사_결과" is also used.
            let raw: any = analysis["심사 결과"] || analysis["투자 심사 결과"] || analysis["인플루언서_협찬_투자_심사_결과"];

            // If not found by known keys, search for an object containing signature keys (Space or Underscore vars)
            if (!raw) {
              const potentialRoot = Object.values(analysis).find((val: any) => 
                val && typeof val === 'object' && (
                  // Space versions
                  val["채널 분석"] || val["채널 일관성 분석"] || 
                  val["종합 평가"] || val["투자 종합 평가"] ||
                  val["이미지 분석"] || val["등급"] || val["티어"] ||
                  // Underscore versions
                  val["채널_분석"] || val["채널_일관성_분석"] ||
                  val["종합_평가"] || val["투자_종합_평가"] ||
                  val["정량_분석"]
                )
              );
              if (potentialRoot) raw = potentialRoot;
            }

            if (raw) {
                // Handle "종합 평가" being a string or object
                let evaluation = raw["종합 평가"] || raw["투자 종합 평가"] || raw["종합_평가"] || raw["투자_종합_평가"] || {};
                if (typeof evaluation === "string") {
                    // If string, we can't extract nested fields from it. 
                    // We must rely on raw for everything else, or create a dummy object.
                    evaluation = { "종합 의견": evaluation };
                }

                const consistency = raw["채널 분석"] || raw["채널 일관성 분석"] || raw["채널_분석"] || raw["채널_일관성_분석"] || {};
                const imageAnalysis = raw["이미지 분석"] || raw["이미지_분석"] || {};
                const quantitative = raw["정량 분석"] || raw["정량_분석"] || {};
                const campaign = raw["캠페인 적합도"] || raw["투자 제안"] || raw["캠페인_적합도"] || raw["투자_제안"] || {}; 
                const info = raw["인플루언서 정보"] || raw["인플루언서_정보"] || {}; 

                // Helper to extract number from string like "B급 (75점)" or "77%"
                const parseScore = (val: any) => {
                  if (typeof val === 'number') return val;
                  if (typeof val === 'string') {
                     const match = val.match(/(\d+)점?/);
                     if (match) return parseInt(match[1]);
                     const matchPercent = val.match(/(\d+)%/);
                     if (matchPercent) return parseInt(matchPercent[1]);
                  }
                  return 0;
                };

                // Fallback Score Calculation
                let finalScore = parseScore(evaluation["총점"] || raw["종합 점수"] || raw["총점"] || evaluation["투자_등급"]);
                if (finalScore === 0) {
                   // If AI didn't give a score, average the system-calculated campaign scores
                   const sMetrics = preCalculatedMetrics.campaignSuitability;
                   const avgScore = (sMetrics.sponsorship.score + sMetrics.paidAd.score + sMetrics.coPurchase.score) / 3;
                   finalScore = Math.round(avgScore);
                }

                analysis = {
                  investmentAnalyst: {
                    tier: raw["티어"] || raw["등급"] || evaluation["티어"] || evaluation["등급"] || info["티어"] || "Unknown",
                    totalScore: finalScore,
                    decision: raw["최종 투자 등급"] || raw["등급"] || evaluation["등급"] || evaluation["투자_등급"] || evaluation["투자_판단"] || "판단 유보",
                    estimatedValue: "산정 불가",
                    expectedROI: "산정 불가",
                    currentAssessment: {
                      strengths: (evaluation["강점"] || raw["강점"] || []).toString().split(/,\s*/).filter((s:string) => s && s !== 'undefined'),
                      weaknesses: (evaluation["약점"] || raw["약점"] || []).toString().split(/,\s*/).filter((s:string) => s && s !== 'undefined'),
                      risks: [], 
                      brutalVerdict: evaluation["결론"] || evaluation["종합 의견"] || evaluation["총평"] || raw["결론"] || raw["종합 의견"] || "의견 없음"
                    }
                  },
                  influencerExpert: {
                    grade: quantitative["Engagement Rate"]?.includes("등급") ? quantitative["Engagement Rate"] : "참여율 미달",
                    totalScore: finalScore, 
                    recommendation: consistency["종합"] || consistency["평가"] || "컨설팅 필요",
                    estimatedValueIn6Months: "데이터 부족",
                    growthAnalysis: {
                      followerGrowthRate: quantitative["활동 상태"] || "분석 불가",
                      engagementTrend: quantitative["Engagement Rate"] || "분석 불가",
                      contentVirality: consistency["업로드 패턴"] || "분석 불가"
                    },
                    futureAssessment: {
                      growthTrajectory: "현 상태 유지 또는 완만한 성장 예상",
                      hiddenStrengths: [consistency["주제 일관성"], consistency["톤앤매너 일관성"]].filter(Boolean),
                      potentialRisks: [imageAnalysis["브랜드 안전"], "낮은 댓글 수"].filter(Boolean),
                      strategicAdvice: [
                         imageAnalysis["콘텐츠 품질"], 
                         imageAnalysis["PPL 스킬"],
                         `협찬 적합도: ${JSON.stringify(campaign["협찬"] || '미정')}`,
                         `공동구매 적합도: ${JSON.stringify(campaign["공동구매"] || '미정')}`
                      ].filter((s:any) => s && typeof s === 'string'),
                      expertVerdict: imageAnalysis["콘텐츠 품질"] || consistency["종합"] || "전문가 의견입니다."
                    }
                  },
                  comparisonSummary: {
                    agreement: true,
                    keyDifference: "단일 분석 결과입니다.",
                    recommendation: raw["최종 투자 등급"] || raw["등급"] || evaluation["등급"] || "신중한 검토 필요"
                  }
                };
            } else {
               console.log(`[Schema Normalization Failed] Could not find root object. Keys: ${Object.keys(analysis).join(", ")}`);
            }
          }
          // --- End Schema Normalization ---

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
