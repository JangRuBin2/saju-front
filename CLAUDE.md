# saju-front - Claude Code 팀 개발 가이드

## 프로젝트 개요
사주(四柱) 웹 서비스 프론트엔드. Next.js 16 + TypeScript + BFF 패턴.

## 기술 스택
- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4, Framer Motion, Lucide React
- Auth.js v5 (Kakao/Naver/Google OAuth)
- Prisma 6 + PostgreSQL, 토스페이먼츠
- next-intl (ko, en, ja, zh)
- 백엔드: FastAPI (Python) - 별도 서버

## 디자인 시스템: "심야의 책방"
- 다크 + 골드 무드 (배경 #0a0e1a, 골드 #ffd700)
- 컴포넌트: GoldButton, GoldCard, GoldInput, GoldSelect, GoldToggle
- 폰트: Pretendard (본문), Noto Serif KR (제목)

## 코드 컨벤션
- 컴포넌트: PascalCase (e.g., `SajuForm.tsx`)
- 훅: camelCase `use` prefix (e.g., `useSajuReading.ts`)
- 서버 전용 코드: `src/lib/server/` 디렉토리
- API Routes: `src/app/api/` 디렉토리
- Server Actions: `src/lib/server/actions.ts`
- 4개 언어 번역 필수: `messages/{ko,en,ja,zh}.json`
- i18n 라우팅: `src/app/[locale]/` 아래에 페이지 배치

## 아키텍처 원칙
- BFF 패턴: 브라우저 → Next.js → Python API 서버 (직접 접근 금지)
- 인증/결제/사용량은 Next.js가 소유
- API 서버 통신: HMAC-SHA256 서비스 토큰 (`src/lib/server/service-token.ts`)
- 무료/프리미엄 tier 분리 (`src/lib/server/usage-limiter.ts`)

## 주요 디렉토리
```
src/app/[locale]/     # 페이지 (라우트)
src/components/       # UI 컴포넌트 (auth/, layout/, saju/, ui/, decorative/)
src/hooks/            # 커스텀 훅
src/lib/              # 유틸리티 (auth, errors, sse-client, constants)
src/lib/server/       # 서버 전용 (prisma, actions, service-token 등)
src/types/            # 타입 정의
messages/             # i18n 번역 파일
prisma/               # DB 스키마
```

## 팀 피처 개발 워크플로우

### 핵심 규칙
1. **피처 시작 전**: `docs/team/features/` 에 피처 MD 파일 생성 (템플릿 사용)
2. **작업 중**: MD 파일에 진행 상황 업데이트 (토큰 소진 대비)
3. **작업 완료**: MD 파일 상태를 "완료"로 변경

### 피처 MD 파일 사용법
- 새 피처 시작: `docs/team/features/_TEMPLATE.md` 복사 → `FEAT-{이름}.md`로 저장
- 이 파일을 먼저 읽고 컨텍스트를 파악한 후 작업 시작
- 작업 중간에 반드시 진행 상황을 MD 파일에 기록

### 세션 시작 시 (토큰 소진 후 재시작)
1. `docs/team/features/` 에서 진행 중인 피처 파일 확인
2. 해당 MD 파일 읽기 → 현재 상태와 다음 작업 파악
3. 이어서 작업 진행

## 명령어
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npx prisma generate  # Prisma 클라이언트 생성
npx prisma studio    # DB GUI
```

## 환경 변수
`.env.local` 필요 — `ARCHITECTURE_DECISION.md` 참조. `.env` 파일은 절대 커밋하지 않음.
