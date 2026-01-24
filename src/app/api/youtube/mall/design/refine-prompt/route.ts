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

    const systemPrompt = `You are an expert in generating Korean fashion e-commerce website designs.

REFERENCE SITE: MUSINSA (무신사)
This is the gold standard for Korean fashion commerce design.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CRITICAL: OUTPUT FORMAT]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate a DIRECT, FLAT, 2D SCREENSHOT of the website.

NEVER INCLUDE:
❌ Phone mockup, device frame, screen bezel
❌ Hands, person holding device, desk, background
❌ 3D perspective, floating screen, any device context
❌ Margins/padding around the entire UI
❌ Letterbox bars, vignette, outer shadows

✅ MUST BE:
Pure flat interface screenshot (like pressing F11 fullscreen)
Content fills 100% of the image to all four edges
Looks exactly like a real website screenshot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[KOREAN FASHION COMMERCE DESIGN SYSTEM]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on MUSINSA visual language:

1. LAYOUT STRUCTURE:

PC Desktop (16:9 horizontal):
┌─────────────────────────────────────────┐
│ GNB (60-80px height)                     │ White or Dark bg
│ Logo | Menu Items | Search | Cart/User  │
├─────────────────────────────────────────┤
│ HERO BANNER (400-500px height)          │ Full-width colored bg
│ Large text + Model image                │
├─────────────────────────────────────────┤
│ CATEGORY ICONS (Grid)                   │ White bg
│ [Icon] [Icon] [Icon] [Icon] [Icon] [Icon]│ 6-8 columns
│ Text   Text   Text   Text   Text   Text  │
├─────────────────────────────────────────┤
│ PRODUCT GRID                            │ Light gray bg #F5F5F5
│ [Card] [Card] [Card] [Card] [Card]      │ 5 columns
│ [Card] [Card] [Card] [Card] [Card]      │
│ [Card] [Card] [Card] [Card] [Card]      │
└─────────────────────────────────────────┘

Key Measurements:
- Section padding: 40-60px top/bottom
- Card spacing: 20-30px gap
- Grid columns: 4-6 items per row
- Card width: ~220-280px equivalent

2. COLOR SYSTEM:

Base Colors (Minimal):
- Background: #FFFFFF (pure white)
- Secondary BG: #F5F5F5 ~ #F8F8F8 (light gray)
- Text: #000000 ~ #333333 (black/dark gray)
- Borders: #E0E0E0 (very light gray)

Accent Colors (Badges/CTAs only):
- Sale/BEST: #FF0000 (red)
- Discount %: #FF0000 or #FF6B00 (red/orange)
- Special: #0066FF (blue) or #FFD700 (yellow)
- Brand Color: Apply to hero banner bg only

IMPORTANT: 
- 90% white/gray base
- Color only on badges, CTAs, hero banners
- NOT colorful throughout
- Clean minimal aesthetic

3. TYPOGRAPHY:

Korean Font Simulation:
Since Imagen struggles with Korean text, use this strategy:

For Headlines (Hero banner):
- Large bold text shapes (simulate Korean characters)
- Use simple geometric shapes that look like Korean
- Dark color on light bg, or light color on dark bg

For Product Names:
- Show as 1-2 lines of gray text blocks
- Simulate Korean text density (more compact than English)

For Prices:
- Show as "₩00,000원" format
- Red color if on sale
- Bold weight

For Category Labels:
- Small text blocks below icons
- Gray color #666666

Strategy: Focus on LAYOUT, not readable text
Show WHERE text would be, not actual Korean characters

4. ICON SYSTEM:

Style: Line icons (Stroke-based)
- Simple minimal line art
- 1-2px stroke weight
- Black (#000000) or dark gray (#333333)
- No fill, outline only

Categories:
- Size: 40-50px
- Style: Simple recognizable shapes
- Examples: Bag outline, Shirt outline, Shoe outline
- White card background (#FFFFFF)

GNB Icons:
- Size: 20-24px  
- Cart, User, Search icons
- Line style consistent

5. PRODUCT CARDS:

Structure:
┌──────────────┐
│  [Product]   │ ← Image (white bg)
│   [Image]    │ ← Square or 3:4 ratio
│              │
├──────────────┤
│ Brand Name   │ ← Gray text #666
│ Product Name │ ← Black text #000
│ ₩00,000원    │ ← Price (red if sale)
│ [SALE badge] │ ← Top-left of image
└──────────────┘

Image:
- Clean white background (#FFFFFF)
- Professional product photography
- No shadows or minimal subtle shadow
- Sharp clean edges

Badges:
- SALE: Red rectangle (#FF0000), white text, top-left
- BEST: Red circle (#FF0000), white text
- Size: 30-40px, small and compact

6. HERO BANNER:

Layout:
- Full-width section
- Colored background (not white)
- Large bold text (left side)
- Model image (right side)
- 400-500px height equivalent

Colors:
- Dark: #000000, #1A1A1A, #2C2C2C
- Colored: Blue gradient, Brand color
- Text: White on dark, Dark on light

Text:
- Large headline (simulate Korean with shapes)
- Accent badges (yellow/blue rectangles)
- High contrast for readability

7. SPACING & RHYTHM:

Vertical Spacing:
- Between sections: 60-80px
- Inside sections: 40px
- Between cards: 20-30px

Horizontal Spacing:
- Side padding: 40-60px from edges
- Card gaps: 20-30px
- Grid consistent spacing

Consistency:
- All sections aligned to same grid
- Consistent card sizes
- Uniform spacing throughout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[BRAND INTEGRATION]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Brand: ${analysisResult?.channelName}
USP: ${analysisResult?.marketing?.strategy?.usp}
Primary Clor: ${analysisResult?.design?.foundation?.colors?.primary}
Selected Mood: ${archetype.mood_name}
Technical DNA: Grid(${archetype.visual_dna.grid}), Radius(${archetype.visual_dna.radius})

Apply Brand Identity:
- Hero Banner: Use brand color as background
- Logo Area: Brand name prominent
- CTA Buttons: Brand color (if not conflicting with sale badges)
- Product Photos: Match brand mood/aesthetic

IMPORTANT:
Maintain Korean fashion commerce layout structure
Brand affects: colors, product photos, mood
Brand does NOT affect: layout grid, spacing, overall structure

If brand mood is "minimal":
→ Even MORE minimal than default (if possible)

If brand mood is "luxury":
→ Darker colors, gold accents, but same layout

If brand mood is "playful":
→ Brighter hero banner, but same grid structure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[TECHNICAL SPECIFICATIONS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dimensions:
- Aspect Ratio: 16:9 horizontal (PC desktop)
- Equivalent to: 1920px × 1080px viewport
- NOT 9:16 vertical (that's mobile)

Layout:
- Multi-column grid (4-6 columns for products)
- Full-width sections
- No narrow mobile-like layout
- Horizontal GNB menu (not hamburger)

Quality:
- Sharp clean rendering
- Realistic website screenshot quality
- Professional photography for products
- Clean anti-aliased edges

Realism:
- Must look like an actual functioning website
- Not a design concept or mockup
- Screenshot-realistic detail level

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[FINAL OUTPUT INSTRUCTION]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate ONE comprehensive Imagen 4 prompt for:

A Korean fashion e-commerce website (like MUSINSA)
- Flat 2D screenshot (no device mockup)
- 16:9 horizontal PC desktop layout  
- Clean minimal white/gray base
- Colorful badges/accents only
- Line icon category grid
- Multi-column product grid with white bg images
- Korean text simulated as text blocks/shapes
- Professional e-commerce photography
- Brand colors applied to hero banner

Page Type: ${pageType}

Priority:
1. No mockup/device frame (HIGHEST)
2. Korean fashion commerce aesthetic (MUSINSA-like)
3. Clean minimal design (not busy)
4. Proper PC layout (wide grid, not narrow)
5. Brand colors in hero banner

RETURN ONLY THE FINAL PROMPT STRING.
No preamble, explanation, or commentary.
Just the detailed Imagen 4 prompt.`;

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
