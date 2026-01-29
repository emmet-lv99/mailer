import { DynamicStructuredTool } from "@langchain/core/tools";
import { ApifyClient } from "apify-client";
import { z } from "zod";
// [FORCE REBUILD 1]

// Initialize Apify Client
const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

import {
  analyzePurchaseKeywords,
  calculateAuthenticity,
  calculateCampaignSuitability,
  calculateTrendMetrics,
  detectBotRatio,
  evaluateQualificationCriteria,
  getAccountGrade,
  getEngagementMetrics,
  isMarketSuitable
} from "@/services/instagram/utils";

import { supabaseAdmin } from "@/lib/supabase";

export const analyzeAccountTool = new DynamicStructuredTool({
  name: "perform_deep_analysis",
  description: "STAGE 2 ONLY: Performs deep analysis (30 posts, vision, metrics). MUST ONLY be called AFTER the user confirms the profile found by search_profile.",
  schema: z.object({
    username: z.string().describe("The Instagram username to analyze (without @)"),
  }),
  func: async ({ username }) => {
    try {
      const targetUser = username.replace(/^@/, '').toLowerCase().trim();
      console.log(`[Tool: analyze_account] Starting analysis for ${targetUser}...`);

      // 0. Cache Check: Look for recent analysis in DB (Last 24 Hours)
      if (supabaseAdmin) {
        try {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { data: cached, error: cacheError } = await supabaseAdmin
                .from('analysis_history')
                .select('full_analysis, analyzed_at')
                .eq('username', targetUser)
                .gt('analyzed_at', yesterday)
                .order('analyzed_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!cacheError && cached) {
                console.log(`[Tool] Using cached analysis from ${cached.analyzed_at}`);
                const cachedResult = cached.full_analysis as any;
                
                // Logging for Cache Hit
                const result = cachedResult;
                console.log("\n=== [Tool] SEARCHED PROFILE INFO (CACHED) ===");
                console.log(`Username: ${targetUser}`);
                console.log(`Full Name: ${result.profile?.fullName}`);
                console.log(`Followers: ${result.profile?.followersCount}`);
                console.log(`Biography: ${result.profile?.biography}`);
                console.log(`Profile Pic: ${result.profile?.profilePicUrl ? 'Found' : 'Missing'}`);
                console.log("=============================================\n");

                return JSON.stringify({
                    ...cachedResult,
                    isFromCache: true,
                    cachedAt: cached.analyzed_at
                });
            }
        } catch (dbError) {
            console.warn("[Tool] Cache lookup failed, proceeding with crawl:", dbError);
        }
      }

      const instaUsername = process.env.INSTAGRAM_USERNAME;
      const instaPassword = process.env.INSTAGRAM_PASSWORD;

      // 1. Run Apify Actor (Instagram Scraper)
      // Parallelize: Get Profile Details AND Posts separately for robustness
      // (Similar to src/app/api/instagram/search/route.ts)
      
      const commonInput = {
        directUrls: [`https://www.instagram.com/${targetUser}/`],
        username_login: instaUsername,
        password_login: instaPassword,
        loginUsername: instaUsername,
        loginPassword: instaPassword,
        searchLimit: 1, // Ensure we try to find the user
      };

      console.log(`[Tool] Fetching details and posts for ${targetUser}...`);

      const [detailsRun, postsRun] = await Promise.all([
        // Task A: Profile Details (for accurate followers count)
        apifyClient.actor("apify/instagram-scraper").call({
          ...commonInput,
          resultsType: "details",
          resultsLimit: 1,
        }),
        // Task B: Posts (for content analysis)
        apifyClient.actor("apify/instagram-scraper").call({
          ...commonInput,
          resultsType: "posts",
          resultsLimit: 30, // Get 30 posts
        })
      ]);

      const [detailsDataset, postsDataset] = await Promise.all([
        apifyClient.dataset(detailsRun.defaultDatasetId).listItems(),
        apifyClient.dataset(postsRun.defaultDatasetId).listItems()
      ]);

      let profileItem = (detailsDataset.items[0] as any) || {};
      
      // Retry Logic: If profile fetch failed or returned partial data (no followers), try once more
      if (!profileItem.followersCount && !profileItem.followerCount) {
          console.warn(`[Tool] Primary profile fetch failed for ${targetUser}. Retrying...`);
          try {
             // Add a small delay
             await new Promise(r => setTimeout(r, 2000));
             
             const retryRun = await apifyClient.actor("apify/instagram-scraper").call({
                ...commonInput,
                resultsType: "details",
                resultsLimit: 1,
             });
             const retryDataset = await apifyClient.dataset(retryRun.defaultDatasetId).listItems();
             if (retryDataset.items.length > 0) {
                 profileItem = (retryDataset.items[0] as any) || {};
                 console.log("[Tool] Retry successful. Profile data acquired.");
             } else {
                 console.warn("[Tool] Retry also failed to return profile items.");
             }
          } catch (retryError) {
              console.error("[Tool] Retry execution messed up:", retryError);
          }
      }

      console.log("\n=== [Tool] SEARCHED PROFILE INFO ===");
      console.log(`Username: ${targetUser}`);
      console.log(`Full Name: ${profileItem.fullName}`);
      console.log(`Followers: ${profileItem.followersCount || profileItem.followerCount}`);
      console.log(`Biography: ${profileItem.biography}`);
      console.log(`Profile Pic: ${profileItem.profilePicUrl ? 'Found' : 'Missing'}`);
      console.log("====================================\n");
      // console.log("[Tool] RAW Profile Item:", JSON.stringify(profileItem, null, 2)); // Keep raw if needed but commented out for noise reduction

      const posts = (postsDataset.items as any[]).map((item: any) => ({
        id: item.id,
        caption: item.caption,
        likesCount: item.likesCount,
        commentsCount: item.commentsCount,
        videoPlayCount: item.videoPlayCount || item.playCount || item.videoViewCount || item.viewCount || 0,
        type: item.type, // 'Video', 'Image', 'Sidecar'
        timestamp: item.timestamp,
        comments: item.latestComments?.map((c: any) => c.text) || [],
        owner: item.owner || item.user || {},
        imageUrl: item.displayUrl || item.imageUrl,
        thumbnailUrl: item.thumbnailSrc || item.thumbnail_src || item.displayUrl // Fallback to displayUrl if needed, but prefer small
      })) || [];

      if (posts.length > 0) {
        console.log("[Tool] RAW First Post Owner:", JSON.stringify(posts[0].owner, null, 2));
      }

      // Improved Fallback Logic
      // Improved Fallback & Stabilization Logic
      // Prioritize profileItem (exact details) over post owner samples (often rounded/stale)
      const followersCount = 
        profileItem.followersCount || 
        profileItem.followerCount || 
        profileItem.edge_followed_by?.count || 
        (posts[0]?.owner?.followersCount) || 
        (posts[0]?.owner?.followerCount) || 
        0;

      const profilePicUrl = 
        profileItem.hdProfilePicUrlInfo?.url || 
        profileItem.profilePicUrl || 
        posts[0]?.owner?.profilePicUrl || 
        null;

      console.log(`[Tool] Final Profile Data: ${profileItem.fullName || posts[0]?.owner?.fullName} (${followersCount} followers)`);

      // SANITIZATION: Remove owner details from posts to prevent LLM confusion
      // The LLM might pick up 'owner.followersCount' from a stale post object instead of the main profile.
      posts.forEach(p => {
          if (p.owner) {
              delete p.owner.followersCount;
              delete p.owner.followerCount;
              delete p.owner.edge_followed_by;
          }
      });

      if (followersCount === 0 && posts.length === 0) {
        return JSON.stringify({ error: "No data found or private account." });
      }
      
      // Calculate Metrics using Unified Utils
      const allComments = posts.flatMap(p => p.comments);
      
      // Adapt posts for getEngagementMetrics (expects InstagramUser structure-like array in recent_posts)
      // We essentially just need to pass an object that looks like { recent_posts: posts, followers_count: followersCount }
      // But getEngagementMetrics works on the full user object.
      // Actually we can map the data.
      
      // We need to construct a temp user object to use getEngagementMetrics
      const tempUser = {
        followers_count: followersCount,
        recent_posts: posts.map((p: any) => ({
            comments: p.commentsCount,
            views: p.videoPlayCount,
            productType: p.type === 'Video' || p.videoPlayCount > 0 ? 'clips' : 'feed',
            likes: p.likesCount
        }))
      } as any;
      
      const advancedMetrics = getEngagementMetrics(tempUser);
      
      // Trend Metrics
      // calculateTrendMetrics expects posts with { likes, comments, timestamp }
      const trendMetrics = calculateTrendMetrics(posts.map(p => ({
          likes: p.likesCount,
          comments: p.commentsCount,
          timestamp: p.timestamp
      })), followersCount);

      // Comm Stats (requires different structure in utils but let's see)
      // Utils `getCommunicationStats` expects user.recent_posts with latest_comments
      const tempUserForComm = {
          username: targetUser,
          recent_posts: posts.map((p: any) => ({
              latest_comments: p.comments // We already mapped this to string[] in line 261, BUT wait...
              // In line 261: comments: item.latestComments?.map((c: any) => c.text) || []
              // getCommunicationStats checks c.ownerUsername.
              // We lost ownerUsername in line 261. 
              // We need to keep the raw comments for this util.
          })) 
      };
      // CHECK: In line 253, we lost raw comments structure.
      // We need to pass raw post data for CommStats?
      // Actually, let's just stick to the shared logic if we can, OR re-implement the simple comm stats here if data structure differs too much.
      
      // Since we already parsed comments into strings effectively in line 261, the `getCommunicationStats` from utils 
      // which relies on `ownerUsername` in comment objects won't work with our `posts` array.
      // However, we can use the `postsDataset` (raw) to get that info.
      
      // Let's implement a lightweight adapter using raw `postsDataset` items.
      const rawPosts = postsDataset.items as any[];
      let totalFetchedComments = 0;
      let myReplies = 0;
      rawPosts.forEach(post => {
        if (post.latestComments) {
            totalFetchedComments += post.latestComments.length;
            post.latestComments.forEach((c: any) => {
                if (c.ownerUsername === targetUser) myReplies++;
            });
        }
      });
      const replyRate = totalFetchedComments > 0 ? Math.round((myReplies / totalFetchedComments) * 100) : 0;


      const botRatio = detectBotRatio(allComments);
      const purchaseKeywordRatio = analyzePurchaseKeywords(allComments);

      // Efficient Vision Analysis Strategy:
      // We process ALL 30 images using URLs (Lightweight).
      // The Agent/LLM will fetch these URLs directly.
      
      // Efficient Vision Analysis Strategy:
      // We process ALL 30 images using URLs (Lightweight).
      // The Agent/LLM will fetch these URLs directly or use them as reference.
      // NOTE: We cannot return Base64 here because ToolOutput is treated as Text by LangChain, 
      // which causes massive token inflation (3.5M tokens). URLs are safe.
      
      const contentAnalysis = posts.map(p => ({
          id: p.id,
          type: p.type,
          caption: p.caption ? p.caption.slice(0, 150) + (p.caption.length > 150 ? "..." : "") : "", 
          hashtags: p.caption?.match(/#[\wㄱ-ㅎㅏ-ㅣ가-힣]+/g) || [],
          likes: p.likesCount,
          commentsCount: p.commentsCount,
          views: p.videoPlayCount,
          commentSamples: p.comments.slice(0, 3), 
          date: p.timestamp,
          imageUrl: p.imageUrl, // Direct URL
          thumbnailUrl: p.thumbnailUrl
      }));

      // Calculate Tier & Grade (Missing locally)
      // NOTE: DB 'tier' column expects S/A/B/C/D (Investment Grade)
      // NOTE: DB 'grade' column expects Star/Rising/etc (Expert Grade)
      // utils.getAccountGrade returns S/A/B/C/D based on ER ==> Maps to DB 'tier'
      // utils.getAccountTier returns Nano/Micro ==> Not used for DB columns directly
      
      const calculatedTier = getAccountGrade({
          followers_count: followersCount,
          recent_posts: posts.map((p: any) => ({
              likes: p.likesCount,
              comments: p.commentsCount,
              views: p.videoPlayCount,
              productType: p.type === 'Video' || p.videoPlayCount > 0 ? 'clips' : 'feed'
          }))
      } as any); // Returns S, A, B, C, D

      const result = {
        username,
        profile: {
          followersCount,
          biography: profileItem.biography,
          fullName: profileItem.fullName,
          profilePicUrl
        },
        metrics: {
          totalER: advancedMetrics.totalER, // totalER from utils
          feedER: advancedMetrics.feedER,
          reelsER: advancedMetrics.reelsER,
          avgLikes: Math.round(posts.reduce((sum, p) => sum + (p.likesCount || 0), 0) / (posts.length || 1)), // Simple calc
          avgComments: Math.round(posts.reduce((sum, p) => sum + (p.commentsCount || 0), 0) / (posts.length || 1)),
          avgViews: Math.round(advancedMetrics.avgReelsViews), // from utils
          
          botRatio,
          purchaseKeywordRatio,
          replyRate: replyRate, // from local adapter
          totalPostsScraped: posts.length,
          calculatedTier: calculatedTier // [NEW] Algorithmic Baseline for AI
        },
        badges: {
            isMarketSuitable: isMarketSuitable(tempUser, trendMetrics?.avgUploadFrequency ?? null),
            authenticity: calculateAuthenticity(tempUser), // Full object
            campaign: calculateCampaignSuitability(tempUser), // Full object
            criteria: evaluateQualificationCriteria(tempUser, posts.map(p => ({
                ...p,
                likes: p.likesCount,
                comments: p.commentsCount,
                views: p.videoPlayCount,
                productType: p.type === 'Video' || p.videoPlayCount > 0 ? 'clips' : 'feed'
            }) as any)) // [NEW] Qualification Criteria
        },
        trend: trendMetrics,
        contentAnalysis
      };

      console.log(`[Tool: analyze_account] Analysis complete for ${username}`);

      // [NEW] Persist to Database with Expanded Columns
      if (supabaseAdmin) {
          try {
              const { error: insertError } = await supabaseAdmin
                  .from('analysis_history')
                  .insert({
                      username: targetUser,
                      full_analysis: result,
                      analyzed_at: new Date().toISOString(),
                      // Expanded Columns
                      followers: followersCount,
                      er: advancedMetrics.totalER,
                      bot_ratio: botRatio,
                      purchase_keyword_ratio: purchaseKeywordRatio,
                      tier: calculatedTier, // S, A, B, C, D
                      grade: null,         // Star, Rising (LLM Only)
                      profile_pic_url: profilePicUrl
                  });

              if (insertError) {
                  console.error("[Tool] Failed to save analysis to DB:", insertError);
              } else {
                  console.log("[Tool] Analysis saved to DB successfully.");
              }
          } catch (dbError) {
              console.error("[Tool] DB Error:", dbError);
          }
      }

      return JSON.stringify(result);

    } catch (error: any) {
      console.error("[Tool: analyze_account] Error:", error);
      
      // Error Classification logic
      let errorCode = "UNKNOWN_ERROR";
      let userMessage = "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      
      const errString = String(error);
      
      if (errString.includes("Page Not Found") || errString.includes("User not found")) {
          errorCode = "ACCOUNT_NOT_FOUND";
          userMessage = "계정을 찾을 수 없습니다. 아이디를 확인해주세요.";
      } else if (errString.includes("Rate limit")) {
          errorCode = "RATE_LIMIT";
          userMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
      } else if (errString.includes("Private account") || errString.includes("Auth check failed")) {
          errorCode = "PRIVATE_ACCOUNT";
          userMessage = "비공개 계정은 분석할 수 없습니다.";
      } else if (errString.includes("Target user not found")) {
           errorCode = "ACCOUNT_NOT_FOUND";
           userMessage = "계정을 찾을 수 없습니다.";
      }

      return JSON.stringify({ 
          error: {
              code: errorCode,
              message: userMessage,
              originalError: errString
          }
      });
    }
  },
});

