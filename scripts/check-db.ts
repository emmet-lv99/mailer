import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function checkHistory() {
  const { supabaseAdmin } = await import("../src/lib/supabase");
  console.log("Checking analysis_history for 'jangmini'...");
  const { data, error } = await supabaseAdmin
    .from("analysis_history")
    .select("analyzed_at, followers, profile_pic_url, username")
    .eq("username", "jangmini")
    .order("analyzed_at", { ascending: false })
    .limit(5);

  if (error) console.error(error);
  console.table(data);
}

checkHistory();
