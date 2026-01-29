
import fetch from 'node-fetch';

async function run() {
  const users = [
    {
      username: 'jangmini',
      followers_count: 13474, // Intentionally stale data to test override
      full_name: 'Stale Name',
      biography: 'Stale Bio',
      recent_posts: [] // Empty posts to speed it up or mock if needed? 
                       // Check route.ts: it slices recent_posts.
                       // Ideally we should pass some posts to avoid crashing if it expects them.
                       // But the route also fetches images.
    }
  ];

  console.log("Sending request to local dev server...");
  try {
      const res = await fetch('http://localhost:3000/api/instagram/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users, promptType: 'INSTA' })
      });

      if (!res.ok) {
        console.error("Error:", res.status, res.statusText);
        const text = await res.text();
        console.error(text);
        return;
      }

      const data = await res.json();
      console.log("Response:", JSON.stringify(data, null, 2));
      
      const result = data.results[0];
      if (result) {
          console.log("\n--- Verification ---");
          console.log("Verified Profile Present?", !!result.verifiedProfile);
          if (result.verifiedProfile) {
              console.log("Verified Followers:", result.verifiedProfile.followers);
              console.log("Verified Profile Pic:", result.verifiedProfile.profilePicUrl);
          }
      }

  } catch (e) {
      console.error("Fetch failed:", e);
  }
}

run();
