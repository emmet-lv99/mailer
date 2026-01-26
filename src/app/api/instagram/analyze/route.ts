import genAI from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import {
  calculateAuthenticity,
  calculateCampaignSuitability,
  calculateEngagementRate,
  getAccountAge,
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

// User Prompt Template
function buildBrutalUserPrompt(
  username: string,
  fullName: string,
  biography: string,
  followers: number,
  metrics: any,
  postsData: Array<any>
): string {
  const postsText = postsData.map((post, i) => {
    const commentsText = post.comments.slice(0, 20).map((c: any, j: number) => 
      `${j + 1}. @${c.username}: "${c.text}"${c.likes ? ` (${c.likes} 좋아요)` : ''}`
    ).join('\n');
    
    return `
---
**게시글 #${i + 1}**
- 캡션: ${post.caption || '(없음)'}
- 해시태그: ${post.hashtags?.join(', ') || '(없음)'}
- 댓글 수: ${post.comments.length}개

**댓글 샘플:**
${commentsText || '(댓글 없음)'}`;
  }).join('\n');

  return `다음 인플루언서를 투자심사하세요.

### 인플루언서 정보
- Username: @${username}
- 이름: ${fullName || '(없음)'}
- 바이오: ${biography || '(없음)'}
- 팔로워: ${followers.toLocaleString()}명
- 티어: ${metrics.tier}

### 시스템 사전 분석 결과 (참고용)

정량 지표:
- ER: ${metrics.engagementRate.toFixed(2)}% (등급: ${metrics.erGrade || '미산정'})
- 진정성: ${metrics.authenticityScore}/100 ${metrics.isFake ? '⚠️ 가짜 의심' : ''}
- 활동성: ${metrics.isActive ? '활성' : '비활성'} (업로드 주기: ${metrics.avgUploadCycle !== null ? metrics.avgUploadCycle + '일' : '측정불가'})
- 데이터 기간: ${metrics.age?.label || '미측정'} (수집된 최초 게시물 기준)
- 시장 기준: ${metrics.marketSuitable ? '충족' : '미달'}

캠페인 적합도:
- 협찬: ${metrics.campaignSuitability.sponsorship.grade}급 (${metrics.campaignSuitability.sponsorship.score}점)
- 광고: ${metrics.campaignSuitability.paidAd.grade}급 (${metrics.campaignSuitability.paidAd.score}점)
- 공구: ${metrics.campaignSuitability.coPurchase.grade}급 (${metrics.campaignSuitability.coPurchase.score}점)

### 분석 대상 게시글
${postsText}

### 이미지 분석 요청
제공된 이미지들을 보고 냉혹하게 평가:
1. 콘텐츠 품질 (0-100): 협찬비 받을 퀄리티?
2. PPL 스킬 (0-100): 제품 노출 능력?
3. 브랜드 안전 (0-100): 우리랑 엮어도 됨?
4. 일관성 (0-100): 전문가 vs 아마추어?

### 평가 요청
다음을 냉정하게 평가하고 JSON으로 응답:

1. **commentQuality**: 진성 vs 봇 비율
2. **engagementDepth**: 충성도, 대화형 비율
3. **brandFit**: 카테고리별 적합도
4. **conversionProbability**: 구매 전환 가능성
5. **imageAnalysis**: 이미지 품질 평가
6. **marketViability**: 시장 경쟁력
7. **investmentAssessment**: 투자 가치 판단

**출력 JSON 형식:**
{
  "is_target": boolean,
  "category": "Beauty/Fashion/Food/Lifestyle/Fitness/Other",
  "mood_keywords": ["키워드"],
  "originality_score": 1-10,
  "summary": "2-3문장 요약 (냉정하게)",
  
  "commentQuality": {
    "score": 0-100,
    "breakdown": {
      "genuineRatio": 0-100,
      "conversationalRatio": 0-100,
      "botSpamRatio": 0-100
    },
    "evidence": "평가 근거",
    "warnings": ["경고사항"]
  },
  
  "engagementDepth": {
    "score": 0-100,
    "breakdown": {
      "loyaltyScore": 0-100,
      "conversationScore": 0-100,
      "responseScore": 0-100
    },
    "evidence": "평가 근거",
    "insights": ["인사이트"]
  },
  
  "brandFit": {
    "score": 0-100,
    "categories": {
      "beauty": 0-100,
      "fashion": 0-100,
      "food": 0-100,
      "lifestyle": 0-100,
      "fitness": 0-100
    },
    "primaryCategory": "최고점 카테고리",
    "evidence": "평가 근거",
    "audienceProfile": "팔로워 성향"
  },
  
  "conversionProbability": {
    "score": 0-100,
    "breakdown": {
      "purchaseIntentRatio": 0-100,
      "infoRequestRatio": 0-100,
      "pastPurchaseRatio": 0-100
    },
    "evidence": "평가 근거",
    "keyPhrases": ["구매 키워드"]
  },
  
  "imageAnalysis": {
    "contentQuality": 0-100,
    "productPlacementSkill": 0-100,
    "brandSafety": 0-100,
    "styleConsistency": 0-100,
    "verdict": "전문가 | 준수 | 아마추어 | 부적합",
    "evidence": "평가 근거"
  },
  
  "marketViability": {
    "competitivenessScore": 0-100,
    "growthPotential": 0-100,
    "stabilityScore": 0-100,
    "professionalismScore": 0-100,
    "uniquenessScore": 0-100,
    "marketPosition": "상위 X% | 평균 | 하위 X%",
    "evidence": "시장성 평가"
  },
  
  "investmentAssessment": {
    "tier": "S | A | B | C | D",
    "totalScore": 0-100,
    "decision": "즉시 투자 | 조건부 투자 | 투자 보류 | 투자 금지",
    "estimatedValue": "₩ 적정 협찬비",
    "expectedROI": "X%",
    "expectedRevenue": "₩ 예상 매출",
    "riskLevel": "low | medium | high | critical",
    "dealBreakers": ["투자 금지 사유"],
    "greenFlags": ["투자 가능 근거"],
    "redFlags": ["경고 사항"],
    "investmentRationale": "투자 결정 근거 (냉정하고 신랄하게 3-4문장)",
    "brutalVerdict": "최종 판결 (아주 냉혹하게 2-3문장)"
  },
  
  "overallInsights": {
    "strengths": ["강점 (있다면)"],
    "weaknesses": ["약점 (신랄하게)"],
    "recommendation": "최종 추천 (냉정하게)"
  }
}`;
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
      } else {
        console.log(`[DB Prompt] No DB prompt found, using hardcoded fallback`);
      }
    } catch (e) {
      console.warn("Failed to fetch settings/prompt from DB, using defaults", e);
    }

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
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
          campaignSuitability,
          age: getAccountAge(user)
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
        const userPrompt = buildBrutalUserPrompt(
          user.username || '',
          user.full_name || '',
          user.biography || '',
          followers,
          preCalculatedMetrics,
          postsData
        );

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
          
          const analysis = JSON.parse(cleanedText);

          console.log(`[Brutal Analysis Success] ${user.username}`, {
            tier: analysis.investmentAssessment?.tier,
            decision: analysis.investmentAssessment?.decision,
            totalScore: analysis.investmentAssessment?.totalScore,
            botRatio: analysis.commentQuality?.breakdown?.botSpamRatio
          });

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
