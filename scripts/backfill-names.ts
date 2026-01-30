import { supabaseAdmin } from "../src/lib/supabase";

async function backfillFullNames() {
  console.log("Starting full_name backfill...");
  
  if (!supabaseAdmin) {
    console.error("Supabase Admin not available.");
    return;
  }

  const { data: records, error } = await supabaseAdmin
    .from('analysis_history')
    .select('id, full_analysis')
    .is('full_name', null);

  if (error) {
    console.error("Error fetching records:", error);
    return;
  }

  console.log(`Found ${records?.length || 0} records to update.`);

  for (const record of (records || [])) {
    const fullName = record.full_analysis?.profile?.fullName || record.full_analysis?.basicStats?.full_name;
    
    if (fullName) {
       await supabaseAdmin
        .from('analysis_history')
        .update({ full_name: fullName })
        .eq('id', record.id);
       console.log(`Updated ID ${record.id} with name: ${fullName}`);
    }
  }

  console.log("Backfill complete.");
}

backfillFullNames();
