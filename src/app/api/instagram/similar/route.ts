import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase().trim();
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "DB connection not available" }, { status: 500 });
    }

    // 1. Get Target Embedding
    const { data: user, error: userError } = await supabaseAdmin
      .from('analysis_history')
      .select('embedding')
      .eq('username', username)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (userError || !user?.embedding) {
      return NextResponse.json({ 
          error: "No analysis found for this user. Please analyze first to generate an embedding.",
          code: "NO_EMBEDDING"
      }, { status: 404 });
    }

    // 2. Vector Search via RPC
    const { data: similar, error: rpcError } = await supabaseAdmin.rpc('match_influencers', {
      query_embedding: user.embedding,
      match_threshold: 0.3, // Loose threshold for results
      match_count: limit + 1
    });

    if (rpcError) {
      console.error("[Similar API] RPC Error:", rpcError);
      return NextResponse.json({ error: "Similarity search failed" }, { status: 500 });
    }

    // 3. Filter self & Format
    const results = (similar || [])
      .filter((u: any) => u.username !== username)
      .slice(0, limit);

    return NextResponse.json({ results });

  } catch (error: any) {
    console.error("[Similar API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
