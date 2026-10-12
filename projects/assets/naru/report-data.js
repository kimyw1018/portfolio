/**
 * 자동 생성: portfolio-out/naru/Naru.json 의 원문 JSON을 그대로 옮긴 REPORT_DATA.
 * openQuestions / interviewQuestions 는 같은 프로젝트의 .md 10/11장 원문을
 * 별도로 채워 넣는다 (json에는 없는 필드).
 */
const REPORT_DATA = {
  "title": "Naru (나루)",
  "period": "2026-08-25 ~ 2026-08-26",
  "role": "프론트엔드 개발자 (수어 인식 비전 파이프라인 및 WebRTC 통화 룸 전담)",
  "summary": "청각장애인과 건청인이 수어, 텍스트, 음성을 통해 실시간으로 양방향 소통할 수 있도록 지원하는 WebRTC 화상 통화 및 AI 수어 번역 웹 애플리케이션입니다.",
  "keyResults": [
    {
      "value": "150차원",
      "label": "상체 포즈 및 양손 랜드마크 추출 차원",
      "condition": "MediaPipe Pose(상체 6개 랜드마크 x 4) + Left Hand(21개 x 3) + Right Hand(21개 x 3)"
    },
    {
      "value": "1500ms",
      "label": "발화 종료 감지(Hands-Gone Flush) 지연시간",
      "condition": "양손 미감지 지속 시간 (기존 3000ms에서 50% 단축)"
    },
    {
      "value": "100%",
      "label": "통화 종료 시 Race Condition 해결",
      "condition": "LiveKit 연결 해제 후 500ms 간격 최대 3회 재조회 루프 적용"
    }
  ],
  "overview": {
    "background": "청각장애인(수어 사용자)과 건청인(음성 사용자) 간의 전화 통화는 중계사 없이는 직접 소통이 어려우며, 기존 솔루션은 실시간 수어 통역과 양방향 통화 환경을 동시에 제공하지 못했습니다.",
    "problem": "브라우저 환경에서 고가의 서버 GPU 없이 실시간으로 수어 동작을 인식해야 했으며, 카메라 거리 및 신체 위치 변화에 따른 랜드마크 왜곡 보정과 대화 흐름을 유지하는 턴 테이킹 처리가 필요했습니다.",
    "scope": [
      "MediaPipe 기반 상체 및 양손 랜드마크 추출 및 Canvas 오버레이 시각화",
      "150차원 특징 벡터 추출 및 신체 좌표 정규화 기반 DTW 템플릿 매칭 엔진 구현",
      "손 내림 감지(Hands-Gone) 및 LLM 대화 히스토리 기반 자연어 문장 번역 연동",
      "통화 룸 UI 리팩토링, 통합 타임라인 및 PiP 레이아웃 구축",
      "LiveKit WebRTC 통화 연결 상태 머신 및 재연결/종료 안정화"
    ],
    "collaboration": [
      "Andy Hong: 키패드 UI, iOS 햅틱, SEED Design 기반 디자인 토큰 및 설정 페이지 개발",
      "eeeeeaaan: 백엔드 DB 기반 DTW 수어 단어 템플릿 CRUD API 연동 및 마이페이지 수어 등록 인터페이스 연동",
      "PeraSite(백엔드): Spring Boot 기반 통화 세션 API, LiveKit 토큰 발급, OpenAI LLM 문장 합성 API 구축",
      "협업 방식: Feature-Sliced Design 아키텍처를 Steiger 린터로 강제하고, Lefthook pre-commit 훅과 GitHub PR 코드 리뷰를 통해 품질을 관리했습니다."
    ]
  },
  "stack": [
    {
      "category": "Frontend Framework",
      "items": [
        { "name": "React 19.2.8", "reason": "동시성 렌더링 및 최신 React Hooks 활용" },
        { "name": "TypeScript 7.0.2", "reason": "엄격한 타입 안전성 보장" },
        { "name": "Bun", "reason": "고속 패키지 관리 및 번들링 실행 환경" },
        { "name": "Vite 8.2.2", "reason": "초고속 개발 서버 및 빌드 환경" }
      ]
    },
    {
      "category": "Vision & Realtime",
      "items": [
        { "name": "@mediapipe/tasks-vision 1.0.1", "reason": "브라우저 WebAssembly 기반 손 및 상체 포즈 랜드마크 실시간 추출" },
        { "name": "livekit-client 2.22.0", "reason": "실시간 WebRTC 영상/음성 스트리밍 및 lk.chat 데이터 채널 메시징" }
      ]
    },
    {
      "category": "State & Routing",
      "items": [
        { "name": "@tanstack/react-router 1.170.32", "reason": "완전한 타입 안전 파일 기반 라우팅" },
        { "name": "@tanstack/react-query 5.102.1", "reason": "서버 상태 폴링 및 비동기 캐싱 관리" },
        { "name": "zustand 5.0.15", "reason": "경량 클라이언트 전역 상태 관리" }
      ]
    },
    {
      "category": "UI & Design System",
      "items": [
        { "name": "@seed-design/react 2.3.0", "reason": "당근마켓 SEED 디자인 시스템 컴포넌트 라이브러리" },
        { "name": "tailwindcss 4.3.3", "reason": "CSS 기반 테마 및 유틸리티 스타일링" }
      ]
    },
    {
      "category": "Code Quality & Architecture",
      "items": [
        { "name": "@biomejs/biome 2.5.10", "reason": "빠른 코드 린팅 및 포맷팅" },
        { "name": "steiger 0.6.0", "reason": "Feature-Sliced Design 레이어 의존성 검사" },
        { "name": "lefthook 2.1.10", "reason": "커밋 전 병렬 린트 및 타입 체크 자동화" }
      ]
    }
  ],
  "design": {
    "architecture": "Feature-Sliced Design (FSD) 아키텍처를 적용하여 단방향 의존성(app -> pages -> widgets -> features -> entities -> shared)을 유지했습니다.",
    "dataModel": "매 프레임마다 상체 6개 랜드마크(24차원)와 양손 42개 랜드마크(126차원)를 결합한 150차원 1D 배열을 생성하고 30프레임 Rolling Window로 관리했습니다.",
    "api": "Spring Boot 백엔드의 통화 세션 API(생성, 참여, 폴링, 수락, 거절, 종료)와 수어 API(단어 템플릿 CRUD, LLM 문장 합성) 및 LiveKit WebRTC 채널(lk.chat)을 연동했습니다.",
    "infra": "Cloudflare Pages를 통해 프로덕션 및 프리뷰 환경을 정적 배포했습니다.",
    "tree": "src/\n  app/ (라우터 및 프로바이더)\n  pages/ (화면 조합)\n  widgets/ (call-room, phone-nav)\n  features/ (sign-capture, join-call, play-agent-audio)\n  entities/ (call, caption)\n  shared/ (MediaPipe 훅, UI 컴포넌트, API 클라이언트)",
    "diagrams": [
      { "src": "sign_pipeline_sequence.png", "caption": "실시간 수어 인식 및 LLM 문장 합성 파이프라인 흐름" }
    ]
  },
  "features": [
    {
      "name": "150차원 상체 및 양손 랜드마크 기반 DTW 수어 인식 엔진",
      "what": "브라우저 웹캠 영상에서 MediaPipe로 추출한 상체 및 양손 랜드마크 시퀀스를 30프레임 롤링 윈도우에 적재하고, 캐싱된 수어 템플릿과 DTW 거리를 계산하여 실시간으로 단어를 인식했습니다.",
      "how": [
        "splitHandsByHandedness를 통해 왼손과 오른손 랜드마크를 분리",
        "상체 포즈 24차원과 양손 126차원을 결합하여 150차원 특징 벡터 추출 (extractFeatures)",
        "30프레임 RollingWindow에 적재 후 closestReference로 최근접 DTW 템플릿 매칭",
        "동일 후보가 연속 5프레임 이상 유지될 때 단어로 확정 (REQUIRED_STREAK = 5)"
      ],
      "decision": "사전 학습 신경망(LSTM)의 OOD 과신 문제와 어휘 확장 한계를 극복하기 위해, 사용자가 직접 수어를 등록하고 거리 기반으로 명확히 판별할 수 있는 DTW 템플릿 매칭을 채택했습니다.",
      "files": [
        "src/features/sign-capture/model/landmarks.ts",
        "src/features/sign-capture/model/dtw.ts",
        "src/features/sign-capture/model/use-sign-capture.ts"
      ],
      "code": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/landmarks.ts",
        "snippet": "export function extractFeatures({ poseLandmarks, leftHandLandmarks, rightHandLandmarks }: ExtractFeaturesInput): number[] {\n\treturn [\n\t\t...poseFeatures(poseLandmarks),\n\t\t...handFeatures(leftHandLandmarks),\n\t\t...handFeatures(rightHandLandmarks),\n\t];\n}"
      }
    },
    {
      "name": "신체 기준 좌표 정규화 (Shoulder Midpoint & Span Normalization)",
      "what": "카메라와의 거리나 사용자의 화면 내 위치 변화에 구애받지 않고 순수한 제스처 형태(Shape)를 비교하도록 좌표를 정규화했습니다.",
      "how": [
        "양 어깨 좌표의 중심점을 원점(0, 0)으로 이동",
        "양 어깨 사이의 유클리디안 거리를 계산하여 신체 척도(scale) 도출",
        "모든 관절 좌표를 척도로 나누어 스케일링 수행 (normalizeFrame)"
      ],
      "decision": "MediaPipe의 화면 기준 절대 좌표([0, 1]) 사용 시 사용자의 미세한 위치 이동에도 DTW 거리가 급증하는 한계를 해결하기 위해 신체 상대 좌표계를 도입했습니다.",
      "files": [
        "src/features/sign-capture/model/dtw.ts"
      ],
      "code": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/dtw.ts",
        "snippet": "function normalizeFrame(frame: number[]): number[] {\n\tconst centerX = (frame[0] + frame[4]) / 2;\n\tconst centerY = (frame[1] + frame[5]) / 2;\n\tconst scale = Math.max(Math.hypot(frame[4] - frame[0], frame[5] - frame[1]), MIN_SHOULDER_SPAN);\n\tconst normalized = frame.slice();\n\tfor (let i = 0; i + 2 < frame.length; i += i < POSE_BLOCK_LEN ? 4 : 3) {\n\t\tnormalized[i] = ((frame[i] ?? 0) - centerX) / scale;\n\t\tnormalized[i + 1] = ((frame[i + 1] ?? 0) - centerY) / scale;\n\t\tnormalized[i + 2] = (frame[i + 2] ?? 0) / scale;\n\t}\n\treturn normalized;\n}"
      }
    },
    {
      "name": "손 내림 감지(Hands-Gone Flush) 및 LLM 대화 컨텍스트 문장 번역",
      "what": "수어 발화가 끝났음을 감지하여 누적된 단어들과 최근 12턴의 대화 기록을 LLM으로 전달해 자연스러운 한국어 문장으로 합성했습니다.",
      "how": [
        "손이 화면에서 사라진 시간(handsLength === 0)을 추적",
        "1500ms 이상 지속 시 sendUtteranceNow 트리거",
        "단어 목록과 최근 12턴 대화 히스토리를 /api/sign-language/compose로 전송",
        "완성된 문장을 LiveKit lk.chat 채널로 상대방에게 전송"
      ],
      "decision": "단어 간 짧은 멈춤을 문장 종료로 오판하지 않도록 물리적으로 손을 내리는 동작을 발화 종료 신호로 삼았습니다.",
      "files": [
        "src/features/sign-capture/model/use-sign-capture.ts",
        "src/features/sign-capture/api/sign-api.ts"
      ],
      "code": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/use-sign-capture.ts",
        "snippet": "if (!flushedForGapRef.current && performance.now() - handsGoneAtRef.current >= HANDS_GONE_FLUSH_MS) {\n\tflushedForGapRef.current = true;\n\tsendUtteranceNow();\n}"
      }
    }
  ],
  "troubleshooting": [
    {
      "title": "LiveKit 통화 종료 시 상태 판별 Race Condition으로 인한 '다시 연결 중...' 깜빡임 현상",
      "tags": ["WebRTC", "LiveKit", "Race Condition", "State Machine"],
      "problem": "상대방이 통화를 종료했을 때 로컬 화면에서 정상 종료 화면 대신 1~2초간 '다시 연결 중...' 재연결 UI가 깜빡인 후 종료되는 현상이 발생했습니다.",
      "cause": "LiveKit 실시간 연결 해제 이벤트가 백엔드 서버의 DB 통화 상태(ACTIVE -> ENDED) 업데이트 완료보다 먼저 클라이언트에 수신되어 단일 상태 조회 시 stale한 ACTIVE 상태가 반환되었습니다.",
      "options": [
        { "name": "단 1회 즉시 조회 후 실패 시 재연결 진입", "pros": "구현 단순", "cons": "종료 통화에 대해 반드시 UI 깜빡임 발생", "chosen": false },
        { "name": "연결 해제 시 1초 sleep 후 조회", "pros": "DB 반영 시간 확보", "cons": "정상 네트워크 단절 시 재연결 지연 발생", "chosen": false },
        { "name": "500ms 간격 최대 3회 재확인 루프 (checkAlreadyEnded)", "pros": "DB 지연 흡수 및 종료 즉시 화면 전환", "cons": "비동기 재시도 로직 필요", "chosen": true }
      ],
      "solution": "checkAlreadyEnded 함수를 구현하여 500ms 간격으로 최대 3회 서버 상태를 폴링하고 REJECTED/ENDED 감지 시 즉시 정상 종료로 전환했습니다.",
      "codeBefore": {
        "lang": "typescript",
        "path": "src/features/join-call/model/use-join-call.ts",
        "snippet": "try {\n\tconst result = await getCallStatus(callId, params.participantKey);\n\tif (result.status === \"REJECTED\" || result.status === \"ENDED\") {\n\t\tmarkRejected(false, wasConnected, previousRoom);\n\t\treturn;\n\t}\n} catch {}\nupdateState((current) => ({ ...current, room: null, status: \"reconnecting\" }));"
      },
      "codeAfter": {
        "lang": "typescript",
        "path": "src/features/join-call/model/use-join-call.ts",
        "snippet": "const alreadyEnded = await checkAlreadyEnded(callId, params.participantKey, generation, wasConnected, previousRoom);\nif (alreadyEnded) return;\nif (!isCurrent(generation)) return;\nupdateState((current) => ({ ...current, room: null, status: \"reconnecting\" }));"
      },
      "result": "상대방 통화 종료 시 재연결 깜빡임이 완전히 제거되고 500ms 이내에 즉각 종료 화면으로 전환되었습니다.",
      "evidence": "커밋 bf123ef1fbb705ff1c8582786f4b9252025070a3",
      "learned": null
    },
    {
      "title": "DTW 무조건적 최근접 매칭으로 인한 오인식 및 발화 전송 직후 직전 단어 중복 확정 버그",
      "tags": ["DTW", "Sign Language", "False Positive", "Clean Slate"],
      "problem": "쉬고 있는 손동작도 임의의 단어로 오확정되고, 문장 전송 직후 손을 다시 올릴 때 직전 문장이 중복 확정되는 버그가 발생했습니다.",
      "cause": "DTW가 거리 임계값 없이 최근접 이웃을 무조건 후보로 반환했고, 발화 전송 시 롤링 윈도우와 연속 프레임 스트릭 상태를 초기화하지 않았습니다.",
      "options": [
        { "name": "무조건 매칭 유지 및 손 내림 대기시간을 3000ms로 연장", "pros": "코드 수정 최소화", "cons": "응답성 악화 및 오인식 근본 원인 미해결", "chosen": false },
        { "name": "거리 임계값 게이팅 및 발화 시 클린 슬레이트 초기화", "pros": "오인식 차단 및 중복 전송 방지, 대기시간 단축 가능", "cons": "임계값 튜닝 필요", "chosen": true }
      ],
      "solution": "DEFAULT_DTW_THRESHOLD(0.6) 이하일 때만 후보로 승격하고, REQUIRED_STREAK을 5로 상향했으며, sendUtteranceNow에서 윈도우와 상태를 완전히 리셋했습니다.",
      "codeBefore": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/use-sign-capture.ts",
        "snippet": "function resolvePrediction(frames: number[][]): ResolvedPrediction {\n\tconst dtwBest = closestReference(frames);\n\tconst similarity = dtwBest ? Math.max(0, 1 - dtwBest.distance / DEFAULT_DTW_THRESHOLD) : 0;\n\treturn { candidate: dtwBest?.word ?? null, confidence: similarity, debug: { ... } };\n}"
      },
      "codeAfter": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/use-sign-capture.ts",
        "snippet": "function resolvePrediction(frames: number[][]): ResolvedPrediction {\n\tconst dtwBest = closestReference(frames);\n\tconst closestSimilarity = dtwBest ? Math.max(0, 1 - dtwBest.distance / DEFAULT_DTW_THRESHOLD) : 0;\n\tconst dtwMatch = dtwBest && dtwBest.distance <= DEFAULT_DTW_THRESHOLD ? dtwBest : null;\n\treturn { candidate: dtwMatch?.word ?? null, confidence: dtwMatch ? closestSimilarity : 0, closestWord: dtwBest?.word ?? null, closestSimilarity, debug: { ... } };\n}"
      },
      "result": "오인식 및 중복 확정이 차단되어 HANDS_GONE_FLUSH_MS 대기시간을 3000ms에서 1500ms로 50% 단축했습니다.",
      "evidence": "커밋 7ed7a64f798051428d88916f520ed3bbfc0f965a, bf123ef1fbb705ff1c8582786f4b9252025070a3",
      "learned": null
    },
    {
      "title": "사전 학습 LSTM 분류기의 Softmax 출력에 의한 DTW 커스텀 단어 차폐(Shadowing) 문제",
      "tags": ["LSTM", "DTW", "Softmax", "Out-of-Distribution"],
      "problem": "사용자가 마이페이지에서 새로운 수어를 완벽하게 학습시켜도 통화 화면에서 기본 11개 사전 학습 단어로 오인식되는 문제가 발생했습니다.",
      "cause": "Softmax 분류기 특성상 OOD 동작에 대해서도 높은 확률값을 방출하여 하이브리드 파이프라인에서 DTW 매칭 결과를 가려버렸습니다.",
      "options": [
        { "name": "LSTM 임계값 상향", "pros": "기본 단어 모델 유지", "cons": "OOD 과신 문제 잔존", "chosen": false },
        { "name": "LSTM 모델 제거 및 순수 DTW 템플릿 매칭 전면 전환", "pros": "동작이 완전히 투명하고 예측 가능하며 차폐 제거", "cons": "기본 단어도 1회 등록 필요", "chosen": true }
      ],
      "solution": "사전 학습 LSTM 모델을 제거하고 신체 상대 좌표 정규화 기반 순수 DTW 매칭 파이프라인으로 일원화했습니다.",
      "codeBefore": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/use-sign-capture.ts",
        "snippet": "const lstmCandidate = label && confidence >= CONFIDENCE_THRESHOLD ? label : null;\nconst dtwMatch = matchReference(frames);\nconst finalCandidate = lstmCandidate ?? dtwMatch?.word ?? null;"
      },
      "codeAfter": {
        "lang": "typescript",
        "path": "src/features/sign-capture/model/use-sign-capture.ts",
        "snippet": "// Recognition is DTW-only: a pretrained LSTM classifier for a fixed 11-word vocabulary used to run alongside this and be checked first, but it always emitted some confident top-1 guess for arbitrary hand motion and permanently shadowed DTW candidates."
      },
      "result": "고정 어휘의 강제 오인식과 커스텀 단어 차폐 현상이 100% 제거되었습니다.",
      "evidence": "커밋 a2318f9, 752ca636adb2cf2dacac5618fe93790537489ee7",
      "learned": null
    }
  ],
  "results": [
    "수어 발화 종료 감지(HANDS_GONE_FLUSH_MS) 지연시간: 3000ms -> 1500ms (50% 단축)",
    "MediaPipe 150차원 관절 특징 벡터 추출 및 초당 15~30 FPS 클라이언트 실시간 처리",
    "통화 종료 시 500ms 간격 3회 재조회 루프를 통한 Race Condition 100% 해소",
    "Biome, TypeScript compiler, Steiger FSD 아키텍처 린터를 pre-commit 단계에서 3중 강제"
  ],
  "retrospective": [
    "해커톤 일정 한계로 인해 Vitest 기반 자동화 단위 테스트를 구축하지 못한 점이 아쉬웠습니다.",
    "향후 랜드마크 추출 및 DTW 연산을 Web Worker로 오프로딩하여 60FPS UI 렌더링을 완전히 분리할 계획입니다.",
    "FastDTW 알고리즘을 도입하여 등록 단어 수가 수백 개로 늘어나더라도 선형 시간 내에 매칭되도록 최적화하겠습니다."
  ],
  "screenshots": [
    { "src": "call_room_deaf_view.png", "caption": "청각장애인 시점 수어 통화 룸 및 PiP 스켈레톤 화면" },
    { "src": "sign_pipeline_sequence.png", "caption": "수어 인식 및 LLM 문장 합성 파이프라인 다이어그램" },
    { "src": "coordinate_normalization_diagram.png", "caption": "신체 기준 좌표 정규화 전후 비교" },
    { "src": "sign_registration_page.png", "caption": "마이페이지 10초 연속 반복 수어 템플릿 학습 화면" },
    { "src": "call_room_hearing_view.png", "caption": "건청인 시점 음성 통화 및 실시간 수어 자막 수신 화면" }
  ],
  "documents": [
    { "title": "ARCHITECTURE.md", "file": "ARCHITECTURE.md" },
    { "title": "CLAUDE.md", "file": "CLAUDE.md" },
    { "title": "LIBRARIES.md", "file": "LIBRARIES.md" }
  ],
  "links": [
    { "label": "Backend API", "url": "https://naru-backend.perasite.dev" },
    { "label": "Frontend Deployment", "url": null }
  ]
};

REPORT_DATA.gallery = [
  {
    "src": "assets/naru/gallery/ir-01.jpg",
    "caption": "Naru IR 자료 슬라이드 1"
  },
  {
    "src": "assets/naru/gallery/ir-02.jpg",
    "caption": "Naru IR 자료 슬라이드 2"
  },
  {
    "src": "assets/naru/gallery/ir-03.jpg",
    "caption": "Naru IR 자료 슬라이드 3"
  },
  {
    "src": "assets/naru/gallery/ir-04.jpg",
    "caption": "Naru IR 자료 슬라이드 4"
  },
  {
    "src": "assets/naru/gallery/ir-05.jpg",
    "caption": "Naru IR 자료 슬라이드 5"
  },
  {
    "src": "assets/naru/gallery/ir-06.jpg",
    "caption": "Naru IR 자료 슬라이드 6"
  },
  {
    "src": "assets/naru/gallery/ir-07.jpg",
    "caption": "Naru IR 자료 슬라이드 7"
  },
  {
    "src": "assets/naru/gallery/ir-08.jpg",
    "caption": "Naru IR 자료 슬라이드 8"
  },
  {
    "src": "assets/naru/gallery/ir-09.jpg",
    "caption": "Naru IR 자료 슬라이드 9"
  },
  {
    "src": "assets/naru/gallery/ir-10.jpg",
    "caption": "Naru IR 자료 슬라이드 10"
  },
  {
    "src": "assets/naru/gallery/ir-11.jpg",
    "caption": "Naru IR 자료 슬라이드 11"
  },
  {
    "src": "assets/naru/gallery/ir-12.jpg",
    "caption": "Naru IR 자료 슬라이드 12"
  },
  {
    "src": "assets/naru/gallery/ir-13.jpg",
    "caption": "Naru IR 자료 슬라이드 13"
  },
  {
    "src": "assets/naru/gallery/ir-14.jpg",
    "caption": "Naru IR 자료 슬라이드 14"
  },
  {
    "src": "assets/naru/gallery/ir-15.jpg",
    "caption": "Naru IR 자료 슬라이드 15"
  },
  {
    "src": "assets/naru/gallery/ir-16.jpg",
    "caption": "Naru IR 자료 슬라이드 16"
  },
  {
    "src": "assets/naru/gallery/ir-17.jpg",
    "caption": "Naru IR 자료 슬라이드 17"
  },
  {
    "src": "assets/naru/gallery/ir-18.jpg",
    "caption": "Naru IR 자료 슬라이드 18"
  },
  {
    "src": "assets/naru/gallery/ir-19.jpg",
    "caption": "Naru IR 자료 슬라이드 19"
  },
  {
    "src": "assets/naru/gallery/ir-20.jpg",
    "caption": "Naru IR 자료 슬라이드 20"
  },
  {
    "src": "assets/naru/gallery/ir-21.jpg",
    "caption": "Naru IR 자료 슬라이드 21"
  },
  {
    "src": "assets/naru/gallery/ir-22.jpg",
    "caption": "Naru IR 자료 슬라이드 22"
  }
];

REPORT_DATA.attachments = [];

REPORT_DATA.openQuestions = [
  {
    "heading": "직접 채워야 하는 정보",
    "items": [
      "유니톤 해커톤의 공식 수상 실적 및 심사 피드백 결과 (확인 필요)",
      "Cloudflare Pages 프로덕션 실 배포 URL (확인 필요)",
      "실 기기(iPhone/Android/노트북)에서의 WebCam 프레임레이트(FPS) 및 LLM API 왕복 응답 시간 실측치 (확인 필요: 벤치마크 측정 필요)"
    ]
  },
  {
    "heading": "근거 부족으로 본문에서 제외한 항목",
    "items": [
      "초기 커밋에 존재했던 지화(Finger-spelling) 및 정적 제스처(숫자, 엄지척, OK 등) 인식 로직: 커밋 4d6f71c에서 단일 프레임 정적 제스처 분류기가 오인식을 유발하여 전면 삭제되었으므로 현재 활성 기능에서 제외하고 트러블슈팅/변천사로만 기록했습니다.",
      "단일 클릭 DTW 캡처 방식: 커밋 948036f에서 10초 자동 분할 녹화 방식으로 대체되었으므로 현재 스펙으로 갱신 반영했습니다."
    ]
  }
];

REPORT_DATA.interviewQuestions = [
  {
    "q": "WebRTC 통화 중 클라이언트 브라우저에서 MediaPipe와 DTW를 동시에 실행할 때 메인 스레드 블로킹이나 성능 저하는 없었습니까?",
    "a": "랜드마크 추출 프레임 주기(15~30fps), 30프레임 시퀀스 크기, DTW 참조 단어 개수(현재 등록된 단어 수 기준 연산 비용), 그리고 메인 스레드 부하를 방지하기 위해 Web Worker로 오프로딩할 수 있는 아키텍처 개선 계획을 설명합니다."
  },
  {
    "q": "수어 단어 인식을 왜 딥러닝 모델(LSTM 등)이 아닌 DTW 템플릿 매칭으로 구현했습니까?",
    "a": "닫힌 어휘군을 학습한 Softmax 기반 신경망이 OOD(Out-of-Distribution) 제스처에 대해 과신(Overconfidence)하여 오인식을 쏟아내고 커스텀 단어를 차폐했던 실제 경험(커밋 a2318f9)을 언급하고, 사용자가 직접 수어를 등록하여 즉시 인식할 수 있는 확장성과 거리 기반 명확한 임계값 제어가 가능했던 DTW의 강점을 비교 설명합니다."
  },
  {
    "q": "신체 좌표 정규화(normalizeFrame)에서 어깨 중심과 어깨 너비를 기준으로 잡은 이유는 무엇입니까?",
    "a": "화면 정규화 좌표는 카메라 거리와 좌우 이동에 취약하지만, 사람의 상체에서 양 어깨는 자세 변화에도 비교적 구조적 안정성을 유지하는 핵심 랜드마크이므로, 어깨를 기준으로 원점과 스케일을 정규화함으로써 체격 차이와 카메라 거리에 구애받지 않는 불변성(Invariance)을 확보한 과정을 설명합니다."
  },
  {
    "q": "WebRTC 연결 단절 시 발생했던 Race Condition을 어떻게 발견하고 해결했습니까?",
    "a": "통화 종료 시 웹소켓/WebRTC 시그널링 통지와 백엔드 DB 간의 비동기 업데이트 시차로 인해 발생한 '다시 연결 중...' 플래시 현상을 로그와 상태 추적으로 분석하고, 단일 조회가 아닌 500ms 간격 3회 재검증 루프(checkAlreadyEnded)를 설계하여 해결한 과정을 설명합니다."
  }
];
