# 안목 매일러(Anmok Mailer) 리팩토링 스터디 가이드

지금까지 우리는 **"비용 효율적인 검색 시스템"**과 **"사용자 친화적인 UI(UX)"**를 구축했습니다. 이 과정에서 사용된 핵심 기술과 패턴을 이해하기 위해, 코드를 단순히 읽는 것보다는 **핵심 로직을 작은 단위로 떼어내어 직접 구현해보는(Mini Project)** 방식을 추천합니다.

## 1. 핵심 기술 스택 & 해결 전략 (Core Tech & Solutions)

프로젝트에 사용된 주요 기술과 난관을 해결한 방법입니다.

### 🌐 CORS (Cross-Origin Resource Sharing) 이슈 해결
- **문제:** 브라우저(프론트)에서 직접 Instagram이나 Apify API를 호출하면 CORS 보안 정책에 막힙니다.
- **해결:** **Next.js API Route (`/api/...`)를 Proxy로 사용**했습니다.
    - 브라우저 → Next.js 서버 (동일 출처, CORS 문제 없음)
    - Next.js 서버 → 외부 API (Server-to-Server 통신은 CORS 제약 없음)
    - *참고 코드: `src/app/api/instagram/search/route.ts`*

### 🦜 LangChain & AI
- **사용:** `@langchain/google-genai` (Google Gemini)
- **목적:** AI에게 "분석"을 맡길 때 **정해진 포맷(JSON)으로 답변을 강제**하기 위함입니다.
- **패턴:** `PromptTemplate`을 사용하여 문맥을 주입하고, `StructuredOutputParser` 등을 개념적으로 적용하여 AI가 딴소리를 하지 않고 정확한 필드(`engagement`, `commercial_score`)를 뱉도록 설계했습니다.

### 🛡️ Supabase RLS & Admin Bypass
- **문제:** `DB 조회 우선` 기능을 만들 때, 일반 사용자는 다른 사람의 분석 데이터를 함부로 조회하면 안 될 수도 있다는 기본 보안 정책(RLS)이 켜져 있었습니다.
- **해결:** 서버 사이드에서 로직을 수행할 때는 **`supabaseAdmin` (Service Role Key)**을 사용하여 권한을 우회(Bypass)하고, **"이미 분석된 데이터가 있는가?"**라는 사실 확인 용도로만 데이터를 가져왔습니다.
    - *참고 코드: `src/lib/supabase.ts`, `api/instagram/history/route.ts`*

### 🔐 NextAuth.js & Google Login (보안)
- **사용:** `next-auth` + `GoogleProvider`
- **목적:** 아무나 관리자 페이지에 들어오지 못하게 막고, Gmail API 권한을 획득하기 위함입니다.
- **패턴 파훼법:** 
    - `signIn()` 콜백 함수에서 `supabaseAdmin`을 사용해 `allowed_users` 테이블을 조회합니다.
    - 허용된 이메일이 아니면(`!data`) 즉시 로그인을 차단(`return false`)합니다.
    - *참고 코드: `src/app/api/auth/[...nextauth]/route.ts`*

### 🧪 실전적 TDD (Verification Scripts)
- **방식:** 거창한 테스트 프레임워크(Jest) 대신, **"검증 스크립트(Script-First)"** 방식을 사용했습니다.
- **이유:** Next.js 전체를 실행하고 버튼을 눌러 테스트(E2E)하는 것은 너무 느립니다. 로직만 떼어내어 검증하는 것이 훨씬 빠릅니다.
- **실제 사례:** 
    - `scripts/check-models.ts`: Gemini 모델이 살아있는지 0.5초 만에 확인
    - `scripts/test-db-lookup.js`: RLS가 적용된 DB 조회가 잘 되는지 터미널에서 즉시 확인
- **교훈:** "UI를 만들기 전에 데이터부터 검증하라." 이것이 우리가 실천한 실전 압축 TDD입니다.

### 🐻 Zustand 상태 관리
- **사용:** 전역 상태 관리 라이브러리
- **목적:** 검색한 결과(`results`)를 `page.tsx`, `UserCard`, `Modal` 등 여러 곳에서 공유해야 하는데, Props Drilling(부모→자식→손자...)이 너무 복잡해지는 것을 막기 위함입니다.
- **장점:** Redux보다 훨씬 가볍고 보일러플레이트 코드가 적습니다.

---

## 2. 학습 로드맵 (Learning Roadmap)

### 1단계: 데이터 흐름 이해하기 (Backend)
가장 중요한 변화는 **"DB 우선 확인(Cache-First)"** 로직입니다.
- **핵심 파일:** `src/app/api/instagram/search/route.ts`
- **학습 포인트:**
    1. 요청 받기 (`req.json()`)
    2. **DB 조회:** 이미 데이터가 있는가? (`supabaseAdmin` 사용)
    3. **분기 처리:** 
        - 있다 → DB 데이터 반환 (빠름/무료)
        - 없다 → 외부 API(Apify) 호출 후 DB 저장 (느림/유료)
    4. **RLS 우회:** 왜 `supabase` 대신 `supabaseAdmin`을 써야 하는가?

### 2단계: 클라이언트 상태 관리 (Frontend)
복잡해진 UI 상태를 어떻게 관리했는지 살펴봅니다.
- **핵심 파일:** `src/app/instagram/search/page.tsx`, `InstagramUserCard.tsx`
- **학습 포인트:**
    1. **Zustand Store:** `useInstagramStore`를 통해 검색어, 결과를 전역에서 관리하는 이유.
    2. **Local State:** 모달의 열림/닫힘(`useState`)과 리스트 내 개별 아이템 상태 관리.
    3. **Effect Hook:** `useEffect`를 사용해 "데이터가 있으면 자동으로 모달 열기" 구현.

---

## 3. 추천 미니 프로젝트 (Mini Projects)

이 프로젝트들을 순서대로 만들어보며 원리를 익혀보세요.

### 🐣 프로젝트 1: "나만의 캐싱 API 만들기"
외부 API(예: 날씨, 주식 정보)를 조회하되, **한 번 조회한 데이터는 DB에 저장**하고 5분 동안은 DB에서 꺼내주는 API를 만들어보세요.
- **목표:** `Cache-First Strategy` 완벽 이해
- **준비물:** Next.js API Route, Supabase, 아무 무료 Open API
- **검증:** 첫 번째 요청은 느리고(API 호출), 두 번째 요청은 빨라야 함(DB 조회).

### 🐣 프로젝트 2: "관리자 전용 데이터 조회기"
Supabase에서 **RLS(Row Level Security)**를 켜서 일반 조회는 막고, **Service Role Key**를 사용한 API에서만 데이터를 가져오는 것을 실습해보세요.
- **목표:** `supabase` vs `supabaseAdmin` 차이와 보안 모델 이해
- **실습:**
    1. 테이블 생성 및 RLS로 `SELECT` 차단.
    2. 클라이언트에서 조회 시도 → 실패 확인.
    3. API Route에서 `supabaseAdmin`으로 조회 → 성공 확인.

### 🐣 프로젝트 3: "조건부 자동 팝업 UI"
리스트에 아이템 3개를 뿌리고, 그 중 하나에만 `isSpecial: true` 속성을 줍니다. 페이지가 로드되자마자 `isSpecial`인 아이템의 상세 모달을 자동으로 띄워보세요.
- **목표:** `useEffect`, `useState`, 컴포넌트 간 Props 전달 이해
- **실습:** `useEffect` 의존성 배열(`dependency array`)을 잘못 설정하면 모달이 무한으로 꺼졌다 켜지는 현상을 경험해보는 것이 공부가 됩니다.

---

## 4. 코드 리뷰 가이드 (Code Review Checklist)

코드를 다시 훑어보실 때 다음 질문을 던지며 보시면 좋습니다.

- **`search/route.ts`**:
    - "여기서 `try-catch`가 없었다면 API 에러 났을 때 프론트엔드는 어떻게 될까?"
    - "`Promise.all` 대신 순차적으로 실행한 이유는 무엇일까?" (힌트: 비용 절감 vs 속도)

- **`InstagramUserCard.tsx`**:
    - "`onRefresh` 함수는 왜 카드 내부가 아니라 부모(`page.tsx`)에서 주입받을까?" (힌트: 비즈니스 로직 분리)
    - "`e.stopPropagation()`이 없으면 버튼 클릭 시 어떤 일이 벌어질까?"

## 결론
가장 좋은 방법은 **"작고 소중한 실패"**를 겪어보는 것입니다. 위 미니 프로젝트 중 **프로젝트 1번(캐싱 API)**을 먼저 시도해보시는 것을 강력 추천합니다! 백엔드 비용 절감의 핵심 원리이기 때문입니다. 화이팅입니다! 🚀
