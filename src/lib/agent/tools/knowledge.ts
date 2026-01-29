import { supabaseAdmin } from "@/lib/supabase";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const queryInfluencerDbTool = new DynamicStructuredTool({
  name: "query_influencer_knowledge_base",
  description: "Searches the private database of previously analyzed influencers. Use this to respond to user questions about their analyzed data, find recommendations, or summarize specific profiles.",
  schema: z.object({
    username: z.string().optional().describe("Specific username to look for"),
    minER: z.number().optional().describe("Minimum Engagement Rate to filter"),
    tier: z.enum(["S", "A", "B", "C", "D"]).optional().describe("Specific Tier level"),
    keywords: z.string().optional().describe("Keywords to search for in biography or analysis"),
    limit: z.number().default(5).describe("Maximum number of results to return"),
  }),
  func: async ({ username, minER, tier, keywords, limit }) => {
    if (!supabaseAdmin) {
      return JSON.stringify({ error: "Database not connected." });
    }

    try {
      let query = supabaseAdmin
        .from("analysis_history")
        .select("*")
        .order("analyzed_at", { ascending: false });

      if (username) {
        query = query.eq("username", username.replace("@", "").toLowerCase().trim());
      }
      if (minER) {
        query = query.gte("er", minER);
      }
      if (tier) {
        query = query.eq("tier", tier);
      }
      if (keywords) {
        // Simple ilike on username or bio if applicable, or we search within the full_analysis JSON
        query = query.ilike("username", `%${keywords}%`);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;

      if (!data || data.length === 0) {
        return JSON.stringify({ message: "데이터베이스에 일치하는 인플루언서가 없습니다. 타겟 검색을 통해 먼저 분석을 진행해주세요." });
      }

      // Return simplified data for LLM context
      return JSON.stringify(data.map(item => ({
        username: item.username,
        followers: item.followers,
        er: item.er,
        tier: item.tier,
        grade: item.grade,
        analyzed_at: item.analyzed_at,
        // Only return essential parts of full_analysis to save tokens
        summary: item.full_analysis?.comparisonSummary?.recommendation || "분석 완료된 프로필입니다.",
        strengths: item.full_analysis?.investmentAnalyst?.currentAssessment?.strengths || []
      })));

    } catch (error) {
      console.error("[Tool: query_influencer_db] Error:", error);
      return JSON.stringify({ error: "데이터베이스 조회 중 오류가 발생했습니다." });
    }
  },
});
