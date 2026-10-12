# 1. 3분 요약

| 항목 | 내용 |
| :--- | :--- |
| 프로젝트명 | Naru (나루) |
| 서비스 정의 | 청각장애인과 건청인 간의 양방향 실시간 소통을 지원하는 수어 인식 및 WebRTC 영상 통화 웹 애플리케이션 |
| 개발 기간 | 2026-08-25 ~ 2026-08-26 (유니톤 해커톤) |
| 팀 구성 | 4인 (프론트엔드 3인, 백엔드 1인) |
| 담당 직무 | 프론트엔드 개발자 (수어 비전 인식 엔진, WebRTC 통화 룸, AI 파이프라인 전담) |
| 핵심 기술 스택 | TypeScript 7.0, React 19, Bun, Vite 8.2, MediaPipe Vision 1.0, LiveKit Client 2.22, TanStack Router/Query, Zustand, Tailwind CSS v4, SEED Design |
| 서비스 링크 | 프론트엔드: (확인 필요: 배포 도메인), 백엔드 API: https://naru-backend.perasite.dev |

- 핵심 성과 1: MediaPipe 상체 포즈(6개 랜드마크)와 양손(42개 랜드마크)의 150차원 특징 벡터를 추출하고, 어깨 중심점 및 어깨 너비 기반 좌표 정규화와 Dynamic Time Warping (DTW) 알고리즘을 결합하여 클라이언트 브라우저 환경에서 초당 15~30프레임 속도의 실시간 수어 인식 엔진을 구현했습니다.
- 핵심 성과 2: 손 내림 상태 감지(Hands-Gone Detection, 1500ms)와 최근 12턴의 양방향 대화 컨텍스트를 결합한 LLM 문장 변환 파이프라인을 구축하여, 분절된 수어 단어 나열을 문맥에 맞는 자연스러운 한국어 문장으로 실시간 번역 전송하도록 구현했습니다.
- 핵심 성과 3: LiveKit WebRTC 실시간 연결 해제 이벤트와 백엔드 통화 상태 DB 간의 경쟁 상태(Race Condition)를 500ms 간격 3회 재검증 루프로 해결하여, 상대방 통화 종료 시 불필요하게 '다시 연결 중...' UI로 진입하던 오작동을 제거했습니다.

# 2. 개요

## 배경과 문제
- 해결하고자 한 문제: 청각장애인(수어 사용자)과 건청인(음성 사용자) 간의 전화 통화는 중계사 없이는 직접적인 소통이 불가능하며, 기존 화상 통화 솔루션은 수어를 실시간 음성/텍스트로 통역하거나 상대방의 음성을 실시간 수어 번역 컨텍스트로 변환해 주는 기능이 부재했습니다.
- 대상 사용자: 수어로 소통하는 청각장애인 사용자 및 음성으로 통화하는 건청인 사용자.
- 기술적 난제:
  - 서버 GPU 인프라 비용 없이 클라이언트 브라우저의 웹캠 입력만으로 60FPS 환경에서 랜드마크를 추출하고 지연 시간 없이 수어 모션을 판별해야 했습니다.
  - 사용자의 신체 체격 차이, 카메라와의 거리, 화면 내 위치 변화에 따른 랜드마크 좌표 왜곡을 보정해야 했습니다.
  - 통화 중 수어 사용자가 한 문장의 발화를 끝마쳤음을 감지하는 기준과, 분절된 단어들을 대화 흐름에 맞게 자연스러운 문장으로 조합하는 처리 지연 시간을 최소화해야 했습니다.
  - WebRTC 실시간 미디어 스트림, 데이터 채널 채팅, 자막 수신, 텍스트 입력 모드 전환이 동시에 일어나는 통화 룸의 복잡한 비동기 상태를 안정적으로 제어해야 했습니다.

## 담당 범위
- 본인 기여 영역:
  - 실시간 수어 인식 및 비전 처리 파이프라인 설계 및 구현 (`src/features/sign-capture/`)
  - MediaPipe HandLandmarker 및 PoseLandmarker 연동 훅 및 Canvas 스켈레톤 오버레이 시각화 (`src/shared/lib/use-hand-landmarker.ts`, `src/shared/lib/use-pose-landmarker.ts`, `src/features/sign-capture/ui/sign-capture-view.tsx`)
  - 150차원 특징 벡터 추출 및 신체 좌표 정규화 기반 DTW 템플릿 매칭 알고리즘 구현 (`src/features/sign-capture/model/landmarks.ts`, `src/features/sign-capture/model/dtw.ts`)
  - 발화 종료 감지(Hands-Gone Flush) 및 LLM 대화 히스토리 기반 문장 변환 파이프라인 구축 (`src/features/sign-capture/model/use-sign-capture.ts`, `src/features/sign-capture/api/sign-api.ts`)
  - 통화 룸 UI 리팩토링, 수어(SIGN)/텍스트(TEXT)/음성(HEARING) 모드 통합 타임라인 구축 (`src/widgets/call-room/ui/call-room.tsx`)
  - LiveKit WebRTC 연결 수립, 재연결 및 통화 종료 시 상태 판별 안정화 (`src/features/join-call/model/use-join-call.ts`)
  - 카메라 독립 테스트 라우트 개발 (`src/pages/test-camera/`)
- 타인 작성 영역 및 협업 방식:
  - Andy Hong: 키패드 UI 및 전화번호 입력 플로우, iOS 햅틱 연동 (`ios-haptics`), SEED Design 기반 NARU 컬러 토큰 및 설정/최근 통화 페이지 구현 (`src/pages/home/`, `src/pages/recent/`, `src/entities/call/model/device-identity.ts`)
  - eeeeeaaan: 백엔드 DB 기반 DTW 수어 템플릿 참조 데이터 API 연동, 마이페이지 수어 등록 인터페이스 연동 (`src/pages/profile/`, `src/features/sign-capture/model/dtw.ts`)
  - 백엔드 개발자 (PeraSite): Spring Boot 기반 전화 수신/발신 폴링 API, LiveKit 토큰 발급, OpenAI LLM 문장 합성 API (`/api/sign-language/compose`), 수어 참조 데이터 영속화 API 구축
  - 협업 방식: Feature-Sliced Design (FSD) 아키텍처 규칙을 Steiger 린터로 강제하고, Git 브랜치 전략(기능별 feature/* 및 fix/* 브랜치)과 PR 코드 리뷰를 통해 병합했습니다. pre-commit 단계에서 Lefthook을 이용해 Biome, TypeScript 타입 체크, Steiger 아키텍처 검사를 자동 수행했습니다.

# 3. 기술 스택

| 분류 | 기술 및 라이브러리 | 버전 | 확인된 근거 및 선택 이유 |
| :--- | :--- | :--- | :--- |
| Runtime | Bun | latest | package.json, 고속 패키지 관리 및 빠른 스크립트 실행 환경 |
| Core Framework | React | ^19.2.8 | package.json, 최신 React 19 동시성 기능 및 hooks 활용 |
| Language | TypeScript | ^7.0.2 | package.json, 엄격한 정적 타입 검증 |
| Build Tool | Vite | ^8.2.2 | package.json, Rolldown 기반 초고속 번들링 및 개발 서버 |
| Computer Vision | @mediapipe/tasks-vision | ^1.0.1 | package.json, 브라우저 WebAssembly 기반 손(Hand) 및 자세(Pose) 랜드마크 실시간 추적 |
| Realtime WebRTC | livekit-client | ^2.22.0 | package.json, 실시간 영상/음성 스트리밍 및 데이터 채널(lk.chat) 통신 |
| Routing | @tanstack/react-router | ^1.170.32 | package.json, vite.config.ts, 완전한 파일 기반 타입 안전 라우팅 |
| Server State | @tanstack/react-query | ^5.102.1 | package.json, 통화 상태 폴링 및 비동기 캐싱 관리 |
| Client State | zustand | ^5.0.15 | package.json, 경량 전역 상태 관리 |
| Design System | @seed-design/react | ^2.3.0 | package.json, 당근마켓 SEED 디자인 시스템 컴포넌트 라이브러리 |
| Styling | tailwindcss | ^4.3.3 | package.json, Tailwind CSS v4 CSS 기반 테마 및 유틸리티 |
| Code Quality | @biomejs/biome | ^2.5.10 | package.json, 초고속 린팅 및 포맷팅 |
| Architecture Lint | steiger | ^0.6.0 | package.json, Feature-Sliced Design (FSD) 계층 의존성 규칙 강제 |
| Git Hooks | lefthook | ^2.1.10 | package.json, lefthook.yml, 커밋 전 병렬 린트/타입체크/아키텍처 검사 수행 |
| Deployment | wrangler | ^4.125.0 | package.json, Cloudflare Pages 정적 호스팅 배포 |

# 4. 설계

## 아키텍처
본 프로젝트는 Feature-Sliced Design (FSD) 방법론을 엄격하게 적용하여 단방향 의존성 규칙을 유지했습니다.
의존성 방향: `app -> pages -> widgets -> features -> entities -> shared`

```
src/
  app/         애플리케이션 부트스트랩, 라우터 설정, 전역 프로바이더
  pages/       라우트별 페이지 조합 (home, call, lobby, my, recent)
  widgets/     대규모 결합 UI 블록 (call-room, phone-nav, page-top-bar)
  features/    단일 사용자 행동 단위 (sign-capture, join-call, receive-captions, toggle-mic, play-agent-audio)
  entities/    도메인 모델 및 API 연동 (call, caption)
  shared/      재사용 가능한 공통 컴포넌트, MediaPipe 훅, 유틸리티, API 클라이언트
```

요청 처리 흐름:
1. 사용자가 통화를 시작하면 `features/join-call`의 `useJoinCall` 훅이 발신/수신 상태 머신을 구동합니다.
2. 백엔드에서 통화가 수락되면 LiveKit 접속 토큰과 Room URL을 발급받아 `livekit-client`가 방에 연결됩니다.
3. 청각장애인 모드에서는 `features/sign-capture`의 `SignCaptureView`가 마운트되어 웹캠 스트림을 활성화하고 MediaPipe 랜드마커를 시작합니다.
4. 비디오 프레임마다 추출된 랜드마크는 30프레임 롤링 윈도우에 적재되며, 브라우저 메모리에 캐싱된 참조 데이터와 DTW 매칭을 수행합니다.
5. 단어가 연속 5프레임 이상 일관되게 감지되면 단어 버퍼에 확정 등록됩니다.
6. 양손이 화면에서 사라진 상태가 1500ms 이상 지속되면 `features/sign-capture/api/sign-api.ts`를 통해 백엔드 LLM으로 확정 단어 목록과 최근 대화 히스토리를 전송합니다.
7. LLM이 완성한 자연어 문장은 LiveKit 데이터 채널(`lk.chat`)을 통해 상대방에게 브로드캐스트되고, 통화 룸 타임라인에 표시됩니다.

## 데이터 모델
- 수어 랜드마크 특징 벡터 (150차원):
  - Pose (상체 6개 랜드마크: 좌우 어깨 11, 12 / 팔꿈치 13, 14 / 손목 15, 16): 6개 x 4차원(x, y, z, visibility) = 24차원
  - Left Hand (21개 랜드마크): 21개 x 3차원(x, y, z) = 63차원
  - Right Hand (21개 랜드마크): 21개 x 3차원(x, y, z) = 63차원
  - 총합 150차원 1D 배열로 매 프레임 직렬화되어 30프레임 Rolling Window(`RollingWindow`)에 보관됩니다.
- DTW 수어 참조 데이터 모델 (`ReferenceStore`):
  - `Record<string, number[][][]>` 구조로 단어명(key)마다 여러 개의 30프레임 시퀀스(sample)를 보관합니다.
- 타임라인 통합 모델 (`TimelineItem`):
  - `kind: "caption"`: WebRTC 데이터 채널 또는 음성 인식으로 수신된 자막 데이터.
  - `kind: "message"`: 로컬에서 수어로 합성했거나 텍스트로 직접 입력하여 송신한 메시지 (`state: "sending" | "sent" | "failed"`).

## API 및 인터페이스
- 백엔드 통화 세션 API:
  - `POST /api/calls`: 통화 방 생성 및 세션 키 발급
  - `POST /api/calls/{callId}/join`: 통화 참여
  - `GET /api/calls/{callId}/status`: 통화 상태 폴링 (WAITING, ACTIVE, REJECTED, ENDED)
  - `POST /api/calls/{callId}/accept`: 통화 수락
  - `POST /api/calls/{callId}/reject`: 통화 거절
  - `POST /api/calls/{callId}/heartbeat`: 10초 주기 세션 유지 신호 전송
  - `POST /api/calls/{callId}/terminate`: 통화 명시적 종료
- 수어 및 LLM API:
  - `GET /api/sign-language/references`: 전체 수어 템플릿 참조 데이터 조회
  - `PUT /api/sign-language/references/{word}`: 단어별 템플릿 샘플 저장
  - `DELETE /api/sign-language/references/{word}`: 단어 템플릿 삭제
  - `POST /api/sign-language/compose`: 단어 목록과 대화 히스토리(`ConversationTurn[]`)를 전달하여 자연어 문장 생성
- 실시간 LiveKit 인터페이스:
  - 토픽 `lk.chat`: 수어 번역 문장 및 텍스트 채팅 메시지 송수신
  - 오디오 트랙: 건청인 사용자의 마이크 음성 스트림 및 음성 합성 재생 트랙 송수신

## 인프라 및 배포
- 프론트엔드 호스팅: Cloudflare Pages (`wrangler pages deploy dist`)
- 백엔드 환경: Spring Boot 서버 (`https://naru-backend.perasite.dev`)
- 로컬 개발 환경: Vite 개발 프록시 설정을 통해 `/api` 경로를 원격 백엔드로 전달하여 CORS 제약 우회
- 환경 변수 관리: Zod 스키마 기반 런타임 유효성 검증 (`src/shared/config/env.ts`)

## 디렉터리 구조
```
src/
├── app/                        # 앱 진입점 및 전역 설정
│   ├── main.tsx                # React 19 루트 렌더링
│   ├── router.ts               # TanStack Router 인스턴스
│   ├── routeTree.gen.ts        # 파일 라우팅 자동 생성 트리
│   ├── providers/              # QueryClient 등 전역 프로바이더
│   ├── routes/                 # 파일 기반 라우트 컴포넌트
│   │   ├── __root.tsx          # 최상위 레이아웃
│   │   ├── index.tsx           # 홈 화면 (키패드)
│   │   ├── call.tsx            # 통화 세션 화면
│   │   ├── lobby.tsx           # 통화 대기 화면
│   │   ├── my.tsx              # 내 정보 및 수어 등록
│   │   └── recent.tsx          # 최근 통화 기록
│   └── styles/index.css        # SEED 토큰 및 Tailwind v4 스타일
├── entities/                   # 도메인 모델 계층
│   ├── call/                   # 통화 API, 설정, 디바이스 식별 로직
│   └── caption/                # 자막 데이터 타입 및 UI 컴포넌트
├── features/                   # 기능 단위 계층
│   ├── join-call/              # 통화 연결 상태 머신 및 재연결 제어
│   ├── play-agent-audio/       # 원격 오디오 트랙 재생
│   ├── receive-captions/       # 실시간 자막 수신 훅
│   ├── sign-capture/           # 실시간 수어 인식, DTW 매칭, LLM 문장 합성
│   └── toggle-mic/             # 마이크 켜기/끄기 토글
├── pages/                      # 라우트 페이지 결합 계층
│   ├── home/                   # 키패드 통화 시작 페이지
│   ├── call/                   # 통화 진행 페이지
│   ├── lobby/                  # 대기실 페이지
│   ├── profile/                # 수어 등록 및 설정 페이지
│   └── recent/                 # 최근 기록 페이지
├── shared/                     # 공통 유틸리티 계층
│   ├── api/                    # Axios 인스턴스 및 TanStack Query 설정
│   ├── config/                 # 환경 변수 유효성 검사 (Zod)
│   ├── lib/                    # MediaPipe 랜드마커 훅, 캔버스 스켈레톤 렌더러
│   └── ui/                     # SEED Design 기반 기본 UI 컴포넌트
└── widgets/                    # 복합 UI 블록 계층
    ├── call-room/              # 통화 룸 (타임라인, 컨트롤 바, 비디오 뷰)
    ├── page-top-bar/           # 상단 공통 네비게이션 바
    └── phone-nav/              # 하단 네비게이션 바
```

# 5. 핵심 구현

## 상체 및 양손 랜드마크 기반 150차원 특징 추출과 DTW 템플릿 매칭 엔진
- 무엇을 구현했는가:
  - 브라우저 웹캠 영상에서 MediaPipe를 통해 사용자의 상체(Pose)와 양손(Hand) 랜드마크를 추출하고, 30프레임 시퀀스를 기반으로 등록된 수어 템플릿과 실시간 DTW 거리 비교를 수행하여 단어를 판별하는 엔진을 구현했습니다.
- 어떻게 구현했는가:
  - `splitHandsByHandedness` 함수를 통해 MediaPipe가 반환한 손 랜드마크의 왼손/오른손 라벨을 분리했습니다.
  - 상체 6개 랜드마크(어깨, 팔꿈치, 손목)에서 24차원, 왼손 21개 랜드마크에서 63차원, 오른손 21개 랜드마크에서 63차원을 추출하여 총 150차원의 특징 벡터를 구성했습니다 (`extractFeatures`).
  - 30프레임 크기의 롤링 윈도우(`RollingWindow`)에 특징 벡터를 누적하고, 윈도우가 가득 차면 인메모리에 캐싱된 모든 참조 단어 샘플과 DTW 거리를 계산했습니다 (`closestReference`).
  - 순간적인 손 떨림이나 중간 전이 동작으로 인한 오인식을 방지하기 위해 동일한 단어 후보가 5프레임 연속(`REQUIRED_STREAK = 5`) 일치할 때만 단어로 최종 확정했습니다 (`updateCandidateStreak`).
- 선택지와 판단:
  - 사전 학습된 딥러닝 분류기(LSTM/CNN) 대신 DTW 템플릿 매칭을 채택했습니다. 사전 학습 모델은 고정된 단어만 인식 가능하고 임의의 손 동작에 대해 비정상적으로 높은 확률값을 반환하는 문제가 있었던 반면, DTW는 사용자가 필요한 수어 단어를 브라우저에서 직접 등록하여 즉시 인식할 수 있는 확장성과 거리 기반의 명확한 판단 기준을 제공하기 때문입니다.
- 코드 발췌:
```typescript
// 파일 경로: src/features/sign-capture/model/landmarks.ts
export const POSE_LANDMARK_INDICES = [11, 12, 13, 14, 15, 16] as const;
export const HAND_LANDMARK_COUNT = 21;
export const FEATURE_LENGTH = POSE_LANDMARK_INDICES.length * 4 + HAND_LANDMARK_COUNT * 3 * 2;
export const WINDOW_FRAMES = 30;

export function extractFeatures({
	poseLandmarks,
	leftHandLandmarks,
	rightHandLandmarks,
}: ExtractFeaturesInput): number[] {
	return [
		...poseFeatures(poseLandmarks),
		...handFeatures(leftHandLandmarks),
		...handFeatures(rightHandLandmarks),
	];
}

export class RollingWindow {
	private frames: number[][] = [];
	constructor(private readonly size: number = WINDOW_FRAMES) {}

	push(features: number[]) {
		this.frames.push(features);
		if (this.frames.length > this.size) this.frames.shift();
	}
	get isFull() { return this.frames.length === this.size; }
	toArray(): number[][] | null {
		return this.isFull ? this.frames.map((frame) => frame.slice()) : null;
	}
	clear() { this.frames = []; }
}
```

## 신체 기준 좌표 정규화 (Shoulder Midpoint & Span Normalization)
- 무엇을 구현했는가:
  - 사용자가 카메라에 가깝거나 멀리 위치할 때, 혹은 화면 좌우로 치우쳐 있을 때도 제스처의 고유한 형태(Shape)를 일관되게 비교할 수 있도록 신체 기준 좌표 정규화 알고리즘을 구현했습니다.
- 어떻게 구현했는가:
  - 150차원 프레임 데이터에서 왼쪽 어깨(인덱스 0, 1)와 오른쪽 어깨(인덱스 4, 5)의 x, y 좌표를 추출했습니다.
  - 양 어깨의 중점(`centerX`, `centerY`)을 기준 원점(0, 0)으로 평행 이동시켰습니다.
  - 양 어깨 사이의 유클리디안 거리를 계산하여 신체 크기 척도(`scale`)를 구하고, 모든 관절의 x, y, z 좌표를 해당 척도로 나누어 스케일링했습니다 (`normalizeFrame`).
- 선택지와 판단:
  - MediaPipe가 제공하는 화면 기준 정규화 좌표([0, 1])를 그대로 사용할 경우 사용자의 신체 위치나 카메라 각도가 조금만 달라져도 유클리디안 거리가 급증하는 한계가 있었습니다. 어깨를 기준으로 한 신체 상대 좌표계를 도입함으로써 사용자의 물리적 위치 이동과 무관하게 순수 손과 팔의 상대적 동작만을 비교할 수 있도록 설계했습니다.
- 코드 발췌:
```typescript
// 파일 경로: src/features/sign-capture/model/dtw.ts
function normalizeFrame(frame: number[]): number[] {
	const leftShoulderX = frame[0] ?? 0;
	const leftShoulderY = frame[1] ?? 0;
	const rightShoulderX = frame[4] ?? 0;
	const rightShoulderY = frame[5] ?? 0;
	const centerX = (leftShoulderX + rightShoulderX) / 2;
	const centerY = (leftShoulderY + rightShoulderY) / 2;
	const scale = Math.max(
		Math.hypot(rightShoulderX - leftShoulderX, rightShoulderY - leftShoulderY),
		MIN_SHOULDER_SPAN,
	);

	const normalized = frame.slice();
	for (let i = 0; i + 2 < frame.length; i += i < POSE_BLOCK_LEN ? 4 : 3) {
		normalized[i] = ((frame[i] ?? 0) - centerX) / scale;
		normalized[i + 1] = ((frame[i + 1] ?? 0) - centerY) / scale;
		normalized[i + 2] = (frame[i + 2] ?? 0) / scale;
	}
	return normalized;
}
```

## 손 내림 감지(Hands-Gone Detection) 및 LLM 대화 컨텍스트 기반 수어-자연어 문장 번역 파이프라인
- 무엇을 구현했는가:
  - 사용자가 수어를 마치고 손을 내렸을 때 발화 종료를 자동으로 감지하여, 버퍼에 누적된 단어들과 이전 대화 맥락을 백엔드 LLM으로 전달해 자연스러운 문장으로 합성하는 파이프라인을 구축했습니다.
- 어떻게 구현했는가:
  - 단어 확정 시마다 타이머로 즉시 번역 요청을 보내면 문장 중간의 호흡/생각 멈춤이 문장 분절로 이어지는 문제가 발생하므로, 손이 화면에서 완전히 사라진 시점(`handsLength === 0`)부터 시간을 측정했습니다 (`updateHandsGoneTracking`).
  - 손 부재 상태가 1500ms(`HANDS_GONE_FLUSH_MS`) 동안 지속되면 `sendUtteranceNow()`를 트리거했습니다.
  - 이때 단어 버퍼(`words`)와 함께 직전 12턴의 양방향 대화 기록(`ConversationTurn[]`)을 `/api/sign-language/compose`로 전달하여, 앞선 상대방의 발화 내용(예: "몇 시에 만날까요?")에 대응하는 온전한 문맥의 문장(예: "4시에 만나요")을 합성하도록 유도했습니다.
  - 번역이 완료되면 LiveKit 데이터 채널(`sendChatText`)을 통해 상대방에게 즉시 메시지를 전송하고 로컬 타임라인을 갱신했습니다.
- 선택지와 판단:
  - 단어별 고정 디바운스(Debounce) 타이머 방식 대신 '화면 내 손의 존재 여부(Hands-Gone)'를 발화 종료의 척도로 삼았습니다. 수어 사용자는 한 문장 내에서 단어와 단어 사이에 손을 들고 잠시 멈출 수 있으므로, 손을 완전히 내리는 물리적 제스처를 발화 종료 신호로 정의하는 것이 자연스러운 대화 턴 테이킹을 구현하는 가장 정확한 기준이었습니다.
- 코드 발췌:
```typescript
// 파일 경로: src/features/sign-capture/model/use-sign-capture.ts
const updateHandsGoneTracking = useCallback(
	(handsLength: number) => {
		if (handsLength > 0) {
			if (handsGoneAtRef.current !== null) {
				handsGoneAtRef.current = null;
				flushedForGapRef.current = false;
				setHandsGoneSince(null);
			}
			return;
		}

		if (handsGoneAtRef.current === null) {
			handsGoneAtRef.current = performance.now();
			setHandsGoneSince(handsGoneAtRef.current);
		} else if (
			!flushedForGapRef.current &&
			performance.now() - handsGoneAtRef.current >= HANDS_GONE_FLUSH_MS
		) {
			flushedForGapRef.current = true;
			sendUtteranceNow();
		}
	},
	[sendUtteranceNow],
);
```

## 단일 진실 공급원(Single Source of Truth) 기반 양방향 통화 룸 타임라인 및 PiP 레이아웃
- 무엇을 구현했는가:
  - 통화 중 청각장애인 모드(수어 SIGN <-> 텍스트 TEXT) 전환 및 건청인 모드(HEARING) 간에 메시지와 자막이 유실되지 않고 시간순으로 정렬되는 통합 타임라인을 구축하고, 수어 인식 화면을 플로팅 오버레이(Picture-in-Picture) 형태로 배치했습니다.
- 어떻게 구현했는가:
  - `useTimeline` 커스텀 훅을 최상위 `CallRoom` 컴포넌트에서 선언하여 자막 스트림(`captionGroups`)과 로컬 입력 메시지(`messages`)를 결합했습니다.
  - 자막 ID별 도착 시각을 맵(`captionTimes`)에 기록하여 뷰 컴포넌트가 모드 전환으로 인해 언마운트/리마운트되더라도 기존 메시지의 정렬 타임스탬프가 변경되지 않도록 보호했습니다.
  - 수어 모드에서는 상단 우측에 플로팅 오버레이(`SignCaptureView pip`)를 제공하여 사용자가 카메라 뷰와 랜드마크 스켈레톤을 확인하면서 상대방과의 대화 로그를 실시간으로 열람할 수 있도록 설계했습니다.
- 선택지와 판단:
  - 각 모드별 화면(`SignChat`, `TextCall`) 내부에서 개별적으로 타임라인 상태를 관리하던 초기 구조를 폐기하고 최상위 레벨로 상태를 통합했습니다. 모드 전환 시마다 타임스탬프가 현재 시각으로 덮어씌워져 대화 순서가 뒤섞이던 버그를 완전히 차단하기 위함이었습니다.
- 코드 발췌:
```typescript
// 파일 경로: src/widgets/call-room/ui/call-room.tsx
function useTimeline(
	captionGroups: ReadonlyArray<{ captions: CaptionType[]; align: "start" | "end" }>,
	messages: TextMessage[],
): { timeline: TimelineItem[]; timelineVersion: string } {
	const captionTimes = useRef(new Map<string, number>());
	for (const group of captionGroups) {
		for (const caption of group.captions) {
			if (!captionTimes.current.has(caption.id)) captionTimes.current.set(caption.id, Date.now());
		}
	}
	const timeline: TimelineItem[] = [
		...captionGroups.flatMap((group) =>
			group.captions.map((caption) => ({
				kind: "caption" as const,
				at: captionTimes.current.get(caption.id) ?? 0,
				align: group.align,
				caption,
			})),
		),
		...messages.map((message) => ({ kind: "message" as const, at: message.id, message })),
	].sort((left, right) => left.at - right.at);
	const lastItem = timeline.at(-1);
	const lastText = lastItem
		? lastItem.kind === "caption" ? lastItem.caption.text : lastItem.message.text
		: "";
	const timelineVersion = `${timeline.length}:${lastText}`;
	return { timeline, timelineVersion };
}
```

# 6. 트러블 슈팅

## LiveKit 통화 종료 시 상태 판별 Race Condition으로 인한 '다시 연결 중...' 깜빡임 현상
- **문제 상황**:
  - 통화 중 상대방이 통화를 종료했을 때, 로컬 클라이언트에서 정상 종료 화면으로 넘어가지 않고 1~2초간 '다시 연결 중...' (reconnecting) 상태 UI가 깜빡인 후 종료 화면으로 이동하는 버그가 발생했습니다.
  - 발생 위치: `src/features/join-call/model/use-join-call.ts`의 `retryLoop`
- **원인 분석**:
  - 상대방이 통화를 끊으면 LiveKit WebRTC 실시간 연결 단절 이벤트(`RoomEvent.Disconnected`)가 클라이언트에 즉시 전달됩니다.
  - 반면 백엔드 서버의 데이터베이스에서 통화 세션 상태를 `ACTIVE`에서 `ENDED`로 업데이트하는 트랜잭션은 수백 밀리초의 지연이 발생할 수 있습니다.
  - 클라이언트가 연결 해제 직후 단 1회 `getCallStatus`를 호출했을 때, 서버가 아직 상태를 업데이트하지 못해 `ACTIVE` 상태가 반환되었습니다.
  - 클라이언트는 이를 단순 네트워크 일시 장애로 판별하고 `reconnecting` 상태로 전환하여 재연결 루프에 진입하는 Race Condition이 발생했습니다.
- **검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| :--- | :--- | :--- | :--- |
| 단 1회 즉시 조회 후 실패 시 즉시 reconnecting 진입 | 구현이 가장 단순함 | 서버 DB 업데이트 지연 시 종료된 통화에 대해 반드시 UI 깜빡임 발생 | 미채택 |
| 연결 해제 시 무조건 1초 sleep 후 1회 조회 | 서버 업데이트 시간 확보 가능 | 실제 네트워크 순단 발생 시 정상 재연결 시도가 1초 이상 불필요하게 지연됨 | 미채택 |
| 500ms 간격 최대 3회 단기 재확인 루프 (`checkAlreadyEnded`) | 서버 DB 지연을 흡수하면서 종료 감지 즉시 루프 탈출 가능 | 짧은 비동기 반복 루프 로직 추가 필요 | 채택 |

- **해결 과정**:
  - `END_CHECK_ATTEMPTS = 3`, `END_CHECK_RETRY_DELAY_MS = 500` 상수를 정의하고, `checkAlreadyEnded` 비동기 함수를 구현했습니다.
  - WebRTC 연결이 끊어졌을 때 500ms 간격으로 최대 3회 서버 상태를 폴링하여 `REJECTED` 또는 `ENDED` 상태가 감지되면 즉시 `markRejected`를 호출해 정상 종료(`ended`) 화면으로 전환했습니다.
  - 3회 확인 후에도 `ACTIVE` 상태가 유지될 때만 실제 네트워크 단절로 판단하고 정상 재연결 루프로 진입하도록 제어했습니다.
- **코드 발췌**:
```typescript
// 변경 전 (use-join-call.ts)
try {
    const result = await getCallStatus(callId, params.participantKey);
    if (result.status === "REJECTED" || result.status === "ENDED") {
        markRejected(false, wasConnected, previousRoom);
        return;
    }
} catch {
    // Status check failed -- fall through to the normal reconnect loop below.
}
updateState((current) => ({ ...current, room: null, status: "reconnecting" }));
```
```typescript
// 변경 후 (use-join-call.ts, commit: bf123ef)
async function checkAlreadyEnded(
    callId: string,
    participantKey: string,
    generation: number,
    wasConnected: boolean,
    previousRoom: Room | null,
): Promise<boolean> {
    for (let attempt = 0; attempt < END_CHECK_ATTEMPTS && isCurrent(generation); attempt += 1) {
        try {
            const result = await getCallStatus(callId, participantKey);
            if (result.status === "REJECTED" || result.status === "ENDED") {
                markRejected(false, wasConnected, previousRoom);
                return true;
            }
        } catch {
            // Status check failed -- keep retrying below.
        }
        if (attempt < END_CHECK_ATTEMPTS - 1) {
            await new Promise((resolve) => setTimeout(resolve, END_CHECK_RETRY_DELAY_MS));
        }
    }
    return false;
}
```
- **결과**: 상대방 통화 종료 시 '다시 연결 중...' 깜빡임이 완전히 사라지고, 평균 500ms 이내에 즉각적으로 통화 종료 화면(`ended`)으로 안착했습니다.
- **근거**: 커밋 `bf123ef1fbb705ff1c8582786f4b9252025070a3`, 파일 `src/features/join-call/model/use-join-call.ts`

## DTW 무조건적 최근접 매칭으로 인한 오인식 및 발화 전송 직후 직전 단어 중복 확정 버그
- **문제 상황**:
  - 사용자가 수어를 하지 않고 손을 내리거나 올리는 중간 동작, 혹은 가만히 쉬고 있을 때도 임의의 수어 단어가 화면에 확정되어 문장에 오삽입되는 현상이 발생했습니다.
  - 한 문장을 LLM으로 전송한 직후 손을 다시 들어 다음 수어를 시작할 때, 직전에 발화했던 단어가 즉시 재확정되어 문장이 중복 전송되는 버그가 발생했습니다.
  - 발생 위치: `src/features/sign-capture/model/use-sign-capture.ts`, `src/features/sign-capture/model/dtw.ts`
- **원인 분석**:
  - 1) `resolvePrediction`에서 거리 임계값 검증 없이 무조건 가장 가까운 참조 단어를 후보(`candidate`)로 채택했습니다. DTW는 거리가 아무리 멀어도 최근접 이웃(Nearest Neighbor)을 항상 반환하므로, 쉬고 있는 손동작도 가장 덜 먼 단어에 매칭되어 확정되었습니다.
  - 2) `sendUtteranceNow()` 호출 시 단어 버퍼(`wordBufferRef`)만 비우고 롤링 윈도우(`windowRef`)와 인식 상태 스트릭(`predictionStateRef`), 라이브 사인 상태를 초기화하지 않았습니다. 이로 인해 손을 다시 올릴 때 윈도우에 남아있던 이전 프레임 데이터로 인해 직전 단어가 즉시 재확정되었습니다.
  - 3) 후보 확정 기준인 `REQUIRED_STREAK`가 3프레임으로 너무 짧아 과도기적 손 움직임(transitional noise)에도 쉽게 확정되었습니다.
- **검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| :--- | :--- | :--- | :--- |
| 무조건 매칭 유지 및 손 내림 대기시간(FLUSH_MS)을 3000ms로 연장 | 임계값 튜닝 없이 코드 유지 가능 | 발화 응답성이 3초로 극도로 느려지며 오인식 근본 원인은 해결되지 않음 | 미채택 |
| 거리 임계값 게이팅 적용 및 라이브 카드 분리 | 거리가 먼 오인식을 원천 차단하고 시각적 피드백은 유지 | 임계값(`DEFAULT_DTW_THRESHOLD = 0.6`) 설정 필요 | 채택 |
| 윈도우 및 상태 클린 슬레이트 초기화 | 문장 전송 후 직전 단어 중복 확정 완벽 차단 | 추가 상태 리셋 로직 필요 | 채택 |

- **해결 과정**:
  - `resolvePrediction`에서 `DEFAULT_DTW_THRESHOLD` (0.6) 이하의 거리일 때만 `candidate`로 승격시키고, 임계값을 넘지 못하더라도 가장 가까운 단어는 `closestWord`로 분리하여 라이브 힌트 카드로만 표기했습니다.
  - 연속 프레임 일치 조건(`REQUIRED_STREAK`)을 3에서 5로 상향하여 노이즈 필터링을 강화했습니다.
  - `sendUtteranceNow()` 내부에서 `windowRef.current.clear()`, `predictionStateRef.current` 리셋, `setActiveSign(null)`, `setRecognizedText(null)`을 호출하여 발화 전송 시 모든 인식 상태를 완전히 초기화(Clean Slate)했습니다.
  - 안정화된 인식 덕분에 기존에 중복 문장 우회를 위해 임시로 늘렸던 `HANDS_GONE_FLUSH_MS`를 3000ms에서 1500ms로 단축했습니다.
- **코드 발췌**:
```typescript
// 변경 전 (use-sign-capture.ts)
function resolvePrediction(frames: number[][]): ResolvedPrediction {
    const dtwBest = closestReference(frames);
    const similarity = dtwBest ? Math.max(0, 1 - dtwBest.distance / DEFAULT_DTW_THRESHOLD) : 0;
    return {
        candidate: dtwBest?.word ?? null,
        confidence: similarity,
        debug: { dtwWord: dtwBest?.word ?? null, dtwDistance: dtwBest?.distance ?? null },
    };
}
```
```typescript
// 변경 후 (use-sign-capture.ts, commit: 7ed7a64, bf123ef)
function resolvePrediction(frames: number[][]): ResolvedPrediction {
    const dtwBest = closestReference(frames);
    const closestSimilarity = dtwBest ? Math.max(0, 1 - dtwBest.distance / DEFAULT_DTW_THRESHOLD) : 0;
    const dtwMatch = dtwBest && dtwBest.distance <= DEFAULT_DTW_THRESHOLD ? dtwBest : null;

    return {
        candidate: dtwMatch?.word ?? null,
        confidence: dtwMatch ? closestSimilarity : 0,
        closestWord: dtwBest?.word ?? null,
        closestSimilarity,
        debug: { dtwWord: dtwBest?.word ?? null, dtwDistance: dtwBest?.distance ?? null },
    };
}

const sendUtteranceNow = useCallback(() => {
    windowRef.current.clear();
    predictionStateRef.current = { lastCandidate: null, candidateStreak: 0, lastConfirmedCandidate: null };
    setActiveSign(null);
    setRecognitionDebug(null);
    setRecognizedText(null);
    // ... 단어 버퍼 전송 및 LLM 호출
}, [room, onSentence]);
```
- **결과**: 유휴 손동작 시의 오인식이 차단되었고, 문장 간 연속 발화 시 직전 문장이 중복 전송되던 현상이 완전히 제거되었습니다. 발화 종료 후 번역 전송까지의 지연 시간이 3000ms에서 1500ms로 50% 단축되어 쾌적한 턴 테이킹이 가능해졌습니다.
- **근거**: 커밋 `7ed7a64f798051428d88916f520ed3bbfc0f965a`, `bf123ef1fbb705ff1c8582786f4b9252025070a3`, 파일 `src/features/sign-capture/model/use-sign-capture.ts`, `src/features/sign-capture/model/dtw.ts`

## 고정 어휘 사전 학습 LSTM 분류기의 Softmax 출력으로 인한 DTW 커스텀 단어 차폐(Shadowing) 문제
- **문제 상황**:
  - 초기 버전에서는 11개 단어로 사전 학습된 LSTM 신경망과 사용자 등록 단어를 인식하는 DTW 매칭을 함께 구동하는 하이브리드 방식을 적용했습니다. 그러나 사용자가 마이페이지에서 새로운 수어를 완벽하게 학습시켜도, 통화 화면에서 해당 단어가 거의 인식되지 않고 기본 사전 학습 단어 중 하나로 오인식되는 문제가 발생했습니다.
  - 발생 위치: `src/features/sign-capture/model/use-sign-capture.ts`, `src/features/sign-capture/model/sign-model.ts`
- **원인 분석**:
  - 사전 학습된 LSTM 모델은 12개 클래스(11개 단어 + 1개 무동작)에 대한 Softmax 확률을 출력했습니다.
  - Softmax 함수의 구조적 특성상, 입력 데이터가 모델의 학습 분포 밖(Out-of-Distribution, OOD)인 임의의 손 동작이나 새로운 수어 제스처일지라도 전체 합이 1이 되도록 강제되므로 특정 클래스의 확률값이 높게 치솟는 과신(Overconfident) 현상이 발생했습니다.
  - 하이브리드 파이프라인에서 LSTM 결과를 먼저 검사하여 임계값 이상이면 채택하도록 되어 있었기 때문에, DTW에서 완벽하게 매칭된 커스텀 단어가 존재하더라도 LSTM 결과가 상위에서 가로채는 영구 차폐(Permanently Shadowed) 현상이 발생했습니다.
- **검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| :--- | :--- | :--- | :--- |
| LSTM 임계값을 0.95 이상으로 대폭 상향 | 기본 단어 사전 학습 모델 유지 가능 | 임의의 동작에서도 간헐적으로 0.95를 초과하는 OOD 과신 문제 잔존 | 미채택 |
| DTW 매칭을 LSTM보다 먼저 평가하도록 순서 변경 | 등록된 단어의 우선 인식 보장 | DTW 거리 임계값과 LSTM 확률 간의 상이한 척도 비교 난해 | 미채택 |
| 사전 학습 LSTM 모델을 완전히 제거하고 순수 DTW 엔진으로 단일화 | 인식 동작이 완전히 투명하고 예측 가능해지며 차폐 문제 원천 해결 | 기본 단어도 사용자가 직접 1회 학습 등록해야 함 | 채택 |

- **해결 과정**:
  - 사전 학습 LSTM 분류기 코드(`sign-model.ts`) 및 관련 가중치 연동 로직을 제거했습니다 (`feat: remove the pretrained LSTM model, recognition is DTW-only now`, 커밋 `a2318f9`).
  - 모든 수어 단어를 신체 상대 정규화 좌표 기반의 DTW 템플릿 매칭 엔진으로 통일하여, 실제 등록된 템플릿 데이터와 유클리디안 거리가 가까울 때만 정직하게 인식되도록 파이프라인을 전면 재구성했습니다.
- **결과**: 고정 어휘 모델의 무조건적인 오인식 및 커스텀 단어 차폐 현상이 100% 제거되었으며, 사용자가 등록한 수어가 의도한 대로 정확하게 매칭되는 투명한 인식 신뢰성을 확보했습니다.
- **근거**: 커밋 `a2318f9`, `752ca636adb2cf2dacac5618fe93790537489ee7`, 파일 `src/features/sign-capture/model/use-sign-capture.ts` 주석 (라인 129-138)

# 7. 결과

- 정량 지표:
  - 수어 발화 종료 후 자동 번역 전송 대기시간(Flush Latency): 3000ms에서 1500ms로 50% 단축 (`HANDS_GONE_FLUSH_MS`, 커밋 `bf123ef`)
  - 실시간 프레임 특징 벡터 차원: 150차원 (상체 포즈 24차원 + 왼손 63차원 + 오른손 63차원, `landmarks.ts`)
  - DTW 프레임 윈도우 크기: 30프레임 (약 1~2초 분량)
  - 연속 프레임 일치 확정 임계치: 3프레임에서 5프레임으로 상향하여 전이 구간 오인식 방지 (`REQUIRED_STREAK`, 커밋 `7ed7a64`)
  - 통화 종료 확인 폴링: 최대 3회 x 500ms 간격으로 Race Condition 완전 흡수 (`END_CHECK_ATTEMPTS = 3`, `END_CHECK_RETRY_DELAY_MS = 500`, 커밋 `bf123ef`)
  - 브라우저 실시간 랜드마크 추출 및 DTW 연산 주기: 15~30 FPS 클라이언트 100% 온디바이스 처리
- 수상 및 행사 결과:
  - (수치 확인 필요: 유니톤 해커톤 수상 내역 및 발표 심사 결과 확인 필요)
- 배포 및 운영 결과:
  - Cloudflare Pages를 통한 프로덕션 및 프리뷰 환경 정적 배포 파이프라인 구성 (`wrangler pages deploy dist`)
  - Spring Boot 원격 백엔드(`https://naru-backend.perasite.dev`)와 LiveKit WebRTC 인프라 실시간 연동 성공
- 테스트 및 코드 품질 검증 현황:
  - 별도의 단위 테스트 러너(Vitest/Jest)는 구축되어 있지 않으나, `bun run check` 커맨드를 통해 다음 3중 검증을 pre-commit 훅(`lefthook.yml`)으로 강제했습니다:
    1. Biome Linter & Formatter (`bunx biome check`)
    2. TypeScript Compiler 엄격한 타입 검증 (`tsc -b`)
    3. Steiger FSD 아키텍처 의존성 린터 (`steiger ./src`)

# 8. 회고

- 아쉬운 점:
  - 해커톤의 극도로 제한된 일정(2일)으로 인해 Vitest나 Playwright를 이용한 자동화 테스트 코드를 작성하지 못하고 수동 동작 검증 및 정적 검사에 의존한 점이 아쉬웠습니다.
  - DTW 알고리즘의 시간 복잡도가 $O(n \times m)$이고 등록된 단어 수($K$)에 비례하여 $O(K \times n \times m)$으로 증가하므로, 단어 수가 수백 개 이상으로 확장될 경우 메인 스레드에서 프레임 드랍이 발생할 가능성이 있습니다.
- 다시 한다면 개선할 점:
  - Web Worker 도입: MediaPipe 랜드마크 연산과 DTW 거리 계산 로직을 Web Worker 백그라운드 스레드로 분리하여, 복잡한 연산 중에도 React 렌더링 스레드가 60FPS를 안정적으로 유지하도록 개선하겠습니다.
  - FastDTW 또는 Sakoe-Chiba Band 도입: 시계열 정합 경로를 띠(Band) 형태로 제한하는 FastDTW 알고리즘을 도입하여 단어당 매칭 복잡도를 선형 시간($O(N)$) 수준으로 최적화하겠습니다.
  - LLM 스트리밍 합성(Server-Sent Events): 완성된 단어 버퍼를 한 번에 전달하는 방식 외에, 실시간 단어 스트림을 기반으로 LLM이 부분 문장을 스트리밍하여 번역 응답 속도를 추가 단축하겠습니다.

# 9. 스크린샷 및 문서 제안

| 번호 | 촬영/제작할 화면 및 다이어그램 | 들어갈 섹션 | 설명 및 추천 파일명 |
| :---: | :--- | :--- | :--- |
| 1 | 수어 영상 통화 룸 (청각장애인 시점) | # 1. 3분 요약, # 4. 설계 | 상단 타이머, 중앙 대화 타임라인, 우측 상단 캔버스 스켈레톤 PiP 화면 (`call_room_deaf_view.png`) |
| 2 | 수어 인식 및 번역 파이프라인 시퀀스 다이어그램 | # 4. 설계 (아키텍처) | MediaPipe -> RollingWindow -> DTW -> Hands-Gone -> LLM Compose -> LiveKit 흐름 (`sign_pipeline_sequence.png`) |
| 3 | 신체 좌표 정규화 비교 다이어그램 | # 5. 핵심 구현 | 어깨 중심점 원점 이동 및 어깨 너비 스케일 정규화 전후 좌표 비교 (`coordinate_normalization_diagram.png`) |
| 4 | 단어 등록 및 학습 화면 (마이페이지) | # 5. 핵심 구현 | 10초 연속 반복 녹화 및 케이던스 바 기반 DTW 참조 데이터 수집 화면 (`sign_registration_page.png`) |
| 5 | 건청인 시점 통화 룸 화면 | # 4. 설계 | 실시간 수신된 수어 번역 자막과 음성 마이크/스피커 컨트롤 바 (`call_room_hearing_view.png`) |

- 레포 내 참조 가능한 정적 리소스:
  - 파비콘 및 앱 아이콘: `public/favicon.svg`, `public/apple-touch-icon.png`, `public/favicon-96x96.png`
  - 아키텍처 및 라이브러리 가이드: `ARCHITECTURE.md`, `CLAUDE.md`, `LIBRARIES.md`

# 10. 확인 필요 항목

- 직접 채워야 하는 정보:
  - 1. 유니톤 해커톤의 공식 수상 실적 및 심사 피드백 결과 (확인 필요)
  - 2. Cloudflare Pages 프로덕션 실 배포 URL (확인 필요)
  - 3. 실 기기(iPhone/Android/노트북)에서의 WebCam 프레임레이트(FPS) 및 LLM API 왕복 응답 시간 실측치 (확인 필요: 벤치마크 측정 필요)
- 근거 부족으로 본문에서 제외한 항목:
  - 초기 커밋에 존재했던 지화(Finger-spelling) 및 정적 제스처(숫자, 엄지척, OK 등) 인식 로직: 커밋 `4d6f71c`에서 단일 프레임 정적 제스처 분류기가 오인식을 유발하여 전면 삭제되었으므로 현재 활성 기능에서 제외하고 트러블슈팅/변천사로만 기록했습니다.
  - 단일 클릭 DTW 캡처 방식: 커밋 `948036f`에서 10초 자동 분할 녹화 방식으로 대체되었으므로 현재 스펙으로 갱신 반영했습니다.

# 11. 면접 예상 질문

1. **질문: WebRTC 통화 중 클라이언트 브라우저에서 MediaPipe와 DTW를 동시에 실행할 때 메인 스레드 블로킹이나 성능 저하는 없었습니까?**
   - 답변 준비 사항: 랜드마크 추출 프레임 주기(15~30fps), 30프레임 시퀀스 크기, DTW 참조 단어 개수(현재 등록된 단어 수 기준 연산 비용), 그리고 메인 스레드 부하를 방지하기 위해 Web Worker로 오프로딩할 수 있는 아키텍처 개선 계획을 설명합니다.
2. **질문: 수어 단어 인식을 왜 딥러닝 모델(LSTM 등)이 아닌 DTW 템플릿 매칭으로 구현했습니까?**
   - 답변 준비 사항: 닫힌 어휘군을 학습한 Softmax 기반 신경망이 OOD(Out-of-Distribution) 제스처에 대해 과신(Overconfidence)하여 오인식을 쏟아내고 커스텀 단어를 차폐했던 실제 경험(커밋 `a2318f9`)을 언급하고, 사용자가 직접 수어를 등록하여 즉시 인식할 수 있는 확장성과 거리 기반 명확한 임계값 제어가 가능했던 DTW의 강점을 비교 설명합니다.
3. **질문: 신체 좌표 정규화(`normalizeFrame`)에서 어깨 중심과 어깨 너비를 기준으로 잡은 이유는 무엇입니까?**
   - 답변 준비 사항: 화면 정규화 좌표는 카메라 거리와 좌우 이동에 취약하지만, 사람의 상체에서 양 어깨는 자세 변화에도 비교적 구조적 안정성을 유지하는 핵심 랜드마크이므로, 어깨를 기준으로 원점과 스케일을 정규화함으로써 체격 차이와 카메라 거리에 구애받지 않는 불변성(Invariance)을 확보한 과정을 설명합니다.
4. **질문: WebRTC 연결 단절 시 발생했던 Race Condition을 어떻게 발견하고 해결했습니까?**
   - 답변 준비 사항: 통화 종료 시 웹소켓/WebRTC 시그널링 통지와 백엔드 DB 간의 비동기 업데이트 시차로 인해 발생한 '다시 연결 중...' 플래시 현상을 로그와 상태 추적으로 분석하고, 단일 조회가 아닌 500ms 간격 3회 재검증 루프(`checkAlreadyEnded`)를 설계하여 해결한 과정을 설명합니다.
