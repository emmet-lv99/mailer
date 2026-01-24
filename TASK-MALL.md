# 🛍️ 몰 기획 기능 개발 가이드 (For Junior Dev)

자, 이제 **'유튜브 기반 커머스 몰 기획'** 기능을 본격적으로 만들어보자.
이 기능은 우리 서비스의 핵심(Killer Feature)이 될 거니까, 유지보수하기 좋게 코드를 아주 잘게 쪼개서 진행할 거야.
아래 순서대로 하나씩 도장 깨기 하듯이 진행해 줘. 화이팅! 💪

---

## 🏗️ Phase 1: 데이터 구조 잡기 (Backend & Types)
가장 먼저 데이터를 담을 그릇부터 튼튼하게 만들어야 해.

### [ ] Task 1-1. DB 테이블 생성 (Supabase)
이 SQL을 실행해서 테이블 2개를 만들어 줘.
- `mall_projects`: 프로젝트 하나의 큰 단위 (예: "슈카월드 쇼핑몰 기획")
- `mall_designs`: 그 안에서 생성된 디자인 시안들 (메인 시안 A, B, C...)

```sql
-- 1. 프로젝트 테이블
create table mall_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  youtube_channel_url text not null,
  competitor_channels text[], -- [NEW] 경쟁 채널 URL 리스트 (N개)
  channel_name text, -- 분석 후 저장
  
  -- 1. 마케팅 분석 (Marketing Strategy)
  marketing_analysis jsonb, 
  -- {
  --   "target": { "age": "20-30", "gender": "female", "interests": [...] },
  --   "persona": { "description": "합리적인 소비를 지향하는 사회초년생", "needs": [...] }
  -- }

  -- 2. 디자인 분석 (Design System Spec)
  design_analysis jsonb, 
  -- {
  --   "foundation": { "colors": {...}, "typography": {...}, "radius": "..." },
  --   "components": { "buttonStyle": "...", "cardStyle": "..." },
  --   "mood": { "keywords": [...], "imagery": "..." }
  -- }

  -- 3. 레퍼런스 분석 (Reference Style)
  reference_analysis jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 디자인 시안 테이블
create table mall_designs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references mall_projects on delete cascade not null,
  type text not null, -- 'MAIN' | 'LIST' | 'DETAIL'
  device_type text not null, -- 'PC' | 'MOBILE' [NEW]
  image_url text not null, -- 생성된 이미지 경로
  prompt_used text, -- 나중에 디버깅용으로 저장
  is_selected boolean default false, -- 유저가 선택한 시안인지
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### [ ] Task 1-2. 타입 정의 (`src/services/mall/types.ts`)
프론트에서 쓸 타입도 미리 정의해두자. **디자인 시스템 스펙**을 엄격하게 잡아야 해.

```typescript
// 1. Marketing Analysis Structure (Target & Persona)
export interface MarketingSpec {
  target: {
    ageRange: string; // '20-30대'
    gender: string; // '여성', '남성', '무관'
    interests: string[]; // ['홈카페', '감성 인테리어']
  };
  persona: {
    name: string; // '김철수'
    oneLiner: string; // '합리적인 소비를 지향하는 사회초년생'
    needs: string[]; // ['가성비', '빠른 배송']
    painPoints: string[]; // ['비싼 배송비', '실물과 다른 사진']
  };
  product: { // 무엇을 파는가? (디자인 레이아웃에 결정적)
    categories: string[]; // ['의류', '잡화', '디지털']
    priceRange: string; // '저가', '중저가', '프리미엄', '럭셔리'
    keyFeatures: string[]; // ['친환경 소재', '핸드메이드']
  };
  strategy: { // 어떻게 팔 것인가? (Brand Strategy)
    usp: string; // Unique Selling Proposition (차별화 포인트)
    mood: string; // 브랜드 보이스 (예: "친근한 옆집 언니 같은")
    
    // [Updated] 최신 브랜딩 프레임워크 (Modern Branding)
    brandArchetype: { // 12가지 브랜드 아키타입 (Visual Identity 도출용)
      primary: string; // 예: 'Creator' (창조가), 'Sage' (현자), 'Lover' (연인)
      secondary: string; // 서브 페르소나
      mixReason: string; // "전문적이지만(Sage) 친근한(Friend) 느낌"
    };
    
    storyBrand: { // 도널드 밀러의 StoryBrand 7 (Copywriting & Layout 용)
      hero: string; // 고객 정의 (주인공)
      problem: string; // 고객이 겪는 문제 (빌런)
      guide: string; // 브랜드의 역할 (가이드)
      plan: string; // 솔루션 3단계 (계획)
      success: string; // 사용 후의 변화 (성공)
    };

    competitors: { // 벤치마킹할 브랜드 Role Model
      name: string;
      reason: string; // "이 브랜드의 상세페이지 구성을 참고하세요"
    }[];
  };
  
  structure: { // [NEW] 정보 구조 (IA) 추천
    gnb: string[]; // ['New', 'Best', 'Outer', 'Top', 'Bottom', 'Acc']
    mainLayout: string[]; // ['Hero Banner', 'Best Sellers (Carousel)', 'Brand Story', 'New Arrivals (Grid)']
  };
}

// 2. Design Token Structure (Visual System)
export interface DesignSpec {
  // Concept & Tone
  concept: {
    keywords: string[];
    description: string;
  };
  
  // 1. 파운데이션 (Foundation)
  foundation: {
    colors: {
      primary: string; // 브랜드 메인 컬러
      secondary: string; // 포인트/강조 컬러
      background: { main: string; sub: string }; // 메인 배경, 서브 배경 (라이트/다크)
      text: { title: string; body: string; disabled: string }; // 제목용, 본문용, 비활성 텍스트 컬러
    };
    typography: {
      fontFamily: string; // 국문/영문 폰트 조합 (예: Pretendard + Outfit)
      scale: string; // H1~H6 사이즈 및 행간(Line-height)
      weightRule: string; // Regular, Bold 사용 규칙
    };
    shapeLayout: {
      borderRadius: string; // 버튼/카드의 둥굴기 (0px, 4px, 12px 등)
      spacing: string; // 여백 시스템 (Dense vs Airy)
      grid: string; // 몇 단 컬럼을 쓸 것인지 (반응형 기준)
    };
  };

  // 2. 컴포넌트 스타일 (Component Style)
  components: {
    buttons: string; // Solid, Outline, Ghost 버튼 스타일
    cards: string; // 상품 카드의 형태 (이미지 비율, 텍스트 배치, 그림자 유무)
    inputForm: string; // 입력창 디자인 (보더 스타일, 포커스 효과)
    gnbFooter: string; // 네비게이션 바와 푸터의 레이아웃 구조
  };

  // 3. 비주얼 앤 무드 (Visual & Mood)
  mood: {
    imagery: string; // 사진 톤앤매너 (채도, 대비, 필터값)
    graphicMotifs: string; // 장식 요소 (유기적 라인, 기하학 도형, 3D 오브젝트 등)
    iconography: string; // 아이콘 스타일 (Line vs Solid, 두께감)
  };
}

export interface MallProject {
  id: string;
  marketing_analysis: MarketingSpec; // [NEW] 마케팅 데이터
  design_analysis: DesignSpec;       // [RENAME] 디자인 데이터
  reference_analysis: DesignSpec;    // 레퍼런스는 디자인 관점만 분석
  // ... others
}
```

---

## 🎨 Phase 2: 기본 UI 뼈대 만들기 (Components)
화면이 보여야 개발할 맛이 나니까, 껍데기부터 예쁘게 잡아보자.

### [ ] Task 2-1. 단계별 스테퍼 (Stepper) 컴포넌트
우리는 총 3단계(분석 -> 레퍼런스 -> 제작)로 진행될 거야. 현재 진행 단계를 알려주는 컴포넌트를 만들자.
- 위치: `src/components/mall/creation/step-indicator.tsx`
- Props: `currentStep` (1, 2, 3)
- 디자인: 번호 동그라미랑 선으로 이어지는 그 디자인 알지? (shadcn/ui 참고해도 좋아)

### [ ] Task 2-2. 레이아웃 페이지 구성 (`page.tsx`)
**Unified Entry Point Architecture**: 하나의 페이지에서 신규 생성과 이어하기를 모두 처리한다.
- **URL**: `/youtube/mall` (New) vs `/youtube/mall?id=uuid` (Resume)
- **Logic**:
    - `searchParams.id`가 있으면: 서버 컴포넌트에서 DB 데이터(`mall_projects`) 조회 -> 초기 상태(`initialData`)로 주입 -> 저장된 Step으로 점프.
    - `searchParams.id`가 없으면: 빈 상태로 Step 1 시작.
- **상태 관리**: `const [step, setStep] = useState(initialStep);`
- **렌더링**:
  - Step 1: `<ChannelAnalysisStep />` (검색창 + 분석 결과 레포트)
  - Step 2: `<ReferenceStep />` (이미지 업로더 + 스타일 분석 레포트)
  - Step 3: `<DesignStep />` (메인/상세/리스트 순차 생성기)

---

## 🧠 Phase 3: 핵심 로직 구현 (Logic & API)
이제 진짜 머리 쓰는 작업이야. UI 흐름이 중요하니 잘 따라와.

### [ ] Task 3-1. Step 1: 채널 분석 (Analysis)
유튜브 채널을 분석하고, 그 결과를 레포트 형태로 보여주는 단계야.
- **UI 구성**:
    1.  **URL 입력창**: 내 유튜브 채널 주소 입력
    2.  **경쟁 채널 입력 (Optional)**: 벤치마킹하고 싶은 경쟁 채널 URL (N개 추가 가능)
    3.  **분석 버튼**: 클릭 시 API 호출 (내 채널 + 경쟁 채널 함께 분석)
    4.  **분석 결과 레포트 (Editable)**: 분석이 끝나면 하단에 노출.
        - 브랜드 키워드 (Tags Input)
        - 타겟 오디언스 (Textarea)
        - 추천 컬러 (Color Picker)
        - *AI 분석 결과가 마음에 안 들면 유저가 직접 수정할 수 있어야 해.*
    4.  **[다음] 버튼**: 레포트가 뜨면 활성화. 클릭 시 Step 2로 이동.

- **API**: `/api/youtube/mall/analyze`
- **Tip**: 분석 결과는 `mall_projects` 테이블에 바로 저장하지 말고, 일단 State로 들고 있다가 디자인 생성 직전에 저장하는 게 나을 수도 있어.

### [ ] Task 3-2. Step 2: 레퍼런스 (Reference)
유저가 원하는 느낌의 이미지를 올리고, AI가 그걸 해석하는 단계야.
- **UI 구성**:
    1.  **이미지 업로더**: Drag & Drop (여러 장 가능)
    2.  **분석 버튼**: "이 레퍼런스 분석하기"
    3.  **레퍼런스 분석 레포트 (Editable)**:
        - 디자인 스타일 (예: 미니멀, 레트로)
        - 주요 시각 요소
        - *역시 유저가 수정 가능해야 함.*
    4.  **[다음] 버튼**: 클릭 시 Step 3로 이동.

- **Logic**: 업로드된 이미지는 DB에 저장 안 함. Base64로 변환해서 Gemini Vision에게 넘겨주고 "이거 무슨 스타일이야?"라고 물어보는 프롬프트가 필요해.

### [ ] Task 3-3. Step 3: 시안 제작 (Design Generation)
제작 단계는 크게 **PC Ver**과 **Mobile Ver** 두 축으로 나뉘어 진행된다.

**Phase 3-A: PC UI Design (Primary)**
먼저 데스크탑(PC) 기준의 레이아웃을 잡는다.
1.  **Main PC (메인)**: 3장 생성 -> 1장 선택 (Pick).
2.  **Detail PC (상세)**: 선택된 Main 스타일을 계승하여 상세페이지 3장 생성 -> 1장 선택.
3.  **Product List PC (목록)**: 선택된 Main/Detail 스타일을 계승하여 목록페이지 3장 생성 -> 1장 선택.

**Phase 3-B: Mobile UI Design (Secondary)**
PC 디자인이 **모두 확정된 후**, 이를 모바일 화면비(Responsive)로 변환한다.
1.  **Main Mobile**: 확정된 Main PC를 모바일로 변환(3장) -> 선택.
2.  **Detail Mobile**: 확정된 Detail PC를 모바일로 변환(3장) -> 선택.
3.  **Product List Mobile**: 확정된 List PC를 모바일로 변환(3장) -> 선택.

**[Final View]**:
- 총 6장(PC 3종 + Mobile 3종)의 최종 컷을 한눈에 보여주고 프로젝트 완료.

**Logic**:
- **Consistency**: PC -> Mobile 변환 시에는 **Image-to-Image** 또는 **Refrence Image** 기능을 적극 활용해야 디자인 통일성을 해치지 않음.
- **Navigation (Back)**: 
    - 완료된 단계는 언제든지 클릭하여 **되돌아가기(Re-visit)** 가능.
    - *예: Detail 작업 중 Main을 수정하고 싶다면, Main 단계로 돌아가서 다시 선택 가능.*
    - 수정 시 이후 단계(Detail/List)는 초기화되거나 업데이트되어야 함.

---

## 🧹 Phase 4: 저장 및 이력 (Storage)
### [ ] Task 4-1. 프로젝트/디자인 저장
- **저장 시점**:
    1.  Step 1 완료 시: `mall_projects` 생성 (분석 내용 저장)
    2.  Step 3 각 단계 완료 시: 생성된 이미지 URL을 `mall_designs`에 저장.

### [ ] Task 4-2. 이력 페이지 개선
- 통합 리스트에서 '진행률'을 보여주면 더 좋겠지? (메인 완료 / 상세 완료 / 전체 완료)

---
**Senior's Tip 🍯**:
한 번에 다 하려고 하지 말고, **Task 1-1부터 Task 2-2 (UI 껍데기)**까지만 먼저 완성해 보자.
복잡한 AI API 연동은 화면이 나온 뒤에 붙여야 디버깅하기 훨씬 편해. 알겠지?
