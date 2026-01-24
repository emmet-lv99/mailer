/**
 * 표준 디자인 키워드 사전 (Standard Design Keyword Dictionary) V1.0
 * YouTube 채널 분석 및 쇼핑몰 디자인 테마 매핑을 위한 표준 키워드 정의
 */

export const STANDARD_DESIGN_KEYWORDS = {
  // 1. 시각적 스타일 (Visual Style)
  VISUAL_STYLE: {
    RETRO: "1970-1980년대 빈티지 스타일 (Warm, muted tones)",
    MINIMAL: "최소한의 요소, 많은 여백, 단순함 (Monochrome, neutral)",
    VIBRANT: "밝고 강렬한 색상, 에너지 넘치는 (High saturation)",
    LUXURY: "고급스럽고 세련된, 프리미엄 (Gold, black, deep tones)",
    MODERN: "현대적이고 트렌디한, 최신 스타일 (Clean, bold, tech-inspired)",
    PLAYFUL: "재미있고 장난스러운, 귀여운 (Bright, friendly colors)",
    INDUSTRIAL: "공업적이고 거친, 원재료 느낌 (Gray, metal tones)",
    ORGANIC: "자연스럽고 유기적인, 친환경적 (Earth tones, green)",
    GEOMETRIC: "기하학적 패턴, 구조적이고 정돈된 (Symmetrical)",
    ARTISTIC: "예술적이고 창의적인, 표현적 (Unique, imaginative)",
  },
  // 2. 분위기/톤 (Mood/Tone)
  MOOD_TONE: {
    PROFESSIONAL: "전문적이고 신뢰할 수 있는 (Navy, gray, formal)",
    CASUAL: "편안하고 부담 없는, 일상적 (Approachable, relaxed)",
    FRIENDLY: "친근하고 따뜻한 (Warm, inviting colors)",
    ENERGETIC: "활기차고 역동적인 (High energy, bright)",
    CALM: "평온하고 차분한 (Soft, muted, cool tones)",
    BOLD: "대담하고 강렬한, 주목을 끄는 (High contrast)",
    ELEGANT: "우아하고 세련된, 품격 있는 (Refined, classy)",
    WARM: "따뜻하고 아늑한, 포근한 (Red, orange base)",
  },
  // 3. 복잡도 (Complexity)
  COMPLEXITY: {
    SIMPLE: "단순하고 이해하기 쉬운 (Limited palette)",
    DETAILED: "세밀하고 정교한 (Multiple layers, textures)",
    CLEAN: "깨끗하고 정돈된, 폴리시된 (Clear, uncluttered)",
    RICH: "풍부하고 다채로운, 레이어가 많은 (Deep, saturated)",
  }
} as const;

export type StandardDesignKeyword = 
  | keyof typeof STANDARD_DESIGN_KEYWORDS.VISUAL_STYLE 
  | keyof typeof STANDARD_DESIGN_KEYWORDS.MOOD_TONE 
  | keyof typeof STANDARD_DESIGN_KEYWORDS.COMPLEXITY;

export const ALL_STANDARD_KEYWORDS = [
  ...Object.keys(STANDARD_DESIGN_KEYWORDS.VISUAL_STYLE),
  ...Object.keys(STANDARD_DESIGN_KEYWORDS.MOOD_TONE),
  ...Object.keys(STANDARD_DESIGN_KEYWORDS.COMPLEXITY),
] as StandardDesignKeyword[];
