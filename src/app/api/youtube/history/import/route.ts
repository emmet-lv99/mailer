
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    
    // Parse CSV
    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.warn("CSV Parse errors:", errors);
    }

    const records = (data as any[]).map((row) => {
        // CSV 컬럼 매핑 (유연하게 처리)
        // 예상 컬럼: Channel ID, Channel Name, Email, ...
        // 사용자가 업로드하는 파일의 포맷이 다양할 수 있으므로, 가능한 필드를 찾습니다.
        
        const channelId = row["Channel ID"] || row["channel_id"] || row["id"];
        const channelName = row["Channel Name"] || row["channel_name"] || row["name"] || row["Title"];
        const email = row["Email"] || row["email"];
        const subject = row["Subject"] || row["subject"] || "Legacy Import";
        
        if (!channelId) return null;

        return {
            channel_id: channelId,
            channel_name: channelName || "Unknown",
            email: email || "",
            subject: subject,
            status: 'sent', // 과거 이력이므로 sent로 간주 (또는 legacy)
            source: 'legacy',
            sent_at: new Date().toISOString() // 임포트 시점 or CSV 내 날짜가 있다면 파싱 필요하지만 복잡하므로 현재시간
        };
    }).filter(r => r !== null);

    if (records.length === 0) {
        return NextResponse.json({ error: "No valid records found in CSV" }, { status: 400 });
    }

    // Bulk Insert
    const { error } = await supabase
      .from('sent_logs')
      .insert(records);

    if (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: records.length });

  } catch (error: any) {
    console.error("Import API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
