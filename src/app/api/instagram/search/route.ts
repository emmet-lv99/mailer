
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
    console.log(`[Instagram Search] Using postLimit: ${postLimit} (트렌드 분석용 최소 30개 필요)`);

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
                    maxPostsPerHashtag: limit * 10,
                    scrapeMode: "recent" as const,
                };
                
                // Use hashtag scraper for discovery
                const discoveryRun = await client.actor("apify/instagram-hashtag-scraper").call(discoveryInput);
                const discoveryDataset = await client.dataset(discoveryRun.defaultDatasetId).listItems();
                discoveryItems = discoveryDataset.items;
                
                // Extract unique usernames
                // [BUFFER STRATEGY] specific details fetch might fail (private, etc), so we fetch 1.5x candidates
                const candidateLimit = Math.ceil(limit * 1.5);
                const uniqueUsernames = new Set<string>();
                for (const item of (discoveryItems as any[])) {
                    if (item.ownerUsername && uniqueUsernames.size < candidateLimit) {
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
                    
                    // Instagram login credentials from ENV (enables 30+ posts scraping)
                    const instaUsername = process.env.INSTAGRAM_USERNAME;
                    const instaPassword = process.env.INSTAGRAM_PASSWORD;
                    
                    // Prepare parallel actor inputs
                    const commonInput = {
                        directUrls: directUrls,
                        searchLimit: 1,
                        commentsPerPost: 20,
                        username_login: instaUsername,
                        password_login: instaPassword,
                        loginUsername: instaUsername,
                        loginPassword: instaPassword,
                    };

                    console.log(`[Step 2] Scraping profiles using directUrls: ${directUrls.length} links (Parallel Details + Posts)`);
                    
                    // Run both Details (metadata) and Posts (30 posts) in parallel
                    const [detailRun, postsRun] = await Promise.all([
                        client.actor("apify/instagram-scraper").call({
                            ...commonInput,
                            resultsType: "details",
                            resultsLimit: directUrls.length,
                        }),
                        client.actor("apify/instagram-scraper").call({
                            ...commonInput,
                            resultsType: "posts",
                            resultsLimit: directUrls.length * postLimit,
                            maxPosts: postLimit,
                        })
                    ]);

                    const [detailDataset, postsDataset] = await Promise.all([
                        client.dataset(detailRun.defaultDatasetId).listItems(),
                        client.dataset(postsRun.defaultDatasetId).listItems()
                    ]);
                    
                    // 1. Map profile info from Detail items (normalize username to lowercase)
                    const profileInfoMap = new Map<string, any>();
                    for (const item of (detailDataset.items as any[])) {
                        const username = (item.username as string)?.toLowerCase();
                        if (username) {
                            profileInfoMap.set(username, item);
                        }
                    }

                    // 2. Aggregate posts from Posts items (normalize username to lowercase)
                    const aggregatedUsers = new Map<string, any>();
                    for (const post of (postsDataset.items as any[])) {
                        const originalUsername = (post.ownerUsername || post.username) as string;
                        if (!originalUsername) continue;
                        const username = originalUsername.toLowerCase();
                        
                        if (!aggregatedUsers.has(username)) {
                            // Get rich metadata from the Profile Scrape if available
                            const profileInfo = profileInfoMap.get(username) || {};
                            const owner = post.owner || {};

                            aggregatedUsers.set(username, {
                                username: originalUsername, // Keep original casing for display
                                fullName: profileInfo.fullName || post.ownerFullName || owner.fullName || post.fullName || "",
                                followersCount: profileInfo.followersCount || post.ownerFollowersCount || owner.followersCount || owner.edge_followed_by?.count || 0,
                                biography: profileInfo.biography || post.ownerBiography || owner.biography || "",
                                profilePicUrl: profileInfo.profilePicUrl || post.ownerProfilePicUrl || owner.profilePicUrl || post.profilePicUrl || "",
                                postsCount: profileInfo.postsCount || post.ownerPostsCount || owner.postsCount || 0,
                                latestPosts: []
                            });
                        }
                        
                        const userData = aggregatedUsers.get(username);
                        if (userData) {
                            userData.latestPosts.push(post);
                        }
                    }
                    
                    detailItems = Array.from(aggregatedUsers.values());
                    
                    // 3. Fallback: If some users were found in details but not posts, add them
                    for (const [username, profile] of profileInfoMap) {
                        if (!aggregatedUsers.has(username)) {
                            detailItems.push(profile);
                        }
                    }

                    console.log(`[Step 2] Fetched and merged ${detailItems.length} detailed profiles.`);
                } catch (e) {
                    console.error("[Step 2] Profile parallel scrape failed:", e);
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
            console.log(`[Posts Count] ${username}: Apify returned ${latestPosts.length} posts, using ${Math.min(latestPosts.length, postLimit)} for trend analysis`);
            
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
                full_name: item.fullName || item.full_name || "",
                followers_count: item.followersCount || item.followers_count || 0,
                biography: item.biography || "",
                profile_pic_url: item.profilePicUrl || item.profile_pic_url || "",
                recent_posts: recent_posts,
                posts_count: item.postsCount || item.posts_count || 0,
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

    // Mark status and Cut to requested limit
    const finalResults = results
        .slice(0, limit) // [BUFFER FIX] Ensure we only return requested amount
        .map(user => ({
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
