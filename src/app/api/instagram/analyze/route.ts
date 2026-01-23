
import { geminiVisionModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

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
                    // Fetch image and convert to base64
                    const imageResp = await fetch(post.imageUrl);
                    const imageBuffer = await imageResp.arrayBuffer();
                    imageParts.push({
                        inlineData: {
                            data: Buffer.from(imageBuffer).toString("base64"),
                            mimeType: "image/jpeg",
                        },
                    });
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
            
            // Clean markdown json
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const analysis = JSON.parse(jsonStr);

            return {
                username: user.username,
                analysis,
                success: true
            };

        } catch (error) {
            console.error(`Analysis failed for ${user.username}`, error);
            return {
                username: user.username,
                success: false,
                error: "Analysis failed"
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
