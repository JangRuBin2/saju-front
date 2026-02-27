# API 연동 현황

> 최종 업데이트: 2026-02-27
> 상태: BFF 패턴 구현 완료

---

## 아키텍처

```
브라우저 -> Next.js Server Actions / API Routes -> API 서버 (http://13.124.36.79:8000/api/v1)
```

- 브라우저는 API 서버에 직접 접근하지 않음
- 모든 요청은 Next.js 서버를 경유
- 서비스 토큰 (HMAC-SHA256)으로 서버 간 인증

---

## 연동 현황

| 프론트 기능 | 백엔드 엔드포인트 | 방식 | 호출 경로 | 상태 |
|---|---|---|---|---|
| 사주 계산 | `POST /saju/calculate` | Server Action | `calculateSajuAction()` | 완료 |
| 사주 풀이 (스트리밍) | `POST /saju/reading` | SSE 프록시 | `/api/saju/reading` | 완료 |
| 오늘의 운세 | `POST /fortune/daily` | Server Action | `getDailyFortuneAction()` | 완료 |
| 월간 운세 | `POST /fortune/monthly` | Server Action | `getMonthlyFortuneAction()` | 완료 |
| 궁합 분석 | `POST /compatibility/analyze` | Server Action | `getCompatibilityAction()` | 완료 |
| 신살 분석 | `POST /saju/sinsal` | Server Action | `getSinsalAction()` | 완료 |

---

## 파일 구조

### 서버사이드 (브라우저 접근 불가)

| 파일 | 역할 |
|------|------|
| `src/lib/server/api-server-client.ts` | API 서버 통신 (토큰 자동 첨부) |
| `src/lib/server/service-token.ts` | HMAC-SHA256 토큰 생성/검증 |
| `src/lib/server/actions.ts` | Server Actions (인증 + 사용량 체크 + API 호출) |
| `src/lib/server/usage-limiter.ts` | 일일 사용량 추적 |
| `src/lib/server/user-tier.ts` | free/premium 등급 확인 |
| `src/lib/server/prisma.ts` | DB 클라이언트 싱글턴 |
| `src/app/api/saju/reading/route.ts` | SSE 스트리밍 프록시 |

### 클라이언트사이드 훅

| 파일 | 호출 대상 |
|------|-----------|
| `src/hooks/useDailyFortune.ts` | `getDailyFortuneAction()` |
| `src/hooks/useMonthlyFortune.ts` | `getMonthlyFortuneAction()` |
| `src/hooks/useCompatibility.ts` | `getCompatibilityAction()` |
| `src/hooks/useSinsal.ts` | `getSinsalAction()` |
| `src/hooks/useSajuReading.ts` | `/api/saju/reading` (SSE) |
| `src/lib/sse-client.ts` | SSE 파싱 (URL: `/api/saju/reading`) |

### 삭제된 파일

| 파일 | 이유 |
|------|------|
| `src/lib/api-client.ts` | Server Actions로 대체 |

### 변경된 설정

| 파일 | 변경 |
|------|------|
| `next.config.ts` | `rewrites()` 제거 (프록시 불필요) |
| `middleware.ts` | `backend-api` matcher 제거 |
| `.env.local` | `NEXT_PUBLIC_API_BASE_URL` 제거 |

---

## Server Action 흐름

```typescript
// 모든 Server Action 공통 흐름
async function action(request) {
  1. auth() -> 세션 확인 (userId 추출)
  2. getUserTier(userId) -> "free" | "premium"
  3. checkUsageLimit(userId, action, tier) -> allowed?
  4. generateServiceToken(userId, tier) -> HMAC 토큰
  5. API 서버 호출 (X-Service-Token 헤더)
  6. recordUsage(userId, action) -> UsageLog 기록
  7. return ActionResult<T>
}
```

## 에러 처리

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errorType: "usage_limit" | "premium_required" | "auth_required" | "server_error" }
```

---

## 백엔드 미들웨어 (추가됨)

| 파일 | 역할 |
|------|------|
| `app/middleware/token_validator.py` | X-Service-Token HMAC 검증, request.state에 user_id/tier 주입 |
| `app/middleware/rate_limiter.py` | tier 기반 Redis rate limiting (free: 10/min, premium: 60/min) |
| `app/config.py` | `api_secret_key`, `require_service_token` 추가 |

활성화: `.env`에 `REQUIRE_SERVICE_TOKEN=true` + `API_SECRET_KEY=<secret>` 설정
