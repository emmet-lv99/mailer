import { DESIGN_ARCHETYPES } from "@/services/mall/design-archetypes";
import { STANDARD_DESIGN_KEYWORDS } from "@/services/mall/design-keywords";
import { FEW_SHOT_EXAMPLES, generateMainBlockPrompt, generateProductListPrompt, generateVideoPrompt, VISUAL_FIDELITY_RULES } from "@/services/mall/layout";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.ANMOK_GEMINI_API_KEY!);

/**
 * Universal E-commerce Design Prompt Generator
 */

interface ColorSystem {
  primary: string;
  secondary: string;
  background: { main: string; sub: string };
  text: { title: string; body: string; disabled: string };
  accent?: string;
  tone: 'warm' | 'cool' | 'neutral';
  saturation: 'low' | 'medium' | 'high';
  palette?: string[];
  useGradients?: boolean;
  vintage?: boolean;
  nature?: boolean;
  border?: string;
}

interface TypographySystem {
  fontFamily: string;
  scale: 'compact' | 'standard' | 'comfortable';
  weightRule: 'light' | 'standard' | 'bold';
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: string;
}

interface ComponentSystem {
  borderRadius: string;
  buttonStyle: 'sharp' | 'rounded' | 'pill';
  badgeStyle: 'minimal' | 'standard' | 'bold';
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  borderStyle: 'none' | 'thin' | 'standard' | 'thick';
  usePatterns?: boolean;
}

interface SpacingSystem {
  density: 'compact' | 'standard' | 'spacious';
  whitespaceMultiplier: number;
  sectionGap: number;
  cardGap: number;
  asymmetric?: boolean;
}

interface DesignSpec {
  keywords: string[];
  colors: ColorSystem;
  typography: TypographySystem;
  components: ComponentSystem;
  spacing: SpacingSystem;
}

class DesignInterpreter {
  public interpret(keywords: string[]): DesignSpec {
    const baseSpec = this.getBaseSpec();
    keywords.forEach(keyword => this.applyKeyword(keyword.toUpperCase().trim(), baseSpec));
    return this.normalize(baseSpec);
  }

  private applyKeyword(keyword: string, spec: DesignSpec): void {
    switch (keyword) {
      case 'RETRO':
        spec.colors.tone = 'warm';
        spec.colors.saturation = 'medium';
        spec.colors.vintage = true;
        spec.components.borderRadius = '8px';
        break;
      case 'MINIMAL':
        spec.colors.saturation = 'low';
        spec.spacing.whitespaceMultiplier *= 1.2;
        spec.components.borderRadius = '2px';
        spec.components.shadowIntensity = 'none';
        spec.components.borderStyle = 'none';
        spec.typography.weightRule = 'light';
        break;
      case 'VIBRANT':
        spec.colors.saturation = 'high';
        spec.colors.useGradients = true;
        spec.components.badgeStyle = 'bold';
        break;
      case 'LUXURY':
        spec.colors.palette = ['black', 'white', 'gold'];
        spec.spacing.whitespaceMultiplier *= 1.3;
        spec.typography.headingWeight = 600;
        spec.typography.fontFamily = 'Serif';
        spec.components.borderStyle = 'thin';
        break;
      case 'MODERN':
        spec.typography.fontFamily = 'Sans-serif';
        spec.components.borderRadius = '4px';
        spec.colors.tone = 'cool';
        break;
      case 'PLAYFUL':
        spec.components.borderRadius = '16px';
        spec.colors.tone = 'warm';
        spec.components.badgeStyle = 'bold';
        break;
      case 'INDUSTRIAL':
        spec.colors.palette = ['gray', 'dark-gray', 'black'];
        spec.components.borderRadius = '0px';
        spec.components.borderStyle = 'thick';
        break;
      case 'ORGANIC':
        spec.colors.tone = 'warm';
        spec.colors.nature = true;
        spec.components.borderRadius = '12px';
        break;
      case 'GEOMETRIC':
        spec.components.borderRadius = '0px';
        spec.components.usePatterns = true;
        break;
      case 'ARTISTIC':
        spec.colors.saturation = 'high';
        spec.spacing.asymmetric = true;
        break;
      case 'PROFESSIONAL':
        spec.colors.palette = ['navy', 'gray', 'white'];
        spec.typography.headingWeight = 600;
        spec.typography.fontFamily = 'Serif';
        spec.components.buttonStyle = 'sharp';
        break;
      case 'CASUAL':
        spec.components.borderRadius = '12px';
        spec.spacing.whitespaceMultiplier *= 1.1;
        spec.colors.tone = 'warm';
        break;
      case 'FRIENDLY':
        spec.colors.tone = 'warm';
        spec.components.borderRadius = '12px';
        spec.typography.lineHeight = 1.6;
        break;
      case 'ENERGETIC':
        spec.colors.saturation = 'high';
        spec.colors.tone = 'warm';
        spec.components.badgeStyle = 'bold';
        break;
      case 'CALM':
        spec.colors.saturation = 'low';
        spec.colors.tone = 'cool';
        spec.spacing.whitespaceMultiplier *= 1.2;
        break;
      case 'BOLD':
        spec.typography.headingWeight = 700;
        spec.components.borderStyle = 'thick';
        spec.components.badgeStyle = 'bold';
        break;
      case 'ELEGANT':
        spec.typography.fontFamily = 'Serif';
        spec.typography.weightRule = 'light';
        spec.spacing.whitespaceMultiplier *= 1.25;
        spec.colors.tone = 'neutral';
        break;
      case 'WARM':
        spec.colors.tone = 'warm';
        spec.typography.lineHeight = 1.6;
        break;
      case 'SIMPLE':
        spec.spacing.density = 'spacious';
        spec.components.borderStyle = 'thin';
        break;
      case 'DETAILED':
        spec.spacing.density = 'compact';
        spec.components.borderStyle = 'standard';
        break;
      case 'CLEAN':
        spec.colors.saturation = 'low';
        spec.spacing.whitespaceMultiplier *= 1.2;
        spec.components.borderRadius = '2px';
        spec.components.borderStyle = 'thin';
        spec.typography.weightRule = 'light';
        break;
      case 'RICH':
        spec.colors.saturation = 'medium';
        spec.components.shadowIntensity = 'medium';
        break;
    }
  }

  private getBaseSpec(): DesignSpec {
    return {
      keywords: [],
      colors: {
        primary: '#333333',
        secondary: '#666666',
        background: { main: '#FFFFFF', sub: '#F8F8F8' },
        text: { title: '#111111', body: '#666666', disabled: '#CCCCCC' },
        tone: 'neutral',
        saturation: 'medium'
      },
      typography: {
        fontFamily: 'Sans-serif',
        scale: 'standard',
        weightRule: 'standard',
        headingWeight: 500,
        bodyWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0'
      },
      components: {
        borderRadius: '8px',
        buttonStyle: 'rounded',
        badgeStyle: 'standard',
        shadowIntensity: 'subtle',
        borderStyle: 'standard'
      },
      spacing: {
        density: 'standard',
        whitespaceMultiplier: 1.0,
        sectionGap: 80,
        cardGap: 20
      }
    };
  }

  private normalize(spec: DesignSpec): DesignSpec {
    spec.spacing.sectionGap = Math.round(80 * spec.spacing.whitespaceMultiplier);
    spec.spacing.cardGap = Math.round(20 * spec.spacing.whitespaceMultiplier);
    if (spec.typography.weightRule === 'light') {
      spec.typography.headingWeight = Math.max(400, spec.typography.headingWeight - 100);
      spec.typography.bodyWeight = Math.max(300, spec.typography.bodyWeight - 100);
    } else if (spec.typography.weightRule === 'bold') {
      spec.typography.headingWeight = Math.min(700, spec.typography.headingWeight + 100);
      spec.typography.bodyWeight = Math.min(600, spec.typography.bodyWeight + 100);
    }
    return spec;
  }
}

class PromptGenerator {
  public generate(designSpec: DesignSpec, layoutBlocks: any[], pageType: string, brandInfo: any, archetypeKey?: string): string {
    const archetype = archetypeKey ? DESIGN_ARCHETYPES[archetypeKey] : null;

    const sections = [
      this.generateHeader(pageType),
      this.generateLayoutSection(layoutBlocks),
      this.generateArchetypeDNA(archetype),
      this.generateKeywordDefinitions(designSpec.keywords),
      this.generateDesignStyleSection(designSpec),
      this.generateContentSection(designSpec, layoutBlocks, archetype),
      this.generateColorSection(designSpec, brandInfo),
      this.generateTypographySection(designSpec),
      this.generateSpacingSection(designSpec),
      this.generateComponentsSection(designSpec),
      this.generateFooter(brandInfo)
    ];
    return sections.filter(Boolean).join('\n\n');
  }

  private generateArchetypeDNA(archetype: any): string {
    if (!archetype) return '';
    return `ARCHETYPE VISUAL DNA (${archetype.mood_name}):
- Lighting: ${archetype.visual_dna.lighting}
- Colors: ${archetype.visual_dna.colors}
- Typography: ${archetype.visual_dna.typography}
- Layout: ${archetype.visual_dna.layout}
- Imagery: ${archetype.visual_dna.imagery}
- Detailed Lighting: ${archetype.lighting_detailed.philosophy} (${archetype.lighting_detailed.shadow_treatment})
- Photography Strategy: ${archetype.product_photography.background}, ${archetype.product_photography.composition}, ${archetype.product_photography.lighting}
- Technical Params: ${archetype.technical_params}`;
  }

  private generateKeywordDefinitions(keywords: string[]): string {
    const definitions = keywords.map(kw => {
      const upperKw = kw.toUpperCase().trim();
      const styleDef = (STANDARD_DESIGN_KEYWORDS.VISUAL_STYLE as any)[upperKw];
      const moodDef = (STANDARD_DESIGN_KEYWORDS.MOOD_TONE as any)[upperKw];
      const compDef = (STANDARD_DESIGN_KEYWORDS.COMPLEXITY as any)[upperKw];
      const def = styleDef || moodDef || compDef;
      return def ? `- ${kw}: ${def}` : null;
    }).filter(Boolean);

    if (definitions.length === 0) return '';
    return `KEYWORD SEMANTIC DEFINITIONS:\n${definitions.join('\n')}`;
  }

  private generateHeader(pageType: string): string {
    const isMobile = pageType?.includes('MOBILE');
    return `Direct flat 2D screenshot of Korean e-commerce website.

OUTPUT FORMAT:
✓ ${isMobile ? '9:16 vertical (Mobile)' : '16:9 horizontal (PC desktop)'}
✓ Content fills 100% to edges
✓ No device mockup, frame, or margins
✓ Looks like F11 fullscreen`;
  }

  private generateLayoutSection(layoutBlocks: any[]): string {
    const blockDescriptions = layoutBlocks.map((block) => {
      // Remove numbering to prevent list bias
      return `[Visual Block: ${block.category.toUpperCase()} - ${this.getBlockDescription(block.type)}]`;
    }).join('\n');

    return `INTENDED VISUAL FLOW (Synthesize this into a seamless journey, DO NOT list these steps):\n${blockDescriptions}`;
  }

  private generateDesignStyleSection(spec: DesignSpec): string {
    return `DESIGN STYLE & MOOD:
Keywords: ${spec.keywords.join(', ')}
Visual Tone: Saturation ${spec.colors.saturation}, Tone ${spec.colors.tone}
Treatment: Shadow ${spec.components.shadowIntensity}, Border ${spec.components.borderStyle}`;
  }

  private generateContentSection(spec: DesignSpec, layoutBlocks: any[], archetype?: any): string {
    const gridBlock = layoutBlocks.find(b => b.category === 'product-list' && ['grid-5', 'grid-4', 'grid-3', 'grid-2'].includes(b.type));
    const videoBlock = layoutBlocks.find(b => (b.category === 'shorts' || b.category === 'video-product') && ['feed-scroll', 'full-width-video', 'split-video', 'story-grid'].includes(b.type));
    const mainBlock = layoutBlocks.find(b => (b.category === 'main' || b.category === 'detail') && ['carousel-center', 'hero-grid', 'product-hero'].includes(b.type));
    const headerBlock = layoutBlocks.find(b => b.category === 'header' || b.category === 'top-banner');
    
    let contentSectionValue = '';

    const productGuidance = archetype?.section_guidance?.product_grid || "";
    const heroGuidance = archetype?.section_guidance?.hero || "";

    if (headerBlock) {
      contentSectionValue += `NAVIGATION & HEADER SPECIFICATIONS:\n${generateMainBlockPrompt(headerBlock.type, spec.keywords, heroGuidance)}\n\n`;
    }

    if (mainBlock) {
      contentSectionValue += `MAIN HERO & KEY SECTION SPECIFICATIONS:\n${generateMainBlockPrompt(mainBlock.type, spec.keywords, heroGuidance)}\n\n`;
    }

    if (gridBlock) {
      contentSectionValue += `PRODUCT CARD & GRID SPECIFICATIONS:\n${generateProductListPrompt(gridBlock.type as any, spec.keywords, productGuidance)}\n\n`;
    }

    if (videoBlock) {
      contentSectionValue += `VIDEO CONTENT SPECIFICATIONS:\n${generateVideoPrompt(videoBlock.type as any, spec.keywords, heroGuidance)}\n\n`;
    }

    if (!contentSectionValue) {
      contentSectionValue = `PRODUCT CARD DESIGN:
- Image: WHITE background MANDATORY, 1:1 square ratio
- Layout: Brand Name (12px), Product Name (14px), Price (16px Bold)
- Style: Corner radius ${spec.components.borderRadius}, Shadow ${spec.components.shadowIntensity}`;
    }

    return contentSectionValue;
  }

  private generateColorSection(spec: DesignSpec, brandInfo: any): string {
    const primary = brandInfo?.marketing?.design?.foundation?.colors?.primary || spec.colors.primary;
    return `COLOR SYSTEM:
- Background: ${spec.colors.background.main}
- Text: ${spec.colors.text.title} (Title), ${spec.colors.text.body} (Body)
- Brand Primary: ${primary} (Use for Buttons, CTA, Accents)`;
  }

  private generateTypographySection(spec: DesignSpec): string {
    return `TYPOGRAPHY:
- Font: ${spec.typography.fontFamily}
- Heading Weight: ${spec.typography.headingWeight}, Body Weight: ${spec.typography.bodyWeight}
- Korean Text: Density matching, clean sans-serif placeholder blocks`;
  }

  private generateSpacingSection(spec: DesignSpec): string {
    return `SPACING:
- Section Gap: ${spec.spacing.sectionGap}px
- Card Gap: ${spec.spacing.cardGap}px
- Side Padding: 40px (PC), 20px (Mobile)`;
  }

  private generateComponentsSection(spec: DesignSpec): string {
    return `COMPONENTS:
- Buttons: ${spec.components.buttonStyle} style, ${spec.components.borderRadius} radius
- Badges: Minimal but bold (Sale/New/Best labels)`;
  }

  private generateFooter(brandInfo: any): string {
    return `BRAND IDENTITY:
Brand Name: ${brandInfo?.channelName || 'E-commerce Store'}
Vibe: Professional Korean e-commerce, clean, trustworthy, and high-fidelity.`;
  }

  private getBlockDescription(type: string): string {
    const descriptions: any = {
      'carousel-center': 'Main banner slider with partial side slides visible',
      'grid-2': '2-column large product display',
      'grid-3': '3-column classic grid',
      'grid-4': '4-column product display',
      'grid-5': '5-column high density grid',
      'product-hero': 'Main product details at the top',
      'sticky-tabs': 'Sticky navigation bar',
      'detail-body': 'Main long-form product description',
      'text-bar': 'Minimalist announcement line',
      'image-strap': 'Full-width immersive image banner',
      'side-nav-header': 'Logo left with inline navigation menu',
      'stacked-center-header': 'Centered logo with spanning bottom navigation'
    };
    return descriptions[type] || 'Standard e-commerce section';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { analysisResult, referenceAnalysis, pageType } = body;

    const keywords = analysisResult?.design?.concept?.keywords || [];
    const interpreter = new DesignInterpreter();
    const designSpec = interpreter.interpret(keywords);
    designSpec.keywords = keywords;

    const shapeLayout = analysisResult?.design?.foundation?.shapeLayout;
    let rawBlocks = [];
    if (pageType?.includes('MAIN')) rawBlocks = shapeLayout?.mainBlocks || [];
    else if (pageType?.includes('LIST')) rawBlocks = Array.isArray(shapeLayout?.list) ? shapeLayout.list : [];
    else if (pageType?.includes('DETAIL')) rawBlocks = Array.isArray(shapeLayout?.detail) ? shapeLayout.detail : [];

    // Determine archetype key early
    const archetypeKey = keywords[0] || 'STANDARD';

    const generator = new PromptGenerator();
    const technicalContext = generator.generate(designSpec, rawBlocks, pageType, analysisResult, archetypeKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are a professional Prompt Engineer for Imagen 4.
Your task is to convert the following TECHNICAL DESIGN SPECIFICATION into a highly detailed, 
vivid, and atmospheric prompt that Imagen 4 can use to create a world-class e-commerce design.

━━━ CRITICAL INSTRUCTIONS ━━━
1. ROLE: You are a Visionary Design Director crafting a mood board description for a high-end magazine feature.
2. OUTPUT GOAL: A single, immersive paragraph that makes the reader *feel* the design. 
3. UNBREAKABLE RULES:
   - NO LISTS, NO BULLETS, NO NUMBERS.
   - NO SEQUENCING WORDS: Do not use "followed by", "then", "repeats", "below this", "next section".
   - NO TECHNICAL JARGON: Do not say "grid-4", "promotion-bar", "1px border". Instead say "a dense, elegant tapestry of products", "a slender announcement ribbon", "delicate hairline framing".
4. SYNTHESIS: Melt the technical specs (size, radius, color) into the description. 
   - BAD: "Cards are 280x420px with 8px radius."
   - GOOD: "Tall, gracefully rounded product cards impose a gentle rhythm across the canvas."
5. ATMOSPHERE: Prioritize lighting, texture, and emotion. The site must feel "alive" (8K, ray-traced, volumetric).
6. LENGTH: 1000-1500 characters of pure prose.
7. REFER TO FEW-SHOTS: They demonstrate exactly how to hide the structure behind the art.

${VISUAL_FIDELITY_RULES}

━━━ FEW-SHOT EXAMPLES (Reference for Style & Depth) ━━━
${FEW_SHOT_EXAMPLES.map((ex: any) => `[${ex.type}]\n${ex.prompt}`).join('\n\n')}

━━━ TECHNICAL SPECIFICATION ━━━
${technicalContext}

RETURN ONLY THE REFINED PROMPT STRING.`;

    const userContext = `Brand: ${analysisResult?.channelName}\nValue Proposition: ${analysisResult?.marketing?.strategy?.usp}`;

    const result = await model.generateContent(systemPrompt + "\n\n" + userContext);
    const refinedPrompt = result.response.text().trim();

    return NextResponse.json({ refinedPrompt, archetypeKey });

  } catch (error: any) {
    console.error("Prompt Refinement API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
