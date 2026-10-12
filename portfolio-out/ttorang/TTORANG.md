# 1. 3분 요약

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | 또랑 (TTORANG) |
| 한 줄 소개 | 프레젠테이션 슬라이드를 업로드하고 발표 영상을 녹화하여 실시간 피드백을 주고받는 협업 플랫폼의 웹 프론트엔드입니다. |
| 이 레포의 성격 | React 19 + TypeScript 웹 프론트엔드 단독 레포입니다 (백엔드는 별도 레포로 추정되며, 이 문서는 프론트엔드 레포에서 확인되는 내용만 다룹니다). |
| 전체 프로젝트 기간 | 2025-12-28 ~ 2026-02-16 (전체 커밋 로그 기준, `git log --reverse`) |
| 본인 기여 기간 | 2026-01-10 ~ 2026-02-16 (약 5주) |
| 팀 구성 | GitHub 커밋 이력 기준 14명 (`git shortlog -sne --all`) |
| 담당 범위 | 영상 녹화/업로드 기능 전체(디바이스 테스트, MediaRecorder 녹화, 청크 업로드, 영상 목록/상세, 타임스탬프 댓글) |
| 지원 직무 관점 | 웹 개발자(풀스택 지향) 기준으로, 프론트엔드 구현뿐 아니라 API 연동 계층 설계와 배포 파이프라인 이해도까지 정리했습니다. |
| 저장소 | https://github.com/TTORANG/Web (origin, `git remote -v`) |
| 배포 대상(추정) | Firebase Hosting, 프로젝트 ID `ttorang` (`firebase.json`, `.github/workflows/firebase-hosting-merge.yml`) |

## 핵심 성과

- 본인 author identity(`kimyw1018 <poppppp00@gmail.com>`, `김예원 <164151329+kimyw1018@users.noreply.github.com>`, 동일 GitHub 계정으로 git shortlog에서 확인됨) 기준 총 134개 커밋을 작성했습니다. 측정: `git log --perl-regexp --author='poppppp00@gmail\.com|164151329\+kimyw1018' --oneline | wc -l`.
- 동일 기준으로 18,146줄 추가 / 7,967줄 삭제했습니다. 측정: `git log --perl-regexp --author=... --shortstat` 합산. (측정 조건: 병합 커밋의 diffstat 포함, 코드/설정/락파일 전체 포함이므로 순수 프로덕션 코드량과는 차이가 있습니다.)
- 영상 녹화 기능 관련 이슈 #37, #48, #109, #111, #114, #120, #144, #178, #195, #284를 기준으로 하는 PR을 순차적으로 진행했습니다(브랜치명과 PR 번호는 병합 커밋 메시지에서 확인, 예: `Merge pull request #287 from TTORANG/fix/pd-vid-284`).

## 담당 범위 요약

- `src/hooks/useRecorder.ts`, `src/hooks/useVideoUpload.ts`, `src/hooks/useMediaStream.ts` (일부): 녹화·스트림·업로드 훅
- `src/components/video/` 전반(`RecordingSection.tsx`, `DeviceTestSection.tsx`, `VideoHeader.tsx` 등): 녹화 UI
- `src/pages/VideoPage.tsx`, `VideoRecordPage.tsx`, `VideoListPage.tsx`, `VideoDetailPage.tsx`: 영상 관련 페이지
- `src/api/endpoints/videos.ts`, `src/api/dto/video.dto.ts`: 영상 API 계층
- `src/components/presentation/PresentationCard.tsx`, `PresentationList.tsx`: 영상 목록 진입점 확장(타인 작성 컴포넌트에 기능 추가)

## 스택 요약

React 19 · TypeScript 5.9 · Vite 7 · Tailwind CSS v4 · Zustand 5 · TanStack Query 5 · Axios · React Router v7 · Vitest · MSW (자세한 근거는 3장 참고)

## 링크

- GitHub 저장소: https://github.com/TTORANG/Web (확인됨, `git remote -v`)
- 배포 도메인: CSP 설정(`firebase.json`)에서 `https://api.ttorang.com`, `https://cdn.ttorang.com` 등의 호스트명이 확인되나, 실제 서비스 URL 접속 가능 여부는 (확인 필요)
- 프로젝트 소개 문서: (확인 필요, Notion 등 외부 링크는 레포에서 확인되지 않음)

---

# 2. 개요

## 배경과 문제

- README(`README.md:3`)에 따르면 이 서비스는 "프레젠테이션 슬라이드를 업로드하고, 발표 영상을 녹화하여 실시간 피드백을 주고받을 수 있는 협업 플랫폼"입니다.
- 대상 사용자는 발표 자료를 준비하고 리허설 피드백을 받아야 하는 발표자와, 그 발표에 코멘트·이모지 리액션을 남기는 동료/팀원으로 추정됩니다(슬라이드별 댓글·리액션 시스템, 영상 타임스탬프 댓글 시스템의 존재로 추정. 대상 사용자에 대한 명시적 문서는 레포에서 확인되지 않아 이 부분은 코드 구조 기반 추정입니다).
- 기술적으로 어려웠던 지점은 본인이 담당한 영상 녹화 기능 기준으로 다음과 같이 코드/커밋 이력에서 확인됩니다.
  - 브라우저 `MediaRecorder` API의 비동기 종료 타이밍 문제 (6장 트러블슈팅 1번)
  - 대용량 영상 파일의 청크 단위 업로드 및 브라우저별 코덱(webm/mp4) 차이 대응 (6장 트러블슈팅 3번)
  - 웹캠/마이크 디바이스 스트림 수명주기 관리와 오디오 레벨 분석(Web Audio API) (6장 트러블슈팅 4번)
  - 녹화 중 슬라이드 전환 시점을 영상 타임라인과 동기화해 서버에 로그로 전달하는 로직 (6장 트러블슈팅 2번)

## 담당 범위

### 내가 작성한 디렉터리/기능 (근거: `git log --author` 파일별 집계)

디렉터리별 본인 커밋 파일 변경 횟수(`git log --perl-regexp --author='poppppp00@gmail\.com|164151329\+kimyw1018' --name-only` 집계 상위 항목):

| 디렉터리 | 파일 변경 횟수 |
| --- | --- |
| `src/pages` | 65 |
| `src/components/video` | 60 |
| `src/hooks` | 44 |
| `src/api/dto` | 27 |
| `src/mocks` | 18 |
| `src/components/presentation` | 14 |
| `src/api/endpoints` | 13 |
| `src/types` | 9 |
| `src/components/common` | 7 |
| `src/components/feedback/video` | 6 |

파일 단위로 보면 본인이 주도한 파일은 다음과 같습니다(각 파일에 대한 본인 커밋 수):

- `src/pages/VideoDetailPage.tsx` (22), `src/components/video/RecordingSection.tsx` (22), `src/hooks/useRecorder.ts` (14), `src/pages/VideoRecordPage.tsx` (13), `src/hooks/useVideoUpload.ts` (13), `src/api/endpoints/videos.ts` (13), `src/pages/VideoPage.tsx` (12), `src/pages/VideoListPage.tsx` (12), `src/components/video/DeviceTestSection.tsx` (10), `src/api/dto/video.dto.ts` (9), `src/hooks/useMediaStream.ts` (7), `src/components/presentation/PresentationCard.tsx` (8)

이 파일들에 대해서는 다른 작성자의 커밋 이력이 없거나(예: `useRecorder.ts`, `useVideoUpload.ts`는 본인 커밋만 확인) 소수로, 사실상 본인이 처음부터 설계·구현한 영역입니다. 반면 `src/api/client.ts`, `src/hooks/useAutoSaveScript.ts`, `src/stores/slideStore.ts`, `src/stores/authStore.ts`는 본인 커밋 이력이 0건으로(`git log --author -- <file>` 결과 없음), 슬라이드 편집/인증 기반 인프라는 다른 팀원이 작성한 영역임을 확인했습니다.

### 타인 작성 영역

- 슬라이드 편집 워크스페이스(`SlideWorkspace.tsx`, `slideStore.ts`), 인증/토큰 재발급 로직(`authStore.ts`, `api/client.ts`), 공통 컴포넌트 라이브러리(`components/common/`) 대부분은 본인 커밋 이력이 없어 다른 팀원이 작성한 영역으로 판단됩니다.
- 영상 리액션 세그먼트 하이라이트 알고리즘(`src/utils/video.ts`의 `computeSegmentHighlights` 등)은 본인 커밋이 버그 수정 1건(`550264e`)만 존재해, 최초 설계는 다른 팀원이 담당한 것으로 판단됩니다.

### 협업 방식

- 브랜치 컨벤션은 `type/description-issue` 형식이며(`CONVENTION.md`), 실제 브랜치명(`feat/media-core#37`, `fix/video-recording-finish-178`, `fix/pd-vid-284` 등, 병합 커밋 메시지에서 확인)도 이를 따릅니다.
- PR 기반 협업이 확인됩니다. 병합 커밋 이력 기준 본인이 작업한 PR은 최소 #44, #82, #113, #121, #131, #176, #179, #196, #223, #286, #287입니다(`git log --oneline --grep='^Merge pull request'` + author 필터).
- 코드 리뷰는 AI 코드 리뷰 도구가 포함되어 있었던 것으로 보입니다. 커밋 메시지에 "gemini 코드리뷰 반영"(`08132b0`, `26daea2`), "클로드 리뷰 반영"(`02119e3`)이 직접 등장하며, `.github/copilot-instructions.md`, `.github/workflows/claude.yml` 파일이 저장소에 존재해 GitHub Copilot과 Claude 기반 자동 코드 리뷰가 CI/PR 프로세스에 포함되어 있음을 확인했습니다.
- 코드 주석에서 `FD_VID_01`, `PD_VID_04` 같은 기능 단위 식별자 표기가 발견됩니다(`src/components/feedback/video/SlideWebcamStage.tsx`, `src/components/video/RecordingEmptySection.tsx`). 이는 기능 명세를 사전에 티켓/설계 문서 단위로 정의하고 코드에 역참조를 남기는 협업 방식으로 추정되나, 해당 명세 문서 자체는 레포에서 확인되지 않아 (확인 필요) 항목으로 남깁니다.
- 문서화는 `docs/` 폴더에 아키텍처 문서(`slide-data-flow.md`, `api-connect.md`, `tech-stack.md`, `environment.md`)를 유지하는 방식으로 이루어지고 있으나, 본인이 이 문서들을 작성했는지는 커밋 이력상 확인되지 않습니다(문서 커밋 작성자 미확인, 확인 필요).

---

# 3. 기술 스택

`package.json`에서 확인된 버전과 `docs/tech-stack.md`에 기재된 선택 이유를 기준으로 정리했습니다. 선택 이유가 문서로 확인되지 않는 항목은 "(확인 필요)"로 표시했습니다.

## 프레임워크 / 언어

| 기술 | 버전 (package.json) | 선택 이유 |
| --- | --- | --- |
| React | ^19.2.0 | 슬라이드 편집기의 복잡한 UI 상태를 컴포넌트 단위로 분리 관리하기 위함, 풍부한 생태계 활용 (`docs/tech-stack.md`) |
| TypeScript | ~5.9.3 | strict 모드로 런타임 에러를 컴파일 타임에 차단, API 응답~컴포넌트 props까지 데이터 흐름 정합성 보장 (`docs/tech-stack.md`) |
| Vite | ^7.2.4 | ESM 기반 즉시 서버 시작과 빠른 HMR, `@vitejs/plugin-react-swc`로 Babel 대비 빌드 속도 단축 (`docs/tech-stack.md`) |

## 스타일링

| 기술 | 버전 | 선택 이유 |
| --- | --- | --- |
| Tailwind CSS | ^4.1.18 | 유틸리티 퍼스트, CSS 변수 기반 디자인 토큰으로 테마 전환 구현, v4 Rust 엔진으로 빌드 속도 개선 (`docs/tech-stack.md`) |
| `@tailwindcss/vite` | ^4.1.18 | Vite 플러그인으로 설정 간소화 (`docs/tech-stack.md`) |

## 상태 관리 / 데이터 페칭

| 기술 | 버전 | 선택 이유 |
| --- | --- | --- |
| Zustand | ^5.0.9 | Redux 대비 적은 보일러플레이트, 셀렉터 훅 패턴으로 리렌더링 최소화, `getState()`로 React 외부(Axios 인터셉터)에서도 접근 가능 (`docs/tech-stack.md`) |
| TanStack Query | ^5.90.16 | 서버 상태와 클라이언트 상태 분리, 계층적 쿼리 키로 세밀한 캐시 무효화 (`docs/tech-stack.md`) |
| Axios | ^1.13.5 | 인터셉터 기반 토큰 자동 주입과 중앙화된 에러 핸들링 (`docs/tech-stack.md`) |
| React Router | ^7.12.0 | 설정 기반 라우팅으로 중첩 라우트·라우트별 테마 오버라이드 구현 (`docs/tech-stack.md`) |

## 테스트 / 품질

| 기술 | 버전 | 선택 이유 |
| --- | --- | --- |
| Vitest | ^4.0.18 | Vite와 설정 공유, ESM 네이티브 지원, 병렬 실행으로 빠른 테스트 속도 (`docs/tech-stack.md`) |
| @testing-library/react | ^16.3.2 | 구현 세부사항이 아닌 사용자 관점의 행동 기반 테스트 강제 (`docs/tech-stack.md`) |
| happy-dom | ^20.6.1 | jsdom 대비 실행 속도 개선 (`docs/tech-stack.md`) |
| MSW | ^2.12.7 | 네트워크 레벨 API 모킹으로 프론트엔드/백엔드 개발 일정 분리 (`docs/tech-stack.md`) |
| Playwright | ^1.58.2 | (확인 필요 — E2E 테스트 용도로 추정되나 문서에 선택 이유 기재 없음) |
| @axe-core/playwright | ^4.11.1 | (확인 필요 — 접근성 자동 검사 용도로 추정) |
| ESLint / Prettier / Husky | ^8 / 3.7.4 / ^9.1.7 | 역할 분리(품질 vs 포맷), `eslint-plugin-check-file`로 네이밍 컨벤션 자동 강제, Husky+lint-staged로 커밋 시점 검사 (`docs/tech-stack.md`) |

## 그 외 주요 의존성 (package.json 기준, 선택 이유 문서 미기재)

| 기술 | 버전 | 용도(추정) |
| --- | --- | --- |
| hls.js | ^1.6.15 | HLS(m3u8) 스트리밍 영상 재생 (확인 필요 — `src/components/feedback/video/SlideWebcamStage.tsx`에서 HLS 인스턴스 사용 확인, 선택 이유 문서 없음) |
| posthog-js | ^1.347.1 | 제품 분석/사용자 행동 추적 (확인 필요, `src/hooks/usePosthogAuthSync.ts` 존재) |
| recharts | ^3.7.0 | 인사이트 페이지 차트 (확인 필요) |
| sonner | ^2.0.7 | 토스트 알림 (CLAUDE.md에 명시) |
| dayjs | ^1.11.19 | 날짜 포맷팅 (확인 필요) |
| superjson | ^2.2.6 | (확인 필요 — 직렬화 용도로 추정, 사용처 미확인) |

## 인프라 / CI

| 기술 | 근거 | 용도 |
| --- | --- | --- |
| Firebase Hosting | `firebase.json`, `.github/workflows/firebase-hosting-*.yml` | 정적 빌드 산출물(`dist/`) 배포 |
| GitHub Actions | `.github/workflows/pr-check.yml`, `firebase-hosting-merge.yml`, `firebase-hosting-pull-request.yml`, `labeler.yml`, `claude.yml` | PR 검사(lint/type-check/build), 배포, 라벨링, Claude 코드 리뷰 |
| Lighthouse CI | `.lighthouserc.json` | 성능(0.8)/접근성(0.9)/모범사례(0.8)/SEO(0.8) 임계값 자동 검사 |
| commitlint | `commitlint.config.js`, `@commitlint/config-conventional` | 커밋 메시지 컨벤션 검사 (확인 필요 — 실제 pre-commit hook 연결 여부는 `.husky/` 내용 미확인) |

---

# 4. 설계

## 아키텍처

CLAUDE.md와 `.github/copilot-instructions.md`에 문서화된 3계층 구조가 `src/api/`, `src/hooks/`, `src/stores/`, `src/components/`에 그대로 반영되어 있습니다.

1. **Axios Client** (`src/api/client.ts`): 단일 인스턴스에서 baseURL·timeout(10초, `API_TIMEOUT_MS`)을 설정하고, 요청 인터셉터에서 `useAuthStore.getState().accessToken`을 꺼내 `Authorization: Bearer` 헤더를 자동 주입합니다. 응답 인터셉터에서 401(토큰 재발급 후 재시도)과 5xx(즉시 에러 토스트 + `error.isHandled = true`)를 처리하고, 그 외 4xx는 그대로 reject하여 TanStack Query 쪽에서 처리하도록 위임합니다(하이브리드 에러 전략).
2. **API Endpoints** (`src/api/endpoints/`): 도메인별 순수 함수 모음입니다. 본인이 작성한 `videos.ts`가 대표적으로, `apiClient`를 감싸 videoId 정규화(`normalizeVideoId`), FormData 구성 등을 캡슐화합니다.
3. **Query Hooks / Custom Hooks** (`src/hooks/`): TanStack Query 래퍼(`hooks/queries/`)와 비즈니스 로직 훅(`useRecorder`, `useVideoUpload`, `useMediaStream` 등)으로 나뉩니다. 페이지 컴포넌트는 이 훅들을 조합해 사용합니다.

요청이 처리되는 흐름(영상 녹화 예시, 본인 담당 기능 기준):

```
VideoPage (진입)
  → DeviceTestSection (useMediaStream으로 캠/마이크 스트림 획득)
  → onComplete → VideoRecordPage (step: TEST → RECORDING)
  → RecordingSection (useRecorder로 MediaRecorder 시작, 슬라이드 전환마다 slideLogsRef에 타임스탬프 기록)
  → handleFinish → useRecorder.stopRecording() (MediaRecorder onstop 대기)
  → useVideoUpload.uploadVideo()
      → videosApi.startVideo() → videoId 발급
      → videoBlob을 1MB 단위로 slice → videosApi.uploadChunk() 순차 호출
      → videosApi.finishVideo(slideLogs)
  → VideoListPage로 이동, location.state.uploadSuccess로 토스트 표시 후 refetch
  → 서버 처리 완료 전까지 3초 간격 폴링으로 썸네일/상태 갱신 (VideoListPage.tsx)
```

라우팅 구조는 `src/router/Router.tsx` 기준 다음과 같습니다(설정 기반 라우팅, `createBrowserRouter`).

```
/                              → HomePage
/dev                           → DevTestPage
/auth/callback                 → OAuthCallbackPage
/:projectId
  ├── (index)                  → Navigate to "slide"
  ├── /slide/:slideId          → SlidePage
  ├── /slide                   → SlidePage
  ├── /insight                 → InsightPage
  ├── /videos                  → VideoListPage
  └── /videos/:videoId         → VideoDetailPage
/:projectId/video/record       → VideoRecordPage
/share/:shareToken             → SharePage (dark 테마 Layout)
```

라우트 대부분이 `lazy()`로 코드 스플리팅되어 있고, `Suspense` fallback으로 `Spinner`를 공통 사용합니다(`withRouteSuspense` 헬퍼, `Router.tsx:26`).

## 데이터 모델

이 레포는 프론트엔드 전용이므로 DB 스키마/엔티티 정의는 존재하지 않습니다. 대신 `src/api/dto/`에 서버 응답 DTO가, `src/types/`에 프론트엔드 도메인 모델이 분리되어 있습니다(`docs/api-connect.md`에 DTO/Model 분리 원칙 문서화).

본인이 작성한 `src/api/dto/video.dto.ts` 기준 주요 타입 관계:

- `VideoListItemDto` — 영상 목록 카드에 필요한 요약 정보(`feedbackCount`, `viewCount`, `reactionCount`, `status` 등)
- `VideoDetailDto` — 상세 페이지용 전체 정보(`hlsMasterUrl`, `width`/`height`/`fps` 포함)
- `VideoTimelineDto` — `reactions: VideoTimelineReactionDto[]`, `comments: VideoTimelineCommentDto[]`로 구성되며, 댓글은 `replies?: VideoTimelineReplyDto[]`로 1단계 중첩 구조
- `VideoSlideTimelineItemDto` — `{ slideId, timestampMs }`로, 녹화 시 클라이언트가 만든 로그와 동일한 구조를 서버 응답에서도 사용(6.2 트러블슈팅 참고)

DTO는 서버 스펙을 그대로 유지(`snake_case`가 필요한 필드는 원본 유지)하고, `src/api/endpoints/`에서 필요한 경우 `toModel` 성격의 변환을 수행하는 원칙이 `docs/api-connect.md`에 문서화되어 있습니다. 다만 실제 `videos.ts`는 DTO를 거의 그대로 반환하고 있어, 이 원칙이 모든 도메인에 일관되게 적용되지는 않은 것으로 보입니다(확인 필요 — DTO→Model 변환이 실제로 이루어지는 도메인과 그렇지 않은 도메인의 경계).

인덱스 설계는 백엔드 레포 영역이라 이 레포에서 확인할 수 없습니다(확인 필요).

## API 및 인터페이스

- 응답 규격은 `ApiResponse<T>` 제네릭으로 통일되어 있고, `resultType: 'SUCCESS' | 'FAILURE'` 판별 유니온으로 성공/실패를 구분합니다(`src/api/client.ts`의 `ApiFailureResponse`, `videos.ts`의 `response.data.resultType === 'SUCCESS'` 분기 패턴).
- 에러 처리는 하이브리드 전략입니다: 401은 Axios 인터셉터가 토큰 재발급(`sessionApi.reissueToken()`) 후 원 요청을 재시도하며, 재발급 중 들어온 요청은 `failedQueue`에 쌓아뒀다가 재발급 완료 후 일괄 재시도합니다(`src/api/client.ts:66-162`). 500 이상은 Axios가 즉시 `handleApiError()`로 토스트를 띄우고 `error.isHandled = true`를 설정해 TanStack Query 쪽 중복 처리를 막습니다. 그 외 4xx는 각 Query Hook에서 개별 처리합니다.
- 엔드포인트 구성은 도메인별 파일(`videos.ts`, `slides.ts`, `opinions.ts` 등)로 나뉘며, 각 파일은 `apiClient`를 직접 사용하는 평범한 async 함수 모음입니다(클래스나 별도 Repository 추상화 없음).

## 인프라 및 배포

- **실행 환경**: Node 22 (`.nvmrc`), 패키지 매니저는 저장소에 `bun.lock`, `package-lock.json`, `pnpm-lock.yaml`이 모두 존재해 실제 사용 매니저가 무엇인지 락파일만으로는 특정할 수 없습니다(확인 필요).
- **배포 파이프라인**: `main` 브랜치 push 시 `firebase-hosting-merge.yml`이 `npm ci` → `npm run build`(빌드 시 `VITE_API_URL`, `VITE_KAKAO_JS_KEY`를 GitHub Secrets로 주입) → Firebase Hosting `live` 채널 배포를 수행합니다. PR 시에는 `firebase-hosting-pull-request.yml`(내용 미확인, 파일 존재만 확인)로 프리뷰 배포가 되는 것으로 추정됩니다.
- **PR 게이트**: `pr-check.yml`이 lint → type-check → build를 순차 실행하고, 빌드 산출물을 1일간 아티팩트로 보관합니다.
- **CSP/보안 헤더**: `firebase.json`의 `headers` 설정에서 `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`가 확인됩니다. CSP의 `connect-src`에 `https://api.ttorang.com`, `https://ttorang-server-407623424780.asia-northeast3.run.app`(Cloud Run으로 추정), `https://cdn.ttorang.com`이 명시되어 있어 백엔드가 Google Cloud Run에 배포되어 있을 가능성이 있습니다(확인 필요 — 백엔드 레포가 아니므로 직접 검증 불가).
- **설정 관리**: 환경변수는 `VITE_` 접두사만 클라이언트에 노출되며(`docs/environment.md`), `.env.local`은 Git에서 제외되고 `.env.local.example`을 복사해 사용하는 방식입니다. 저장소 루트에 `.env.local` 파일이 실제로 존재하는 것을 확인했으나(민감정보 존재 가능성이 있어 내용은 인용하지 않았습니다), `.env.example`/`.env.local.example`에 기재된 변수명(`VITE_API_URL`, `VITE_APP_TITLE`)만 문서 근거로 기록합니다.
- **성능 예산**: Lighthouse CI가 `/project/1/slide`, `/project/1/video`, `/project/1/insight` 3개 경로에 대해 3회씩 측정하며 성능 0.8, 접근성 0.9를 기준으로 warn/error를 냅니다(`.lighthouserc.json`). 실제 CI에서 이 워크플로가 어느 단계에 연결되어 있는지는 `.github/workflows/`에 별도 lighthouse job 파일이 없어 (확인 필요 — 로컬/수동 실행용일 가능성).

## 디렉터리 구조

`README.md`에 문서화된 구조이며, 실제 파일 시스템과 대조해 확인했습니다.

```
src/
├── api/                # Axios 클라이언트, 엔드포인트, 에러 핸들링
│   ├── dto/            #   요청/응답 DTO 타입 (본인 담당: video.dto.ts 등)
│   └── endpoints/       #   도메인별 API 함수 (본인 담당: videos.ts)
├── assets/              # 이미지, 아이콘 등 정적 리소스
├── bootstrap/           # 앱 초기화 (MSW 등)
├── components/          # UI 컴포넌트
│   ├── auth/            #   인증 모달
│   ├── comment/         #   중첩 댓글 시스템
│   ├── common/          #   공통 UI (Modal, Dropdown, Layout 등)
│   ├── feedback/        #   발표 피드백 뷰 (video/ 하위는 본인 일부 기여)
│   ├── home/             #   홈 페이지
│   ├── insight/          #   인사이트/분석
│   ├── presentation/     #   프레젠테이션 카드/목록 (본인 일부 기여)
│   ├── share/            #   공유 모달
│   ├── slide/             #   슬라이드 편집기 (SlideWorkspace 중심, 타인 담당)
│   └── video/             #   영상 녹화/재생 (본인 담당 영역)
├── constants/            # 상수 정의
├── hooks/                # 커스텀 훅
│   └── queries/          #   TanStack Query 훅
├── mocks/                # MSW 핸들러 (본인 일부 기여, 18회 변경)
├── pages/                # 페이지 컴포넌트 (Video* 페이지는 본인 담당)
├── providers/            # Context Provider
├── router/                # 라우트 설정
├── stores/                # Zustand 스토어 (6개 도메인, 타인 담당)
├── styles/                # 글로벌 스타일, 디자인 토큰
├── test/                  # 테스트 유틸리티, 설정
├── types/                 # 공통 타입 정의
└── utils/                 # 유틸리티 함수 (video.ts는 부분 기여)
```

---

# 5. 핵심 구현

본인이 작성한 코드(`git log --author` 기준 커밋이 확인되는 파일)에서 발굴한, 단순 CRUD를 넘어서는 구현 6건입니다.

## 1. MediaRecorder 기반 청크 녹화와 비동기 종료 처리

**무엇을 구현했는가**: 브라우저 `MediaRecorder` API로 웹캠 스트림을 녹화하고, 녹화 종료 시점에 마지막 데이터 청크까지 안전하게 확보한 뒤 업로드 가능한 `Blob`을 만드는 기능입니다(`src/hooks/useRecorder.ts`).

**어떻게 구현했는가**:
1. `startRecording`에서 히든 `<video>` 엘리먼트를 `document.body`에 붙여 스트림을 재생시키고, `readyState >= 2 && videoWidth > 0`이 될 때까지 최대 30회(100ms 간격) 폴링해 캠이 실제로 준비됐는지 확인합니다.
2. 브라우저 코덱 지원 여부를 `RECORDER_MIME_CANDIDATES` 배열(vp9 → vp8 → webm → mp4 순)로 `MediaRecorder.isTypeSupported()`에 순차 질의해 가장 우선순위 높은 코덱을 선택합니다.
3. `recorder.ondataavailable`에서 청크를 `chunksRef`(즉시 참조 가능한 ref)와 `recordedChunks`(UI 반영용 state)에 이중으로 쌓습니다.
4. `stopRecording`은 `Promise`를 반환하며, `mediaRecorder.onstop` 콜백 안에서 정리 작업(video 엘리먼트 제거, `isRecording` false 처리)을 수행한 뒤 `resolve()`합니다. 즉, "녹화가 실제로 멈췄다"는 신호를 받은 뒤에야 다음 단계(Blob 생성)로 진행합니다.

**선택지와 판단**: 최초 구현(commit `a56f2cc` 이전)은 `stopRecording()` 호출 직후 `setTimeout(resolve, 5000)`으로 고정 대기한 뒤 `getRecordedBlob()`을 호출했습니다. 이는 6장 트러블슈팅 1번에서 다루는 문제의 원인이 되어, `MediaRecorder.onstop` 이벤트를 기다리는 Promise 기반으로 교체했습니다. 고정 대기 대신 이벤트 기반을 택한 이유는 네트워크/기기 성능에 따라 recorder가 실제로 멈추는 시점이 가변적이기 때문입니다(커밋 메시지 및 diff로 확인, 6.1절 참고).

**코드 발췌** (`src/hooks/useRecorder.ts`, 현재 상태 기준):

```typescript
const stopRecording = useCallback(() => {
  return new Promise<void>((resolve) => {
    const finalize = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        if (videoRef.current.parentNode) {
          document.body.removeChild(videoRef.current);
        }
        videoRef.current = null;
      }
      setIsRecording(false);
      resolve();
    };

    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      finalize();
      return;
    }

    mediaRecorderRef.current.onstop = finalize;
    mediaRecorderRef.current.stop();
  });
}, []);
```

## 2. 녹화 중 슬라이드-타임라인 로그 수집

**무엇을 구현했는가**: 발표자가 녹화 중 슬라이드를 넘길 때마다 "몇 ms 시점에 몇 번 슬라이드로 전환했는지"를 기록해, 서버가 영상 재생 시 슬라이드를 동기화할 수 있도록 전달하는 기능입니다(`src/components/video/RecordingSection.tsx`).

**어떻게 구현했는가**:
1. 녹화 시작 시 `startTimeRef.current = Date.now()`로 기준 시각을 잡고, 첫 슬라이드 로그(`timestampMs: 0`)를 `slideLogsRef`에 기록합니다.
2. `handlePageChange`에서 슬라이드가 실제로 바뀔 때(`next !== p`) `Date.now() - startTimeRef.current`로 경과 시간을 계산해 로그를 추가합니다.
3. 로그 저장소는 `useState`가 아니라 `useRef`를 사용합니다. 상태(state)로 관리하면 리렌더링 사이 클로저가 오래된 배열을 참조할 수 있어, 연속 클릭 시 로그가 누락되거나 중복되는 문제가 있었습니다(6.2절 참고).
4. 같은 슬라이드로의 중복 로그를 막기 위해, 새 로그를 push하기 전 `slideLogsRef.current`의 마지막 항목과 슬라이드 ID를 비교하는 가드를 둡니다.

**선택지와 판단**: `useState<SlideLog[]>` + 함수형 업데이트(`setSlideLogs(prev => [...])`) 방식도 가능했지만, 키보드 연타나 빠른 클릭처럼 짧은 시간 안에 여러 번 상태 업데이트가 발생하는 상황에서 React의 배치 처리와 클로저 문제로 로그 순서/개수가 어긋나는 것을 실제로 겪은 뒤(6.2절 커밋 `a56f2cc`) ref 기반으로 전환했습니다.

**코드 발췌** (`src/components/video/RecordingSection.tsx:127-155`):

```typescript
const handlePageChange = useCallback(
  (dir: 'next' | 'prev') => {
    setCurrentPage((p) => {
      const next = dir === 'next' ? Math.min(p + 1, totalPages) : Math.max(p - 1, 1);
      if (next !== p) {
        setSlideProgress((prev) => ({
          ...prev,
          [next]: prev[next] || { page: next, duration: 0, visited: true },
        }));

        const nextSlideId = slidesList[next - 1]?.id;
        if (nextSlideId && startTimeRef.current) {
          const elapsedMs = Date.now() - startTimeRef.current;
          const lastLog = slideLogsRef.current[slideLogsRef.current.length - 1];
          if (!lastLog || lastLog.slideId !== parseInt(nextSlideId, 10)) {
            slideLogsRef.current.push({
              slideId: parseInt(nextSlideId, 10),
              timestampMs: elapsedMs,
            });
          }
        }
      }
      return next;
    });
  },
  [totalPages, slidesList],
);
```

## 3. 청크 단위 순차 업로드와 진행률 관리

**무엇을 구현했는가**: 녹화가 끝난 뒤 얻은 전체 영상 `Blob`을 1MB 단위로 잘라 순차적으로 서버에 업로드하고, 업로드 진행률을 UI에 반영하는 기능입니다(`src/hooks/useVideoUpload.ts`, `src/api/endpoints/videos.ts`).

**어떻게 구현했는가**:
1. `videosApi.startVideo()`로 먼저 서버에 영상 업로드 세션을 열고 `videoId`를 발급받습니다.
2. `CHUNK_SIZE = 1024 * 1024`(1MB) 기준으로 `totalChunks`를 계산하고, `for` 루프에서 `videoBlob.slice(start, end, mimeType)`으로 청크를 만들어 `videosApi.uploadChunk(videoId, i, chunk)`를 순차 호출합니다(병렬이 아닌 순차 업로드).
3. 각 청크 업로드 성공 시 `setProgress`로 `uploadedChunks`, `percentage`를 갱신해 UI가 실시간으로 진행률을 표시하도록 합니다.
4. 모든 청크 업로드 후 `videosApi.finishVideo(videoId, { slideLogs })`를 호출해 녹화 중 수집한 슬라이드 로그를 함께 전달하고 서버 측 인코딩/처리를 트리거합니다.

**선택지와 판단**: 청크를 병렬로 업로드하는 방식도 가능했으나, 서버가 청크 인덱스 기반(`/videos/:videoId/chunks/:chunkIndex`)으로 순서를 기대하는 API 스펙(`CreateChunkUploadResponseDto`, `chunkIndex` 파라미터)이었고 순차 업로드가 구현되어 있습니다. 병렬 업로드를 검토했는지 여부는 커밋 이력에서 확인되지 않아 (확인 필요)로 남깁니다.

**코드 발췌** (`src/hooks/useVideoUpload.ts:44-63`):

```typescript
const CHUNK_SIZE = 1024 * 1024;
const totalChunks = Math.ceil(videoBlob.size / CHUNK_SIZE);
const uploadMimeType = normalizeVideoMimeType(videoBlob.type);

setProgress((prev) => ({ ...prev, totalChunks, currentStep: 'uploading' }));

for (let i = 0; i < totalChunks; i++) {
  const chunk = videoBlob.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE, uploadMimeType);
  const uploadRes = await videosApi.uploadChunk(videoId, i, chunk);

  if (uploadRes.data.resultType === 'FAILURE') {
    throw new Error(`Chunk ${i} 업로드 실패`);
  }

  setProgress((prev) => ({
    ...prev,
    uploadedChunks: i + 1,
    percentage: Math.round(((i + 1) / totalChunks) * 100),
  }));
}
```

## 4. Web Audio API 기반 마이크 볼륨 시각화와 스트림 수명주기 관리

**무엇을 구현했는가**: 디바이스 테스트 화면에서 선택한 마이크의 실시간 음량을 시각화하고, 디바이스를 바꾸거나 컴포넌트가 언마운트될 때 이전 스트림/오디오 리소스를 확실히 정리하는 훅입니다(`src/hooks/useMediaStream.ts`).

**어떻게 구현했는가**:
1. `AudioContext` → `createMediaStreamSource` → `AnalyserNode`(`fftSize: 256`)로 오디오 그래프를 구성합니다.
2. `requestAnimationFrame` 루프(`updateVolume`)에서 `analyzerRef.current.getByteFrequencyData(dataArray)`로 주파수 데이터를 읽고 평균을 내 `volume` state에 반영합니다.
3. `cleanupAudioAnalysis`가 `animationFrame` 취소, `AudioNode.disconnect()`, `AudioContext.close()`를 순서대로 수행해 리소스 누수를 막습니다.
4. 스트림 자체는 `streamRef`(ref)와 `stream`(state) 이중 관리로, 정리 시점에 최신 스트림을 정확히 참조하도록 했습니다(6.4절 트러블슈팅에서 이 이중 관리가 도입된 배경을 다룹니다).

**코드 발췌** (`src/hooks/useMediaStream.ts:83-100`):

```typescript
const updateVolume = () => {
  if (!analyzerRef.current) return;

  analyzerRef.current.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((a, b) => a + b) / bufferLength;
  setVolume(Math.round(average));
  animationFrameRef.current = requestAnimationFrame(updateVolume);
};

updateVolume();
```

## 5. 영상 처리 상태 폴링과 stuck 감지

**무엇을 구현했는가**: 업로드 후 서버에서 인코딩 중인 영상의 썸네일/상태를 주기적으로 확인해, 처리가 끝나면 자동으로 UI를 갱신하고 지나치게 오래 걸리는 경우(1시간 초과) 실패로 간주하는 기능입니다(`src/pages/VideoListPage.tsx`).

**어떻게 구현했는가**:
1. `useMemo`로 서버 응답(`rawVideos`)에 `derivedStatus`, `isStuck`, `isPending` 같은 파생 필드를 계산해 붙입니다. `isStuck`은 `status === 'processing'`이면서 `createdAt` 기준 경과 시간이 1시간을 넘는 경우입니다.
2. `isPending`(처리 중이거나 썸네일이 아직 없는) 영상들의 ID를 `pendingIds` Set에 모읍니다.
3. `pendingIds`가 비어있지 않을 때만 3초 간격으로 `refetch()`를 호출하는 `useEffect`를 두어, 처리할 영상이 없으면 폴링 자체를 하지 않습니다.
4. 폴링 응답에서 `thumbnailUrl`이 생기거나 `status`가 `failed`가 된 항목은 `doneIds`로 분류해 `pendingIds`에서 제거하고, `thumbVersion`을 증가시켜 이미지 캐시를 무효화합니다(URL 쿼리 버전 파라미터로 사용되는 것으로 추정).

**선택지와 판단**: 웹소켓이나 서버센트이벤트(SSE) 대신 폴링을 택했습니다. 레포 내 `docs/`에 `websocket-implementation.md`가 README 문서 목록(`README.md:100`)에 언급되어 있으나 실제 `docs/` 폴더에는 해당 파일이 존재하지 않아, 웹소켓 방식이 검토되었으나 이 페이지에는 적용되지 않았거나 문서가 유실된 것으로 추정됩니다(확인 필요).

**코드 발췌** (`src/pages/VideoListPage.tsx:78-95`):

```typescript
const videos = useMemo(() => {
  const now = Date.now();

  return rawVideos.map((v) => {
    const createdAt = new Date(v.createdAt).getTime();
    const hours = (now - createdAt) / (1000 * 60 * 60);
    const isStuck = v.status === 'processing' && hours > 1;

    return {
      ...v,
      derivedStatus: isStuck ? 'failed' : v.status,
      isStuck,
      isFailed: v.status === 'failed' || isStuck,
      isPending: (v.status === 'processing' || v.status === 'uploading') && !v.thumbnailUrl,
    };
  });
}, [rawVideos]);
```

## 6. 영상 타임스탬프 기반 댓글 스레딩

**무엇을 구현했는가**: 영상 상세 페이지에서 서버가 평평한(flat) 배열로 내려주는 댓글/답글을, 타임스탬프 기준으로 정렬하고 답글은 부모 댓글의 타임스탬프를 상속받아 같은 그룹으로 묶는 기능입니다(`src/pages/VideoDetailPage.tsx`).

**어떻게 구현했는가**:
1. `transformComments`에서 `new Map(serverComments.map(c => [c.commentId, c])).values()`로 먼저 중복 댓글 ID를 제거합니다.
2. 루트 댓글(부모가 없는 댓글)의 `timestampMs`를 `rootTimestampById` Map에 미리 저장해둡니다.
3. 답글은 자신의 `timestampMs`가 없으므로, `parentId`로 `rootTimestampById`를 조회해 부모의 타임스탬프를 상속받습니다(`threadTimestampMs`).
4. 최종 정렬은 (1) 스레드 타임스탬프 오름차순 → (2) 같은 타임스탬프 내에서는 답글이 루트보다 뒤 → (3) 같은 조건이면 작성 시각(`createdAt`) 오름차순의 3단계 비교자로 처리합니다.
5. `buildFeedbacks`는 정렬된 댓글을 다시 `timestampMs` 기준으로 `Map<number, Comment[]>`에 그룹핑해, 영상 재생바 위에 타임스탬프별 피드백 마커로 렌더링할 수 있는 구조로 변환합니다.

**선택지와 판단**: 서버 응답을 그대로 `createdAt` 순으로만 정렬하는 방식도 가능했지만, 영상 재생 위치와 댓글을 연동하는 UX(재생바 클릭 시 해당 시점 댓글로 스크롤)를 위해 타임스탬프를 1차 정렬 기준으로 삼고, 답글은 시각적으로 부모 스레드와 함께 묶이도록 타임스탬프를 상속하는 방식을 택했습니다. 이 설계 판단이 커밋 메시지나 별도 문서로 명시적으로 근거가 남아있지는 않아, 판단 배경 자체는 코드 구조로부터의 추정입니다.

**코드 발췌** (`src/pages/VideoDetailPage.tsx:94-114`, 30줄 초과분은 생략):

```typescript
const getThreadTimestamp = (comment: CommentType) => {
  if (comment.ref?.kind === 'video') return Math.round(comment.ref.seconds * 1000);
  if (comment.parentId)
    return rootTimestampById.get(comment.parentId) ?? Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER;
};

return mapped.sort((a, b) => {
  const timestampDiff = getThreadTimestamp(a) - getThreadTimestamp(b);
  if (timestampDiff !== 0) return timestampDiff;
  if (a.isReply !== b.isReply) {
    return a.isReply ? 1 : -1;
  }
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
});
```

---

# 6. 트러블 슈팅

diff로 문제-원인-해결이 뒷받침되는 6건을 정리했습니다. 모두 본인 커밋(`kimyw1018` / `김예원`)에서 확인된 내용입니다.

## 1. 녹화 종료 시 빈 영상(0바이트) 발생 가능성 — 고정 대기(setTimeout) 기반 종료 처리

**문제 상황**: 발표자가 녹화 종료 버튼을 누르면 `stopRecording()`을 호출한 뒤 곧바로(또는 고정된 시간만 기다린 뒤) `getRecordedBlob()`으로 최종 영상을 만들어 업로드했습니다. 이 시점에 `MediaRecorder`가 아직 완전히 멈추지 않았거나 마지막 `ondataavailable` 이벤트가 발생하기 전이면, 마지막 청크가 누락되거나 영상이 비정상적으로 끝날 수 있는 구조였습니다. 발생 위치는 `src/hooks/useRecorder.ts`의 `stopRecording`, 재현 조건은 녹화 종료 직후입니다.

**원인 분석**: 커밋 이력을 시간순으로 추적한 결과(`a56f2cc` → `e7fe097` → `792d5d2`, 모두 이슈 #284), 초기 구현은 `stopRecording()`이 동기 함수였고 호출부(`RecordingSection.tsx`)에서 `await new Promise(resolve => setTimeout(resolve, 5000))`으로 5초 고정 대기 후 `getRecordedBlob()`을 호출했습니다(`a56f2cc` diff에서 확인). 이는 `MediaRecorder.stop()` 호출 후 실제로 마지막 `dataavailable` + `stop` 이벤트가 언제 발생하는지를 코드가 알지 못한 채, "충분히 길 것"이라고 가정한 고정 시간에만 의존하는 구조였습니다. 기기 성능이나 브라우저 스케줄링에 따라 이 가정이 깨질 수 있는 레이스 컨디션입니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| 대기 시간을 늘린다(3초 → 5초 등) | 구현이 간단함 | 근본 원인(이벤트 미대기) 해결 안 됨, 느린 기기에서는 여전히 실패 가능 | 미채택 (커밋 이력상 3초/5초 사이를 오간 흔적만 있음, `a56f2cc`에서 5초→3초로 축소) |
| `MediaRecorder.onstop` 이벤트를 Promise로 감싸 대기 | 실제 종료 시점을 정확히 알 수 있음, 대기 시간 낭비 없음 | `mediaRecorder`가 이미 `inactive` 상태인 예외 케이스를 별도 처리해야 함 | 채택 |

**해결 과정**: `e7fe097`에서 `stopRecording`을 `Promise<void>`를 반환하도록 바꾸고, `mediaRecorderRef.current.onstop` 콜백 안에서 비디오 엘리먼트 정리와 `resolve()`를 수행하도록 변경했습니다. `RecordingSection.tsx`의 `handleFinish`도 `stopRecording(); await sleep(3000)` 대신 `await stopRecording()`으로 단순화됐습니다. 이어진 `792d5d2`에서는 "이미 inactive인 경우"와 "onstop을 기다려야 하는 경우"에 각각 다르게 존재하던 정리 로직(비디오 엘리먼트 제거 등)을 `finalize`라는 단일 함수로 통합해, 두 분기가 서로 다른 정리 로직을 갖다가 어긋나는 것을 방지했습니다.

**코드 발췌 — 변경 전** (`a56f2cc` 시점 `RecordingSection.tsx`):

```typescript
try {
  stopRecording();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const finalVideoBlob = getRecordedBlob();
  if (!finalVideoBlob || finalVideoBlob.size === 0) {
    throw new Error('녹화된 영상이 없습니다.');
  }
  onFinish(finalVideoBlob, slideLogsRef.current);
} catch (error) { /* ... */ }
```

**코드 발췌 — 변경 후** (`792d5d2` 이후, 현재 `useRecorder.ts`):

```typescript
const stopRecording = useCallback(() => {
  return new Promise<void>((resolve) => {
    const finalize = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        if (videoRef.current.parentNode) document.body.removeChild(videoRef.current);
        videoRef.current = null;
      }
      setIsRecording(false);
      resolve();
    };
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      finalize();
      return;
    }
    mediaRecorderRef.current.onstop = finalize;
    mediaRecorderRef.current.stop();
  });
}, []);
```

**결과**: 고정 대기 시간(3~5초)이 이벤트 기반 대기로 바뀌어, 녹화 종료부터 업로드 시작까지의 지연이 "실제 정리 완료 시점"으로 결정론적으로 변경되었습니다. 정량적인 실패율/지연시간 비교 수치는 레포에서 확인되지 않습니다 (수치 확인 필요: 변경 전후 녹화 종료~업로드 시작까지의 실제 소요 시간, 0바이트 영상 발생 빈도를 측정하려면 QA 로그나 서버 측 실패율 데이터가 필요합니다).

**근거**: 커밋 `a56f2cc`, `e7fe097`, `792d5d2` (모두 이슈 #284), 파일 `src/hooks/useRecorder.ts`, `src/components/video/RecordingSection.tsx`, PR #286/#287 (병합 커밋 `732556b`, `672a1ee`)

**배운 점**: 동일한 "이벤트를 기다리지 않고 고정 시간에 의존"하는 패턴이 슬라이드 로그 기록(트러블슈팅 2번)에서도 유사하게 나타났으며, 두 문제 모두 같은 PR 사이클(#284) 안에서 함께 수정되었습니다.

## 2. 슬라이드 전환 로그 중복/누락 — state 기반 로그 기록의 비동기 클로저 문제

**문제 상황**: 녹화 중 발표자가 슬라이드를 빠르게 연속으로 넘기면(스페이스바 연타 등), 서버로 전달되는 슬라이드-타임라인 로그(`slideLogs`)에 같은 슬라이드가 중복 기록되거나 순서가 어긋날 수 있는 구조였습니다. 발생 위치는 `src/components/video/RecordingSection.tsx`의 `handlePageChange`, 재현 조건은 슬라이드 전환을 빠르게 반복하는 경우입니다.

**원인 분석**: 변경 전 코드(`a56f2cc` 이전)는 로그를 `useState<{slideId, timestampMs}[]>(slideLogs)`로 관리하고 `startRecordingWithLog`가 컴포넌트 렌더마다 새로 정의되는 일반 함수(화살표 함수, `useCallback` 미적용)였습니다. `setSlideLogs(prev => [...prev, ...])` 형태로 업데이트하더라도, 이 상태가 여러 다른 `useEffect`/`useCallback`(자동 스크롤, 키보드 핸들러 등)의 의존성 배열에 얽혀 있어 클로저가 최신 값을 보장하지 못하는 상황이 있었습니다. `git show a56f2cc`의 diff에서 `useState`였던 `slideLogs`가 `useRef`로, 인라인 함수였던 `startRecordingWithLog`가 `useCallback`으로 바뀐 것이 확인됩니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| `useState` + 함수형 업데이트만 유지 | 기존 구조 유지, React 관용적 패턴 | 빠른 연속 이벤트에서 중복/순서 문제가 재현됨(실측 근거는 커밋 메시지 "슬라이드 순서 중복 처리"뿐, 별도 재현 로그는 레포에 없음) | 미채택 |
| `useRef`로 로그 저장 + 마지막 항목과 비교하는 dedup 가드 | 렌더링 사이클과 무관하게 항상 최신 배열을 참조, 중복 방지 로직을 한 곳에 집중 | ref 값 변경은 리렌더링을 트리거하지 않으므로 UI 표시용 값과는 별도 관리 필요 | 채택 |

**해결 과정**: `slideLogsRef = useRef<{slideId, timestampMs}[]>([])`로 전환하고, `handlePageChange` 내부에서 새 로그를 push하기 전 `slideLogsRef.current`의 마지막 항목과 `slideId`가 같은지 비교하는 가드(`if (!lastLog || lastLog.slideId !== ...)`)를 추가했습니다. `startRecordingWithLog`도 `useCallback`으로 감싸 의존성 배열(`[startRecording, slidesList]`)을 명확히 했습니다.

**코드 발췌 — 변경 전** (`a56f2cc`의 부모 커밋 기준):

```typescript
const [slideLogs, setSlideLogs] = useState<{ slideId: number; timestampMs: number }[]>([]);
const startTimeRef = useRef<number>(0);

const startRecordingWithLog = (stream: MediaStream) => {
  startTimeRef.current = Date.now();
  startRecording(stream);
  const firstSlideId = slidesList[0]?.id;
  if (firstSlideId) {
    setSlideLogs([{ slideId: parseInt(firstSlideId, 10), timestampMs: 0 }]);
  }
};
// handlePageChange 내부
setSlideLogs((prev) => [...prev, { slideId: parseInt(nextSlideId, 10), timestampMs: elapsedMs }]);
```

**코드 발췌 — 변경 후** (`a56f2cc` 이후, 현재 상태):

```typescript
const slideLogsRef = useRef<{ slideId: number; timestampMs: number }[]>([]);
const startTimeRef = useRef<number>(0);

const startRecordingWithLog = useCallback(
  (stream: MediaStream) => {
    startTimeRef.current = Date.now();
    startRecording(stream);
    const firstSlideId = slidesList[0]?.id;
    if (firstSlideId) {
      slideLogsRef.current = [{ slideId: parseInt(firstSlideId, 10), timestampMs: 0 }];
    }
  },
  [startRecording, slidesList],
);
// handlePageChange 내부
const lastLog = slideLogsRef.current[slideLogsRef.current.length - 1];
if (!lastLog || lastLog.slideId !== parseInt(nextSlideId, 10)) {
  slideLogsRef.current.push({ slideId: parseInt(nextSlideId, 10), timestampMs: elapsedMs });
}
```

**결과**: 로그 저장소가 렌더링 사이클과 분리되어, 빠른 연속 전환에서도 최신 배열을 기준으로 dedup 판단이 이루어지도록 바뀌었습니다. 중복 발생률에 대한 정량 수치는 레포에서 확인되지 않습니다(수치 확인 필요: 실제 중복 발생 빈도는 QA 또는 서버 로그 데이터 필요).

**근거**: 커밋 `a56f2cc` (이슈 #284), 파일 `src/components/video/RecordingSection.tsx`

## 3. 청크 업로드 시 코덱/Content-Type 불일치로 인한 업로드 실패 가능성

**문제 상황**: 녹화된 영상을 청크 단위로 서버에 업로드할 때, 브라우저마다 실제로 녹화되는 코덱(webm 또는 mp4)이 다를 수 있는데도 업로드 시 파일 타입을 항상 `'video/webm'`으로 고정하거나, `multipart/form-data` Content-Type 헤더를 수동으로 지정하고 있었습니다. 발생 위치는 `src/hooks/useVideoUpload.ts`, `src/api/endpoints/videos.ts`, `src/hooks/useRecorder.ts`입니다.

**원인 분석**: `6e3e5eb` 커밋(이슈 #178) diff를 보면, 변경 전 `useVideoUpload.ts`는 `videoBlob.slice(..., 'video/webm')`으로 청크의 MIME 타입을 항상 webm으로 고정했습니다. 그러나 `useRecorder.ts`는 `MediaRecorder.isTypeSupported()`로 브라우저가 지원하는 첫 코덱을 선택하는데, Safari 등 일부 브라우저에서는 mp4 계열만 지원될 수 있어 실제 녹화된 데이터와 청크에 표기되는 타입이 불일치할 수 있는 구조였습니다. 또한 `videos.ts`의 `uploadChunk`는 `headers: { 'Content-Type': 'multipart/form-data' }`를 수동으로 지정하고 있었는데, 브라우저가 `FormData`를 전송할 때 자동으로 채워주는 `boundary` 파라미터가 이 수동 헤더에는 빠져 있어 서버가 멀티파트 바디를 올바르게 파싱하지 못할 가능성이 있는 구조였습니다(Content-Type을 수동 지정하면 Axios/브라우저가 boundary를 자동으로 추가하지 못하는 것으로 추정).

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| Content-Type을 계속 수동 지정 | 명시적 | boundary 누락 위험 | 미채택 |
| Content-Type 헤더를 `undefined`로 설정해 브라우저/Axios가 자동으로 boundary 포함 헤더를 채우도록 위임 | boundary 누락 문제 해결 | 헤더를 명시하지 않아 코드만 봐서는 의도가 드러나지 않음 | 채택 |
| 청크 타입을 항상 webm 고정 | 단순함 | mp4로 녹화된 브라우저에서 파일 확장자/타입 불일치 | 미채택 |
| `normalizeVideoMimeType()`으로 실제 녹화 코덱을 감지해 청크 타입/파일명(`chunk-N.webm` / `chunk-N.mp4`)에 반영 | 실제 녹화 데이터와 업로드 메타데이터 일치 | 서버가 두 포맷을 모두 처리할 수 있어야 함(백엔드 영역, 확인 불가) | 채택 |

**해결 과정**: `useRecorder.ts`에 `selectedMimeTypeRef`를 추가해 실제 선택된 코덱을 기억하고 `getRecordedBlob()`이 이 타입으로 Blob을 생성하도록 했습니다. `useVideoUpload.ts`는 `normalizeVideoMimeType(videoBlob.type)`으로 webm/mp4 중 하나로 정규화한 뒤 청크 slice에 사용합니다. `videos.ts`의 `uploadChunk`는 정규화된 타입에 맞춰 파일명(`chunk-${chunkIndex}.webm|mp4`)을 가진 `File` 객체를 만들고, 헤더는 `{ 'Content-Type': undefined }`로 바꿔 Axios/브라우저가 boundary를 포함한 헤더를 자동 설정하도록 했습니다.

**코드 발췌 — 변경 전** (`6e3e5eb` 부모 커밋, `src/api/endpoints/videos.ts`):

```typescript
uploadChunk: (videoId: string, chunkIndex: number, file: Blob) => {
  const formData = new FormData();
  formData.append('file', file);
  const numericId = normalizeVideoId(videoId);

  return apiClient.post<ApiResponse<CreateChunkUploadResponseDto>>(
    `/videos/${numericId}/chunks/${chunkIndex}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
},
```

**코드 발췌 — 변경 후** (현재 상태):

```typescript
uploadChunk: (videoId: string, chunkIndex: number, file: Blob) => {
  const formData = new FormData();
  const normalizedType = file.type.startsWith('video/mp4') ? 'video/mp4' : 'video/webm';
  const ext = normalizedType === 'video/mp4' ? 'mp4' : 'webm';
  const normalizedFile = new File([file], `chunk-${chunkIndex}.${ext}`, { type: normalizedType });
  formData.append('file', normalizedFile);
  const numericId = normalizeVideoId(videoId);

  return apiClient.post<ApiResponse<CreateChunkUploadResponseDto>>(
    `/videos/${numericId}/chunks/${chunkIndex}`,
    formData,
    { headers: { 'Content-Type': undefined } },
  );
},
```

**결과**: 청크의 MIME 타입/파일 확장자가 실제 녹화 코덱과 일치하게 되었고, 멀티파트 요청의 boundary 헤더 누락 가능성이 제거되었습니다. 브라우저별 업로드 성공률에 대한 정량 수치는 레포에서 확인되지 않습니다(수치 확인 필요: Safari/Chrome/Firefox별 업로드 성공률 비교 데이터).

**근거**: 커밋 `6e3e5eb` (이슈 #178), 파일 `src/api/endpoints/videos.ts`, `src/hooks/useRecorder.ts`, `src/hooks/useVideoUpload.ts`, PR #196/#179(병합 커밋 `073e8b8`, `087f6dd`)

## 4. 미디어 스트림 훅의 stale closure와 오디오 분석 참조 오류

**문제 상황**: 디바이스 테스트 화면(`DeviceTestSection.tsx`)에서 웹캠/마이크를 변경하거나 화면을 벗어날 때 스트림 정리가 제대로 되지 않거나, 오디오 볼륨 분석이 예상과 다르게 동작할 수 있는 구조였습니다. 발생 위치는 `src/hooks/useMediaStream.ts`이며, 커밋 메시지에 "스트림훅 장애 해결"로 명시되어 있습니다(이슈 #37).

**원인 분석**: `d8c2853` 커밋 diff를 분석한 결과 두 가지 원인이 확인됩니다. 첫째, `cleanupStream`이 `useCallback`의 의존성 배열에 `stream`(React state)을 직접 참조하고 있어(`[stream, cleanupAudioAnalysis]`), 이 함수가 재생성될 때마다 그 시점의 `stream` 값을 클로저로 캡처하는 구조였습니다. state가 비동기적으로 갱신되는 React 특성상, 정리 시점에 최신 스트림이 아닌 이전 스트림을 참조할 가능성이 있었습니다. 둘째, `updateVolume` 내부에서 `analyzer.getByteFrequencyData(dataArray)`처럼 클로저로 캡처된 지역 변수 `analyzer`를 직접 참조하고 있었는데, `analyzer`가 이미 정리(`cleanupAudioAnalysis`)되어 `analyzerRef.current`가 `null`이 된 이후에도 클로저 안의 `analyzer` 변수 자체는 여전히 유효한 참조를 갖고 있어 좀비 애니메이션 프레임이 계속 실행될 수 있는 구조였습니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| `stream` state만으로 정리 로직 유지 | 코드가 간단함 | stale closure로 최신 스트림을 놓칠 가능성 | 미채택 |
| `streamRef` ref를 별도로 두고 정리 로직은 항상 ref를 참조 | 항상 최신 스트림 트랙을 정리 가능 | state와 ref 두 곳을 동기화해야 함 | 채택 |
| `updateVolume`에서 지역 변수 `analyzer` 대신 `analyzerRef.current` 참조 | `cleanupAudioAnalysis`로 정리된 이후에는 루프가 `!analyzerRef.current` 가드에서 자연히 멈춤 | 없음 | 채택 |

**해결 과정**: `streamRef`를 추가해 `startStream` 성공 시 `streamRef.current = newStream`으로 항상 최신 스트림을 저장하고, `cleanupStream`은 `streamRef.current`를 정리한 뒤 `null`로 비우도록 바꿨습니다(`useCallback` 의존성에서도 `stream` 제거). `updateVolume`은 `analyzer.getByteFrequencyData` 대신 `analyzerRef.current.getByteFrequencyData`로 바꿔, 정리 이후 가드(`if (!analyzerRef.current) return;`)가 실제로 동작하도록 했습니다.

**코드 발췌 — 변경 전** (`d8c2853` 부모 커밋):

```typescript
const cleanupStream = useCallback(() => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  cleanupAudioAnalysis();
}, [stream, cleanupAudioAnalysis]);
// updateVolume 내부
analyzer.getByteFrequencyData(dataArray);
```

**코드 발췌 — 변경 후** (현재 상태):

```typescript
const cleanupStream = useCallback(() => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
  setStream(null);
  cleanupAudioAnalysis();
}, [cleanupAudioAnalysis]);
// updateVolume 내부
if (!analyzerRef.current) return;
analyzerRef.current.getByteFrequencyData(dataArray);
```

**결과**: 스트림 정리 로직이 항상 최신 스트림을 대상으로 동작하도록 바뀌었고, 오디오 분석 루프가 정리 이후 가드에 걸려 정상 종료되도록 바뀌었습니다. 이 문제로 인한 실제 장애 빈도나 재현 로그는 레포에 남아있지 않아 정량화하지 못했습니다(수치 확인 필요).

**근거**: 커밋 `d8c2853` (이슈 #37), 파일 `src/hooks/useMediaStream.ts`, PR #44 (병합 커밋 `9cbaede`)

## 5. VideoRecordPage 무한 리렌더링 루프

**문제 상황**: 녹화 페이지(`VideoRecordPage.tsx`) 진입 시 컴포넌트가 무한히 리렌더링되는 문제가 있었습니다(커밋 메시지 "무한루프 해결", 이슈 #111).

**원인 분석**: `5e75db5`의 부모 커밋을 확인한 결과, `MOCK_SLIDES`라는 배열이 컴포넌트 함수 본문 안에서 `Array.from(...)`으로 매 렌더링마다 새로 생성되고 있었고, 이 배열이 데이터 초기화용 `useEffect`의 의존성 배열(`[projectId, MOCK_SLIDES]`)에 그대로 포함되어 있었습니다. `MOCK_SLIDES`는 매 렌더마다 새로운 배열 참조이므로 `useEffect`는 매번 "의존성이 바뀌었다"고 판단해 실행되고, effect 내부의 `setRecordingData()`가 다시 리렌더링을 유발해 `MOCK_SLIDES`가 다시 새로 생성되는 순환이 발생하는 구조였습니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| `useEffect` 의존성 배열에서 `MOCK_SLIDES` 제거 | 빠른 수정 | ESLint `react-hooks/exhaustive-deps` 규칙 위반, 실제 데이터로 교체 시 동기화 누락 위험 | 미채택 |
| `MOCK_SLIDES`를 `useMemo`로 감싸기 | 컴포넌트 내부에 유지 가능 | 불필요한 훅 오버헤드, 애초에 상수인데 훅을 쓸 이유가 없음 | 미채택 |
| `MOCK_SLIDES`를 컴포넌트 바깥(모듈 스코프)의 상수로 이동 | 매 렌더 동일 참조 보장, 코드가 더 단순해짐 | 컴포넌트 props/state에 의존하지 않는 진짜 상수여야 함(이 경우 해당) | 채택 |

**해결 과정**: `MOCK_SLIDES` 선언을 컴포넌트 함수 바깥, 모듈 최상단으로 이동시켰습니다. 이제 배열은 모듈이 로드될 때 한 번만 생성되고, `useEffect`의 의존성 배열에 포함되어 있어도 참조가 바뀌지 않으므로 무한 루프가 발생하지 않습니다.

**코드 발췌 — 변경 전** (`5e75db5`의 부모 커밋, `src/pages/VideoRecordPage.tsx`):

```typescript
export default function VideoRecordPage() {
  // ...
  const MOCK_SLIDES: RecordingSlide[] = Array.from({ length: 10 }, (_, index) => ({
    id: `slide-${index + 1}`,
    page: index + 1,
    title: '제목없음',
    imageUrl: `/thumbnails/p1/${index}.webp`,
    script: `슬라이드 ${index + 1}번의 임시 대본입니다. ...`,
  }));

  useEffect(() => {
    // ...
    const data: RecordingProject = { projectId, title: `프로젝트 ${projectId}`, slides: MOCK_SLIDES };
    setRecordingData(data);
    // ...
  }, [projectId, MOCK_SLIDES]);
```

**코드 발췌 — 변경 후** (`5e75db5`):

```typescript
const MOCK_SLIDES: RecordingSlide[] = Array.from({ length: 10 }, (_, index) => ({
  id: `slide-${index + 1}`,
  page: index + 1,
  title: '제목없음',
  imageUrl: `/thumbnails/p1/${index}.webp`,
  script: `슬라이드 ${index + 1}번의 임시 대본입니다. ...`,
}));

export default function VideoRecordPage() {
  // ...
  useEffect(() => {
    // ...
  }, [projectId]); // MOCK_SLIDES 제거
```

**결과**: 무한 리렌더링이 해소되어 페이지가 정상적으로 1회 초기화됩니다. 수정 전 실제 브라우저 탭 크래시나 CPU 사용률 등의 정량 데이터는 레포에서 확인되지 않습니다(수치 확인 필요).

**근거**: 커밋 `5e75db5` (이슈 #111), 파일 `src/pages/VideoRecordPage.tsx`, PR #113 (병합 커밋 `e665a6d`, 브랜치명 `refactor/setting-type-111`)

## 6. 빌드 오류 반복 발생 (이슈 #109)

**문제 상황**: 이슈 #109(`feat/recording-connection-109`) 작업 기간 동안 "빌드 오류 해결", "빌드 오류 재수정"이라는 메시지의 커밋이 6회 연속 발생했습니다(`4efeb69`, `5fe1c9c`, `6cc7127`, `636405c`, `199c37a`, `f35d7f5`).

**원인 분석**: 각 커밋의 diff를 확인한 결과, 반복된 원인은 단일하지 않고 (1) DTO 구조 변경(`1891c9b`, `3a24961` "dto 구조 변경")과 (2) 타입 에러(`27d1a1b` "타입에러 수정", `a3792a8` "videoId 타입에러") 두 계열이 번갈아 나타났습니다. `videoId`가 API 스펙상 숫자(number)와 문자열(string) 경계를 오가며 사용되는 과정에서(`normalizeVideoId` 헬퍼가 이후 도입된 배경으로 추정) 여러 차례 타입 불일치가 발생했다가 순차적으로 수정된 것으로 보입니다. 다만 각 커밋의 정확한 빌드 에러 메시지 자체는 로그로 남아있지 않아, 이 항목은 diff에서 확인 가능한 변경 내용까지만 근거로 삼습니다.

**검토한 대안**: 이 사안은 설계 대안 비교가 아니라 반복적인 컴파일 오류 수정 과정이므로 대안 비교표는 생략합니다.

**해결 과정**: 최종적으로 `src/api/endpoints/videos.ts`에 `normalizeVideoId(videoId: string | number): number` 헬퍼를 두어, videoId를 다루는 모든 API 함수 진입점에서 타입을 일원화했습니다(현재 코드에서 확인됨, `videos.ts:17-23`).

```typescript
const normalizeVideoId = (videoId: string | number): number => {
  const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  if (isNaN(numericId)) {
    throw new Error(`Invalid videoId: ${videoId}`);
  }
  return numericId;
};
```

**결과**: 이 헬퍼 도입 이후(이슈 #109 종료 시점 이후) 커밋 이력에서 videoId 관련 "타입에러" 키워드의 재발이 확인되지 않습니다(`git log --grep`으로 이후 커밋 확인). 다만 이는 간접 근거이며, 헬퍼 도입이 근본 해결이었는지 다른 요인이 있었는지는 (확인 필요)입니다.

**근거**: 커밋 `1891c9b`, `3a24961`, `27d1a1b`, `a3792a8`, `4efeb69`, `5fe1c9c`, `6cc7127`, `636405c`, `199c37a`, `f35d7f5` (이슈 #109), 파일 `src/api/endpoints/videos.ts`, PR #131 (병합 커밋 `21f99fe`)

---

# 7. 결과

- 본인 author 기준 총 134개 커밋, 18,146줄 추가/7,967줄 삭제 (측정 조건: `git log --perl-regexp --author=... --shortstat` 합산, 병합 커밋의 diffstat 포함).
- 담당 기능(영상 녹화~업로드~목록~상세) 관련 이슈 10개(#37, #48, #109, #111, #114, #120, #144, #178, #195, #284)에 대해 최소 11개의 PR을 진행했습니다(병합 커밋 기준 #44, #82, #113, #121, #131, #176, #179, #196, #223, #286, #287).
- CI 게이트(`pr-check.yml`)는 lint → type-check → build 3단계이며, 이 워크플로가 본인 PR에도 동일하게 적용되었을 것으로 추정되나 개별 PR의 실제 CI 통과 로그(GitHub Actions run 기록)는 이 레포의 git 이력만으로는 확인할 수 없습니다(확인 필요).
- 테스트 커버리지: `vitest.config.ts`와 `package.json`의 `test:coverage` 스크립트는 존재하나, 본인이 작성한 파일(`useRecorder.ts`, `useVideoUpload.ts`, `useMediaStream.ts`, `RecordingSection.tsx` 등) 중 대응하는 `.test.ts(x)` 파일은 확인되지 않았습니다(`git log --author -- '*.test.*'` 결과 없음). 즉 본인 담당 영역의 자동화된 테스트는 없는 상태입니다.
- 배포/운영 결과(실제 서비스 트래픽, 장애 이력, 사용자 수 등)는 이 레포에서 확인할 수 없습니다(확인 필요).
- 수상 내역은 레포에서 확인되지 않습니다(확인 필요).

---

# 8. 회고

- 담당 기능(녹화·업로드) 전체에 걸쳐 본인이 작성한 로직에 대한 유닛 테스트가 한 건도 없었던 점이 가장 아쉽습니다. 특히 `useRecorder.ts`의 비동기 종료 처리(6.1절)나 `RecordingSection.tsx`의 슬라이드 로그 dedup 로직(6.2절)처럼 타이밍에 민감하고 회귀에 취약한 코드일수록 테스트가 필요했는데, `MediaRecorder`/`getUserMedia` 등 브라우저 API에 대한 모킹 설계 없이 개발이 진행된 것으로 보입니다. 다시 한다면 `useRecorder`, `useMediaStream`처럼 브라우저 API를 감싸는 훅부터 모킹 가능한 인터페이스로 설계하고 초기 단계에 테스트를 붙였을 것입니다.
- 이슈 #109 구간에서 "빌드 오류 해결" 커밋이 6회 연속된 것(6.6절)은, videoId의 string/number 경계를 처음부터 하나의 타입으로 못박지 않고 여러 파일에 흩어진 채로 개발을 시작했기 때문으로 보입니다. `normalizeVideoId` 같은 경계 정규화 함수를 기능 초기에 먼저 정의했다면 반복 수정을 줄일 수 있었을 것입니다.
- 트러블슈팅 1, 2번(녹화 종료 레이스 컨디션, 슬라이드 로그 dedup)은 모두 "비동기/이벤트 기반으로 실제로 끝났는지 확인하지 않고 고정 시간이나 React state 클로저에 의존"한 동일한 패턴에서 비롯됐습니다. 두 문제 모두 같은 PR 사이클(#284)에서 함께 발견되고 수정된 것으로 보아, 초기 설계 단계에서 "이 작업이 언제 끝나는지를 어떻게 알 것인가"를 더 명시적으로 점검했다면 더 일찍 잡을 수 있었을 것입니다.
- 코드 리뷰 프로세스에 Gemini/Claude 기반 AI 리뷰가 포함되어 있었고(커밋 메시지 "gemini 코드리뷰 반영", "클로드 리뷰 반영") 실제로 그 피드백을 반영한 커밋들이 확인되지만, 리뷰에서 어떤 지적이 있었고 무엇을 고쳤는지에 대한 상세 내용은 커밋 메시지만으로는 알 수 없어 이 문서에 구체적으로 녹이지 못했습니다.

---

# 9. 스크린샷 및 문서 제안

## 이미 레포에 존재하는 자료

| 경로 | 설명 |
| --- | --- |
| `docs/tech-stack.md` | 기술 선택 이유 전문 |
| `docs/environment.md` | 환경 변수 설정 가이드 |
| `docs/slide-data-flow.md` | Zustand 슬라이드 스토어 데이터 흐름 mermaid 다이어그램 (7개, Context 대비 Zustand 비교 포함) — 슬라이드 편집 영역은 타인 담당이라 본 문서 4장에서는 텍스트로만 요약했습니다. 다이어그램을 그대로 인용하려면 이 파일을 직접 참조하는 것을 권장합니다.
| `docs/slide-data-flow-legacy.md` | slide-data-flow의 이전 버전으로 추정 (내용 비교 미실시, 확인 필요) |
| `docs/api-connect.md` | DTO/Model/Service 계층 분리 가이드 |
| `public/og-image.png` | OG 이미지 (소셜 공유 미리보기용, 서비스 스크린샷은 아닐 수 있음) |
| `public/p1.webm`, `public/thumbnails/p*.pdf` | 샘플 슬라이드/영상 리소스로 추정 (용도 확인 필요) |

## 추가로 촬영을 제안하는 캡처

| 파일명(제안) | 촬영할 화면 | 들어갈 섹션 |
| --- | --- | --- |
| `device-test.png` | `/​:projectId/video/record` 진입 후 웹캠/마이크 선택 화면 (`DeviceTestSection`) | 5장 핵심 구현 4번 |
| `recording-in-progress.png` | 녹화 중 화면 (슬라이드 + 캠 PiP + 진행 상황 리스트, `RecordingSection`) | 5장 핵심 구현 1, 2번 |
| `upload-progress.png` | 청크 업로드 진행률 UI | 5장 핵심 구현 3번 |
| `video-list-processing.png` | 처리 중(processing) 상태 배지가 보이는 영상 목록 화면 | 5장 핵심 구현 5번 |
| `video-detail-comments.png` | 영상 상세 페이지의 타임스탬프 댓글 스레드 | 5장 핵심 구현 6번 |
| `architecture-diagram.png`(제안, 직접 제작 필요) | 4장 아키텍처 흐름을 시각화한 다이어그램(현재는 텍스트 트리로만 존재) | 4장 아키텍처 |

---

# 10. 확인 필요 항목

## 직접 채워야 하는 정보

1. 실제 배포 URL 접속 가능 여부와 현재 서비스 상태 (CSP에서 `api.ttorang.com`, `cdn.ttorang.com` 도메인만 확인됨)
2. 팀 내에서의 정확한 역할 경계 — 본 문서는 git 커밋 파일 집계로 추정했으나, 실제 담당 배분(예: 영상 기능을 단독 담당했는지 다른 팀원과 페어로 진행했는지)은 본인이 직접 기술해야 정확합니다.
3. 패키지 매니저 확정 — `bun.lock`, `package-lock.json`, `pnpm-lock.yaml`이 모두 존재해 실제 사용 매니저를 특정할 수 없습니다.
4. `docs/websocket-implementation.md`가 README에는 언급되나 실제 파일이 존재하지 않는 이유 (삭제됐는지, 아직 작성 전인지)
5. `FD_VID_01`, `PD_VID_04` 같은 기능 식별자 체계가 어떤 명세 문서/도구(Notion, Jira 등)에서 관리되는지
6. 각 수치 확인 필요 항목(6장 트러블슈팅의 "결과" 절 참고) — 실제 QA 로그, 서버 모니터링 데이터, 브라우저별 실사용 통계가 있다면 채워 넣을 것을 권장합니다.
7. 팀 구성 14명 중 실제 재직/참여 기간이 겹치는 인원, 본인과 직접 협업한 인원 범위

## 근거 부족으로 제외한 트러블슈팅 후보

- **"gemini 코드리뷰 반영"(`08132b0`), "클로드 리뷰 반영"(`02119e3`) 커밋들**: 무엇을 지적받아 무엇을 고쳤는지 diff만으로는 리뷰 코멘트 원문을 알 수 없어, 문제-원인-해결 구조로 서술하기에 근거가 부족해 제외했습니다.
- **`3fc6af7` "청크 업로드 일부 수정"**: `recorder.start(1000)` → `recorder.start(3000)` 변경, 디버그용 `console.log` 추가 등 여러 변경이 섞여 있고 청크 간격 변경의 구체적 이유(성능? 서버 부하?)가 커밋 메시지나 코드 주석에 없어 트러블슈팅으로 서술하지 않고 5장 참고 자료로만 다뤘습니다.
- **`d7a78d0` "슬라이드 캠 위치 수정", `fb9f710` "발표중 슬라이드 자동 스크롤", `680f09b` "타임스탬프 수정"**: 이슈 #284 사이클의 부수적 UI 수정으로, diff가 CSS/레이아웃 값 조정 수준이라 기술적 트러블슈팅보다는 일반 버그 수정에 가까워 제외했습니다.
- **PR #223 "refactor/video-improve-195"**: 병합 커밋만 확인되고 이슈 #195의 개별 커밋 diff는 본 조사에서 상세 분석하지 않았습니다. 추가로 다룰 가치가 있는지 재검토가 필요합니다.

---

# 11. 면접 예상 질문

1. **"녹화 종료 시 setTimeout 고정 대기 대신 이벤트 기반으로 바꾼 이유는?"** — 6.1절 답변 가능. 다만 변경 전후의 실제 실패율(0바이트 영상 발생 빈도) 수치가 레포에 없으므로, 면접 전 실제 QA/모니터링 데이터로 뒷받침할 수치를 준비해두는 것을 권장합니다.
2. **"청크를 병렬이 아니라 순차로 업로드한 이유는? 병렬 업로드는 검토하지 않았나?"** — 서버 API가 `chunkIndex` 기반이라는 것은 코드로 확인되지만, 병렬 업로드를 실제로 검토했는지는 커밋 이력에 없습니다. 서버 측 제약(순서 보장 필요 여부)을 실제로 확인하고 답변을 준비해야 합니다.
3. **"Content-Type을 `undefined`로 설정한 것이 왜 boundary 문제를 해결하는지 설명해달라"** — Axios/브라우저의 `FormData` + `Content-Type` 자동 설정 메커니즘(boundary 파라미터)을 정확히 설명할 수 있어야 합니다. 실제로 이 변경 전후 업로드 실패가 재현/재현되지 않았는지 로그 기반 확인이 없어, "왜 이 변경이 필요하다고 판단했는지"에 대한 재현 시나리오를 스스로 한 번 더 검증해두는 것을 권장합니다.
4. **"MOCK_SLIDES를 모듈 스코프로 옮긴 것 외에, useEffect 의존성 배열 자체를 줄이는 방법은 고려하지 않았나?"** — `useMemo`로 감싸는 대안과의 트레이드오프(불필요한 훅 오버헤드 vs 명시성)를 설명할 수 있어야 하며, 이 판단이 실제 코드 리뷰(Gemini 반영 커밋들)에서 논의됐는지는 확인되지 않아 본인의 판단 근거를 정리해두는 것이 좋습니다.
5. **"영상 타임스탬프 기반 댓글 정렬에서, 답글이 부모의 타임스탬프를 상속하는 설계를 택한 이유는?"** — 코드 구조상 UX 목적(재생바-댓글 연동)으로 추정했으나, 본인이 직접 설계했다면 실제 결정 배경(디자인 명세, 다른 대안 검토 여부)을 명확히 답할 수 있어야 합니다. 이 부분은 커밋 메시지에 설계 의도가 남아있지 않아 (확인 필요) 항목이었습니다.
6. **"이슈 #109에서 빌드 오류가 6번 연속 발생한 근본 원인이 정말 videoId 타입 문제였는가, 아니면 다른 요인도 있었는가?"** — 본 문서는 diff 관찰로 추정했을 뿐 실제 빌드 에러 로그를 확보하지 못했습니다. 당시 CI 로그가 남아있다면(GitHub Actions 기록) 확인 후 더 정확히 답변할 수 있습니다.
7. **"테스트가 전혀 없는 상태로 이 기능들을 배포한 것에 대해 어떻게 생각하는가?"** — 8장 회고에서 다룬 대로, 브라우저 API 모킹의 어려움과 일정상의 트레이드오프를 솔직하게 설명하고, 다시 한다면 어떤 계층부터 테스트를 붙일지(예: `normalizeVideoMimeType`, `normalizeVideoId` 같은 순수 함수부터) 구체적으로 답할 수 있어야 합니다.
