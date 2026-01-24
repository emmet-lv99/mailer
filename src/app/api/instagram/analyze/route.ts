
import { geminiVisionModel } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Force Rebuild
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { users, promptType = 'INSTA' } = body; 

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 });
    }

    // Fetch settings & Prompt
    let analysisLimit = 10;
    let systemPromptTemplate = "";
    
    // Validate promptType to prevent injection or errors
    const validPromptType = (promptType === 'INSTA' || promptType === 'INSTA_TARGET') ? promptType : 'INSTA';

    try {
        // Parallel fetch for Settings and Prompt
        const [settingRes, promptRes] = await Promise.all([
            supabase.from('settings').select('value').eq('key', 'insta_analysis_limit').single(),
            supabase.from('prompts').select('content').eq('prompt_type', validPromptType).eq('is_default', true).single()
        ]);
        
        if (settingRes.data?.value) {
            analysisLimit = parseInt(settingRes.data.value, 10) || 10;
        }

        if (promptRes.data?.content) {
            systemPromptTemplate = promptRes.data.content;
        }
    } catch (e) {
        console.warn("Failed to fetch settings/prompt", e);
    }

    // Default Fallback Prompt (Hardcoded)
    if (!systemPromptTemplate) {
        if (validPromptType === 'INSTA_TARGET') {
             // Fallback for Target Analysis
             systemPromptTemplate = `
              Deeply analyze this specific Instagram profile for influencer marketing potential.
              
              User: @{{username}}
              Bio: {{biography}}
              Owner Name: {{full_name}}
              
              Task:
              1. **Persona Analysis**: Describe the influencer's persona, tone, and main audience demographics.
              2. **Content Strategy**: Analyze their visual style and content themes.
              3. **Brand Fit**: Evaluate suitability for high-end lifestyle brands.
              4. **Keywords**: Extract sophisticated mood keywords.
              5. **Score**: Originality score (1-10).
              
              Output JSON format:
              {
                "is_target": boolean,
                "category": string,
                "mood_keywords": string[],
                "originality_score": number,
                "summary": "Detailed analysis in Korean."
              }
            `;
        } else {
            // Fallback for General Tag Search (Discovery)
            systemPromptTemplate = `
              Analyze this Instagram profile based on the recent posts.
              
              User: @{{username}}
              Bio: {{biography}}
              Owner Name: {{full_name}}
    
              Market Categories:
              1. Fashion & Style (패션/스타일)
              2. Beauty (뷰티)
              3. Food & Gourmet (푸드/맛집)
              4. Living & Interior (리빙/인테리어)
              5. Travel & Leisure (여행/레저)
              6. Tech & Electronics (테크/가전)
              7. Health & Wellness (운동/건강)
              8. Parenting & Kids (육아/키즈)
              9. Pet (반려동물)
              10. Culture & Hobby (컬쳐/취미)
              
              Task:
              1. **Category Classification**: Select ONE category from the list above that best fits this user.
              2. **Target Check**: Determine if this user is a potential influencer for "Home Cafe", "Interior", or "Lifestyle" brands (is_target = true if categories match Living/Food/Culture or style fits).
              3. **Keywords**: Extract key mood keywords (e.g., Minimalist, Cozy, Luxury).
              4. **Originality**: Score the content originality (1-10).
              
              Output JSON format:
              {
                "is_target": boolean,
                "category": string (One of the Market Categories),
                "mood_keywords": string[],
                "originality_score": number (1-10),
                "summary": "Brief summary in Korean explaining why this category was chosen and the influencer potential."
              }
            `;
        }
    }

    // Process each user
    const analyzedResults = await Promise.all(
      users.map(async (user: any) => {
        // Prepare Comment Text
        let commentsText = "No comments available.";
        if (user.recent_posts) {
            const allComments = user.recent_posts.flatMap((p: any) => p.latest_comments || []);
            // Filter out own comments (optional, but let's keep all for context or filter? User said "Reaction of OTHERS" usually)
            // But let's just pass all and let AI decide, or filter owner?
            // Let's filter out owner comments to analyze pure fan reaction.
            const fanComments = allComments.filter((c: any) => c.ownerUsername !== user.username);
            
            if (fanComments.length > 0) {
                commentsText = fanComments.map((c: any) => `- ${c.text}`).slice(0, 30).join("\n"); // Limit to 30 comments to save context window
            }
        }

        // Variable Replacement
        const prompt = systemPromptTemplate
            .replace(/{{username}}/g, user.username || "")
            .replace(/{{biography}}/g, user.biography || "No bio")
            .replace(/{{full_name}}/g, user.full_name || "")
            .replace(/{{comments}}/g, commentsText); // [NEW] Inject comments

        // Prepare images for Vision (limit based on settings)
        const imageParts = [];
        for (const post of user.recent_posts.slice(0, analysisLimit)) {
            if (post.imageUrl) {
                try {
                    // Fetch image with headers to mimic browser and avoid 403
                    const imageResp = await fetch(post.imageUrl, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            "Referer": "https://www.instagram.com/"
                        }
                    });

                    if (imageResp.ok) {
                        const imageBuffer = await imageResp.arrayBuffer();
                        imageParts.push({
                            inlineData: {
                                data: Buffer.from(imageBuffer).toString("base64"),
                                mimeType: "image/jpeg",
                            },
                        });
                    } else {
                        console.warn(`Failed to fetch image: ${imageResp.status} ${imageResp.statusText}`);
                    }
                } catch (e) {
                    console.error(`Failed to fetch image for ${user.username}`, e);
                }
            }
        }

        try {
            // Call Gemini Vision
            const result = await geminiVisionModel.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = response.text();
            
            // Robust JSON extraction
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No JSON found in response");
            }
            const jsonStr = jsonMatch[0];
            const analysis = JSON.parse(jsonStr);

            return {
                username: user.username,
                analysis,
                success: true
            };

        } catch (error: any) {
            console.error(`Analysis failed for ${user.username}`, error);
            return {
                username: user.username,
                success: false,
                error: error.message || "Unknown error"
            };
        }
      })
    );

    return NextResponse.json({ results: analyzedResults });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
