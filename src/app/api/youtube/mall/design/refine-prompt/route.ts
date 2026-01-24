import { DEFAULT_ARCHETYPE, DESIGN_ARCHETYPES } from "@/services/mall/design-archetypes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.ANMOK_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { analysisResult, referenceAnalysis, pageType } = await request.json();

    // 1. High-Precision 2-Tier Mood Matching (Scoring System)
    const keywords = analysisResult?.design?.concept?.keywords || [];
    const matchMood = (userKeys: string[]): string => {
        const upperUserKeys = userKeys.map(k => k.toUpperCase());
        const scores: Record<string, number> = {};
        
        Object.entries(DESIGN_ARCHETYPES).forEach(([moodKey, mood]) => {
            let score = 0;
            
            // Tier 1: Primary Keyword Matching (Weight: 10)
            mood.keywords.forEach(mk => {
                if (upperUserKeys.some(uk => uk.includes(mk) || mk.includes(uk))) {
                    score += 10;
                }
            });
            
            // Tier 2: Related Keyword Matching (Weight: 3)
            mood.related_keywords.forEach(rk => {
                if (upperUserKeys.some(uk => uk.includes(rk) || rk.includes(uk))) {
                    score += 3;
                }
            });
            
            scores[moodKey] = score;
        });

        // Sort by score and pick the winner
        const sortedMoods = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const winner = sortedMoods[0];
        console.log(`[Mood Matcher] Winner: ${winner[0]} (Score: ${winner[1]}) | Analysis Keys: ${keywords.join(', ')}`);
        return winner[1] > 0 ? winner[0] : 'MINIMAL_CORPORATE';
    };
    
    const moodKey = matchMood(keywords);
    const archetype = DESIGN_ARCHETYPES[moodKey] || DEFAULT_ARCHETYPE;

    // 2. Build Expert Prompt with Full Brand DNA Synthesis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are a specialist in generating high-conversion Korean E-commerce (K-Commerce) website designs for Imagen 4.

### [CRITICAL CORE REQUIREMENT: 2D FLAT UI SCREENSHOT]
Generate a DIRECT, FLAT, 2D SCREENSHOT of an actual Korean shopping mall website UI.
- **NOT A MOCKUP**. No device frames, no hands, no studio backgrounds.
- **NOT A PHOTO**. This is the digital interface itself.
- **PIXEL-FILLED**: 100% of the canvas MUST be part of the UI. Content bleeds to all four edges.

---

## [SECTION 1: KOREAN E-COMMERCE MANDATORY STYLE]
This design MUST look like top-tier Korean malls (Musinsa, 29CM, Market Kurly, Coupang, Naver Shopping).

1. **INFORMATION DENSITY (MAXIMAL)**: 
   - NOT minimal or spacious. Information-rich and busy but organized.
   - 100% pixel occupancy. Minimal whitespace (20-30px max between sections).
2. **K-COMMERCE ARCHITECTURE**:
   - GNB: Full-width top bar with 10+ category items, search, and icons.
   - HERO: Massive promotional banner (full-width).
   - CATEGORY GRID: 8-12 icons in 6 columns.
   - PRODUCT SKU GRID: High-density (4-6 items per row).
   - BADGES: Red "세일", "품절", "BEST", "50% 할인" badges everywhere.
3. **COLOR & VIBRANCY**:
   - Vibrant CTAs (Orange, Red, Green).
   - High-contrast promotional banners.
4. **K-TEXT STRATEGY (PLACEHOLDERS)**:
   - Represent complex Korean text as **gray/white rectangular placeholder blocks**.
   - Use simple legible Korean for key badges: "세일", "할인", "쿠팡".
   - The goal is LAYOUT accuracy, not text readability.

---

## [SECTION 2: PC DESKTOP LAYOUT (CRITICAL)]
THIS IS A PC DESKTOP WEBSITE VIEW (NOT MOBILE).
- **Aspect Ratio**: 16:9 horizontal (Landscape).
- **Width**: 1920px equivalent wide viewport.
- **Grid Logic**: Minimum 4-6 columns for product cards.
- **GNB**: Full horizontal menu, NOT a hamburger icon.

---

## [SECTION 3: STRATEGIC OVERRIDE RULES]
**K-COMMERCE DENSITY > BRAND MOOD**
- If the brand mood is "MINIMAL", "SCANDINAVIAN", or "ZEN": 
  → Still maintain K-Commerce information density. 
  → Apply the mood ONLY to photography and clean typography, NOT the layout volume.
- If the brand mood is "LUXURY":
  → Use darker tones and gold accents, but keep the layout DENSE and SKU-intensive.

---

## [SECTION 4: SOURCE DATA SYNTHESIS]
**Brand Identity**: ${analysisResult?.channelName} (${analysisResult?.marketing?.strategy?.usp})
**DNA Visuals**: ${analysisResult?.design?.foundation?.colors?.primary} / Type: ${analysisResult?.design?.foundation?.typography?.fontFamily}
**Selected Archetype**: ${archetype.mood_name}
**Archetype Technical DNA**: Lighting(${archetype.visual_dna.lighting}), Radius(${archetype.visual_dna.radius}), Physics(${archetype.lighting_detailed.philosophy})

---

## [SECTION 5: CRITICAL NEGATIVE CONSTRAINTS (MANDATORY)]
ABSOLUTELY NEVER INCLUDE:
- Phone mockup, smartphone frame, mobile bezel, iPhone frame, laptop/monitor frame.
- Hands, people using devices, desk surfaces, studio backgrounds, real-world context.
- Vignette, outer drop shadows, letterbox bars, margins/padding around the entire UI.
- Western minimal style (too sparse), Japanese zen whitespace (too empty).

[Output Instruction]
Generate a single technical prompt for Imagen 4 in English.
Focus on "Screenshot-realistic K-Commerce surface, 16:9 horizontal, 100% pixel-filled, high SKU density".
RETURN ONLY THE PROMPT STRING.`;

    const userContext = `
    Page Type: ${pageType}
    Brand: ${analysisResult?.channelName}
    Strategic Goal: Transform this DNA into a high-fidelity e-commerce surface.
    `;

    const result = await model.generateContent(systemPrompt + "\n\n" + userContext);
    const refinedPrompt = result.response.text().trim();

    return NextResponse.json({ refinedPrompt, archetypeKey: archetype.style_key });

  } catch (error: any) {
    console.error("Prompt Refinement API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
