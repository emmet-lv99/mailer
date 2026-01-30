import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("instagram_proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { instagram_id, followers, content, memo } = body;

    // Check for duplicate
    const { data: existing } = await supabase
      .from("instagram_proposals")
      .select("id")
      .eq("instagram_id", instagram_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "이미 존재하는 ID 입니다" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("instagram_proposals")
      .insert([
        { 
          instagram_id, 
          followers: followers || 0, 
          content: content || "", 
          memo: memo || "",
          reaction: "pending",
          is_sent: false
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ result: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { data, error } = await supabase
      .from("instagram_proposals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ result: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabase
      .from("instagram_proposals")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
