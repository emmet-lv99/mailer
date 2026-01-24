import { geminiVisionModel } from "@/lib/gemini";
import { getChannelDetails, getChannelIdFromUrl, getRecentVideos, getVideoComments } from "@/lib/youtube";
import { MallProjectAnalysis } from "@/services/mall/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { channelUrl, competitorUrls, productCategories, targetAge, brandKeywords, referenceUrl } = await request.json(); // [Updated] Read Inputs

    if (!channelUrl) {
      return NextResponse.json({ error: "Channel URL is required" }, { status: 400 });
    }

    console.log("Analyzing URL:", channelUrl); 
    console.log("User Input:", { productCategories, targetAge });

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

    const allComments = commentsResults.flat().map((c: any) => `"${c.text}" (Likes: ${c.likes})`).join("\n");
    
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
      
      [Visual Context]
      I have provided the Channel Banner, Profile Icon, and recent Video Thumbnails. 
      Analyze the branding consistency, color usage, and visual identity from these images.
      
      [Task]
      Generate a JSON object matching the following structure ONLY.
      - **LANGUAGE**: "target.ageRange" and "mood.imagery" MUST be in **KOREAN (한국어)**.
      - **KEYWORDS**: "design.concept.keywords" MUST be in **ENGLISH (ALL CAPS)**.
      - **VOCABULARY**: Prioritize selecting from these specific technical styles:
        [MINIMAL, BRUTALIST, SCANDINAVIAN, JAPANESE, CORPORATE, SWISS,
         VINTAGE, RETRO, ORGANIC, NATURAL, LUXE, PREMIUM, PLAYFUL, STREETWEAR]

      Structure:
      {
        "channelName": string,
        // 1. Marketing (Simplified)
        "marketing": {
          "target": { 
             "ageRange": "18-24" | "25-34" | "35-44" | "45+", // Infer from comments/content
             "gender": "ALL",
             "interests": ["General Interest"] 
          },
          "persona": { "name": "Standard Persona", "oneLiner": "Standard Customer", "needs": [], "painPoints": [] },
          "product": { "categories": [], "priceRange": "mid", "keyFeatures": [] },
          "strategy": { 
            "usp": "Standard Strategy", 
            "mood": "Standard Mood",
            "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
            "brandArchetype": { "primary": "Creator", "secondary": "Everyman", "mixReason": "Standard" },
            "storyBrand": { "hero": "", "problem": "", "guide": "", "plan": "", "success": "" },
            "competitors": []
          }
          // "structure" removed
        },
        // 2. Design (Focused on 3 Key Fields)
        "design": {
          "concept": { 
             "keywords": string[], // [CRITICAL] 3-5 English Keywords (e.g. MINIMAL, PLAYFUL)
             "description": string 
          },
          "foundation": {
            "colors": { 
               "primary": hex, // [CRITICAL] Extract dominate brand color from banner/profile
               "secondary": "#333333", 
               "background": { "main": "#FFFFFF", "sub": "#F8F8F8" }, 
               "text": { "title": "#111111", "body": "#666666", "disabled": "#CCCCCC" } 
            },
            "typography": { "fontFamily": "Noto Sans KR", "scale": "standard", "weightRule": "standard" },
            "shapeLayout": { "borderRadius": "8px", "spacing": "comfortable", "grid": "cafe24-standard" }
          },
          // "components" removed
          "mood": { "imagery": string, "graphicMotifs": "standard", "iconography": "standard" }
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

    // [New] Override with User Inputs
    if (productCategories && productCategories.length > 0) {
       console.log("Overriding Categories with:", productCategories);
       analysisData.marketing.product.categories = productCategories;
    }
    // targetAge Removed. AI infers it.
    if (brandKeywords) {
       console.log("Overriding Keywords with:", brandKeywords);
       // Split comma-separated keywords if necessary, or just treat as one if schema allows.
       // The prompt 'refine-prompt' expects English keywords for Mood Matching, 
       // but user entered Korean keywords (likely). 
       // We will append them to 'design.concept.description' or 'marketing.strategy.mood'.
       // For now, let's put them in 'design.concept.keywords' as well, expecting mixed language usage is fine downstream.
       const keywords = (brandKeywords as string).split(',').map((k: string) => k.trim());
       analysisData.design.concept.keywords = keywords; 
    }
    // We don't explicitly store referenceUrl in the standard schema yet, 
    // but we can log it or pass it if extended fields allow. 
    // For now, the user request "This site's structure based..." implies it's for the NEXT step.
    // If refine-prompt needs to know about it, we should add it to the schema.
    // But simplified schema focuses on 3 key fields.
    // Let's assume Reference URL is for human reference or future use.

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
