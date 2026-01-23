
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hasReplied = searchParams.get("hasReplied") === "true";

    let query = supabase
      .from("sent_logs")
      .select("*")
      .order("sent_at", { ascending: false });

    if (hasReplied) {
      query = query.eq("has_replied", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching history:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ history: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
