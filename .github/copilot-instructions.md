# Copilot / AI Agent 가이드 — counting-letters

Vite + React + TypeScript로 만든 다국어 텍스트 분석 앱입니다. AI 에이전트가 빠르게 작업하기 위한 핵심 정보를 정리했습니다.

## 주요 명령어
```bash
pnpm install   # 의존성 설치 (pnpm-lock.yaml 사용)
pnpm dev       # 개발 서버 실행 (자동 새로고침)
pnpm build     # 타입 체크 후 배포 폴더(dist/) 생성
pnpm lint      # 코드 스타일 검사
pnpm preview   # dist/ 폴더 로컬에서 미리보기
```

## 앱 구조 이해하기

**시작 흐름 (순서대로):**
1. [src/main.tsx](src/main.tsx#L1) — 첫 방문자를 브라우저 언어로 자동 이동 (URL 경로나 저장된 선택 존중)
2. [src/i18n.ts](src/i18n.ts#L1) — 언어 설정 초기화 (우선순위: URL → 저장된 선택 → 기본값 `ko`)
3. [src/App.tsx](src/App.tsx#L1) — 화면 레이아웃 + 언어 동기화 + 텍스트 입력 및 통계 표시

**화면 구성 (컴포넌트들):**
- `Controls` — 오른쪽 위 언어선택 + 다크모드 버튼
- `Header` — 제목
- `StatsCard` — 통계 카드 (숫자 + 라벨)
- `ZhStats` — **중국어 전용** 추가 통계 (한자수, 영단어, 구두점, 줄수, 바이트)
- `NetworkMonitor`, `FooterInfo`, `BuyMeACoffeeButton` — 기타 UI

**텍스트 세기 함수들:**
[src/utils/count.ts](src/utils/count.ts#L1)에 모든 함수가 있습니다:
- `countCharsWithSpaces/Without` — 공백 포함/제외 문자수 (모든 언어 문자 지원)
- `countWords` — 일반 단어수 (공백 기준)
- **`countThaiWords`** — 태국어 전용 (특수 규칙: `/`는 공백으로, `-`는 유지)
- **`countChineseChars`** — 중국 한자만 카운트 (구두점 제외)
- `countEnglishWords`, `countChinesePunctuation`, `countDigits`, `countLines`, `countBytes` — 정규식으로 계산

**디자인:**
- `@heroui/react` v2.8+ (UI 컴포넌트)
- `@tailwindcss/vite` (스타일)
- 다크모드는 HTML 태그에 직접 적용

**배포:**
- 최종 파일: `dist/` 폴더
- Cloudflare 설정: [wrangler.jsonc](wrangler.jsonc)

## ⚠️ 꼭 알아야 할 패턴들

### 언어 선택 흐름 (중요!)
언어 선택이 **3군데**에서 일어나므로, 이들이 서로 영향을 미칩니다:
- **[src/main.tsx](src/main.tsx#L1)** — 첫 방문: 브라우저 언어로 자동 이동 (앱 시작 전)
- **[src/i18n.ts](src/i18n.ts#L1)** — 앱 시작 시: URL보고 → 저장된 선택보고 → 기본값(한국어)
- **[src/App.tsx](src/App.tsx#L1)** — 앱 실행 중: 드롭다운으로 선택한 언어와 URL 변경 감지

🚨 **주의:** 이 부분을 건드릴 때는 꼭 테스트하세요!
- `/ko`, `/en`, `/zh`, `/ja`, `/th` 경로 접속
- 첫 방문 시 브라우저 언어 자동 이동
- 드롭다운으로 언어 변경
- 새로고침 후 선택 유지 확인

### 중국어 통계 패널 (ZhStats)
- **중국어(`zh`) 선택했을 때만** 추가 통계 보입니다
- 보여주는 통계: 한자수, 영단어수, 중국 구두점수, 줄수, 바이트
- 다른 언어로 바꾸면 자동으로 닫힙니다
- ⚠️ 중국어 세기 규칙 변경 시:
  - [src/utils/count.ts](src/utils/count.ts#L1) 함수 수정
  - [src/App.tsx](src/App.tsx#L1) 통계 표시 부분 수정
  - [src/components/ZhStats.tsx](src/components/ZhStats.tsx) 화면 표시 수정

### 태국어 단어 세기 (특수)
- 다른 언어랑 다르게 `Intl.Segmenter` 사용 (브라우저 최신 기능)
- 전자주 수정할 파일들

| 파일 | 용도 | 수정할 때 주의사항 |
|------|------|------------------|
| [src/main.tsx](src/main.tsx) | 앱 시작 + 첫 방문 언어 설정 | 브라우저 언어 감지 로직 바꿀 때만 건드세요 |
| [src/App.tsx](src/App.tsx) | 화면 구성 + 상태관리 | 새 통계 추가할 때 여기서 하면 됨 |
| [src/i18n.ts](src/i18n.ts) | 언어 설정 | 언어 우선순위 절대 변경 금지 |
| [src/utils/count.ts](src/utils/count.ts) | **세기 함수들** | 언어별 계산 로직 여기 추가 |
| [src/components/ZhStats.tsx](src/components/ZhStats.tsx) | 중국어 통계 | 중국어 선택했을 때만 보이게 |
| [src/locales/*.json](src/locales) | 번역 (한글/영문/중문 등) | 여기 추가하고 컴포넌트에서 `t('키')` 로 사용 |
| [vite.config.ts](vite.config.ts) | 빌드 설정 | 이미 완성됨, 거의 건드릴 필요 없음 |
| [wrangler.jsonc](wrangler.jsonc) | Cloudflare 배포 설정 | dist/ 폴더 배포 설정 |

## 코드 수정 전 체크리스트
1. **타입 오류 없나**: `pnpm build` 실행해서 오류 없는지 확인
2. **언어 기능 테스트**: `pnpm dev` 로 `/en`, `/ko` 등의 경로에서 제대로 작동하는지 확인
3. **다크모드**: 토글 버튼이 작동하고 검은색/흰색 모두 잘 보이는지 확인
4. **중국어 통계** (수정했다면): ZhStats가 중국어 선택했을 때 나타나고, 다른 언어에서 안 나타나는지 확인
5. **태국어 단어** (수정했다면): "ไทย test" 같은 혼합 텍스트로 테스트
6. **번역**: 새로운 문구 추가하면 모든 언어 파일(`src/locales/*.json`)에 다 넣기 (없으면 영문으로 표시됨)

## 흔한 실수 (금지!)
- **하지마**: 언어 선택 로직을 여러 파일에서 반복하기 → `i18n.ts`에만 통합
- **하지마**: 컴포넌트에서 '한국어'처럼 하드코딩하기 → `useTranslation()` 사용
- **하지마**: 문자 세기에서 `[...text]` 대신 `text.length` 사용 → 이모지 등에서 오류 발생
- **하지마**: 번역 문구를 컴포넌트에 직접 쓰기 → `src/locales/*.json`에만 추가
6. **Translation keys**: Add new i18n keys to ALL locale files (`src/locales/*.json`); missing keys fall back to English

## Avoiding Common Regressions
- **Don't** duplicate language resolution logic; consolidate in `i18n.ts` + refactor call sites
- **Don't** hardcode language in components; import `useTranslation()` and use i18n object
- **Don't** bypass grapheme handling in count functions; always use spread operator `[...]` for text length
- **Don't** add locale data directly to components; keep all strings in `src/locales/*.json`
