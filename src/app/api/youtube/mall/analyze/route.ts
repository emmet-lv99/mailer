import { geminiVisionModel } from "@/lib/gemini";
import { getChannelDetails, getChannelIdFromUrl, getRecentVideos, getVideoComments } from "@/lib/youtube";
import { MallProjectAnalysis } from "@/services/mall/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { channelUrl, competitorUrls } = await request.json();

    if (!channelUrl) {
      return NextResponse.json({ error: "Channel URL is required" }, { status: 400 });
    }

    console.log("Analyzing URL:", channelUrl); 

    // 1. Fetch YouTube Data
    let channelId;
    try {
      channelId = await getChannelIdFromUrl(channelUrl);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    if (!channelId) {
        return NextResponse.json({ error: "Channel ID could not be resolved" }, { status: 400 });
    }

    const channelInfo = await getChannelDetails(channelId);
    if (!channelInfo) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Fetch Videos
    const videos = channelInfo.uploadsPlaylistId 
      ? await getRecentVideos(channelInfo.uploadsPlaylistId, 5) // Analyze top 5
      : [];

    // [New] Fetch Comments & Prepare Thumbnails
    // Balance visual inputs: 1 Banner + 1 Profile + 2 Video Thumbnails = 4 Images
    const topVideos = videos.slice(0, 2); 
    
    // Helper to download image to base64
    const downloadImage = async (url?: string | null) => {
      if (!url) return null;
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer).toString("base64");
      } catch (e) {
        console.warn("Failed to download image:", url);
        return null;
      }
    };

    // Parallel Fetching
    const [commentsResults, videoThumbnails, bannerBuffer, profileBuffer] = await Promise.all([
      // A. Fetch Comments
      Promise.all(topVideos.map(v => v.id ? getVideoComments(v.id, 5) : [])),
      
      // B. Download Video Thumbnails
      Promise.all(topVideos.map(v => downloadImage(v.thumbnail))),

      // C. Download Channel Branding Images
      downloadImage(channelInfo.bannerExternalUrl),
      downloadImage(channelInfo.thumbnails?.high?.url || channelInfo.thumbnails?.default?.url),
    ]);

    const allComments = commentsResults.flat().map(c => `"${c.text}" (Likes: ${c.likes})`).join("\n");
    
    // Collect all valid images for Vision
    const validImages = [bannerBuffer, profileBuffer, ...videoThumbnails].filter(Boolean) as string[];

    // 2. Prepare Context for AI
    const analysisContext = {
      channelName: channelInfo.title,
      description: channelInfo.description,
      keywords: channelInfo.keywords,
      recentVideos: videos.map(v => ({ title: v.title, description: v.description?.slice(0, 100) })),
      topComments: allComments.slice(0, 2000), // Limit comment text context
    };

    console.log(`Sending to AI: ${validImages.length} images (Banner, Profile, Videos), ${commentsResults.flat().length} comments.`);

    // 3. Prompt Gemini (Multimodal)
    const prompt = `
      You are an expert E-commerce Planner & Brand Director.
      Analyze the following YouTube Channel information, Visuals (Banner, Profile, Thumbnails), and Audience Reactions (Comments).
      Propose a comprehensive strategy for an Online Shop (Mall) for this creator.

      [Channel Info]
      Name: ${analysisContext.channelName}
      Description: ${analysisContext.description}
      Keywords: ${analysisContext.keywords}
      
      [Content Context]
      Recent Videos: ${JSON.stringify(analysisContext.recentVideos)}
      
      [Audience Voice (Comments)]
      ${analysisContext.topComments}

      [Visual Context]
      I have provided the Channel Banner, Profile Icon, and recent Video Thumbnails. 
      Analyze the branding consistency, color usage, and visual identity from these images.
      
      [Task]
      Generate a JSON object matching the following structure ONLY. 
      - **LANGUAGE**: Descriptions, reasons, and user-facing values MUST be in **KOREAN (한국어)**.
      - **EXCEPTIONS**: The "design.concept.keywords" field MUST be in **ENGLISH (ALL CAPS)** for technical system matching (e.g., ["BRUTALIST", "VINTAGE", "COZY"]).
      - **FORMAT**: Pure JSON, no markdown. 
      - **KEYS**: Use camelCase for keys exactly as shown below.
      
      Structure:
      {
        "channelName": string,
        "marketing": {
          "target": { "ageRange": string, "gender": string, "interests": string[] },
          "persona": { "name": string, "oneLiner": string, "needs": string[], "painPoints": string[] },
          "product": { "categories": string[], "priceRange": "low"|"mid"|"high"|"luxury", "keyFeatures": string[] },
          "strategy": { 
            "usp": string, 
            "mood": string,
            "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
            "brandArchetype": { "primary": string, "secondary": string, "mixReason": string },
            "storyBrand": { "hero": string, "problem": string, "guide": string, "plan": string, "success": string },
            "competitors": [{"name": string, "reason": string}]
          },
          "structure": { "gnb": string[], "mainLayout": string[] }
        },
        "design": {
          "concept": { "keywords": string[], "description": string },
          "foundation": {
            "colors": { "primary": hex, "secondary": hex, "background": { "main": hex, "sub": hex }, "text": { "title": hex, "body": hex, "disabled": hex } },
            "typography": { "fontFamily": string, "scale": string, "weightRule": string },
            "shapeLayout": { "borderRadius": string, "spacing": "compact"|"comfortable"|"airy", "grid": string }
          },
          "components": { "buttons": string, "cards": string, "inputForm": string, "gnbFooter": string },
          "mood": { "imagery": string, "graphicMotifs": string, "iconography": string }
        }
      }
    `;

    // Prepare inputs for Vision Model
    const inputs: any[] = [prompt];
    validImages.forEach(base64 => {
      inputs.push({
        inlineData: {
          data: base64,
          mimeType: "image/jpeg",
        }
      });
    });

    // Use Vision Model because we are sending images
    const result = await geminiVisionModel.generateContent(inputs);
    const responseText = result.response.text();
    
    // Clean up JSON
    let cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("Gemini Raw Response:", cleanedJson);
    const analysisData: MallProjectAnalysis = JSON.parse(cleanedJson);

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
