
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");
    const username = url.searchParams.get("username");

    // Mode: Analysis History (Single User)
    if (mode === 'analysis' && username) {
        if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");
        
        const { data, error } = await supabaseAdmin
            .from("analysis_history")
            .select("*")
            .eq("username", username.toLowerCase())
            .order("analyzed_at", { ascending: false })
            .limit(1)
            .limit(1)
            .maybeSingle();
        
        if (error) throw error;
        return NextResponse.json({ result: data });
    }

    // Default: List Targets (CRM)
    const { data, error } = await supabase
      .from("instagram_targets")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { username, status, memo, dm_sent_date } = body;

        const updates: any = { updated_at: new Date().toISOString() };
        if (status !== undefined) updates.status = status;
        if (memo !== undefined) updates.memo = memo;
        if (dm_sent_date !== undefined) updates.dm_sent_date = dm_sent_date;

        const { error } = await supabase
            .from("instagram_targets")
            .update(updates)
            .eq("username", username);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const username = url.searchParams.get("username");
        
        if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

        const { error } = await supabase
            .from("instagram_targets")
            .delete()
            .eq("username", username);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
