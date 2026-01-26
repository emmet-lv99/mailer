import { LayoutBlockSpec } from "./types";

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
- Card: 220px width, NO Shadow, NO Border (Clean flat style).
- Image: 220px × 220px (1:1 Fixed Ratio), White Background.
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
- Card: Width 280px, Height 420px, Background #FFFFFF, NO Border, NO Shadow.
- Image: Width 280px, Height 280px (1:1 Fixed Ratio), Background #FFFFFF (PURE WHITE - MANDATORY)
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
- Card: Width 380px, Height 570px, Background #FFFFFF, NO Border, NO Shadow.
- Image: Width 380px, Height 380px (1:1 Fixed Ratio), Background #FFFFFF (PURE WHITE - MANDATORY)
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
- Card: Width 560-600px, Background #FFFFFF, NO Border, NO Shadow.
- Image: Width 600px, Height 600px (1:1 Fixed Ratio), Background #FFFFFF (PURE WHITE - MANDATORY)
- Info Section: Padding 24-30px, Height 200-250px
- Brand: 14px, #666666
- Name: 18-20px, semi-bold, #000000, 2 lines
- Price: 20-22px, bold, #000000
- CTA Button: Full width, 48-52px height, [BRAND_PRIMARY_COLOR]
`,
    
    useCases: ['럭셔리 브랜드', '고가 제품 강조', 'Editorial style']
  }
};

export const PRODUCT_LIST_KEYWORD_ADAPTATIONS: Record<string, any> = {
  PROFESSIONAL: {
    borderRadius: '4px',
    shadow: 'none',
    cardBorder: 'none',
    hoverShadow: 'none'
  },
  MINIMAL: {
    borderRadius: '0-2px',
    shadow: 'none',
    cardBorder: 'none',
    hoverShadow: 'none'
  },
  MODERN: {
    borderRadius: '8-12px',
    shadow: 'none',
    cardBorder: 'none',
    hoverShadow: 'none'
  },
  PLAYFUL: {
    borderRadius: '16px',
    shadow: 'none',
    cardBorder: 'none',
    hoverShadow: 'none',
    hoverTransform: 'translateY(-4px) rotate(1deg)'
  },
  LUXURY: {
    borderRadius: '0px',
    shadow: 'none',
    cardBorder: 'none',
    hoverShadow: 'none',
    spacing: '+20% gap increase'
  }
};
