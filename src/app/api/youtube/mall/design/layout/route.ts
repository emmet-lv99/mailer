import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.ANMOK_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const { 
      marketing, 
      design,
      reference // optional
    } = await request.json();

    console.log("[LayoutAPI] Generating layout for:", marketing.strategy.mood);

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert UX/UI Designer and Frontend Architect.
      Your task is to generate a structured JSON layout for a shopping mall main page based on the provided Brand Analysis.
      
      ## Brand Context
      - Target Audience: ${JSON.stringify(marketing.target)}
      - Selling Strategy: ${marketing.strategy.usp}
      - Brand Mood: ${design.concept.keywords?.join(", ") || marketing.strategy.mood}
      - Product Category: ${marketing.product.categories.join(", ")}

      ## Task
      Construct a list of 'LayoutBlocks' that best suits this brand's strategy.
      For example, a luxury brand might need large "Hero" images and minimal text. A discount store needs dense "Product Grids" and "Promotion Banners".

      ## Available Block Types
      You must ONLY use the following categories and types:

      1. Category: 'main' (The top hero section. ONE only)
         - Types: 'carousel-center' (classic), 'hero' (editorial/fashion), 'video-full' (immersive)
      
      2. Category: 'sub' (Banners, Promotions, Brand Story)
         - Types: 'image-strap' (full width image), 'promotion-bar' (text only), 'grid-2-banner' (2 col), 'grid-3-banner' (3 col)
      
      3. Category: 'product-list' (Product Displays)
         - Types: 'grid-4' (standard), 'grid-5' (dense), 'scroll-x' (horizontal scroll)

      ## Output Schema (JSON)
      Return an object with a 'mainBlocks' array.
      
      Example:
      {
        "mainBlocks": [
          { "id": "block-1", "category": "main", "type": "hero" },
          { "id": "block-2", "category": "sub", "type": "promotion-bar" },
          { "id": "block-3", "category": "product-list", "type": "grid-4" }
        ],
        "reasoning": "Explain why you chose this layout in 1 sentence."
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Layout Gen API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
