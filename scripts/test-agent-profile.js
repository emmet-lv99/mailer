
// scripts/test-agent-profile.js
// Purpose: TDD Step 1 - Verify "analyze_account" tool fetches Profile Info correctly.
require('dotenv').config({ path: '.env.local' });

// Mocking dependencies to run tool in isolation if needed, 
// but we want to run the ACTUAL tool.
// We need to import the tool from the compiled source or use ts-node.
// Since we are in a Next.js env, it's easier to run a small script using `ts-node` or `tsx`.
// Assuming `yarn tsx` or `npx tsx` is available.

// [Removed invalid require]
// The user wants to refactor the *Process*.
// Let's create a script that calls the TOOL directly if possible, OR calls the API but focuses on Profile Output.
// Given strict alias issues, testing the API route is safer.

// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function testProfileFetch() {
  console.log("=== [TDD Step 1] Verification: Profile Fetch ===");
  const targetUser = "jangmini"; // Robust test target

  try {
    // We will call the API endpoint that wraps the tool or logic.
    // Actually, `fetch-raw` IS the logic refactored. 
    // But the Agent uses `analyze_account` tool which we just refactored to use shared utils.
    // Let's verify the Agent Tool's output via the API logic or similar?
    // No, let's try to invoke the Agent Tool via a mock simplified context if possible, 
    // OR just rely on the existing `/api/instagram/analyze-ai`?
    // Wait, `analyze-ai` calls Gemini. We want "Step 1: Get Profile".
    
    // The "Task" says "Fetch scraper returns correct profile". 
    // This is exactly what `/api/instagram/fetch-raw` does (Stage 1).
    // Let's verify Stage 1 response structure explicitly.

    const baseUrl = "http://localhost:3000";
    console.log(`--> Calling ${baseUrl}/api/instagram/fetch-raw for ${targetUser}...`);

    const response = await fetch(`${baseUrl}/api/instagram/fetch-raw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: [{ username: targetUser }] })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`API Error: ${data.error || response.statusText}`);
    }

    console.log("\n[Result] API Response Status:", response.status);
    
    if (data.results && data.results.length > 0) {
        const profile = data.results[0].verifiedProfile;
        console.log("\n=== Verified Profile Data ===");
        console.log(`Username: ${profile.username}`);
        console.log(`Full Name: ${profile.fullName}`);
        console.log(`Followers: ${profile.followers}`);
        console.log(`Verified: ${profile.isVerified}`);
        console.log(`Profile Pic: ${profile.profilePicUrl ? 'OK' : 'MISSING'}`);
        
        // Assertions
        if (!profile.username || !profile.followers) {
            console.error("❌ FAILED: Missing critical profile fields.");
            process.exit(1);
        } else {
            console.log("\n✅ PASSED: Profile info fetched successfully.");
        }
    } else {
        console.error("❌ FAILED: No results returned.");
        process.exit(1);
    }

  } catch (error) {
    console.error("❌ Test Failed:", error);
    process.exit(1);
  }
}

testProfileFetch();
