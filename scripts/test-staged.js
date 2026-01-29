
// scripts/test-staged.js
const { ApifyClient } = require("apify-client");

async function testStagedPipeline() {
  const fetch = (await import('node-fetch')).default;
  const baseUrl = "http://localhost:3000";

  const targetUsername = "jangmini"; // The user causing issues (195k vs 13k)

  console.log(`\n=== [TEST] Starting Staged Pipeline Test for @${targetUsername} ===\n`);

  // --- STAGE 1: FETCH RAW ---
  console.log("--> Calling Stage 1: /api/instagram/fetch-raw");
  const t0 = Date.now();
  
  try {
      const resp1 = await fetch(`${baseUrl}/api/instagram/fetch-raw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: [{ username: targetUsername }] })
      });
      
      const rawData = await resp1.json();
      const t1 = Date.now();
      console.log(`[Stage 1] Completed in ${(t1 - t0) / 1000}s`);

      if (!rawData.results || rawData.results.length === 0) {
          console.error("[Stage 1] FAIL: No results returned");
          return;
      }

      const stage1Result = rawData.results[0];
      const verifiedProfile = stage1Result.verifiedProfile;

      console.log("[Stage 1] Verified Profile Data:");
      console.log(`   - Username: ${verifiedProfile.username}`);
      console.log(`   - Followers: ${verifiedProfile.followers.toLocaleString()}`); // Expect ~195k
      console.log(`   - IsVerified: ${verifiedProfile.isVerified}`);
      console.log(`   - Profile Pic: ${verifiedProfile.profilePicUrl ? "Yes" : "No"}`);

      if (verifiedProfile.followers < 100000) {
          console.warn("⚠️ WARNING: Follower count seems low! Cached/Stale data might persist locally?");
      } else {
          console.log("✅ SUCCESS: Follower count looks correct (High value).");
      }


      // --- STAGE 2: ANALYZE AI ---
      console.log("\n--> Calling Stage 2: /api/instagram/analyze-ai");
      
      const resp2 = await fetch(`${baseUrl}/api/instagram/analyze-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData: rawData.results }) // Pass the raw result from Stage 1
      });

      const aiData = await resp2.json();
      const t2 = Date.now();
      console.log(`[Stage 2] Completed in ${(t2 - t1) / 1000}s`);

      if (!aiData.results || aiData.results.length === 0) {
          console.error("[Stage 2] FAIL: No results returned. Response:", JSON.stringify(aiData, null, 2));
          return;
      }

      const finalResult = aiData.results[0];
      console.log("[Stage 2] Final Analysis Data:");
      console.log(`   - Username: ${finalResult.username}`);
      
      const basicStats = finalResult.analysis?.basicStats;
      console.log(`   - AI BasicStats Followers: ${basicStats?.followers?.toLocaleString()}`);
      
      if (basicStats?.followers === verifiedProfile.followers) {
           console.log("✅ SUCCESS: AI preserved the verified follower count.");
      } else {
           console.error(`❌ FAIL: AI Hallucinated/Changed follower count! (Verified: ${verifiedProfile.followers} vs AI: ${basicStats?.followers})`);
      }

      const investment = finalResult.analysis?.investmentAnalyst;
      if (investment) {
          console.log(`   - Tier: ${investment.tier}`);
          console.log(`   - Decision: ${investment.decision}`);
      } else {
          console.warn("⚠️ WARNING: Investment analysis structure missing.");
      }

  } catch (e) {
      console.error("Test Failed with Error:", e);
  }
}

testStagedPipeline();
