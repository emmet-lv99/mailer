import { TrendMetrics } from "@/app/instagram/types";
import { InstagramUser } from "./types";

// Define Post type from InstagramUser
type InstagramPost = InstagramUser['recent_posts'][number];

export const getLatestPostDate = (user: InstagramUser) => {
    if (!user.recent_posts || user.recent_posts.length === 0) return null;
    const sorted = [...user.recent_posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return new Date(sorted[0].timestamp);
};

export const getAverageUploadCycle = (posts: InstagramPost[]) => {
    if (!posts || posts.length < 2) return null;
    const sorted = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    let totalDiff = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
        const diff = new Date(sorted[i].timestamp).getTime() - new Date(sorted[i+1].timestamp).getTime();
        totalDiff += diff;
    }
    const avgMs = totalDiff / (sorted.length - 1);
    return Math.round(avgMs / (1000 * 60 * 60 * 24));
};

export const getCommunicationStats = (user: InstagramUser) => {
  let totalFetchedComments = 0;
  let myReplies = 0;
  
  user.recent_posts.forEach(post => {
      if (post.latest_comments) {
          totalFetchedComments += post.latest_comments.length;
          post.latest_comments.forEach(c => {
               if (c.ownerUsername === user.username) {
                   myReplies++;
               }
          });
      }
  });

  if (totalFetchedComments === 0) return null;

  const fanComments = totalFetchedComments - myReplies;
  const replyRate = fanComments > 0 ? Math.round((myReplies / fanComments) * 100) : 0;
  
  return {
      replyRate,
      sampleSize: totalFetchedComments
  };
};

export const isUserActive = (latestDate: Date | null) => {
    if (!latestDate) return false;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return latestDate >= oneMonthAgo;
};

export const getProxiedUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("/")) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

export const formatNumber = (num: number) => {
    if (num === -1) return '?';
    return num.toLocaleString();
};

// --- Account Grading & Suitability Logic ---

// Helper to get detailed metrics for Authenticity calculation
export const getEngagementMetrics = (user: InstagramUser) => {
    if (user.followers_count <= 0 || !user.recent_posts || user.recent_posts.length === 0) {
        return { feedER: 0, reelsER: 0, totalER: 0, avgCommentsPerPost: 0, avgReelsViews: 0 };
    }

    const reelsPosts = user.recent_posts.filter(p => p.productType === 'clips');
    const feedPosts = user.recent_posts.filter(p => p.productType !== 'clips');

    // 1. Feed Metrics
    let feedER = 0;
    let avgCommentsPerPost = 0;
    if (feedPosts.length > 0) {
        const totalComments = feedPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
        const totalLikes = feedPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
        
        avgCommentsPerPost = totalComments / feedPosts.length;
        const avgLikes = totalLikes / feedPosts.length;
        
        feedER = ((avgLikes + avgCommentsPerPost) / user.followers_count) * 100;
    }

    // 2. Reels Metrics
    let reelsER = 0;
    let avgReelsViews = 0;
    if (reelsPosts.length > 0) {
        const totalViews = reelsPosts.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalLikes = reelsPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
        const totalComments = reelsPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
        
        avgReelsViews = totalViews / reelsPosts.length;
        const avgReelsLikes = totalLikes / reelsPosts.length;
        const avgReelsComments = totalComments / reelsPosts.length;
        
        reelsER = ((avgReelsLikes + avgReelsComments) / user.followers_count) * 100;
    }

    // 3. Combined ER
    let totalER = 0;
    if (feedPosts.length > 0 && reelsPosts.length > 0) {
        totalER = (feedER * 0.6) + (reelsER * 0.4);
    } else if (feedPosts.length > 0) {
        totalER = feedER;
    } else if (reelsPosts.length > 0) {
        totalER = reelsER;
    }

    return { feedER, reelsER, totalER, avgCommentsPerPost, avgReelsViews };
};

// Based on user provided logic
export const calculateEngagementRate = (user: InstagramUser) => {
    return getEngagementMetrics(user).totalER;
};

// --- Authenticity Analysis ---

// Exported Criteria for UI
export const GRADING_CRITERIA: Record<string, { S: number, A: number, B: number, C: number, D: number }> = {
    'Nano':  { S: 10,  A: 8,   B: 5,   C: 3,   D: 0 },
    'Micro': { S: 7,   A: 5,   B: 3,   C: 1,   D: 0 },
    'Mid':   { S: 5,   A: 3,   B: 2,   C: 1,   D: 0 },
    'Macro': { S: 3,   A: 2,   B: 1.5, C: 1,   D: 0 },
    'Mega':  { S: 2,   A: 1.5, B: 1,   C: 0.8, D: 0 }
};

export const AUTHENTICITY_CRITERIA: Record<string, { 
    comment: { excellent: number, good: number, normal: number }, 
    view: { excellent: number, good: number, normal: number },
    fakeThreshold: number 
}> = {
    'Nano':  { comment: { excellent: 1.5, good: 0.8, normal: 0.3 }, view: { excellent: 4.0, good: 2.0, normal: 1.0 }, fakeThreshold: 0.3 },
    'Micro': { comment: { excellent: 1.0, good: 0.5, normal: 0.2 }, view: { excellent: 3.5, good: 1.5, normal: 0.8 }, fakeThreshold: 0.2 },
    'Mid':   { comment: { excellent: 0.7, good: 0.3, normal: 0.1 }, view: { excellent: 3.0, good: 1.0, normal: 0.5 }, fakeThreshold: 0.1 },
    'Macro': { comment: { excellent: 0.4, good: 0.15, normal: 0.05 }, view: { excellent: 2.5, good: 0.8, normal: 0.4 }, fakeThreshold: 0.05 },
    'Mega':  { comment: { excellent: 0.3, good: 0.1, normal: 0.03 }, view: { excellent: 2.0, good: 0.5, normal: 0.3 }, fakeThreshold: 0.03 }
};

// Authenticity Result Interface
export interface AuthenticityResult {
  authenticityScore: number;  // 0-100
  isFake: boolean;
  reason: string;
  measuredMetrics: string[];
  details: {
    commentScore: number | null;
    viewScore: number | null;
    consistencyScore: number | null;
    commentRatioVal: number;
    viewRatioVal: number;
    consistencyRatio: number | null;
  };
}

export const calculateAuthenticity = (user: InstagramUser): AuthenticityResult => {
    const tier = getAccountTier(user.followers_count);
    // const criteria = AUTHENTICITY_CRITERIA[tier] || AUTHENTICITY_CRITERIA['Nano'];
    
    const feedPosts = (user.recent_posts || []).filter((p) => p.productType !== 'clips');
    const reelsPosts = (user.recent_posts || []).filter((p) => p.productType === 'clips');
    
    const hasFeed = feedPosts.length > 0;
    const hasReels = reelsPosts.length > 0;
    
    const { feedER, reelsER } = getEngagementMetrics(user);
    
    // 1. Comment Ratio (Feed 기준)
    let commentScore = 0;
    let commentRatioVal = 0;
    if (hasFeed) {
        const totalComments = feedPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
        const totalLikes = feedPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
        commentRatioVal = totalLikes > 0 ? totalComments / totalLikes : 0;
        
        if (commentRatioVal >= 0.05) commentScore = 20;
        else if (commentRatioVal >= 0.03) commentScore = 15;
        else if (commentRatioVal >= 0.01) commentScore = 10;
        else commentScore = 0;
    }
    
    let authenticityScore = 0;
    let viewScore: number | null = null;
    let consistencyScore: number | null = null;
    let viewRatioVal = 0;
    let consistencyRatio: number | null = null;
    let reason = '';
    const measuredMetrics: string[] = ['Comment Ratio'];

    if (!hasReels) {
        // [CASE 1] 릴스 없음: Comment만 100% 가중
        authenticityScore = Math.round((commentScore / 20) * 100);
        reason = '피드만 분석 (릴스 없음)';
    } else {
        // [CASE 2] 릴스 있음: 모두 측정 (Feed + Reels)
        measuredMetrics.push('View Ratio');
        measuredMetrics.push('Consistency');
        
        // 2. View Ratio (Reels 기준)
        const totalViews = reelsPosts.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalLikes = reelsPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
        viewRatioVal = totalViews > 0 ? totalLikes / totalViews : 0;
        
        if (viewRatioVal >= 0.03) viewScore = 20;
        else if (viewRatioVal >= 0.02) viewScore = 15;
        else if (viewRatioVal >= 0.01) viewScore = 10;
        else viewScore = 0;

        // 3. Consistency
        if (feedER > 0 && reelsER > 0) {
            const diff = Math.abs(feedER - reelsER);
            const maxER = Math.max(feedER, reelsER);
            consistencyRatio = diff / maxER;
            
            if (consistencyRatio <= 0.3) consistencyScore = 20;
            else if (consistencyRatio <= 0.7) consistencyScore = 10;
            else consistencyScore = 0;
        } else {
            consistencyScore = 0;
        }

        authenticityScore = Math.round(((commentScore + (viewScore ?? 0) + (consistencyScore ?? 0)) / 60) * 100);
        reason = '완전 분석 (피드+릴스)';
    }
    
    const isFake = authenticityScore < 40;

    return { 
        authenticityScore, 
        isFake,
        reason,
        measuredMetrics,
        details: {
            commentScore,
            viewScore,
            consistencyScore,
            commentRatioVal,
            viewRatioVal,
            consistencyRatio
        }
    };
};

export const getAccountTier = (followers: number) => {
    if (followers < 10000) return 'Nano';
    if (followers < 100000) return 'Micro';
    if (followers < 500000) return 'Mid';
    if (followers < 1000000) return 'Macro';
    return 'Mega';
};

export const getAccountGrade = (user: InstagramUser): string | null => {
    if (user.followers_count <= 0) return null;
    
    const er = calculateEngagementRate(user);
    const tier = getAccountTier(user.followers_count);
    const criteria = GRADING_CRITERIA[tier];

    if (!criteria) return null;

    if (er >= criteria.S) return 'S';
    if (er >= criteria.A) return 'A';
    if (er >= criteria.B) return 'B';
    if (er >= criteria.C) return 'C';
    return 'D';
};

// Returns TRUE = Suitable / FALSE = Market Standard Under
export const isMarketSuitable = (user: InstagramUser, avgInterval: number | null): boolean => {
    // 1. Basic Qualification: Followers >= 1000
    if (user.followers_count < 1000) return false;

    // 2. Activity Check: Latest post within 7 days
    const latestDate = getLatestPostDate(user);
    if (!latestDate) return false;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (latestDate < sevenDaysAgo) return false;

    // 3. Interval Consistency Check (by Tier)
    if (avgInterval === null) return false;

    // Nano (1K-10K) -> < 10000
    if (user.followers_count < 10000) {
        return avgInterval <= 3;  // 3일 이내
    }
  
    // Micro (10K-100K)
    if (user.followers_count < 100000) {
        return avgInterval <= 5;  // 5일 이내
    }
  
    // Mid (100K-500K)
    if (user.followers_count < 500000) {
        return avgInterval <= 7;  // 7일 이내
    }
  
    // Macro (500K-1M)
    if (user.followers_count < 1000000) {
        return avgInterval <= 10;  // 10일 이내
    }
  
    // Mega (1M+)
    return avgInterval <= 14;  // 14일 이내
};

/**
 * 계정 나이 분석 (수집된 게시물 중 가장 오래된 날짜 기준)
 */
export const getAccountAge = (user: InstagramUser) => {
    if (!user.recent_posts || user.recent_posts.length === 0) {
        return { days: 0, months: 0, label: '데이터 없음', oldestDate: null };
    }

    const timestamps = user.recent_posts.map(p => new Date(p.timestamp).getTime());
    const oldestTimestamp = Math.min(...timestamps);
    const oldestDate = new Date(oldestTimestamp);
    
    const diffMs = Date.now() - oldestTimestamp;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);

    let label = `${days}일 전`;
    if (months >= 12) {
        label = `${Math.floor(months / 12)}년 ${months % 12}개월 전`;
    } else if (months >= 1) {
        label = `${months}개월 전`;
    }

    return {
        days,
        months,
        label,
        oldestDate
    };
};

// --- Campaign Suitability Logic ---

// 1. Normalized ER Score (0-100)
export const getNormalizedERScore = (user: InstagramUser): number => {
    const er = calculateEngagementRate(user);
    const tier = getAccountTier(user.followers_count);
    const criteria = GRADING_CRITERIA[tier];

    if (!criteria) return 0;

    if (er >= criteria.S) return 100;     // S급: 100점
    if (er >= criteria.A) return 85;      // A급: 85점 (Mid point of 80-90)
    if (er >= criteria.B) return 70;      // B급: 70점 (Mid point of 60-80)
    if (er >= criteria.C) return 50;      // C급: 50점 (Mid point of 40-60)
    return 30;                            // D급: 30점
};

// 2. Normalized Follower Score (0-100) - For Paid Ads (favors larger accounts)
export const getNormalizedFollowerScore = (user: InstagramUser): number => {
    const tier = getAccountTier(user.followers_count);
    switch (tier) {
        case 'Mega': return 100;
        case 'Macro': return 90;
        case 'Mid': return 80;
        case 'Micro': return 60;
        case 'Nano': return 40;
        default: return 20;
    }
};

// 3. Normalized Activity Score (0-100)
export const getNormalizedActivityScore = (user: InstagramUser): number => {
    const avgCycle = getAverageUploadCycle(user.recent_posts);
    if (avgCycle === null) return 0; // 데이터 부족

    if (avgCycle <= 3) return 100;
    if (avgCycle <= 7) return 80;
    if (avgCycle <= 14) return 50;
    return 20;
};

// 4. Normalized Component Scores (Comment/View) from Authenticity (scaled to 100)
// Authenticity internal max scores are now: Comment=20, View=20. We need 0-100.
export const getNormalizedAuthComponents = (user: InstagramUser) => {
    const result = calculateAuthenticity(user);
    const { details } = result;
    // Comment Score: max 20 -> 100 (multiply by 5)
    // View Score: max 20 -> 100 (multiply by 5)
    return {
        commentScoreNorm: (details.commentScore ?? 0) * 5,
        viewScoreNorm: (details.viewScore ?? 0) * 5,
        authenticityScore: result.authenticityScore // Already normalized to 0-100
    };
};

export type CampaignType = 'sponsorship' | 'paidAd' | 'coPurchase';

export interface CampaignResult {
    score: number;
    grade: string;
    passed: boolean;
}

export const checkCampaignPassed = (campaign: CampaignType, score: number): boolean => {
    const minScores = {
        'sponsorship': 60,
        'paidAd': 65,
        'coPurchase': 70
    };
    return score >= minScores[campaign];
};

export const getCampaignGrade = (score: number): string => {
    if (score >= 90) return 'S';
    if (score >= 75) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
};

export const calculateCampaignSuitability = (user: InstagramUser) => {
    const erScore = getNormalizedERScore(user);
    const followerScore = getNormalizedFollowerScore(user);
    const activityScore = getNormalizedActivityScore(user);
    const { commentScoreNorm, viewScoreNorm, authenticityScore } = getNormalizedAuthComponents(user);

    // 1. Sponsorship (협찬)
    // ER 35%, Comment 30%, Auth 20%, Activity 15%
    const sponsorshipScore = Math.round(
        (erScore * 0.35) + 
        (commentScoreNorm * 0.30) + 
        (authenticityScore * 0.20) + 
        (activityScore * 0.15)
    );

    // 2. Paid Ad (유료광고)
    // View 35%, Follower 30%, ER 20%, Auth 15%
    const paidAdScore = Math.round(
        (viewScoreNorm * 0.35) + 
        (followerScore * 0.30) + 
        (erScore * 0.20) + 
        (authenticityScore * 0.15)
    );

    // 3. Co-Purchase (공동구매)
    // Comment 35%, Auth 30%, ER 20%, Activity 15%
    const coPurchaseScore = Math.round(
        (commentScoreNorm * 0.35) + 
        (authenticityScore * 0.30) + 
        (erScore * 0.20) + 
        (activityScore * 0.15)
    );

    return {
        sponsorship: {
            score: sponsorshipScore,
            grade: getCampaignGrade(sponsorshipScore),
            passed: checkCampaignPassed('sponsorship', sponsorshipScore)
        },
        paidAd: {
            score: paidAdScore,
            grade: getCampaignGrade(paidAdScore),
            passed: checkCampaignPassed('paidAd', paidAdScore)
        },
        coPurchase: {
            score: coPurchaseScore,
            grade: getCampaignGrade(coPurchaseScore),
            passed: checkCampaignPassed('coPurchase', coPurchaseScore)
        }
    };
};

// --- Shared Analysis Logic (Ported from Agent/API) ---

export const detectBotRatio = (comments: string[]): number => {
  if (!comments || comments.length === 0) return 0;

  const botPatterns = [
    /^(nice|great|cool|amazing|wonderful)!*$/i,
    /^[😍❤️🔥👍👏]+$/,
    /follow.*back/i,
    /check.*out.*profile/i,
    /^.{1,3}$/ // Too short
  ];

  let botCount = 0;
  for (const text of comments) {
    if (botPatterns.some(pattern => pattern.test(text || ""))) {
      botCount++;
    }
  }

  return parseFloat(((botCount / comments.length) * 100).toFixed(2));
};

export const analyzePurchaseKeywords = (comments: string[]): number => {
   if (!comments || comments.length === 0) return 0;

   const purchaseKeywords = [
    '어디서', '사요', '구매', '링크', '정보', '가격',
    '얼마', '어디꺼', '사고싶', '주문', '샀어요',
    '배송', '택배', '쿠폰', '할인'
  ];

  let matchCount = 0;
  for (const text of comments) {
    const lowerText = (text || "").toLowerCase();
    if (purchaseKeywords.some(keyword => lowerText.includes(keyword))) {
      matchCount++;
    }
  }

  return parseFloat(((matchCount / comments.length) * 100).toFixed(2));
};



// Unified Trend Calculation (Originally from fetch-raw)
export const calculateTrendMetrics = (posts: any[], followers: number): TrendMetrics | null => {
  // Input normalization (create safe minimal post objects)
  const normPosts = posts.map(p => ({
      likes: p.likes || p.likesCount || 0,
      comments: p.comments || p.commentsCount || 0,
      timestamp: p.timestamp || p.date || new Date().toISOString()
  }));

  if (normPosts.length < 10) return null;

  // 3개 구간으로 분할 (최신순 정렬 가정)
  const recentPosts = normPosts.slice(0, Math.min(10, normPosts.length));
  const middlePosts = normPosts.slice(10, 20);
  const oldestPosts = normPosts.slice(20, 30);

  // 구간별 ER 계산
  const calcPeriodMetrics = (periodPosts: any[]) => {
    if (periodPosts.length === 0) return { er: 0, avgLikes: 0, avgComments: 0 };
    const totalLikes = periodPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = periodPosts.reduce((sum, p) => sum + p.comments, 0);
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

  // 평균 업로드 주기 계산 (Get it from existing util to avoid calc duplication, but let's recalculate here for self-contained strict logic)
  let avgUploadFrequency = 0;
  if (normPosts.length >= 2) {
    const timestamps = normPosts
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
    totalPosts: normPosts.length,
    periodComparison: {
      recent: { er: Math.round(recent.er * 100) / 100, avgLikes: Math.round(recent.avgLikes), avgComments: Math.round(recent.avgComments) },
      middle: { er: Math.round(middle.er * 100) / 100, avgLikes: Math.round(middle.avgLikes), avgComments: Math.round(middle.avgComments) },
      oldest: { er: Math.round(oldest.er * 100) / 100, avgLikes: Math.round(oldest.avgLikes), avgComments: Math.round(oldest.avgComments) }
    }
  };
};

// --- Qualification Criteria Logic ---

export const evaluateQualificationCriteria = (user: InstagramUser, posts: InstagramPost[]) => {
    // 1. Followers Check (>= 1,000)
    const followers = user.followers_count || 0;
    const followersPassed = followers >= 1000;

    // 2. Recent Post Check (Within 7 days)
    // Helper for safe timestamp parsing
    const getSafeTime = (ts: string | number): number => {
        if (!ts) return 0;
        if (typeof ts === 'string') {
             // Try parsing ISO/Date string
             const parsed = new Date(ts).getTime();
             return isNaN(parsed) ? 0 : parsed;
        }
        // Number: If small (seconds), convert to ms. If large (ms), keep.
        // 10,000,000,000 is roughly year 2286, so anything less is likely seconds (if recent).
        // 1,000,000,000 is year 2001.
        return ts < 10000000000 ? ts * 1000 : ts;
    };

    // 2. Recent Post Check (Within 7 days)
    let recentPostPassed = false;
    let daysSinceLastPost = 999;
    let recentPostValue = "게시물 없음";

    if (posts.length > 0) {
        const lastPostTs = getSafeTime(posts[0].timestamp);
        if (lastPostTs > 0) {
            const now = Date.now();
            const diffMs = now - lastPostTs;
            daysSinceLastPost = Math.floor(diffMs / (1000 * 3600 * 24));
            recentPostPassed = daysSinceLastPost <= 7;
            
            if (daysSinceLastPost === 0) recentPostValue = "오늘";
            else recentPostValue = `${daysSinceLastPost}일 전`;
        }
    }

    // 3. Upload Frequency Check (Avg Gap <= 7 days)
    let totalGap = 0;
    let gapCount = 0;
    let avgFrequency = 0;

    if (posts.length >= 2) {
         // Sort by timestamp desc
         const sorted = [...posts].sort((a, b) => {
            return getSafeTime(b.timestamp) - getSafeTime(a.timestamp);
         });

         for (let i = 0; i < sorted.length - 1; i++) {
            const t1 = getSafeTime(sorted[i].timestamp);
            const t2 = getSafeTime(sorted[i+1].timestamp);
            
            if (t1 > 0 && t2 > 0) {
                const gap = (t1 - t2) / (1000 * 3600 * 24); // Days
                totalGap += gap;
                gapCount++;
            }
         }
         avgFrequency = gapCount > 0 ? Math.round(totalGap / gapCount) : 0;
    }
    
    // Strict Requirement: Upload Frequency <= 7 days.
    // If < 2 posts, we cannot determine frequency, so it fails (consistent with active influencer requirement).
    const frequencyPassed = posts.length >= 2 ? avgFrequency <= 7 : false;

    // Composite Result
    const isMet = followersPassed && recentPostPassed && frequencyPassed;

    return {
        isMet,
        checks: {
            followers: { passed: followersPassed, value: followers, threshold: 1000 },
            recentPost: { passed: recentPostPassed, value: recentPostValue, thresholdDays: 7 },
            frequency: { passed: frequencyPassed, value: avgFrequency, thresholdDays: 7 }
        }
    };
};
