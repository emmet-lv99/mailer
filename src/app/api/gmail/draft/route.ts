import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateHtmlFromBlocks, wrapEmailHtml } from "@/lib/email-utils";
import { supabase } from "@/lib/supabase";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("[Gmail API] Starting draft creation...");

    // 1. 세션 확인 (서버 사이드)
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      console.error("[Gmail API] No session or access token");
      return NextResponse.json({ error: "Unauthorized: No Google access token found" }, { status: 401 });
    }

    const bodyData = await req.json();
    console.log("[Gmail API] Request body received:", { ...bodyData, body: "..." }); // Log metadata only
    const { subject, body, templateId, recipientEmail } = bodyData;

    if (!subject || !body) {
      console.error("[Gmail API] Missing subject or body");
      return NextResponse.json({ error: "Missing subject or body" }, { status: 400 });
    }

    // 2. 템플릿 가져오기 (templateId가 있을 경우)
    let footerHtml = "";
    if (templateId) {
      console.log(`[Gmail API] Fetching template ${templateId}...`);
      const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error) {
        console.error("[Gmail API] Template fetch error:", error);
      } else if (template && template.blocks) {
        console.log("[Gmail API] Template found, generating HTML...");
        footerHtml = generateHtmlFromBlocks(template.blocks);
      }
    } else {
        console.log("[Gmail API] No templateId provided, skipping template.");
    }

    // 3. 전체 이메일 HTML 조립
    const fullContent = wrapEmailHtml(body, footerHtml);

    // 4. MIME 메시지 생성
    // 받는 사람(recipientEmail)이 없으면 드래프트만 생성 (To: 필드 없음)
    
    const encodedSubject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const messageParts = [
      recipientEmail ? `To: ${recipientEmail}` : "",
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${encodedSubject}`,
      "",
      fullContent,
    ].filter(Boolean).join("\n");

    // base64url encoding (RFC 4648)
    const encodedMessage = Buffer.from(messageParts)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 5. Gmail API 호출
    console.log("[Gmail API] Sending request to Google...");
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken as string });

    const gmail = google.gmail({ version: "v1", auth });

    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    console.log("[Gmail API] Success! Draft ID:", res.data.id);

    return NextResponse.json({ 
      success: true, 
      draftId: res.data.id, 
      message: "Draft created successfully" 
    });

  } catch (error: any) {
    console.error("[Gmail API] Critical Error:", error);
    // Return detailed error message for debugging
    return NextResponse.json({ error: error.message || "Failed to create draft", details: error }, { status: 500 });
  }
}
