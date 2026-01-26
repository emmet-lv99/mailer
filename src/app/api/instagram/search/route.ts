
import client from "@/lib/apify";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Actor ID for Instagram Scraper (apify/instagram-scraper is a good choice, but requires login sometimes)
// Alternative: apify/instagram-hashtag-scraper for hashtag search

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, limit = 10, mode = 'tag' } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const results: any[] = [];
    let discoveryItems: any[] = [];
    let detailItems: any[] = [];
    let targetUsernames: string[] = [];

    // Fetch Settings
    let postLimit = 10;
    try {
        const { data: setting } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'insta_post_limit')
            .single();
        
        if (setting && setting.value) {
            postLimit = parseInt(setting.value, 10) || 10;
        }
    } catch (e) {
        console.warn("Failed to fetch settings, using default postLimit 10", e);
    }

    // --- REAL EXECUTION (Only if token exists) ---
    if (process.env.APIFY_API_TOKEN) {
        try {
            // TARGET MODE: Skip Discovery, Direct Lookup
            if (mode === 'target') {
                const username = keyword.replace(/^@/, '').trim();
                targetUsernames = [username];
                console.log(`[Target Search] Looking up specific user: ${username}`);
            } 
            // TAG MODE: Discovery via Hashtag
            else {
                // Step 1: Discover Users via Hashtag
                const isHashtag = keyword.startsWith("#");
                const query = isHashtag ? keyword.slice(1) : keyword;
                
                const discoveryInput = {
                    hashtags: [query],
                    maxPostsPerHashtag: limit * 2,
                    scrapeMode: "recent" as const,
                };
                
                // Use hashtag scraper for discovery
                const discoveryRun = await client.actor("apify/instagram-hashtag-scraper").call(discoveryInput);
                const discoveryDataset = await client.dataset(discoveryRun.defaultDatasetId).listItems();
                discoveryItems = discoveryDataset.items;
                
                // Extract unique usernames
                const uniqueUsernames = new Set<string>();
                for (const item of (discoveryItems as any[])) {
                    if (item.ownerUsername && uniqueUsernames.size < limit) {
                         uniqueUsernames.add(item.ownerUsername);
                    }
                }
                
                targetUsernames = Array.from(uniqueUsernames);
            }
            
            if (targetUsernames.length > 0) {
                // Step 2: Fetch Details for these Users (Profile Scraper)
                console.log(`[Step 2] Fetching details for users: ${targetUsernames.join(", ")}`);
                
                try {
                    // Method A: directUrls (Most reliable for profile scraping)
                    const directUrls = targetUsernames.map(u => `https://www.instagram.com/${u}/`);
                    
                    const detailInput = {
                        directUrls: directUrls,
                        resultsType: "details",
                        resultsLimit: 10, // Increased post limit
                        searchLimit: 1,
                        commentsPerPost: 20, // [NEW] Fetch top 20 comments per post
                    };
                    
                    console.log(`[Step 2] Scraping profiles using directUrls: ${directUrls.length} links`);
                    const detailRun = await client.actor("apify/instagram-scraper").call(detailInput);
                    const detailDataset = await client.dataset(detailRun.defaultDatasetId).listItems();
                    detailItems = detailDataset.items;
                    console.log(`[Step 2] Fetched ${detailItems.length} detailed profiles.`);
                } catch (e) {
                    console.error("[Step 2] Profile scrape failed, using fallback:", e);
                }
            }
        } catch (e) {
            console.error("Apify execution failed:", e);
        }
    } else {
        console.warn("APIFY_API_TOKEN is missing. Skipping real execution.");
    }
    
    // --- RESULT PROCESSING (CASCADE STRATEGY) ---
    
    // Attempt 1: Process detailed items (Step 2)
    if (detailItems.length > 0) {
        for (const item of (detailItems as any[])) {
            const username = item.username;
            if (!username) continue; // Skip invalid items

            const latestPosts = item.latestPosts || [];
            
            const recent_posts = latestPosts.slice(0, postLimit).map((post: any) => ({
                id: post.id || "",
                caption: post.caption || "",
                imageUrl: post.displayUrl || post.thumbnailUrl || "",
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0,
                views: post.videoViewCount || 0, // Reels/Video views
                type: post.type || "Image", // Image, Video, Sidecar
                productType: post.productType || "feed", // clips = Reels
                timestamp: post.timestamp || new Date().toISOString(),
                latest_comments: (post.latestComments || []).map((c: any) => ({
                    text: c.text || "",
                    ownerUsername: c.ownerUsername || "",
                    timestamp: c.timestamp || ""
                }))
            }));
            
            results.push({
                username: username,
                full_name: item.fullName || "",
                followers_count: item.followersCount || 0,
                biography: item.biography || "",
                profile_pic_url: item.profilePicUrl || "",
                recent_posts: recent_posts,
                status: 'todo'
            });
        }
    }

    // Attempt 2: Fallback to Discovery items (Step 1) if Details failed to produce results
    if (results.length === 0 && targetUsernames.length > 0) {
        console.warn("[Processing] No valid users from Details. Fallback to Discovery data.");
        
        // Match discovery items to unique usernames
        for (const username of targetUsernames) {
             const representative = (discoveryItems as any[]).find(i => i.ownerUsername === username);
             if (representative) {
                 results.push({
                     username: username,
                     full_name: representative.ownerFullName || "",
                     followers_count: -1, // -1 indicates Unknown (not scraped)
                     biography: "상세 정보 로딩 실패 (Step 2 Error)", // Indicate incomplete data
                     profile_pic_url: "", // Not available
                     recent_posts: [{
                         caption: representative.caption || "",
                         imageUrl: representative.displayUrl || "",
                         likes: representative.likesCount || 0,
                         comments: representative.commentsCount || 0,
                         timestamp: representative.timestamp || new Date().toISOString()
                     }],
                     status: 'todo'
                 });
             }
        }
    }

    // No mock data fallback - check for fallback URL if scraping failed
    let fallbackUrl: string | null = null;
    if (results.length === 0) {
        // Extract fallback URL from discovery items if available
        const errorItem = (discoveryItems as any[]).find(item => item.url && item.error);
        if (errorItem?.url) {
            fallbackUrl = errorItem.url;
        }
    }
    // -----------------------------------------------------------

    // 4. Check against DB (Validation)
    // Find registered users
    const usernames = results.map(r => r.username);
    const { data: existingUsers } = await supabase
        .from("instagram_targets")
        .select("username, status")
        .in("username", usernames);

    const existingMap = new Map(existingUsers?.map(u => [u.username, u.status]));

    // Mark status
    const finalResults = results.map(user => ({
        ...user,
        db_status: existingMap.get(user.username) || null,
        is_registered: existingMap.has(user.username),
        // Filter logic: 5k ~ 100k
        is_target_range: user.followers_count >= 5000 && user.followers_count <= 100000
    }));

    return NextResponse.json({ 
        results: finalResults,
        fallbackUrl: fallbackUrl, // Add fallback URL when scraping fails
        meta: {
            keyword: keyword,
            count: finalResults.length,
        }
    });

  } catch (error: any) {
    console.error("Route Handler Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
