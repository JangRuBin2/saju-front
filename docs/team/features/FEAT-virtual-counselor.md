# FEAT: 가상 상담사 캐릭터 시스템

> 작성자: Claude Code
> 시작일: 2026-03-23
> 상태: **기획**

---

## 목표

AI 생성 가상 인물(상담사 캐릭터)이 사주를 봐주는 형태의 UX를 도입하여 몰입감과 차별화를 높이고, 프리미엄 과금 포인트를 확보한다.

## 배경

- 점신, 헬로우봇 등 경쟁 서비스에서 가상 캐릭터가 상담하는 형태가 인기
- 현재 Epic Fortune은 텍스트 기반 결과만 제공 → 몰입감 부족
- ENHANCEMENT-PLAN Phase 3(결과 시각화, Step Wizard)과 시너지 가능

---

## 핵심 컨셉

### 캐릭터 프로필 (초기 3종)

| 코드 | 이름 | 컨셉 | 말투 | 연결 모델 | 티어 |
|------|------|------|------|-----------|------|
| `master-yoon` | 윤도현 도사 | 60대 전통 역술가, 수염, 한복 | 고풍스러운 존댓말 ("~하오", "~이니라") | Sonnet | 무료/기본 |
| `soyeon` | 김소연 선생 | 30대 현대적 명리학자, 정장 | 친근하고 논리적 ("~거든요", "~해볼게요") | Sonnet | 기본 |
| `grandma-moon` | 문 할머니 | 70대 동네 점집 할머니, 정감 | 따뜻한 반말 ("~했구나", "~할 거야") | Opus | 프리미엄 |

> 캐릭터는 추후 확장 가능 (연예인풍, 서양 점술사 등)

### 캐릭터별 프롬프트 전략

```
기본 시스템 프롬프트 + 페르소나 프롬프트 주입

예시 (master-yoon):
"당신은 윤도현이라는 60대 전통 역술가입니다.
40년간 명리학을 연구해온 대가로, 고풍스러운 말투를 사용합니다.
'~하오', '~이니라' 체를 사용하며, 한자 용어를 적절히 섞어 설명합니다.
따뜻하지만 권위 있는 톤으로 조언합니다."
```

---

## 요구사항

### MVP (Phase 1 - 최소 구현)
- [ ] 상담사 캐릭터 3종 정의 (이름, 이미지, 소개, 말투)
- [ ] 상담사 선택 UI (리딩 입력 폼 상단)
- [ ] 결과 페이지에 캐릭터 프로필 표시 (아바타 + 이름 + 한줄 소개)
- [ ] 채팅 스타일 결과 UI (말풍선 형태)
- [ ] 백엔드 API에 `persona` 파라미터 전달
- [ ] 4개 국어 번역 (캐릭터 이름, 소개, 말투 지시문)

### Phase 2 - 고도화
- [ ] 캐릭터별 대화 이력 저장
- [ ] 프리미엄 캐릭터 잠금/해제 (결제 연동)
- [ ] 캐릭터 인기 순위/리뷰
- [ ] 타이핑 애니메이션 (SSE 스트리밍 + 말풍선)
- [ ] 캐릭터별 배경 테마 변경

---

## 영향 범위

### 신규 파일
```
src/types/counselor.ts                          # 상담사 타입 정의
src/components/counselor/CounselorPicker.tsx     # 상담사 선택 카드 UI
src/components/counselor/CounselorProfile.tsx    # 상담사 프로필 표시
src/components/counselor/ChatStyleResult.tsx     # 채팅형 결과 UI
src/lib/counselor-data.ts                       # 상담사 정적 데이터
public/images/counselors/                       # 캐릭터 이미지 에셋
  master-yoon.webp
  soyeon.webp
  grandma-moon.webp
```

### 수정 파일
```
src/components/saju/SajuForm.tsx                # 상담사 선택 통합
src/components/saju/InterpretCard.tsx           # ChatStyleResult 분기 추가
src/hooks/useSajuReading.ts                     # persona 파라미터 전달
src/app/api/saju/reading/route.ts               # persona를 API 서버로 전달
src/types/api.ts                                # 요청 타입에 persona 추가
messages/ko.json                                # 상담사 관련 번역 키
messages/en.json
messages/ja.json
messages/zh.json
```

### 백엔드(Python API) 수정 필요
```
- /saju/reading 엔드포인트에 persona 파라미터 수신
- 프롬프트 빌더에 페르소나 지시문 주입 로직
- 캐릭터별 말투 프롬프트 템플릿 관리
```

---

## 구현 계획

### Step 1: 타입 및 데이터 정의
- `src/types/counselor.ts` - Counselor 인터페이스 정의
- `src/lib/counselor-data.ts` - 3종 캐릭터 정적 데이터
- `src/types/api.ts` - ReadingRequest에 `counselorId` 필드 추가
- **핵심 타입:**
  ```typescript
  interface Counselor {
    id: string;             // 'master-yoon' | 'soyeon' | 'grandma-moon'
    name: string;           // i18n 키 참조
    title: string;          // "전통 역술가" 등
    description: string;    // 한줄 소개
    imagePath: string;      // '/images/counselors/master-yoon.webp'
    tier: 'free' | 'basic' | 'premium';
    promptPersona: string;  // AI 프롬프트용 페르소나 지시문
    speechStyle: string;    // 말투 예시
  }
  ```

### Step 2: 캐릭터 이미지 에셋 준비
- 3종 캐릭터 WebP 이미지 (400x400, 프로필용)
- "심야의 책방" 디자인 톤에 맞는 다크 + 골드 색감
- **이미지 제작 순서 (확정):**
  1. **1차: AI 생성 이미지** (즉시 적용)
     - Midjourney / DALL-E / Stable Diffusion 등으로 인물 이미지 생성
     - 상업적 이용 가능한 도구 사용 (Midjourney Paid Plan 등)
     - 모든 이미지에 **"AI 생성 이미지"** 표기 필수
     - 프로필 하단에 "AI Generated Image" 뱃지 상시 노출
  2. **2차: 실루엣/아이콘 스타일** (A/B 테스트용 대안)
     - AI 이미지 기반으로 실루엣화 또는 아이콘 스타일 변환
     - 사용자 반응 비교 후 더 나은 방향 채택
  3. **3차: 전문 일러스트레이터 의뢰** (브랜딩 고도화)
     - 서비스 성장 후 캐릭터 IP화를 위해 고퀄리티 일러스트 제작
     - AI 이미지를 레퍼런스로 제공하여 방향성 통일
- **AI 이미지 생성 프롬프트 가이드:**
  ```
  master-yoon: "Korean elderly male fortune teller, 60s, long white beard,
    traditional hanbok, wise and warm expression, dark moody background
    with gold accents, portrait style, cinematic lighting"

  soyeon: "Korean professional woman, early 30s, modern business attire,
    confident and approachable smile, dark elegant background with
    gold lighting, portrait style, studio photography"

  grandma-moon: "Korean elderly grandmother, 70s, warm gentle smile,
    traditional Korean clothing, cozy atmosphere, dark background
    with warm gold tones, portrait style, soft lighting"
  ```
- **이미지 규격:**
  - 원본: 1024x1024 (AI 생성 기본)
  - 프로필용: 400x400 WebP (quality 85)
  - 썸네일용: 120x120 WebP (선택 카드용)
  - `next/image`로 자동 최적화

### Step 3: 상담사 선택 UI
- `CounselorPicker.tsx` - 가로 스크롤 카드 3종
- 각 카드: 아바타 이미지 + 이름 + 한줄 소개 + 티어 뱃지
- 프리미엄 캐릭터는 잠금 아이콘 + "프리미엄" 뱃지
- 선택 시 골드 테두리 하이라이트
- `SajuForm.tsx`에 통합 (입력 폼 상단에 배치)

### Step 4: 채팅 스타일 결과 UI
- `ChatStyleResult.tsx` - 말풍선 형태 결과 표시
  ```
  [캐릭터 아바타] 캐릭터 이름
  ┌─────────────────────────┐
  │ 안녕하시오. 그대의 사주를 │
  │ 살펴보았소이다...         │
  └─────────────────────────┘
  ```
- SSE 스트리밍 시 타이핑 효과 (글자 단위 애니메이션)
- 섹션별로 말풍선 분리 (요약 → 상세 분석 → 조언)
- 기존 `InterpretCard`는 유지 (캐릭터 미선택 시 폴백)

### Step 5: BFF API 연동
- `useSajuReading.ts` - 선택된 counselorId를 요청에 포함
- `src/app/api/saju/reading/route.ts` - Python API로 persona 전달
- Python API에서 프롬프트에 페르소나 지시문 삽입

### Step 6: 다국어 대응
- `messages/*.json`에 상담사 관련 키 추가:
  ```json
  {
    "counselor": {
      "selectTitle": "상담사를 선택하세요",
      "selectDescription": "각 상담사마다 고유한 해석 스타일이 있습니다",
      "masterYoon": {
        "name": "윤도현 도사",
        "title": "전통 역술가",
        "description": "40년 경력의 정통 명리학 대가"
      },
      "soyeon": {
        "name": "김소연 선생",
        "title": "현대 명리학자",
        "description": "논리적이고 친근한 현대식 해석"
      },
      "grandmaMoon": {
        "name": "문 할머니",
        "title": "인생 상담가",
        "description": "따뜻한 인생 조언과 깊은 통찰"
      },
      "premiumBadge": "프리미엄",
      "locked": "프리미엄 결제 후 이용 가능"
    }
  }
  ```
- **주의**: 페르소나 프롬프트는 각 언어별로 별도 작성 필요
  - 한국어: "~하오", "~이니라" 체
  - 영어: archaic English ("Thou shalt...", "I perceive...")
  - 일본어: 경어/반말 체계 반영
  - 중국어: 문어체/구어체 구분

---

## 법적/윤리적 고려사항

### AI 창작물 표시 (확정 방침)
모든 가상 상담사 관련 콘텐츠에 AI 창작물임을 명확히 표시한다.

#### 1. 이미지 AI 생성 표시
- 캐릭터 프로필 이미지 하단에 **"AI Generated"** 뱃지 상시 노출
- 뱃지 스타일: 반투명 다크 배경 + 작은 텍스트 (이미지 위 오버레이)
- 구현: `CounselorProfile.tsx`에 뱃지 컴포넌트 포함
  ```
  ┌────────────┐
  │            │
  │  (인물사진) │
  │            │
  │ AI Generated│  ← 우하단 오버레이 뱃지
  └────────────┘
  ```

#### 2. 가상 캐릭터 고지
- 상담사 선택 UI 상단: "AI가 만든 가상의 상담사입니다"
- 캐릭터 프로필 카드: 이름 옆에 "AI 캐릭터" 태그
- 결과 페이지 상단: "AI 가상 상담사의 해석입니다"

#### 3. 면책 조항
- 결과 페이지 하단 고정 표시:
  > "본 콘텐츠는 AI가 생성한 엔터테인먼트 콘텐츠입니다.
  > 상담사 이미지는 AI로 생성된 가상의 인물이며, 실존 인물이 아닙니다.
  > 전문적인 상담을 대체하지 않습니다."
- 4개 국어 번역 필수

#### 4. 다국어 고지 문구
| 언어 | AI 이미지 뱃지 | 캐릭터 태그 | 면책 문구 |
|------|---------------|------------|----------|
| ko | AI 생성 이미지 | AI 캐릭터 | AI가 생성한 엔터테인먼트 콘텐츠입니다 |
| en | AI Generated | AI Character | This is AI-generated entertainment content |
| ja | AI生成画像 | AIキャラクター | AIが生成したエンターテインメントコンテンツです |
| zh | AI生成图片 | AI角色 | 此为AI生成的娱乐内容 |

### 이미지 저작권 관리
- AI 이미지 생성 도구의 **상업적 이용 가능 플랜** 사용 필수
  - Midjourney: Pro Plan 이상 (상업적 이용 허용)
  - DALL-E: API 사용 시 생성물 소유권 사용자에게 귀속
  - Stable Diffusion: 오픈소스 모델 사용 시 라이선스 확인
- 생성된 이미지의 **원본 프롬프트 및 도구 정보 기록** (내부 문서화)
- 이미지 메타데이터에 AI 생성 정보 포함 권장

### 회피 사항
- 실존 인물과 혼동될 수 있는 이미지/이름 사용 금지
- 프롬프트에 실존 인물 이름/특징 참조 금지
- 의료/법률/투자 등 전문 영역 조언으로 오인될 표현 금지
- 사용자 개인정보를 캐릭터 응답에 불필요하게 노출하지 않음

---

## UI/UX 와이어프레임

### 상담사 선택 (SajuForm 상단)
```
┌──────────────────────────────────────────────┐
│  상담사를 선택하세요                            │
│  각 상담사마다 고유한 해석 스타일이 있습니다       │
│                                              │
│  ┌──────┐  ┌──────┐  ┌──────────┐           │
│  │(아바타)│  │(아바타)│  │ (아바타)  │           │
│  │윤도현  │  │김소연  │  │ 문 할머니 │           │
│  │ 도사   │  │ 선생   │  │ PREMIUM  │           │
│  │[선택됨]│  │       │  │  [잠금]   │           │
│  └──────┘  └──────┘  └──────────┘           │
│                                              │
│  ── 생년월일 입력 ──                           │
│  ...                                         │
└──────────────────────────────────────────────┘
```

### 채팅형 결과 페이지
```
┌──────────────────────────────────────────────┐
│  ┌───┐ 윤도현 도사                            │
│  │   │ 전통 역술가 | 40년 경력                  │
│  └───┘                                       │
│                                              │
│  ┌────────────────────────────────┐          │
│  │ 허허, 그대의 사주를 살펴보았소이다. │          │
│  │ 참으로 흥미로운 팔자로구려.       │          │
│  └────────────────────────────────┘          │
│                                              │
│  ┌────────────────────────────────┐          │
│  │ [성격과 기질]                    │          │
│  │ 그대는 갑목(甲木) 일간이니,      │          │
│  │ 큰 나무와 같은 기상을 지녔소.     │          │
│  │ ...                             │          │
│  └────────────────────────────────┘          │
│                                              │
│  ┌────────────────────────────────┐          │
│  │ [총평과 조언]                    │          │
│  │ 올 한해는 특히 인내가 필요한      │          │
│  │ 시기이니, 큰 결정은 삼가하시오.    │          │
│  └────────────────────────────────┘          │
│                                              │
│  ⚠ AI 가상 캐릭터가 제공하는                   │
│    엔터테인먼트 콘텐츠입니다.                    │
│                                              │
│  [공유하기]  [다른 상담사로 다시 보기]            │
└──────────────────────────────────────────────┘
```

---

## 수익화 연계

| 전략 | 설명 |
|------|------|
| 프리미엄 캐릭터 | Opus 모델 연결 → 더 깊은 해석 → 높은 가격 (5,900원) |
| 캐릭터 전환 리딩 | "다른 상담사 시각으로 다시 보기" → 추가 결제 유도 |
| 한정 캐릭터 | 시즌별/이벤트 캐릭터 (설날 특별 도사 등) → 희소성 마케팅 |
| 캐릭터 굿즈 | 인기 캐릭터 IP화 가능성 (장기) |

---

## 우선순위 및 일정 제안

| 순서 | 작업 | 예상 Phase | 의존성 |
|------|------|-----------|--------|
| 1 | 타입/데이터 정의 | Phase 3과 병행 | 없음 |
| 2 | AI 이미지 생성 (1차) | Phase 3과 병행 | 생성 도구 유료 플랜 확보 |
| 3 | 상담사 선택 UI + AI 고지 뱃지 | Phase 3 | Step 1, 2 완료 |
| 4 | 채팅형 결과 UI + 면책 조항 | Phase 3 | Step Wizard, 결과 시각화와 함께 |
| 5 | 백엔드 페르소나 주입 | Phase 3 | Python API 수정 필요 |
| 6 | 다국어 대응 (고지 문구 포함) | Phase 3 | Step 1~5 완료 |
| 7 | 실루엣 이미지 변환 (2차) | Phase 4 | A/B 테스트로 1차와 비교 |
| 8 | 프리미엄 잠금/결제 | Phase 4 | Paywall 시스템 완료 |
| 9 | 타이핑 애니메이션 | Phase 4 | SSE 스트리밍 안정화 |
| 10 | 전문 일러스트 의뢰 (3차) | Phase 5 | 서비스 성장 확인 후 |

---

## 기술 메모
- 캐릭터 데이터는 초기에 정적 데이터(`counselor-data.ts`)로 관리, 이후 DB 이관 고려
- 이미지는 `next/image`로 최적화 (WebP, 400x400 기준)
- SSE 스트리밍 + 채팅 UI 조합 시 `InterpretCard`의 스트리밍 로직 재활용 가능
- 페르소나 프롬프트 길이가 토큰에 미치는 영향 측정 필요 (약 200~400 토큰 추가 예상)

## 테스트
- [ ] 로컬 빌드 (`npm run build`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 4개 언어 번역 확인
- [ ] 캐릭터별 말투 일관성 확인 (각 언어)
- [ ] 프리미엄 캐릭터 잠금/해제 동작 확인
- [ ] SSE 스트리밍 + 채팅 UI 렌더링 확인
- [ ] 모바일 반응형 레이아웃 확인
- [ ] AI 고지 문구 표시 확인

---

## 진행 로그

### [2026-03-23] 세션 1
- **완료한 작업:**
  - 기획 문서 초안 작성
  - 캐릭터 3종 컨셉 정의
  - UI 와이어프레임 설계
  - 영향 범위 및 구현 계획 수립
  - 이미지 에셋 전략 확정: AI 생성 → 실루엣 → 일러스트 의뢰 순서
  - AI 창작물 표시 방침 확정 (이미지 뱃지 + 캐릭터 태그 + 면책 조항)
  - AI 이미지 생성 프롬프트 가이드 작성
  - 4개 국어 고지 문구 정의
- **현재 상태:**
  - 기획 확정, 프론트엔드 구현 완료
- **확정된 방향:**
  - 인물 이미지는 AI로 생성, "AI 생성 이미지" 표기 필수
  - 이미지 제작 순서: AI 생성(즉시) → 실루엣(A/B테스트) → 일러스트 의뢰(장기)

### [2026-03-23] 세션 2
- **완료한 작업:**
  - Step 1: 타입 정의 (`src/types/counselor.ts`), 정적 데이터 (`src/lib/counselor-data.ts`), API 타입에 `counselor_id` 추가
  - Step 2: `CounselorAvatar` (이니셜 폴백 + AI 뱃지), `CounselorPicker` (선택 카드 UI)
  - Step 3: `ChatStyleResult` (말풍선 형태 결과 UI + 면책 조항)
  - Step 4: `SajuForm`에 상담사 선택 통합, `useSajuReading` 훅에 counselorId 전달, `InterpretCard`에서 ChatStyleResult 분기, saju 입력/결과 페이지 연동, 기타 페이지에는 `showCounselorPicker={false}`
  - Step 5: 4개 국어 번역 완료 (ko, en, ja, zh)
  - TypeScript 컴파일 통과
- **현재 상태:**
  - 프론트엔드 코드 완료, 이미지 에셋 완료
- **다음 작업:**
  - 백엔드(Python API)에 `counselor_id` 파라미터 수신 및 페르소나 프롬프트 주입 로직 추가
  - 프리미엄 캐릭터 잠금/해제 로직 (Paywall 연동 시)

### [2026-03-24] 세션 3
- **완료한 작업:**
  - AI 생성 이미지 3종 배치 완료 (나노바나나 제작)
    - `public/images/counselors/master-yoon.png`
    - `public/images/counselors/soyeon.png`
    - `public/images/counselors/grandma-moon.png`
  - `counselor-data.ts` imagePath를 .png로 업데이트
- **현재 상태:**
  - 상담사 캐릭터 시스템 프론트엔드 완전 완료 (코드 + 이미지)
- **다음 작업:**
  - 백엔드(Python API)에 `counselor_id` 파라미터 수신 및 페르소나 프롬프트 주입 로직 추가
  - 프리미엄 캐릭터 잠금/해제 로직 (Paywall 연동 시)
