# 사주(四柱) 웹 서비스 — 개발 계획서

> **목적**: Claude CLI(Claude Code)에게 작업을 인계하기 위한 상세 기획 문서
> **작성일**: 2026-02-26
> **기술 스택**: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma ORM

---

## 1. 디자인 컨셉

### 1-1. 테마: "심야의 책방" (Midnight Library)

레퍼런스 앱 Faladdin의 **다크 + 골드** 무드를 기반으로 하되, 크리스탈볼/타로 대신 **고서(古書), 책, 두루마리** 이미지를 핵심 모티브로 사용한다.

**핵심 키워드**: 신비로운, 프리미엄, 지적인, 전통+현대 퓨전

### 1-2. 컬러 시스템

```css
:root {
  /* 배경 */
  --bg-primary: #0a0e1a; /* 깊은 남색 (메인 배경) */
  --bg-secondary: #111827; /* 카드/섹션 배경 */
  --bg-tertiary: #1a1040; /* 그라디언트용 보조 */

  /* 골드 악센트 */
  --gold-primary: #ffd700; /* 메인 골드 */
  --gold-dark: #c9a84c; /* 다크 골드 (텍스트, 아이콘) */
  --gold-soft: rgba(255, 215, 0, 0.15); /* 골드 글로우/보더 */

  /* 텍스트 */
  --text-primary: #e8e0d0; /* 본문 텍스트 (따뜻한 화이트) */
  --text-secondary: #8b8577; /* 보조 텍스트 */
  --text-muted: #5a5549; /* 비활성 텍스트 */

  /* 카드 */
  --card-bg: rgba(255, 215, 0, 0.04);
  --card-border: rgba(255, 215, 0, 0.15);
  --card-hover-border: rgba(255, 215, 0, 0.35);

  /* 버튼 그라디언트 */
  --btn-gradient: linear-gradient(135deg, #c9a84c, #ffd700, #c9a84c);

  /* 페이지 그라디언트 */
  --page-gradient: linear-gradient(
    135deg,
    #0a0e1a 0%,
    #1a1040 50%,
    #0a0e1a 100%
  );

  /* 상태 컬러 */
  --success: #4ade80;
  --warning: #fbbf24;
  --error: #f87171;
}
```

### 1-3. 타이포그래피

```
- 한글 제목: "Noto Serif KR" (serif, 전통적 느낌)
- 한글 본문: "Pretendard" (sans-serif, 가독성)
- 영문/숫자 포인트: "Cormorant Garamond" (serif, 고급스러움)
- 아이콘 폰트: Lucide Icons
```

### 1-4. 핵심 비주얼 요소

| 요소                      | 설명                                          | 적용 위치           |
| ------------------------- | --------------------------------------------- | ------------------- |
| 펼쳐진 고서(古書)         | 메인 히어로 일러스트. 책에서 빛이 나오는 연출 | 홈 상단             |
| 두루마리 스크롤           | 결과 카드 배경 텍스처                         | 사주 결과 페이지    |
| 별자리 라인 패턴          | 얇은 골드 라인으로 그린 동양 별자리           | 배경 장식 (CSS/SVG) |
| 붓글씨 질감               | 사주 키워드(예: 木, 火, 土, 金, 水) 표시      | 오행 표시 영역      |
| 책 페이지 넘김 애니메이션 | 결과 로딩 시 책장 넘기는 모션                 | 로딩 인터랙션       |
| 골드 원형 프레임          | Faladdin 스타일 원형 테두리 (골드 글로우)     | 프로필, 메인 비주얼 |

### 1-5. 배경 장식 (CSS로 구현)

```
- 미세한 noise 텍스처 오버레이 (opacity: 0.03)
- 골드 radial-gradient 글로우 (히어로 영역 뒤)
- 별 반짝임 keyframe 애니메이션 (랜덤 위치, 작은 골드 점)
- 얇은 골드 라인 보더 패턴 (카드, 섹션 구분)
```

---

## 2. 페이지 구조 및 UI 설계

### 2-1. 전체 페이지 맵

```
/                     → 랜딩 (홈)
/saju                 → 사주 입력 폼
/saju/result          → 사주 결과 페이지
/saju/result/[id]     → 저장된 결과 공유 URL
/today                → 오늘의 운세
/compatibility        → 궁합 보기
/history              → 내 감정 기록
/mypage               → 마이페이지
/login                → 로그인
/signup               → 회원가입
```

### 2-2. 하단 네비게이션 (모바일 퍼스트)

```
[ 홈 ]  [ 오늘의 운세 ]  [ 사주 보기 ]  [ 기록 ]  [ MY ]
  🏠        ☀️              📖           📝        👤
```

- 아이콘: Lucide Icons (골드 컬러, 활성 시 골드 글로우)
- 배경: `--bg-primary` + 상단에 미세한 골드 보더 라인
- 높이: 64px, safe-area 대응

### 2-3. 주요 페이지별 UI 상세

#### 홈 (`/`)

```
┌─────────────────────────────────┐
│  로고 (붓글씨 스타일)      [알림]  │
│                                 │
│     ┌───────────────────┐       │
│     │   ◯ 골드 원형 프레임  │       │
│     │                   │       │
│     │  📖 펼쳐진 책 SVG   │       │
│     │  (빛이 나오는 효과)  │       │
│     │                   │       │
│     └───────────────────┘       │
│                                 │
│   "당신의 사주를 풀어드립니다"      │
│                                 │
│  🪙 140 코인  ·  4 무료 감정      │
│                                 │
│  ┌──────────┐  ┌──────────┐     │
│  │  📖      │  │  ☯️      │     │
│  │ 사주 보기 │  │ 오늘운세  │     │
│  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐     │
│  │  💑      │  │  📝      │     │
│  │ 궁합 보기 │  │ 기록 보기 │     │
│  └──────────┘  └──────────┘     │
│                                 │
│  ─ 하단 네비게이션 ─              │
└─────────────────────────────────┘
```

- 메뉴 카드: `--card-bg` 배경, `--card-border` 테두리, hover 시 골드 글로우
- 코인/무료 횟수: 골드 배지 스타일

#### 사주 입력 (`/saju`)

```
┌─────────────────────────────────┐
│  ← 뒤로        사주 입력          │
│                                 │
│  ┌─────────────────────────┐    │
│  │  이름                    │    │
│  │  [___________________]  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  생년월일 (양력/음력 토글) │    │
│  │  [YYYY] [MM] [DD]      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  태어난 시간              │    │
│  │  [시간 선택 드롭다운]     │    │
│  │  □ 모름 (시간 미상)      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  성별                    │    │
│  │  (남) (여)               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌═══════════════════════════┐  │
│  ║   📖 나의 사주 풀어보기    ║  │
│  └═══════════════════════════┘  │
│         골드 그라디언트 버튼       │
└─────────────────────────────────┘
```

- 입력 필드: 다크 배경 + 골드 보더 (focus 시 글로우)
- 시간 선택: 12지지 기반 (자시~해시) + 현대 시간 병기
- CTA 버튼: `--btn-gradient`, 높이 56px, 둥근 모서리

#### 사주 결과 (`/saju/result`)

```
┌─────────────────────────────────┐
│  ← 뒤로     사주 결과     [공유]  │
│                                 │
│  ┌─────────────────────────┐    │
│  │  📖 두루마리 텍스처 배경   │    │
│  │                         │    │
│  │  [이름]님의 사주팔자      │    │
│  │                         │    │
│  │  年柱  月柱  日柱  時柱   │    │
│  │  甲子  丙寅  戊辰  庚午   │    │
│  │  (한자 + 골드 스타일)     │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  ── 오행 분포 ──                 │
│  木 ████░░░░░░  40%             │
│  火 ██░░░░░░░░  20%             │
│  土 ███░░░░░░░  30%             │
│  金 █░░░░░░░░░  10%             │
│  水 ░░░░░░░░░░   0%             │
│  (각 오행별 컬러 + 골드 바)       │
│                                 │
│  ── 종합 해석 ──                 │
│  ┌─────────────────────────┐    │
│  │  💼 직업운                │    │
│  │  상세 해석 텍스트...       │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  💰 재물운                │    │
│  │  상세 해석 텍스트...       │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  💕 연애운                │    │
│  │  상세 해석 텍스트...       │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  🏥 건강운                │    │
│  │  상세 해석 텍스트...       │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌═══════════════════════════┐  │
│  ║   결과 저장하기            ║  │
│  └═══════════════════════════┘  │
└─────────────────────────────────┘
```

- 사주팔자 표시: 한자 크게 + 아래에 한글 음독, 골드 컬러
- 오행 바: 木(초록) 火(빨강) 土(노랑) 金(흰색) 水(파랑) + 골드 테두리
- 해석 카드: 아코디언 or 스크롤, 각 카드에 골드 좌측 보더

---

## 3. 기술 구현 명세

### 3-1. 프로젝트 초기화

```bash
npx create-next-app@latest saju-app --typescript --tailwind --app --src-dir
cd saju-app
npm install prisma @prisma/client
npm install lucide-react framer-motion
npm install @fontsource/noto-serif-kr
npx prisma init
```

### 3-2. 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타, 테마)
│   ├── page.tsx                # 홈
│   ├── saju/
│   │   ├── page.tsx            # 사주 입력 폼
│   │   └── result/
│   │       ├── page.tsx        # 사주 결과
│   │       └── [id]/page.tsx   # 공유용 결과
│   ├── today/page.tsx          # 오늘의 운세
│   ├── compatibility/page.tsx  # 궁합
│   ├── history/page.tsx        # 기록
│   ├── mypage/page.tsx         # 마이페이지
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── api/
│       ├── saju/
│       │   ├── calculate/route.ts   # 사주 계산 API
│       │   └── interpret/route.ts   # AI 해석 API (Claude)
│       ├── today/route.ts
│       ├── auth/route.ts
│       └── user/route.ts
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx       # 하단 네비게이션
│   │   ├── Header.tsx
│   │   └── GoldFrame.tsx       # 골드 원형 프레임 컴포넌트
│   ├── saju/
│   │   ├── SajuForm.tsx        # 생년월일 입력 폼
│   │   ├── SajuPillar.tsx      # 사주 기둥 표시 (년주/월주/일주/시주)
│   │   ├── OhengChart.tsx      # 오행 분포 차트
│   │   └── InterpretCard.tsx   # 해석 결과 카드
│   ├── ui/
│   │   ├── GoldButton.tsx
│   │   ├── GoldInput.tsx
│   │   ├── GoldCard.tsx
│   │   ├── CoinBadge.tsx
│   │   └── LoadingBook.tsx     # 책 넘김 로딩 애니메이션
│   └── decorative/
│       ├── StarField.tsx       # 별 반짝임 배경
│       ├── BookHero.tsx        # 메인 책 SVG 일러스트
│       └── ScrollTexture.tsx   # 두루마리 텍스처
├── lib/
│   ├── prisma.ts               # Prisma 클라이언트
│   ├── saju-calculator.ts      # 사주 계산 로직 (만세력)
│   ├── claude-api.ts           # Claude API 호출 유틸
│   └── constants.ts            # 천간/지지/오행 데이터
├── styles/
│   └── globals.css             # CSS 변수, 폰트, 글로벌 스타일
├── types/
│   └── saju.ts                 # 사주 관련 타입 정의
└── hooks/
    ├── useSajuCalculation.ts
    └── useCoins.ts
```

### 3-3. 핵심 타입 정의

```typescript
// types/saju.ts

// 천간 (10개)
type CheonGan =
  | "甲"
  | "乙"
  | "丙"
  | "丁"
  | "戊"
  | "己"
  | "庚"
  | "辛"
  | "壬"
  | "癸";

// 지지 (12개)
type JiJi =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

// 오행
type Oheng = "木" | "火" | "土" | "金" | "水";

// 사주 기둥
interface Pillar {
  cheonGan: CheonGan;
  jiJi: JiJi;
  oheng: Oheng;
  label: string; // 한글 읽기 (예: "갑자")
}

// 사주팔자
interface SajuResult {
  yearPillar: Pillar; // 년주
  monthPillar: Pillar; // 월주
  dayPillar: Pillar; // 일주
  timePillar: Pillar; // 시주
  ohengDistribution: Record<Oheng, number>; // 오행 비율
}

// 사주 입력값
interface SajuInput {
  name: string;
  birthDate: {
    year: number;
    month: number;
    day: number;
    isLunar: boolean; // 음력 여부
  };
  birthTime: string | null; // 12지지 시간 or null(모름)
  gender: "male" | "female";
}

// AI 해석 결과
interface SajuInterpretation {
  id: string;
  summary: string; // 종합 요약 (1~2줄)
  categories: {
    career: string; // 직업운
    wealth: string; // 재물운
    love: string; // 연애운
    health: string; // 건강운
  };
  advice: string; // 종합 조언
  luckyElements: {
    color: string;
    number: number;
    direction: string;
  };
  createdAt: Date;
}

// 오늘의 운세
interface TodayFortune {
  date: string;
  overallScore: number; // 1~100
  message: string;
  categories: {
    career: number;
    wealth: number;
    love: number;
    health: number;
  };
}
```

### 3-4. Prisma 스키마

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  coins         Int       @default(100)
  freeReadings  Int       @default(3)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sajuResults   SajuResult[]
  todayFortunes TodayFortune[]
}

model SajuResult {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])

  // 입력값
  name            String
  birthYear       Int
  birthMonth      Int
  birthDay        Int
  isLunar         Boolean  @default(false)
  birthTime       String?
  gender          String

  // 사주 계산 결과 (JSON)
  pillars         Json     // { yearPillar, monthPillar, dayPillar, timePillar }
  ohengDist       Json     // { 木: 40, 火: 20, ... }

  // AI 해석 결과 (JSON)
  interpretation  Json     // SajuInterpretation 전체

  createdAt       DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
}

model TodayFortune {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      String   // "2026-02-26"
  result    Json     // TodayFortune 타입
  createdAt DateTime @default(now())

  @@unique([userId, date])
}
```

### 3-5. Claude API 연동 (사주 해석)

```typescript
// lib/claude-api.ts

const SYSTEM_PROMPT = `
당신은 한국 전통 사주(四柱) 전문 해석가입니다.
사용자의 사주팔자(년주, 월주, 일주, 시주)와 오행 분포를 기반으로
상세하고 긍정적인 해석을 제공합니다.

규칙:
1. 한국어로 답변합니다.
2. 전문 용어는 쉽게 풀어서 설명합니다.
3. 긍정적이면서도 현실적인 조언을 제공합니다.
4. 아래 JSON 형식으로만 응답합니다.

응답 형식:
{
  "summary": "종합 요약 (2줄 이내)",
  "categories": {
    "career": "직업운 해석 (3~5줄)",
    "wealth": "재물운 해석 (3~5줄)",
    "love": "연애운 해석 (3~5줄)",
    "health": "건강운 해석 (3~5줄)"
  },
  "advice": "종합 조언 (2~3줄)",
  "luckyElements": {
    "color": "행운의 색",
    "number": 행운의 숫자,
    "direction": "행운의 방향"
  }
}
`;

export async function interpretSaju(
  sajuResult: SajuResult,
): Promise<SajuInterpretation> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `
          이름: ${sajuResult.name}
          성별: ${sajuResult.gender === "male" ? "남" : "여"}
          년주: ${sajuResult.yearPillar.cheonGan}${sajuResult.yearPillar.jiJi}
          월주: ${sajuResult.monthPillar.cheonGan}${sajuResult.monthPillar.jiJi}
          일주: ${sajuResult.dayPillar.cheonGan}${sajuResult.dayPillar.jiJi}
          시주: ${sajuResult.timePillar?.cheonGan ?? "미상"}${sajuResult.timePillar?.jiJi ?? ""}
          오행분포: 木${sajuResult.ohengDistribution.木}% 火${sajuResult.ohengDistribution.火}% 土${sajuResult.ohengDistribution.土}% 金${sajuResult.ohengDistribution.金}% 水${sajuResult.ohengDistribution.水}%
        `,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content[0].text;
  return JSON.parse(text);
}
```

### 3-6. 사주 계산 로직 (만세력 기반)

```typescript
// lib/saju-calculator.ts
// NOTE: 실제 만세력 계산은 복잡하므로,
// 아래 npm 패키지 사용을 권장:
// - korean-lunar-calendar (음양력 변환)
// - 또는 직접 만세력 테이블 구현

// 핵심 구현 사항:
// 1. 양력 → 음력 변환 (음력 입력 시 스킵)
// 2. 년주 계산: (년도 - 4) % 60 → 육십갑자 인덱스
// 3. 월주 계산: 년간 기준 월간 산출 + 월지(인묘진사오미신유술해자축)
// 4. 일주 계산: 기준일로부터 일수 계산 → 육십갑자
// 5. 시주 계산: 일간 기준 시간 산출 + 시지
// 6. 오행 분포 집계

export function calculateSaju(input: SajuInput): SajuResult {
  // TODO: 만세력 기반 구현
  // npm install korean-lunar-calendar 활용
}
```

---

## 4. 핵심 컴포넌트 구현 가이드

### 4-1. 골드 원형 프레임 (`GoldFrame.tsx`)

Faladdin 레퍼런스의 원형 골드 테두리를 재현한다.

```
구현 포인트:
- 원형 컨테이너 (border-radius: 50%)
- 이중 보더: 외곽 골드 실선 + 내부 골드 점선
- box-shadow로 골드 글로우 효과
- 내부에 children (책 SVG 등) 배치
- 로딩 시 테두리 회전 애니메이션 (framer-motion)
```

### 4-2. 책 넘김 로딩 (`LoadingBook.tsx`)

```
구현 포인트:
- CSS perspective + rotateY로 책 페이지 넘김
- 3~4장 페이지가 순차적으로 넘어가는 효과
- 페이지에 사주 관련 한자가 스쳐 지나감
- 골드 컬러 + 반투명 효과
- "운명의 책을 펼치는 중..." 텍스트
```

### 4-3. 별 반짝임 배경 (`StarField.tsx`)

```
구현 포인트:
- position: fixed, 전체 화면 커버
- 30~50개 작은 골드 점 (1~3px)
- 각각 다른 opacity 애니메이션 (twinkle)
- animation-delay 랜덤 분배
- pointer-events: none (클릭 방해 안함)
```

### 4-4. 오행 차트 (`OhengChart.tsx`)

```
구현 포인트:
- 5개 가로 바 차트
- 각 오행별 고유 컬러: 木(#4ade80) 火(#f87171) 土(#fbbf24) 金(#e8e0d0) 水(#60a5fa)
- 바 배경: rgba(255,215,0,0.1)
- 퍼센트 숫자 골드
- 바 채워지는 애니메이션 (0 → target%, 0.8s ease-out)
```

---

## 5. 글로벌 CSS

```css
/* styles/globals.css */

@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Cormorant+Garamond:wght@400;600;700&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* 위 3-1의 컬러 변수 전체 삽입 */
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family:
    "Pretendard",
    -apple-system,
    sans-serif;
}

/* 골드 글로우 유틸리티 */
.gold-glow {
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.15),
    0 0 40px rgba(255, 215, 0, 0.05);
}

.gold-glow-strong {
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.1);
}

/* 골드 텍스트 그라디언트 */
.gold-text {
  background: linear-gradient(135deg, #c9a84c, #ffd700, #c9a84c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 노이즈 텍스처 오버레이 */
.noise-overlay::before {
  content: "";
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* noise SVG */
  pointer-events: none;
  z-index: 9999;
}

/* 별 반짝임 */
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

/* 책 페이지 넘김 */
@keyframes pageFlip {
  0% {
    transform: perspective(800px) rotateY(0deg);
  }
  100% {
    transform: perspective(800px) rotateY(-180deg);
  }
}
```

---

## 6. 개발 우선순위 (Claude CLI 작업 순서)

### Phase 1: 기반 세팅 (먼저)

1. Next.js 프로젝트 초기화 + Tailwind 설정
2. `globals.css` 컬러 변수 + 폰트 적용
3. 루트 레이아웃 (`layout.tsx`) — 메타태그, 다크 배경
4. `BottomNav.tsx` 하단 네비게이션
5. `GoldButton`, `GoldInput`, `GoldCard` UI 컴포넌트

### Phase 2: 홈 화면

6. `StarField.tsx` 별 배경
7. `BookHero.tsx` 메인 책 SVG + `GoldFrame.tsx`
8. 홈 페이지 조립 (`page.tsx`)
9. 메뉴 카드 4개 (사주/운세/궁합/기록)

### Phase 3: 사주 핵심 플로우

10. `SajuForm.tsx` 입력 폼 (생년월일 + 시간 + 성별)
11. `LoadingBook.tsx` 로딩 애니메이션
12. Prisma 스키마 + DB 마이그레이션
13. `saju-calculator.ts` 만세력 계산
14. `claude-api.ts` Claude 연동
15. `SajuPillar.tsx` + `OhengChart.tsx` + `InterpretCard.tsx`
16. 결과 페이지 조립

### Phase 4: 부가 기능

17. 오늘의 운세 페이지
18. 궁합 보기
19. 기록/히스토리
20. 마이페이지 + 코인 시스템
21. 로그인/회원가입 (NextAuth)
22. 결과 공유 (OG Image)

---

## 7. 환경 변수

```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/saju_db"
ANTHROPIC_API_KEY="sk-ant-..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

---

## 8. 참고사항

- **모바일 퍼스트**: 모든 UI는 375px 기준 설계, 768px 이상에서 반응형
- **다크 모드 전용**: 라이트 모드 미지원 (테마 특성상)
- **폰트 로딩**: `next/font` 사용하여 FOUT 방지
- **이미지 최적화**: `next/image` 사용, SVG는 인라인 or 컴포넌트
- **SEO**: 각 페이지별 메타데이터 + OG Image (결과 공유용)
- **성능**: 사주 계산은 서버사이드, AI 해석은 스트리밍 응답 고려
