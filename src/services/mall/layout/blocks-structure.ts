import { LayoutBlockSpec } from "./types";

export const SECTION_HEADER_BLOCKS: Record<string, LayoutBlockSpec> = {
  'section-header-center': {
    id: 'section-header-center',
    name: 'Centered Header',
    nameKo: '센터 섹션 헤더',
    category: 'section-header',
    description: 'Title over Description',
    descriptionKo: '타이틀과 설명이 포함된 중앙 정렬 헤더',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [  BOLD TITLE  ]                     │
│               [ Small secondary description ]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      padding: '80px 0 40px',
      titleSize: '24px',
      descSize: '14px',
      alignment: 'center'
    },
    promptTemplate: `
CONTENT SECTION HEADER - CENTERED:
- Layout: Vertically stacked, centered alignment, generous top padding (80px).
- Title: Bold uppercase or strong weight (24-28px), clear focal point.
- Description: Minimalist single-line text below title (14px), muted color (medium gray).
- Aesthetics: High-density whitespace, clean vertical hierarchy, focused readability.
`,
    useCases: ['섹션 제목 표시', '브랜드 스토리 도입부']
  },
  'section-header-category': {
    id: 'section-header-category',
    name: 'Header with Categories',
    nameKo: '카테고리 섹션 헤더',
    category: 'section-header',
    description: 'Title, Description, and Category Buttons',
    descriptionKo: '타이틀, 설명 및 하단 카테고리 필터 버튼',
    visualStructure: `
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [  BOLD TITLE  ]                     │
│               [ Small secondary description ]           │
│                                                         │
│             (Btn1)   (Btn2)   (Btn3)   (Btn4)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
`,
    specifications: {
      padding: '80px 0 30px',
      titleSize: '24px',
      buttonStyle: 'Pill shape',
      buttonGap: '12px'
    },
    promptTemplate: `
CONTENT SECTION HEADER - WITH CATEGORIES:
- Layout: Vertically stacked, centered alignment.
- Title & Description: Standard bold title (24px) over muted description (14px).
- Navigation: A row of "Pill-style" or "Chip" selection buttons centered at the bottom.
- Interaction: One button is in "Active" state (Brand color or High contrast), others are outline/subtle.
- Aesthetics: Professional e-commerce filter look, clean spacing, high-fidelity UI elements.
`,
    useCases: ['카테고리별 상품 필터링', '공지사항 카테고리']
  }
};
