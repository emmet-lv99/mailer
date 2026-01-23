# 안목고수 메일러 트러블슈팅 가이드

이 문서는 개발 및 운영 중 발생했던 주요 이슈와 해결 방법을 정리합니다.

---

## 🔐 인증 관련

### 1. Gmail Draft 저장 시 500 에러 (Unauthorized)

**증상**: "Gmail 저장" 버튼 클릭 시 500 에러 발생

**원인**: Google Access Token 만료 또는 세션 문제

**해결**:
1. 로그아웃 후 다시 로그인 (토큰 갱신)
2. `src/types/next-auth.d.ts` 파일에서 타입 정의 확인
3. 개발자 콘솔에서 `session.accessToken` 존재 여부 확인

**관련 코드**: `/api/auth/[...nextauth]/route.ts`, `/api/gmail/draft/route.ts`

---

### 2. Google OAuth 리디렉션 에러

**증상**: 배포 환경에서 Google 로그인 실패

**원인**: 승인된 리디렉션 URI 미등록

**해결**:
1. [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 클라이언트 설정
2. 승인된 리디렉션 URI에 추가:
   - 로컬: `http://localhost:3000/api/auth/callback/google`
   - 배포: `https://your-domain.vercel.app/api/auth/callback/google`
3. 배포 환경변수 설정:
   - `NEXTAUTH_URL=https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET=랜덤_문자열`

---

## 🤖 AI 생성 관련

### 3. "Generation returned empty content" 에러

**증상**: 이메일 생성 시 빈 콘텐츠 반환

**원인**: AI가 subject/body가 비어있는 JSON 반환

**해결**:
- 재시도 로직 추가 (최대 3회)
- 빈 콘텐츠 감지 시 자동 재시도

**관련 코드**: `/api/process/route.ts` (236번 줄 부근)

---

### 4. "Bad control character in string literal in JSON" 에러

**증상**: JSON 파싱 실패

**원인**: AI 응답에 유효하지 않은 제어 문자 포함

**해결**:
```typescript
// 제어 문자 제거
text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

// JSON 블록 추출
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (jsonMatch) {
    text = jsonMatch[0];
}
```

---

## 🗄️ 데이터베이스 관련

### 5. Supabase 컬럼 누락 에러

**증상**: `Could not find the 'position' column of 'email_templates' in the schema cache`

**원인**: 코드에서 사용하는 컬럼이 DB에 없음

**해결**:
Supabase SQL Editor에서 실행:
```sql
ALTER TABLE email_templates ADD COLUMN position TEXT DEFAULT 'bottom';
```

---

## 🎨 UI 관련

### 6. 모달 너비가 적용되지 않음

**증상**: `max-w-[80vw]` 클래스가 무시됨

**원인**: Radix UI Dialog의 기본 스타일이 오버라이드됨

**해결**:
```tsx
<DialogContent className="sm:max-w-[80vw] w-[80vw] max-w-none">
```
- `max-w-none`으로 기본 제한 해제

---

### 7. 새로고침해도 UI 변경이 반영 안됨

**증상**: 코드 수정 후 브라우저에 반영 안됨

**원인**: 개발 서버 문제 또는 브라우저 캐시

**해결**:
1. 개발 서버 재시작:
   ```bash
   # 포트 3000 프로세스 종료 후 재시작
   lsof -ti:3000 | xargs kill -9; yarn dev
   ```
2. 강력 새로고침: `Cmd + Shift + R` (Mac)

---

## 📋 CSV 관련

### 8. CSV 업로드 시 한글 깨짐

**증상**: 한글 채널명이 깨져서 표시됨

**원인**: CSV 파일 인코딩 문제 (EUC-KR vs UTF-8)

**해결**:
- CSV 파일을 **UTF-8** 인코딩으로 저장
- Excel: 저장 시 "CSV UTF-8 (쉼표로 분리) (*.csv)" 선택

---

## 🔧 환경 설정 관련

### 9. YouTube API 키 인식 안됨

**증상**: 채널 정보 수집 실패

**원인**: 환경변수 이름 충돌 또는 미설정

**해결**:
`.env.local` 파일 확인:
```env
ANMOK_YOUTUBE_API_KEY=your_youtube_api_key
ANMOK_GEMINI_API_KEY=your_gemini_api_key
```
- `ANMOK_` 접두사 사용으로 환경변수 충돌 방지

---

## 📞 지원

문제가 지속되면 콘솔 로그를 확인하거나 개발자에게 문의하세요.
