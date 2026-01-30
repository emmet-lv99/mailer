import genAI from "@/lib/gemini";

// Define a minimal Analysis interface for embedding generation
interface AnalysisSummary {
  username: string;
  followers: number;
  er: number;
  tier: string;
  grade?: string;
  category?: string;
  purchase_keyword_ratio?: number;
  trend_direction?: string;
  fullAnalysis?: any;
}

/**
 * Generates a 768-dimensional vector embedding for an influencer analysis record.
 * Uses both quantitative stats and qualitative AI assessments for deep similarity.
 */
export async function generateEmbedding(analysis: AnalysisSummary): Promise<number[]> {
  try {
    const full = analysis.fullAnalysis || {};
    
    // 1. Convert analysis data to a descriptive text block (Quantitative + Qualitative)
    const text = `
Influencer: ${analysis.username}
Stats: ${analysis.followers} followers, ${analysis.er}% ER, Category: ${analysis.category || 'general'}.
Evaluation: Tier ${analysis.tier}, Grade ${analysis.grade || 'N/A'}. 
AI Sentiment:
- Investment Verdict: ${full.investmentAnalyst?.currentAssessment?.brutalVerdict || ''}
- Growth Verdict: ${full.influencerExpert?.futureAssessment?.expertVerdict || ''}
- Strategic Summary: ${full.comparisonSummary?.recommendation || ''}
- Bio Info: ${full.profile?.biography || ''}
`.trim();

    // 2. Get Embedding Model
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    // 3. Generate Embedding
    const result = await model.embedContent(text);
    const embedding = result.embedding;

    return embedding.values; // Returns array of numbers (768 dim)

  } catch (error) {
    console.error(`[Embedding] Failed to generate embedding for ${analysis.username}:`, error);
    throw error;
  }
}
