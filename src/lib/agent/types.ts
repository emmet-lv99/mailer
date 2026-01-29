
// Dual-Role Output Structure
export interface InvestmentAnalyst {
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

export interface InfluencerExpert {
  grade: 'Star' | 'Rising' | 'Potential' | 'Stagnant' | 'Declining';
  totalScore: number;
  recommendation: string;
  estimatedValueIn6Months: string;
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
  growthAnalysis?: Record<string, string>; // Optional trend analysis mappings
}

export interface ComparisonSummary {
  agreement: boolean;
  keyDifference: string;
  recommendation: string;
}

export interface DualRoleAnalysis {
  basicStats?: {
    username?: string;
    followers: number;
    er: number;
    avgLikes: number;
    botRatio?: number;
    purchaseKeywordRatio?: number;
    purchaseKeywordRatio?: number;
    profilePicUrl?: string;
  };
  badges?: {
    isMarketSuitable: boolean;
    authenticity: any; // Using any to avoid complex nested imports in types, or copy AuthenticityResult
    campaign: any;
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
