# 소셜 로그인 구현 계획서

## 1. 현재 상태 분석

### 이미 구현된 부분

| 항목 | 상태 | 파일 |
|------|------|------|
| NextAuth.js v5 설정 | 완료 | `src/lib/auth.ts` |
| Kakao/Naver/Google Provider 등록 | 완료 | `src/lib/auth.ts` |
| Prisma Adapter (DB 세션) | 완료 | `src/lib/auth.ts` |
| DB 스키마 (User, Account, Session) | 완료 | `prisma/schema.prisma` |
| 로그인 페이지 UI | 완료 | `src/app/[locale]/login/page.tsx` |
| SessionProvider 래핑 | 완료 | `src/components/auth/SessionProvider.tsx` |
| 미들웨어 (보호 라우트) | 완료 | `middleware.ts` |
| 유저 메뉴 (로그아웃 포함) | 완료 | `src/components/auth/UserMenu.tsx` |

### 미완료 / 검증 필요 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| OAuth 앱 등록 (각 플랫폼) | 미확인 | 개발자 콘솔에서 앱 등록 필요 |
| 환경변수 설정 | 미확인 | `.env.local`에 Client ID/Secret 설정 필요 |
| 콜백 URL 등록 | 미확인 | 각 플랫폼에 redirect URI 등록 필요 |
| 계정 연동 (Account Linking) | 미구현 | 동일 이메일 다른 프로바이더 처리 |
| 에러 핸들링 | 미구현 | OAuth 실패/취소 시 UX |
| 로그인 후 리다이렉트 | 부분 구현 | callbackUrl 고정값("/") |
| NEXTAUTH_SECRET 설정 | 미확인 | 프로덕션 필수 |
| 프로덕션 도메인 설정 | 미확인 | NEXTAUTH_URL 환경변수 |

---

## 2. 아키텍처 개요

```
[사용자 브라우저]
       |
       | 1. "카카오로 로그인" 클릭
       v
[Next.js Frontend]
       |
       | 2. signIn("kakao") -> NextAuth
       v
[NextAuth.js v5]
       |
       | 3. OAuth Authorization Request
       v
[카카오/네이버/구글 OAuth Server]
       |
       | 4. 사용자 인증 + 동의
       | 5. Authorization Code 발급
       v
[NextAuth.js Callback]
       |
       | 6. Code -> Access Token 교환
       | 7. 사용자 프로필 조회
       v
[Prisma Adapter]
       |
       | 8. User/Account 생성 또는 조회
       | 9. Session 생성 (DB)
       v
[PostgreSQL]
       |
       | 10. 세션 토큰 쿠키로 반환
       v
[사용자 브라우저] -> 로그인 완료
```

---

## 3. OAuth 앱 등록 가이드

### 3.1 카카오 (Kakao)

**개발자 콘솔:** https://developers.kakao.com

1. 애플리케이션 생성
2. **플랫폼 > Web** 사이트 도메인 등록
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-domain.com`
3. **카카오 로그인 > 활성화** 설정 ON
4. **카카오 로그인 > Redirect URI** 등록
   - `http://localhost:3000/api/auth/callback/kakao`
   - `https://your-domain.com/api/auth/callback/kakao`
5. **카카오 로그인 > 동의항목** 설정
   - 닉네임: 필수
   - 프로필 사진: 선택
   - 이메일: 선택 (권장: 필수)
6. **앱 키** 확인
   - REST API 키 -> `KAKAO_CLIENT_ID`
   - 보안 > Client Secret 생성 -> `KAKAO_CLIENT_SECRET`

### 3.2 네이버 (Naver)

**개발자 콘솔:** https://developers.naver.com

1. 애플리케이션 등록 (네이버 로그인)
2. **사용 API:** 네이버 로그인
3. **제공 정보:** 이름, 이메일, 프로필 사진
4. **환경:** PC웹
5. **서비스 URL:**
   - `http://localhost:3000`
6. **Callback URL:**
   - `http://localhost:3000/api/auth/callback/naver`
   - `https://your-domain.com/api/auth/callback/naver`
7. **애플리케이션 정보**
   - Client ID -> `NAVER_CLIENT_ID`
   - Client Secret -> `NAVER_CLIENT_SECRET`

### 3.3 구글 (Google)

**개발자 콘솔:** https://console.cloud.google.com

1. 프로젝트 생성 또는 선택
2. **APIs & Services > OAuth 동의 화면** 설정
   - 앱 이름, 사용자 지원 이메일 등록
   - 범위: `email`, `profile`, `openid`
3. **APIs & Services > 사용자 인증 정보 > OAuth 2.0 클라이언트 ID** 생성
   - 유형: 웹 애플리케이션
   - 승인된 JavaScript 출처:
     - `http://localhost:3000`
     - `https://your-domain.com`
   - 승인된 리다이렉션 URI:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.com/api/auth/callback/google`
4. **클라이언트 ID / 시크릿 확인**
   - Client ID -> `GOOGLE_CLIENT_ID`
   - Client Secret -> `GOOGLE_CLIENT_SECRET`

---

## 4. 환경변수 설정

### `.env.local` (개발 환경)

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32 로 생성>
AUTH_SECRET=<NEXTAUTH_SECRET과 동일값 - Auth.js v5용>

# 카카오
KAKAO_CLIENT_ID=<카카오 REST API 키>
KAKAO_CLIENT_SECRET=<카카오 Client Secret>

# 네이버
NAVER_CLIENT_ID=<네이버 Client ID>
NAVER_CLIENT_SECRET=<네이버 Client Secret>

# 구글
GOOGLE_CLIENT_ID=<구글 OAuth Client ID>
GOOGLE_CLIENT_SECRET=<구글 OAuth Client Secret>

# Database
DATABASE_URL=postgresql://postgres:dev@localhost:5432/saju_front

# Backend API
API_SECRET_KEY=<서비스 토큰 서명용 시크릿>
```

### 프로덕션 환경변수 (Vercel / 서버)

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<프로덕션용 별도 시크릿>
AUTH_SECRET=<프로덕션용 별도 시크릿>

# 각 OAuth 앱의 프로덕션 키
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 5. 구현 작업 목록

### Phase 1: 기본 설정 및 인프라 (필수)

#### 5.1 AUTH_SECRET 설정
- **파일:** `.env.local`
- Auth.js v5에서 `AUTH_SECRET` 환경변수 필수
- `openssl rand -base64 32`로 생성

#### 5.2 auth.ts 보완
- **파일:** `src/lib/auth.ts`
- 변경 사항:
  - `trustHost: true` 추가 (프로덕션 배포 시 필요)
  - `allowDangerousEmailAccountLinking: true` 고려 (동일 이메일 계정 연동)
  - JWT 콜백에서 추가 사용자 정보 포함 검토

```typescript
// src/lib/auth.ts 보완 예시
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "database",
  },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",  // OAuth 에러 시 리다이렉트
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // 추가 검증 로직 (필요 시)
      // 예: 특정 도메인 이메일만 허용
      return true;
    },
  },
});
```

#### 5.3 Prisma 마이그레이션 실행
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Phase 2: 로그인 페이지 개선

#### 5.4 로그인 페이지 에러 핸들링
- **파일:** `src/app/[locale]/login/page.tsx`
- OAuth 에러 파라미터 처리 (`?error=OAuthAccountNotLinked` 등)
- 로딩 상태 표시
- callbackUrl 동적 처리 (로그인 전 접근한 페이지로 리다이렉트)

```typescript
// 에러 핸들링 추가 예시
"use client";

import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "이미 다른 방법으로 가입된 이메일입니다.",
    OAuthSignin: "로그인 중 오류가 발생했습니다.",
    OAuthCallback: "인증 처리 중 오류가 발생했습니다.",
    default: "알 수 없는 오류가 발생했습니다.",
  };

  return (
    <div>
      {error && (
        <div className="error-message">
          {errorMessages[error] || errorMessages.default}
        </div>
      )}

      <button onClick={() => signIn("kakao", { callbackUrl })}>
        카카오로 로그인
      </button>
      <button onClick={() => signIn("naver", { callbackUrl })}>
        네이버로 로그인
      </button>
      <button onClick={() => signIn("google", { callbackUrl })}>
        구글로 로그인
      </button>
    </div>
  );
}
```

#### 5.5 다국어 에러 메시지
- **파일:** `messages/ko.json`, `messages/en.json`, `messages/ja.json`, `messages/zh.json`
- Auth 네임스페이스에 에러 메시지 추가

```json
{
  "Auth": {
    "login": "로그인",
    "loginWithKakao": "카카오로 로그인",
    "loginWithNaver": "네이버로 로그인",
    "loginWithGoogle": "구글로 로그인",
    "errors": {
      "OAuthAccountNotLinked": "이미 다른 방법으로 가입된 이메일입니다.",
      "OAuthSignin": "로그인 중 오류가 발생했습니다.",
      "OAuthCallback": "인증 처리 중 오류가 발생했습니다.",
      "AccessDenied": "접근이 거부되었습니다.",
      "default": "로그인에 실패했습니다. 다시 시도해주세요."
    },
    "loggingIn": "로그인 중...",
    "logout": "로그아웃"
  }
}
```

### Phase 3: 계정 연동 (Account Linking)

#### 5.6 동일 이메일 계정 연동 전략

**문제:** 사용자가 카카오로 가입 후, 같은 이메일의 구글 계정으로 로그인 시도

**옵션 A: 자동 연동 (권장)**
- `allowDangerousEmailAccountLinking: true` 설정
- 같은 이메일이면 기존 User에 새 Account 레코드 추가
- 장점: 사용자 경험 좋음
- 단점: 이메일 검증되지 않은 프로바이더에서 보안 위험

**옵션 B: 수동 연동**
- 마이페이지에서 "계정 연동" 기능 제공
- 로그인된 상태에서 다른 프로바이더 연결

```typescript
// 마이페이지 계정 연동 예시
// src/app/[locale]/mypage/accounts/page.tsx

async function LinkedAccountsPage() {
  const session = await auth();
  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { provider: true },
  });

  const linkedProviders = accounts.map(a => a.provider);

  return (
    <div>
      <h2>연동된 계정</h2>
      {["kakao", "naver", "google"].map(provider => (
        <div key={provider}>
          <span>{provider}</span>
          {linkedProviders.includes(provider) ? (
            <span>연동됨</span>
          ) : (
            <button onClick={() => signIn(provider)}>연동하기</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Phase 4: 미들웨어 보완

#### 5.7 미들웨어 개선
- **파일:** `middleware.ts`
- callbackUrl 파라미터 전달
- 에러 페이지 처리

```typescript
// middleware.ts 보완
if (!sessionToken && isProtectedRoute) {
  const loginUrl = new URL(`/${locale}/login`, request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
```

### Phase 5: 보안 강화

#### 5.8 CSRF 보호
- NextAuth.js v5에서 기본 제공 (authjs.csrf-token 쿠키)
- 별도 설정 불필요

#### 5.9 세션 보안 설정
```typescript
// auth.ts에 추가
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
},
```

#### 5.10 Rate Limiting (로그인 시도)
- 로그인 페이지에서 과도한 요청 방지
- NextAuth 콜백에서 IP 기반 제한 고려

### Phase 6: 회원 탈퇴

#### 5.11 회원 탈퇴 기능
- **파일:** `src/app/[locale]/mypage/delete-account/page.tsx`
- DB에서 User + 관련 데이터 cascade 삭제
- OAuth 앱 연동 해제 안내
- 탈퇴 확인 모달

```typescript
// Server Action
async function deleteAccount() {
  "use server";
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.delete({
    where: { id: session.user.id },
    // Account, Session, UserProfile, Payment, UsageLog는 cascade 삭제
  });

  // 세션 무효화
  // redirect to home
}
```

---

## 6. 테스트 계획

### 6.1 단위 테스트

| 테스트 항목 | 파일 | 설명 |
|------------|------|------|
| auth 설정 검증 | `__tests__/lib/auth.test.ts` | Provider, Adapter 설정 확인 |
| 세션 콜백 | `__tests__/lib/auth.test.ts` | user.id가 session에 포함되는지 |
| 미들웨어 | `__tests__/middleware.test.ts` | 보호 라우트 리다이렉트 |

### 6.2 통합 테스트

| 테스트 항목 | 설명 |
|------------|------|
| OAuth 플로우 | 각 프로바이더별 로그인 -> 콜백 -> 세션 생성 |
| 계정 연동 | 같은 이메일 다른 프로바이더로 로그인 |
| 세션 만료 | 세션 만료 후 리다이렉트 |
| 로그아웃 | 세션 삭제 및 쿠키 제거 |

### 6.3 E2E 테스트 (Playwright)

```typescript
// e2e/auth/social-login.spec.ts

test.describe("소셜 로그인", () => {
  test("로그인 페이지에 3개 프로바이더 버튼 표시", async ({ page }) => {
    await page.goto("/ko/login");
    await expect(page.getByText("카카오로 로그인")).toBeVisible();
    await expect(page.getByText("네이버로 로그인")).toBeVisible();
    await expect(page.getByText("구글로 로그인")).toBeVisible();
  });

  test("비로그인 상태에서 보호 라우트 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/ko/mypage");
    await expect(page).toHaveURL(/\/login/);
  });

  test("로그인 후 유저 메뉴 표시", async ({ page }) => {
    // Mock 세션 설정 후
    await page.goto("/ko");
    await expect(page.getByTestId("user-menu")).toBeVisible();
  });
});
```

### 6.4 수동 테스트 체크리스트

- [ ] 카카오 로그인 -> 동의 -> 콜백 -> 홈 리다이렉트
- [ ] 네이버 로그인 -> 동의 -> 콜백 -> 홈 리다이렉트
- [ ] 구글 로그인 -> 동의 -> 콜백 -> 홈 리다이렉트
- [ ] 로그아웃 -> 세션 삭제 -> 홈 리다이렉트
- [ ] 보호 라우트 접근 -> 로그인 페이지 리다이렉트 -> 로그인 -> 원래 페이지 복귀
- [ ] 같은 이메일로 다른 프로바이더 로그인 시도 -> 에러 메시지 또는 자동 연동
- [ ] 로그인 페이지에서 뒤로가기 -> 정상 동작
- [ ] 세션 만료 후 API 호출 -> 401 처리
- [ ] 모바일 브라우저에서 각 프로바이더 로그인
- [ ] 개인정보 처리방침 동의 화면 표시

---

## 7. 프로바이더별 주의사항

### 카카오
- **비즈 앱 전환** 필요 (이메일 수집 시)
- 검수 요청 필요 (서비스 오픈 전)
- 카카오 계정 이메일은 선택 동의이므로 null일 수 있음
- `profile.kakao_account.email` 접근 시 동의 여부 확인

### 네이버
- 검수 완료 전에는 **등록된 테스트 계정**만 로그인 가능
- 네이버 회원 이메일은 `@naver.com` 외 다른 도메인일 수 있음
- 프로필 이미지 URL이 HTTP일 수 있음 (HTTPS 변환 필요)

### 구글
- OAuth 동의 화면이 "테스트" 상태면 **등록된 테스트 사용자**만 가능
- 프로덕션 배포 시 **앱 인증(verification)** 필요할 수 있음
- `email_verified` 필드 확인 가능

---

## 8. 추가 고려사항 (선택)

### 8.1 Apple 로그인 추가
- iOS 앱 출시 시 App Store 가이드라인상 필수
- NextAuth.js에서 Apple Provider 지원
- Apple Developer 계정 필요 ($99/년)

### 8.2 로그인 분석
- 프로바이더별 가입/로그인 수 추적
- 신규 가입 vs 재방문 구분

### 8.3 탈퇴 사용자 처리
- Soft Delete vs Hard Delete 결정
- 데이터 보관 기간 정책 (개인정보보호법)

### 8.4 세션 관리 고도화
- 다중 디바이스 세션 관리
- "다른 기기에서 로그아웃" 기능
- 세션 만료 시간 커스텀 (기본 30일)

---

## 9. 일정 예상

| Phase | 작업 | 우선순위 |
|-------|------|----------|
| Phase 1 | OAuth 앱 등록 + 환경변수 + auth.ts 보완 | 높음 |
| Phase 2 | 로그인 페이지 에러 핸들링 + 다국어 | 높음 |
| Phase 3 | 계정 연동 전략 결정 및 구현 | 중간 |
| Phase 4 | 미들웨어 callbackUrl 전달 | 높음 |
| Phase 5 | 보안 강화 (CSRF, Rate Limit) | 중간 |
| Phase 6 | 회원 탈퇴 기능 | 중간 |
| 테스트 | E2E + 수동 테스트 | 높음 |

---

## 10. 관련 파일 목록

```
src/lib/auth.ts                              # NextAuth 설정 (핵심)
src/app/api/auth/[...nextauth]/route.ts      # NextAuth API 라우트
src/app/[locale]/login/page.tsx              # 로그인 페이지
src/components/auth/SessionProvider.tsx       # 세션 프로바이더
src/components/auth/UserMenu.tsx             # 유저 메뉴 (로그아웃)
src/components/auth/AuthHeader.tsx           # 인증 헤더
src/components/auth/LoginButton.tsx          # 로그인 버튼
middleware.ts                                 # 라우트 보호
prisma/schema.prisma                         # DB 스키마
messages/ko.json                             # 한국어 번역
messages/en.json                             # 영어 번역
messages/ja.json                             # 일본어 번역
messages/zh.json                             # 중국어 번역
.env.local                                   # 환경변수 (로컬)
```
