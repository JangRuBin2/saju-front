# 사주 앱 전체 작업 백로그

> 최종 업데이트: 2026-03-04
> 프로젝트 완성도: **약 95%** (코드 완성, 인프라/설정 미완)

---

## 현재 완료된 항목 요약

| 영역 | 상태 | 비고 |
|------|------|------|
| 페이지 (13+) | ✅ 완료 | 홈, 로그인, 사주, 운세, 궁합, 결제, 마이페이지, 대시보드, 구독 |
| 인증 (Auth.js v5) | ✅ 완료 | 카카오/네이버/구글 OAuth + trustHost + email linking |
| DB 스키마 (Prisma) | ✅ 완료 | 7개 테이블 설계 완료 |
| BFF API 레이어 | ✅ 완료 | Server Actions + SSE 프록시 |
| 결제 (토스페이먼츠) | ✅ 완료 | SDK 연동, 주문/확인/웹훅, i18n 완료 |
| 사용량 제한 | ✅ 완료 | 무료/프리미엄 tier 분기 |
| i18n (4개 언어) | ✅ 완료 | ko, en, ja, zh — 전 페이지 번역 완료 |
| 컴포넌트 (40+) | ✅ 완료 | Gold 테마 UI 시스템 |
| 에러 핸들링 | ✅ 완료 | ErrorMessage 전 페이지 적용 |
| 폼 검증 | ✅ 완료 | 연도 범위, 월별 일수 검증 |
| SEO | ✅ 완료 | 메타데이터, robots.txt, sitemap.xml |
| 계정 삭제 | ✅ 완료 | GDPR 대응 완료 |
| 구독 관리 UX | ✅ 완료 | 잔여 기간, 기능 목록 |

---

## 🔴 Phase 0: 인프라 셋업 (블로커 — 앱 실행 불가)

### INFRA-01: 환경변수 설정
- **상태**: ❌ 미완료
- **설명**: `.env` 파일이 비어있음. 모든 환경변수 설정 필요
- **파일**: `.env.local`
- **필요한 값**:
  - `DATABASE_URL` — PostgreSQL 연결 문자열
  - `AUTH_SECRET` — NextAuth 암호화 키
  - `API_SERVER_URL` — Python 백엔드 API 주소
  - `API_SECRET_KEY` — HMAC-SHA256 서비스 토큰 시크릿
  - `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
  - `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`

### INFRA-02: PostgreSQL 데이터베이스 구축
- **상태**: ❌ 미완료
- **설명**: Docker 또는 실제 DB 서버 필요
- **작업**:
  - [ ] PostgreSQL 인스턴스 생성
  - [ ] `npx prisma migrate dev --name init` 실행
  - [ ] DB 연결 확인

### INFRA-03: OAuth 앱 등록
- **상태**: ❌ 미완료
- **설명**: 3개 소셜 로그인 각각 개발자 콘솔에서 앱 등록 필요
- **작업**:
  - [ ] 카카오 개발자 콘솔 앱 등록 + redirect URI 설정
  - [ ] 네이버 개발자 콘솔 앱 등록 + redirect URI 설정
  - [ ] 구글 Cloud Console OAuth 앱 등록 + redirect URI 설정
  - [ ] redirect URI: `http://localhost:3000/api/auth/callback/{provider}`

### INFRA-04: 토스페이먼츠 키 발급
- **상태**: ❌ 미완료
- **작업**:
  - [ ] 토스페이먼츠 가맹점 등록
  - [ ] 테스트 Client Key / Secret Key 발급

### INFRA-05: 백엔드 API 서버 연결 확인
- **상태**: ❌ 미확인
- **설명**: `http://13.124.36.79:8000/api/v1` 응답 확인 필요
- **작업**:
  - [ ] API 서버 상태 확인
  - [ ] 엔드포인트 응답 테스트 (`/saju/calculate`, `/fortune/daily` 등)

---

## 🟡 Phase 1: 사주 API 연동 및 테스트

### API-01: 사주 계산 API 연동 테스트
- **상태**: ⏳ 코드 완성, 테스트 필요
- **설명**: Server Action → API 서버 호출 → 응답 파싱 전 과정 테스트
- **파일**: `src/lib/server/actions.ts`, `src/lib/server/api-server-client.ts`
- **작업**:
  - [ ] `calculateSajuAction()` 실제 호출 테스트
  - [ ] 서비스 토큰 생성/검증 동작 확인
  - [ ] 에러 응답 핸들링 검증 (400, 401, 500 등)
  - [ ] 타임아웃 시나리오 테스트

### API-02: SSE 스트리밍 테스트
- **상태**: ⏳ 코드 완성, 테스트 필요
- **설명**: 사주 풀이 실시간 스트리밍 프록시 검증
- **파일**: `src/app/api/saju/reading/route.ts`, `src/hooks/useSajuReading.ts`
- **작업**:
  - [ ] SSE 스트림 연결 → 청크 수신 → UI 반영 전 과정
  - [ ] 스트림 중단/재연결 시나리오
  - [ ] 대용량 응답 처리 확인

### API-03: 운세/궁합/신살 API 테스트
- **상태**: ⏳ 코드 완성, 테스트 필요
- **파일**: `src/hooks/useDailyFortune.ts`, `useCompatibility.ts`, `useSinsal.ts`
- **작업**:
  - [ ] 오늘의 운세 API 호출 및 응답 확인
  - [ ] 월간 운세 (프리미엄 전용) 테스트
  - [ ] 궁합 분석 2인 데이터 전송 검증
  - [ ] 신살 분석 (프리미엄 전용) 테스트

### API-04: 사용량 제한 테스트
- **상태**: ⏳ 코드 완성, 테스트 필요
- **파일**: `src/lib/server/usage-limiter.ts`, `src/lib/server/user-tier.ts`
- **작업**:
  - [ ] 무료 tier: 1일 1회 제한 동작 확인
  - [ ] 프리미엄 tier: 무제한 접근 확인
  - [ ] 자정 리셋 로직 확인
  - [ ] PremiumGate UI 노출 타이밍 확인

---

## ✅ Phase 2: 사주 UI 개선 (완료)

### UI-01: 에러 핸들링 UI 보강
- **상태**: ✅ 완료 (2026-03-04)
- **설명**: ErrorMessage 컴포넌트를 사주 결과, 궁합, 오늘의 운세 페이지에 적용
- **커밋**: `ca5661b`

### UI-02: 로딩 상태 개선
- **상태**: ✅ 완료 (2026-03-04)
- **설명**: 프로필 저장 버튼 로딩 상태, 구독 페이지 LoadingBook 적용

### UI-03: 폼 유효성 검증 강화
- **상태**: ✅ 완료 (2026-03-04)
- **설명**: 연도 상한값 동적화, 월별 일수 검증, 번역 키 추가 (4개 언어)

### UI-04: 반응형/접근성 개선
- **상태**: 🔶 기본 구현
- **작업**:
  - [ ] 태블릿 화면 레이아웃 최적화
  - [ ] 키보드 내비게이션 개선
  - [ ] 스크린 리더 호환성 확인
  - [ ] 다크모드 대비 명암비 확인 (WCAG AA)

---

## ✅ Phase 3: 대시보드 개발 (기본 완료)

### DASH-01: 사용자 대시보드 페이지
- **상태**: ✅ 완료 (2026-03-02)
- **설명**: 프로필 요약, 오늘의 운세, 빠른 액세스, 프리미엄 배너, 최근 활동
- **커밋**: `b5e16e1`

### DASH-02: 사주 분석 이력 저장 기능
- **상태**: ❌ 미개발
- **설명**: 사용자의 과거 사주 분석 결과를 DB에 저장하고 조회
- **작업**:
  - [ ] `SajuHistory` 모델 추가 (Prisma 스키마)
  - [ ] 분석 완료 시 자동 저장 Server Action
  - [ ] 이력 목록 조회 API
  - [ ] 이력 상세 보기 UI
  - [ ] 이력 삭제 기능

### DASH-03: 관리자 대시보드 (어드민)
- **상태**: ❌ 미개발
- **설명**: 서비스 운영을 위한 관리자 페이지
- **위치**: `src/app/[locale]/admin/` (신규)
- **기능**:
  - [ ] 가입자 수/결제 현황 통계
  - [ ] 일별/월별 API 사용량 차트
  - [ ] 사용자 관리 (tier 변경, 차단)
  - [ ] 결제 내역 조회
  - [ ] 관리자 권한 체크 미들웨어

---

## 🟡 Phase 4: 결제 시스템 보강

### PAY-01: 결제 확인 에러 처리 수정
- **상태**: ❌ 버그
- **파일**: `src/app/api/payments/confirm/route.ts`
- **설명**: 토스 검증 실패해도 성공 페이지로 리다이렉트될 수 있음
- **작업**:
  - [ ] `confirmPayment()` 실패 시 에러 분기 추가
  - [ ] 실패 사유별 사용자 안내 메시지

### PAY-02: 결제 리다이렉트 로케일 수정
- **상태**: ✅ 완료 (2026-03-02)
- **설명**: `/ko/` 하드코딩 → 동적 locale 파라미터
- **커밋**: `b5e16e1`

### PAY-03: 구독 갱신/해지 흐름
- **상태**: 🔶 부분 구현
- **파일**: `src/app/[locale]/mypage/subscription/page.tsx`
- **작업**:
  - [x] 구독 잔여 기간 표시
  - [x] 구독 기능 목록 UI
  - [ ] 구독 자동 갱신 로직
  - [ ] 구독 해지 API
  - [ ] 구독 만료 알림

---

## ✅ Phase 5: 인증/보안 강화 (대부분 완료)

### AUTH-01: OAuth 에러 핸들링
- **상태**: ✅ 완료 (2026-03-02)
- **설명**: 로그인 페이지에서 `?error=` 파라미터 처리 + callbackUrl
- **커밋**: `b5e16e1`

### AUTH-02: 로그인 후 리다이렉트 (callbackUrl)
- **상태**: ✅ 완료 (2026-03-02)
- **설명**: 미들웨어 → callbackUrl 쿼리 파라미터 → 로그인 후 복귀
- **커밋**: `b5e16e1`

### AUTH-03: 계정 삭제 기능
- **상태**: ✅ 완료 (2026-03-04)
- **설명**: deleteAccount 서버 액션 + 마이페이지 UI 확인 다이얼로그
- **커밋**: `ca5661b`

### AUTH-04: 보안 강화
- **상태**: 🔶 부분 완료
- **작업**:
  - [x] `auth.ts`에 `trustHost: true` 추가
  - [x] `allowDangerousEmailAccountLinking: true` 설정
  - [ ] CSRF 보호 확인
  - [ ] Rate limiting (로그인 시도 제한)
  - [ ] CORS 설정 (API 서버: Next.js 서버만 허용)

---

## 🟢 Phase 6: 배포 및 운영

### DEPLOY-01: Vercel 배포 설정
- **상태**: ❌ 미완료
- **작업**:
  - [ ] Vercel 프로젝트 연결
  - [ ] 환경변수 설정 (Vercel Dashboard)
  - [ ] 도메인 연결
  - [ ] 프로덕션 OAuth redirect URI 업데이트

### DEPLOY-02: 프로덕션 DB 설정
- **상태**: ❌ 미완료
- **작업**:
  - [ ] 프로덕션 PostgreSQL (Supabase / Neon / AWS RDS)
  - [ ] 프로덕션 마이그레이션 실행
  - [ ] DB 백업 정책

### DEPLOY-03: 모니터링/로깅
- **상태**: ❌ 미완료
- **작업**:
  - [ ] 에러 모니터링 (Sentry 등)
  - [ ] API 응답 시간 모니터링
  - [ ] 결제 이벤트 알림 (Slack/Discord)

---

## 🔵 Phase 7: 추가 기능 (선택)

### OPT-01: 테스트 코드 작성
- **상태**: ❌ 미개발
- **설명**: 현재 테스트 파일 없음
- **작업**:
  - [ ] Server Actions 단위 테스트
  - [ ] API Routes 통합 테스트
  - [ ] 주요 컴포넌트 렌더링 테스트
  - [ ] E2E 테스트 (Playwright)

### OPT-02: SEO 최적화
- **상태**: ✅ 완료 (2026-03-04)
- **설명**: 메타데이터, robots.txt, sitemap.xml 완료
- **커밋**: `ca5661b`
- **남은 작업**:
  - [ ] 구조화 데이터 (JSON-LD)
  - [ ] og:image 생성

### OPT-03: PWA 지원
- **상태**: ❌ 미개발
- **작업**:
  - [ ] manifest.json
  - [ ] Service Worker
  - [ ] 오프라인 폴백 페이지
  - [ ] 앱 아이콘 세트

### OPT-04: 공유 기능
- **상태**: ❌ 미개발
- **작업**:
  - [ ] 사주 결과 카드 이미지 생성
  - [ ] 카카오톡/SNS 공유
  - [ ] 공유 링크 생성 (결과 페이지)

---

## 우선순위 요약

| 순위 | Phase | 핵심 작업 | 상태 |
|------|-------|----------|------|
| 1 | 🔴 Phase 0 | 인프라 셋업 | ❌ 앱 실행 불가 |
| 2 | 🟡 Phase 1 | API 연동 테스트 | ⏳ 인프라 필요 |
| 3 | ~~🟡 Phase 2~~ | ~~UI 개선~~ | ✅ 완료 |
| 4 | 🟡 Phase 4 | 결제 버그 수정 | 🔶 일부 남음 |
| 5 | ~~🟡 Phase 5~~ | ~~인증/보안~~ | ✅ 대부분 완료 |
| 6 | ~~🟡 Phase 3~~ | ~~대시보드~~ | ✅ 기본 완료 |
| 7 | 🟢 Phase 6 | 배포 | ❌ 미완료 |
| 8 | 🔵 Phase 7 | 추가 기능 | 🔶 SEO 완료 |
