import { generateEmbedding } from "@/lib/embeddings";
import { supabaseAdmin } from "@/lib/supabase";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const findSimilarTool = new DynamicStructuredTool({
  name: "find_similar_influencers",
  description: "Finds influencers similar to a given username based on their analysis data (ER, Tier, Content Style, etc). Useful for discovering lookalikes.",
  schema: z.object({
    username: z.string().describe("The Instagram username to find lookalikes for (without @)"),
    limit: z.number().optional().describe("Number of similar profiles to return (default: 5)"),
  }),
  func: async ({ username, limit = 5 }) => {
    try {
      const targetUser = username.replace(/^@/, '').toLowerCase().trim();
      console.log(`[Tool: find_similar] Searching for lookalikes of ${targetUser}...`);

      if (!supabaseAdmin) {
          throw new Error("Supabase Admin client not available.");
      }

      // 1. Fetch Target User's Analysis & Embedding
      const { data: userRecord, error: fetchError } = await supabaseAdmin
        .from('analysis_history')
        .select('id, username, full_analysis, embedding')
        .eq('username', targetUser)
        .order('analyzed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError || !userRecord) {
        return JSON.stringify({ error: `User ${targetUser} not found in analysis history. Please analyze them first.` });
      }

      let queryEmbedding = userRecord.embedding;

      // 2. If embedding is missing, generate it on-the-fly
      if (!queryEmbedding) {
         console.log(`[Tool] Embedding missing for ${targetUser}. Generating on-the-fly...`);
         try {
            // Reconstruct minimal analysis object for embedding
            const fullAnalysis = userRecord.full_analysis || {};
            const summary = {
                username: userRecord.username,
                followers: fullAnalysis.basicStats?.followers || 0,
                er: fullAnalysis.basicStats?.er || 0,
                tier: fullAnalysis.investmentAnalyst?.tier || 'D',
                grade: fullAnalysis.influencerExpert?.grade || 'Potential',
                category: fullAnalysis.category || 'general',
                purchase_keyword_ratio: fullAnalysis.basicStats?.purchaseKeywordRatio,
                trend_direction: fullAnalysis.trend?.trendDirection,
                fullAnalysis: fullAnalysis // [NEW] Pass everything for deep embedding
            };
            
            queryEmbedding = await generateEmbedding(summary);

            // Optional: Save it back to DB for future use
            await supabaseAdmin
                .from('analysis_history')
                .update({ embedding: queryEmbedding })
                .eq('id', userRecord.id);
         } catch (genError) {
             console.error("[Tool] Failed to generate embedding:", genError);
             return JSON.stringify({ error: "Failed to generate embedding for similarity search." });
         }
      }

      // 3. Perform Vector Search (RPC call)
      const { data: similarUsers, error: rpcError } = await supabaseAdmin.rpc('match_influencers', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, // Slightly lower threshold to ensure results
        match_count: limit + 1 // Request one more just in case we need to filter out self
      });

      if (rpcError) {
        console.error("[Tool] RPC call failed:", rpcError);
        return JSON.stringify({ error: "Database error during similarity search." });
      }

      // 4. Format Results (Exclude self)
      const results = (similarUsers || [])
        .filter((u: any) => u.username !== targetUser)
        .slice(0, limit)
        .map((u: any) => ({
            username: u.username,
            similarity: (u.similarity * 100).toFixed(1) + '%',
            followers: u.full_analysis?.basicStats?.followers,
            er: u.full_analysis?.basicStats?.er + '%',
            tier: u.full_analysis?.investmentAnalyst?.tier,
            // [Enriched Qualitative Context]
            grade: u.full_analysis?.influencerExpert?.grade,
            category: u.full_analysis?.category || 'General',
            bio: u.full_analysis?.profile?.biography || u.full_analysis?.basicStats?.biography || '',
            purchase_keywords: u.full_analysis?.basicStats?.purchaseKeywordRatio + '%',
            // [Strategic Context for AI Explanation]
            investment_verdict: u.full_analysis?.investmentAnalyst?.currentAssessment?.brutalVerdict || '',
            expert_recommendation: u.full_analysis?.influencerExpert?.recommendation || '',
            strategic_advice: u.full_analysis?.influencerExpert?.futureAssessment?.strategicAdvice?.[0] || ''
        }));

      if (results.length === 0) {
          return JSON.stringify({ message: "No similar influencers found within the threshold." });
      }

      return JSON.stringify({
          target: targetUser,
          lookalikes: results
      });

    } catch (error: any) {
      console.error("[Tool: find_similar] Error:", error);
      return JSON.stringify({ error: error.message });
    }
  },
});
