# 팀 개발 워크플로우

## 개요
Claude Code를 활용한 팀 단위 피처 개발 워크플로우.
토큰 소진에 대비해 MD 파일로 작업 상태를 추적한다.

---

## 피처 개발 프로세스

### 1. 피처 시작
```bash
# 템플릿 복사
cp docs/team/features/_TEMPLATE.md docs/team/features/FEAT-{피처이름}.md
```

Claude Code에게 지시:
```
docs/team/features/FEAT-{피처이름}.md 를 읽고, 이 피처를 구현해줘.
```

### 2. 작업 중
- Claude Code가 자동으로 MD 파일에 진행 상황 기록
- 코드 변경과 함께 MD 파일도 업데이트

### 3. 토큰 소진 → 새 세션
새 Claude Code 세션에서:
```
docs/team/features/ 폴더에서 진행 중인 피처를 확인하고 이어서 작업해줘.
```
Claude Code가 MD 파일을 읽고 컨텍스트를 복구하여 이어서 작업.

### 4. 피처 완료
- MD 파일 상태를 "완료"로 변경
- git commit & push

---

## 자동 승인 설정

`.claude/settings.local.json`에 모든 일반 개발 작업이 자동 승인되도록 설정됨:
- 파일 읽기/쓰기/편집
- npm/npx/node 명령어
- git 명령어
- 검색 도구 (Glob, Grep)
- 웹 검색/Fetch

**주의**: `rm`, `git push --force` 등 위험 명령어는 자동 승인 목록에 포함되지 않음.

---

## 팀원별 브랜치 전략

```
main
├── feat/{피처이름}        # 피처 브랜치
├── fix/{버그이름}         # 버그 수정
└── refactor/{대상}       # 리팩터링
```

### 브랜치 작업 흐름
```bash
# 1. 피처 브랜치 생성
git checkout -b feat/{피처이름}

# 2. 작업 & 커밋
git add . && git commit -m "feat: ..."

# 3. 푸시 & PR
git push -u origin feat/{피처이름}
# GitHub에서 PR 생성
```

---

## 피처 MD 파일 규칙

| 항목 | 설명 |
|------|------|
| 파일명 | `FEAT-{피처이름}.md` (대문자, 하이픈 구분) |
| 위치 | `docs/team/features/` |
| 필수 섹션 | 목표, 요구사항, 영향 범위, 구현 계획, 진행 로그 |
| 업데이트 타이밍 | 매 세션 종료 시 or 주요 마일스톤 달성 시 |

### 진행 로그 작성 예시
```markdown
### [2026-03-02] 세션 1
- **완료한 작업:**
  - SajuForm 컴포넌트에 음력 변환 기능 추가
  - `src/components/saju/LunarConverter.tsx` 신규 생성
- **현재 상태:**
  - 변환 로직 완료, UI 연결 진행 중
  - `src/app/[locale]/saju/page.tsx` 수정 필요
- **다음 작업:**
  - page.tsx에 LunarConverter 통합
  - 번역 키 추가 (messages/*.json)
```

---

## Claude Code 세션 시작 프롬프트 예시

### 새 피처 시작
```
docs/team/features/_TEMPLATE.md를 복사해서 FEAT-음력변환.md를 만들고,
사주 입력 폼에 음력 날짜 변환 기능을 구현해줘.
```

### 이어서 작업
```
docs/team/features/ 에서 "진행 중"인 피처를 찾아서 이어서 작업해줘.
```

### 특정 피처 이어하기
```
docs/team/features/FEAT-음력변환.md 를 읽고 이어서 작업해줘.
```
