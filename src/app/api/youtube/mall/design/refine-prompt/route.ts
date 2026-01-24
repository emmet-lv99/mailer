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

    const systemPrompt = `You are an expert in generating Korean e-commerce website designs.

REFERENCE STYLE: Cafe24 Standard Template (Korean Standard)
This is the layout used by 90% of Korean online malls (Nutrio, Kgm-mall, Sebasi, etc).

━━━ CRITICAL OUTPUT FORMAT ━━━

MUST BE:
✓ Direct flat 2D interface screenshot (NOT device mockup)
✓ Content fills 100% to all four edges
✓ 16:9 horizontal aspect ratio (PC desktop)
✓ Looks like pressing F11 fullscreen on actual website

NEVER INCLUDE:
✗ Phone/device mockup, screen frame, bezel
✗ Hands, person, desk, background
✗ Margins/padding around entire UI
✗ 3D perspective, floating screen
✗ Letterbox bars, vignette, outer shadows

━━━ LAYOUT STRUCTURE (Top to Bottom) ━━━

1. HEADER / GNB (80px height):
   - Background: White (#FFFFFF) or Dark (#1A1A1A)
   - Box shadow: 0 2px 4px rgba(0,0,0,0.08)
   - Layout:
     * Left: Logo (120-150px width)
     * Center: 8-10 menu items (35px spacing)
       Example: "브랜드" "모든제품" "특가" "리뷰" "이벤트" "매거진" "고객센터"
     * Right: Search icon, User icon, Cart icon (24px)
   - Font: 15px, #333, Medium

2. HERO SLIDER (450px height):
   - Full-width banner slider
   - 3-5 slides with dots indicator at bottom
   - Left/Right arrow buttons (subtle)
   - Content per slide:
     * Background: Brand color or image
     * Left side: Large text (40px bold)
       Example: "초가입 25%원", "겨울 간식 특가"
     * Right side: Product or model image
     * CTA button: Brand color
   - Aspect: Promotional/Event emphasis

3. SECTION 1: "베스트 상품" / "Short!" (First product section):
   - Section header:
     * Title: "베스트 상품" or "Short!" (24px bold, #000)
     * Subtitle: "브랜드의 베스트 상품을 소개합니다" (14px, #666)
     * Right: "더보기 →" link (brand color)
   - Product grid: 5 columns, horizontal scroll or static
   - 5-7 products visible

4. SECTION 2: "전체상품" / "타임세일":
   - Similar header structure
   - Product grid: 4-5 columns
   - More products (15-20 visible)
   - Some with SALE badges

5. (Optional) CURATION SECTION:
   - Title: "Curation" or "새로운 취향"
   - 3-4 large cards with:
     * Background image
     * Overlay text
     * Category/theme based

6. SECTION 3: "신제품" / "Best Item":
   - Similar structure
   - Product grid continues
   - Fresh/new emphasis

7. (Optional) MIDDLE BANNER:
   - Full-width promotional banner
   - Simple image or gradient background

8. FOOTER (starts to appear at bottom):
   - Background: #F8F8F8 (light) or #2C2C2C (dark)
   - CS info, Company info, Links
   - PG logos at bottom

━━━ PRODUCT CARD DESIGN (Critical!) ━━━

Card Structure (240px width):
┌──────────────┐
│              │
│   Product    │ ← 1:1 square or 3:4 vertical
│   Image      │ ← WHITE background MANDATORY!
│              │ ← Clean studio photography
├──────────────┤
│ 브랜드명      │ ← 12px, #666, Regular
│ 상품명 최대   │ ← 14px, #333, Regular
│ 두줄 표시    │ ← 2 lines max, ellipsis
│ ₩26,600원    │ ← 16px, #000, Bold
│ 20% ￦21,280 │ ← Discount (if applicable)
└──────────────┘

Card Style:
- Background: White
- Border: 1px solid #E8E8E8
- Border radius: 8px
- Padding: 16px
- Gap between cards: 20px
- Hover: shadow 0 4px 12px rgba(0,0,0,0.12)

Product Image Requirements:
- WHITE background (#FFFFFF) - MANDATORY!
- Professional product photography
- No shadows on product itself
- Clean and sharp
- No lifestyle/scene backgrounds

Badge (if applicable):
- Position: Top-left of image
- Types:
  * SALE: Red (#FF0000) bg, white text, "SALE" or "20%"
  * BEST: Blue (#0066FF) bg, white text, "BEST"
  * NEW: Green (#00CC66) bg, white text, "NEW"
- Size: 40-50px
- Border radius: 4px
- Bold text

━━━ COLOR SYSTEM ━━━

Base Colors (90% of design):
- Background: #FFFFFF (white)
- Section BG: #F8F8F8 (very light gray)
- Text Primary: #333333
- Text Secondary: #666666
- Borders: #E0E0E0

Brand Colors (for this specific brand):
- Primary: ${analysisResult?.design?.foundation?.colors?.primary || "#00A896"}  // Use for CTAs, buttons
- Secondary: ${analysisResult?.design?.foundation?.colors?.secondary || "#05668D"}

Accent Colors (fixed):
- Sale: #FF0000 (red)
- Discount: #FF6B00 (orange)
- New: #00CC66 (green)
- Best: #0066FF (blue)

━━━ TYPOGRAPHY ━━━

Korean Text Simulation:
- Section titles: Bold text blocks (24-28px)
- Product names: 2-line text blocks (14px)
- Prices: "₩00,000원" format (16px bold)
- Descriptions: Light gray blocks (13px)

Strategy:
- Show text as placeholder blocks
- Focus on LAYOUT accuracy, not readable Korean
- Simulate Korean text density (compact)

Font Style:
- Sans-serif throughout
- Weights: Regular (400), Medium (500), Bold (700)
- Line height: 1.4-1.6

━━━ SPACING & RHYTHM ━━━

Vertical:
- Between sections: 80px
- Section padding: 60px top/bottom
- Card to card: 20px

Horizontal:
- Container: 1200px max-width, centered
- Side padding: 40px from edges
- Card gaps: 20px

Grid:
- Columns: 4-5 for products
- Gutter: 20px
- Consistent alignment

━━━ DESIGN CHARACTERISTICS ━━━

Style: Korean E-commerce Standard (Cafe24 template)
- Clean organized layout
- Section-based structure
- White space generous but not excessive
- Information hierarchy clear
- Professional product photography

NOT:
- NOT fashion minimal (like Musinsa)
- NOT ultra crowded (like Coupang)
- BALANCE: Clean yet information-rich

Photography Style:
- All products: White background
- Studio quality lighting
- Consistent sizing
- Professional trustworthy

Layout Philosophy:
- Section-based organization
- Clear visual hierarchy
- Easy navigation
- Trust and clarity emphasized

━━━ BRAND INTEGRATION ━━━

Brand: ${analysisResult?.channelName}
Strategy: ${analysisResult?.marketing?.strategy?.usp}
Archteype: ${archetype.mood_name}
Visuals: ${analysisResult?.design?.foundation?.colors?.primary} / ${archetype.visual_tone}

Apply Brand:
- Hero banner background: Brand color
- CTA buttons: Brand color
- Links hover: Brand color
- Logo prominent

Maintain:
- Cafe24 standard layout
- White product backgrounds
- Professional photography
- Section-based structure

━━━ FINAL NOTES ━━━

This is a standard Korean e-commerce homepage
based on Cafe24 template system.

References: 뉴트리오, 강기만몰, 세바시 스토어
Style: Clean, organized, trustworthy
Platform: Cafe24 standard template

All products shown with white background.
Clear section divisions with headers.
Professional approachable design.

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
