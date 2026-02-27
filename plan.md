# 사주(四柱) 웹 서비스 - 프로젝트 현황

> 최종 업데이트: 2026-02-27

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript, React 19 |
| 스타일 | Tailwind CSS 4 |
| 인증 | Auth.js v5 (Kakao, Naver, Google) |
| DB ORM | Prisma 6 + PostgreSQL |
| 결제 | 토스페이먼츠 SDK |
| i18n | next-intl (ko, en, ja, zh) |
| 애니메이션 | Framer Motion |
| 아이콘 | Lucide React |
| 백엔드 | FastAPI (Python) - 별도 서버 |

---

## 디자인 컨셉: "심야의 책방" (Midnight Library)

- 다크 + 골드 무드
- 고서(古書), 별자리 모티브
- 컬러: 남색 배경 (#0a0e1a) + 골드 악센트 (#ffd700)
- 폰트: Pretendard (본문) + Noto Serif KR (제목)

---

## 페이지 구조

```
/                          -> 홈 (메뉴 카드 4개)
/login                     -> 소셜 로그인 (카카오/네이버/구글)
/saju                      -> 사주 입력 폼
/saju/result               -> 사주 분석 결과 (SSE 스트리밍)
/today                     -> 오늘의 운세
/compatibility             -> 궁합 보기
/payment                   -> 요금제 선택
/payment/success           -> 결제 성공
/payment/fail              -> 결제 실패
/mypage                    -> 마이페이지 메뉴
/mypage/profile            -> 프로필 관리 (생년월일 저장)
/mypage/payments           -> 결제 내역
/mypage/subscription       -> 구독 관리
```

### API Routes
```
/api/auth/[...nextauth]    -> Auth.js 핸들러
/api/saju/reading           -> SSE 스트리밍 프록시
/api/payments/confirm       -> 결제 확인 + 주문 생성
/api/payments/webhook       -> 토스 웹훅
```

---

## 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx
│   ├── [locale]/
│   │   ├── layout.tsx              # SessionProvider + i18n
│   │   ├── page.tsx                # 홈
│   │   ├── login/page.tsx          # 소셜 로그인
│   │   ├── saju/
│   │   │   ├── page.tsx            # 사주 입력 폼
│   │   │   └── result/page.tsx     # 사주 결과
│   │   ├── today/page.tsx          # 오늘의 운세
│   │   ├── compatibility/page.tsx  # 궁합
│   │   ├── payment/
│   │   │   ├── page.tsx            # 요금제 선택
│   │   │   ├── success/page.tsx
│   │   │   └── fail/page.tsx
│   │   └── mypage/
│   │       ├── page.tsx            # 마이페이지 메뉴
│   │       ├── profile/page.tsx
│   │       ├── payments/page.tsx
│   │       └── subscription/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── saju/reading/route.ts
│       └── payments/
│           ├── confirm/route.ts
│           └── webhook/route.ts
├── components/
│   ├── auth/                       # 인증 UI
│   │   ├── SessionProvider.tsx
│   │   ├── AuthHeader.tsx
│   │   ├── LoginButton.tsx
│   │   └── UserMenu.tsx
│   ├── layout/                     # 레이아웃
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── LocaleSwitcher.tsx
│   ├── saju/                       # 사주 관련
│   │   ├── SajuForm.tsx
│   │   ├── SajuPillar.tsx
│   │   ├── SajuPillarGroup.tsx
│   │   ├── InterpretCard.tsx
│   │   └── OhengChart.tsx
│   ├── ui/                         # 공통 UI
│   │   ├── GoldButton.tsx
│   │   ├── GoldCard.tsx
│   │   ├── GoldInput.tsx
│   │   ├── GoldSelect.tsx
│   │   ├── GoldToggle.tsx
│   │   ├── PremiumGate.tsx
│   │   └── ErrorMessage.tsx
│   └── decorative/
│       ├── StarField.tsx
│       ├── GoldFrame.tsx
│       └── LoadingBook.tsx
├── hooks/
│   ├── useSajuReading.ts
│   ├── useDailyFortune.ts
│   ├── useMonthlyFortune.ts
│   ├── useCompatibility.ts
│   └── useSinsal.ts
├── lib/
│   ├── auth.ts                     # Auth.js 설정
│   ├── errors.ts                   # 에러 타입
│   ├── sse-client.ts               # SSE 파싱
│   ├── constants.ts
│   └── server/                     # 서버 전용
│       ├── prisma.ts
│       ├── service-token.ts
│       ├── api-server-client.ts
│       ├── actions.ts
│       ├── usage-limiter.ts
│       ├── user-tier.ts
│       ├── payment-service.ts
│       └── profile-actions.ts
├── types/
│   ├── api.ts
│   └── saju.ts
├── i18n/
│   ├── routing.ts
│   ├── navigation.ts
│   └── request.ts
└── styles/
    └── globals.css

messages/
├── ko.json
├── en.json
├── ja.json
└── zh.json

prisma/
└── schema.prisma
```

---

## DB 스키마 (Prisma)

```
User ──< Account        (1:N, OAuth 계정)
     ──< Session        (1:N, 세션)
     ──1 UserProfile    (1:1, 생년월일 등)
     ──< Payment        (1:N, 결제 내역)
     ──< UsageLog       (1:N, 사용 기록)

VerificationToken       (Auth.js 표준)
```

---

## 셋업 가이드

### 1. 의존성 설치
```bash
npm install
npx prisma generate
```

### 2. Docker PostgreSQL
```bash
docker run -d \
  --name saju-postgres \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=saju_front \
  -p 5432:5432 \
  postgres:16
```

### 3. DB 마이그레이션
```bash
npx prisma migrate dev --name init
```

### 4. 환경 변수 (.env.local)
```env
DATABASE_URL=postgresql://postgres:dev@localhost:5432/saju_front
AUTH_SECRET=<random>
AUTH_TRUST_HOST=true
API_SERVER_URL=http://13.124.36.79:8000/api/v1
API_SECRET_KEY=<shared-secret>
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

### 5. 개발 서버
```bash
npm run dev
```
