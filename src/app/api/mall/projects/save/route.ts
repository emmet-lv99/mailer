import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // [MODIFIED] Allow anonymous access (No session check)
    // const session = await getServerSession(authOptions);
    
    const body = await request.json();
    const { 
      id, 
      youtubeChannelUrl, 
      competitorUrls, 
      channelName,
      marketingAnalysis, 
      designAnalysis, 
      referenceAnalysis 
    } = body;

    // Use 'anonymous' as user_id since login is not required
    // const userId = "anonymous"; // Removed: Column dropped

    const projectData = {
      // user_id: userId, // Removed
      youtube_channel_url: youtubeChannelUrl.trim().replace(/\/$/, ""),
      competitor_channels: competitorUrls || [],
      channel_name: channelName,
      marketing_analysis: marketingAnalysis,
      design_analysis: designAnalysis,
      reference_analysis: referenceAnalysis,
      // updated_at: new Date().toISOString() // Removed: Column does not exist in DB yet
    };

    let result;
    if (id) {
       // Try Update first
       const updateResponse = await supabase
         .from("mall_projects")
         .update(projectData)
         .eq("id", id)
         .select();

       if (updateResponse.error) {
           return NextResponse.json({ error: updateResponse.error.message }, { status: 500 });
       }

       // If update succeeded and returned data
       if (updateResponse.data && updateResponse.data.length > 0) {
           result = { data: updateResponse.data[0], error: null };
       } else {
           // ID provided but not found (deleted? invalid?) -> Treat as new Insert
           // But we should not reuse the old ID if it was auto-generated. Let Supabase generate new one.
           console.warn(`Project ID ${id} not found. Creating new project.`);
           result = await supabase
             .from("mall_projects")
             .insert([projectData])
             .select()
             .single();
       }
    } else {
       // Insert
       result = await supabase
         .from("mall_projects")
         .insert([projectData])
         .select()
         .single();
    }

    if (result.error) {
      console.error("DB Insert Error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);

  } catch (error: any) {
    console.error("Save Project API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
