import genAI from "@/lib/gemini";
import { BRUTAL_ANALYST_SYSTEM_PROMPT } from "@/lib/prompts/brutal-analyst";
import { INSTAGRAM_ANALYSIS_SCHEMA } from "@/lib/schemas/analysis";
import { supabase } from "@/lib/supabase";
import { buildBrutalUserPrompt } from "@/services/instagram/prompt-builder";
import { calculateERTrend } from "@/services/instagram/trends";
import {
  calculateAuthenticity,
  calculateCampaignSuitability,
  calculateEngagementRate,
  getAccountGrade,
  getAccountTier,
  getAverageUploadCycle,
  getLatestPostDate,
  isMarketSuitable,
  isUserActive
} from "@/services/instagram/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { users, promptType = 'INSTA' } = body;

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 });
    }

    // Fetch analysis limit and system prompt from DB
    let analysisLimit = 10;
    let systemPrompt = BRUTAL_ANALYST_SYSTEM_PROMPT; // Default fallback
    
    // Validate promptType
    const validPromptType = (promptType === 'INSTA' || promptType === 'INSTA_TARGET') ? promptType : 'INSTA';

    try {
      // Parallel fetch for Settings and Prompt
      const [settingRes, promptRes] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'insta_analysis_limit').single(),
        supabase.from('prompts').select('content').eq('prompt_type', validPromptType).eq('is_default', true).single()
      ]);
      
      if (settingRes.data?.value) {
        analysisLimit = parseInt(settingRes.data.value, 10) || 10;
      }
      
      if (promptRes.data?.content) {
        systemPrompt = promptRes.data.content;
        console.log(`[DB Prompt] Using prompt from database for type: ${validPromptType}`);
        console.log(`[DB Prompt Preview] ${systemPrompt.substring(0, 100)}...`);
      } else {
        console.log(`[DB Prompt] No DB prompt found, using hardcoded fallback`);
      }
    } catch (e) {
      console.warn("Failed to fetch settings/prompt from DB, using defaults", e);
    }

    // Use imported schema for the analysis
    const analysisSchema = INSTAGRAM_ANALYSIS_SCHEMA;

    // Initialize Gemini Model with Strict Schema
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: analysisSchema as any, // Type cast to avoid strict typing issues with specific SDK versions
        temperature: 0.3
      }
    });

    // Initialize Apify Client
    const { ApifyClient } = await import("apify-client");
    const client = new ApifyClient({
        token: process.env.APIFY_API_TOKEN,
    });

    // Process each user
    const analyzedResults = await Promise.all(
      users.map(async (user: any) => {
        let followers = user.followers_count || 0;
        let fullName = user.full_name || '';
        let biography = user.biography || '';
        
        let isVerified = false;

        // [FRESH DATA FETCH]
        // Re-fetch profile details to ensure 100% accuracy (fix for stale search data)
        try {
            console.log(`[Analyze] Refreshing profile data for ${user.username}...`);
            const instaUsername = process.env.INSTAGRAM_USERNAME;
            const instaPassword = process.env.INSTAGRAM_PASSWORD;
            
            const run = await client.actor("apify/instagram-scraper").call({
                directUrls: [`https://www.instagram.com/${user.username}/`],
                resultsType: "details",
                resultsLimit: 1,
                username_login: instaUsername,
                password_login: instaPassword,
                loginUsername: instaUsername,
                loginPassword: instaPassword,
            });
            
            const { items } = await client.dataset(run.defaultDatasetId).listItems();
            if (items.length > 0) {
                const freshProfile = items[0] as any;
                if (freshProfile) {
                    const freshFollowers = freshProfile.followersCount || freshProfile.followerCount;
                    if (freshFollowers) {
                        console.log(`[Analyze] Fresh data applied for ${user.username}: ${followers} -> ${freshFollowers}`);
                        followers = freshFollowers;
                        fullName = freshProfile.fullName || fullName;
                        biography = freshProfile.biography || biography;
                        isVerified = true;
                        // Capture profile pic (Robust check)
                        const freshProfilePic = freshProfile.hdProfilePicUrlInfo?.url || freshProfile.profilePicUrl;
                        if (freshProfilePic) {
                            console.log(`[Analyze] Fresh profile pic acquired for ${user.username}`);
                            user.profile_pic_url = freshProfilePic; 
                        }
                    }
                }
            }
        } catch (fetchError) {
            console.warn(`[Analyze] Failed to refresh profile for ${user.username}, using provided data.`, fetchError);
        }

        // Pre-calculate metrics
        const tier = getAccountTier(followers);
        const erGrade = getAccountGrade(user);
        const engagementRate = calculateEngagementRate(user);
        const { authenticityScore, isFake } = calculateAuthenticity(user);
        const latestPostDate = getLatestPostDate(user);
        const isActive = isUserActive(latestPostDate);
        const avgUploadCycle = getAverageUploadCycle(user.recent_posts);
        const marketSuitable = isMarketSuitable(user, avgUploadCycle);
        const campaignSuitability = calculateCampaignSuitability(user);

        const preCalculatedMetrics = {
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

        // Calculate trend metrics using up to 30 posts
        const allPosts = (user.recent_posts || []).slice(0, 30);
        const postsForTrend = allPosts.map((post: any) => ({
          likes: post.likes || 0,
          comments: post.comments || 0, // [FIX] Match field name from search/route.ts
          timestamp: post.timestamp || ''
        }));
        const trendMetrics = calculateERTrend(postsForTrend, followers);
        console.log(`[TrendMetrics] Result for ${user.username}:`, trendMetrics ? JSON.stringify(trendMetrics) : 'null');

        // Prepare posts data (최근 10개만 AI 분석용)
        const postsData = allPosts
          .slice(0, analysisLimit)
          .map((post: any) => {
            const fanComments = (post.latest_comments || [])
              .filter((c: any) => c.ownerUsername !== user.username)
              .slice(0, 20);

            return {
              caption: post.caption || '',
              hashtags: post.hashtags || [],
              comments: fanComments.map((c: any) => ({
                username: c.ownerUsername || 'unknown',
                text: c.text || '',
                likes: c.likes || 0
              }))
            };
          });

        // Build brutal prompt with trend data
        const userPrompt = buildBrutalUserPrompt({
          username: user.username || '',
          fullName: user.full_name || '',
          biography: user.biography || '',
          followers: followers,
          metrics: { ...preCalculatedMetrics, erGrade: preCalculatedMetrics.erGrade || '미산정' },
          trendMetrics: trendMetrics || undefined,
          postsData: postsData
        });

        // Prepare images
        const imageParts = [];
        for (const post of user.recent_posts.slice(0, analysisLimit)) {
          if (post.imageUrl) {
            try {
              const imageResp = await fetch(post.imageUrl, {
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                  "Referer": "https://www.instagram.com/"
                }
              });

              if (imageResp.ok) {
                const imageBuffer = await imageResp.arrayBuffer();
                imageParts.push({
                  inlineData: {
                    data: Buffer.from(imageBuffer).toString("base64"),
                    mimeType: "image/jpeg"
                  }
                });
              }
            } catch (e) {
              console.error(`Failed to fetch image for ${user.username}`, e);
            }
          }
        }

        try {
          // Call Gemini Vision with brutal system prompt
          const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
          const result = await model.generateContent([fullPrompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();

          // Parse JSON
          let cleanedText = text
            .replace(/^```json\s*/, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/, '');
          
          console.log("=== [DEBUG] RAW AI RESPONSE START ===");
          console.log(cleanedText);
          console.log("=== [DEBUG] RAW AI RESPONSE END ===");

          let analysis = JSON.parse(cleanedText);
          console.log("[DEBUG] Schema-Enforced Parsed Keys:", Object.keys(analysis));
          
          // [SOURCE OF TRUTH ENFORCEMENT]
          // Overwrite AI's basicStats with hard-verified metrics to prevent hallucinations
          if (!analysis.basicStats) analysis.basicStats = {};
          analysis.basicStats.username = user.username;
          analysis.basicStats.followers = followers; // The fresh, verified number
          analysis.basicStats.profilePicUrl = user.profile_pic_url || analysis.basicStats.profilePicUrl || null;
          console.log(`[SourceOfTruth] Enforced ${followers} followers for ${user.username}`);

          console.log(`[Brutal Analysis Success] ${user.username}`, {
            tier: analysis.investmentAnalyst?.tier,
            decision: analysis.investmentAnalyst?.decision,
            totalScore: analysis.investmentAnalyst?.totalScore,
            // botRatio removed as it's not consistently available in normalized schema
          });
          
          if (!analysis.investmentAnalyst) {
             console.log(`[Analysis Structure Mismatch] Full response for ${user.username}:`, JSON.stringify(analysis, null, 2));
          }


          
          const verifiedProfile = {
                username: user.username,
                followers: followers,
                profilePicUrl: user.profile_pic_url || null,
                fullName: fullName,
                biography: biography,
                isVerified: isVerified // Flag to indicate if Apify actually worked
            };
          console.log(`[Analyze] Final Return for ${user.username}: Verified=${verifiedProfile.isVerified}, Followers=${verifiedProfile.followers}`);

          return {
            username: user.username,
            analysis,
            verifiedProfile,
            trendMetrics: trendMetrics || undefined,
            success: true
          };

        } catch (error: any) {
          console.error(`Brutal analysis failed for ${user.username}`, error);
          
          const blockMsg = error.response?.promptFeedback?.blockReason;
          if (blockMsg) {
            console.error(`Blocked Reason: ${blockMsg}`);
          }

          return {
            username: user.username,
            success: false,
            error: error.message || "Unknown error"
          };
        }
      })
    );

    return NextResponse.json({ results: analyzedResults });

  } catch (error: any) {
    console.error("Brutal Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
