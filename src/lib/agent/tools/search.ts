import { supabaseAdmin } from "@/lib/supabase"; // Use Admin for tool context
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ApifyClient } from "apify-client";
import { z } from "zod";

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

export const searchProfileTool = new DynamicStructuredTool({
  name: "search_profile",
  description: "Searches for an Instagram user's profile information (Step 1). Returns profile details and latest posts.",
  schema: z.object({
    username: z.string().describe("The Instagram username to search"),
  }),
  func: async ({ username }) => {
    try {
      const targetUser = username.replace(/^@/, '').toLowerCase().trim();
      console.log(`[Tool: search_profile] Searching for ${targetUser}...`);

      const instaUsername = process.env.INSTAGRAM_USERNAME;
      const instaPassword = process.env.INSTAGRAM_PASSWORD;

      const commonInput = {
        directUrls: [`https://www.instagram.com/${targetUser}/`],
        searchLimit: 1,
        username_login: instaUsername,
        password_login: instaPassword,
        loginUsername: instaUsername,
        loginPassword: instaPassword,
      };

      // [Stabilization] Run both details and posts in parallel, just like the working API route
      const [detailRun, postsRun] = await Promise.all([
        apifyClient.actor("apify/instagram-scraper").call({
            ...commonInput,
            resultsType: "details",
            resultsLimit: 1,
        }),
        apifyClient.actor("apify/instagram-scraper").call({
            ...commonInput,
            resultsType: "posts",
            resultsLimit: 6,
            maxPosts: 6,
        })
      ]);

      const [detailDataset, postsDataset] = await Promise.all([
        apifyClient.dataset(detailRun.defaultDatasetId).listItems(),
        apifyClient.dataset(postsRun.defaultDatasetId).listItems()
      ]);

      const detailItems = detailDataset.items as any[];
      const postItems = postsDataset.items as any[];

      // Find direct profile match
      const profileInfo = detailItems.find(item => item.username?.toLowerCase() === targetUser) || {};
      
      // Filter posts that belong to the user
      const userPosts = postItems.filter(post => {
        const owner = post.owner || {};
        const ownerUsername = post.ownerUsername || owner.username || "";
        return ownerUsername.toLowerCase() === targetUser;
      });

      // [Aggregation Logic] Match the working /api/instagram/search logic exactly
      const firstPost = userPosts[0] || {};
      const owner = firstPost.owner || {};

      // If we found neither profile info nor posts, the user likely doesn't exist or is completely blocked
      if (!profileInfo.username && userPosts.length === 0) {
          console.warn(`[Tool: search_profile] No data found for ${targetUser} in either details or posts.`);
          return JSON.stringify({ error: "해당 사용자를 찾을 수 없습니다. (데이터 수집 실패)" });
      }

      // [Fix] Normalize Korean NFD -> NFC and sanitize strings
      const normalize = (str: string) => (str || "").normalize('NFC').trim();
      
      const profile = {
          username: profileInfo.username || targetUser,
          fullName: normalize(profileInfo.fullName || firstPost.ownerFullName || owner.fullName || profileInfo.fullName || ""),
          followers: profileInfo.followersCount || firstPost.ownerFollowersCount || owner.followersCount || owner.edge_followed_by?.count || 0,
          biography: normalize(profileInfo.biography || firstPost.ownerBiography || owner.biography || ""),
          profilePicUrl: profileInfo.profilePicUrl || firstPost.ownerProfilePicUrl || owner.profilePicUrl || profileInfo.profilePicUrl || "",
          postsCount: profileInfo.postsCount || firstPost.ownerPostsCount || owner.postsCount || 0,
          latestPosts: userPosts
      };

      // [Robustness] Sanitize profilePicUrl - Strip excessive tracking params that bloat context
      const sanitizeUrl = (url: string) => {
          if (!url) return "";
          try {
              const u = new URL(url);
              // List of params to keep for IG CDN
              const keep = ['stp', 'efg', '_nc_ht', '_nc_cat', '_nc_ohc', '_nc_rid', 'edm', 'ccb'];
              const params = new URLSearchParams();
              u.searchParams.forEach((val, key) => {
                  if (keep.includes(key)) params.set(key, val);
              });
              const search = params.toString();
              return `${u.origin}${u.pathname}${search ? '?' + search : ''}`;
          } catch(e) { return url; }
      };

      // Metadata for foundProfile
      const foundProfile = {
          username: profile.username,
          fullName: profile.fullName,
          followers: profile.followers,
          biography: profile.biography.substring(0, 150),
          profilePicUrl: sanitizeUrl(profile.profilePicUrl),
      };

      // Check for existing analysis in DB
      let latestAnalysis = null;
      try {
         if (supabaseAdmin) {
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

      console.log(`[Tool: search_profile] Found: ${foundProfile.username} (${foundProfile.followers}) | Previous Analysis: ${latestAnalysis ? latestAnalysis.date : 'None'}`);
      
      return JSON.stringify({ 
          foundProfile,
          existingAnalysis: latestAnalysis 
      });

    } catch (error) {
      console.error("[Tool: search_profile] Error:", error);
      return JSON.stringify({ error: "사용자 검색 중 오류가 발생했습니다." });
    }
  },
});
