require('dotenv').config({ path: '.env.local' });
const { ApifyClient } = require('apify-client');

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

const targetUser = "jangmini"; 

const fs = require('fs');

async function run() {
    console.log(`Testing Apify for user: ${targetUser}`);

    const commonInput = {
        directUrls: [`https://www.instagram.com/${targetUser}/`],
        username_login: process.env.INSTAGRAM_USERNAME,
        password_login: process.env.INSTAGRAM_PASSWORD,
        resultsLimit: 1,
    };

    const output = { details: null, posts: [], metrics: {} };

    try {
        // 1. Details Run
        console.log("--- Fetching Details ---");
        const detailsRun = await client.actor("apify/instagram-scraper").call({
            ...commonInput,
            resultsType: "details",
        });
        const detailsDataset = await client.dataset(detailsRun.defaultDatasetId).listItems();
        output.details = detailsDataset.items[0];
        
        console.log("Details found:", !!output.details);

        // 2. Posts Run
        console.log("\n--- Fetching Posts ---");
        const postsRun = await client.actor("apify/instagram-scraper").call({
            ...commonInput,
            resultsType: "posts",
            resultsLimit: 3, // Get a few to check owner consistency
        });
        const postsDataset = await client.dataset(postsRun.defaultDatasetId).listItems();
        output.posts = postsDataset.items;

        console.log("Posts found:", output.posts.length);

        fs.writeFileSync('debug_output.json', JSON.stringify(output, null, 2));
        console.log("Full output saved to debug_output.json");

    } catch (e) {
        console.error("Error:", e);
    }
}

run();
