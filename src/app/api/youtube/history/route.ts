
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hasReplied = searchParams.get("hasReplied") === "true";
    const status = searchParams.get("status");

    let query = supabase
      .from("sent_logs")
      .select("*")
      .order("sent_at", { ascending: false });

    if (hasReplied) {
      query = query.eq("has_replied", true);
    }
    
    if (status && status !== "all") {
        query = query.eq("status", status);
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

export async function POST(req: Request) {
  try {
    const { logs } = await req.json();

    if (!logs || !Array.isArray(logs)) {
      return NextResponse.json({ error: "Invalid logs" }, { status: 400 });
    }

    const { error } = await supabase
      .from("sent_logs")
      .insert(logs);

    if (error) {
      console.error("Error creating history:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
