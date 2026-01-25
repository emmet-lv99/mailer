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
│  │  └──────────────────────────────────────────────────┘   │
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
  },
  
  /**
   * STORY GRID - 인스타그램 스토리 스타일 그리드
   */
  'story-grid': {
    id: 'story-grid',
    name: 'Story Grid',
    nameKo: '스토리 그리드',
    category: 'video',
    description: 'Instagram story-style grid layout',
    descriptionKo: 'Instagram 스토리 스타일 그리드',
    
    promptTemplate: `
STORY GRID - INSTAGRAM STYLE GRID:
Grid: 1280px max-width, 6 columns, 2 rows, Gap 16px
Video Cards: 187px × 332px (9:16), 12px radius, Center 48px play button, Title below
`
  }
};

export const VIDEO_KEYWORD_ADAPTATIONS: Record<string, any> = {
  MODERN: { borderRadius: '12px', playButtonStyle: 'Sleek, minimal' },
  MINIMAL: { borderRadius: '2px', playButtonStyle: 'Simple, no shadow' },
  PLAYFUL: { borderRadius: '16px', playButtonStyle: 'Colorful, animated' },
  PROFESSIONAL: { borderRadius: '8px', playButtonStyle: 'Classic, solid' },
  LUXURY: { borderRadius: '0px', playButtonStyle: 'Elegant, refined' }
};
