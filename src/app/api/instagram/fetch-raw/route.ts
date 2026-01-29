import { supabaseAdmin } from "@/lib/supabase";
import {
  calculateAuthenticity,
  calculateCampaignSuitability,
  calculateEngagementRate,
  calculateTrendMetrics,
  getAccountGrade,
  getAccountTier,
  getAverageUploadCycle,
  getLatestPostDate,
  isMarketSuitable,
  isUserActive
} from "@/services/instagram/utils";
import { NextResponse } from "next/server";

// Trend Logic moved to @/services/instagram/utils

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { users } = body;

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 });
    }

    // Initialize Apify Client
    const { ApifyClient } = await import("apify-client");
    const client = new ApifyClient({
        token: process.env.APIFY_API_TOKEN,
    });

    const results = await Promise.all(users.map(async (userInput: any) => {
        let user = { ...userInput }; // Clone to avoid mutation issues
        let followers = user.followers_count || 0;
        let fullName = user.full_name || '';
        let biography = user.biography || '';
        let isVerified = false;
        let fetchedPosts: any[] = user.recent_posts || [];

        try {
            console.log(`[FetchRaw] Refreshing profile data for ${user.username}...`);
            const instaUsername = process.env.INSTAGRAM_USERNAME;
            const instaPassword = process.env.INSTAGRAM_PASSWORD;
            
            // Fetch Details First
            const profileRun = await client.actor("apify/instagram-scraper").call({
                directUrls: [`https://www.instagram.com/${user.username}/`],
                resultsType: "details",
                resultsLimit: 1,
                username_login: instaUsername,
                password_login: instaPassword,
                loginUsername: instaUsername,
                loginPassword: instaPassword,
            });
            
            const { items: profileItems } = await client.dataset(profileRun.defaultDatasetId).listItems();
            if (profileItems.length > 0) {
                const freshProfile = profileItems[0] as any;
                if (freshProfile) {
                    const freshFollowers = freshProfile.followersCount || freshProfile.followerCount;
                    if (freshFollowers) {
                        console.log(`[FetchRaw] Fresh data applied for ${user.username}: ${followers} -> ${freshFollowers}`);
                        followers = freshFollowers;
                        fullName = freshProfile.fullName || fullName;
                        biography = freshProfile.biography || biography;
                        isVerified = true;
                        
                        // Robust Profile Pic Check
                        const freshProfilePic = freshProfile.hdProfilePicUrlInfo?.url || freshProfile.profilePicUrl;
                        if (freshProfilePic) {
                            user.profile_pic_url = freshProfilePic; 
                        }
                    }
                }
            }

            // Fetch Posts if needed (or refetch to be sure)
            // For separate stages, we might want fresh posts too.
            // Let's assume we want fresh posts for the 'Deep Analysis'
            
            /* 
               Optimization: If we already have recent_posts from 'search' and they are recent enough, 
               we might skip this. But for 'Deep Analysis' we often want 30 posts for trend analysis.
               Let's fetch fresh 30 posts here.
            */
             // Fetch Settings for Limit
            let postLimit = 30; // Default for deep analysis
            try {
                if (supabaseAdmin) {
                    const { data: settings } = await supabaseAdmin // Use admin client for settings if needed
                        .from('settings')
                        .select('value')
                        .eq('key', 'insta_post_limit')
                        .single();
                    
                    if (settings?.value) {
                        postLimit = parseInt(settings.value, 10) || 30;
                    }
                }
            } catch (e) {
                // Ignore settings fetch error
            }

             const postsRun = await client.actor("apify/instagram-scraper").call({
                directUrls: [`https://www.instagram.com/${user.username}/`],
                resultsType: "posts",
                resultsLimit: postLimit, // Use dynamic limit

                username_login: instaUsername,
                password_login: instaPassword,
                loginUsername: instaUsername,
                loginPassword: instaPassword,
            });

            const { items: postItems } = await client.dataset(postsRun.defaultDatasetId).listItems();
            if (postItems.length > 0) {
                 fetchedPosts = postItems.map((p: any) => ({
                    ...p,
                    likes: p.likesCount || p.likes || 0,
                    comments: p.commentsCount || p.comments || 0, // Normalize
                    timestamp: p.timestamp || p.date || new Date().toISOString()
                 }));
                 // Update user object behavior for metrics util
                 user.recent_posts = fetchedPosts;
            }

        } catch (fetchError) {
            console.warn(`[FetchRaw] Failed to refresh for ${user.username}`, fetchError);
        }

        // Calculate Metrics Locally directly
        const tier = getAccountTier(followers);
        const erGrade = getAccountGrade(user);
        const engagementRate = calculateEngagementRate(user);
        const { authenticityScore, isFake } = calculateAuthenticity(user);
        const latestPostDate = getLatestPostDate(user);
        const isActive = isUserActive(latestPostDate);
        const avgUploadCycle = getAverageUploadCycle(user.recent_posts); // Uses normalized recent_posts
        const marketSuitable = isMarketSuitable(user, avgUploadCycle);
        const campaignSuitability = calculateCampaignSuitability(user);

        const metrics = {
          tier,
          erGrade,
          engagementRate,
          authenticityScore,
          isFake,
          isActive,
          avgUploadCycle,
          marketSuitable,
          campaignSuitability
        };

        // Trend Metrics
        const trendMetrics = calculateTrendMetrics(fetchedPosts, followers);

        return {
            username: user.username,
            verifiedProfile: {
                username: user.username,
                followers: followers,
                profilePicUrl: user.profile_pic_url || null,
                fullName: fullName,
                biography: biography,
                isVerified
            },
            metrics,
            trendMetrics,
            recent_posts: fetchedPosts, // Return raw posts for next stage
            success: true
        };

    }));

    return NextResponse.json({ results });

  } catch (error: any) {
    console.error("FetchRaw Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
