
import client from "@/lib/apify";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Actor ID for Instagram Scraper (apify/instagram-scraper is a good choice, but requires login sometimes)
// Alternative: apify/instagram-hashtag-scraper for hashtag search
// Let's assume we use a hashtag scraper for "discovery" or profile scraper for "details"
// For now, let's try 'apify/instagram-scraper' for profile search if input looks like a username,
// or 'apify/instagram-hashtag-scraper' if it looks like a hashtag.

// NOTE: We will mock the response structure based on standard Apify output for now,
// as running actual Actor costs money and takes time. 
// However, the code below is setup to run the actual actor.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, limit = 10 } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // 1. Check if token exists
    if (!process.env.APIFY_API_TOKEN) {
         console.warn("APIFY_API_TOKEN is missing. Using MOCK data.");
         
         // --- MOCK DATA GENERATION ---
         const mockResults = Array.from({ length: limit }).map((_, i) => ({
            username: `mock_${keyword}_${i + 1}`,
            full_name: `Mock User ${i + 1} (${keyword})`,
            followers_count: Math.floor(Math.random() * 90000) + 5000, // 5k ~ 95k
            biography: `This is a mock biography for ${keyword} #${i + 1}`,
            profile_pic_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
            recent_posts: [
                { caption: `Recent post about #${keyword} 1`, imageUrl: "https://placehold.co/300x300?text=Post1", likes: Math.floor(Math.random() * 500), comments: Math.floor(Math.random() * 50), timestamp: new Date().toISOString() },
                { caption: `Recent post about #${keyword} 2`, imageUrl: "https://placehold.co/300x300?text=Post2", likes: Math.floor(Math.random() * 500), comments: Math.floor(Math.random() * 50), timestamp: new Date(Date.now() - 86400000).toISOString() }
            ],
            status: 'todo'
         }));
         
         // Mock DB Check
         const usernames = mockResults.map(r => r.username);
         const { data: existingUsers } = await supabase
            .from("instagram_targets")
            .select("username, status")
            .in("username", usernames);

         const existingMap = new Map(existingUsers?.map(u => [u.username, u.status]));

         const finalResults = mockResults.map(user => ({
            ...user,
            db_status: existingMap.get(user.username) || null,
            is_registered: existingMap.has(user.username),
            is_target_range: user.followers_count >= 5000 && user.followers_count <= 100000
         }));

         return NextResponse.json({ 
            results: finalResults,
            meta: { keyword: keyword, count: finalResults.length, mock: true }
         });
    }

    // 2. Decide Actor based on input (Basic heuristic)
    const isHashtag = keyword.startsWith("#");
    const query = isHashtag ? keyword.slice(1) : keyword;
    
    // For this specific task, let's assume we are searching for profiles related to a hashtag
    // using a Hashtag Scraper is more appropriate for discovery.
    // Actor: apify/instagram-hashtag-scraper
    const ACTOR_ID = "apify/instagram-hashtag-scraper";

    // Since we want to find "Users", hashtag scraper usually gives Posts.
    // We would need to extract unique users from those posts.
    
    // Simplify for now: Request implies "Search", maybe we use a Search Actor or mimic search.
    // Let's use a standard search input for the scraper if available.
    
    // ACTUALLY, usually users want to search by Hashtag to find influencers.
    // Let's run the Hashtag Scraper.
    
    const runInput = {
        hashtags: [query],
        resultsLimit: limit,
    };

    // Start execution
    console.log(`Starting Apify execution for: ${query}`);
    

    // --- REAL EXECUTION ---
    // Using apify/instagram-hashtag-scraper structure based on user sample
    const run = await client.actor(ACTOR_ID).call(runInput);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    // --- PROCESSING LOGIC based on provided JSON structure ---
    const uniqueUsersMap = new Map();
    
    // Type definition for the scraper result item (partial)
    type ScraperItem = {
        id: string;
        code?: string; // shortCode
        shortCode?: string;
        caption: string;
        displayUrl: string;
        videoUrl?: string; // If video
        ownerId: string;
        ownerUsername: string;
        ownerFullName: string;
        commentsCount: number;
        likesCount: number;
        timestamp: string;
        // Hashtag scraper usually doesn't provide follower count directly in post object
        // We might need to assume 0 or fetch separately if needed.
        // For efficiency, we will store 0 or null and fetch details later in "Analysis" phase.
    };

    // The user provided JSON shows items are posts.
    for (const item of (items as unknown as ScraperItem[])) {
        const username = item.ownerUsername;
        if (!username) continue;

        if (!uniqueUsersMap.has(username)) {
            uniqueUsersMap.set(username, {
                username: username,
                full_name: item.ownerFullName || "",
                followers_count: 0, // Not available in hashtag search results usually
                biography: "", // Not available
                profile_pic_url: "", // Not available directly in post object usually, sometimes in owner object if detailed
                recent_posts: [],
                status: 'todo'
            });
        }
        
        const user = uniqueUsersMap.get(username);
        // Add up to 3 recent posts found
        if (user.recent_posts.length < 3) {
            user.recent_posts.push({
                caption: item.caption,
                imageUrl: item.displayUrl,
                likes: item.likesCount === -1 ? 0 : item.likesCount, // -1 often means hidden
                comments: item.commentsCount,
                timestamp: item.timestamp
            });
        }
    }

    const results = Array.from(uniqueUsersMap.values());
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
            keyword: query,
            count: finalResults.length
        }
    });

  } catch (error: any) {
    console.error("Apify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
