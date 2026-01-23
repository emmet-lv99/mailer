
import { geminiVisionModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

// Force Rebuild
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { users } = body; // Array of selected users with their recent posts

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 });
    }

    // Process each user
    const analyzedResults = await Promise.all(
      users.map(async (user: any) => {
        // Prepare prompt
        const prompt = `
          Analyze this Instagram profile based on the recent posts.
          
          User: @${user.username}
          Bio: ${user.biography || "No bio"}
          Owner Name: ${user.full_name}
          
          Task:
          1. Determine if this user is potential influencer for a "Home Cafe", "Interior", or "Lifestyle" brand.
          2. Extract key mood keywords (e.g., Minimalist, Cozy, Luxury).
          3. Is the content likely original or reposted?
          
          Output JSON format:
          {
            "is_target": boolean,
            "category": string,
            "mood_keywords": string[],
            "originality_score": number (1-10),
            "summary": "Brief summary in Korean"
          }
        `;

        // Prepare images for Vision (limit to 3 for cost/speed)
        const imageParts = [];
        for (const post of user.recent_posts.slice(0, 3)) {
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
