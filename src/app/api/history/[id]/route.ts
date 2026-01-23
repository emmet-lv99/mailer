
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;
    const body = await req.json();
    const { has_replied, note, status } = body;

    const updates: any = {};
    if (typeof has_replied !== "undefined") updates.has_replied = has_replied;
    if (typeof note !== "undefined") updates.note = note;
    if (typeof status !== "undefined") updates.status = status;

    const { error } = await supabase
      .from("sent_logs")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating history:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
