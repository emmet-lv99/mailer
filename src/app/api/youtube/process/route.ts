
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes max for Vercel Pro, but locally infinite.

export async function POST(req: Request) {
  let promptContent, channels;
  try {
    const body = await req.json();
    promptContent = body.promptContent;
    channels = body.channels;
  } catch (e) {
    console.error("DEBUG: Failed to parse request body:", e);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Use the unique environment variable to avoid shell conflicts
  const apiKey = (process.env.ANMOK_GEMINI_API_KEY || "").trim();
  
  console.log("---------------------------------------------------");
  // console.log(`DEBUG: API Key Loaded: ${apiKey ? "YES" : "NO"}`);
  console.log(`DEBUG: Key Source: ANMOK_GEMINI_API_KEY`);
  console.log(`DEBUG: Key Preview: ...${apiKey.slice(-5)}`);
  console.log("---------------------------------------------------");

  if (!apiKey || !promptContent || !channels || !Array.isArray(channels)) {
    return NextResponse.json({ error: "Invalid request body or missing Server API Key" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, payload: any) => {
        const data = JSON.stringify({ type, ...payload });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Send Debug Log to Frontend
      send("log", { 
          message: `⚙️ Server-side Key Check: ${apiKey ? `Present (${apiKey.length} chars)` : "Missing"}`,
          type: "info"
      });
      send("log", { 
          message: `🔑 Key Preview: ${apiKey ? `${apiKey.slice(0, 4)}***${apiKey.slice(-4)}` : "None"}`,
          type: "info" 
      });

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const total = channels.length;
      let processed = 0;

      for (const channel of channels) {
        processed++;
        let channelName = channel.channelName || channel['Channel Name'] || channel.채널명 || channel['채널명'] || channel.channelId || channel['Channel ID'] || "Unknown";
        let subscribers = channel.subscribers || channel['Subscribers'] || channel.구독자수 || channel['구독자수'] || "0";
        let channelId = channel.channelId || channel['Channel ID'] || "";
        let description = channel.description || channel['Description'] || "";
        // Skip check is done in frontend, backend receives only target channels.
        
        send("progress", { current: processed, total, message: `[${processed}/${total}] ${channelName} 분석 중...` });

        try {
          // Prepare Prompt: Replace variables (Basic + Extended if available)
          let finalPrompt = promptContent
            .replace(/{{channelName}}/g, channelName)
            .replace(/{{subscribers}}/g, subscribers)
            .replace(/{{description}}/g, channel.description || "");

          // Use renamed env var to avoid conflicts
          // I will proactive read `YOUTUBE_API_KEY` from process.env (server side).
          const youtubeKey = (process.env.ANMOK_YOUTUBE_API_KEY || "").trim();
          let channelData = { ...channel, channelName, subscribers };

          if (!youtubeKey) {
             send("log", { message: "⚠️ YouTube API Key가 설정되지 않았습니다. 채널 정보를 가져올 수 없습니다.", type: "warning" });
          }

          if (youtubeKey && channelId) {
             try {
                // 1. Fetch Request: Get Uploads Playlist ID
                const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${youtubeKey}`);
                const ytData = await ytRes.json();
                if (ytData.items?.[0]) {
                    const snippet = ytData.items[0].snippet;
                    const statistics = ytData.items[0].statistics;
                    const contentDetails = ytData.items[0].contentDetails;
                    
                    channelName = snippet.title;
                    subscribers = statistics.subscriberCount;
                    channelData = {
                        ...channelData,
                        channelName,
                        subscribers,
                        description: snippet.description,
                    };
                    
                    // 2. Fetch Latest Video from Uploads Playlist
                    const uploadsPlaylistId = contentDetails?.relatedPlaylists?.uploads;
                    let latestVideoTitle = "";
                    let latestVideoDescription = "";
                    
                    if (uploadsPlaylistId) {
                        try {
                            const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${youtubeKey}`);
                            const videoData = await videoRes.json();
                            
                            if (videoData.items?.[0]) {
                                const videoSnippet = videoData.items[0].snippet;
                                latestVideoTitle = videoSnippet.title;
                                latestVideoDescription = videoSnippet.description;
                                
                                send("log", { message: `🎥 최신 영상 발견: ${latestVideoTitle.substring(0, 20)}...` });
                            }
                        } catch (vErr) {
                            console.error("Video Fetch Error", vErr);
                        }
                    }

                    // Update finalPrompt with real data (Extended Variables)
                    // Support both {{}} and [] syntax for user convenience
                    finalPrompt = promptContent
                        .replace(/{{channelName}}/g, channelName)
                        .replace(/\[채널명\]/g, channelName)
                        
                        .replace(/{{subscribers}}/g, subscribers)
                        .replace(/\[구독자수\]/g, subscribers)
                        
                        .replace(/{{description}}/g, snippet.description || "")
                        
                        .replace(/{{videoTitle}}/g, latestVideoTitle)
                        .replace(/\[영상제목\]/g, latestVideoTitle)
                        
                        .replace(/{{videoDescription}}/g, latestVideoDescription)
                        .replace(/\[영상내용\]/g, latestVideoDescription); // Optional alias
                }
             } catch (e) {
                 console.error("YouTube Fetch Error", e);
             }
          } else {
             // Fallback for when YouTube Key is missing or ID is missing
             // Still try to replace basic variables if available from CSV
             finalPrompt = promptContent
                .replace(/{{channelName}}/g, channelName)
                .replace(/\[채널명\]/g, channelName)
                .replace(/{{subscribers}}/g, subscribers)
                .replace(/\[구독자수\]/g, subscribers);
          }
          
          // Retry logic with improved error handling
          let retries = 0;
          let generated = null;
          const maxRetries = 3;
          
          while (retries < maxRetries) {
             try {
                 const result = await model.generateContent({
                     contents: [{ role: "user", parts: [{ text: finalPrompt + "\n\nOutput JSON only: { \"subject\": \"...\", \"body\": \"...\" }" }] }],
                     generationConfig: { responseMimeType: "application/json" }
                 });
                 
                 let text = result.response.text();
                 
                 // 제어 문자 제거 (JSON 파싱 에러 방지)
                 // 개행(\n), 탭(\t)은 유지하되 다른 제어 문자는 제거
                 text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
                 
                 // JSON 블록 추출 (AI가 ```json ... ``` 형태로 반환할 경우 대응)
                 const jsonMatch = text.match(/\{[\s\S]*\}/);
                 if (jsonMatch) {
                     text = jsonMatch[0];
                 }
                 
                 generated = JSON.parse(text);
                 
                 // 빈 콘텐츠 체크 - 실패 시 재시도
                 if (!generated.subject || !generated.body) {
                     console.warn(`[AI] Empty content received for ${channelName}, retrying...`);
                     retries++;
                     await new Promise(r => setTimeout(r, 2000));
                     continue;
                 }
                 
                 break; // 성공!
                 
             } catch (err: any) {
                 console.error(`[AI] Error for ${channelName}:`, err.message);
                 
                 if (err.message?.includes("429") || err.message?.includes("Quota")) {
                     send("log", { message: "⏳ 쿼터 초과! 5초 대기 후 재시도..." });
                     await new Promise(r => setTimeout(r, 5000));
                 } else if (err.message?.includes("JSON") || err.message?.includes("parse")) {
                     // JSON 파싱 에러 - 재시도
                     send("log", { message: `⚠️ JSON 파싱 에러, 재시도 중... (${retries + 1}/${maxRetries})` });
                     await new Promise(r => setTimeout(r, 2000));
                 } else {
                     throw err; // 다른 에러는 즉시 실패 처리
                 }
                 
                 retries++;
             }
          }

          if (generated && generated.subject && generated.body) {
            // Extract email if exists (supports common CSV headers)
            const email = channel.email || channel.Email || channel.이메일 || "";

            send("result", { 
                channelName,
                channelId: channel.channelId || "", 
                subscribers,
                email, // Pass email to frontend
                subject: generated.subject,
                body: generated.body 
            });
            send("log", { message: `✅ 생성 완료: ${channelName}` });
          } else {
             throw new Error("Generation returned empty content");
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
          send("log", { message: `❌ 실패 (${channelName}): ${errorMessage}` });
          // Send error result so client knows it failed but continues
          send("result", { 
               channelName, 
               subscribers, 
               subject: "생성 실패", 
               body: error.message,
               isError: true 
          });
        }
        
        // Rate limiting delay (1s) to be safe
        await new Promise(r => setTimeout(r, 1000));
      }

      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
