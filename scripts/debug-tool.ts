
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  console.log("--- Debugging Analyze Tool ---");
  try {
    const { analyzeAccountTool } = await import("../src/lib/agent/tools/analyze");
    
    const result = await analyzeAccountTool.func({ username: "jangmini" });
    const parsed = JSON.parse(result);
    
    console.log("Username:", parsed.username);
    console.log("Followers:", parsed.profile.followersCount);
    console.log("Profile Pic:", parsed.profile.profilePicUrl);
    console.log("Metrics:", JSON.stringify(parsed.metrics, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
