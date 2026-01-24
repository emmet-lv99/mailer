/**
 * PRODUCT LIST (상품 리스트) - Layout Block Definitions
 */

export interface LayoutBlockSpec {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  description: string;
  descriptionKo: string;
  visualStructure: string;
  specifications: any;
  promptTemplate: string;
  useCases: string[];
}

export const VISUAL_FIDELITY_RULES = `
━━━ VISUAL FIDELITY & MATERIAL QUALITY ━━━
- LIGHTING: Multi-point studio lighting, soft diffused shadows, no harsh glare. High dynamic range (HDR).
- MATERIALS: Anti-aliased UI edges, glassmorphism hints where appropriate, premium paper-texture backgrounds or pure #FFFFFF.
- FIDELITY: 8K resolution, high-fidelity UI/UX rendering, ray-traced reflections on glass/metallic products.
- KOREAN COMMERCE STANDARD: High item density, clean vertical hierarchy, focused readability.
`;

export const FEW_SHOT_EXAMPLES = [
  {
    type: 'Luxury Fashion',
    prompt: 'Hyper-realistic direct 2D screenshot of a luxury fashion mall. Minimalism, extensive whitespace, serif typography (#111111). Header with centered logo. Hero banner featuring a high-end leather bag with soft cinematic lighting. 3-column product grid with zero borders, delicate 1px dividers, high-resolution studio photography on pure white backgrounds.'
  },
  {
    type: 'Modern Tech',
    prompt: 'Clean modern electronics store UI. Sans-serif "Inter" font, bold headings, sharp 8px corner radii. Vibrant accent colors for CTA (#007AFF). 4-column product grid with subtle elevation shadows. Detailed specs visible on hover. 16:9 cinematic product video preview centered.'
  }
];

/**
 * MAIN & HERO BLOCKS - Layout Block Definitions
 */

export const MAIN_BLOCKS: Record<string, LayoutBlockSpec> = {
  
  /**
   * CAROUSEL CENTER - 측면 피크 좌우 슬라이더
   */
  'carousel-center': {
    id: 'carousel-center',
    name: 'Carousel Center',
    nameKo: '캐러셀 센터',
    category: 'main',
    description: 'Centered slider with side peek effect',
    descriptionKo: '중앙 집중식 측면 피크 슬라이더',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│ [Peek-L]      [   Main Center Banner 1280px   ]   [Peek-R] │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      width: '1280px',
      aspectRatio: '21:9',
      peek: '15%'
    },
    promptTemplate: `
MAIN HERO CAROUSEL - CENTERED WITH SIDE PEEK:
Structure:
- Banner: 1280px wide (centered) main banner, visible partially on both sides (side peek).
- Navigation: Floating Pagination dots at bottom center, Subtle left/right arrow buttons.
- Content: Headline (48-64px bold), Description (18px), Brand Logo overlay.
- Quality: Studio photography, cinematic depth of field, high-fidelity materials.
`,
    useCases: ['브랜드 비주얼 강조', '이벤트 프로모션']
  },
  
  /**
   * HERO GRID - 에디토리얼 스타일 매거진 그리드
   */
  'hero-grid': {
    id: 'hero-grid',
    name: 'Hero Grid',
    nameKo: '히어로 그리드',
    category: 'main',
    description: 'Editorial hero with product grid links',
    descriptionKo: '에디토리얼 히어로 + 제품 링크 그리드',
    visualStructure: `
┌───────────────┬───────────────┐
│               │   [Small 1]   │
│    [Hero]     ├───────────────┤
│    Vertical   │   [Small 2]   │
└───────────────┴───────────────┘
`,
    specifications: {
      split: '60/40',
      heroWidth: '768px'
    },
    promptTemplate: `
HERO GRID - EDITORIAL MAGAZINE STYLE:
Layout:
- Left (60%): Large vertical hero banner (768px wide).
- Right (40%): 2×2 mini-grid of product category links or featured items.
- Typography: Bold brutalist or elegant serif headings overlapping images.
`,
    useCases: ['에디토리얼 느낌 강조', '카테고리 퀵 서비스']
  }
};

/**
 * DETAIL PAGE BLOCKS
 */
export const DETAIL_BLOCKS: Record<string, LayoutBlockSpec> = {
  /**
   * PRODUCT HERO - 제품 상세페이지 상단 (Gallery + Info)
   */
  'product-hero': {
    id: 'product-hero',
    name: 'Product Hero',
    nameKo: '제품 히어로',
    category: 'detail',
    description: 'Main product details at the top',
    descriptionKo: '상세페이지 상단 (제품 갤러리/정보)',
    visualStructure: `
┌───────────────┬───────────────┐
│   [Gallery]   │    [Metadata] │
│     640px     │     640px     │
└───────────────┴───────────────┘
`,
    specifications: {
      galleryWidth: '640px',
      infoWidth: '640px'
    },
    promptTemplate: `
PRODUCT DETAIL HERO - GALLERY & METADATA:
Layout: 2-column split (50/50).
Left (Gallery): 1:1 Large product image (640px) + Horizontal thumbnail strip below.
Right (Metadata): 
- Header: Brand Name (14px), Product Title (32px bold).
- Price: 24px bold black, Discount % badge.
- Options: Color/Size chips with selected state.
- Actions: Large Buy Now (Black) & Cart (White) buttons.
`,
    useCases: ['상세 페이지 상단 고정 사양']
  }
};

export const PRODUCT_LIST_BLOCKS: Record<string, LayoutBlockSpec> = {
  
  /**
   * GRID 5-COLUMN - 최대 밀도 데스크톱
   */
  'grid-5': {
    id: 'grid-5',
    name: 'Grid 5-Column',
    nameKo: '그리드 5단',
    category: 'product-list',
    description: 'Maximum density for desktop',
    descriptionKo: '데스크톱 최대 밀도',
    
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                   [  Margin  ]                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [P1]  [P2]  [P3]  [P4]  [P5]                    │   │
│  │ 220×  220×  220×  220×  220×                    │   │
│  │ 340   340   340   340   340                     │   │
│  │                                                  │   │
│  │ [P6]  [P7]  [P8]  [P9]  [P10]                   │   │
│  │ 220×  220×  220×  220×  220×                    │   │
│  │ 340   340   340   340   340                     │   │
│  │                                                  │   │
│  │ [P11] [P12] [P13] [P14] [P15]                   │   │
│  └──────────────────────────────────────────────────┘   │
│            Max-width: 1280px                            │
│            5 products per row                           │
│            Gap: 20px horizontal, 20px vertical          │
└─────────────────────────────────────────────────────────┘
`,
    
    specifications: {
      grid: { columns: 5, columnGap: '20px', rowGap: '20px' },
      productCard: { width: '220px', height: '340px' }
    },
    
    promptTemplate: `
PRODUCT LIST - 5-COLUMN GRID (MAX DENSITY):
- Layout: 5 items per row, Grid gap 20px, Side padding 40px.
- Card: 220px width, 1:1 Square Image (White Background MANDATORY).
- Visuals: Studio lighting, sharp focus on product, no lifestyle distractions.
- Text: Brand in 11px gray, Name 13px dark-gray (2 lines), Price 15px bold black.
- Badges: Micro-labels for SALE/NEW/BEST with high-contrast colors.
- Quality: Pixel-perfect alignment, clean UI architecture.
`,
    
    useCases: ['제품 수가 많은 카테고리', '데스크톱 사용자 중심 쇼핑몰', 'Catalog style']
  },
  
  /**
   * GRID 4-COLUMN - 표준 고밀도
   */
  'grid-4': {
    id: 'grid-4',
    name: 'Grid 4-Column',
    nameKo: '그리드 4단',
    category: 'product-list',
    description: 'Standard high-density grid',
    descriptionKo: '표준 고밀도 그리드',
    
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                   [  Margin  ]                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [Product1] [Product2] [Product3] [Product4]     │   │
│  │   280×       280×       280×       280×         │   │
│  │   420        420        420        420          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
`,
    
    specifications: {
      grid: { columns: 4, columnGap: '20px', rowGap: '20px' },
      productCard: { width: '280px', height: '420px' }
    },
    
    promptTemplate: `
PRODUCT LIST - 4-COLUMN GRID (STANDARD):
Container:
- Max-width: 1280px (centered), Padding: 0 40px
Grid Layout:
- Columns: 4, Column gap: 20px, Row gap: 20px
- Calculation: (1280px - 80px padding - 60px gaps) / 4 = 280px per card
PRODUCT CARD (280px × 420px):
- Card: Width 280px, Height 420px, Background #FFFFFF, Border 1px solid #E8E8E8, Radius [BORDER_RADIUS]
- Image: Width 280px, Height 280px (1:1), Background #FFFFFF (PURE WHITE - MANDATORY)
- Info Section: Padding 16px, Height 140px
- Brand: 12px, #666666
- Name: 14px, #333333, 2 lines, height 40px
- Price: 16px, bold, #000000
`,
    
    useCases: ['가장 표준적인 상품 진열', '제품 이미지와 정보 균형']
  },
  
  /**
   * GRID 3-COLUMN - 균형잡힌 가시성
   */
  'grid-3': {
    id: 'grid-3',
    name: 'Grid 3-Column',
    nameKo: '그리드 3단',
    category: 'product-list',
    description: 'Balanced visibility',
    descriptionKo: '균형잡힌 가시성',
    
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│  [Product 1]    [Product 2]    [Product 3]      │   │
│    380×           380×           380×           │   │
│    570            570            570            │   │
└─────────────────────────────────────────────────────────┘
`,
    
    specifications: {
      grid: { columns: 3, columnGap: '40px', rowGap: '40px' },
      productCard: { width: '380px', height: '570px' }
    },
    
    promptTemplate: `
PRODUCT LIST - 3-COLUMN GRID (BALANCED):
Container:
- Max-width: 1280px (centered), Padding: 0 40px
Grid Layout:
- Columns: 3, Column gap: 40px, Row gap: 40px
- Calculation: (1280px - 80px padding - 80px gaps) / 3 = 380px per card
PRODUCT CARD (380px × 570px):
- Card: Width 380px, Height 570px, Background #FFFFFF, Border 1px solid #E8E8E8, Radius [BORDER_RADIUS]
- Image: Width 380px, Height 380px (1:1), Background #FFFFFF (PURE WHITE - MANDATORY)
- Info Section: Padding 20px, Height 190px
- Brand: 13px, #666666
- Name: 15px, #333333, 2 lines, height 45px
- Price: 18px, bold, #000000
`,
    
    useCases: ['프리미엄 제품 강조', '브랜드 중심 쇼핑몰']
  },
  
  /**
   * GRID 2-COLUMN - 대형 썸네일 임팩트
   */
  'grid-2': {
    id: 'grid-2',
    name: 'Grid 2-Column',
    nameKo: '그리드 2단',
    category: 'product-list',
    description: 'Large thumbnails for impact',
    descriptionKo: '큰 썸네일로 임팩트',
    
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│      [Product 1]           [Product 2]          │   │
│         560×                   560×             │   │
│         800                    800              │   │
└─────────────────────────────────────────────────────────┘
`,
    
    specifications: {
      grid: { columns: 2, columnGap: '80px', rowGap: '80px' },
      productCard: { width: '560px', height: '800px' }
    },
    
    promptTemplate: `
PRODUCT LIST - 2-COLUMN GRID (LARGE IMPACT):
Container:
- Max-width: 1280px (centered), Padding: 0 40px
Grid Layout:
- Columns: 2, Column gap: 80px, Row gap: 80px
- Card width: 560-600px each
PRODUCT CARD (600px × 800-900px):
- Card: Width 560-600px, Background #FFFFFF, Border 1px solid #E0E0E0, Radius [BORDER_RADIUS]
- Image: Width 600px, Height 600px (1:1) or 750px (3:4), Background #FFFFFF (PURE WHITE - MANDATORY)
- Info Section: Padding 24-30px, Height 200-250px
- Brand: 14px, #666666
- Name: 18-20px, semi-bold, #000000, 2 lines
- Price: 20-22px, bold, #000000
- CTA Button: Full width, 48-52px height, [BRAND_PRIMARY_COLOR]
`,
    
    useCases: ['럭셔리 브랜드', '고가 제품 강조', 'Editorial style']
  }
};

export const PRODUCT_LIST_COMMON = {
  imageRequirements: {
    background: '#FFFFFF (pure white, MANDATORY)',
    quality: 'High resolution, professional photography',
    style: 'Studio lighting, clean product shot',
    prohibited: 'No lifestyle backgrounds, no shadows on product'
  }
};

export const PRODUCT_LIST_KEYWORD_ADAPTATIONS: Record<string, any> = {
  PROFESSIONAL: {
    borderRadius: '4px',
    shadow: '0 2px 4px rgba(0,0,0,0.08)',
    cardBorder: '1px solid #E8E8E8',
    hoverShadow: '0 4px 12px rgba(0,0,0,0.12)'
  },
  MINIMAL: {
    borderRadius: '0-2px',
    shadow: '0 1px 3px rgba(0,0,0,0.06)',
    cardBorder: 'None or 0.5px solid #F0F0F0',
    hoverShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  MODERN: {
    borderRadius: '8-12px',
    shadow: '0 2px 8px rgba(0,0,0,0.08)',
    cardBorder: '1px solid #E8E8E8',
    hoverShadow: '0 6px 16px rgba(0,0,0,0.12)'
  },
  PLAYFUL: {
    borderRadius: '16px',
    shadow: '0 4px 12px rgba(0,0,0,0.1)',
    cardBorder: '1px solid #E0E0E0',
    hoverShadow: '0 8px 20px rgba(0,0,0,0.15)',
    hoverTransform: 'translateY(-4px) rotate(1deg)'
  },
  LUXURY: {
    borderRadius: '0px',
    shadow: '0 4px 16px rgba(0,0,0,0.06)',
    cardBorder: '0.5px solid #D0D0D0',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.1)',
    spacing: '+20% gap increase'
  }
};


/**
 * VIDEO (비디오/SHORTS) - Layout Block Definitions
 */

export const VIDEO_BLOCKS: Record<string, any> = {
  
  /**
   * FEED SCROLL - 세로 비디오 피드 (YouTube Shorts / Instagram Reels)
   */
  'feed-scroll': {
    id: 'feed-scroll',
    name: 'Feed Scroll',
    nameKo: '피드 스크롤',
    category: 'video',
    description: 'Vertical video feed',
    descriptionKo: '세로형 비디오 피드 (숏츠/릴스)',
    
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                   [  Margin  ]                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │  [V1]  [V2]  [V3]  [V4]  [V5]  [V6]  [V7] →    │   │
│  │  9:16  9:16  9:16  9:16  9:16  9:16  9:16       │   │
│  │   ▶     ▶     ▶     ▶     ▶     ▶     ▶         │   │
│  │                                                  │   │
│  │  ← Horizontal scroll (좌우 스크롤)               │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│            Max-width: 1280px                            │
│            Scroll: Horizontal, smooth                   │
│            Video ratio: 9:16 (vertical)                 │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      container: { maxWidth: '1280px', padding: '0 40px' },
      videoCard: { width: '180-200px', height: '380-420px', aspectRatio: '9:16' }
    },
    
    promptTemplate: `
VIDEO FEED SCROLL - VERTICAL SHORTS STYLE:
Container:
- Max-width: 1280px (centered), Padding: 0 40px
Scroll: Horizontal flex row, Gap: 16px, Smooth scroll-behavior
VIDEO CARDS (180-200px × 320-355px, 9:16 ratio):
- Thumbnail: 9:16 VERTICAL, Border-radius: 12px, Object-fit: Cover
- Play Button: Absolute center, 48-56px circle, Background: rgba(255,255,255,0.9), Icon: White ▶
- Duration: Bottom-right corner, 11px semi-bold, 0:45 style badge
- Info Section: Padding 12px 0, Title (13px, 2 lines, Ellipsis), Views (11px, "234 views")
`
  },
  
  /**
   * FULL WIDTH VIDEO - 전체 너비 시네마틱 영상
   */
  'full-width-video': {
    id: 'full-width-video',
    name: 'Full Width Video',
    nameKo: '풀 와이드 비디오',
    category: 'video',
    description: 'Cinematic product showcase',
    descriptionKo: '시네마틱 제품 쇼케이스',
    
    promptTemplate: `
FULL WIDTH VIDEO - CINEMATIC SHOWCASE:
Container: Max-width: 1280px (centered), Padding: 0 40px
Video Player:
- Dimensions: 1280px wide, 720px high (16:9) or 550px high (21:9)
- Style: Border-radius 12px, Absolute center large Play Button (72-80px circle, ▶)
- Overlay: Optional Bottom Gradient (120px height) for brand logo and title
`
  },
  
  /**
   * SPLIT VIDEO - 좌측 영상, 우측 텍스트/정보
   */
  'split-video': {
    id: 'split-video',
    name: 'Split Video',
    nameKo: '스플릿 비디오',
    category: 'video',
    description: 'Video with product details',
    descriptionKo: '비디오 + 제품 상세 정보',
    
    promptTemplate: `
SPLIT VIDEO - VIDEO + PRODUCT DETAILS:
Layout: Flex row, 60% Video (768px) / 40% Text (512px), Gap 40-60px
Video: 16:9 ratio, 12px radius, Center Play Button (64px circle)
Content (Right):
- Headline: 28-32px bold, Description: 16px, Features: Bullet list with ✓ icons
- Price: 24px bold, CTA Button: 240px wide, 52px height
`
  }
};

export const VIDEO_COMMON = {
  playButton: {
    background: 'rgba(255,255,255,0.95)',
    shadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: '#000000'
  },
  aspectRatios: { vertical: '9:16', horizontal: '16:9', cinematic: '21:9' }
};

export const VIDEO_KEYWORD_ADAPTATIONS: Record<string, any> = {
  MODERN: { borderRadius: '12px', playButtonStyle: 'Sleek, minimal' },
  MINIMAL: { borderRadius: '2px', playButtonStyle: 'Simple, no shadow' },
  PLAYFUL: { borderRadius: '16px', playButtonStyle: 'Colorful, animated' },
  PROFESSIONAL: { borderRadius: '8px', playButtonStyle: 'Classic, solid' },
  LUXURY: { borderRadius: '0px', playButtonStyle: 'Elegant, refined' }
};

export function generateMainBlockPrompt(
  blockType: string,
  designKeywords: string[],
  archetypeGuidance?: string
): string {
  const block = MAIN_BLOCKS[blockType] || DETAIL_BLOCKS[blockType];
  if (!block) return '';
  
  const adaptation = getVideoKeywordAdaptation(designKeywords);
  let prompt = block.promptTemplate;
  
  prompt += `\n\n━━━ DESIGN ADAPTATIONS (Keywords: ${designKeywords.join(', ')}) ━━━`;
  prompt += `\n- Corner Geometry: ${adaptation.borderRadius} corner radius`;
  if (archetypeGuidance) prompt += `\n- Archetype Guidance: ${archetypeGuidance}`;
  prompt += `\n${VISUAL_FIDELITY_RULES}`;
  
  return prompt;
}

export function generateVideoPrompt(
  blockType: string,
  designKeywords: string[],
  archetypeGuidance?: string
): string {
  const block = VIDEO_BLOCKS[blockType];
  if (!block) return '';
  
  const adaptation = getVideoKeywordAdaptation(designKeywords);
  let prompt = block.promptTemplate;
  
  prompt += `\n\n━━━ DESIGN ADAPTATIONS (Keywords: ${designKeywords.join(', ')}) ━━━`;
  prompt += `\n- Corner Geometry: ${adaptation.borderRadius} corner radius`;
  prompt += `\n- Interaction: ${adaptation.playButtonStyle} Play Button with subtle glow`;
  if (archetypeGuidance) prompt += `\n- Archetype Guidance: ${archetypeGuidance}`;
  prompt += `\n${VISUAL_FIDELITY_RULES}`;
  
  return prompt;
}

function getVideoKeywordAdaptation(keywords: string[]) {
  const upperKeywords = keywords.map(k => k.toUpperCase());
  for (const keyword of upperKeywords) {
    if (VIDEO_KEYWORD_ADAPTATIONS[keyword]) {
      return VIDEO_KEYWORD_ADAPTATIONS[keyword];
    }
  }
  return VIDEO_KEYWORD_ADAPTATIONS.MODERN;
}

export function generateProductListPrompt(
  gridType: 'grid-5' | 'grid-4' | 'grid-3' | 'grid-2',
  designKeywords: string[],
  archetypeGuidance?: string
): string {
  const block = PRODUCT_LIST_BLOCKS[gridType];
  const adaptation = getProductListKeywordAdaptation(designKeywords);
  
  let prompt = block.promptTemplate;
  
  prompt += `\n\n━━━ DESIGN ADAPTATIONS (Keywords: ${designKeywords.join(', ')}) ━━━`;
  prompt += `\n- Surface Style: ${adaptation.borderRadius} radius, ${adaptation.cardBorder} border`;
  prompt += `\n- Atmosphere: Shadow intensity ${adaptation.shadow}, Hover elevation ${adaptation.hoverShadow}`;
  if (adaptation.spacing) prompt += `\n- Verticality: ${adaptation.spacing}`;
  if (adaptation.hoverTransform) prompt += `\n- Dynamics: ${adaptation.hoverTransform}`;
  if (archetypeGuidance) prompt += `\n- Archetype Guidance: ${archetypeGuidance}`;
  prompt += `\n${VISUAL_FIDELITY_RULES}`;
  
  return prompt;
}

function getProductListKeywordAdaptation(keywords: string[]) {
  const upperKeywords = keywords.map(k => k.toUpperCase());
  for (const keyword of upperKeywords) {
    if (PRODUCT_LIST_KEYWORD_ADAPTATIONS[keyword]) {
      return PRODUCT_LIST_KEYWORD_ADAPTATIONS[keyword];
    }
  }
  return PRODUCT_LIST_KEYWORD_ADAPTATIONS.MODERN;
}
