/**
 * Design Archetypes Knowledge Base (Technical Quality Guide) - V5.0 (48 Sub-Moods)
 * ROLE: Technical Photography & Layout Guidebook for high-fidelity output.
 */

export interface DesignArchetype {
  style_key: string;
  mood_name: string;
  parent_mood?: string;
  keywords: string[];
  related_keywords: string[];
  visual_tone: string;
  energy_level: string;
  visual_dna: {
    lighting: string;
    colors: string;
    typography: string;
    layout: string;
    imagery: string;
    grid?: string;
    radius?: string;
  };
  product_photography: {
    background: string;
    composition: string;
    lighting: string;
    props: string;
    post_processing: string;
    example_electronics: string;
    example_fashion: string;
    example_food: string;
  };
  section_guidance: {
    gnb: string;
    hero: string;
    product_grid: string;
    footer: string;
  };
  lighting_detailed: {
    philosophy: string;
    shadow_treatment: string;
    reference: string;
  };
  technical_params: string;
  negative_patterns: string;
  reasoning: string;
  prompt_template: string;
}

export const DESIGN_ARCHETYPES: Record<string, DesignArchetype> = {
  // --- MINIMAL 계열 (8개) ---
  MINIMAL_BRUTALIST: {
    style_key: 'MINIMAL_BRUTALIST',
    mood_name: "Minimal Brutalist",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['BRUTALIST', 'RAW', 'CONCRETE', 'INDUSTRIAL', 'STARK', 'BOLD', 'SOVIET'],
    related_keywords: ['MINIMAL', 'CLEAN', 'GEOMETRIC', 'HARSH'],
    visual_tone: "Stark, Bold, Industrial",
    energy_level: "High Contrast, Raw",
    visual_dna: {
      lighting: "Hard directional with dramatic shadows, industrial harsh",
      colors: "Monochrome: Black (#000), White (#FFF), Concrete Gray (#8B8680)",
      typography: "Bold heavy sans-serif (Akzidenz-Grotesk), ultra-thick 900 weight",
      layout: "Grid brutal but intentional, sharp 0px radius, asymmetric power",
      imagery: "Raw concrete, exposed structures, Soviet architecture, unfinished"
    },
    product_photography: {
      background: "Raw concrete or stark industrial surface",
      composition: "Extreme close-up or asymmetric stark placement",
      lighting: "Hard side lighting, dramatic shadows",
      props: "Concrete blocks, steel pipes, raw construction materials",
      post_processing: "High contrast B&W, sharp edges",
      example_electronics: "Matte black earbuds on a concrete block, hard side shadow",
      example_fashion: "Avant-garde clothing against a raw concrete wall",
      example_food: "Minimal snack packaging on a stark metal surface"
    },
    section_guidance: {
      gnb: "Bold heavy black bar, zero padding, massive typography",
      hero: "Brutalist grid takeover, concrete textures, stark imagery",
      product_grid: "0px border radius, heavy structural lines, asymmetric spacing",
      footer: "Massive text links, raw gray background, no decoration"
    },
    lighting_detailed: {
      philosophy: "Unapologetic raw illumination",
      shadow_treatment: "Hard directional shadows, jet black",
      reference: "Supreme early, Balenciaga web, Brutalist architecture"
    },
    technical_params: "f/8, hard side lighting, high contrast, sharp edges",
    negative_patterns: "soft, pastel, rounded, decorative, warm, friendly, colorful, mockup, margins",
    reasoning: "Translates industrial power into a stark, intentional brand presence.",
    prompt_template: "Stark brutalist 100% pixel-filled web skin, raw concrete, bold 900 weight typography, flush-to-edge."
  },
  MINIMAL_SCANDINAVIAN: {
    style_key: 'MINIMAL_SCANDINAVIAN',
    mood_name: "Minimal Scandinavian",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['SCANDINAVIAN', 'NORDIC', 'HYGGE', 'COZY', 'WARM', 'WOOD', 'LAGOM'],
    related_keywords: ['CLEAN', 'SIMPLE', 'NATURAL', 'PEACEFUL', 'COMFORTABLE'],
    visual_tone: "Cozy, Simple, Nordic",
    energy_level: "Peaceful & Warm",
    visual_dna: {
      lighting: "Soft natural window light, warm golden hour indoor glow",
      colors: "Whites (#FAFAFA), warm grays (#E5E5E5), wood (#D4A574), sage (#B7C9B4)",
      typography: "Friendly readable sans-serif (GT America, Circular), readable comfortable",
      layout: "Generous whitespace 60-80px, cozy grid, 8-12px rounded corners",
      imagery: "Warm homes, natural wood furniture, indoor plants, peaceful living"
    },
    product_photography: {
      background: "Light oak wood or soft linen cloth",
      composition: "Balanced home-centric arrangement",
      lighting: "Soft natural light, warm +200K",
      props: "Indoor plants, ceramic mugs, wooden coasters",
      post_processing: "Raised blacks, soft highlights",
      example_electronics: "Earbuds on an oak tray with a small plant to the side",
      example_fashion: "Wool sweater on a linen sheet, morning sunlight",
      example_food: "Organic snack on a ceramic plate, warm wood background"
    },
    section_guidance: {
      gnb: "Clean white bar, thin icons, warm light gray text",
      hero: "Cozy home interior banner, soft typography, airy layout",
      product_grid: "Generous whitespace, soft corner cards, warm textures",
      footer: "Clean organized sitemap, sage green or warm gray footer"
    },
    lighting_detailed: {
      philosophy: "Warm inviting Nordic daylight",
      shadow_treatment: "Soft blurred natural shadows",
      reference: "IKEA, HAY, Kinfolk magazine"
    },
    technical_params: "f/4, soft natural light, warm +200K, airy atmosphere",
    negative_patterns: "harsh, industrial, cold, clinical, bold dramatic, neon bright, mockup, margins",
    reasoning: "Combines 'Lagom' (not too much, not too little) balance with high-end Nordic aesthetics.",
    prompt_template: "Hygge Scandinavian 100% pixel-filled web surface, warm wood tones, airy whitespace, flush-to-edge."
  },
  MINIMAL_JAPANESE: {
    style_key: 'MINIMAL_JAPANESE',
    mood_name: "Minimal Japanese",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['JAPANESE', 'ZEN', 'WABI-SABI', 'MUJI', 'TRANQUIL', 'MEDITATIVE', 'BORO'],
    related_keywords: ['MINIMAL', 'NATURAL', 'PEACEFUL', 'SIMPLE', 'CONTEMPLATIVE'],
    visual_tone: "Tranquil, Precise, Wabi-sabi",
    energy_level: "Zen-like Stillness",
    visual_dna: {
      lighting: "Diffused soft paper-like quality, shoji screen glow, tranquil",
      colors: "Off-white (#FAF9F6), beige (#E8DCC4), natural earth, black (#1A1A1A)",
      typography: "Delicate thin 200-300 weight, precise vertical/horizontal spacing",
      layout: "Extreme simplicity, asymmetric ma (negative space), tatami proportions",
      imagery: "Natural materials (wood, paper, stone), wabi-sabi imperfections, zen"
    },
    product_photography: {
      background: "Coarse paper or dark slate surface",
      composition: "Extreme negative space, single object focus",
      lighting: "Diffused soft light, shadow roll-off",
      props: "Bamboo, river stones, washi paper, incense",
      post_processing: "Matte finish, desaturated nature tones",
      example_electronics: "Black earbuds on a dark slate slab, extreme whitespace",
      example_fashion: "Linen robe on a cedar hanger, soft shoji-screen light",
      example_food: "Single artisanal snack on a broad green leaf, paper background"
    },
    section_guidance: {
      gnb: "Delicate thin lines, vertical text labels, slate accents",
      hero: "Single phrase banner, Zen-circle motif, extreme whitespace",
      product_grid: "Irregular but balanced spacing, paper-texture backgrounds",
      footer: "Stamp-style logos, vertical links, slate or off-white footer"
    },
    lighting_detailed: {
      philosophy: "The tranquility of a prayer",
      shadow_treatment: "Subtle, soft, almost atmospheric shadows",
      reference: "Muji, Comme des Garçons, Tadao Ando"
    },
    technical_params: "f/5.6, soft diffused light, muted desaturated, perfect balance",
    negative_patterns: "busy, colorful, bold, loud, decorative, western maximalism, mockup, margins",
    reasoning: "Utilizes the Japanese aesthetic of 'Ma' to create a meditative, high-trust brand space.",
    prompt_template: "Zen Japanese 100% pixel-filled web skin, washi paper textures, extreme negative space, flush-to-edge."
  },
  MINIMAL_CORPORATE: {
    style_key: 'MINIMAL_CORPORATE',
    mood_name: "Minimal Corporate",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['CORPORATE', 'PROFESSIONAL', 'BUSINESS', 'CLEAN', 'MODERN', 'TECH', 'SAAS'],
    related_keywords: ['MINIMAL', 'SIMPLE', 'ELEGANT', 'SOPHISTICATED', 'ORGANIZED'],
    visual_tone: "Professional, Organized, Trustworthy",
    energy_level: "Clinical & Precise",
    visual_dna: {
      lighting: "Even studio lighting 3-point, professional no drama, clinical",
      colors: "White (#FFF), light gray (#F5F5F5), corporate blue (#0066FF)",
      typography: "Professional sans (Inter, SF Pro, Helvetica), clear hierarchy",
      layout: "Perfect 12-column grid, organized card-based, 4px micro-radius",
      imagery: "Professional product shots, clean mockups, corporate photography"
    },
    product_photography: {
      background: "Seamless light gray gradient or pure white",
      composition: "Centered and aligned, grid-precise",
      lighting: "Three-point studio lighting, high color accuracy",
      props: "Office tech, glass surfaces, glass prisms",
      post_processing: "Ultra-sharp, crisp highlights, no grain",
      example_electronics: "Earbuds floating on a tech-blue gradient background",
      example_fashion: "Professional model in clean business attire, bright studio",
      example_food: "High-protein snack with clean laboratory-grade packaging"
    },
    section_guidance: {
      gnb: "Fixed blue-accented top bar, professional icons, clear nav",
      hero: "Product-led banner with blue CTA, clean feature list",
      product_grid: "Grid of 12px rounded cards, subtle blue shadow effect",
      footer: "Massive sitemap, corporate trust badges, legal links"
    },
    lighting_detailed: {
      philosophy: "Maximum clarity for professional trust",
      shadow_treatment: "Calculated soft shadows for depth and layer hierarchy",
      reference: "Apple, Stripe, Microsoft, Linear, Notion"
    },
    technical_params: "f/11, even lighting, perfect color accuracy, sharp focus",
    negative_patterns: "playful, vintage, organic, artistic, emotional, casual fun, mockup, margins",
    reasoning: "Leverages the reliability of Big Tech design systems to build instant credibility.",
    prompt_template: "Professional B2B 100% pixel-filled web surface, Stripe-style aesthetic, blue accents, flush-to-edge."
  },
  MINIMAL_MEDICAL: {
    style_key: 'MINIMAL_MEDICAL',
    mood_name: "Minimal Medical",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['MEDICAL', 'CLINICAL', 'HEALTHCARE', 'HOSPITAL', 'STERILE', 'HYGIENE', 'PHARMA'],
    related_keywords: ['MINIMAL', 'CLEAN', 'PROFESSIONAL', 'TRUSTWORTHY', 'SAFE'],
    visual_tone: "Safe, Clinical, Pristine",
    energy_level: "Sterile & High-Trust",
    visual_dna: {
      lighting: "Clinical overhead fluorescent, sterile bright even lighting",
      colors: "Medical white (#FFFFFF), mint green (#E8F5F3), surgical blue (#D6EAF8)",
      typography: "Clean medical sans-serif, high legibility, accessible",
      layout: "Organized clear information hierarchy, clinical precision, safe",
      imagery: "Clean medical environments, professional healthcare, sterile products"
    },
    product_photography: {
      background: "Bright clinical white or surgical tray blue",
      composition: "Honest frontal view, high-key lighting",
      lighting: "Bright even clinical lighting, high key",
      props: "Stethoscopes, glass vials, stainless steel, medical paper",
      post_processing: "Clean bright tones, enhanced whites, sterile feel",
      example_electronics: "Earbuds on a sterile white lab surface with glass vials",
      example_fashion: "Model in high-quality medical scrub or white lab coat",
      example_food: "Clinical-grade supplement packaging in a bright sterile lab"
    },
    section_guidance: {
      gnb: "Clean white bar with mint green accents, high-legibility nav",
      hero: "Trust-centric banner, professional healthcare imagery, safe fonts",
      product_grid: "Organized grid with clinical feature badges, safe colors",
      footer: "Trust badges, certifications, professional contact info"
    },
    lighting_detailed: {
      philosophy: "The light of absolute hygiene and trust",
      shadow_treatment: "Almost zero shadows, replaced by bright even fill",
      reference: "Pharma brands, Hospital websites, Health apps"
    },
    technical_params: "f/11, bright even clinical lighting, high key, sterile",
    negative_patterns: "dark, moody, decorative, playful, warm cozy, organic natural, mockup, margins",
    reasoning: "Uses clinical cues to emphasize product safety and scientific efficacy.",
    prompt_template: "Pristine clinical 100% pixel-filled web skin, sterile medical aesthetic, safe and professional, flush-to-edge."
  },
  MINIMAL_SWISS: {
    style_key: 'MINIMAL_SWISS',
    mood_name: "Minimal Swiss",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['SWISS', 'TYPOGRAPHY', 'GRID', 'HELVETICA', 'INTERNATIONAL', 'MODERNIST'],
    related_keywords: ['MINIMAL', 'CLEAN', 'GEOMETRIC', 'RATIONAL', 'SYSTEMATIC'],
    visual_tone: "Rational, Systematic, International",
    energy_level: "Objective & Geometric",
    visual_dna: {
      lighting: "Neutral even lighting, no mood, functional illumination",
      colors: "Primary colors pure (red #FF0000, blue #0000FF, yellow #FFFF00)",
      typography: "Helvetica, Akzidenz-Grotesk, perfect grid-based sizing",
      layout: "Mathematical grid system, golden ratio, perfect alignment",
      imagery: "Geometric abstract, Swiss modernist photography, rational"
    },
    product_photography: {
      background: "Neutral gray or primary color backdrops",
      composition: "Mathematical central alignment, high geometric precision",
      lighting: "Neutral even lighting, purely functional",
      props: "Geometric shapes, rulers, grid paper, modernist graphics",
      post_processing: "Sharp precision, primary color emphasis, no filters",
      example_electronics: "Earbuds aligned perfectly on a red geometric grid",
      example_fashion: "Model in primary red clothing against a white grid backdrop",
      example_food: "Snack package centered on a yellow system-grid backdrop"
    },
    section_guidance: {
      gnb: "Systematic grid-top bar, Helvetica typography, red accents",
      hero: "Typography-dominated banner, mathematical grid, primary colors",
      product_grid: "Rigid 12-column grid, 0px radius, mathematical spacing",
      footer: "Rational sitemap, primary color links, Swiss grid footer"
    },
    lighting_detailed: {
      philosophy: "The objective light of reason",
      shadow_treatment: "None, or strictly vertical/horizontal geometric shadows",
      reference: "Massimo Vignelli, Josef Müller-Brockmann, International Style"
    },
    technical_params: "Perfect technical precision, mathematical ratios, grid-based",
    negative_patterns: "emotional, decorative, organic, handmade, casual, warm, mockup, margins",
    reasoning: "Projects an aura of world-class design system precision and objective quality.",
    prompt_template: "Modernist Swiss 100% pixel-filled web surface, Helvetica and grid-based design, rational aesthetic, flush-to-edge."
  },
  MINIMAL_MONASTIC: {
    style_key: 'MINIMAL_MONASTIC',
    mood_name: "Minimal Monastic",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['MONASTIC', 'ASCETIC', 'SPARSE', 'AUSTERE', 'CONTEMPLATIVE', 'MONK', 'SIMPLE'],
    related_keywords: ['MINIMAL', 'ZEN', 'PEACEFUL', 'SPIRITUAL', 'QUIET'],
    visual_tone: "Quiet, Spiritual, Austere",
    energy_level: "Meditative Stillness",
    visual_dna: {
      lighting: "Single window light source, spiritual contemplative glow",
      colors: "Stone gray (#A8A8A8), aged white (#F0EDE5), natural undyed",
      typography: "Minimal text, simple serif or sans, contemplative",
      layout: "Extreme emptiness, single element focus, spiritual negative space",
      imagery: "Empty rooms, single objects, contemplative spaces, spiritual"
    },
    product_photography: {
      background: "Rough stone or aged plaster wall",
      composition: "Lower-third placement, high headroom, quiet focus",
      lighting: "Natural light from a single small window, dramatic falloff",
      props: "Wood bowls, single candle, linen cloth, silence",
      post_processing: "Matte browns, natural color balance, quiet tones",
      example_electronics: "White earbuds resting on a wide stone floor, high negative space",
      example_fashion: "Model in simple undyed linen clothing in an empty stone room",
      example_food: "Handmade ceramic bowl on a wooden table, single small snack"
    },
    section_guidance: {
      gnb: "Invisible top bar, single word navigation, stone colors",
      hero: "Extreme empty banner, single small product image, quiet text",
      product_grid: "Wide sparse grid, no card borders, stone gray backgrounds",
      footer: "Quiet single-line footer, contemplative links, gray tones"
    },
    lighting_detailed: {
      philosophy: "The light of solitude and breath",
      shadow_treatment: "Long dramatic shadows from a single natural source",
      reference: "Monastery interiors, contemplative art, ascetic lifestyle"
    },
    technical_params: "Natural simple lighting, minimal processing, authentic raw",
    negative_patterns: "busy, colorful, commercial, flashy, decorative, luxurious, mockup, margins",
    reasoning: "Built for 'Quiet Luxury' that rejects all noise, focusing purely on the essence.",
    prompt_template: "Austere monastic 100% pixel-filled web skin, stone and plaster, spiritual emptiness, flush-to-edge."
  },
  MINIMAL_FUTURISTIC: {
    style_key: 'MINIMAL_FUTURISTIC',
    mood_name: "Minimal Futuristic",
    parent_mood: "MINIMAL_CLEAN",
    keywords: ['FUTURISTIC', 'SF', 'SCIFI', 'WHITE-TECH', 'CLEAN-TECH', 'TOMORROW', 'SPACE'],
    related_keywords: ['MINIMAL', 'MODERN', 'ADVANCED', 'SLEEK', 'HIGH-TECH'],
    visual_tone: "SLEEK, ADVANCED, PURE",
    energy_level: "High-Frequency Tech",
    visual_dna: {
      lighting: "Cool white LED glow, holographic hints, futuristic ambient",
      colors: "Pure white (#FFFFFF), cool grays, electric blue accents (#00D9FF)",
      typography: "Futuristic geometric sans, tech-inspired, clean modern",
      layout: "Floating elements, holographic UI hints, spacious futuristic",
      imagery: "White technology, sci-fi interfaces, space-age products, future"
    },
    product_photography: {
      background: "Matte white tech surface or light-emitting panel",
      composition: "Floating mid-air view, tech-precision focus",
      lighting: "Cool ambient LED glow, rim-lighting on white edges",
      props: "Holographic projections, glass panels, futuristic tech lines",
      post_processing: "Ultra-clean rendering, cool white-blue grade, bloom highlights",
      example_electronics: "Floating white earbuds with thin blue LED rim glow",
      example_fashion: "Model in white futuristic suit with holographic UI overlay",
      example_food: "High-tech supplement capsule in a glowing white reactor set"
    },
    section_guidance: {
      gnb: "Glassmorphism bar with electric blue line, tech-icons",
      hero: "Space-age product showcase, floating UI labels, white-out aesthetic",
      product_grid: "Glass-texture cards, electric blue hover states, tech spacing",
      footer: "Futuristic grid-footer, blue social glow, sci-fi links"
    },
    lighting_detailed: {
      philosophy: "The light of a bright tomorrow",
      shadow_treatment: "Zero shadows or soft blue-tinted drop shadows",
      reference: "Apple Vision Pro aesthetic, Sci-fi utopian films"
    },
    technical_params: "Cool color temperature, clean precise, futuristic",
    negative_patterns: "vintage, retro, warm, organic, rough, handmade, nostalgic, mockup, margins",
    reasoning: "Uses futuristic 'White-Tech' cues to project innovation and advanced quality.",
    prompt_template: "Space-age futuristic 100% pixel-filled web surface, white-tech aesthetic, clean blue glow, flush-to-edge."
  },
  // --- NEON/POP 계열 (8개) ---
  NEON_CYBERPUNK: {
    style_key: 'NEON_CYBERPUNK',
    mood_name: "Neon Cyberpunk",
    parent_mood: "NEON_POP",
    keywords: ['CYBERPUNK', 'FUTURISTIC', 'CYBER', 'DYSTOPIAN', 'BLADE-RUNNER', 'TECH-NOIR'],
    related_keywords: ['NEON', 'DARK', 'VIBRANT', 'ELECTRIC', 'URBAN', 'NIGHT'],
    visual_tone: "Futuristic, Dystopian, Electric",
    energy_level: "High Voltage Night Energy",
    visual_dna: {
      lighting: "Neon tubes in dark rain-soaked environments, cyan+magenta glow",
      colors: "Dark (#0A0A0A) base + Neon Cyan (#00FFFF) + Magenta (#FF00FF)",
      typography: "Futuristic sans (Michroma) with glitch effects",
      layout: "Asymmetric dynamic, HUD-like overlays, functional layers",
      imagery: "Urban night streets, neon signs, rain reflections, tech dystopia"
    },
    product_photography: {
      background: "Rain-slicked asphalt or dark metal honeycomb",
      composition: "Dramatically angled with 3/4 view",
      lighting: "Cyberpunk neon glow, atmospheric fog",
      props: "Cables, glitchy screens, holographic UI overlays",
      post_processing: "Chromatic aberration, scanlines, neon bloom",
      example_electronics: "Earbuds with cyan neon glow in a rainy urban alley",
      example_fashion: "Techwear jacket on model with purple neon mask",
      example_food: "Vivid blue energy drink with holographic bubbles in dark lab"
    },
    section_guidance: {
      gnb: "HUD-inspired top bar with scanline patterns, neon text",
      hero: "Glitchy product visual, heavy cyan-magenta lighting",
      product_grid: "Neon-border cards with technical data overlays",
      footer: "Matrix-style text feed, dark footer with glowing social icons"
    },
    lighting_detailed: {
      philosophy: "High-contrast electric night dystopia",
      shadow_treatment: "Pitch black shadows with bright neon edge highlights",
      reference: "Cyberpunk 2077, Blade Runner 2049, Ghost in the Shell"
    },
    technical_params: "f/2.8, neon glow effects, dark moody, cinematic contrast",
    negative_patterns: "bright, pastel, natural, organic, minimalist white, warm cozy, mockup, margins",
    reasoning: "Immerses products in a high-tech night energy that turn them into futuristic artifacts.",
    prompt_template: "Dystopian cyberpunk 100% pixel-filled web surface, electric neon glow, HUD aesthetic, flush-to-edge."
  },
  NEON_VAPORWAVE: {
    style_key: 'NEON_VAPORWAVE',
    mood_name: "Neon Vaporwave",
    parent_mood: "NEON_POP",
    keywords: ['VAPORWAVE', 'AESTHETIC', 'RETRO-FUTURISM', 'GLITCH', '90S-INTERNET', 'SEAPUNK'],
    related_keywords: ['NEON', 'POP', 'RETRO', 'SURREAL', 'NOSTALGIC', 'DREAMY'],
    visual_tone: "Surreal, Dreamlike, Retro-future",
    energy_level: "Nostalgic & Liquid",
    visual_dna: {
      lighting: "Artificial neon gradients, pink-cyan sunset, dreamlike surreal",
      colors: "Hot pink (#FF10F0), cyan (#00FFFF), purple (#B026FF), sunset gradient",
      typography: "Impact, wide fonts, Japanese katakana, Win95 style",
      layout: "Surreal collage style with floating windows, grid-based",
      imagery: "90s 3D renders, Roman busts, sunsets, dolphins, retro tech"
    },
    product_photography: {
      background: "Checkered 80s grid or low-poly sunset sea",
      composition: "Floating objects in surreal space with Greek statues",
      lighting: "Dual-tone neon sunset gradients (pink & teal)",
      props: "Palm trees, Roman statues, Win95 windows, dolphins",
      post_processing: "VHS distortion, low-fi crunch, liquid glow",
      example_electronics: "Earbuds floating above 3D computer grid with palm trees",
      example_fashion: "T-shirt with pink-blue gradient lighting next to marble bust",
      example_food: "Snack in a 90s glass cup with holographic liquid"
    },
    section_guidance: {
      gnb: "Windows 95 style taskbar, teal background, gray buttons",
      hero: "Low-poly sunset banner with Roman statues and 3D icons",
      product_grid: "Pink-bordered cards on checkered floor background",
      footer: "Surreal collage footer, Japanese text, sunset gradient background"
    },
    lighting_detailed: {
      philosophy: "The dream of a 90s digital paradise",
      shadow_treatment: "Soft pink/purple glowing shadows",
      reference: "Macintosh Plus, Vaporwave album art, Windows 95 aesthetic"
    },
    technical_params: "High saturation, gradient overlays, VHS glitch, surreal",
    negative_patterns: "realistic, muted, natural, minimalist, contemporary, serious, mockup, margins",
    reasoning: "Captures a specific digital nostalgia that feels high-art and trend-conscious.",
    prompt_template: "Surreal vaporwave 100% pixel-filled web skin, 90s digital paradise, Roman statues, flush-to-edge."
  },
  NEON_Y2K: {
    style_key: 'NEON_Y2K',
    mood_name: "Neon Y2K",
    parent_mood: "NEON_POP",
    keywords: ['Y2K', '2000S', 'BUBBLY', 'CHROME', 'HOLOGRAPHIC', 'GLOSSY', 'MILLENNIUM', 'CYBERSPACE'],
    related_keywords: ['NEON', 'POP', 'FUN', 'NOSTALGIC', 'FUTURISTIC', 'SHINY'],
    visual_tone: "Glossy, Bubbly, Optimistic",
    energy_level: "Bubbly & Reflective",
    visual_dna: {
      lighting: "Glossy reflective, holographic iridescent, metallic sheen",
      colors: "Chrome silver, holographic rainbow, bubblegum pink, cyber blue",
      typography: "Bubbly rounded 3D fonts, glossy extrusion",
      layout: "Playful asymmetric, bubble shapes, 3D elements, shiny gadgets",
      imagery: "Metallic textures, holographic materials, butterfly clips, flip phones"
    },
    product_photography: {
      background: "Inflatable transparent plastic or chrome liquid",
      composition: "Macro close-ups emphasizing glossy/metallic textures",
      lighting: "Flashy paparazzi-style highlights on reflective surfaces",
      props: "Butterfly clips, blow-up furniture, silver CDs, fur trims",
      post_processing: "Intense blooming, starburst highlights, holographic sheen",
      example_electronics: "Silver chrome earbuds on iridescent plastic bubble",
      example_fashion: "Model in fur-trim mini-skirt with paparazzi flash lighting",
      example_food: "High-gloss candy bar on holographic silver platform"
    },
    section_guidance: {
      gnb: "Glossy glassmorphism bar, bubble shaped search inputs",
      hero: "Reflective chrome banner, 3D bubbly floating icons",
      product_grid: "Card-less grid with products floating in bubble shapes",
      footer: "Bubbly iridescent footer with glossy 3D social icons"
    },
    lighting_detailed: {
      philosophy: "Optimistic millennium futurism",
      shadow_treatment: "Colorful soft shadows, iridescent reflections",
      reference: "early iMac G3, Britney Spears 'Oops', 2000s MTV"
    },
    technical_params: "Reflective silver, iridescent glow, glossy 3D, bloom lights",
    negative_patterns: "matte, flat, minimal, monochrome, serious, corporate, understated, mockup, margins",
    reasoning: "Taps into the 'Reflective Optimism' of the millennium for a Gen-Z trend vibe.",
    prompt_template: "Optimistic Y2K 100% pixel-filled web surface, chrome and bubble aesthetics, holographic sheen, flush-to-edge."
  },
  NEON_GAMING: {
    style_key: 'NEON_GAMING',
    mood_name: "Neon Gaming",
    parent_mood: "NEON_POP",
    keywords: ['GAMING', 'ESPORTS', 'RGB', 'GAMER', 'STREAMING', 'TWITCH', 'RAZER', 'CORSAIR'],
    related_keywords: ['NEON', 'VIBRANT', 'DARK', 'TECH', 'COMPETITIVE', 'ENERGETIC'],
    visual_tone: "Aggressive, Technical, RGB-driven",
    energy_level: "Live Broadcast Intensity",
    visual_dna: {
      lighting: "RGB LED strips cycling, keyboard backlight, monitor edge-lighting",
      colors: "Black (#0D0D0D) base + RGB rainbow cycling",
      typography: "Bold gaming sans, angular aggressive (Industry, Rajdhani)",
      layout: "HUD-inspired interfaces, stats overlays, stream layouts",
      imagery: "Gaming setups, RGB peripherals, stream overlays, esports arenas"
    },
    product_photography: {
      background: "Matte black desk with RGB strips and fiber optics",
      composition: "Top-down streamer setup layout",
      lighting: "RGB monitor glow cast on product edges",
      props: "Gaming PC parts, controllers, microphones, soundproofing foam",
      post_processing: "Sharpened textures, RGB color fringing, high-key contrast",
      example_electronics: "Earbuds resting on an RGB mechanical keyboard",
      example_fashion: "Hoodie on model in a dark room with green screen studio lighting",
      example_food: "Gamer supplement drink in an RGB-lit shaker bottle"
    },
    section_guidance: {
      gnb: "RGB-border top bar, live viewer count style widgets",
      hero: "High-action gaming stream style header with leaderboards",
      product_grid: "RGB-backlit cards on dark carbon fiber background",
      footer: "Twitch-style stream credit footer, RGB social icons"
    },
    lighting_detailed: {
      philosophy: "The intensity of the competitive arena",
      shadow_treatment: "Deep black, multi-colored rim lights",
      reference: "Razer, Twitch UI, Corsair iCUE aesthetics"
    },
    technical_params: "RGB color cycling, dark bg, glowing accents, energetic",
    negative_patterns: "minimal, pastel, vintage, natural, soft, professional corporate, mockup, margins",
    reasoning: "Authentically speaks to the gaming lifestyle through hyper-vibrant technical visual cues.",
    prompt_template: "Aggressive gaming RGB 100% pixel-filled web skin, HUD stream aesthetic, dark carbon fiber, flush-to-edge."
  },
  NEON_SYNTHWAVE: {
    style_key: 'NEON_SYNTHWAVE',
    mood_name: "Neon Synthwave",
    parent_mood: "NEON_POP",
    keywords: ['SYNTHWAVE', '80S', 'RETROWAVE', 'OUTRUN', 'MIAMI', 'SUNSET', 'RETRO-FUTURISM'],
    related_keywords: ['NEON', 'RETRO', 'VIBRANT', 'NOSTALGIC', 'CINEMATIC'],
    visual_tone: "Cinematic, 80s Retro, Atmospheric",
    energy_level: "High-Speed Sunset",
    visual_dna: {
      lighting: "Neon sunset gradient, purple-pink-orange sky, dramatic backlight",
      colors: "Neon pink (#FF006E), purple (#B026FF), orange (#FF6B35), cyan",
      typography: "80s chrome metallic fonts, italic futuristic (Lazer 84)",
      layout: "Sunset horizon grid, perspective vanishing point, outrun vibe",
      imagery: "Neon grids, palm trees, sports cars, sunsets, 80s nostalgia"
    },
    product_photography: {
      background: "Sunset-lit horizon with chrome grid floor",
      composition: "Speed-focused perspective angles",
      lighting: "Dramatic purple and orange backlighting",
      props: "Palm trees, classic Ferraris, cassette tapes, retro arcades",
      post_processing: "Gradient overlays, neon bloom, retro film grain",
      example_electronics: "Earbuds on a dashboard of a classic sports car at sunset",
      example_fashion: "Model in 80s bomber jacket under neon pink street lights",
      example_food: "Neon energy snack with a sunset-colored drink"
    },
    section_guidance: {
      gnb: "Retro-futuristic chrome bar, sunset gradient background",
      hero: "Perspective grid banner with glowing sun and palm tree icons",
      product_grid: "Holographic cards on a dark neon-lined background",
      footer: "Outrun skyline footer, cassette-tape style icons"
    },
    lighting_detailed: {
      philosophy: "The eternal summer sunset of 1984",
      shadow_treatment: "Long dramatic orange shadows with pink highlights",
      reference: "Hotline Miami, Drive soundtrack, Kavinsky"
    },
    technical_params: "Gradient overlays, neon glow, retro film grain, cinematic",
    negative_patterns: "modern minimal, muted, realistic, corporate, natural organic, mockup, margins",
    reasoning: "Invokes a high-energy cinematic nostalgia that feels both retro and futuristic.",
    prompt_template: "Retrowave synthwave 100% pixel-filled web skin, 80s neon sunset grid, palm trees, flush-to-edge."
  },
  NEON_RAVE: {
    style_key: 'NEON_RAVE',
    mood_name: "Neon Rave",
    parent_mood: "NEON_POP",
    keywords: ['RAVE', 'CLUB', 'PARTY', 'EDM', 'TECHNO', 'FESTIVAL', 'BLACKLIGHT', 'FLUORESCENT'],
    related_keywords: ['NEON', 'VIBRANT', 'ENERGETIC', 'LOUD', 'CHAOTIC', 'ELECTRIC'],
    visual_tone: "Loud, Chaotic, Energetic",
    energy_level: "Pulse-Pounding Energy",
    visual_dna: {
      lighting: "UV blacklight glow, strobe effects, laser beams, chaotic party",
      colors: "Fluorescent yellow, hot pink, electric green, black",
      typography: "Bold impact fonts, energetic chaotic, rave flyer styles",
      layout: "Chaotic overlapping, energetic flow, non-conformist",
      imagery: "Crowds, lasers, blacklight paint, festival vibes, energy"
    },
    product_photography: {
      background: "Dark club set with strobe and laser effects",
      composition: "High-energy motion blur, dynamic tilts",
      lighting: "UV blacklight fluorescent glow, sharp strobes",
      props: "Laser beams, glow sticks, fog machines, club speakers",
      post_processing: "Intense saturation, motion trails, electric vibe",
      example_electronics: "Earbuds glowing under UV light in a dark smoky club",
      example_fashion: "Model in neon-reflective gear at a laser-filled festival",
      example_food: "Vibrant energy drink with electric green bubbles under strobes"
    },
    section_guidance: {
      gnb: "Chaos-inspired black bar with strobe-pulsing effects",
      hero: "Laser-focused festival banner, high-energy neon slogans",
      product_grid: "Overlapping fluorescent cards, chaotic grid layout",
      footer: "Heavy bass inspired dark footer, laser-light social set"
    },
    lighting_detailed: {
      philosophy: "The euphoria of the dance floor",
      shadow_treatment: "Harsh strobed shadows with fluorescent edge bleed",
      reference: "EDM festivals, 90s London rave flyers, club visuals"
    },
    technical_params: "UV blacklight effects, high saturation, motion blur, loud",
    negative_patterns: "calm, minimal, muted, organized, corporate, peaceful, quiet, mockup, margins",
    reasoning: "Built to capture the raw energy of party culture for high-impact brand expression.",
    prompt_template: "Chaotic rave 100% pixel-filled web surface, UV blacklight lasers, high energy, flush-to-edge."
  },
  NEON_ANIME: {
    style_key: 'NEON_ANIME',
    mood_name: "Neon Anime",
    parent_mood: "NEON_POP",
    keywords: ['ANIME', 'MANGA', 'OTAKU', 'JAPANESE', 'KAWAII-DARK', 'AKIHABARA', 'MECHA'],
    related_keywords: ['NEON', 'VIBRANT', 'POP', 'JAPANESE', 'BOLD', 'ELECTRIC'],
    visual_tone: "Bold, Cel-shaded, Pop-Otaku",
    energy_level: "High-Key Anime Action",
    visual_dna: {
      lighting: "Anime cel-shaded with neon vibrant highlights",
      colors: "Saturated Cyan/Yellow/Pink, Black ink lines, Vivid Pop",
      typography: "Japanese Katakana, anime title fonts, manga bubbles",
      layout: "Manga panel-inspired, action lines, dynamic perspectives",
      imagery: "Anime characters, mecha, Akihabara neon, Japanese cityscapes"
    },
    product_photography: {
      background: "Illustrated Akihabara street or manga panel set",
      composition: "Dynamic action poses, mecha-inspired framing",
      lighting: "Vibrant cel-shaded pop lighting, dramatic highlights",
      props: "Katanas, mecha parts, omamori, Japanese billboards",
      post_processing: "Cel-shading effect, ink outlines, high pop saturation",
      example_electronics: "Earbuds on a mecha-pilot's console with Japanese text",
      example_fashion: "Model in Harajuku-style techwear in a neon anime street",
      example_food: "Anime-style snack bag with electric pop-out graphics"
    },
    section_guidance: {
      gnb: "Katakana-accented bar, manga-icon set, Akihabara glow",
      hero: "Action-packed anime banner, cell-shaded product showcase",
      product_grid: "Panel-style grid with manga-burst background effects",
      footer: "Otaku-style credit footer, Japanese icons, neon Akihabara vibe"
    },
    lighting_detailed: {
      philosophy: "The vibrant life of a Japanese pop world",
      shadow_treatment: "Flat ink shadows with vibrant reflected rim light",
      reference: "Akihabara aesthetic, Evangelion, Promare art style"
    },
    technical_params: "Cel-shading, vibrant saturation, anime-style rendering, pop",
    negative_patterns: "realistic, muted, western, minimalist, corporate, understated, mockup, margins",
    reasoning: "Perfect for brands targeting the 'Otaku' and anime subcultures with authentic visual language.",
    prompt_template: "Vibrant Akihabara anime 100% pixel-filled web skin, cel-shaded neon, manga panels, flush-to-edge."
  },
  NEON_GLITCH: {
    style_key: 'NEON_GLITCH',
    mood_name: "Neon Glitch",
    parent_mood: "NEON_POP",
    keywords: ['GLITCH', 'DIGITAL-ART', 'ERROR', 'DATABENDING', 'CORRUPTION', 'PIXEL-SORT'],
    related_keywords: ['NEON', 'TECH', 'ABSTRACT', 'EXPERIMENTAL', 'CYBERPUNK'],
    visual_tone: "Experimental, Technical, Broken",
    energy_level: "Digital Error Intensity",
    visual_dna: {
      lighting: "Digital artifacts, RGB channel separation, screen flicker",
      colors: "RGB Channel Splits (Red/Green/Blue), Neon Corruptions",
      typography: "Distorted glitch fonts, pixelated text, error logs",
      layout: "Databending aesthetics, pixel sorting, broken grids",
      imagery: "Glitch art, digital corruption, datamoshing, error aesthetics"
    },
    product_photography: {
      background: "Corrupted monitor screen or pixel-sorted set",
      composition: "Object being 'broken' by digital artifacts",
      lighting: "RGB shift lighting (split ghosting effect)",
      props: "Broken CRT monitors, cables, pixelated distortions",
      post_processing: "Databending, pixel sorting, channel separation",
      example_electronics: "Earbuds with a trailing pixel-sorted glitch effect",
      example_fashion: "Model whose silhouette is distorted by RGB channel shifting",
      example_food: "Snack package with a datamosh effect revealing digital guts"
    },
    section_guidance: {
      gnb: "System-error bar with glitchy text, broken icon set",
      hero: "Digital corruption banner, high-intensity RGB glitch",
      product_grid: "Pixelated-border cards on a corrupted background",
      footer: "Error-log footer, glitched social icons, tech-distortion"
    },
    lighting_detailed: {
      philosophy: "The beauty within the digital mistake",
      shadow_treatment: "Shifted RGB shadows (separate red/blue shadows)",
      reference: "Glitch art movement, Net-art, digital error aesthetics"
    },
    technical_params: "RGB shift, datamoshing, pixel sorting, intentional errors",
    negative_patterns: "clean, perfect, minimal, traditional, analog, natural, pristine, mockup, margins",
    reasoning: "Built for 'Experimental Tech' brands that value uniqueness and digital art energy.",
    prompt_template: "Digital glitch 100% pixel-filled web surface, RGB channel corruption, error aesthetic, flush-to-edge."
  },
  // --- VINTAGE/RETRO 계열 (8개) ---
  VINTAGE_70S: {
    style_key: 'VINTAGE_70S',
    mood_name: "Vintage 70s",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['70S', 'SEVENTIES', 'GROOVY', 'PSYCHEDELIC', 'BOHEMIAN', 'DISCO', 'FLOWER-POWER'],
    related_keywords: ['VINTAGE', 'RETRO', 'WARM', 'NOSTALGIC', 'COLORFUL'],
    visual_tone: "Groovy, Earthy, Psychedelic",
    energy_level: "Relaxed & Warm",
    visual_dna: {
      lighting: "Warm golden hour, sun-faded quality, nostalgic warm glow",
      colors: "Burnt orange (#CC5500), mustard yellow (#FFDB58), olive green, brown",
      typography: "Groovy rounded fonts (Cooper Black style), psychedelic",
      layout: "Organic flowing shapes, circular motifs, earthy asymmetric",
      imagery: "Sun-faded photos, wood paneling, shag carpets, vinyl records, disco"
    },
    product_photography: {
      background: "Wood paneling, shag carpet, or orange macrame",
      composition: "Natural sun-drenched casual angles",
      lighting: "Warm golden hour, sun-faded",
      props: "Vinyl records, lava lamps, dreamcatchers, indoor ivy",
      post_processing: "Warm +500K, vintage grain, sun-faded filters",
      example_electronics: "Wood-grain earbuds resting on a 70s vinyl turntable",
      example_fashion: "Model in flare jeans against a mustard yellow wall",
      example_food: "Organic fruit and snack in a wooden bowl with golden light"
    },
    section_guidance: {
      gnb: "Warm orange bar with groovy bubble typography",
      hero: "Psychedelic floral banner, circular image masks",
      product_grid: "Pill-shaped cards with earthy brown borders",
      footer: "Sun-faded landscape footer, Woodstock-style graphics"
    },
    lighting_detailed: {
      philosophy: "The warm hippie summer of love",
      shadow_treatment: "Soft, warm, blurred shadows",
      reference: "70s album covers, Woodstock aesthetic"
    },
    technical_params: "f/2.8, warm_wash=1.0, grain=true, vintage film look",
    negative_patterns: "digital, modern, minimal, cold, clinical, sharp contemporary, mockup, margins",
    reasoning: "Connects with the 'Summer of Love' nostalgia for a groovy, authentic vibe.",
    prompt_template: "Groovy 100% pixel-filled 70s web surface, burnt orange and mustard, sun-faded, flush-to-edge."
  },
  VINTAGE_90S: {
    style_key: 'VINTAGE_90S',
    mood_name: "Vintage 90s",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['90S', 'NINETIES', 'GRUNGE', 'ANALOG', 'DISPOSABLE-CAMERA', 'TEEN', 'ALT-ROCK'],
    related_keywords: ['VINTAGE', 'RETRO', 'FILM', 'NOSTALGIC', 'CANDID', 'RAW'],
    visual_tone: "Gritty, Casual, Authentic",
    energy_level: "Candid & Teen Spirit",
    visual_dna: {
      lighting: "Disposable camera flash harsh, natural indoor casual snapshots",
      colors: "Denim Blue, Faded Teal, Plaid red, Dull Gray",
      typography: "Arial, Times New Roman, Comic Sans (ironic), basic web fonts",
      layout: "Simple table layouts, frames, basic HTML, GeoCities aesthetic",
      imagery: "Film photography, candid snapshots, mall culture, early internet"
    },
    product_photography: {
      background: "Graffiti wall, concrete parking lot, or bedroom posters",
      composition: "Candid snapshots, direct flash, low angles",
      lighting: "Direct camera flash with red-eye/harsh shadows",
      props: "Walkmans, arcade machines, skateboards, CD binders",
      post_processing: "Faded colors, light leaks on edges, dates stamp",
      example_electronics: "Earbuds next to a yellow 'Sports' walkman, flash lighting",
      example_fashion: "Model in oversized flannel in a rainy alley, candid",
      example_food: "Snack package being held by hand with a harsh flash"
    },
    section_guidance: {
      gnb: "Geocities style teal bar, basic underlined text links",
      hero: "Glitchy film-strip banner with Nirvana-style grunge",
      product_grid: "Gray table-grid with disposable camera snapshots",
      footer: "Basic hit-counter footer, 'Under Construction' icons"
    },
    lighting_detailed: {
      philosophy: "Unfiltered reality of the pre-digital era",
      shadow_treatment: "Harsh jet-black shadows from direct flash",
      reference: "Friends, MTV, Geocities, Polaroid"
    },
    technical_params: "Film grain, slight color shift, authentic 90s quality",
    negative_patterns: "over-polished, modern digital, minimal sophisticated, luxury clean, mockup, margins",
    reasoning: "Built on 'Raw Authentic' nostalgia that resonates with Millennials and Gen-Z.",
    prompt_template: "90s grunge 100% pixel-filled web skin, disposable camera aesthetics, low-fi urban vibe, flush-to-edge."
  },
  VINTAGE_FILM: {
    style_key: 'VINTAGE_FILM',
    mood_name: "Vintage Film",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['FILM', 'ANALOG', 'KODAK', 'FUJI', 'GRAIN', 'CINEMATIC', '35MM', 'PORTRA', 'SUPERIA'],
    related_keywords: ['VINTAGE', 'RETRO', 'WARM', 'NOSTALGIC', 'AUTHENTIC'],
    visual_tone: "Cinematic, Timeless, Textured",
    energy_level: "Quiet Observation",
    visual_dna: {
      lighting: "Natural light with film characteristics, golden hour magic hour",
      colors: "Kodak Portra (#E8C5A3 skin), Fuji Superia warmth, authentic film",
      typography: "Classic serif (Garamond) or elegant sans, timeless traditional",
      layout: "Photo-first editorial, magazine layouts, classic film proportions",
      imagery: "Film photography aesthetic, grain texture, halation, analog perfection"
    },
    product_photography: {
      background: "Subtle architectural surfaces, cream walls",
      composition: "Rule of thirds, deep depth of field",
      lighting: "Natural with film characteristics",
      props: "Small mirrors, shadows of blinds, architectural textures",
      post_processing: "Dense film grain, cinematic color grade",
      example_electronics: "Earbuds on a white windowsill, cinematic soft focus",
      example_fashion: "Model in high-fashion silhouette against Fuji-green sunset",
      example_food: "Artisanal bread on a plate with Kodak-warm shadows"
    },
    section_guidance: {
      gnb: "Transparent bar with thin serif logo, focus on photography",
      hero: "Full-width cinematic film-strip banner with grain",
      product_grid: "Image-dominant grid, large white space, serif text",
      footer: "Timeless magazine-style footer, classic credits look"
    },
    lighting_detailed: {
      philosophy: "Capturing the soul of the moment in silver halide",
      shadow_treatment: "Deep textured shadows with visible grain",
      reference: "Kodak Portra, Cereal Magazine, Kinfolk"
    },
    technical_params: "Film grain overlay, halation glow, Portra/Superia LUTs",
    negative_patterns: "digital sharp, HDR, over-saturated, synthetic, modern Instagram filters, mockup, margins",
    reasoning: "Turns the mall into a high-art editorial magazine through cinematic film aesthetics.",
    prompt_template: "Cinematic film 100% pixel-filled web surface, Kodak Portra aesthetic, high-art photography, flush-to-edge."
  },
  VINTAGE_ANALOG: {
    style_key: 'VINTAGE_ANALOG',
    mood_name: "Vintage Analog",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['ANALOG', 'HANDMADE', 'CRAFT', 'ARTISAN', 'AUTHENTIC', 'WORKSHOP', 'HERITAGE'],
    related_keywords: ['VINTAGE', 'RETRO', 'NATURAL', 'WARM', 'TRADITIONAL'],
    visual_tone: "Authentic, Handcrafted, Earthy",
    energy_level: "Intimate & Tactile",
    visual_dna: {
      lighting: "Soft natural workshop lighting, craftsman authentic environment",
      colors: "Leather brown (#8B4513), canvas beige (#F5F5DC), brass (#B5A642), wood",
      typography: "Hand-drawn fonts, vintage typewriter, stamped letterpress",
      layout: "Organic asymmetric, handcrafted imperfect, workshop feel",
      imagery: "Handmade goods, artisan workshops, vintage tools, natural materials"
    },
    product_photography: {
      background: "Industrial workbench, worn leather, or thick canvas",
      composition: "Tactile close-ups of texture and joinery",
      lighting: "Soft natural workshop light, tungsten warm glow",
      props: "Drafting tools, metal rulers, ink bottles, hand-sketches",
      post_processing: "Ink-press effect, high contrast shadows, warm tones",
      example_electronics: "Hardwired earbuds resting on a vintage leather workbench",
      example_fashion: "Hand-stitched denim on model in a woodcraft studio",
      example_food: "Craft coffee and snack on a brass tray with artisan tools"
    },
    section_guidance: {
      gnb: "Craft-paper textured bar, hand-drawn icons, ink-stamped logo",
      hero: "Blueprint or sketchbook-style banner, handwritten notes",
      product_grid: "Canvas-textured cards on a wooden surface background",
      footer: "Artisan workshop info, old-school address style"
    },
    lighting_detailed: {
      philosophy: "The honesty of the maker's hand",
      shadow_treatment: "Strong moody shadows, warm and intimate",
      reference: "Etsy Artisan, Filson, Field Notes"
    },
    technical_params: "Natural lighting, authentic textures, handmade imperfections",
    negative_patterns: "digital, synthetic, mass-produced, perfect, clinical, modern automated, mockup, margins",
    reasoning: "Targets the 'Maker' community by emphasizing the soul and texture of handcrafted goods.",
    prompt_template: "Artisan analog 100% pixel-filled web skin, workshop aesthetic, leather and canvas, flush-to-edge."
  },
  VINTAGE_50S: {
    style_key: 'VINTAGE_50S',
    mood_name: "Vintage 50s",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['50S', 'FIFTIES', 'AMERICAN', 'DINER', 'ROCKABILLY', 'RETRO-AMERICANA', 'ATOMIC'],
    related_keywords: ['VINTAGE', 'RETRO', 'NOSTALGIC', 'CLASSIC', 'AMERICANA'],
    visual_tone: "Optimistic, Retro-American, Classic",
    energy_level: "Bubbly & Bright",
    visual_dna: {
      lighting: "Diner neon signs, jukebox glow, classic American commercial",
      colors: "Red (#FF0000), white (#FFF), turquoise (#40E0D0), chrome silver",
      typography: "Hand-lettered script, diner signage, American classic fonts",
      layout: "Retro-American layouts, atomic age motifs, diner menu style",
      imagery: "Diners, jukeboxes, classic cars, milkshakes, rockabilly culture"
    },
    product_photography: {
      background: "Padded diner booth or chrome jukebox surface",
      composition: "Symmetric, pop-art inspired composition",
      lighting: "Neon glow, bright jukebox lighting",
      props: "Milkshakes, vinyl records, classic car keys, diner menus",
      post_processing: "Bold saturation, chrome highlights, 50s coloring",
      example_electronics: "Turquoise earbuds on a chrome diner counter",
      example_fashion: "Model in a rockabilly dress with a classic American car",
      example_food: "Sundae snack on a red-and-white checkered tabletop"
    },
    section_guidance: {
      gnb: "Chrome-lined red bar with jukebox-style script logo",
      hero: "Diner menu inspired banner, atomic age graphic icons",
      product_grid: "Checkered pattern background, chrome-bordered cards",
      footer: "Classic diner storefront footer, jukebox social icons"
    },
    lighting_detailed: {
      philosophy: "The bright optimism of the atomic age",
      shadow_treatment: "Soft glowing shadows from multiple neon sources",
      reference: "American Graffiti, 50s Diner aesthetics, Juke box designs"
    },
    technical_params: "Vintage American photography, classic color palette, nostalgic",
    negative_patterns: "modern, minimal, dark moody, European, contemporary, digital, mockup, margins",
    reasoning: "Invokes a specific 'Golden Age' Americana that feels fun and perpetually classic.",
    prompt_template: "American 50s diner 100% pixel-filled web surface, red and turquoise, atomic age aesthetic, flush-to-edge."
  },
  VINTAGE_80S: {
    style_key: 'VINTAGE_80S',
    mood_name: "Vintage 80s",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['80S', 'EIGHTIES', 'NEON', 'MEMPHIS', 'NEW-WAVE', 'ARCADE', 'CASSETTE', 'MTV'],
    related_keywords: ['VINTAGE', 'RETRO', 'BOLD', 'COLORFUL', 'GEOMETRIC'],
    visual_tone: "Bold, Colorful, Graphic",
    energy_level: "High-Key 80s Pop",
    visual_dna: {
      lighting: "Neon signs 80s style, arcade glow, MTV studio lighting",
      colors: "Neon Pink (#FF1493), Electric Blue, Squiggle Patterns, Primary Yellow",
      typography: "Bold geometric 80s fonts, Memphis design style",
      layout: "Memphis design (triangles, squiggles), asymmetric bold graphics",
      imagery: "Cassette tapes, arcade games, MTV, geometric patterns, bold graphics"
    },
    product_photography: {
      background: "Memphis-patterned studio wall or arcade machine",
      composition: "Graphic, fun, tilted action angles",
      lighting: "Bright 80s studio strobe, colored gels",
      props: "Cassette tapes, arcade joysticks, colorful 80s toys",
      post_processing: "High vibrancy, 80s film saturation, pop-style",
      example_electronics: "Earbuds on a colorful Memphis-patterned tray",
      example_fashion: "Model in 80s neon gym-wear with a cassette player",
      example_food: "Snack package with vibrant 80s graphics and arcade flash"
    },
    section_guidance: {
      gnb: "Bold Memphis-patterned bar, squiggle-icon set",
      hero: "Neon-accented 80s pop banner, bold geometric shapes",
      product_grid: "Patterned background grid, high-contrast bold cards",
      footer: "MTV-style credit footer, cassette icons, bold colors"
    },
    lighting_detailed: {
      philosophy: "The energetic bold pop of the 80s",
      shadow_treatment: "Flat graphic shadows or vibrant neon halos",
      reference: "Memphis Design Group, 80s MTV, Arcade culture"
    },
    technical_params: "Bold colors, geometric overlays, 80s photography style",
    negative_patterns: "minimal, muted, contemporary, sophisticated, organic, subtle, mockup, margins",
    reasoning: "Leverages the high-energy, graphic rebellion of the 80s for a standout brand.",
    prompt_template: "Bold 80s pop 100% pixel-filled web skin, Memphis patterns, vibrant neon graphics, flush-to-edge."
  },
  VINTAGE_VICTORIAN: {
    style_key: 'VINTAGE_VICTORIAN',
    mood_name: "Vintage Victorian",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['VICTORIAN', 'GOTHIC', 'ANTIQUE', 'ORNATE', 'BAROQUE', 'STEAMPUNK', 'VINTAGE-DARK'],
    related_keywords: ['VINTAGE', 'RETRO', 'ELEGANT', 'DRAMATIC', 'HISTORICAL'],
    visual_tone: "Ornate, Dramatic, Historical",
    energy_level: "Moody & Royal",
    visual_dna: {
      lighting: "Candlelight glow, dramatic chiaroscuro, moody atmospheric",
      colors: "Deep burgundy (#800020), forest green (#228B22), gold (#FFD700), black",
      typography: "Ornate serif (Didot, Bodoni), decorative Victorian fonts",
      layout: "Ornamental baroque, detailed borders, Victorian excess",
      imagery: "Victorian interiors, antiques, ornate furniture, Gothic elements"
    },
    product_photography: {
      background: "Dark damask wallpaper or oak library panels",
      composition: "Ornate, symmetric, royal presentation",
      lighting: "Low-key candlelight or dramatic spotlight",
      props: "Antique keys, velvet curtains, brass clocks, old books",
      post_processing: "Moody darkroom tones, high dramatic contrast",
      example_electronics: "Black earbuds resting on a velvet-lined antique chest",
      example_fashion: "Model in Victorian-inspired high collar dress in a dark library",
      example_food: "Luxury snack on a brass ornate tray with a single candle"
    },
    section_guidance: {
      gnb: "Ornate gold-framed black bar, baroque-style icons",
      hero: "Gothic banner with ornate borders, candle-lit product visual",
      product_grid: "Detailed frame-bordered cards, deep jewel-tone backgrounds",
      footer: "Historical credit footer, ornate social medallions"
    },
    lighting_detailed: {
      philosophy: "The drama of a candlelit royal chamber",
      shadow_treatment: "Deep mysterious shadows with sharp golden highlights",
      reference: "Victorian Era, Baroque art, Steampunk, Gothic novels"
    },
    technical_params: "Dramatic lighting, rich colors, ornate details, darkroom",
    negative_patterns: "modern, minimal, bright, casual, simple, contemporary, clean, mockup, margins",
    reasoning: "Perfect for high-end artisan or 'Dark Heritage' brands that value history and ornate detail.",
    prompt_template: "Ornate Victorian 100% pixel-filled web surface, Gothic dark and gold, antique aesthetic, flush-to-edge."
  },
  VINTAGE_MIDCENTURY: {
    style_key: 'VINTAGE_MIDCENTURY',
    mood_name: "Vintage Mid-Century",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['MIDCENTURY', 'MCM', 'EAMES', 'ATOMIC', 'SPACE-AGE', 'MAD-MEN', '60S-MOD'],
    related_keywords: ['VINTAGE', 'RETRO', 'MODERN', 'CLEAN', 'OPTIMISTIC'],
    visual_tone: "Optimistic, Geometric, Modernist",
    energy_level: "Clean & Sophisticated",
    visual_dna: {
      lighting: "Clean mid-century photography, bright even optimistic lighting",
      colors: "Teal (#008080), orange (#FF8C00), walnut brown, mustard yellow",
      typography: "Futura, Helvetica in mid-century style, geometric",
      layout: "Clean geometric, atomic age motifs, space-age optimism",
      imagery: "Mid-century furniture, Eames chairs, atomic age design, optimism"
    },
    product_photography: {
      background: "Walnut wood panel or clean teal studio wall",
      composition: "Geometric, organized, mid-century modernist",
      lighting: "Clean functional lighting, optimistic bright fill",
      props: "Eames-style chairs, atomic clock, walnut sideboards",
      post_processing: "Clean vintage colors, high definition, mid-century grade",
      example_electronics: "Earbuds on an Eames-style wooden side table",
      example_fashion: "Model in 60s mod-fashion dress in a clean MCM interior",
      example_food: "Artisan snack on a walnut wooden tray, teal background"
    },
    section_guidance: {
      gnb: "Clean walnut-textured bar, Futura nav, atomic icons",
      hero: "Optimistic space-age banner, geometric modernist graphics",
      product_grid: "Walnut-bordered cards, clean geometric spacing",
      footer: "Mad Men style credit footer, atomic icons, teal accents"
    },
    lighting_detailed: {
      philosophy: "The bright modernist future of the home",
      shadow_treatment: "Predictable, clean geometric shadows",
      reference: "Eames, Mad Men, Mid-Century Modern architecture"
    },
    technical_params: "Clean vintage photography, optimistic colors, geometric",
    negative_patterns: "ornate, dark gothic, grunge, rough, contemporary minimal, mockup, margins",
    reasoning: "Combines nostalgic optimism with high-end modernist sophistication.",
    prompt_template: "Mid-century modern 100% pixel-filled web skin, walnut and teal, atomic age optimism, flush-to-edge."
  },
  VINTAGE_ARTDECO: {
    style_key: 'VINTAGE_ARTDECO',
    mood_name: "Vintage Art Deco",
    parent_mood: "VINTAGE_RETRO",
    keywords: ['ARTDECO', '20S', '30S', 'JAZZ-AGE', 'GREAT-GATSBY', 'LUXURY', 'GEOMETRIC'],
    related_keywords: ['VINTAGE', 'RETRO', 'ELEGANT', 'GLAMOROUS', 'SOPHISTICATED'],
    visual_tone: "Elegant, Luxurious, Geometric",
    energy_level: "Sophisticated Glamour",
    visual_dna: {
      lighting: "Soft, ambient, luxurious lighting, often with golden accents",
      colors: "Gold (#D4AF37), black (#000000), deep emerald green (#006A4E), ivory",
      typography: "Geometric sans-serif (Bebas Neue, Metropolis), elegant serif",
      layout: "Symmetric, geometric patterns, stepped motifs, sunbursts",
      imagery: "Skyscrapers, flapper dresses, champagne, geometric patterns, luxury"
    },
    product_photography: {
      background: "Polished black marble or gold-leafed panel",
      composition: "Symmetric, elegant, luxurious presentation",
      lighting: "Soft, ambient, with golden reflections",
      props: "Champagne glasses, pearls, geometric sculptures, vintage clocks",
      post_processing: "Rich contrast, golden hour tones, polished finish",
      example_electronics: "Gold earbuds on a black marble surface with geometric patterns",
      example_fashion: "Model in a flapper dress against a gold and black geometric backdrop",
      example_food: "Luxury chocolates on an ivory plate with gold trim"
    },
    section_guidance: {
      gnb: "Gold-trimmed black bar, geometric icons, elegant typography",
      hero: "Great Gatsby-style banner, sunburst motifs, luxurious product display",
      product_grid: "Geometric-patterned cards on a deep emerald background",
      footer: "Elegant Art Deco footer, stylized social icons"
    },
    lighting_detailed: {
      philosophy: "The opulent glow of the Jazz Age",
      shadow_treatment: "Soft, elegant shadows, often with golden rim lighting",
      reference: "The Great Gatsby, Chrysler Building, Erte"
    },
    technical_params: "Geometric patterns, luxurious textures, gold accents, elegant",
    negative_patterns: "rustic, grunge, minimal, casual, modern tech, natural organic, mockup, margins",
    reasoning: "Captures the timeless elegance and sophisticated glamour of the Jazz Age.",
    prompt_template: "Art Deco luxury 100% pixel-filled web surface, gold and black, geometric elegance, flush-to-edge."
  },
  // --- ORGANIC/NATURAL 계열 (8개) ---
  ORGANIC_BOTANICAL: {
    style_key: 'ORGANIC_BOTANICAL',
    mood_name: "Organic Botanical",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['BOTANICAL', 'PLANTS', 'GREENERY', 'FLORAL', 'GARDEN', 'HERBS', 'FOLIAGE'],
    related_keywords: ['ORGANIC', 'NATURAL', 'FRESH', 'GREEN', 'LIVING'],
    visual_tone: "Fresh, Green, Floral",
    energy_level: "Life-giving & Vibrant",
    visual_dna: {
      lighting: "Soft natural daylight, greenhouse glow, fresh morning garden light",
      colors: "Botanical greens (#2D5016, #8FBC8F), cream (#FFFDD0), soft pinks, whites",
      typography: "Organic serif (Freight) or humanist sans, botanical illustration fonts",
      layout: "Simple but dense, 4-6 product columns, minimal whitespace (20px)",
      imagery: "Fresh plants, botanical illustrations, herb gardens, flowers, greenhouses",
      grid: "6 columns",
      radius: "12px"
    },
    product_photography: {
      background: "Fresh moss or garden soil surface",
      composition: "Surrounded by lush greenery, organic framing",
      lighting: "Soft natural greenhouse light, dappled sun",
      props: "Fresh herbs, mist droplets, botanical illustrations",
      post_processing: "Vibrant greens, high dynamic range, airy feel",
      example_electronics: "White earbuds resting on fresh moss with morning dew",
      example_fashion: "Model in floral print in a lush greenhouse sanctuary",
      example_food: "Organic snack surrounded by fresh lavender and sage"
    },
    section_guidance: {
      gnb: "Ivy-framed top bar, botanical icon set, sage text",
      hero: "Lush botanical forest banner, soft light through leaves",
      product_grid: "Transparent cards on leaf-patterned background",
      footer: "Garden-centric footer, botanical illustrations, fresh vibe"
    },
    lighting_detailed: {
      philosophy: "The sunlight through the forest canopy",
      shadow_treatment: "Dappled leaf-shadows (Komorebi) for organic depth",
      reference: "The Sill, Aesop (botanical themes), Greenhouse mag"
    },
    technical_params: "Natural daylight, fresh vibrant greens, organic composition",
    negative_patterns: "industrial, synthetic, neon, harsh, geometric rigid, urban concrete, mockup, margins",
    reasoning: "Creates a 'Sanctuary' vibe that emphasizes freshness and life.",
    prompt_template: "Lush botanical 100% pixel-filled web surface, greenhouse aesthetic, fresh greenery, flush-to-edge."
  },
  ORGANIC_EARTHY: {
    style_key: 'ORGANIC_EARTHY',
    mood_name: "Organic Earthy",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['EARTHY', 'TERRACOTTA', 'CLAY', 'DESERT', 'SOUTHWESTERN', 'ADOBE', 'POTTERY'],
    related_keywords: ['ORGANIC', 'NATURAL', 'WARM', 'RUSTIC', 'GROUNDED'],
    visual_tone: "Warm, Grounded, Rustic",
    energy_level: "Steady & Solid",
    visual_dna: {
      lighting: "Warm natural desert light, golden hour, earthy warm glow",
      colors: "Terracotta (#E2725B), sand beige (#F5DEB3), clay brown, sage, rust",
      typography: "Warm serif or organic sans, earthy comfortable, grounded reading",
      layout: "Grounded stable layouts, earthy textures, natural material focus, rustic",
      imagery: "Pottery, desert landscapes, natural clay, woven textiles, earth materials",
      grid: "4 columns",
      radius: "4px"
    },
    product_photography: {
      background: "Cracked clay or red desert sand surface",
      composition: "Grounded, stable, central 'altar' style",
      lighting: "Warm desert golden hour, low sun angle",
      props: "Pottery shards, dry wood, cacti, woven textiles",
      post_processing: "Warm +300K color, natural textures, grounded",
      example_electronics: "Earth-toned earbuds on a dry sandstone cliff",
      example_fashion: "Linen clothes on model in a high-desert canyon",
      example_food: "Traditional grain snack in a hand-made terracotta bowl"
    },
    section_guidance: {
      gnb: "Terracotta-tinted bar, stone-carved icons, sand text",
      hero: "Wide desert sunset banner, layered clay textures",
      product_grid: "Clay-textured cards on sand-background grid",
      footer: "Grounded earth footer, desert landscape illustrations"
    },
    lighting_detailed: {
      philosophy: "The warmth of the rising desert sun",
      shadow_treatment: "Long, sharp golden-hour shadows across sand",
      reference: "West Elm, Amangiri, Southwestern high-end lifestyle"
    },
    technical_params: "Warm natural, desert golden hour, texture-focused",
    negative_patterns: "cool tones, synthetic, neon, urban, industrial, clinical, cold, mockup, margins",
    reasoning: "Provides a stable, grounded feel that emphasizes durability and natural origin.",
    prompt_template: "Warm earthy desert 100% pixel-filled web skin, terracotta and sand, grounded, flush-to-edge."
  },
  ORGANIC_WELLNESS: {
    style_key: 'ORGANIC_WELLNESS',
    mood_name: "Organic Wellness",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['WELLNESS', 'HEALING', 'SPA', 'MINDFUL', 'MEDITATION', 'YOGA', 'HOLISTIC', 'CALM'],
    related_keywords: ['ORGANIC', 'NATURAL', 'ZEN', 'PEACEFUL', 'SERENE'],
    visual_tone: "Healing, Calming, Pure",
    energy_level: "High Frequency & Still",
    visual_dna: {
      lighting: "Soft diffused light, spa-like peaceful glow, serene tranquil lighting",
      colors: "Spa whites (#F8F8F8), soft sage (#C8D5B9), lavender (#E6E6FA), pale blue",
      typography: "Calming serif (Freight) or gentle sans (Brandon), peaceful comfortable",
      layout: "Spacious breathing layouts, 4-column product grid, soft density",
      imagery: "Spa settings, meditation spaces, yoga, natural wellness, peaceful moments",
      grid: "4 columns",
      radius: "20px"
    },
    product_photography: {
      background: "Smooth river stones or soft white linen",
      composition: "Zen balance, floating appearance, airy spaces",
      lighting: "Soft diffused light, spa-like glow",
      props: "Crystals, salt lamps, steam, lotus flowers",
      post_processing: "Raised highlights, ethereal glow, high luminosity",
      example_electronics: "White earbuds in a steamy, ethereal spa environment",
      example_fashion: "Model in silk robe doing meditation in a misty white room",
      example_food: "Healthy wellness snack on white ceramic with crystals"
    },
    section_guidance: {
      gnb: "Misty semi-transparent bar, zen-line icons, thin serif logo",
      hero: "Ethereal spa-mist banner, centering typography",
      product_grid: "Wide breathing grid, soft circular shadows, airy cards",
      footer: "Calming mandala-style footer, soft white aesthetics"
    },
    lighting_detailed: {
      philosophy: "The purity of light and breath",
      shadow_treatment: "Almost nonexistent, light and airy shadows",
      reference: "Goop, Headspace, Calm app"
    },
    technical_params: "Soft diffused, spa-like glow, hazy atmosphere",
    negative_patterns: "energetic, bold, loud, busy, harsh, industrial, urban, chaotic, mockup, margins",
    reasoning: "Focuses on 'Healing & Light', creating an aspirational wellness space.",
    prompt_template: "Calming wellness spa 100% pixel-filled web skin, ethereal white glow, mindful, flush-to-edge."
  },
  ORGANIC_ECO: {
    style_key: 'ORGANIC_ECO',
    mood_name: "Organic Eco",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['ECO', 'SUSTAINABLE', 'GREEN', 'ENVIRONMENTAL', 'ZERO-WASTE', 'ETHICAL', 'CONSCIOUS'],
    related_keywords: ['ORGANIC', 'NATURAL', 'ETHICAL', 'RESPONSIBLE', 'TRANSPARENT'],
    visual_tone: "Ethical, Transparent, Raw",
    energy_level: "Action-oriented & Honest",
    visual_dna: {
      lighting: "Natural outdoor honest lighting, documentary authentic style",
      colors: "Forest green (#228B22), recycled kraft (#D2B48C), natural undyed, earth",
      typography: "Honest straightforward fonts, eco-conscious readable, transparent",
      layout: "Authentic documentary, packed product grids (6 cols), information-rich",
      imagery: "Sustainable materials, nature conservation, recycling, eco-friendly products",
      grid: "6 columns",
      radius: "0px"
    },
    product_photography: {
      background: "Recycled kraft paper or raw hemp fabric",
      composition: "Direct, no-frills, 'naked' product focus",
      lighting: "Natural outdoor daylight, flat and honest",
      props: "Recycled boxes, raw fibers, earth",
      post_processing: "Natural contrast, realistic color, raw textures",
      example_electronics: "Earbuds on recycled-fiber cardboard, raw and honest",
      example_fashion: "Model in raw cotton at a recycling facility",
      example_food: "Zero-waste snack in a reusable glass jar on forest floor"
    },
    section_guidance: {
      gnb: "Kraft-brown top bar with eco-labels, straightforward nav",
      hero: "Action banner showing sustainable origins, forest conservation",
      product_grid: "Square grid with carbon footprint badges",
      footer: "Transparency footer, eco-certifications, recycling info"
    },
    lighting_detailed: {
      philosophy: "The clarity of an honest intent",
      shadow_treatment: "Natural, realistic sun shadows",
      reference: "Patagonia, Allbirds, Package Free Shop"
    },
    technical_params: "Natural outdoor honest, documentary style",
    negative_patterns: "luxury overproduced, synthetic wasteful, excessive glamorous, hidden, mockup, margins",
    reasoning: "Built on 'Radical Transparency', perfect for mission-driven brands.",
    prompt_template: "Sustainable eco 100% pixel-filled web surface, kraft paper aesthetic, raw honest, flush-to-edge."
  },
  ORGANIC_FOREST: {
    style_key: 'ORGANIC_FOREST',
    mood_name: "Organic Forest",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['FOREST', 'WOODS', 'CAMPING', 'OUTDOOR', 'HIKING', 'WILDERNESS', 'CABIN', 'PINE'],
    related_keywords: ['ORGANIC', 'NATURAL', 'ADVENTURE', 'RUSTIC', 'WILD'],
    visual_tone: "Outdoor, Wild, Adventure-ready",
    energy_level: "Deep Woodland Energy",
    visual_dna: {
      lighting: "Dappled forest light through trees, natural outdoor woodland glow",
      colors: "Forest green (#0B3D0B), pine (#01796F), bark brown (#3E2723), moss",
      typography: "Rustic outdoorsy fonts, woodsy natural, adventure-inspired",
      layout: "Natural organic woodland, dense grid focus, forest motifs",
      imagery: "Forest scenes, camping gear, cabins, hiking trails, wilderness",
      grid: "5 columns",
      radius: "8px"
    },
    product_photography: {
      background: "Deep green moss or rough bark surface",
      composition: "Macro woodland focus, organic placement",
      lighting: "Dappled sunlight through canopy",
      props: "Pine cones, hiking gear, rough wood, dried leaves",
      post_processing: "Deep forest greens, natural contrast",
      example_electronics: "Earbuds on a pine-needle forest floor",
      example_fashion: "Model in hiking gear against deep green forest foliage",
      example_food: "Camping snack on an old wooden log"
    },
    section_guidance: {
      gnb: "Deep green bar, wood-texture buttons, rustic icons",
      hero: "Wide woodland banner, campfire glow accents",
      product_grid: "Forest-patterned cards, rustic spacing",
      footer: "Pine-tree silhouette footer, woodsy atmosphere"
    },
    lighting_detailed: {
      philosophy: "The deep shadow of the ancient woods",
      shadow_treatment: "Irregular dappled shadows from trees",
      reference: "Outdoor adventure gear, Camping lifestyle"
    },
    technical_params: "Dappled forest light, woodland morning",
    negative_patterns: "urban, synthetic, neon, industrial, clinical, polished, city, mockup, margins",
    reasoning: "Targets the 'Wild Adventure' seeker with rustic, woodland cues.",
    prompt_template: "Wild forest 100% pixel-filled web skin, deep green and wood, campfire aesthetic, flush-to-edge."
  },
  ORGANIC_BEACH: {
    style_key: 'ORGANIC_BEACH',
    mood_name: "Organic Beach",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['BEACH', 'OCEAN', 'COASTAL', 'SURF', 'SEASIDE', 'NAUTICAL', 'MARINE', 'WAVES'],
    related_keywords: ['ORGANIC', 'NATURAL', 'RELAXED', 'BREEZY', 'FRESH'],
    visual_tone: "Relaxed, Breezy, Nautical",
    energy_level: "Rhythmic Ocean Flow",
    visual_dna: {
      lighting: "Bright coastal natural light, ocean-reflected sunlight, breezy fresh",
      colors: "Ocean blue (#006994), sand beige (#F4E4C1), coral (#FF7F50), sea foam",
      typography: "Casual beachy fonts, relaxed readable, coastal comfortable",
      layout: "Relaxed coastal, wide horizontal sections, 6-column product grid",
      imagery: "Beach scenes, ocean waves, coastal living, surfing, seaside life",
      grid: "6 columns",
      radius: "16px"
    },
    product_photography: {
      background: "Dry sand or weathered driftwood",
      composition: "Low angle, breezy open placement",
      lighting: "Bright seaside sun, water reflections",
      props: "Sea shells, surfboards, nautical rope",
      post_processing: "Beach-bright exposure, teal-blue grade",
      example_electronics: "Earbuds on salt-crusted driftwood at the beach",
      example_fashion: "Model in breezy linen at the shoreline",
      example_food: "Fresh snack with coral-pink packaging on the sand"
    },
    section_guidance: {
      gnb: "Sand-beige bar, blue wave accents, casual icons",
      hero: "Wide ocean banner, breezy coastal typography",
      product_grid: "Sandy-texture cards, nautical spacing",
      footer: "Wave-top footer, sea-shell social icons"
    },
    lighting_detailed: {
      philosophy: "The rhythmic light of the tides",
      shadow_treatment: "Soft sun shadows reflecting blue water",
      reference: "Billabong, Coastal Living, Surf magazines"
    },
    technical_params: "Bright seaside sun, coastal breeze vibe",
    negative_patterns: "dark, industrial, urban, formal, corporate, landlocked, serious, mockup, margins",
    reasoning: "Captures the 'Eternal Summer' vibe of surf and seaside living.",
    prompt_template: "Breezy beach 100% pixel-filled web surface, ocean blue and sand, coastal aesthetic, flush-to-edge."
  },
  ORGANIC_FARM: {
    style_key: 'ORGANIC_FARM',
    mood_name: "Organic Farm",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['FARM', 'RURAL', 'COUNTRYSIDE', 'AGRICULTURE', 'PASTORAL', 'HOMESTEAD', 'LOCAL'],
    related_keywords: ['ORGANIC', 'NATURAL', 'RUSTIC', 'TRADITIONAL', 'AUTHENTIC'],
    visual_tone: "Pastoral, Honest, Rural",
    energy_level: "Slow & Seasonal",
    visual_dna: {
      lighting: "Natural farm morning light, golden hour fields, pastoral glow",
      colors: "Wheat gold (#F5DEB3), barn red (#722F37), grass green, natural earth",
      typography: "Rustic farmhouse fonts, honest traditional, local authentic",
      layout: "Traditional farm layouts, agricultural motifs, rural pastoral dense grid",
      imagery: "Farm scenes, crops, barns, farmers markets, rural countryside",
      grid: "4 columns",
      radius: "4px"
    },
    product_photography: {
      background: "Barn wood or wheat-field surface",
      composition: "Traditional, pastoral, honest placement",
      lighting: "Warm morning farm light",
      props: "Woven baskets, fresh eggs, straw, local tools",
      post_processing: "Golden-hour warmth, rustic clarity",
      example_electronics: "Earbuds on a rustic barn-wood table with morning light",
      example_fashion: "Model in denim on a tractor in a golden wheat field",
      example_food: "Local farm-to-table snack in a woven basket"
    },
    section_guidance: {
      gnb: "Walnut-wood bar, barn-red icons, traditional nav",
      hero: "Pastoral field banner, golden-hour atmosphere",
      product_grid: "Wheat-patterned cards, rustic farm spacing",
      footer: "Barn-silhouette footer, local farmers-market vibe"
    },
    lighting_detailed: {
      philosophy: "The honest light of the harvest",
      shadow_treatment: "Natural, long shadows from a low sun",
      reference: "Farmers Markets, Local Farm-to-Table branding"
    },
    technical_params: "Golden hour farm morning, rustic pastoral",
    negative_patterns: "urban, industrial, synthetic, modern tech, corporate, city, mockup, margins",
    reasoning: "Honors tradition and local origin through pastoral visual storytelling.",
    prompt_template: "Pastoral farm 100% pixel-filled web surface, barn red and wheat, harvest aesthetic, flush-to-edge."
  },
  ORGANIC_TROPICAL: {
    style_key: 'ORGANIC_TROPICAL',
    mood_name: "Organic Tropical",
    parent_mood: "ORGANIC_NATURAL",
    keywords: ['TROPICAL', 'PALM', 'PARADISE', 'ISLAND', 'BEACH-RESORT', 'BAHAMAS', 'EXOTIC'],
    related_keywords: ['ORGANIC', 'NATURAL', 'VIBRANT', 'VACATION', 'LUXURIOUS-NATURAL'],
    visual_tone: "Lush, Exotic, Vibrant",
    energy_level: "High-Saturation Paradise Energy",
    visual_dna: {
      lighting: "Bright tropical sunlight, paradise golden glow, resort luxury light",
      colors: "Tropical greens (#00A86B), turquoise (#40E0D0), coral, sunset orange",
      typography: "Relaxed resort fonts, tropical vacation style, exotic elegant",
      layout: "Lush tropical, dense information-rich sections, palm motifs",
      imagery: "Palm trees, tropical beaches, resort living, exotic paradise, vacation",
      grid: "6 columns",
      radius: "24px"
    },
    product_photography: {
      background: "Large palm leaf or white tropical sand",
      composition: "Lush, exuberant, vacation-focused",
      lighting: "Direct bright tropical sun",
      props: "Hibiscus flowers, coconuts, cocktails, palm fronds",
      post_processing: "Hyper-vibrant greens, turquoise-glow water",
      example_electronics: "Earbuds resting on a lush green Monstera leaf",
      example_fashion: "Model in vibrant tropical patterns at an island resort",
      example_food: "Exotic fruit snack with vibrant paradise-themed packaging"
    },
    section_guidance: {
      gnb: "Turquoise-glow bar, palm-leaf icons, vacation nav",
      hero: "Lush paradise banner, vibrant tropical typography",
      product_grid: "Lush green background cards, exotic spacing",
      footer: "Palm-tree sunset footer, island-style social set"
    },
    lighting_detailed: {
      philosophy: "The vibrant joy of an exotic escape",
      shadow_treatment: "Sharp tropical sun shadows with blue-green fill",
      reference: "Luxury Island Resorts, Caribbean aesthetics"
    },
    technical_params: "Bright tropical sun, high-vibrancy greens",
    negative_patterns: "cold, urban, industrial, minimal stark, corporate, winter, gray, mockup, margins",
    reasoning: "Targets the high-end traveler with lush, vibrant paradise cues.",
    prompt_template: "Exotic tropical 100% pixel-filled web surface, vibrant greens and turquoise, paradise aesthetic, flush-to-edge."
  },
  // --- LUXE/SOPHISTICATED 계열 (8개) ---
  LUXE_PREMIUM: {
    style_key: 'LUXE_PREMIUM',
    mood_name: "Luxe Premium",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['PREMIUM', 'HIGH-END', 'EXCLUSIVE', 'QUALITY', 'REFINED', 'FIRST-CLASS', 'ELITE'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'ELEGANT', 'EXPENSIVE', 'PRESTIGIOUS'],
    visual_tone: "Refined, Exclusive, Timeless",
    energy_level: "Steady & Powerful",
    visual_dna: {
      lighting: "Controlled studio dramatic lighting, premium product spotlight",
      colors: "Deep blacks (#000000), ivory whites (#FFFFF0), gold accents (#D4AF37)",
      typography: "Premium serif (Didot, Bodoni) or refined sans (Futura), elegant",
      layout: "Spacious breathing room, 4-column product grid, exclusive status",
      imagery: "Premium products, luxury materials, high-end professional photography",
      grid: "4 columns",
      radius: "2px"
    },
    product_photography: {
      background: "Polished dark stone, velvet, or silk",
      composition: "Centered and elevated, high-status presentation",
      lighting: "Controlled studio light, soft expensive highlights",
      props: "Thin gold jewelry, silk shadows, champagne, luxury watches",
      post_processing: "Ultra-clean finish, subtle glow, premium color grade",
      example_electronics: "Midnight black earbuds on a polished obsidian surface, gold rim light",
      example_fashion: "Model in high-thread-count clothing in a luxury mansion foyer",
      example_food: "Michelin-style snack plating on a gold-rimmed ivory plate"
    },
    section_guidance: {
      gnb: "Ivory bar with thin gold accents, elegant script logo",
      hero: "Quiet luxury banner with single premium product and gold text",
      product_grid: "Generous whitespace, floating cards with gold-line borders",
      footer: "Exclusive member-style footer, gold icons, serif links"
    },
    lighting_detailed: {
      philosophy: "The light of exclusive heritage",
      shadow_treatment: "Soft, calculated shadows indicating high status",
      reference: "Rolex, Patek Philippe, Mercedes-Benz, Chanel"
    },
    technical_params: "f/11 for absolute sharpness, highlight_soften=0.2, resolution=8K",
    negative_patterns: "budget, playful, casual, busy, loud, cheap-looking, colorful fun, mockup, margins",
    reasoning: "Focuses on 'Expert Craftsmanship' to attract high-value customers with a taste for exclusivity.",
    prompt_template: "Refined premium luxury 100% pixel-filled web surface, ivory and gold, exclusive aesthetic, flush-to-edge."
  },
  LUXE_EDITORIAL: {
    style_key: 'LUXE_EDITORIAL',
    mood_name: "Luxe Editorial",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['EDITORIAL', 'VOGUE', 'MAGAZINE', 'HIGH-FASHION', 'ARTISTIC', 'AVANT-GARDE'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'ELEGANT', 'CREATIVE', 'BOLD'],
    visual_tone: "Artistic, High-Fashion, Sophisticated",
    energy_level: "Dynamic & Artistic",
    visual_dna: {
      lighting: "Editorial fashion dramatic lighting, artistic bold, creative high-key",
      colors: "High contrast B&W or bold editorial color blocking, artistic freedom",
      typography: "Editorial fashion fonts (Didot), dramatic sizing, artistic hierarchy",
      layout: "Magazine-inspired asymmetric editorial, bold grids (3-4 cols)",
      imagery: "Fashion editorial, artistic photography, avant-garde bold creative",
      grid: "4 columns",
      radius: "0px"
    },
    product_photography: {
      background: "Studio paper backdrop or high-art set",
      composition: "Avant-garde angles, model-integrated poses",
      lighting: "Editorial fashion dramatic lighting, hard high-contrast",
      props: "Red chairs, high-fashion models, mirrors, bold props",
      post_processing: "Film-like grain, high sharpness, high fashion saturation",
      example_electronics: "Red earbuds on a model with heavy high-fashion makeup",
      example_fashion: "Avant-garde editorial fashion shot with dramatic shadows",
      example_food: "Pop-art style luxury snack with high-contrast strobe lighting"
    },
    section_guidance: {
      gnb: "Thick editorial black bar, massive serif logo, bold nav",
      hero: "Magazine-cover style banner with oversized vertical text",
      product_grid: "Asymmetric carousel-heavy grid, magazine-style layout",
      footer: "Vogue-style vertical link columns, bold editorial graphics"
    },
    lighting_detailed: {
      philosophy: "The drama of the runway",
      shadow_treatment: "Sharp jet-black shadows for high-impact definition",
      reference: "Vogue, Harper's Bazaar, Cereal Mag, Saint Laurent"
    },
    technical_params: "f/5.6, strobe_light=true, high_sharpness=1.5, grain=0.2",
    negative_patterns: "safe, corporate, predictable, boring, conventional, cheap, amateur, mockup, margins",
    reasoning: "Turns the mall into a high-end fashion magazine, emphasizing artistic value and status.",
    prompt_template: "High-fashion editorial 100% pixel-filled web skin, Vogue-style aesthetic, dramatic serif, flush-to-edge."
  },
  LUXE_MONOCHROME: {
    style_key: 'LUXE_MONOCHROME',
    mood_name: "Luxe Monochrome",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['MONOCHROME', 'BLACK-AND-WHITE', 'GRAYSCALE', 'TIMELESS', 'CLASSIC', 'B&W'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'MINIMAL', 'ELEGANT', 'ETERNAL'],
    visual_tone: "Timeless, Serious, Powerful",
    energy_level: "Quiet Power",
    visual_dna: {
      lighting: "Classic B&W photography lighting, tonal range mastery, zone system",
      colors: "Pure black (#000000), white (#FFFFFF), grayscale spectrum only",
      typography: "Timeless classic fonts (Helvetica, Garamond), sophisticated hierarchy",
      layout: "Classic proportions, timeless golden ratio, 4-6 column grids",
      imagery: "B&W photography, timeless elegance, classic sophistication, eternal",
      grid: "6 columns",
      radius: "0px"
    },
    product_photography: {
      background: "Gradient gray or high-contrast split B&W set",
      composition: "Geometric central alignment, emphasizing form",
      lighting: "Classic B&W photography studio lighting",
      props: "B&W architecture, geometric stone, chess pieces, noir props",
      post_processing: "B&W conversion mastery, tonal range, deep blacks",
      example_electronics: "Black earbuds on white marble in high-contrast B&W",
      example_fashion: "Model in black suit in a B&W architectural setting",
      example_food: "High-contrast B&W snack packaging on grayscale set"
    },
    section_guidance: {
      gnb: "Pure black bar, white thin text, minimalist icons",
      hero: "B&W photography banner with timeless minimalist text",
      product_grid: "Black cards on black background (stealth) or B&W grid",
      footer: "Grayscale sitemap, timeless font, zero color"
    },
    lighting_detailed: {
      philosophy: "The permanence of contrast",
      shadow_treatment: "Extreme contrast between highlights and deep blacks",
      reference: "Chanel, Saint Laurent, Peter Lindbergh photography"
    },
    technical_params: "B&W conversion mastery, tonal range, Ansel Adams zone system",
    negative_patterns: "colorful, playful, trendy, temporary, casual, fun, ephemeral, mockup, margins",
    reasoning: "Uses 'Absolute Contrast' to project power and timelessness that never goes out of style.",
    prompt_template: "Timeless monochrome 100% pixel-filled web surface, black and white luxury, flush-to-edge."
  },
  LUXE_GOLD: {
    style_key: 'LUXE_GOLD',
    mood_name: "Luxe Gold",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['GOLD', 'GLAMOROUS', 'OPULENT', 'RICH', 'LAVISH', 'GILDED', 'EXTRAVAGANT'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'PREMIUM', 'EXPENSIVE', 'GLITZY'],
    visual_tone: "Opulent, Lavish, Glamorous",
    energy_level: "Vibrant & Rich",
    visual_dna: {
      lighting: "Warm luxurious golden lighting, opulent glow, rich atmosphere",
      colors: "Rich gold (#FFD700), deep blacks (#0A0A0A), champagne, bronze, copper",
      typography: "Luxurious bold serif with gold foil texture",
      layout: "Rich ornamental layouts, lavish details, 4-column product grid",
      imagery: "Gold materials, luxury lifestyle, opulent settings, rich textures, wealth",
      grid: "4 columns",
      radius: "8px"
    },
    product_photography: {
      background: "Padded gold leather or dark damask fabric",
      composition: "Lavish arrangement with secondary luxury objects",
      lighting: "Warm luxurious golden lighting, opulent glow",
      props: "Gold leaf, diamonds, velvet curtains, ornate frames",
      post_processing: "Warm golden wash, soft diffused glow, high luxury",
      example_electronics: "Earbuds with gold-plating in a lavish velvet set",
      example_fashion: "Model in gold-sequined dress in an opulent ballroom",
      example_food: "Gold-wrapped luxury snack on a crystal tray with champagne"
    },
    section_guidance: {
      gnb: "Gold-foiled bar with ornate crest, lavish gold icons",
      hero: "Opulent golden banner with rich textures and glowing text",
      product_grid: "Gold-bordered ornate cards on dark pattern background",
      footer: "Lavish gold-accented footer, opulent social icons"
    },
    lighting_detailed: {
      philosophy: "The light of absolute wealth",
      shadow_treatment: "Warm golden-brown shadows with sparkling dust",
      reference: "Versace, Dolby & Gabbana, Burj Al Arab, luxury hotels"
    },
    technical_params: "Warm golden lighting, metallic sheen, luxury finish, opulent",
    negative_patterns: "minimal, simple, budget, casual, muted, understated, poor, plain, mockup, margins",
    reasoning: "Projects 'Maximum Status' through opulent color palettes and lavish material expressions.",
    prompt_template: "Opulent gold 100% pixel-filled web skin, lavish rich aesthetic, gold and black, flush-to-edge."
  },
  LUXE_MARBLE: {
    style_key: 'LUXE_MARBLE',
    mood_name: "Luxe Marble",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['MARBLE', 'STONE', 'GRANITE', 'ARCHITECTURE', 'CLASSICAL', 'MONUMENTAL'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'ELEGANT', 'TIMELESS', 'SOLID'],
    visual_tone: "Monumental, Solid, Architectural",
    energy_level: "Steady & Heavy",
    visual_dna: {
      lighting: "Architectural lighting on stone, marble texture highlighting, solid",
      colors: "Marble whites (#F8F8F8), gray veining (#8B8B8B), black marble, stone",
      typography: "Classical architectural fonts (Trajan), monumental solid elegant",
      layout: "Architectural proportions, 5-column product grid, marble backgrounds",
      imagery: "Marble textures, stone surfaces, architectural luxury, classical materials",
      grid: "5 columns",
      radius: "0px"
    },
    product_photography: {
      background: "Polished white Carrara marble or deep black granite",
      composition: "Architectural, solid, low-angle presentation",
      lighting: "Side-lighting to bring out stone textures and veins",
      props: "Stone columns, architectural models, glass prisms",
      post_processing: "High clarity, natural stone color grade, sharp precision",
      example_electronics: "Earbuds resting on a raw marble chunk with soft lighting",
      example_fashion: "Model in structured clothing in a classical stone atrium",
      example_food: "High-end snack on a polished stone slab with architectural shadows"
    },
    section_guidance: {
      gnb: "Marble-textured top bar, stone-carved typography, black accents",
      hero: "Architectural banner with marble pillars and solid text",
      product_grid: "Stone-textured cards, wide spacing, architectural grid",
      footer: "Massive stone-style footer, monumental typography"
    },
    lighting_detailed: {
      philosophy: "The permanence of stone",
      shadow_treatment: "Strong architectural shadows with clear texture",
      reference: "Classical architecture, High-end marble showrooms"
    },
    technical_params: "Texture highlighting, material photography, solid precision",
    negative_patterns: "soft, fabric, warm cozy, organic natural, plastic synthetic, cheap, mockup, margins",
    reasoning: "Projects an aura of permanent value and architectural sophistication.",
    prompt_template: "Monumental marble 100% pixel-filled web surface, stone textures, architectural aesthetic, flush-to-edge."
  },
  LUXE_LEATHER: {
    style_key: 'LUXE_LEATHER',
    mood_name: "Luxe Leather",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['LEATHER', 'COGNAC', 'MAHOGANY', 'MASCULINE', 'CLASSIC', 'AGED', 'PATINA'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'TRADITIONAL', 'TIMELESS', 'RICH'],
    visual_tone: "Traditional, Masculine, Rich",
    energy_level: "Quiet Prestige",
    visual_dna: {
      lighting: "Warm library lighting, rich leather glow, club atmosphere",
      colors: "Cognac leather (#8B4513), mahogany (#C04000), dark greens, brass gold",
      typography: "Classic serif (Garamond), traditional elegant, masculine refined",
      layout: "Traditional gentlemen's club layouts, 4-column product grid",
      imagery: "Leather materials, aged patina, masculine luxury, traditional clubs",
      grid: "4 columns",
      radius: "6px"
    },
    product_photography: {
      background: "Worn cognac leather or mahogany desk surface",
      composition: "Close-up of texture, heritage-focused",
      lighting: "Warm rich lighting, leather texture emphasis",
      props: "Brass pens, aged books, cognac glasses, leather bound logs",
      post_processing: "Deep warm tones, heritage color grade, soft contrast",
      example_electronics: "Earbuds resting on a vintage leather travel case",
      example_fashion: "Model in aged leather jacket in a traditional library",
      example_food: "Fine snack on a mahogany tray with a brass lighter"
    },
    section_guidance: {
      gnb: "Leather-textured bar, brass-colored icons, traditional nav",
      hero: "Heritage banner with leather patterns and classic text",
      product_grid: "Mahogany-framed cards, traditional proportions",
      footer: "Gentlemen's club style footer, brass social icons"
    },
    lighting_detailed: {
      philosophy: "The warmth of heritage and aging",
      shadow_treatment: "Rich deep brown shadows, soft and inviting",
      reference: "Ralph Lauren, Brooks Brothers, Gentlemen's clubs"
    },
    technical_params: "Warm rich lighting, leather texture emphasis, classic",
    negative_patterns: "bright, synthetic, feminine, modern minimal, cheap plastic, light, mockup, margins",
    reasoning: "Uses 'Heritage Materials' to project timeless masculinity and established success.",
    prompt_template: "Traditional leather 100% pixel-filled web skin, cognac and mahogany, heritage aesthetic, flush-to-edge."
  },

  LUXE_CRYSTAL: {
    style_key: 'LUXE_CRYSTAL',
    mood_name: "Luxe Crystal",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['CRYSTAL', 'GLASS', 'CHANDELIER', 'TRANSPARENT', 'REFRACTION', 'PRISM', 'SPARKLE'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'ELEGANT', 'LUMINOUS', 'BRILLIANT'],
    visual_tone: "Luminous, Brilliant, Transparent",
    energy_level: "Glittering Clarity",
    visual_dna: {
      lighting: "Light refraction through crystal, chandelier glow, sparkling brilliant",
      colors: "Clear transparent, rainbow refraction, brilliant whites, light sparkle",
      typography: "Elegant refined serif, delicate thin, sophisticated light",
      layout: "Light airy layouts, crystal motifs, refraction elements, luminous",
      imagery: "Crystal chandeliers, glass materials, light refraction, luxury sparkle"
    },
    product_photography: {
      background: "Beveled glass surface or mirror backdrop",
      composition: "Floating, prismatic, high-refraction focus",
      lighting: "Bright light refraction through crystal, sparkling",
      props: "Crystal prisms, chandeliers, glass spheres, silver rays",
      post_processing: "Brilliant highlights, prismatic rainbow flares, crystal clarity",
      example_electronics: "Earbuds seen through a crystal prism with rainbow refraction",
      example_fashion: "Model surrounded by crystal chandeliers in a bright ballroom",
      example_food: "High-end snack on a crystal platter with brilliant light rays"
    },
    section_guidance: {
      gnb: "Semi-transparent glass bar, prismatic icons, delicate serif logo",
      hero: "Brilliant crystal-light banner, luminous typography",
      product_grid: "Glass-texture cards with rainbow-refraction borders",
      footer: "Luminous white footer, sparkling social icons"
    },
    lighting_detailed: {
      philosophy: "The brilliance of broken light",
      shadow_treatment: "Prismatic colored shadows, soft and light",
      reference: "Baccarat, Swarovski, Luxury jewelry lighting"
    },
    technical_params: "Refraction photography, brilliant highlights, crystal clarity",
    negative_patterns: "matte, opaque, heavy, dark, rough, industrial, cheap, dull, mockup, margins",
    reasoning: "Utilizes the 'Brilliance of Light' to create a high-status, glowing brand aura.",
    prompt_template: "Brilliant crystal 100% pixel-filled web skin, luminous refraction, clear aesthetic, flush-to-edge."
  },
  LUXE_VELVET: {
    style_key: 'LUXE_VELVET',
    mood_name: "Luxe Velvet",
    parent_mood: "LUXE_SOPHISTICATED",
    keywords: ['VELVET', 'PLUSH', 'SOFT', 'TACTILE', 'SENSUAL', 'RICH-FABRIC', 'LUXURIOUS-TOUCH'],
    related_keywords: ['LUXURY', 'SOPHISTICATED', 'ELEGANT', 'SENSUAL', 'RICH'],
    visual_tone: "Sensual, Plush, Tactile",
    energy_level: "Deep Sensual Comfort",
    visual_dna: {
      lighting: "Soft dramatic lighting on velvet texture, rich fabric glow, tactile",
      colors: "Deep jewel tones (emerald, sapphire, burgundy), black, plush golds",
      typography: "Elegant serif with soft curves, luxurious comfortable, rich",
      layout: "Rich textured layouts, velvet backgrounds, tactile luxury, sensual",
      imagery: "Velvet fabrics, plush textures, luxury textiles, rich materials, touch"
    },
    product_photography: {
      background: "Deep emerald or navy velvet drape",
      composition: "Close-up of fabric pile, tactile and intimate",
      lighting: "Soft dramatic lighting on velvet texture, rich glow",
      props: "Silk ribbons, gold tassels, soft pillows, jewelry boxes",
      post_processing: "Deep color saturation, soft highlight roll-off, tactile grade",
      example_electronics: "Earbuds resting on deep burgundy plush velvet",
      example_fashion: "Model in emerald velvet robe against a dark velvet backdrop",
      example_food: "Rich chocolate snack on a golden plate with velvet cloth"
    },
    section_guidance: {
      gnb: "Velvet-textured deep blue bar, gold serif nav, plush feel",
      hero: "Rich velvet banner with sensual glowing text",
      product_grid: "Plush-texture cards, deep jewel-tone backgrounds",
      footer: "Sensual dark footer, golden tassel icons"
    },
    lighting_detailed: {
      philosophy: "The soft light of an evening chamber",
      shadow_treatment: "Deep soft shadows, multi-tonal reflected light",
      reference: "Luxury theatre interiors, velvet high-fashion collections"
    },
    technical_params: "Texture photography, soft dramatic lighting, rich colors",
    negative_patterns: "rough, industrial, matte plastic, cheap, thin, hard, cold metallic, mockup, margins",
    reasoning: "Appeals to the senses through 'Tactile Richness' and deep, jewel-toned luxury.",
    prompt_template: "Sensual velvet 100% pixel-filled web surface, plush jewel tones, tactile luxury, flush-to-edge."
  },
  // --- PLAYFUL/FUN 계열 (8개) ---
  PLAYFUL_KAWAII: {
    style_key: 'PLAYFUL_KAWAII',
    mood_name: "Playful Kawaii",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['KAWAII', 'CUTE', 'ADORABLE', 'SWEET', 'JAPANESE-CUTE', 'SANRIO', 'PASTEL-CUTE'],
    related_keywords: ['PLAYFUL', 'FUN', 'COLORFUL', 'FRIENDLY', 'LOVELY'],
    visual_tone: "Adorable, Sweet, Kawaii",
    energy_level: "High-Key Cuteness",
    visual_dna: {
      lighting: "Bright cheerful soft lighting, pastel glow, kawaii sweet atmosphere",
      colors: "Pastel pink (#FFB3D9), baby blue (#89CFF0), mint (#98FF98), lavender",
      typography: "Cute rounded fonts, kawaii Japanese (handwritten style), adorable",
      layout: "Character-filled cute, stickers, hearts, stars, kawaii motifs",
      imagery: "Kawaii characters, cute items, pastel aesthetics, sweet"
    },
    product_photography: {
      background: "Pastel pink fabric or fluffy white cloud set",
      composition: "Playful, charming, heart-shaped framing",
      lighting: "Bright cheerful soft lighting, high-key pastel glow",
      props: "Plush toys, candy, heart stickers, glitter, stars",
      post_processing: "Soft focus, pastel color wash, adorable bloom",
      example_electronics: "Pink earbuds with cat-ear caps on a fluffy pink cloud",
      example_fashion: "Model in pastel school-girl style in a room full of plushies",
      example_food: "Rainbow candy snack with cute character-themed packaging"
    },
    section_guidance: {
      gnb: "Pastel pink bar with heart icons, bubbly rounded logo",
      hero: "Cute character banner, heart-shaped product highlights",
      product_grid: "Rounded white cards with pastel borders and stickers",
      footer: "Cloud-shaped footer, kawaii social icons, pink text"
    },
    lighting_detailed: {
      philosophy: "The light of pure adorable joy",
      shadow_treatment: "Almost zero, soft pastel tinted shadows",
      reference: "Sanrio, Hello Kitty, Harajuku Kawaii culture"
    },
    technical_params: "Bright soft high-key, pastel_grade=1.0, bloom=0.3",
    negative_patterns: "dark, serious, minimal, corporate, sophisticated, mature, harsh, mockup, margins",
    reasoning: "Taps into the global 'Kawaii' trend for immediate friendly brand connection.",
    prompt_template: "Adorable Kawaii 100% pixel-filled web surface, pastel pink and baby blue, heart motifs, flush-to-edge."
  },
  PLAYFUL_CARTOON: {
    style_key: 'PLAYFUL_CARTOON',
    mood_name: "Playful Cartoon",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['CARTOON', 'ILLUSTRATION', 'ANIMATED', 'COMIC', 'GRAPHICS', 'TOONS', 'CHARACTER'],
    related_keywords: ['PLAYFUL', 'FUN', 'COLORFUL', 'CREATIVE', 'IMAGINATIVE'],
    visual_tone: "Graphic, Animated, Illustrated",
    energy_level: "High-Energy Animation",
    visual_dna: {
      lighting: "Flat illustrated cartoon lighting, graphic bold, cel-shaded",
      colors: "Bold primary colors, high saturation, vibrant palette, pop-art",
      typography: "Comic book fonts (Bangers), bold playful speech bubbles",
      layout: "Illustrated elements heavy, cartoon backgrounds, panels",
      imagery: "Illustrations, cartoon characters, graphic elements, animated style"
    },
    product_photography: {
      background: "Flat comic-book panel or vibrant illustrated set",
      composition: "Dynamic action-panel framing, graphic overlays",
      lighting: "Flat graphic, cel-shaded style with bold highlights",
      props: "Speech bubbles, action lines, illustrated explosions",
      post_processing: "Bold ink outlines, high saturation, halftone patterns",
      example_electronics: "Earbuds with 'POW!' speech bubble in a comic book layout",
      example_fashion: "Model in bold primary colors against an illustrated background",
      example_food: "Snack package with popping 3D cartoon graphics"
    },
    section_guidance: {
      gnb: "Comic-style black bar, illustrated icons, bold logo",
      hero: "Action-packed cartoon banner, halftone pattern background",
      product_grid: "Comic-panel cards with bold stroke outlines",
      footer: "Illustrated city-scape footer, cartoon-style credits"
    },
    lighting_detailed: {
      philosophy: "The vibrant life of an animated world",
      shadow_treatment: "Flat black ink shadows, dramatic graphic lines",
      reference: "Headspace, Duolingo, Cartoon Network, Spider-Verse"
    },
    technical_params: "Flat graphic cel-shaded, halftone=true, ink_outline=2.0",
    negative_patterns: "realistic, photographic, serious, minimal, sophisticated, subtle, muted, mockup, margins",
    reasoning: "Uses 'Graphic Storytelling' to make brand entry feel fun, inviting, and memorable.",
    prompt_template: "Illustrated cartoon 100% pixel-filled web skin, bold comic-panel aesthetic, vibrant primary colors, flush-to-edge."
  },
  PLAYFUL_PASTEL: {
    style_key: 'PLAYFUL_PASTEL',
    mood_name: "Playful Pastel",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['PASTEL', 'SOFT', 'DREAMY', 'SWEET', 'GENTLE', 'COTTON-CANDY', 'BABY-COLORS'],
    related_keywords: ['PLAYFUL', 'FUN', 'CUTE', 'FRIENDLY', 'DELICATE'],
    visual_tone: "Dreamy, Soft, Gentle",
    energy_level: "Soft & Airy",
    visual_dna: {
      lighting: "Soft dreamy hazy lighting, pastel diffused glow, gentle sweet",
      colors: "Pastel rainbow (pink, blue, yellow, mint), all soft and low saturation",
      typography: "Soft rounded delicate fonts, gentle friendly, comfortable",
      layout: "Soft organic shapes, gentle curves, dreamy floating elements, clouds",
      imagery: "Pastel scenes, soft textures, cotton candy, dreamy photography"
    },
    product_photography: {
      background: "Soft mint fabric or pastel rainbow gradient",
      composition: "Floating, soft-focus, dreamy weightlessness",
      lighting: "Diffused pastel hazy lighting, gentle morning glow",
      props: "Cotton candy, soft clouds, silk ribbons, soap bubbles",
      post_processing: "Soft focus, pastel wash, hazy dreamlike finish",
      example_electronics: "White earbuds floating among pastel bubbles",
      example_fashion: "Model in soft dream-like pastel dress in a misty room",
      example_food: "Pastel-colored snack on a soft mint porcelain plate"
    },
    section_guidance: {
      gnb: "Soft misty-blue bar, rounded pastel icons, gentle logo",
      hero: "Dreamy cloud-scape banner, soft floating product",
      product_grid: "Soft-rounded cards with diffused pastel shadows",
      footer: "Soft rainbow gradient footer, gentle white social icons"
    },
    lighting_detailed: {
      philosophy: "The soft light of a gentle dream",
      shadow_treatment: "Hazy, light-gray shadows with soft edges",
      reference: "Glossier, Pastel aesthetics, aesthetic Instagrams"
    },
    technical_params: "Soft focus, pastel_wash=1.2, hazy_filter=0.3",
    negative_patterns: "harsh, bold, dark, serious, dramatic, high contrast, intense, sharp, mockup, margins",
    reasoning: "Captures a 'Dreamy Aesthetic' that feels approachable, soft, and trendy.",
    prompt_template: "Dreamy pastel 100% pixel-filled web surface, soft clouds and bubbles, gentle aesthetic, flush-to-edge."
  },
  PLAYFUL_STREETWEAR: {
    style_key: 'PLAYFUL_STREETWEAR',
    mood_name: "Playful Streetwear",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['STREETWEAR', 'URBAN', 'STREET', 'HYPE', 'SNEAKERS', 'HYPEBEAST', 'SUPREME'],
    related_keywords: ['PLAYFUL', 'FUN', 'BOLD', 'YOUTHFUL', 'COOL'],
    visual_tone: "Urban, Cool, Bold",
    energy_level: "High-Street Hype",
    visual_dna: {
      lighting: "Urban street photography natural lighting, authentic outdoor, real",
      colors: "Bold primaries + Black/White, brand reds, urban concrete grays",
      typography: "Bold impact fonts (Impact, Futura Bold), logo-heavy, graffiti",
      layout: "Dynamic urban product-focused layouts, hype-driven, bold grids",
      imagery: "Street photography, urban settings, sneakers, streetwear culture"
    },
    product_photography: {
      background: "Urban concrete, graffiti wall, or industrial wire mesh",
      composition: "Aggressive low angles, hype-product focus",
      lighting: "Direct sun or hard street-lamp lighting",
      props: "Skateboards, spray cans, boomboxes, chain-link fences",
      post_processing: "High contrast, urban gray grade, bold color pops",
      example_electronics: "Earbuds on a concrete skate-park ledge with graffiti",
      example_fashion: "Model in hype-wear hoodie in a gritty urban alleyway",
      example_food: "High-energy snack with bold primary color packaging on concrete"
    },
    section_guidance: {
      gnb: "Bold black-and-white bar, sticker-style logos, urban nav",
      hero: "Graffiti-inspired hype banner, bold street slogans",
      product_grid: "Industrial-grid cards, high-contrast urban imagery",
      footer: "Subway-style map footer, graffiti-tagged social icons"
    },
    lighting_detailed: {
      philosophy: "The raw reality of the city streets",
      shadow_treatment: "Hard urban shadows, high-contrast sun/shade",
      reference: "Supreme, Kith, Highsnobiety, Hypebeast"
    },
    technical_params: "Urban photography style, hard_sun=true, high_contrast=1.2",
    negative_patterns: "formal, corporate, luxury high-end, vintage, minimal clean, soft, mockup, margins",
    reasoning: "Speaks the language of 'Youth/Hype' culture through bold, urban visual markers.",
    prompt_template: "Urban streetwear 100% pixel-filled web skin, hypebeast aesthetic, graffiti and concrete, flush-to-edge."
  },
  PLAYFUL_KIDCORE: {
    style_key: 'PLAYFUL_KIDCORE',
    mood_name: "Playful Kidcore",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['KIDCORE', 'CHILDREN', 'PRIMARY-COLORS', 'TOYS', 'KINDERGARTEN', 'CHILDLIKE'],
    related_keywords: ['PLAYFUL', 'FUN', 'COLORFUL', 'INNOCENT', 'NOSTALGIC'],
    visual_tone: "Innocent, Childlike, Vibrant",
    energy_level: "Pure Childlike Energy",
    visual_dna: {
      lighting: "Bright cheerful kindergarten lighting, primary color bold, fun",
      colors: "Pure Primary Red, Blue, Yellow, Green, vibrant and punchy",
      typography: "Childlike fonts (handwriting), playful chunky lettering",
      layout: "Toy-like block arrangements, primary color sections, playful",
      imagery: "Toys, crayons, children's drawings, kindergarten aesthetics"
    },
    product_photography: {
      background: "Primary color toy blocks or colorful felt surface",
      composition: "Childlike and direct, playful toy-centric setup",
      lighting: "Bright cheerful preschool morning light",
      props: "LEGO blocks, crayons, plastic toys, bubble-blowers",
      post_processing: "Max saturation on primary colors, bright and punchy",
      example_electronics: "Brightly colored earbuds among primary-color toy blocks",
      example_fashion: "Model in primary-color striped sweater in a playroom",
      example_food: "Snack package with vibrant toy-like graphics on colorful felt"
    },
    section_guidance: {
      gnb: "Primary yellow bar with red button icons, chunky logo",
      hero: "Kindergarten-style block banner, playful toy illustrations",
      product_grid: "Colorful brick-patterned cards, playful kindergarten spacing",
      footer: "Children's drawing style footer, primary color social icons"
    },
    lighting_detailed: {
      philosophy: "The bright joy of a playground",
      shadow_treatment: "Soft, simple, cheerful shadows",
      reference: "Fisher-Price, LEGO, Kindergarten aesthetics"
    },
    technical_params: "Bright primaries, max_saturation=1.5, punchy_colors=true",
    negative_patterns: "sophisticated, minimal, muted, adult serious, corporate, complex, mockup, margins",
    reasoning: "Utilizes 'Childlike Innocence' to build a fun, high-trust, and nostalgic brand space.",
    prompt_template: "Vibrant kidcore 100% pixel-filled web surface, primary colors, toy aesthetic, flush-to-edge."
  },
  PLAYFUL_MAXIMALIST: {
    style_key: 'PLAYFUL_MAXIMALIST',
    mood_name: "Playful Maximalist",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['MAXIMALIST', 'EXCESSIVE', 'MORE-IS-MORE', 'ABUNDANT', 'ECLECTIC', 'BOLD-CHAOS'],
    related_keywords: ['PLAYFUL', 'FUN', 'COLORFUL', 'DRAMATIC', 'EXPRESSIVE'],
    visual_tone: "Eclectic, Vibrant, Expressive",
    energy_level: "Explosive Abundance",
    visual_dna: {
      lighting: "Dramatic abundant lighting, multiple sources, theatrical bold",
      colors: "Rainbow explosion, pattern-on-pattern, every color possible",
      typography: "Multiple fonts mixed, size variety, expressive chaotic",
      layout: "Crowded intentionally, no negative space, excessive detail",
      imagery: "Layered busy, collections displayed, abundant decorative"
    },
    product_photography: {
      background: "Wall-to-wall patterns or a shelf full of eclectic objects",
      composition: "Hyper-crowded, 'I-Spy' style abundance",
      lighting: "Dramatic theatrical lighting from multiple angles",
      props: "Antique trinkets, neon signs, patterned fabrics, flowers",
      post_processing: "High vibrant saturation, sharpened textures, maximalist detail",
      example_electronics: "Earbuds hidden within a shelf of colorful antique toys",
      example_fashion: "Model wearing every color and pattern in a crowded room",
      example_food: "High-end snack surrounded by a rainbow of eclectic decorations"
    },
    section_guidance: {
      gnb: "Rainbow-patterned bar, every icon different, chaotic logo",
      hero: "Pattern-explosion banner, layered eclectic visuals",
      product_grid: "Crowded grid with different card styles for every product",
      footer: "Maximalist credits footer, rainbow of social icons"
    },
    lighting_detailed: {
      philosophy: "The beautiful chaos of everything at once",
      shadow_treatment: "Multi-colored complex shadows from many sources",
      reference: "Wes Anderson, Iris Apfel, Alessandro Michele era Gucci"
    },
    technical_params: "Complex lighting, high detail, max_color=1.5, pattern_overlay=true",
    negative_patterns: "minimal, simple, restrained, quiet, empty, calm, organized, sparse, mockup, margins",
    reasoning: "Celebrates the 'Joy of Excess', perfect for brands that want to stand out as unique and expressive.",
    prompt_template: "Expressive maximalist 100% pixel-filled web skin, pattern-on-pattern, beautiful chaos, flush-to-edge."
  },
  PLAYFUL_MEMPHIS: {
    style_key: 'PLAYFUL_MEMPHIS',
    mood_name: "Playful Memphis",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['MEMPHIS', '80S-DESIGN', 'GEOMETRIC-PATTERNS', 'SQUIGGLES', 'BOLD-SHAPES'],
    related_keywords: ['PLAYFUL', 'FUN', 'COLORFUL', 'RETRO', 'GEOMETRIC'],
    visual_tone: "Graphic, 80s-Modern, Geometric",
    energy_level: "Punchy & Graphic",
    visual_dna: {
      lighting: "Bold flat graphic lighting, 80s commercial bright, pop-vibe",
      colors: "Primary Blue/Yellow + Pastel Pink/Mint, Squiggle Patterns",
      typography: "Bold geometric 80s fonts, playful angular styles",
      layout: "Geometric patterns (squiggles, triangles, dots), asymmetric bold",
      imagery: "Memphis design elements, geometric shapes, 80s graphic art"
    },
    product_photography: {
      background: "Squiggle-patterned backdrop or geometric wood shapes",
      composition: "Graphic and flat, floating geometric elements",
      lighting: "Bright 80s commercial pop-lighting, flat and bold",
      props: "Geometric triangles, plastic squiggles, colorful dots",
      post_processing: "Flat graphic saturation, bold outlines, Memphis colors",
      example_electronics: "Earbuds on a lavender squiggle pattern with yellow triangles",
      example_fashion: "Model in geometric-print dress against a Memphis-patterned wall",
      example_food: "Snack package with popping 80s geometric graphics"
    },
    section_guidance: {
      gnb: "Squiggle-patterned yellow bar, geometric icons, bold logo",
      hero: "Bold Memphis-pattern banner, geometric shape background",
      product_grid: "Dot-patterned cards, asymmetric graphic spacing",
      footer: "Memphis-style pattern footer, colorful geometric social icons"
    },
    lighting_detailed: {
      philosophy: "The graphic rebellion of the 80s post-modernists",
      shadow_treatment: "Solid flat black shadows or none at all",
      reference: "Memphis Design Group, Ettore Sottsass, 80s MTV"
    },
    technical_params: "Flat graphic pop, squiggle_pattern=true, grid_dot=true",
    negative_patterns: "minimal, monochrome, subtle, organic, traditional, quiet, understated, mockup, margins",
    reasoning: "Invokes a high-energy 'Graphic Nostalgia' that feels both retro and modern.",
    prompt_template: "Geometric Memphis 100% pixel-filled web surface, 80s graphic vibe, squiggles and dots, flush-to-edge."
  },
  PLAYFUL_DOODLE: {
    style_key: 'PLAYFUL_DOODLE',
    mood_name: "Playful Doodle",
    parent_mood: "PLAYFUL_FUN",
    keywords: ['DOODLE', 'HAND-DRAWN', 'SKETCH', 'SCRIBBLE', 'NOTEBOOK', 'MARKER', 'WHIMSICAL'],
    related_keywords: ['PLAYFUL', 'FUN', 'CREATIVE', 'CASUAL', 'SPONTANEOUS'],
    visual_tone: "Whimsical, Casual, Spontaneous",
    energy_level: "Creative Free-Flow",
    visual_dna: {
      lighting: "Natural casual lighting, sketch-like simple, hand-drawn feel",
      colors: "Marker colors, pen ink black, notebook-white background",
      typography: "Hand-drawn lettering, doodled fonts, whimsical scribbles",
      layout: "Organic hand-drawn layouts, doodles scattered, notebook pages",
      imagery: "Hand-drawn illustrations, doodles, sketches, marginalia"
    },
    product_photography: {
      background: "Notebook paper or sketched-on white surface",
      composition: "Casual, surrounded by hand-sketched doodles",
      lighting: "Natural desk lighting, casual and simple",
      props: "Markers, pens, ink pots, sketchbook pages",
      post_processing: "Marker-texture overlay, sketched lines, natural tones",
      example_electronics: "Earbuds on a white desk with pen-drawn doodles around them",
      example_fashion: "Model with doodle-animations drawn over the photography",
      example_food: "Doodle-styled snack packaging on a sketch-book surface"
    },
    section_guidance: {
      gnb: "Doodle-lined top bar, hand-drawn icons, whimsical logo",
      hero: "Sketchbook banner with hand-drawn product illustrations",
      product_grid: "Doodle-bordered cards on a notebook-grid background",
      footer: "Hand-sketched credits footer, marker-drawn social icons"
    },
    lighting_detailed: {
      philosophy: "The freedom of a pen on paper",
      shadow_treatment: "Scribbled cross-hatch shadows or simple gray circles",
      reference: "Doodle art movement, Mr Doodle, sketchbook aesthetics"
    },
    technical_params: "Hand-drawn aesthetic, marker_texture=1.0, sketch_lines=true",
    negative_patterns: "perfect, digital clean, corporate, formal, polished, manufactured, stiff, mockup, margins",
    reasoning: "Built on 'Creative Freedom', creating a brand that feels personal, artistic, and casual.",
    prompt_template: "Whimsical doodle 100% pixel-filled web skin, hand-drawn sketch style, notebook aesthetic, flush-to-edge."
  }
};

export const DEFAULT_ARCHETYPE = 'MINIMAL_CORPORATE';
