
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;

    if (!user || !user.username) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // Prepare data for insertion (Upsert to handle re-registration)
    const dbData = {
      username: user.username,
      full_name: user.full_name,
      followers_count: user.followers_count,
      biography: user.biography,
      profile_pic_url: user.profile_pic_url,
      
      // Analysis Data
      analysis_summary: user.analysis?.analysis_summary || user.analysis?.summary,
      originality_score: user.analysis?.originality_score,
      mood_keywords: user.analysis?.mood_keywords, // Stored as JSONB if postgres, or text array
      is_target: user.analysis?.is_target,
      category: user.analysis?.category,

      status: 'todo', // Default status for new registration
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("instagram_targets")
      .upsert(dbData, { onConflict: "username" });

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
