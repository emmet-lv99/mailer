
import { ApifyClient } from "apify-client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

async function testSearch(targetUser: string) {
    console.log(`Testing search for: ${targetUser}`);
    const commonInput = {
        directUrls: [`https://www.instagram.com/${targetUser}/`],
        resultsType: "details",
        resultsLimit: 1,
        username_login: process.env.INSTAGRAM_USERNAME,
        password_login: process.env.INSTAGRAM_PASSWORD,
        loginUsername: process.env.INSTAGRAM_USERNAME,
        loginPassword: process.env.INSTAGRAM_PASSWORD,
    };

    console.log("Step 1: Details Scrape...");
    try {
        const detailRun = await apifyClient.actor("apify/instagram-scraper").call(commonInput);
        const { items: detailItems } = await apifyClient.dataset(detailRun.defaultDatasetId).listItems();
        console.log(`Step 1 Found ${detailItems.length} detail items.`);
        if (detailItems.length > 0) {
            console.log("DEBUG: Detail Item [0] Username:", (detailItems[0] as any).username);
            console.log("DEBUG: Detail Item [0] Full Raw:", JSON.stringify(detailItems[0], null, 2));
        }
    } catch (e) {
        console.error("Step 1 Failed:", e);
    }
    
    console.log("Step 2: Post Fallback Scrape...");
    try {
        const postRun = await apifyClient.actor("apify/instagram-scraper").call({
            ...commonInput,
            resultsType: "posts",
            resultsLimit: 3, 
        });
        const { items: postItems } = await apifyClient.dataset(postRun.defaultDatasetId).listItems();
        
        console.log(`Found ${postItems.length} posts.`);

        const userPosts = postItems.filter((post: any) => {
            const owner = post.owner || {};
            const ownerUsername = post.ownerUsername || owner.username || "";
            return ownerUsername.toLowerCase() === targetUser.toLowerCase();
        }) as any[];

        const validPost = userPosts[0];

        if (validPost) {
            console.log("DEBUG: Raw Valid Post Owner:", JSON.stringify(validPost.owner, null, 2));

            const owner = (validPost.owner || {}) as any;
            const profile = {
                username: targetUser,
                fullName: validPost.ownerFullName || owner.fullName || validPost.fullName || "",
                followersCount: validPost.ownerFollowersCount || owner.followersCount || owner.edge_followed_by?.count || 0,
                biography: validPost.ownerBiography || owner.biography || "",
                profilePicUrl: validPost.ownerProfilePicUrl || owner.profilePicUrl || validPost.profilePicUrl || "",
                latestPosts: userPosts
            };
            console.log("✅ Recovered Profile:", { ...profile, latestPosts: `[${profile.latestPosts.length} posts]` });
        } else {
            console.log("❌ No valid post found for target user.");
            const firstPost = postItems[0] as any;
            console.log("Sample Post Owner:", firstPost?.ownerUsername || firstPost?.owner?.username);
        }

    } catch (e) {
        console.error("❌ Fallback Error:", e);
    }
}

// Test with the user that failed/succeeded
testSearch("le_cormang");
