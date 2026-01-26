
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
        let channelName = channel.channelName || channel.채널명 || channel.channelId || "Unknown";
        let subscribers = channel.subscribers || channel.구독자수 || "0";
        
        // Skip check is done in frontend, backend receives only target channels.
        
        send("progress", { current: processed, total, message: `[${processed}/${total}] ${channelName} 분석 중...` });

        try {
          // Prepare Prompt
          // Replace variables
          // We assume channel object has keys matching variables + extra info
          // Actually, basic replacement:
          let finalPrompt = promptContent
            .replace(/{{channelName}}/g, channelName)
            .replace(/{{subscribers}}/g, subscribers)
            .replace(/{{description}}/g, channel.description || "") // If we have description? CSV usually doesn't have it unless scraped.
            // In original index.js, we fetched data from YouTube API.
            // WAIT! The original script fetched YouTube Data API to get channel info (name, description, recent videos).
            // But here, the input CSV might only have IDs?
            // User said: "유튜브 채널 ID 리스트를 업로드".
            // So we NEED YouTube Data API Key as well?
            // "1. 고유 api키 입력 기능" -> User put Gemini Key.
            // Does user have YouTube API Key?
            // In `index.js`, we used `YOUTUBE_API_KEY` from .env.
            // The web app needs this key too.
            // If the CSV ONLY has IDs, we must fetch details.
            // OR if the CSV has all details (name, subs, etc), we skip fetching.
            // Let's assume input CSV has `channelId` column.
            
            // CRITICAL: We need YouTube API Key to fetch channel details if input is just ID.
            // If input CSV has `channelName`, `subscribers` columns, maybe we skip fetching?
            // User flow: "유튜브 채널 ID 리스트 파일" -> implies just IDs?
            // Let's check `index.js`. It fetches data using `googleapis`.
            
            // START STOPPING. I need to ask user or add YouTube API Key configuration.
            // Original `index.js` had `YOUTUBE_API_KEY`.
            // User added Gemini Key in settings.
            // User didn't add YouTube Key in settings yet.
            
            // I should handle this.
            // Option 1: Ask user to add YouTube Key in settings.
            // Option 2: Hardcode it (bad).
            // Option 3: Assume input CSV has columns `channelName`, `subscribers` etc.
            
            // Let's assume we need to fetch data.
            // I will first check if I can just use Gemini to browse? No, Gemini 2.0 Flash is text-to-text here mostly.
            
            // I will update the code to use JUST Gemini if the prompt doesn't strictly require external data, 
            // OR I will ask the user.
            // Wait, previous `index.js` logic was:
            // 1. Get ID from CSV.
            // 2. Fetch Channel Info (Name, Subs, Desc, Videos) from YouTube API.
            // 3. Feed to Gemini.
            
            // So YouTube API is essential.
            
            // I'll assume for now I should generate email based on available CSV columns if YouTube Key is missing.
            // But if YouTube Key is present (in .env.local?), I use it.
            // It's safer to ask user to provide it in Settings.
            
            // However, to keep momentum, I'll proceed with the assumption that input CSV has columns. 
            // BUT wait, `file-dropzone` parses CSV.
            // I should look at `input.csv` content if possible.
            // Step 336 Output: `[1/113] 처리 중: UC2fsxQr6Hcx1enORxXgKpxQ ...` -> This looks like ID.
            
            // I will add YouTube Data API Key to Settings Page logic in next refactor.
            // For now, I'll assume the user might have put it in `.env.local` or I can read it from server env.
            // I'll check `.env` in `index.js`.
            // API Key removed for security
            // I can copy this to `.env.local` of the web app.
            
            // I will proactively read `YOUTUBE_API_KEY` from process.env (server side).
            // So if I set it in `.env.local`, it works.
        
          // Use renamed env var to avoid conflicts
          const youtubeKey = (process.env.ANMOK_YOUTUBE_API_KEY || "").trim();
          let channelData = { ...channel, channelName, subscribers };

          if (!youtubeKey) {
             send("log", { message: "⚠️ YouTube API Key가 설정되지 않았습니다. 채널 정보를 가져올 수 없습니다.", type: "warning" });
          }

          if (youtubeKey && channel.channelId) {
             try {
                // 1. Fetch Request: Get Uploads Playlist ID
                const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channel.channelId}&key=${youtubeKey}`);
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

        } catch (error: any) {
          send("log", { message: `❌ 실패 (${channelName}): ${error.message}` });
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
