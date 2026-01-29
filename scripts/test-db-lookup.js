
// scripts/test-db-lookup.js
// Purpose: TDD Step 2 - Verify we can find existing analysis history for a user.

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testDBLookup() {
  console.log("=== [TDD Step 2] Verification: DB Analysis History Lookup ===");
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role to bypass RLS for test script

  if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase Credentials in .env.local");
      process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const targetUser = "jangmini"; // We analyzed this user earlier

  console.log(`--> Checking analysis_history for: ${targetUser}`);

  try {
      const { data, error } = await supabase
          .from("analysis_history")
          .select("id, analyzed_at, full_analysis")
          .eq("username", targetUser)
          .order("analyzed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

      if (error) {
          throw error;
      }

      if (data) {
          console.log("\n✅ PASSED: Found existing analysis.");
          console.log(`- ID: ${data.id}`);
          console.log(`- Date: ${new Date(data.analyzed_at).toLocaleString()}`);
          console.log(`- Has Full Analysis? ${!!data.full_analysis}`);
      } else {
          console.log("\nℹ️ INFO: No existing analysis found for this user (Expected if first time).");
          // Try inserting a dummy record to verify lookup works if empty
          console.log("--> Attempting to insert dummy record for verification...");
          // Skip insert for now, purely read test.
      }

  } catch (err) {
      console.error("❌ Test Failed:", err);
      process.exit(1);
  }
}

testDBLookup();
