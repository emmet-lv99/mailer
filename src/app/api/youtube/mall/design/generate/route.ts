import { NextResponse } from "next/server";

const API_KEY = process.env.ANMOK_GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    const { 
      prompt, 
      pageType, 
      referenceImage, // [NEW] Base64 reference image
      aspect_ratio = "1:1", 
      number_of_images = 3 
    } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log(`[Imagen] Generating design for ${pageType} with prompt length: ${prompt.length}. Reference image? ${!!referenceImage}`);

    // Standard Gemini API endpoint for Imagen
    const modelName = "imagen-4.0-generate-001"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${API_KEY}`;

    // Prepare instances. If referenceImage exists, we can use it as a style/structural reference.
    // Note: Imagen 3/4 REST API structure for reference images can vary by task.
    // For pure reference, we often add it to the instance or use specific parameters.
    const instance: any = { prompt };
    
    // Simple consistency logic: If referenceImage is provided, we use it.
    // (Note: Implementation details for specific reference levels can be tuned)
    if (referenceImage) {
      instance.image = {
        bytesBase64Encoded: referenceImage.replace(/^data:image\/\w+;base64,/, "")
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [instance],
        parameters: {
          sampleCount: number_of_images,
          aspectRatio: aspect_ratio,
          // Optional: If using referenceImage, we might want to tune the strength
          // styleReferenceLevel: referenceImage ? "HIGH" : undefined 
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Imagen API Full Error:", JSON.stringify(data, null, 2));
      return NextResponse.json({ 
        error: data.error?.message || "Imagen API failed",
        details: data.error
      }, { status: response.status });
    }
    
    if (!data.predictions || data.predictions.length === 0) {
      console.log("[Imagen] Empty predictions. Full response:", JSON.stringify(data, null, 2));
      throw new Error("No images generated");
    }

    const images = data.predictions.map((p: any) => p.bytesBase64Encoded);

    return NextResponse.json({ images });

  } catch (error: any) {
    console.error("Design Generation API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
