
import client from "@/lib/apify";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Actor ID for Instagram Scraper (apify/instagram-scraper is a good choice, but requires login sometimes)
// Alternative: apify/instagram-hashtag-scraper for hashtag search

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, limit = 10 } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const results: any[] = [];
    let discoveryItems: any[] = [];
    let detailItems: any[] = [];
    let targetUsernames: string[] = [];

    // --- REAL EXECUTION (Only if token exists) ---
    if (process.env.APIFY_API_TOKEN) {
        try {
            // Step 1: Discover Users via Hashtag
            const isHashtag = keyword.startsWith("#");
            const query = isHashtag ? keyword.slice(1) : keyword;
            
            console.log(`[Step 1] Discovering users for hashtag: ${query}`);
            const discoveryInput = {
                hashtags: [query],
                resultsLimit: limit * 2, // Fetch more posts to ensure we get enough unique users
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
            console.log(`[Step 1] Found ${targetUsernames.length} unique users.`);
            
            if (targetUsernames.length > 0) {
                // Step 2: Fetch Details for these Users (Profile Scraper)
                console.log(`[Step 2] Fetching details for users: ${targetUsernames.join(", ")}`);
                
                try {
                    // Method A: directUrls (Most reliable for profile scraping)
                    const directUrls = targetUsernames.map(u => `https://www.instagram.com/${u}/`);
                    
                    const detailInput = {
                        directUrls: directUrls,
                        resultsType: "details",
                        resultsLimit: 5, // Per URL usually, or total? Safety check.
                        searchLimit: 1,
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
            
            const recent_posts = latestPosts.slice(0, 5).map((post: any) => ({
                caption: post.caption || "",
                imageUrl: post.displayUrl || post.thumbnailUrl || "",
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0,
                timestamp: post.timestamp || new Date().toISOString()
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
                     followers_count: 0, // Not available
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

    // Attempt 3: Final Fallback to Mock Data if ALL scraping failed or no token
    if (results.length === 0) {
        console.warn("[Processing] No results from Discovery either. Generating MOCK data.");
        const mockData = Array.from({ length: limit }).map((_, i) => ({
            username: `simulated_${keyword}_${i + 1}`,
            full_name: `Simulation User ${i + 1}`,
            followers_count: Math.floor(Math.random() * 50000) + 1000,
            biography: `API 호출 전면 실패로 생성된 가상 데이터입니다. (${i+1})`,
            profile_pic_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${keyword}${i}`,
            recent_posts: Array.from({ length: 5 }).map((_, j) => ({
                caption: `Mock Post ${j+1}`,
                imageUrl: `https://placehold.co/300x300?text=Mock${j+1}`,
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 10),
                timestamp: new Date(Date.now() - (86400000 * Math.floor(Math.random() * 10))).toISOString()
            })),
            status: 'todo'
        }));
        results.push(...mockData);
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
        meta: {
            keyword: keyword,
            count: finalResults.length,
            mock: results[0]?.username?.startsWith('simulated_') // Flag if mock data was used
        }
    });

  } catch (error: any) {
    console.error("Route Handler Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
