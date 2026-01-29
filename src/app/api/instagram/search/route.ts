
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
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            
            // Shared state variables
            let discoveryItems: any[] = [];
            let detailItems: any[] = [];
            let targetUsernames: string[] = [];
            
            // Helper to send logs to client
            const sendLog = (message: string) => {
                const logChunk = JSON.stringify({ type: 'log', message }) + '\n';
                controller.enqueue(encoder.encode(logChunk));
                console.log(message); // Keep server-side logging
            };

            // Helper to send final result
            const sendResult = (data: any) => {
                const resultChunk = JSON.stringify({ type: 'result', data }) + '\n';
                controller.enqueue(encoder.encode(resultChunk));
            };

            // Helper to send error
            const sendError = (message: string, code: number = 500) => {
                const errorChunk = JSON.stringify({ type: 'error', message, code }) + '\n';
                controller.enqueue(encoder.encode(errorChunk));
            };

            try {
                // Fetch Settings
                let postLimit = 10;
                let tagLimit = 10;
                try {
                    const { data: settings } = await supabase
                        .from('settings')
                        .select('key, value')
                        .in('key', ['insta_post_limit', 'insta_tag_limit']);
                    
                    if (settings) {
                        const pSetting = settings.find(s => s.key === 'insta_post_limit');
                        if (pSetting?.value) postLimit = parseInt(pSetting.value, 10) || 10;

                        const tSetting = settings.find(s => s.key === 'insta_tag_limit');
                        if (tSetting?.value) tagLimit = parseInt(tSetting.value, 10) || 10;
                    }
                } catch (e) {
                    sendLog("⚠️ 설정 로딩 실패, 기본값을 사용합니다.");
                }
                sendLog(`[System] 설정 로드 완료 (Post: ${postLimit}, Tag: ${tagLimit})`);

                // --- REAL EXECUTION (Only if token exists) ---
                if (process.env.APIFY_API_TOKEN) {
                    try {
                        // [TIMEOUT PROTECTION] Wrap Apify logic in a race with a timeout
                        // [TIMEOUT PROTECTION] Removed by user request
                        // const TIMEOUT_MS = 60_000;

                        const apifyTask = async () => {
                            // TARGET MODE: Skip Discovery, Direct Lookup
                            if (mode === 'target') {
                                const username = keyword.replace(/^@/, '').trim();
                                targetUsernames = [username];
                                sendLog(`[Target] '${username}' 계정을 직접 조회합니다.`);
                            } 
                            // TAG MODE: Discovery via Hashtag
                            else {
                                sendLog(`[Discovery] #${keyword} 해시태그로 연관 계정을 탐색합니다...`);
                                // Step 1: Discover Users via Hashtag
                                const isHashtag = keyword.startsWith("#");
                                const query = isHashtag ? keyword.slice(1) : keyword;
                                
                                const instaUsername = process.env.INSTAGRAM_USERNAME;
                                const instaPassword = process.env.INSTAGRAM_PASSWORD;

                                const discoveryInput = {
                                    hashtags: [query],
                                    maxPostsPerHashtag: tagLimit * 1, // Use Separate Tag Limit
                                    scrapeMode: "recent" as const,
                                    username_login: instaUsername,
                                    password_login: instaPassword,
                                    loginUsername: instaUsername,
                                    loginPassword: instaPassword,
                                };
                                
                                // Use hashtag scraper for discovery
                                const discoveryRun = await client.actor("apify/instagram-hashtag-scraper").call(discoveryInput);
                                const discoveryDataset = await client.dataset(discoveryRun.defaultDatasetId).listItems();
                                discoveryItems = discoveryDataset.items;
                                
                                sendLog(`[Discovery] ${discoveryItems.length}개의 포스트를 발견했습니다.`);
                                
                                // Extract unique usernames
                                const candidateLimit = Math.ceil(limit * 1.5);
                                const uniqueUsernames = new Set<string>();
                                for (const item of (discoveryItems as any[])) {
                                    if (item.ownerUsername && uniqueUsernames.size < candidateLimit) {
                                         uniqueUsernames.add(item.ownerUsername);
                                    }
                                }
                                
                                targetUsernames = Array.from(uniqueUsernames);
                                sendLog(`[Filter] 중복 제거 후 ${targetUsernames.length}명의 분석 대상을 선정했습니다.`);
                            }
                            
                            if (targetUsernames.length > 0) {
                                // Step 2: Fetch Details for these Users (Profile Scraper)
                                sendLog(`[Step 2] ${targetUsernames.length}명의 상세 정보를 수집합니다. (예상 소요시간: 약 ${targetUsernames.length * 60}초)`);
                                
                                try {
                                    // Method A: directUrls
                                    const directUrls = targetUsernames.map(u => `https://www.instagram.com/${u}/`);
                                    
                                    const instaUsername = process.env.INSTAGRAM_USERNAME;
                                    const instaPassword = process.env.INSTAGRAM_PASSWORD;
                                    
                                    const commonInput = {
                                        directUrls: directUrls,
                                        searchLimit: 1,
                                        commentsPerPost: 30,
                                        username_login: instaUsername,
                                        password_login: instaPassword,
                                        loginUsername: instaUsername,
                                        loginPassword: instaPassword,
                                    };

                                    let detailRun, postsRun;

                                    // [STABILIZATION] Logic: Streaming logs for progress
                                    if (directUrls.length > 1) {
                                        sendLog(`[Mode] 다중 검색(Tag Mode) - 안정성을 위해 순차적으로 데이터를 수집합니다.`);
                                        
                                        sendLog(`[Collecting] 1/2 단계: 프로필 기본 정보 수집 중...`);
                                        detailRun = await client.actor("apify/instagram-scraper").call({
                                            ...commonInput,
                                            resultsType: "details",
                                            resultsLimit: directUrls.length,
                                        });
                                        
                                        sendLog(`[Collecting] 2/2 단계: 최근 게시물 상세 분석 중...`);
                                        postsRun = await client.actor("apify/instagram-scraper").call({
                                            ...commonInput,
                                            resultsType: "posts",
                                            resultsLimit: directUrls.length * postLimit,
                                            maxPosts: postLimit,
                                        });
                                    } else {
                                        sendLog(`[Mode] 단일 검색(Target Mode) - 고속 병렬 수집을 시작합니다.`);
                                        [detailRun, postsRun] = await Promise.all([
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
                                    }
                                    
                                    sendLog(`[Processing] 수집된 데이터 병합 및 분석 중...`);

                                    const [detailDataset, postsDataset] = await Promise.all([
                                        client.dataset(detailRun.defaultDatasetId).listItems(),
                                        client.dataset(postsRun.defaultDatasetId).listItems()
                                    ]);
                                    
                                    // 1. Map profile info
                                    const profileInfoMap = new Map<string, any>();
                                    for (const item of (detailDataset.items as any[])) {
                                        const username = (item.username as string)?.toLowerCase();
                                        if (username) {
                                            profileInfoMap.set(username, item);
                                        }
                                    }

                                    // 2. Aggregate posts
                                    const aggregatedUsers = new Map<string, any>();
                                    for (const post of (postsDataset.items as any[])) {
                                        const originalUsername = (post.ownerUsername || post.username) as string;
                                        if (!originalUsername) continue;
                                        const username = originalUsername.toLowerCase();
                                        
                                        if (!aggregatedUsers.has(username)) {
                                            const profileInfo = profileInfoMap.get(username) || {};
                                            const owner = post.owner || {};

                                            aggregatedUsers.set(username, {
                                                username: originalUsername,
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
                                    
                                    // 3. Fallback
                                    for (const [username, profile] of profileInfoMap) {
                                        if (!aggregatedUsers.has(username)) {
                                            detailItems.push(profile);
                                        }
                                    }
                                    sendLog(`[Complete] ${detailItems.length}명의 데이터를 성공적으로 확보했습니다.`);
                                } catch (e) {
                                    console.error("[Step 2] Profile scraper failed:", e);
                                    throw e; 
                                }
                            }
                        };
                        
                        // Execute without Timeout
                        await apifyTask();

                    } catch (e: any) {
                        console.error("Apify execution failed:", e);
                         // Timeout error handling removed
                    }
                } else {
                    sendLog("⚠️ API Token이 없습니다. 실제 수집을 건너뜁니다.");
                }
                
                // --- RESULT PROCESSING (CASCADE STRATEGY) ---
                
                // Attempt 1: Process detailed items (Step 2)
                if (detailItems.length > 0) {
                    for (const item of (detailItems as any[])) {
                        const username = item.username;
                        if (!username) continue; 

                        const latestPosts = item.latestPosts || [];
                        const recent_posts = latestPosts.slice(0, postLimit).map((post: any) => ({
                            id: post.id || "",
                            caption: post.caption || "",
                            hashtags: post.hashtags || [],
                            mentions: post.mentions || [],
                            imageUrl: post.displayUrl || post.thumbnailUrl || "",
                            likes: post.likesCount || 0,
                            comments: post.commentsCount || 0,
                            views: post.videoViewCount || 0,
                            type: post.type || "Image",
                            productType: post.productType || "feed",
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

                // Attempt 2: Fallback to Discovery items
                if (results.length === 0 && targetUsernames.length > 0) {
                    sendLog("⚠️ 상세 정보를 가져오지 못해 기본 정보로 대체합니다.");
                    // Match discovery items to unique usernames
                    for (const username of targetUsernames) {
                        const representative = (discoveryItems as any[]).find(i => i.ownerUsername === username);
                        if (representative) {
                            results.push({
                                username: username,
                                full_name: representative.ownerFullName || "",
                                followers_count: -1,
                                biography: "상세 정보 로딩 실패 (Step 2 Error)",
                                profile_pic_url: "",
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

                // Check fallback URL
                let fallbackUrl: string | null = null;
                if (results.length === 0) {
                    const errorItem = (discoveryItems as any[]).find(item => item.url && item.error);
                    if (errorItem?.url) {
                        fallbackUrl = errorItem.url;
                        sendLog("⚠️ 검색 결과가 없습니다. 인스타그램에서 직접 확인이 필요합니다.");
                    }
                }

                const usernames = results.map(r => r.username);
                
                // Parallel Fetch: Targets & Analysis History
                const [targetsRes, historyRes] = await Promise.all([
                    supabase
                        .from("instagram_targets")
                        .select("username, status")
                        .in("username", usernames),
                    supabase
                        .from("analysis_history")
                        .select("username, analyzed_at")
                        .in("username", usernames)
                        .order("analyzed_at", { ascending: false })
                ]);

                const existingUsers = targetsRes.data;
                const analysisHistory = historyRes.data;

                const existingMap = new Map(existingUsers?.map(u => [u.username, u.status]));
                
                // Get latest date per user
                const historyMap = new Map<string, string>();
                if (analysisHistory) {
                    for (const h of analysisHistory) {
                        // usage of .in() with order() might return multiple rows per user
                        // Since we iterate in order, the first one we see is the latest (due to desc order?)
                        // Wait, .in() + sort order depends on if we can group. 
                        // Supabase basic select returns all rows matching.
                        // We sort logic in memory to be safe or rely on query order.
                        // If we iterate array, and set map only if not present, checking order ensures max.
                        if (!historyMap.has(h.username)) {
                            historyMap.set(h.username, h.analyzed_at);
                        }
                    }
                }

                const finalResults = results
                    .slice(0, limit)
                    .map(user => ({
                        ...user,
                        db_status: existingMap.get(user.username) || null,
                        is_registered: existingMap.has(user.username),
                        latest_analysis_date: historyMap.get(user.username) || null,
                        is_target_range: user.followers_count >= 5000 && user.followers_count <= 100000
                    }));

                sendLog(`✅ 최종 ${finalResults.length}건의 데이터를 반환합니다.`);
                
                // Send Final Result
                sendResult({
                    results: finalResults,
                    fallbackUrl: fallbackUrl,
                    meta: {
                        keyword: keyword,
                        count: finalResults.length,
                    }
                });

            } catch (error: any) {
                console.error("Route Handler Error:", error);
                sendError(error.message || "Internal Server Error");
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
  } catch (error: any) {
    console.error("Route Handler Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
