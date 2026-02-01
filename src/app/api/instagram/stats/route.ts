import { supabase } from "@/lib/supabase";
import { format, parseISO, subDays } from "date-fns";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let startDate: Date;
    let endDate: Date;

    if (from) {
        startDate = parseISO(from);
        endDate = to ? parseISO(to) : new Date();
    } else {
        const today = new Date();
        endDate = today;
        startDate = subDays(today, 30);
    }

    // Get all proposals within the date range
    const { data: proposals, error } = await supabase
      .from("instagram_proposals")
      .select("created_at, sent_at, created_by, sent_by")
      .gte("created_at", format(startDate, "yyyy-MM-dd"))
      .lte("created_at", format(endDate, "yyyy-MM-dd") + "T23:59:59"); // Ensure full day inclusion for end date

    if (error) throw error;

    // Aggregate data by date and user
    const dailyStats: Record<string, any> = {};
    const userStats: Record<string, { added: number, sent: number }> = {};

    // Initialize date range
    // Calculate number of days between start and end
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    for (let i = 0; i <= dayDiff; i++) {
        const dateStr = format(subDays(endDate, i), "yyyy-MM-dd");
        if (new Date(dateStr) >= startDate) {
             dailyStats[dateStr] = { date: dateStr, added: 0, sent: 0 };
        }
    }

    proposals?.forEach((p) => {
        const createDate = format(parseISO(p.created_at), "yyyy-MM-dd");
        if (dailyStats[createDate]) {
            dailyStats[createDate].added += 1;
        }

        // Aggregate user added stats
        if (p.created_by) {
            if (!userStats[p.created_by]) userStats[p.created_by] = { added: 0, sent: 0 };
            userStats[p.created_by].added += 1;
        }

        if (p.sent_at) {
            const sentDate = format(parseISO(p.sent_at), "yyyy-MM-dd");
            if (dailyStats[sentDate]) {
                dailyStats[sentDate].sent += 1;
            }

            // Aggregate user sent stats
            if (p.sent_by) {
                if (!userStats[p.sent_by]) userStats[p.sent_by] = { added: 0, sent: 0 };
                userStats[p.sent_by].sent += 1;
            }
        }
    });

    const chartData = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ 
        chartData,
        summary: {
            totalAdded: proposals?.length || 0,
            totalSent: proposals?.filter(p => p.sent_at).length || 0,
        },
        userStats
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
