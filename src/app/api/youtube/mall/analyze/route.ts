import genAI, { geminiVisionModel } from "@/lib/gemini";
import { getChannelDetails, getChannelIdFromUrl, getRecentVideos, getVideoComments } from "@/lib/youtube";
import { STANDARD_DESIGN_KEYWORDS } from "@/services/mall/design-keywords";
import { MallProjectAnalysis } from "@/services/mall/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { channelUrl, competitorUrls, targetAge, brandKeywords, referenceUrl } = await request.json(); // [Updated] Read Inputs

    if (!channelUrl) {
      return NextResponse.json({ error: "Channel URL is required" }, { status: 400 });
    }

    console.log("Analyzing URL:", channelUrl); 
    console.log("User Input:", { targetAge });

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
      ? await getRecentVideos(channelInfo.uploadsPlaylistId, 50) // Analyze recent 50
      : [];

    // [New] Fetch Comments & Prepare Thumbnails
    // Balance visual inputs: 1 Banner + 1 Profile + 5 Video Thumbnails = 7 Images
    const topVideos = videos.slice(0, 5); 
    
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
      topComments: allComments.slice(0, 2000), 
    };

    // [New] Step 2.5: Google Search Grounding (Research)
    let searchContext = "";
    try {
        const researchModel = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash", 
            // @ts-ignore - googleSearch is supported in v2 but types might be outdated
            tools: [{ googleSearch: {} }] 
        });
        
        const searchPrompt = `
        Search for the YouTube channel "${channelInfo.title}" (Korean: ${channelInfo.title}).
        Specifically investigate:
        1. **Gender Ratio**: Is the subscriber base mostly Male or Female? (Search for "남녀 성비", "시청자 비율")
        2. **Core Age Group**: Which age group is most active?
        3. **Content Themes**: Does it deal with Army/Military (군대), Gaming, or Beauty?
        
        Summarize the demographics clearly (e.g., "Male dominated", "Female dominated", or "Balanced").
        `;
        
        const searchResult = await researchModel.generateContent(searchPrompt);
        const searchText = searchResult.response.text();
        if (searchText) {
            console.log("Creation: Google Search Result:", searchText);
            searchContext = `[Google Search Insights]\n${searchText}`;
        }
    } catch (e) {
        console.warn("Google Search Grounding Failed (Skipping):", e);
    }

    // 3. Prompt Gemini (Multimodal)
    const prompt = `
      You are an expert Brand Consultant and Mall Designer. 
      Analyze the given YouTube channel and its videos to create a comprehensive Shopping Mall Strategy and Design Concept.
      
      [IMPORTANT] ALL OUTPUT MUST BE IN KOREAN (한국어).
      
      Input: 
      - Channel URL: ${channelUrl}
      - Reference URL: ${referenceUrl || "None"}
      - Brand Keywords: ${brandKeywords || "None"}
      Description: ${analysisContext.description}
      Keywords: ${analysisContext.keywords}
      
      [Data Source 1: External Reputation (Google Search)]
      ${searchContext || "No search data available."}

      [Data Source 2: Content Strategy (Video History)]
      Recent 50 Videos: ${JSON.stringify(analysisContext.recentVideos)}
      
      [Data Source 3: Audience Engagement (Comments)]
      Recent Comments: "
      ${analysisContext.topComments}
      "

      [Data Source 4: Visual Identity (Images)]
      I have provided the Channel Banner, Profile Icon, and recent Video Thumbnails. 
      
      [Analysis Protocol]
      1. **Search Phase**: First, look at [Data Source 1] to understand the channel's public perception, controversies, and general demographic consensus.
      2. **Content Phase**: Analyze [Data Source 2] to identify recurrent themes.
      3. **Engagement Phase**: Check [Data Source 3] to see *who* is actually talking.
      4. **Visual Phase**: Look at [Data Source 4] to identify existing brand colors and aesthetics.
      5. **Visual Translation Phase**: Translate the findings from steps 1-3 into specific visual languages. (e.g., "Humorous" [Soul] -> "Kitsch/Bold" [Tool]).

      [Demographic Heuristics]
      - **Army/Military (군대)**, Gaming, Cars, Sports -> **Strongly bias towards MALE**.
      - Beauty, Fashion, Diet, Vlog, Parenting -> **Strongly bias towards FEMALE**.
      - Sketch Comedy -> Can be mixed, but if it involves "Soldiers" or "Military", it is MALE.
      - **Controversy Check**: If there is a "Military Mockery" controversy, the core audience is likely MALE (who are angry).

      [Design Heuristics (Visual Translation)]
      - **Friendly / Humorous / B-tier** -> CASUAL, PLAYFUL, RETRO, VIBRANT, KITSCH.
      - **Professional / High-end / Tech** -> MINIMAL, MODERN, BOLD, INDUSTRIAL, LUXURY.
      - **Emotional / Warm / Daily** -> ORGANIC, NATURAL, WARM, COZY, PASTEL.
      - **Youthful / Trend-sensitive** -> POP, SPORTY, GRUNGE, CHIC, Y2K.

      [Standard Design Keyword Dictionary]
      Use ONLY these 22 keywords for "design.concept.keywords":
      - VISUAL STYLE: ${Object.entries(STANDARD_DESIGN_KEYWORDS.VISUAL_STYLE).map(([k, v]) => `${k} (${v})`).join(", ")}
      - MOOD/TONE: ${Object.entries(STANDARD_DESIGN_KEYWORDS.MOOD_TONE).map(([k, v]) => `${k} (${v})`).join(", ")}
      - COMPLEXITY: ${Object.entries(STANDARD_DESIGN_KEYWORDS.COMPLEXITY).map(([k, v]) => `${k} (${v})`).join(", ")}

      [Task Guidelines]
      Generate a JSON object matching the following structure ONLY.
      - **LANGUAGE**: "target.ageRange" and "mood.imagery" MUST be in **KOREAN (한국어)**.
      - **KEYWORDS**: "design.concept.keywords" MUST be selected ONLY from the [Standard Design Keyword Dictionary] above. Select 3-5 keys.
      - **VOCABULARY**: Select 3-5 keywords from the list in [Design Heuristics].

      [IMPORTANT] LOGICAL CONSISTENCY RULES:
      1. **STEP 1: REASONING**: Fill the \`_reasoning\` field first. 
         - Synthesize ALL 4 Data Sources & Demographic Heuristics.
         - **Visual Translation Logic**: Explicitly state how the Brand Soul (Strategy) translates into Visual Style (Design).
         - E.g., "The brand identity is 'Humorous' and 'Relatable' (Soul). Therefore, the design style should be 'KITSCH' and 'VIBRANT' (Tool) to reflect this energy."
      2. **STEP 2: EXECUTION**: Fill \`target.gender\` and \`target.ageRange\` based on the verdict.
      3. **STEP 3: ALIGNMENT**: 
         - \`marketing.strategy.brandKeywords\` must be abstract adjectives (Personality).
         - \`design.concept.keywords\` must be visual style nouns (Aesthetic), derived from those adjectives.
         - \`design.concept.description\` must explain the logical connection between the brand soul and the design style.

      [CRITICAL WARNING: ANTI-BIAS]
      - **DO NOT DEFAULT TO FEMALE PERSONA.** 
      - AI models often hallucinate that "Shopping Malls = Female". **BREAK THIS STEREOTYPE.**
      - IF Target is MALE:
        - Persona MUST be Male (e.g., "Kim Cheol-su").
        - Strategy MUST focus on Male values: "Utility, Spec, Humor, B-tier sensibility, Honest Review".
        - DO NOT talk about "Daily empathy", "Small happiness", "Mood" if the channel is a rough Male comedy.
      - IF Target is FEMALE:
        - Focus on "Mood, Empathy, Aesthetics".
      - IF Target is ALL:
        - Use gender-neutral terms.

      [Output JSON Structure]
      {
        "_reasoning": "Analyze the visuals here. State the dominant Gender (MALE/FEMALE/ALL) and Age Range clearly. This derivation guides the rest of the JSON.",
        "channelName": string,
        "marketing": {
          // 1. Target Audience
          "target": { 
             "ageRange": "20-30", 
             "gender": "FEMALE", // [CRITICAL] Must match _reasoning.
             "interests": [] 
          },
          // 2. Strategy (Must align with Target)
          "strategy": { 
            "usp": "Strategy description... (Must explicitly mention the Target Gender/Age identified in _reasoning)", 
            "brandKeywords": string[], // [CRITICAL] 3-5 keywords representing the channel's BRAND SOUL (e.g. Humorous, Relatable, Cozy)
            "mood": "Standard Mood",
            "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
            "brandArchetype": { "primary": "Creator", "secondary": "Everyman", "mixReason": "Standard" },
            "storyBrand": { "hero": "Target Audience", "problem": "", "guide": "Brand", "plan": "", "success": "" },
            "competitors": []
          },
          // 3. Persona (Derived directly from Target)
          "persona": { 
            "name": "Name", 
            "oneLiner": "Description (Must match Target Gender/Age)", 
            "needs": [], 
            "painPoints": [] 
          },
          // 4. Product Categories
          "product": { 
             "categories": string[], 
             "priceRange": "medium", 
             "keyFeatures": [] 
          }
        },
        // 2. Design (Visual style derived from Brand soul)
        "design": {
          "concept": { 
             "keywords": string[], // [CRITICAL] Derive 3-5 VISUAL STYLE keywords from the brand soul (e.g. KITSCH, VIBRANT, MINIMAL)
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
    // [New] Override with User Inputs
    // productCategories removed
    // targetAge Removed. AI infers it.
    if (brandKeywords) {
       console.log("Overriding Brand Keywords with:", brandKeywords);
       const keywords = (brandKeywords as string).split(',').map((k: string) => k.trim());
       analysisData.marketing.strategy.brandKeywords = keywords; 
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
