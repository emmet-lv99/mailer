
/**
 * IMAGE STYLE PRESETS
 * 
 * Purpose: Provide preset-based image style options for mockup generation
 * Categories: Product Photos, Hero Banners, Video Thumbnails
 */

export interface ImageStylePreset {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  imagenPrompt: string;
  bestFor: string[];
  bestForKo: string[];
  avoid: string[];
}

/**
 * PRODUCT PHOTO PRESETS (5 options)
 */
export const PRODUCT_PHOTO_PRESETS: Record<string, ImageStylePreset> = {
  
  'studio-clean': {
    id: 'studio-clean',
    name: 'Studio Clean',
    nameKo: '스튜디오 클린',
    description: 'Professional white background product photography',
    descriptionKo: '전문적인 흰 배경 제품 사진',
    
    bestFor: [
      'Supplements & health products',
      'Cosmetics & beauty',
      'Electronics',
      'General e-commerce',
      'Professional brands'
    ],
    bestForKo: [
      '건강기능식품',
      '화장품 & 뷰티',
      '전자제품',
      '종합 쇼핑몰',
      '전문 브랜드'
    ],
    
    avoid: [
      'Shadows on background',
      'Props or lifestyle elements',
      'Colored backgrounds',
      'Casual mood'
    ],
    
    imagenPrompt: `
Professional product photography on pure white background.

CRITICAL REQUIREMENTS:
- Background: Pure white (#FFFFFF), seamless, NO texture
- Lighting: Even studio lighting, soft and bright
- Shadows: Minimal product shadow only, NO background shadows
- Focus: Product centered, sharp details, professional quality

Product positioning:
- Centered in frame
- Straight-on view or slight 3/4 angle
- Fill 70-80% of frame
- Sharp focus, high detail

Style:
- Commercial product photography
- Clean, professional, trustworthy
- Cafe24 / Korean e-commerce standard
- NO lifestyle elements, NO props, NO people

Quality: High-resolution, commercial-grade photography
    `
  },
  
  'lifestyle-warm': {
    id: 'lifestyle-warm',
    name: 'Lifestyle Warm',
    nameKo: '라이프스타일 따뜻한',
    description: 'Warm lifestyle scene with product in context',
    descriptionKo: '제품이 사용되는 따뜻한 라이프스타일 장면',
    
    bestFor: [
      'Food & beverage',
      'Home goods',
      'Lifestyle products',
      'Casual brands',
      'Organic/natural products'
    ],
    bestForKo: [
      '식음료',
      '생활용품',
      '라이프스타일 제품',
      '캐주얼 브랜드',
      '유기농/천연 제품'
    ],
    
    avoid: [
      'Clinical white backgrounds',
      'Harsh lighting',
      'Isolated products',
      'Cold/sterile mood'
    ],
    
    imagenPrompt: `
Lifestyle product photography with warm, inviting ambiance.

Setting:
- Background: Natural home setting (wooden table, kitchen counter, cozy interior)
- Environment: Lived-in, authentic, relatable
- Context: Product in natural use scenario

Lighting:
- Natural window light, soft and warm
- Golden hour warmth (warm tones)
- No harsh shadows, gentle and inviting

Composition:
- Product as main subject but in context
- Natural perspective, realistic usage
- Minimal complementary props (plants, tableware, natural materials)

Mood & Colors:
- Warm, inviting, comfortable
- Warm color palette (browns, beiges, soft greens, creams)
- Cozy, lived-in feeling

Style: Lifestyle editorial, authentic, relatable
Quality: Professional but approachable, not overly staged
    `
  },
  
  'minimal-white': {
    id: 'minimal-white',
    name: 'Minimal White',
    nameKo: '미니멀 화이트',
    description: 'Ultra-minimal white on white aesthetic',
    descriptionKo: '초미니멀 화이트 온 화이트 미학',
    
    bestFor: [
      'Luxury brands',
      'Minimal/design-focused brands',
      'Premium products',
      'Modern aesthetic',
      'High-end cosmetics'
    ],
    bestForKo: [
      '럭셔리 브랜드',
      '디자인 중심 브랜드',
      '프리미엄 제품',
      '모던한 미학',
      '고급 화장품'
    ],
    
    avoid: [
      'Bright colors',
      'Busy backgrounds',
      'Multiple props',
      'Cluttered composition'
    ],
    
    imagenPrompt: `
Minimalist product photography, white on white aesthetic.

Background:
- Pure white with subtle gradient (light gray to white)
- OR white with minimal texture (very subtle)
- Clean, spacious, uncluttered

Lighting:
- Soft, diffused, ethereal
- No harsh shadows
- Gentle, barely-there product shadow for depth

Composition:
- Simple, clean, uncluttered
- Generous negative space (30-40% empty space)
- Product positioned with intention
- Asymmetrical balance (optional)

Mood:
- Calm, refined, spacious
- Sophisticated, elegant
- Peaceful, serene

Style:
- Minimal art direction
- Design-focused
- Less is more philosophy

Colors: White, off-white, very light grays only
Quality: High-end, refined, artistic
    `
  },
  
  'editorial-dark': {
    id: 'editorial-dark',
    name: 'Editorial Dark',
    nameKo: '에디토리얼 다크',
    description: 'Dramatic dark background with accent lighting',
    descriptionKo: '어두운 배경에 강조 조명',
    
    bestFor: [
      'Luxury products',
      'Premium brands',
      'Fashion & beauty',
      'Bold brands',
      'High-end electronics'
    ],
    bestForKo: [
      '럭셔리 제품',
      '프리미엄 브랜드',
      '패션 & 뷰티',
      '강렬한 브랜드',
      '고급 전자기기'
    ],
    
    avoid: [
      'Flat lighting',
      'Bright backgrounds',
      'Casual mood',
      'Budget products'
    ],
    
    imagenPrompt: `
Editorial product photography with dramatic dark background.

Background:
- Dark (black, deep navy, or charcoal)
- Solid or subtle gradient
- Rich, deep tones

Lighting:
- Dramatic spotlight or side lighting
- High contrast (bright product, dark background)
- Intentional shadows for depth and drama
- Accent lighting on product features

Composition:
- Dynamic, artistic
- Product prominently lit against dark background
- Strong visual contrast
- Bold, confident positioning

Mood:
- Premium, dramatic, sophisticated
- Bold, powerful, confident
- Luxurious, high-end

Style:
- Fashion editorial aesthetic
- Dramatic and artistic
- High-impact visual

Colors: Deep dark tones with product as bright accent
Quality: High-end commercial, fashion-level photography
    `
  },
  
  'natural-organic': {
    id: 'natural-organic',
    name: 'Natural Organic',
    nameKo: '내추럴 오가닉',
    description: 'Organic setting with natural elements',
    descriptionKo: '자연 요소가 있는 유기적 배경',
    
    bestFor: [
      'Organic products',
      'Natural/eco-friendly brands',
      'Handmade products',
      'Sustainable brands',
      'Artisanal goods'
    ],
    bestForKo: [
      '유기농 제품',
      '친환경 브랜드',
      '핸드메이드 제품',
      '지속가능한 브랜드',
      '장인정신 제품'
    ],
    
    avoid: [
      'Artificial materials',
      'Bright artificial lighting',
      'Perfectly symmetrical composition',
      'Synthetic props'
    ],
    
    imagenPrompt: `
Natural organic product photography with earthy, authentic feel.

Background:
- Natural materials (raw wood, stone, linen, cotton, clay)
- Visible natural textures
- Earthy, organic surfaces

Lighting:
- Soft natural daylight
- Gentle, diffused window light
- No artificial studio lighting

Composition:
- Organic, slightly asymmetrical
- Natural, unforced arrangement
- Imperfect, authentic

Props & Elements:
- Natural elements (leaves, branches, stones, flowers, herbs)
- Organic materials only
- Complementary, not distracting

Mood:
- Earthy, authentic, sustainable
- Natural, wholesome
- Artisanal, handcrafted feel

Colors:
- Earth tones (greens, browns, beiges, creams, terracotta)
- Natural, muted palette
- No bright synthetic colors

Texture: Prominent natural textures visible
Style: Artisanal, authentic, sustainable aesthetic
Quality: Professional but organic, not overly polished
    `
  }
};

/**
 * HERO BANNER PRESETS (10 options)
 */
export const HERO_BANNER_PRESETS: Record<string, ImageStylePreset> = {
  
  'product-focused': {
    id: 'product-focused',
    name: 'Product Focused',
    nameKo: '제품 중심',
    description: 'Clean product showcase on simple background',
    descriptionKo: '깔끔한 배경에 제품 중심 쇼케이스',
    
    bestFor: [
      'Product launches',
      'E-commerce hero sections',
      'Clear product messaging',
      'Professional brands'
    ],
    bestForKo: [
      '신제품 출시',
      '이커머스 히어로 섹션',
      '명확한 제품 메시지',
      '전문적인 브랜드'
    ],
    
    avoid: [
      'Lifestyle distractions',
      'Busy backgrounds',
      'Too much text space'
    ],
    
    imagenPrompt: `
Hero banner focused on product showcase (1280×600px, 16:9 ratio).

Main Subject:
- Product prominently displayed (e.g., supplement bottle, cosmetic jar)
- Product takes 60-70% of frame
- Clear, unobstructed view
- Sharp focus, high detail

Background:
- Clean solid color OR subtle gradient
- Use brand primary color or complementary neutral
- No patterns, textures, or distractions
- Professional studio look

Composition:
- Product positioned right-of-center (text space on left)
- OR left-of-center (text space on right)
- 30-40% negative space for text overlay
- Balanced, rule-of-thirds layout

Lighting:
- Professional studio lighting
- Even, bright, no harsh shadows
- Product clearly visible with all details
- Subtle drop shadow for depth (optional)

Additional Elements:
- Minimal product-related props (optional, very subtle)
- Clean, organized presentation
- No people, no lifestyle elements

Mood:
- Clean, professional, product-first
- Direct, clear, confident
- Commercial, polished, trustworthy

Colors: Brand colors + white/neutral
Style: E-commerce hero banner, Cafe24 standard
Quality: High-resolution commercial product photography
    `
  },
  
  'product-floating': {
    id: 'product-floating',
    name: 'Product Floating',
    nameKo: '제품 플로팅',
    description: 'Product floating with dynamic elements',
    descriptionKo: '역동적 요소와 함께 떠있는 제품',
    
    bestFor: [
      'Modern brands',
      'Tech products',
      'Innovative products',
      'Eye-catching hero'
    ],
    bestForKo: [
      '모던 브랜드',
      '테크 제품',
      '혁신적인 제품',
      '시선을 끄는 히어로'
    ],
    
    avoid: [
      'Traditional brands',
      'Conservative products',
      'Need for simplicity'
    ],
    
    imagenPrompt: `
Hero banner with floating product and dynamic elements (1280×600px, 16:9).

Main Subject:
- Product floating in center/center-right
- Appears weightless, suspended
- Multiple angles or exploded view (optional)

Dynamic Elements:
- Product ingredients/components floating around
- Geometric shapes, particles, or abstract elements
- Create motion and energy
- Examples: 
  * Food products: ingredients floating (fruits, grains)
  * Supplements: capsules, powder particles
  * Cosmetics: droplets, flowers, natural elements

Background:
- Solid color or gradient (brand color)
- Clean but dynamic
- Sense of depth and space

Composition:
- Product as central focus
- Floating elements create visual flow
- 30% space for text (left or right)
- Dynamic, energetic layout

Lighting:
- Bright, clean studio lighting
- Each element properly lit
- Subtle shadows for depth
- Highlight product and floating elements

Style:
- Modern, dynamic, energetic
- Commercial but creative
- Motion-implied, not static

Mood: Innovative, fresh, exciting, modern
Colors: Brand colors + complementary accents
Quality: High-end commercial with motion graphics feel
    `
  },
  
  'product-ingredients': {
    id: 'product-ingredients',
    name: 'Product with Ingredients',
    nameKo: '제품과 원재료',
    description: 'Product with fresh ingredients or materials',
    descriptionKo: '신선한 원재료와 함께 제품',
    
    bestFor: [
      'Food & beverage',
      'Natural/organic products',
      'Supplements',
      'Ingredient transparency'
    ],
    bestForKo: [
      '식음료',
      '천연/유기농 제품',
      '건강기능식품',
      '성분 투명성'
    ],
    
    avoid: [
      'Electronics',
      'Non-food products',
      'Minimal aesthetic'
    ],
    
    imagenPrompt: `
Hero banner with product and fresh ingredients (1280×600px, 16:9).

Main Subject:
- Product prominently displayed (center or right-of-center)
- Product size: 40-50% of frame

Ingredients/Materials:
- Fresh, natural ingredients arranged around product
- Examples:
  * Probiotic: yogurt, fruits, grains
  * Vitamin C: oranges, lemons, berries
  * Protein: nuts, seeds, natural sources
  * Cosmetics: botanical ingredients, flowers
- Ingredients look fresh, vibrant, appetizing

Background:
- Clean white or light neutral
- Minimal, non-distracting
- Professional food photography style

Composition:
- Product as main focus
- Ingredients arranged artfully around/below
- 30% space for text overlay (left side typically)
- Balanced, inviting layout

Lighting:
- Bright, natural-looking
- Highlight freshness of ingredients
- Even lighting, appetizing
- Soft shadows

Style:
- Food photography aesthetic
- Fresh, natural, wholesome
- Professional commercial

Mood: Fresh, natural, transparent, wholesome
Colors: Natural ingredient colors + white background
Quality: High-end food/product photography
    `
  },
  
  'lifestyle-person': {
    id: 'lifestyle-person',
    name: 'Lifestyle Person',
    nameKo: '라이프스타일 인물',
    description: 'Person enjoying product in natural setting',
    descriptionKo: '자연스러운 환경에서 제품을 즐기는 인물',
    
    bestFor: [
      'Lifestyle brands',
      'Food & beverage',
      'Wellness products',
      'Relatable brands',
      'Casual products'
    ],
    bestForKo: [
      '라이프스타일 브랜드',
      '식음료',
      '웰니스 제품',
      '공감가는 브랜드',
      '캐주얼 제품'
    ],
    
    avoid: [
      'Sterile environments',
      'Product-only focus needed',
      'Corporate/stiff mood'
    ],
    
    imagenPrompt: `
Hero banner with person enjoying product (1280×600px, 16:9).

Main Subject:
- Korean person (age appropriate to target demographic)
- Using or enjoying product naturally
- Product visible but not forced
- Realistic, relatable usage

Person:
- Natural, genuine expression (happy, content, satisfied)
- Authentic emotion, not overly posed
- Appropriate clothing (casual, everyday)
- Direct or natural eye direction

Setting:
- Lifestyle environment: home kitchen, living room, cafe, outdoors
- Natural, lived-in feel
- Clean but authentic
- Relevant to product use

Product Visibility:
- Product in hand, on table, or in use
- Clear but natural placement
- Not awkwardly displayed

Composition:
- Person: 50-60% of frame
- Product clearly visible
- 30-40% space for text overlay (left or right)
- Balanced, natural composition

Lighting:
- Natural window light or soft interior lighting
- Warm, inviting
- Flattering on person, clear on product
- No harsh shadows

Mood:
- Relatable, aspirational
- Warm, inviting, friendly
- Human-centered, authentic

Colors: Warm natural tones, home interior colors
Style: Lifestyle editorial, authentic lifestyle photography
Quality: Professional lifestyle photography, natural feel
    `
  },
  
  'lifestyle-table': {
    id: 'lifestyle-table',
    name: 'Lifestyle Table Scene',
    nameKo: '라이프스타일 테이블',
    description: 'Product on table with lifestyle elements',
    descriptionKo: '라이프스타일 요소와 함께 테이블 위 제품',
    
    bestFor: [
      'Food & beverage',
      'Supplements',
      'Home products',
      'Morning/daily routine products'
    ],
    bestForKo: [
      '식음료',
      '건강기능식품',
      '홈/리빙 제품',
      '데일리 루틴 제품'
    ],
    
    avoid: [
      'Tech products',
      'Fashion',
      'Need for people'
    ],
    
    imagenPrompt: `
Hero banner with product on table lifestyle scene (1280×600px, 16:9).

Main Subject:
- Product placed on table/surface
- Center or right-of-center position

Table Setting:
- Natural home table (wood, marble, etc.)
- Top-down or 45-degree angle
- Inviting, lived-in feel

Lifestyle Elements:
- Breakfast/coffee scene elements:
  * Coffee cup, pastry, newspaper
  * Fresh fruits, yogurt, granola
  * Morning light streaming in
- OR Daily routine elements:
  * Water glass, notebook, plants
  * Clean, organized workspace

Background:
- Soft focus background
- Home interior hints (window, wall)
- Natural, warm environment

Composition:
- Product as focal point (40-50% of frame)
- Lifestyle elements arranged artfully
- 30% space for text overlay
- Natural, organic arrangement

Lighting:
- Natural morning light (golden, warm)
- Window light creating soft shadows
- Bright, fresh, inviting
- Highlight product and scene

Props:
- Minimal, intentional
- Complement product use
- Natural materials (wood, ceramic, linen)

Mood:
- Morning freshness, daily ritual
- Inviting, aspirational
- Warm, comfortable, home

Colors: Warm naturals (browns, beiges, whites, soft greens)
Style: Lifestyle flat-lay or angled table scene
Quality: High-end lifestyle editorial photography
    `
  },
  
  'lifestyle-outdoor': {
    id: 'lifestyle-outdoor',
    name: 'Lifestyle Outdoor',
    nameKo: '라이프스타일 아웃도어',
    description: 'Product in outdoor/nature setting',
    descriptionKo: '야외/자연 환경의 제품',
    
    bestFor: [
      'Sports/fitness products',
      'Outdoor products',
      'Natural/organic brands',
      'Active lifestyle products'
    ],
    bestForKo: [
      '스포츠/피트니스 제품',
      '아웃도어 제품',
      '천연/유기농 브랜드',
      '활동적인 라이프스타일'
    ],
    
    avoid: [
      'Indoor products',
      'Formal/professional brands',
      'Luxury products'
    ],
    
    imagenPrompt: `
Hero banner with product in outdoor setting (1280×600px, 16:9).

Main Subject:
- Product in natural outdoor environment
- Person may be present (optional, in background or beside product)

Setting:
- Outdoor natural environment:
  * Park, forest, mountain
  * Beach, lake, river
  * Urban outdoor (rooftop, terrace)
  * Garden, green space
- Natural, authentic location

Product Placement:
- Product prominently displayed
- Natural placement in outdoor context
- Clear, visible, well-lit

Background:
- Natural outdoor scenery
- Soft focus (bokeh effect)
- Green, natural elements
- Sky, trees, or landscape

Composition:
- Product: 40-50% of frame
- Natural environment: 40-50%
- Space for text: 30% (left or right)
- Balanced, open, spacious

Lighting:
- Natural daylight
- Golden hour (warm, soft) preferred
- OR bright midday (energetic)
- No artificial lighting

Person (if present):
- Background or side, not main focus
- Active pose (running, hiking, yoga)
- OR relaxed (sitting, enjoying nature)

Mood:
- Active, fresh, natural
- Freedom, adventure
- Healthy, vibrant, energetic

Colors: Natural outdoor colors (greens, blues, earth tones)
Style: Outdoor lifestyle photography
Quality: Professional outdoor/adventure photography
    `
  },
  
  'minimal-text': {
    id: 'minimal-text',
    name: 'Minimal Text Focus',
    nameKo: '미니멀 텍스트 중심',
    description: 'Large text space with minimal visuals',
    descriptionKo: '미니멀 비주얼로 텍스트 공간 확보',
    
    bestFor: [
      'Text-heavy messages',
      'Minimal brands',
      'Announcements',
      'Typography-focused design'
    ],
    bestForKo: [
      '텍스트 중심 메시지',
      '미니멀 브랜드',
      '공지사항/안내',
      '타이포그래피 디자인'
    ],
    
    avoid: [
      'Product showcase needed',
      'Busy visuals',
      'Lifestyle content'
    ],
    
    imagenPrompt: `
Minimal hero banner with focus on text space (1280×600px, 16:9).

Visual Elements:
- Simple product silhouette (small, 10-20% of frame)
- OR minimal abstract shape/line
- OR subtle brand element
- Very minimal, non-competing with text

Background:
- Solid brand color OR
- Very subtle gradient (one color family)
- OR minimal geometric pattern (very subtle)
- Clean, spacious, modern

Composition:
- 70-80% negative space (for large text overlay)
- Product/visual element in corner or edge
- Asymmetrical, design-focused layout
- Generous whitespace

Colors:
- 1-2 colors maximum
- Brand color + white OR
- Monochromatic palette
- High contrast for text readability

Mood:
- Sophisticated, refined, modern
- Clean, spacious, minimal
- Design-focused, contemporary

Visual Priority:
- Text is hero (80%)
- Visual element supports (20%)

Style: Minimal design, Swiss design influence, modern
Quality: Clean, professional, design-focused
Purpose: Support bold typography and messaging
    `
  },
  
  'pattern-background': {
    id: 'pattern-background',
    name: 'Pattern Background',
    nameKo: '패턴 배경',
    description: 'Product with decorative pattern background',
    descriptionKo: '장식적 패턴 배경과 제품',
    
    bestFor: [
      'Playful brands',
      'Young target audience',
      'Fashion/lifestyle',
      'Creative brands'
    ],
    bestForKo: [
      '유쾌한 브랜드',
      '젊은 타겟층',
      '패션/라이프스타일',
      '크리에이티브 브랜드'
    ],
    
    avoid: [
      'Minimal brands',
      'Professional/serious products',
      'Luxury brands'
    ],
    
    imagenPrompt: `
Hero banner with product and pattern background (1280×600px, 16:9).

Main Subject:
- Product clearly displayed
- Product: 50-60% of frame
- Sharp focus on product

Background Pattern:
- Geometric patterns (circles, lines, shapes)
- OR Organic patterns (florals, nature motifs)
- OR Abstract artistic patterns
- Pattern should complement, not overwhelm
- 2-3 colors in pattern

Pattern Style Options:
- Geometric: Modern, clean shapes
- Memphis style: Playful 80s-inspired
- Botanical: Leaves, flowers, organic
- Abstract: Artistic, painterly

Composition:
- Product prominently centered or right
- Pattern as background layer
- 30% text space (left or right)
- Pattern fades or clears for text area

Colors:
- Brand colors + 1-2 accent colors
- Harmonious, intentional palette
- Pattern uses lighter/muted versions
- Product stands out against pattern

Depth:
- Product in foreground (sharp)
- Pattern in background (slightly blurred or faded)
- Clear visual hierarchy

Mood: Playful, creative, energetic, modern
Style: Contemporary graphic design, pattern design
Quality: Professional, well-designed, balanced
    `
  },
  
  'gradient-modern': {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    nameKo: '그라데이션 모던',
    description: 'Product with modern gradient background',
    descriptionKo: '모던 그라데이션 배경과 제품',
    
    bestFor: [
      'Tech products',
      'Modern brands',
      'Innovative products',
      'Contemporary aesthetic'
    ],
    bestForKo: [
      '테크 제품',
      '모던 브랜드',
      '혁신적인 제품',
      '현대적인 미학'
    ],
    
    avoid: [
      'Traditional brands',
      'Natural/organic products',
      'Conservative brands'
    ],
    
    imagenPrompt: `
Hero banner with product and modern gradient (1280×600px, 16:9).

Main Subject:
- Product prominently displayed
- Product: 50-60% of frame
- Clean, sharp product photography

Background Gradient:
- Modern, smooth gradient
- 2-3 color transition:
  * Brand primary → secondary
  * Brand color → complementary
  * Monochromatic (light → dark)
- Smooth, professional gradient (no banding)

Gradient Style Options:
- Linear gradient (diagonal, vertical, or radial)
- Soft, subtle transition
- OR bold, vibrant transition
- Modern, contemporary feel

Composition:
- Product center or right-of-center
- Gradient flows across entire background
- 30-40% text space
- Clean, modern layout

Lighting:
- Product well-lit, clear
- Gradient creates mood
- Professional studio lighting on product

Additional Elements (optional):
- Subtle geometric shapes on gradient
- Soft glow or light effects
- Very minimal, enhancing not distracting

Mood:
- Modern, sleek, contemporary
- Tech-forward, innovative
- Clean, professional, fresh

Colors:
- Brand colors in gradient
- Smooth color transitions
- Harmonious, professional palette

Style: Modern digital design, tech aesthetic
Quality: High-end, polished, contemporary
    `
  },
  
  'cinematic-video': {
    id: 'cinematic-video',
    name: 'Cinematic Scene',
    nameKo: '시네마틱 장면',
    description: 'Dynamic cinematic scene with motion feel',
    descriptionKo: '움직임이 느껴지는 역동적 시네마틱 장면',
    
    bestFor: [
      'Video-first brands',
      'Dynamic products',
      'Entertainment',
      'Youth brands',
      'Sports/action products'
    ],
    bestForKo: [
      '비디오 중심 브랜드',
      '역동적인 제품',
      '엔터테인먼트',
      '젊은 브랜드',
      '스포츠/액션 제품'
    ],
    
    avoid: [
      'Static product presentation',
      'Minimal aesthetic',
      'Calm/serene mood needed'
    ],
    
    imagenPrompt: `
Cinematic hero banner with dynamic feel (1280×600px, wide format).

Main Subject:
- Dynamic scene or action moment
- Product in motion or active use
- Person using product (optional)
- Motion implied, not static

Composition:
- Widescreen cinematic framing (21:9 feel even if 16:9)
- Dynamic angle (not straight-on)
- Strong foreground/background separation
- Depth, layers, dimension
- Leading lines creating motion

Lighting:
- Cinematic, dramatic
- High contrast OR moody lighting
- Intentional shadows and highlights
- Film-like quality
- Golden hour, blue hour, or dramatic indoor

Camera Angle:
- Dynamic perspective
- Low angle, high angle, or Dutch tilt
- Not eye-level static shot
- Creates visual interest and energy

Motion Elements:
- Implied motion (blur, angle, composition)
- Action frozen at peak moment
- OR slight motion blur (intentional)
- Dynamic, energetic feeling

Depth of Field:
- Foreground sharp, background blurred
- OR selective focus
- Cinematic bokeh

Mood:
- Epic, engaging, exciting
- Motion-implied, dynamic
- Cinematic, story-driven

Visual Quality:
- Film-like color grading
- Cinematic aspect and feel
- High production value
- Professional cinematography aesthetic

Style: Film-still aesthetic, movie poster feel
Quality: Cinematic, film-level production
Purpose: Grab attention, create excitement, tell story
    `
  }
};

/**
 * VIDEO THUMBNAIL PRESETS (4 options - all 9:16 vertical)
 */
export const VIDEO_THUMBNAIL_PRESETS: Record<string, ImageStylePreset> = {
  
  'review-authentic': {
    id: 'review-authentic',
    name: 'Review Authentic',
    nameKo: '리뷰 진짜',
    description: 'Authentic user review style thumbnail',
    descriptionKo: '진짜 사용자 리뷰 스타일 썸네일',
    
    bestFor: [
      'Product reviews',
      'User testimonials',
      'Honest opinions',
      'Relatable content'
    ],
    bestForKo: [
      '제품 리뷰',
      '사용자 후기',
      '솔직한 의견',
      '공감가는 콘텐츠'
    ],
    
    avoid: [
      'Overly professional',
      'Scripted feel',
      'Studio settings'
    ],
    
    imagenPrompt: `
Authentic product review video thumbnail (200×355px, 9:16 vertical portrait).

Person:
- Korean individual (age appropriate to product)
- Casual, friendly expression
- Natural, genuine smile
- Direct eye contact with camera

Action:
- Holding product in hand
- Showing product to camera
- Casual presentation (not stiff)

Setting:
- Home environment (living room, bedroom)
- Natural, lived-in background (slightly blurred)
- Casual, relatable

Lighting:
- Bright natural window light
- Soft, flattering
- No harsh shadows on face

Angle:
- Slightly looking up (selfie-style angle)
- Vertical 9:16 format (portrait)
- Medium shot (chest up)

Mood:
- Genuine, trustworthy, relatable
- Friendly, approachable
- Authentic, real person feel

Style:
- User-generated content aesthetic
- Not overly polished
- YouTube Shorts / Instagram Reels style

Clothing: Casual, everyday wear
Quality: Good but authentic, not overly produced
    `
  },
  
  'tutorial-professional': {
    id: 'tutorial-professional',
    name: 'Tutorial Professional',
    nameKo: '튜토리얼 전문',
    description: 'Professional how-to tutorial style',
    descriptionKo: '전문적인 사용법 튜토리얼 스타일',
    
    bestFor: [
      'How-to content',
      'Product tutorials',
      'Educational videos',
      'Professional reviews'
    ],
    bestForKo: [
      '사용법 안내',
      '제품 튜토리얼',
      '교육 영상',
      '전문적인 리뷰'
    ],
    
    avoid: [
      'Too casual',
      'Messy background',
      'Poor lighting'
    ],
    
    imagenPrompt: `
Professional tutorial video thumbnail (200×355px, 9:16 vertical portrait).

Person:
- Expert or professional appearance
- Confident, clear expression
- Focused, instructional demeanor

Action:
- Demonstrating product use
- Hands visible, showing process
- Clear, instructional pose

Setting:
- Clean studio OR organized workspace
- Neat background (solid or minimal)
- Professional environment

Lighting:
- Professional, bright, even
- Well-lit face and product
- Clear visibility of product details

Angle:
- Straight-on or high angle for clarity
- Vertical 9:16 format (portrait)
- Medium to full shot depending on tutorial

Mood:
- Informative, clear, professional
- Educational, helpful
- Confident, expert

Style:
- Educational content aesthetic
- Professional YouTube tutorial style
- Clean, organized, clear

Clothing: Professional or smart casual
Quality: High production value, professional
    `
  },
  
  'unboxing-excited': {
    id: 'unboxing-excited',
    name: 'Unboxing Excited',
    nameKo: '언박싱 신남',
    description: 'Excited first impression unboxing',
    descriptionKo: '신나는 첫인상 언박싱 순간',
    
    bestFor: [
      'Unboxing videos',
      'First impressions',
      'Product reveals',
      'Excitement content'
    ],
    bestForKo: [
      '언박싱 영상',
      '첫인상',
      '제품 공개',
      '기대감 조성 콘텐츠'
    ],
    
    avoid: [
      'Calm/boring expression',
      'No product visible',
      'Low energy'
    ],
    
    imagenPrompt: `
Excited unboxing video thumbnail (200×355px, 9:16 vertical portrait).

Person:
- Excited, surprised expression
- Wide eyes, big smile
- Genuine enthusiasm

Action:
- Opening product box
- First impression moment
- Product or packaging visible

Props:
- Product box/packaging prominent
- Unboxing in progress
- New product reveal

Setting:
- Clean background
- Focus on unboxing moment
- Minimal distractions

Lighting:
- Bright, energetic
- Clear product visibility
- Well-lit excited expression

Angle:
- Slight high angle (looking at product and camera)
- Vertical 9:16 portrait
- Close to medium shot

Mood:
- Exciting, fun, enthusiastic
- First-time experience energy
- Positive, upbeat

Colors:
- Vibrant, eye-catching
- Product packaging colors visible

Style:
- Unboxing video aesthetic
- High energy, engaging
- YouTube/TikTok unboxing style

Quality: Professional but energetic, not overly posed
    `
  },
  
  'testimonial-calm': {
    id: 'testimonial-calm',
    name: 'Testimonial Calm',
    nameKo: '후기 차분한',
    description: 'Sincere calm testimonial style',
    descriptionKo: '진솔하고 차분한 후기 스타일',
    
    bestFor: [
      'Customer testimonials',
      'Personal recommendations',
      'Sincere reviews',
      'Trust-building content'
    ],
    bestForKo: [
      '고객 추천사',
      '개인적인 추천',
      '진정성 있는 리뷰',
      '신뢰 구축 콘텐츠'
    ],
    
    avoid: [
      'Over-excitement',
      'Distracting background',
      'Inauthentic feel'
    ],
    
    imagenPrompt: `
Calm testimonial video thumbnail (200×355px, 9:16 vertical portrait).

Person:
- Sincere, genuine expression
- Direct eye contact with camera
- Calm, confident demeanor
- Slight smile (warm but not overly excited)

Action:
- Speaking to camera
- Calm and measured
- Thoughtful, personal recommendation

Setting:
- Soft, blurred background (home or office)
- Neutral, non-distracting
- Clean, professional

Lighting:
- Soft, flattering window light
- Even, natural
- Professional but gentle

Angle:
- Direct eye-level or slightly above
- Vertical 9:16 portrait
- Medium close-up (chest to head)

Mood:
- Sincere, trustworthy, calm
- Personal, genuine
- Thoughtful, considered

Style:
- Testimonial aesthetic
- Professional but personal
- Trust-building

Clothing: Clean, presentable, appropriate
Expression: Sincere, honest, warm
Quality: Professional, clean, trustworthy feel
    `
  }
};

/**
 * Default presets by keywords
 */
export function getDefaultPresetsByKeywords(keywords: string[]): {
  productPhotos: string;
  heroBanner: string;
  videoThumbnails: string;
} {
  
  // Product Photos default
  let productPhotos = 'studio-clean'; // default
  if (keywords.includes('LUXURY') || keywords.includes('MINIMAL')) {
    productPhotos = 'minimal-white';
  } else if (keywords.includes('ORGANIC') || keywords.includes('NATURAL')) {
    productPhotos = 'natural-organic';
  } else if (keywords.includes('CASUAL') || keywords.includes('FRIENDLY') || keywords.includes('WARM')) {
    productPhotos = 'lifestyle-warm';
  } else if (keywords.includes('BOLD') || keywords.includes('DRAMATIC')) {
    productPhotos = 'editorial-dark';
  }
  
  // Hero Banner default
  let heroBanner = 'product-focused'; // default
  if (keywords.includes('MINIMAL') || keywords.includes('CLEAN')) {
    heroBanner = 'minimal-text';
  } else if (keywords.includes('CASUAL') || keywords.includes('FRIENDLY') || keywords.includes('WARM')) {
    heroBanner = 'lifestyle-scene'; // Note: lifestyle-scene might be replaced by lifestyle-person
  } else if (keywords.includes('ENERGETIC') || keywords.includes('VIBRANT')) {
    heroBanner = 'cinematic-video';
  }
  
  // Video Thumbnails default
  let videoThumbnails = 'review-authentic'; // default
  if (keywords.includes('PROFESSIONAL') || keywords.includes('DETAILED')) {
    videoThumbnails = 'tutorial-professional';
  } else if (keywords.includes('ENERGETIC') || keywords.includes('PLAYFUL')) {
    videoThumbnails = 'unboxing-excited';
  } else if (keywords.includes('CALM') || keywords.includes('ELEGANT')) {
    videoThumbnails = 'testimonial-calm';
  }
  
  return {
    productPhotos,
    heroBanner,
    videoThumbnails
  };
}

/**
 * Get preset by ID
 */
export function getProductPhotoPreset(presetId: string): ImageStylePreset {
  return PRODUCT_PHOTO_PRESETS[presetId] || PRODUCT_PHOTO_PRESETS['studio-clean'];
}

export function getHeroBannerPreset(presetId: string): ImageStylePreset {
  return HERO_BANNER_PRESETS[presetId] || HERO_BANNER_PRESETS['product-focused'];
}

export function getVideoThumbnailPreset(presetId: string): ImageStylePreset {
  return VIDEO_THUMBNAIL_PRESETS[presetId] || VIDEO_THUMBNAIL_PRESETS['review-authentic'];
}

/**
 * Generate Imagen prompt with preset + context
 */
export function generateImagenPromptWithPreset(
  presetId: string,
  presetType: 'productPhotos' | 'heroBanner' | 'videoThumbnails',
  context: {
    productName?: string;
    brandKeywords?: string[];
    brandColors?: { primary: string; secondary: string };
    additionalInstructions?: string;
  }
): string {
  
  let preset: ImageStylePreset;
  
  switch (presetType) {
    case 'productPhotos':
      preset = getProductPhotoPreset(presetId);
      break;
    case 'heroBanner':
      preset = getHeroBannerPreset(presetId);
      break;
    case 'videoThumbnails':
      preset = getVideoThumbnailPreset(presetId);
      break;
  }
  
  let prompt = preset.imagenPrompt;
  
  // Add context
  if (context.productName) {
    prompt += `\n\nProduct: ${context.productName}`;
  }
  
  if (context.brandKeywords && context.brandKeywords.length > 0) {
    prompt += `\nBrand Keywords: ${context.brandKeywords.join(', ')}`;
  }
  
  if (context.brandColors) {
    prompt += `\nBrand Colors: Primary ${context.brandColors.primary}, Secondary ${context.brandColors.secondary}`;
  }
  
  if (context.additionalInstructions) {
    prompt += `\n\nAdditional Instructions:\n${context.additionalInstructions}`;
  }
  
  return prompt;
}
