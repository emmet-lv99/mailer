import { InstagramUser } from "./types";

export const getLatestPostDate = (user: InstagramUser) => {
    if (!user.recent_posts || user.recent_posts.length === 0) return null;
    const sorted = [...user.recent_posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return new Date(sorted[0].timestamp);
};

export const getAverageUploadCycle = (posts: any[]) => {
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
        avgCommentsPerPost = totalComments / feedPosts.length;
        const estimatedLikes = avgCommentsPerPost * 10;
        feedER = ((avgCommentsPerPost + estimatedLikes) / user.followers_count) * 100;
    }

    // 2. Reels Metrics
    let reelsER = 0;
    let avgReelsViews = 0;
    if (reelsPosts.length > 0) {
        const totalViews = reelsPosts.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalComments = reelsPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
        
        avgReelsViews = totalViews / reelsPosts.length;
        const avgReelsComments = totalComments / reelsPosts.length;
        
        reelsER = ((avgReelsViews + avgReelsComments) / user.followers_count) * 100;
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

export const calculateAuthenticity = (user: InstagramUser) => {
    const tier = getAccountTier(user.followers_count);
    const { feedER, reelsER, avgCommentsPerPost, avgReelsViews } = getEngagementMetrics(user);
    const criteria = AUTHENTICITY_CRITERIA[tier] || AUTHENTICITY_CRITERIA['Nano'];

    // 1. Comment Ratio Score
    const commentRatio = (avgCommentsPerPost / user.followers_count) * 100;
    
    let commentScore = 0;
    if (commentRatio >= criteria.comment.excellent) commentScore = 40;
    else if (commentRatio >= criteria.comment.good) commentScore = 30;
    else if (commentRatio >= criteria.comment.normal) commentScore = 15;

    // 2. View Ratio Score
    const viewRatio = avgReelsViews / user.followers_count;

    let viewScore = 0;
    if (viewRatio >= criteria.view.excellent) viewScore = 40;
    else if (viewRatio >= criteria.view.good) viewScore = 30;
    else if (viewRatio >= criteria.view.normal) viewScore = 15;

    // 3. Consistency Score
    let consistencyScore = 0;
    if (reelsER === 0 && feedER === 0) {
        consistencyScore = 0; 
    } else if (reelsER === 0 || feedER === 0) {
        consistencyScore = 0; 
    } else {
        const consistency = Math.abs(reelsER - feedER) / Math.max(reelsER, feedER);
        if (consistency <= 0.3) consistencyScore = 20;
        else if (consistency <= 0.7) consistencyScore = 10;
        else consistencyScore = 0;
    }

    // Total Score
    const authenticityScore = commentScore + viewScore + consistencyScore;

    // 4. Fake Follower Check
    const isFake = commentRatio < criteria.fakeThreshold;

    return { 
        authenticityScore, 
        isFake,
        details: {
            commentScore,
            viewScore,
            consistencyScore,
            commentRatio,
            viewRatio,
            er: { feedER, reelsER },
            criteria // Return criteria for UI display
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
// Authenticity internal max scores were: Comment=40, View=40. We need 0-100.
export const getNormalizedAuthComponents = (user: InstagramUser) => {
    const { details } = calculateAuthenticity(user);
    // Comment Score: max 40 -> 100 (multiply by 2.5)
    // View Score: max 40 -> 100 (multiply by 2.5)
    return {
        commentScoreNorm: (details.commentScore || 0) * 2.5,
        viewScoreNorm: (details.viewScore || 0) * 2.5,
        authenticityScore: details.commentScore + details.viewScore + details.consistencyScore // Max 100 already
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
