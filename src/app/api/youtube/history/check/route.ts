
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { channelIds } = await req.json();

    if (!channelIds || !Array.isArray(channelIds)) {
      return NextResponse.json({ error: "Invalid channelIds" }, { status: 400 });
    }

    if (channelIds.length === 0) {
        return NextResponse.json({ sentientChannelIds: [] });
    }

    const { data, error } = await supabase
      .from('sent_logs')
      .select('channel_id, status')
      .in('channel_id', channelIds);

    if (error) {
      console.error("History check error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sentChannelIds = Array.from(new Set(data?.map(r => r.channel_id) || []));
    const channelStatusMap = data?.reduce((acc, curr) => {
        acc[curr.channel_id] = curr.status;
        return acc;
    }, {} as Record<string, string>) || {};

    return NextResponse.json({ sentChannelIds, channelStatusMap });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
