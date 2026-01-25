import { LayoutBlockSpec } from "./types";

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
  },
  'sticky-tabs': {
    id: 'sticky-tabs',
    name: 'Sticky Tabs',
    nameKo: '스티키 탭',
    category: 'detail',
    description: 'Navigation anchor tabs',
    descriptionKo: '섹션 이동용 고정 탭 메뉴',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│   [ 상세정보 ]   [ 리뷰 ]   [ Q&A ]   [ 반품/교환 ]       │
└─────────────────────────────────────────────────────────┘
`,
    specifications: { height: '56px', sticky: true },
    promptTemplate: `
DETAIL NAVIGATION - STICKY TABS:
- Layout: Full-width horizontal bar, 56px height.
- Style: Centered text tabs (Description, Reviews, Q&A, Shipping).
- Active State: Underline or bold text for the selected tab.
- Quality: Glassmorphism effect or solid white background with bottom border.
`,
    useCases: ['상세 페이지 섹션 내비게이션']
  },
  'detail-body': {
    id: 'detail-body',
    name: 'Detail Body',
    nameKo: '상세 본문',
    category: 'detail',
    description: 'Long-form description area',
    descriptionKo: '긴 형태의 제품 상세 설명 영역',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                [  Main Image Content  ]                 │
│                [  Storytelling Text   ]                 │
│                [  Technical Specs     ]                 │
└─────────────────────────────────────────────────────────┘
`,
    specifications: { width: '860px', centered: true },
    promptTemplate: `
DETAIL BODY - STORYTELLING CONTENT:
- Content: A sequence of large, high-fidelity hero images explaining product features.
- Typography: Interspersed centered blocks of descriptive Korean text.
- Layout: 860px centered column within a white container.
- Quality: Magazine-style editorial flow, high-resolution details.
`,
    useCases: ['제품 상세 설명', '브랜드 스토리']
  }
};
