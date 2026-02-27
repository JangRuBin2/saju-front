# 아키텍처 결정: BFF 패턴 (구현 완료)

> 결정일: 2026-02-26
> 구현일: 2026-02-27
> 상태: **구현 완료**

---

## 선택된 아키텍처: 옵션 B (BFF 패턴)

```
[사용자 브라우저]
      |
      v
[Next.js BFF] ─── 인증/결제/프록시
  |   |
  |   ├── Auth.js v5 (카카오/네이버/구글)
  |   ├── Prisma + PostgreSQL (users, sessions, payments, usage)
  |   └── Server Actions / API Routes
  |
  v (서비스 토큰 첨부)
[Python API Server] ─── 사주 계산 전용
  |
  ├── HMAC-SHA256 토큰 검증 미들웨어
  ├── Redis (캐시 + rate limiting)
  ├── 사주 계산 엔진
  └── LLM 해석 (Claude API)
```

### 핵심 원칙
- 브라우저는 API 서버에 **직접 접근하지 않음**
- Next.js가 인증, 결제, 사용량 제한을 소유
- API 서버는 사주 계산에만 집중
- 서비스 간 통신은 HMAC-SHA256 서비스 토큰으로 보호

---

## 구현 현황

### Phase 0: 인프라 기반 - 완료
- [x] Prisma v6 + PostgreSQL 스키마 (User, Account, Session, Payment, UserProfile, UsageLog)
- [x] Prisma 클라이언트 싱글턴
- [x] HMAC-SHA256 서비스 토큰 생성/검증
- [x] 서버사이드 API 클라이언트 (자동 토큰 첨부)
- [x] 환경 변수 설정

### Phase 1: 인증 - 완료
- [x] Auth.js v5 설정 (Kakao, Naver, Google)
- [x] PrismaAdapter 연동
- [x] 로그인 페이지 (소셜 로그인 버튼)
- [x] SessionProvider + AuthHeader (로그인/유저메뉴)
- [x] 미들웨어 (next-intl + auth 체이닝, 보호 라우트)
- [x] 4개 언어 번역 키 (ko, en, ja, zh)

### Phase 2: BFF API 레이어 - 완료
- [x] Server Actions (사주, 운세, 궁합, 신살) + 사용량 체크
- [x] SSE 스트리밍 프록시 (/api/saju/reading)
- [x] 훅 수정 (apiClient -> Server Action)
- [x] next.config.ts rewrites 제거
- [x] src/lib/api-client.ts 삭제

### Phase 3: 사용량 제한 - 완료
- [x] UsageLog 기반 일일 사용량 추적
- [x] 무료/프리미엄 tier 분기
- [x] PremiumGate UI (결제 유도 오버레이)
- [x] ErrorMessage UI

### Phase 4: 결제 시스템 - 완료
- [x] 토스페이먼츠 SDK 연동
- [x] 결제 페이지 (요금제 선택)
- [x] 결제 성공/실패 페이지
- [x] 결제 확인 API + 웹훅

### Phase 5: 마이페이지 - 완료
- [x] 프로필 관리 (생년월일 저장/조회)
- [x] 결제 내역 페이지
- [x] 구독 관리 페이지

### 백엔드 미들웨어 - 완료
- [x] TokenValidatorMiddleware (HMAC-SHA256)
- [x] RateLimiterMiddleware (tier 기반 Redis)
- [x] config.py 확장 (api_secret_key, require_service_token)

---

## 인증 흐름

```
1. 로그인
   브라우저 -> Next.js -> Auth.js -> 카카오/네이버/구글 OAuth
   <- 세션 쿠키 발급 (httpOnly, secure)

2. 인증된 API 요청
   브라우저 -> Next.js Server Action
     -> auth() 세션 확인
     -> getUserTier() 결제 상태 확인
     -> checkUsageLimit() 사용량 확인
     -> generateServiceToken() 서비스 토큰 생성
     -> API 서버 호출 (X-Service-Token 헤더)
       -> TokenValidatorMiddleware 검증
       -> RateLimiterMiddleware 체크
       -> 사주 계산 + 응답
```

## 서비스 토큰 구조

```
Payload: { user_id, tier, timestamp, nonce }
Signature: HMAC-SHA256(JSON.stringify(payload), API_SECRET_KEY)
Token: Base64(JSON.stringify({ ...payload, signature }))
Header: X-Service-Token: <token>
만료: 5분
```

## 무료/유료 기능 분리

| 기능 | 무료 | 프리미엄 |
|------|------|----------|
| 사주 풀이 | 1일 1회 | 무제한 |
| 오늘의 운세 | 1일 1회 | 무제한 |
| 궁합 분석 | 1일 1회 | 무제한 |
| 월간 운세 | 이용 불가 | 무제한 |
| 신살 분석 | 이용 불가 | 무제한 |

---

## 환경 변수

### Next.js (.env.local)
```env
DATABASE_URL=postgresql://postgres:dev@localhost:5432/saju_front
AUTH_SECRET=<random>
AUTH_TRUST_HOST=true
API_SERVER_URL=http://13.124.36.79:8000/api/v1
API_SECRET_KEY=<shared-secret>
KAKAO_CLIENT_ID=<>
KAKAO_CLIENT_SECRET=<>
NAVER_CLIENT_ID=<>
NAVER_CLIENT_SECRET=<>
GOOGLE_CLIENT_ID=<>
GOOGLE_CLIENT_SECRET=<>
NEXT_PUBLIC_TOSS_CLIENT_KEY=<>
TOSS_SECRET_KEY=<>
```

### API Server (.env)
```env
API_SECRET_KEY=<same-shared-secret>
REQUIRE_SERVICE_TOKEN=true
```

---

## 남은 작업

- [ ] Docker PostgreSQL 설정 + `npx prisma migrate dev --name init`
- [ ] 소셜 로그인 OAuth 앱 등록 (카카오/네이버/구글)
- [ ] 토스페이먼츠 테스트 키 발급
- [ ] 프로덕션 배포 설정
- [ ] CORS 제한 (API 서버: allow_origins를 Next.js 서버로 한정)
