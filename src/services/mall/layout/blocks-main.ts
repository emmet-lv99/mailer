import { LayoutBlockSpec } from "./types";

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
    useCases: ['브랜드 비주루 강조', '이벤트 프로모션']
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

export const SUB_BANNER_BLOCKS: Record<string, LayoutBlockSpec> = {
  'image-strap': {
    id: 'image-strap',
    name: 'Full Screen',
    nameKo: '풀 스크린',
    category: 'sub',
    description: 'Full-width decorative image',
    descriptionKo: '가로 전체 너비 장식용 이미지',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│ [          Full Width Immersive Image Banner          ] │
└─────────────────────────────────────────────────────────┘
`,
    specifications: { height: '300-400px', width: '100vw' },
    promptTemplate: `
SUB BANNER - FULL SCREEN STRAP:
- Dimensions: Full-width (immersive), 300-400px height.
- Content: High-fidelity lifestyle or texture-focused imagery without heavy text overlays.
- Aesthetics: Edge-to-edge, cinematic lighting, material depth.
`,
    useCases: ['섹션 구분', '브랜드 감성 전달']
  },
  'promotion-bar': {
    id: 'promotion-bar',
    name: 'Promotion Bar',
    nameKo: '프로모션 바',
    category: 'sub',
    description: 'Simple notification area',
    descriptionKo: '심플한 프로모션 안내 영역',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│     [   🔥 Limited Offer: 30% Off Everything!   ]       │
└─────────────────────────────────────────────────────────┘
`,
    specifications: { height: '60px', padding: '16px' },
    promptTemplate: `
SUB BANNER - PROMOTION BAR:
- Dimensions: 60px height, full-width.
- Content: Centered bold promotion text (e.g., \"SHOP NOW - 30% OFF\").
- Aesthetics: High-contrast background (Brand Color), sharp typography, clean alignment.
`,
    useCases: ['긴급 공지', '강력한 CTA']
  },
  'grid-2-banner': {
    id: 'grid-2-banner',
    name: 'Grid 2-Banner',
    nameKo: '그리드 2단 배너',
    category: 'sub',
    description: 'Two side-by-side promo banners',
    descriptionKo: '나란히 배치된 2단 홍보 배너',
    visualStructure: `
┌───────────────┬───────────────┐
│   [Banner 1]  │   [Banner 2]  │
└───────────────┴───────────────┘
`,
    specifications: { columns: 2, gap: '20px' },
    promptTemplate: `
SUB BANNER - GRID 2-COLUMN:
- Layout: Two equal-width banners side-by-side, 20px gap.
- Content: Stylized graphics or product photos with minimal bold headllines.
- Aesthetics: Symmetrical, high-fidelity UI framing.
`,
    useCases: ['동시 프로모션', '카테고리 강조']
  },
  'grid-3-banner': {
    id: 'grid-3-banner',
    name: 'Grid 3-Banner',
    nameKo: '그리드 3단 배너',
    category: 'sub',
    description: 'Three side-by-side promo banners',
    descriptionKo: '나란히 배치된 3단 홍보 배너',
    visualStructure: `
┌──────────┬──────────┬──────────┐
│ [Item 1] │ [Item 2] │ [Item 3] │
└──────────┴──────────┴──────────┘
`,
    specifications: { columns: 3, gap: '16px' },
    promptTemplate: `
SUB BANNER - GRID 3-COLUMN:
- Layout: Three equal-width square or vertical banners, 16px gap.
- Content: Icon-driven or product-focused visuals with sub-labels.
- Aesthetics: Rhythmic repeating structure, balanced composition.
`,
    useCases: ['특징 소개', '프로세스 안내']
  }
};
