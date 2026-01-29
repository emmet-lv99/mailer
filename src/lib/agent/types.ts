
// Dual-Role Output Structure
// Output Structure (Cleaned & Typed)
export interface InvestmentAnalyst {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  totalScore: number;
  decision: string;
  estimatedValue: string;
  conversionMetrics: {
    reachPotential: string;
    purchaseIntent: string;
    conversionLikelihood: string;
    estimatedBuyers?: string;
  };
  currentAssessment: {
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    brutalVerdict: string;
  };
}

export interface InfluencerExpert {
  grade: 'Star' | 'Rising' | 'Potential' | 'Stagnant' | 'Declining';
  totalScore: number;
  recommendation: string;
  futureAssessment: {
    growthTrajectory: '매우 긍정적' | '긍정적' | '보통' | '부정적' | '매우 부정적';
    hiddenStrengths: string[];
    potentialRisks: string[];
    strategicAdvice: string[];
    projectedMetrics: {
      in3Months: { followers: number; er: number; tier: string };
      in6Months: { followers: number; er: number; tier: string };
      in12Months: { followers: number; er: number; tier: string };
    };
    expertVerdict: string;
  };
  growthAnalysis?: Record<string, string>;
}

export interface ComparisonSummary {
  agreement: boolean;
  keyDifference: string;
  recommendation: string;
}

export interface QualificationCriteria {
  isMet: boolean;
  checks: {
    followers: { passed: boolean; value: number; threshold: number };
    recentPost: { passed: boolean; value: string; thresholdDays: number };
    frequency: { passed: boolean; value: number; thresholdDays: number };
  };
}

export interface DualRoleAnalysis {
  basicStats?: {
    username?: string;
    followers: number;
    er: number;
    avgLikes: number;
    botRatio?: number;
    purchaseKeywordRatio?: number;
    profilePicUrl?: string;
  };
  badges?: {
    isMarketSuitable: boolean;
    authenticity: {
        authenticityScore: number;
        isFake: boolean;
        reason: string;
        measuredMetrics: string[];
        details: {
            commentScore: number;
            viewScore: number | null;
            consistencyScore: number | null;
            commentRatioVal?: number;
            viewRatioVal?: number;
            consistencyRatio?: number;
        };
    };
    criteria?: QualificationCriteria;
    campaign: {
        sponsorship: { score: number; grade: string; passed: boolean };
        paidAd: { score: number; grade: string; passed: boolean };
        coPurchase: { score: number; grade: string; passed: boolean };
    };
  };
  investmentAnalyst: InvestmentAnalyst;
  influencerExpert: InfluencerExpert;
  comparisonSummary: ComparisonSummary;
}

// Full API Response or Agent Tool Output
export interface AgentResponse {
  username: string;
  metrics: {
    followers: number;
    er: number;
    botRatio: number;
    purchaseKeywordRatio: number;
  };
  analysis: DualRoleAnalysis;
}

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  analysis?: DualRoleAnalysis;
  profileData?: any; // For Step 1: Profile Discovery
  errorData?: any;   // For Error Cards
  timestamp: Date;
};

export type Conversation = {
    id: string;
    title: string;
    created_at: string;
};
