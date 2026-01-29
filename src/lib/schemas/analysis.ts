// Strict JSON Schema for Instagram Analysis API Response
// Used with Gemini's schema-enforced generation

export const INSTAGRAM_ANALYSIS_SCHEMA = {
  type: "OBJECT",
  properties: {
    investmentAnalyst: {
      type: "OBJECT",
      properties: {
        tier: { type: "STRING", enum: ["S", "A", "B", "C", "D"] },
        totalScore: { type: "NUMBER" },
        decision: { type: "STRING" },
        estimatedValue: { type: "STRING" },
        expectedROI: { type: "STRING" },
        currentAssessment: {
          type: "OBJECT",
          properties: {
            strengths: { type: "ARRAY", items: { type: "STRING" } },
            weaknesses: { type: "ARRAY", items: { type: "STRING" } },
            risks: { type: "ARRAY", items: { type: "STRING" } },
            brutalVerdict: { type: "STRING" }
          },
          required: ["strengths", "weaknesses", "risks", "brutalVerdict"]
        }
      },
      required: ["tier", "totalScore", "decision", "estimatedValue", "expectedROI", "currentAssessment"]
    },
    influencerExpert: {
      type: "OBJECT",
      properties: {
        grade: { type: "STRING", enum: ["Star", "Rising", "Potential", "Stagnant", "Declining"] },
        totalScore: { type: "NUMBER" },
        recommendation: { type: "STRING" },
        estimatedValueIn6Months: { type: "STRING" },
        growthAnalysis: {
            type: "OBJECT",
            properties: {
                followerGrowthRate: { type: "STRING" },
                engagementTrend: { type: "STRING" },
                contentVirality: { type: "STRING" }
            }
        },
        futureAssessment: {
          type: "OBJECT",
          properties: {
            growthTrajectory: { type: "STRING" },
            hiddenStrengths: { type: "ARRAY", items: { type: "STRING" } },
            potentialRisks: { type: "ARRAY", items: { type: "STRING" } },
            strategicAdvice: { type: "ARRAY", items: { type: "STRING" } },
            expertVerdict: { type: "STRING" }
          },
          required: ["growthTrajectory", "hiddenStrengths", "potentialRisks", "strategicAdvice", "expertVerdict"]
        }
      },
      required: ["grade", "totalScore", "recommendation", "estimatedValueIn6Months", "futureAssessment"]
    },
    comparisonSummary: {
      type: "OBJECT",
      properties: {
        agreement: { type: "BOOLEAN" },
        keyDifference: { type: "STRING" },
        recommendation: { type: "STRING" }
      },
      required: ["agreement", "keyDifference", "recommendation"]
    }
  },
  required: ["investmentAnalyst", "influencerExpert", "comparisonSummary"]
} as const;
