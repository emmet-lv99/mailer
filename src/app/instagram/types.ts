// Shared Types for Instagram Analysis Feature

/**
 * Result structure returned by the AI analysis API
 */
export interface AnalysisResult {
  username: string;
  success: boolean;
  error?: string;
  analysis?: AnalysisData;
  trendMetrics?: TrendMetrics;  // 30개 게시물 기반 트렌드 분석
  verifiedProfile?: VerifiedProfile; // Source of Truth (AI 독립적 데이터)
}

/**
 * Hard-verified profile data (Source of Truth)
 */
export interface VerifiedProfile {
  username: string;
  followers: number;
  profilePicUrl: string | null;
  fullName?: string;
  biography?: string;
  isVerified?: boolean; // Apify 검증 성공 여부
}

/**
 * Core analysis data structure (Dual Role)
 */
export interface AnalysisData {
  basicStats?: {
    username: string;
    followers: number;
    er: number;
    avgLikes: number;
    botRatio: number;
    purchaseKeywordRatio: number;
    profilePicUrl?: string | null;
  };
  investmentAnalyst?: InvestmentAnalystAssessment;
  influencerExpert?: InfluencerExpertAssessment;
  comparisonSummary?: ComparisonSummary;
}

/**
 * Investment Analyst (현재 기준 냉혹한 투자 심사)
 */
export interface InvestmentAnalystAssessment {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  totalScore: number;
  decision: string;
  estimatedValue: string;
  expectedROI: string;
  currentAssessment: {
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    brutalVerdict: string;
  };
}

/**
 * Influencer Expert (미래 기준 육성 전문가)
 */
export interface InfluencerExpertAssessment {
  grade: string;
  totalScore: number;
  recommendation: string;
  estimatedValueIn6Months: string;
  growthAnalysis?: {
    followerGrowthRate: string;
    engagementTrend: string;
    contentVirality: string;
  };
  futureAssessment: {
    growthTrajectory: string;
    hiddenStrengths: string[];
    potentialRisks: string[];
    strategicAdvice: string[];
    expertVerdict: string;
  };
}

/**
 * Comparison between two roles
 */
export interface ComparisonSummary {
  agreement: boolean;
  keyDifference: string;
  recommendation: string;
}

/**
 * Trend metrics calculated from posts (up to 30, minimum 10)
 */
export interface TrendMetrics {
  erTrend: 'rising' | 'stable' | 'declining';
  erChangePercent: number;  // 최근 10개 vs 이전 비교
  avgUploadFrequency: number;  // 평균 업로드 주기 (일)
  totalPosts: number;  // 실제 분석에 사용된 게시물 수
  periodComparison: {
    recent: { er: number; avgLikes: number; avgComments: number };
    middle: { er: number; avgLikes: number; avgComments: number };
    oldest: { er: number; avgLikes: number; avgComments: number };
  };
}

/**
 * Parameters for building the brutal user prompt
 */
export interface BrutalUserPromptParams {
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
  trendMetrics?: TrendMetrics;  // 30개 게시물 기반 트렌드 분석
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

/**
 * Result from Stage 1: Fetch Raw Data
 */
export interface RawAnalysisResult {
    username: string;
    success: boolean;
    error?: string;
    verifiedProfile?: VerifiedProfile;
    metrics?: {
        tier: string;
        engagementRate: number;
        erGrade: string;
        authenticityScore: number;
        isFake: boolean;
        isActive: boolean;
        avgUploadCycle: number | null;
        marketSuitable: boolean;
        campaignSuitability: any;
    };
    trendMetrics?: TrendMetrics | null;
    recent_posts?: any[];
}

