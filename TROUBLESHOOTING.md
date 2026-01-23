# 🛠️ 트러블슈팅 보고서: 인스타그램 이미지 차단(CORP) 해결

## 1. 문제 상황 (Issue)
인스타그램 검색 기능 구현 중, 검색된 프로필 이미지 및 게시물 썸네일이 브라우저에서 로딩되지 않고 "엑스박스"로 표시되는 현상이 발생했습니다.

**에러 메시지 (Console):**
```
GET https://scontent-xyz.cdninstagram.com/... net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200 (OK)
```

---

## 2. 원인 분석 (Root Cause)

이 에러는 일반적인 **CORS(Cross-Origin Resource Sharing)** 문제가 아니라, 브라우저의 **CORP(Cross-Origin-Resource-Policy)** 보안 정책에 의해 차단된 것입니다.

*   **일반 CORS 에러**: 서버가 `Access-Control-Allow-Origin` 헤더를 안 줄 때 발생.
*   **이번 에러 (CORP)**: 인스타그램(Meta) CDN 서버가 응답 헤더에 명시적으로 다음을 포함하고 있습니다:
    ```http
    Cross-Origin-Resource-Policy: same-origin
    ```
    > **의미:** "이 이미지 리소스는 나와 **동일한 출처(Domain)**, 즉 `instagram.com` 또는 `facebook.com`에서만 로딩할 수 있다. 다른 사이트(`localhost:3000` 등)에서는 `<img src="...">`로도 가져가지 말라."

이는 핫링크(Hotlinking)를 방지하고 사용자의 리소스가 무단으로 다른 사이트에 임베딩되는 것을 막기 위한 Meta의 강력한 보안 조치입니다.

---

## 3. 시도했던 해결책들 (Attempts)

### 시도 1: `referrerPolicy="no-referrer"` 추가 (실패)
*   **아이디어**: 브라우저가 요청을 보낼 때 `Referer` 헤더(요청한 사이트 주소)를 숨기면, 서버가 어디서 왔는지 모르니까 허용해주지 않을까?
*   **결과**: **실패**.
*   **이유**: `referrerPolicy`는 요청 헤더(`Referer`)를 제어하는 것이지, 응답 헤더(`Cross-Origin-Resource-Policy`)를 무시하게 만들 수는 없습니다. 브라우저는 서버가 보낸 "금지(same-origin)" 딱지를 보고 스스로 차단해버립니다.

---

## 4. 최종 해결책 (Solution)

### ✅ 백엔드 프록시(Image Proxy) 구축

브라우저가 아닌 **서버(Next.js API Routes)**는 브라우저 보안 정책(CORP)의 제약을 받지 않는다는 점을 이용했습니다.

**아키텍처 변경:**
*   **전(Before)**: `Browser` ➡️ `Instagram CDN` (🚫 CORP 차단)
*   **후(After)**: `Browser` ➡️ `My Server (Proxy)` ➡️ `Instagram CDN` (✅ 성공)

### 구현 상세

**1. Proxy API (`src/app/api/image-proxy/route.ts`)**
백엔드에서 `fetch`로 이미지를 대신 받아온 뒤, 보안 헤더를 떼고 브라우저에게 전달합니다. 이때 인스타그램 서버를 속이기 위해 헤더를 위장합니다.
```typescript
const response = await fetch(url, {
  headers: {
    // 마치 크롬 브라우저에서 인스타그램 홈페이지를 보고 있는 것처럼 위장
    "User-Agent": "Mozilla/5.0 ... Chrome/120...",
    "Referer": "https://www.instagram.com/",
  },
});
```

**2. Frontend (`page.tsx`)**
이미지 URL을 프록시 주소로 감싸서 렌더링합니다.
```typescript
// 원본: https://scontent...
// 변경: /api/image-proxy?url=https://scontent...
<img src={`/api/image-proxy?url=${url}`} ... />
```

---

## 5. 결론 (Conclusion)

이 방식은 서버 대역폭을 일부 사용하지만, 서드파티(Instagram)의 강력한 보안 정책을 우회하여 서비스를 안정적으로 제공할 수 있는 **유일하고 확실한 방법**입니다.

*   **안정성**: 클라이언트 환경(브라우저 버전 등)에 구애받지 않음.
*   **확장성**: 추후 이미지 리사이징이나 캐싱 기능을 프록시에 추가하여 성능을 최적화할 수 있음.
