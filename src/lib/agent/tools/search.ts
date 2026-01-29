import { supabaseAdmin } from "@/lib/supabase"; // Use Admin for tool context
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ApifyClient } from "apify-client";
import { z } from "zod";

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

export const searchProfileTool = new DynamicStructuredTool({
  name: "search_profile",
  description: "Searches for an Instagram user's profile information (Step 1). Returns name, followers, and profile picture.",
  schema: z.object({
    username: z.string().describe("The Instagram username to search"),
  }),
  func: async ({ username }) => {
    try {
      const targetUser = username.replace(/^@/, '').toLowerCase().trim();
      console.log(`[Tool: search_profile] Searching for ${targetUser}...`);

      const commonInput = {
        directUrls: [`https://www.instagram.com/${targetUser}/`],
        resultsType: "details",
        resultsLimit: 1,
        username_login: process.env.INSTAGRAM_USERNAME,
        password_login: process.env.INSTAGRAM_PASSWORD,
        loginUsername: process.env.INSTAGRAM_USERNAME,
        loginPassword: process.env.INSTAGRAM_PASSWORD,
      };

      const run = await apifyClient.actor("apify/instagram-scraper").call(commonInput);
      const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
      
      const profile = items[0] as any || {};
      
      const result = {
          username: targetUser,
          fullName: profile.fullName || targetUser,
          followers: profile.followersCount || profile.followerCount || 0,
          biography: profile.biography || "",
          profilePicUrl: profile.hdProfilePicUrlInfo?.url || profile.profilePicUrl || "",
      };

      // [New] Check for existing analysis in DB
      let latestAnalysis = null;
      try {
         if (!supabaseAdmin) {
            console.warn("[Tool: search_profile] supabaseAdmin is not initialized (missing SERVICE_ROLE_KEY). Skipping DB check.");
         } else {
             const { data } = await supabaseAdmin
                .from("analysis_history")
            .select("id, analyzed_at")
            .eq("username", targetUser)
            .order("analyzed_at", { ascending: false })
            .limit(1)
            .maybeSingle();
         
             if (data) {
                 latestAnalysis = {
                     id: data.id,
                     date: new Date(data.analyzed_at).toLocaleString('ko-KR', { 
                         timeZone: 'Asia/Seoul', 
                         year: 'numeric', 
                         month: '2-digit', 
                         day: '2-digit', 
                         hour: '2-digit', 
                         minute: '2-digit', 
                         hour12: false
                     }), 
                     timestamp: data.analyzed_at
                 };
             }
         }
      } catch(dbError) {
          console.warn("[Tool: search_profile] DB Lookup failed:", dbError);
      }

      console.log(`[Tool: search_profile] Found: ${result.username} (${result.followers}) | Previous Analysis: ${latestAnalysis ? latestAnalysis.date : 'None'}`);
      
      return JSON.stringify({ 
          foundProfile: result,
          existingAnalysis: latestAnalysis 
      });

    } catch (error) {
      console.error("[Tool: search_profile] Error:", error);
      return JSON.stringify({ error: "해당 사용자를 찾을 수 없습니다." });
    }
  },
});
