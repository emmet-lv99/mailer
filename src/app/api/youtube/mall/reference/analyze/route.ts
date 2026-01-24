import { geminiVisionModel } from "@/lib/gemini";
import { DesignSpec } from "@/services/mall/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { images } = await request.json(); // Array of base64 strings

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Reference images are required" }, { status: 400 });
    }

    console.log(`Analyzing ${images.length} reference images...`);

    // Prepare parts for Gemini Vision
    // Handle both "data:image/png;base64,..." formats and raw base64
    const imageParts = images.map((img: string) => {
      const base64Data = img.split(",")[1] || img;
      return {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg", // Default to jpeg, or detect from header if needed
        },
      };
    });

    const prompt = `
      You are an expert UI/UX Designer and Brand Stylist.
      Analyze these reference images provided by the user.
      Extract the visual style, color palette, foundation, and component characteristics to create a cohesive Design Specification.

      [Task]
      Generate a JSON object matching the 'DesignSpec' structure below. 
      Focus on finding the *common pattern* across the provided images.
      - **LANGUAGE**: All values (descriptions, colors, component details) MUST be in **KOREAN (한국어)**.
      - **EXCEPTIONS**: The "concept.keywords" field MUST be in **ENGLISH (ALL CAPS)** for technical matching (e.g., ["MINIMAL", "NEON", "VINTAGE"]).
      - **KEYS**: Use camelCase keys.
      
      Structure:
      {
        "concept": { "keywords": string[], "description": string },
        "foundation": {
          "colors": { "primary": hex, "secondary": hex, "background": { "main": hex, "sub": hex }, "text": { "title": hex, "body": hex, "disabled": hex } },
          "typography": { "fontFamily": string, "scale": string, "weightRule": string },
          "shapeLayout": { "borderRadius": string, "spacing": "compact"|"comfortable"|"airy", "grid": string }
        },
        "components": { "buttons": string, "cards": string, "inputForm": string, "gnbFooter": string },
        "mood": { "imagery": string, "graphicMotifs": string, "iconography": string }
      }
      
      Return ONLY the JSON. No markdown ticks.
    `;

    const result = await geminiVisionModel.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean up
    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    console.log("Gemini Vision Response:", cleanedJson);
    
    const designSpec: DesignSpec = JSON.parse(cleanedJson);

    return NextResponse.json(designSpec);

  } catch (error) {
    console.error("Reference Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
