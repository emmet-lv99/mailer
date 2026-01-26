
import {
  FOOTER_BLOCKS,
  HEADER_BLOCKS,
  MAIN_BLOCKS,
  PRODUCT_LIST_BLOCKS,
  SECTION_HEADER_BLOCKS,
  SUB_BANNER_BLOCKS
} from "@/services/mall/layout";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const ALL_BLOCKS = {
  ...MAIN_BLOCKS,
  ...SUB_BANNER_BLOCKS,
  ...PRODUCT_LIST_BLOCKS,
  ...HEADER_BLOCKS,
  ...FOOTER_BLOCKS,
  ...SECTION_HEADER_BLOCKS
};

const API_KEY = process.env.ANMOK_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const { 
      mode, // 'narrative' | 'code'
      marketing, 
      design,
      narrative // Only for 'code' mode
    } = await request.json();

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp"
    });

    // MODE 1: Generate Visual Narrative
    if (mode === 'narrative') {
        // Construct the strict layout map string
        const layoutMapping = design.foundation.shapeLayout.mainBlocks.map((block: any, i: number) => {
             // 1. Normalize ID (Handle legacy state from client)
             let blockType = block.type;
             if (blockType === 'hero-grid') blockType = 'hero'; 
             
             // 2. Lookup Spec (using normalized ID)
             const spec = ALL_BLOCKS[blockType] || {};
             
             // 3. Generate Description (Using Normalized ID for the header)
             return `
${i+1}. [${blockType.toUpperCase()}]
   - Visual Structure: ${spec.visualStructure?.replace(/\n/g, ' ') || 'Standard Block'}
   - Key Elements: ${spec.promptTemplate?.replace(/\n/g, ' ') || 'N/A'}
             `;
        }).join('\n');

        const narrativePrompt = `
          You are a Senior UI Engineer and Design System Architect.
          
          ## Task
          Translate the following Fixed Layout Structure into a precise "Visual Blueprint" description.
          **GOAL**: Create a text-based specification that a developer can turn into HTML/CSS without ambiguity.
          
          ## 1. LAYOUT BLUEPRINT (FOLLOW EXACT ORDER)
          The page consists of these exact sections. Describe them in this order:
          
          0. [HEADER] standard navigation
          ${layoutMapping}
          ${design.foundation.shapeLayout.mainBlocks.length + 1}. [FOOTER] standard footer
          
          ## 2. DESIGN TOKENS
          - Primary Color: ${design.foundation.colors.primary}
          - Secondary Color: ${design.foundation.colors.secondary}
          - Background: ${design.foundation.colors.background.main}
          - Font Family: ${design.foundation.typography.displayFontFamily} (Headings), ${design.foundation.typography.bodyFontFamily} (Body)
          - Border Radius: ${design.foundation.shapeLayout.borderRadius || '0px'}
          
          ## Output Requirement
          - **Format**: Plain text description.
          - **Tone**: Technical, dry, specification-focused.
          - **Detail**: For each block, maintain the "Visual Structure" defined above.
          - **No Fluff**: Do not include marketing copy or "Imagine a..." phrases.
          
          Start describing the blueprint now.
        `;

        const result = await model.generateContent(narrativePrompt);
        return NextResponse.json({ narrative: result.response.text() });
    }

    // MODE 2: Generate HTML Code
    if (mode === 'code') {
        if (!narrative) {
            return NextResponse.json({ error: "Narrative is required for code generation" }, { status: 400 });
        }

        const codePrompt = `
          You are an expert Frontend Developer.
          
          ## Task
          Build a single-file HTML landing page that **perfectly realizes** the following visual description.
          
          ## The Visual Control (CRITICAL)
          "${narrative}"

          ## Technical Specs
          - **Language**: Vanilla HTML5 + CSS3 (No frameworks like Tailwind or Bootstrap).
          - **Styling**: Write ALL CSS inside a \`<style>\` tag in the \`<head>\`.
          - **Layout**: Use Flexbox and Grid.
          - **Colors**: Use ${design.foundation.colors.primary} as the primary accent color. Background: ${design.foundation.colors.background.main}.
          - **Fonts**: Use Google Fonts (Inter, Noto Sans KR, etc).
          - **Icons**: Use FontAwesome (CDN provided) or simple SVGs.
          - **Images**: Use https://placehold.co/600x400/png?text=... (contextual text).
          
          ## STRICT LAYOUT ORDER (MUST FOLLOW)
          You MUST implement the page sections in this EXACT order. Do not reorder or skip any blocks:
          1. **Header** (Navigation)
          ${design.foundation.shapeLayout.mainBlocks.map((b: any, i: number) => `${i + 2}. **${b.name}**`).join("\n          ")}
          ${design.foundation.shapeLayout.mainBlocks.length + 2}. **Footer**

          ## STRICT Rules
          1. **Output ONLY HTML**: Return the raw HTML string including the <style> block.
          2. **Layout Integrity**: The HTML structure must rigorously follow the "Layout Structure" above.
          3. **Semantic Classes**: Use descriptive class names (e.g., .hero-container, .product-card).
          4. **Responsive**: Use @media queries for mobile adaptation.
          4. **Container**: Center the main content with a max-width (e.g., 1200px) and auto margins.
          5. **Reset**: Include a basic CSS reset at the top of your style block.
          
          Generate the full, valid HTML document now.
        `;

        const codeResult = await model.generateContent(codePrompt);
        let code = codeResult.response.text();
        code = code.replace(/^```html/, "").replace(/```$/, "");

        // [Safety Check] Ensure full HTML structure
        if (!code.includes("<!DOCTYPE html>")) {
           code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Preview</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@400;700&display=swap');
      body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body>
    ${code}
</body>
</html>`;
        }

        return NextResponse.json({ html: code });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

  } catch (error: any) {
    console.error("Code Gen API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
