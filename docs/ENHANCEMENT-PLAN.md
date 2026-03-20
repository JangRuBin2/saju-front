# Epic Fortune 프로젝트 고도화 방안

> 기준일: 2026-03-20 | 원본: `Epic Fortune 사주 서비스 기술 고도화 상세 계획서.html`
> saju API 프로젝트 (C:/workspace/saju/saju/) 현황 반영

---

## 현재 완성도 요약

### 프론트엔드 (saju-front) - 이미 구현됨
- Next.js 16 + App Router + Turbopack
- Auth.js v5 (Kakao/Naver/Google OAuth)
- Prisma 6 + PostgreSQL (User, Account, Session, UserProfile, ReadingType, Payment)
- 토스페이먼츠 건별 결제 (티켓 모델)
- BFF 패턴 (HMAC-SHA256 서비스 토큰)
- 4개 국어 i18n (ko, en, ja, zh)
- "심야의 책방" 디자인 시스템 (다크+골드)
- SSE 스트리밍 리딩 (`/api/saju/reading`)
- 테스트 모드 (`NEXT_PUBLIC_TEST_MODE`)

### 백엔드 API (saju) - 이미 구현됨
- FastAPI + lunar-python (사주 계산 엔진)
- 20+ 엔드포인트: saju, compatibility, fortune, career, marriage, pet, celebrity, timing
- Claude AI 해석 (Sonnet/Haiku 모델 라우팅)
- Redis 캐싱 (graceful degradation)
- SSE 스트리밍 지원
- HMAC-SHA256 토큰 인증 + Rate Limiting
- 32+ 테스트 통과

### 현재 핵심 문제점
| 영역 | 문제 | 심각도 |
|------|------|--------|
| 가격 정책 | 1,100원 저가 → 마진 없음 | 긴급 |
| 무료 티어 | 과도한 혜택 → CVR 저조 | 긴급 |
| 온보딩 | 설득 플로우 부재 → 높은 이탈률 | 높음 |
| 바이럴 | 공유 기능 미비 → 유기적 성장 없음 | 높음 |
| UX | 결과 페이지 텍스트 위주 → 체류시간 낮음 | 중간 |
| 프론트-API 미연동 | 다수 API 엔드포인트가 프론트에 미연결 | 높음 |

---

## Phase 1: 기반 정비 및 개발 환경 (즉시)

### 1-1. 환경 변수 정리
현재 `API_SERVER_URL`이 하드코딩 fallback으로 되어 있음. 모든 외부 엔드포인트를 env로 관리.

**변경 사항:**
- `.env.local`에 `DEV_MODE=true` 추가 → 개발자 무료 사용
- API 엔드포인트를 env 기반으로 통일
- 테스트/개발 모드 분리 (`NEXT_PUBLIC_TEST_MODE` vs `DEV_MODE`)

**파일:**
- `.env.local` - 환경 변수 추가
- `src/lib/server/api-server-client.ts` - env fallback 제거, 명확한 에러
- `src/lib/server/usage-limiter.ts` - DEV_MODE 시 무제한 허용

### 1-2. 미연동 API 엔드포인트 연결
saju API에는 20+ 엔드포인트가 있지만 프론트엔드에서 실제 사용하는 것은 일부임.

**프론트엔드에 연결 필요한 API:**
| API 엔드포인트 | 프론트 상태 | 우선순위 |
|---|---|---|
| `POST /saju/calculate` | 연결됨 | - |
| `POST /saju/reading` | 연결됨 | - |
| `POST /saju/sinsal` | 미연결 | Phase 2 |
| `POST /compatibility/analyze` | 연결됨 | - |
| `POST /fortune/daily` | 연결됨 | - |
| `POST /fortune/monthly` | 연결됨 | - |
| `POST /career/transition` | 타입만 정의 | Phase 2 |
| `POST /career/stay-or-go` | 타입만 정의 | Phase 2 |
| `POST /career/startup` | 타입만 정의 | Phase 2 |
| `POST /career/burnout` | 타입만 정의 | Phase 2 |
| `POST /marriage/timing` | 타입만 정의 | Phase 2 |
| `POST /marriage/life-forecast` | 타입만 정의 | Phase 2 |
| `POST /marriage/finance` | 타입만 정의 | Phase 2 |
| `POST /marriage/auspicious-dates` | 타입만 정의 | Phase 2 |
| `POST /pet/reading` | 타입만 정의 | Phase 2 |
| `POST /pet/compatibility` | 타입만 정의 | Phase 2 |
| `POST /pet/fortune/yearly` | 타입만 정의 | Phase 3 |
| `POST /pet/adoption-timing` | 타입만 정의 | Phase 3 |
| `POST /timing/now` | 미연결 | Phase 3 |
| `POST /timing/best-hours` | 미연결 | Phase 3 |
| `GET /celebrity/search` | 미연결 | Phase 3 |
| `POST /celebrity/compatibility` | 미연결 | Phase 3 |

---

## Phase 2: 수익화 핵심 (Week 1-2)

### 2-1. 가격 정책 개편
**현재:** 1,100원 단일 가격
**변경:**

| 서비스 | 가격 | 비고 |
|--------|------|------|
| 오늘의 운세 | 1,900원 | 24시간 유효 |
| 사주풀이 (기본) | 3,900원 | Sonnet 모델 |
| 사주풀이 (심층) | 5,900원 | Opus 모델 |
| 궁합 분석 | 4,900원 | 두 사람 분석 |
| 연간 운세 | 9,900원 | 월별 상세 |

**작업:**
- `ReadingType` 시드 데이터 업데이트 (가격, 설명)
- `prisma/seed.ts` 수정

### 2-2. 무료 티어 재설계
**현재:** 테스트 모드로 무제한
**변경:** 회원가입 시 스타터 크레딧 3회 (평생 1회)

**작업:**
- `User` 모델에 `credits Int @default(3)` 추가
- `usage-limiter.ts`에 크레딧 차감 로직
- 무료 체험은 Haiku 모델 + 300자 요약만

### 2-3. Paywall UI 구현
결과 페이지 앞부분만 보여주고 블러 처리.

**작업:**
- `src/components/readings/PaywallResult.tsx` 생성
- 결과 페이지에 isPaid 체크 로직
- 그라데이션 + "잠금 해제" CTA 버튼

### 2-4. 카카오톡 공유
**작업:**
- `src/lib/kakao-share.ts` 유틸 생성
- Kakao JS SDK 초기화 (layout.tsx)
- 결과 페이지에 공유 버튼 추가

### 2-5. 이탈 방지 팝업
**작업:**
- `src/hooks/useExitIntent.ts`
- `src/components/ui/ExitIntentModal.tsx`

---

## Phase 3: 콘텐츠 확장 + 품질 (Week 3-4)

### 3-1. 신규 리딩 타입 페이지 구현
API는 이미 준비됨. 프론트엔드 페이지 + BFF 라우트 추가 필요.

**커리어 (4종):**
- `/[locale]/career/transition` - 이직/전직 타이밍
- `/[locale]/career/stay-or-go` - 남을까 떠날까
- `/[locale]/career/startup` - 창업 적성
- `/[locale]/career/burnout` - 번아웃 회복

**결혼 (4종):**
- `/[locale]/marriage/timing` - 결혼 최적 시기
- `/[locale]/marriage/life-forecast` - 결혼 후 생활
- `/[locale]/marriage/finance` - 부부 재물운
- `/[locale]/marriage/auspicious-dates` - 결혼 길일

**펫 사주 (4종):**
- `/[locale]/pet/reading` - 반려동물 성향
- `/[locale]/pet/compatibility` - 주인-펫 궁합
- `/[locale]/pet/fortune` - 연간 운세
- `/[locale]/pet/adoption` - 입양 최적 시기

**각 리딩 타입별 작업:**
1. BFF API 라우트 (`src/app/api/{type}/route.ts`)
2. 입력 폼 컴포넌트
3. 결과 표시 페이지
4. ReadingType 시드 데이터 추가
5. 4개 국어 번역 키 추가

### 3-2. 결과 페이지 시각화
**작업:**
- `src/components/charts/FiveElementsChart.tsx` (Recharts PieChart/RadarChart)
- 사주 팔자 인터랙티브 차트 (클릭 시 Popover)
- AI 해석 아코디언 카드 UI

### 3-3. 온보딩 Step Wizard
**작업:**
- `src/components/saju/StepWizard.tsx`
- Step 1: 기본정보 → Step 2: 생년월일 → Step 3: 태어난 시간
- 입력 완료 시 일주 동물 캐릭터 애니메이션

### 3-4. 대시보드 UI 리뉴얼
**작업:**
- 오늘의 운세 점수 게이지 바 (0~100)
- 행운 컬러/숫자 표시
- 캘린더 위젯 (길일 마킹)
- 구독 업그레이드 배너

---

## Phase 4: 성장 + 바이럴 (Week 5-8)

### 4-1. OG 이미지 생성 API
- `src/app/api/og/saju/route.tsx` (Edge Runtime, ImageResponse)
- 사주 핵심 키워드 + 브랜드 디자인

### 4-2. 친구 초대 레퍼럴 시스템
- `User` 모델에 `referralCode`, `referredBy` 추가
- `/api/referral/register` 엔드포인트
- 보상: 친구 3회 무료, 추천인 1회 프리미엄

### 4-3. 셀럽 데이터베이스 + SEO 페이지
- API의 `/celebrity/search`, `/celebrity/compatibility` 연동
- `/[locale]/celebrity/[slug]/page.tsx` 정적 페이지
- `generateStaticParams()` 활용

### 4-4. 이메일 마케팅 자동화 (Resend)
- 웰컴 이메일 (Day 0)
- 미사용 리마인더 (Day 3)
- 주간 운세 뉴스레터 (매주 월요일)

### 4-5. 열람 히스토리
- `Reading` 모델 추가 (결과 JSON 저장)
- 마이페이지 타임라인 UI

---

## Phase 5: 리텐션 + 인프라 (Week 9-12)

### 5-1. 구독 결제 (TossPayments 빌링키)
- `Subscription`, `SubscriptionLog` 모델 추가
- 빌링키 발급/저장/정기결제 로직
- Basic (9,900원/월), Premium (19,900원/월)

### 5-2. 웹 푸시 알림 (PWA + FCM)
- `public/manifest.json`
- Service Worker 등록
- 매일 아침 운세 알림

### 5-3. 게이미피케이션
- `DailyStreak` 모델
- 출석 체크 API (`/api/streak/checkin`)
- 7일 연속 출석 보상

### 5-4. 분석/모니터링
- Mixpanel 이벤트 트래킹
- Sentry 에러 모니터링
- A/B 테스트 미들웨어

### 5-5. 보안 강화
- 생년월일 AES-256 암호화 (`src/lib/encryption.ts`)
- Rate Limiting (Upstash Redis)
- Global Error Boundary (`app/error.tsx`, `app/global-error.tsx`)

---

## 기술적 개선 사항 (전 Phase 공통)

### ENV 기반 설정 (즉시 적용)
```
# .env.local 추가 항목
DEV_MODE=true                              # 개발자 무료 사용
API_SERVER_URL=http://13.124.36.79:8000/api/v1  # API 서버 (필수)
NEXT_PUBLIC_KAKAO_APP_KEY=                 # 카카오 공유
RESEND_API_KEY=                            # 이메일 마케팅
NEXT_PUBLIC_MIXPANEL_TOKEN=                # 분석
SENTRY_DSN=                                # 에러 모니터링
ENCRYPTION_KEY=                            # AES-256 암호화 키 (32바이트 hex)
```

### Prisma 스키마 확장 로드맵
```
Phase 2: User.credits, ReadingType 가격 업데이트
Phase 4: User.referralCode, User.referredBy, Reading 모델
Phase 5: Subscription, SubscriptionLog, DailyStreak, FeedbackRating
```

### 성능 목표
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- 차트 라이브러리 dynamic import
- next/image WebP 자동 변환

---

## KPI 목표

| Phase | 핵심 KPI | 목표 |
|-------|----------|------|
| Phase 2 | 유료 전환율 (CVR) | > 5% |
| Phase 2 | 일평균 결제건수 | > 10건 |
| Phase 3 | 세션당 페이지뷰 | > 4 |
| Phase 3 | 평균 체류시간 | > 3분 |
| Phase 4 | 일일 신규 가입자 | > 50명 |
| Phase 5 | DAU/MAU 비율 | > 20% |
| Phase 5 | 30일 리텐션율 | > 40% |

---

## 작업 순서 (Claude Code 실행 계획)

1. **즉시**: ENV 정비 + DEV_MODE + API 엔드포인트 env화
2. **Phase 2**: 가격 개편 + Paywall + 공유 + 이탈 방지
3. **Phase 3**: 신규 리딩 타입 12종 페이지 + 차트 + Step Wizard
4. **Phase 4**: OG이미지 + 레퍼럴 + 셀럽 + 이메일 + 히스토리
5. **Phase 5**: 구독결제 + PWA + 게이미피케이션 + 분석 + 보안
