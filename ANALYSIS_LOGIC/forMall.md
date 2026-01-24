# YouTube Channel Analysis Logic (for Commerce Mall)

본 문서는 `Anmok Mailer`의 쇼핑몰 기획 기능(`Mall Maker`)에서 유튜브 채널을 분석하는 로직을 기술합니다.
단순한 텍스트 분석을 넘어, 시각 정보(Thumbnail)와 여론(Comments)을 통합한 **멀티모달(Multi-modal) 분석**을 수행합니다.

## 1. Data Collection Scope (수집 데이터)

### A. Channel Metadata (기본 정보)
채널의 정체성을 파악하기 위한 가장 기초적인 메타데이터입니다.
- **Channel Title**: 채널명
- **Description**: 채널 설명 (Bio)
- **Keywords**: 채널 태그 (Branding Keywords)

### B. Recent Videos (최근 콘텐츠)
최근 업로드된 영상을 통해 트렌드와 주요 콘텐츠 소재를 파악합니다.
- **Count**: 최근 업로드 영상 **5~10개**
- **Data Points**:
    - 영상 제목 (Title)
    - 영상 설명 (Description Summary)

### C. Visual Context (시각 정보 분석) 🎨
브랜드의 **Design Concept**과 **Color Palette**를 도출하기 위해 Vision AI를 활용합니다.
- **Target**: 최근 영상 중 상위 **3개**의 고화질 썸네일
- **Method**: `Gemini Vision Pro` 모델에 이미지를 직접 주입하여 분석
- **Output**:
    - **Color**: 주요 사용 컬러 (Primary, Secondary, Background)
    - **Mood**: 이미지에서 느껴지는 분위기 (예: Retro, Minimal, B-Class)
    - **Font Style**: 썸네일 자막의 타이포그래피 스타일

### D. Audience Voice (여론 분석) 🗣️
구독자의 실제 니즈(Needs)와 페르소나를 도출하기 위해 댓글을 분석합니다.
- **Target**: 최근 영상 중 상위 **3개**의 베스트 댓글 (Relevance Order)
- **Count**: 영상당 상위 **5개** 댓글 (총 ~15개)
- **Insight**: 구독자들이 "재밌어하는 포인트", "원하는 굿즈", "불편해하는 점" 추출

---

## 2. Analysis Pipeline (분석 프로세스)

### Step 1: YouTube Data API Fetching
`src/lib/youtube.ts`를 통해 데이터를 병렬로 수집합니다.
1.  채널 ID 해상 (`@handle` 지원) 및 기본 정보 조회
2.  `Recent Uploads` 플레이리스트에서 최근 영상 리스트 조회
3.  주요 영상(Top 3)에 대해 `Comments` API와 `Thumbnail` 이미지 다운로드(Buffer) 병렬 수행

### Step 2: Context Construction
수집된 데이터를 AI가 이해하기 쉬운 구조로 조합합니다.
- **Text Context**: 채널 정보 + 영상 텍스트 + 댓글 모음
- **Visual Context**: 썸네일 이미지 (Base64 Encoded)

### Step 3: Generative AI Analysis (Gemini 2.0 Flash)
텍스트와 이미지를 동시에 프롬프트에 태워(`Multi-modal Prompting`) 최종 기획안을 도출합니다.

**[프롬프트 설계 전략]**
- **마케팅 전략 (Marketing)**: 댓글(Voice)과 설명(Text)을 기반으로 **Persona**와 **SWOT** 분석 수행.
- **디자인 전략 (Design)**: 썸네일(Visual)을 기반으로 브랜드 컬러와 UI 무드(Mood) 추출.
- **출력 제어**: JSON 포맷 강제 + 한국어 출력 강제 + camelCase 키 준수.

---

## 3. Output Data Structure (분석 결과물)

분석 결과는 `MallProjectAnalysis` 타입으로 반환되며 다음 정보를 포함합니다.

```typescript
interface MallProjectAnalysis {
  channelName: string;
  
  // 1. 마케팅 전략 (댓글/텍스트 기반)
  marketing: {
    target: { ageRange, gender, interests };
    persona: { name, oneLiner, needs, painPoints };
    strategy: { usp, mood, swot, brandArchetype, storyBrand };
    structure: { gnb, mainLayout }; // 쇼핑몰 IA 구조
  };

  // 2. 디자인 컨셉 (썸네일/비전 기반)
  design: {
    concept: { keywords, description };
    foundation: { colors, typography, shapeLayout };
    components: { buttons, cards, inputForm, gnbFooter }; // UI 컴포넌트 스타일
    mood: { imagery, graphicMotifs, iconography };
  };
}
```
