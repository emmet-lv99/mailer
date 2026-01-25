import { LayoutBlockSpec } from "./types";

export const TOP_BANNER_BLOCKS: Record<string, LayoutBlockSpec> = {
  'top-banner': {
    id: 'top-banner',
    name: 'Top Banner',
    nameKo: '상단 띠배너',
    category: 'top-banner',
    description: 'Minimalist announcement ribbon',
    descriptionKo: '심플한 상단 안내 띠배너',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│ [       Announcement: Free Shipping on all orders!     ] │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      height: '40px',
      fontSize: '13px',
      alignment: 'center'
    },
    promptTemplate: `
TOP ANNOUNCEMENT BANNER:
- Dimensions: Height 40px, full-width.
- Content: Minimalist single-line announcement text (e.g., \"Free shipping on orders over $50\").
- Typography: 12-13px, medium weight, centered.
- Colors: High-contrast background (Brand Primary or Charcoal) with white text.
`,
    useCases: ['공지사항', '프로모션 안내']
  }
};

export const HEADER_BLOCKS: Record<string, LayoutBlockSpec> = {
  'side-nav-header': {
    id: 'side-nav-header',
    name: 'Side-Nav Header',
    nameKo: '사이드 네비 헤더',
    category: 'header',
    description: 'Logo left, inline navigation',
    descriptionKo: '좌측 로고와 인라인 네비게이션',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│ [LOGO]  [Nav1] [Nav2]                          [🔍] [👤] [🛒] │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      height: '72px',
      logoSize: '48px',
      navAlignment: 'inline-left',
      icons: ['search', 'account', 'cart']
    },
    promptTemplate: `
SIDE-NAV HEADER - CLEAN & DIRECT:
- Layout: 72px height, single-line horizontal flex.
- Logo: Circular or square brand insignia on the far left.
- Navigation: Text links (ALL, OPEN DEAL) positioned immediately to the right of the logo, 14px semi-bold.
- Utility: Search, Account, and Shopping Cart icons grouped on the far right, separated by thin vertical dividers.
- Aesthetics: Pure white background, 1px light-gray (#E8E8E8) bottom border, high-fidelity iconography.
`,
    useCases: ['모던 부티크', '빠른 네비게이션']
  },
  'stacked-center-header': {
    id: 'stacked-center-header',
    name: 'Stacked-Center Header',
    nameKo: '스택 센터 헤더',
    category: 'header',
    description: 'Logo centered, bottom navigation span',
    descriptionKo: '중앙 로고와 하단 전체 네비게이션',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                      [    LOGO    ]                     │
├─────────────────────────────────────────────────────────┤
│  [Nav1] [Nav2] [Nav3] [Nav4] [Nav5]          [🔍] [👤] [🛍️] │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      height: '120px',
      logoSize: '120px',
      navAlignment: 'centered-bottom',
      icons: ['search', 'account', 'bag']
    },
    promptTemplate: `
STACKED-CENTER HEADER - EDITORIAL CLASSIC:
- Layout: 120px height, two-tier vertical stack.
- Top Tier: Large brand logo centered (120px width), creating a powerful focal point.
- Bottom Tier: Wide-spanning navigation menu with descriptive Korean labels and subtle emojis.
- Utility: Search, Account, and Shopping Bag icons positioned on the far right of the bottom tier.
- Aesthetics: Spatially generous, clean white background, focus on typography and symmetry.
`,
    useCases: ['매거진 스타일', '대규모 카테고리 쇼핑몰']
  }
};

export const FOOTER_BLOCKS: Record<string, LayoutBlockSpec> = {
  'standard-footer': {
    id: 'standard-footer',
    name: 'Standard Footer',
    nameKo: '표준 푸터',
    category: 'footer',
    description: 'Logo, Info, and Links',
    descriptionKo: '로고, 기업 정보 및 링크 포함 푸터',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│ [LOGO]                                                  │
│                                                         │
│ [Links: About | Privacy | Terms | Guide]                │
│                                                         │
│ [Company Info]         [CS Center]       [Payment Info] │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ [Copyright]                                  [SNS Icons]│
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      padding: '60px 0',
      logoSize: '120px',
      fontSize: '13px'
    },
    promptTemplate: `
STANDARD E-COMMERCE FOOTER:
- Layout: Multi-column structure with clear visual hierarchy.
- Top Section: Small brand logo (grayscale/muted).
- Navigation: Horizontal list of mandatory links (Company, Terms, Privacy, Guide) in 13px medium gray.
- Middle Section (Grid 3-Col): 
  - Col 1 (Company): Business Name, Representative, Address, License Number.
  - Col 2 (Customer Service): Phone (1544-8847), Email, Operating Hours.
  - Col 3 (Payments): Bank transfer details.
- Bottom Section: Slim full-width row with Copyright (left) and Grayscale SNS Icons (right: Instagram, YouTube, Facebook, etc.).
- Aesthetics: Light gray (#F8F8F8) or deep charcoal background, subtle 1px dividers, refined typography using "Inter" or "Pretendard".
`,
    useCases: ['공통 서비스 정보 노출', '신뢰도 형성']
  }
};
