// Shared Types for Instagram Analysis Feature

/**
 * Result structure returned by the AI analysis API
 */
export interface AnalysisResult {
  username: string;
  success: boolean;
  error?: string;
  analysis?: AnalysisData;
}

/**
 * Core analysis data structure (Dual Role)
 */
export interface AnalysisData {
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
