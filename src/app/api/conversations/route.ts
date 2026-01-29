import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // 1. Resolve User ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('allowed_users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Conversations
    const { data: conversations, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (convError) {
      console.error("[API] Conversations fetch error:", convError);
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error("[API] Conversations Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
