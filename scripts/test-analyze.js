
// Plain JS version to avoid ts-node issues
const { fetch } = globalThis; // Ensure fetch is available (Node 18+)

async function run() {
  const users = [
    {
      username: 'jangmini',
      followers_count: 13474,
      full_name: 'Stale Name',
      biography: 'Stale Bio',
      recent_posts: [] 
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
      // console.log("Response:", JSON.stringify(data, null, 2)); // Too verbose
      
      const result = data.results[0];
      if (result) {
          console.log("\n--- Verification ---");
          console.log("Verified Profile Present?", !!result.verifiedProfile);
          if (result.verifiedProfile) {
              console.log("Verified Followers:", result.verifiedProfile.followers);
              console.log("Verified Profile Pic:", result.verifiedProfile.profilePicUrl);
          } else {
              console.log("No verifiedProfile found in result.");
              console.log("Keys in result:", Object.keys(result));
          }
      }

  } catch (e) {
      console.error("Fetch failed:", e);
  }
}

run();
