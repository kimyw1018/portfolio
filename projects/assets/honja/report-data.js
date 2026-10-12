/**
 * 자동 생성: portfolio-out/honja/혼저옵서예.json 의 원문 JSON을 그대로 옮긴 REPORT_DATA.
 * openQuestions / interviewQuestions 는 같은 프로젝트의 .md 10/11장 원문을
 * 별도로 채워 넣는다 (json에는 없는 필드).
 */
const REPORT_DATA = {
  "title": "혼저옵서예 (honja-front)",
  "period": "2026-07-06 ~ 2026-08-22 (약 7주)",
  "role": "프론트엔드 개발자",
  "summary": "제주 올레길/여행지를 동행 유형별(혼자, 가족, 친구, 애인, 배리어프리, 반려동물)로 탐색하고 일정을 계획해 초대할 수 있는 Expo(React Native) 기반 여행 플래너 앱입니다.",
  "keyResults": [
    {
      "value": "12 / 34 (약 35%)",
      "label": "전체 커밋 중 본인 작성 커밋 비율",
      "condition": "git log --author=\"poppppp00@gmail.com|164151329+kimyw1018\" --oneline | wc -l 대비 git log --oneline | wc -l"
    },
    {
      "value": "44 / 95 (약 46%)",
      "label": "현재 TypeScript/TSX 파일 중 본인 최초 작성 파일 비율",
      "condition": "각 파일에 대해 git log --format=%an -- <file> | tail -1 로 최초 커밋 작성자 조회"
    },
    {
      "value": "+7,892 / -1,955줄",
      "label": "src/ 디렉터리 기준 본인 커밋 순변경량",
      "condition": "git log --author=poppppp00@gmail.com --numstat -- src 합산"
    },
    {
      "value": "4개 파일 / 19개 케이스 / 299줄",
      "label": "Zustand 스토어 단위 테스트 작성량",
      "condition": "src/stores/__tests__/*.test.ts, grep -c \"  it(\" 합산"
    }
  ],
  "overview": {
    "background": "README.md와 src/pages/home.tsx, src/pages/map.tsx, src/pages/route/* 등 화면 구성으로 미루어, 제주 여행자를 대상으로 동행 유형별 코스 추천과 일정 계획, 초대 기능을 제공하는 서비스입니다.",
    "problem": "백엔드 API 명세가 개발 중 계속 바뀌는 상황에서 프론트엔드가 오프라인/API 미비 상태로도 동작해야 했습니다. src/api/client.ts의 자체 Mock Fallback 구현이 근거입니다.",
    "scope": [
      "프로젝트 초기 구조 설계 및 FSD -> 화면 중심 구조 재구조화 (커밋 d168be7, 9c9e203, 475a930)",
      "API 클라이언트 아키텍처(get/post/put/patch/del + Mock Fallback) 구현 (src/api/client.ts)",
      "홈/지도/마이페이지 화면 구현 (src/pages/home.tsx, map.tsx, mypage.tsx)",
      "여행 초대 API 연동 및 하위 호환 DTO 설계 (src/api/invitation.ts, src/hooks/use-invitations.ts)",
      "Zustand 스토어 단위 테스트 4종 작성 (src/stores/__tests__)"
    ],
    "collaboration": [
      "브랜치 전략: feat/#번호-설명, refactor/#번호-설명 형태로 이슈 번호를 브랜치명에 포함 (git branch -a 근거)",
      "PR 기반 협업, 병합 커밋 12건 확인 (git log --merges)",
      "API DTO에 @deprecated 주석으로 구 필드를 유지하며 점진적으로 신규 필드로 이관하는 패턴 사용 (src/api/invitation.ts)",
      "로그인/회원가입은 anhyunjung, 경로 생성 플로우는 eeeeeaaan, 초대/여행카드 UI 일부는 서린이 담당 (파일별 최초 커밋 작성자 기준)"
    ]
  },
  "stack": [
    {
      "category": "프레임워크",
      "items": [
        { "name": "Expo ~54.0.0", "reason": null },
        { "name": "React Native 0.81.5", "reason": null },
        { "name": "React/React DOM 19.1.0", "reason": null }
      ]
    },
    {
      "category": "라우팅",
      "items": [
        { "name": "expo-router ~6.0.24 (typedRoutes, reactCompiler 실험 기능)", "reason": null }
      ]
    },
    {
      "category": "언어",
      "items": [
        { "name": "TypeScript ~5.9.2", "reason": null }
      ]
    },
    {
      "category": "상태 관리",
      "items": [
        { "name": "Zustand ^5.0.14 (클라이언트 로컬 상태)", "reason": null },
        { "name": "@tanstack/react-query ^5.101.2 (서버 상태)", "reason": null }
      ]
    },
    {
      "category": "코드 컨벤션",
      "items": [
        { "name": "Biome ^2.5.2", "reason": "README.md: ESLint/Prettier 대신 더 빠르고 일관된 포맷팅/린팅을 위해 채택" }
      ]
    },
    {
      "category": "테스트",
      "items": [
        { "name": "Jest ^29.7.0 / jest-expo ~54.0.17", "reason": null },
        { "name": "@testing-library/react-native ^14.0.1", "reason": null }
      ]
    }
  ],
  "design": {
    "architecture": "router/*.tsx(expo-router 엔트리) -> pages/*.tsx(화면) -> hooks/use-*.ts(TanStack Query, 서버 상태) 및 stores/*.ts(Zustand, 로컬 상태) -> api/*.ts(도메인 함수) -> api/client.ts(공통 HTTP 래퍼 + Mock Fallback) -> fetch(EXPO_PUBLIC_API_URL) 순으로 요청이 처리됩니다.",
    "dataModel": "백엔드 없이 프론트엔드 전용 레포이므로 DB 스키마는 없고, CourseDetailResponseDto(src/api/course.ts), CourseInvitationResponseDto(src/api/invitation.ts), WeatherResDTO(src/api/weather.ts) 등 TypeScript 인터페이스로 API 응답 계약을 재정의해 사용합니다.",
    "api": "도메인별 파일(api/course.ts, api/invitation.ts, api/weather.ts, api/place.ts, api/auth.ts)로 엔드포인트를 분리하고, {isSuccess, code, message, data} 공통 응답 래퍼(ApiResponse<T>)를 사용합니다. 단 api/dto/client.ts는 이 래퍼를 쓰지 않는 별도 구현으로 남아 있어 로직이 일부 중복됩니다.",
    "infra": "CI 설정, Dockerfile, EAS 설정이 저장소에 없으며 npm run start(expo start)를 통한 로컬 개발 서버 구동만 확인됩니다. API 서버 주소는 .env의 EXPO_PUBLIC_API_URL로 주입되며(값 자체는 민감정보로 비공개 처리), 값이 없으면 http://localhost:8080으로 폴백합니다.",
    "tree": "src/\n├── api/                 # 백엔드 연동 계층\n│   ├── client.ts        #   공통 fetch 래퍼 + Mock Fallback (본인 작성)\n│   ├── dto/client.ts     #   초기 버전 fetch 로직 (팀원 작성, 일부 중복)\n│   ├── auth.ts           #   회원가입/로그인/프로필/약관 API\n│   ├── course.ts         #   코스 CRUD API\n│   ├── invitation.ts      #   초대 API (본인 확장)\n│   ├── place.ts           #   장소 검색/상세 API (본인 작성)\n│   ├── route-api.ts       #   경로 관련 API (본인 작성)\n│   └── weather.ts         #   날씨 API (본인 작성)\n├── components/            # 도메인별 UI 조각\n├── hooks/                 # 커스텀 훅 (TanStack Query 훅 포함)\n├── pages/                  # 화면 컴포넌트\n├── providers/               # QueryProvider (본인 작성)\n├── router/                   # expo-router 엔트리 (본인 작성)\n├── stores/                    # Zustand 스토어 + __tests__\n├── styles/                     # 테마 토큰\n├── types/                      # 공통 타입\n└── utils/                       # 유틸리티",
    "diagrams": [
      { "src": "05-architecture-diagram.png", "caption": "router -> pages -> hooks/stores -> api -> client 요청 흐름도 (신규 제작 필요)" }
    ]
  },
  "features": [
    {
      "name": "API 클라이언트의 Mock Data Fallback 전략",
      "what": "백엔드 API 실패 시 화면 개발/시연이 끊기지 않도록 get/post/put/patch/del 전 함수에 자동 Mock 데이터 폴백을 구현했습니다.",
      "how": [
        "fetch로 실제 백엔드에 요청",
        "!res.ok 또는 isSuccess:false면 Error를 throw",
        "catch에서 console.warn 로깅 후 getMockDataFallback(method, path, body) 호출",
        "경로 문자열 패턴 분기로 도메인별 Mock 데이터 반환",
        "Mock으로도 처리 불가한 경로는 원래 에러를 재전파"
      ],
      "decision": "MSW 대신 애플리케이션 코드 내 자체 Mock Fallback을 선택해 설정 비용은 줄였으나 client.ts 파일이 비대해지는 트레이드오프가 있습니다. 실제 논의 근거는 확인되지 않았습니다.",
      "files": ["src/api/client.ts"],
      "code": {
        "lang": "typescript",
        "path": "src/api/client.ts",
        "snippet": "export async function get<T>(path: string): Promise<T> {\n  const baseUrl = getApiBaseUrl();\n  try {\n    const res = await fetch(`${baseUrl}${path}`, { method: 'GET', headers: getHeaders() });\n    if (!res.ok) throw new Error(`HTTP error ${res.status}`);\n    const json: ApiResponse<T> = await res.json();\n    if (!json.isSuccess) throw new Error(json.message || '요청에 실패했습니다.');\n    return json.data;\n  } catch (err) {\n    console.warn(`[API GET FAIL] Falling back to mock data for ${path}:`, err);\n    try { return getMockDataFallback('GET', path) as T; } catch { throw err; }\n  }\n}"
      }
    },
    {
      "name": "아키텍처 재구조화: FSD에서 화면 중심 구조로",
      "what": "초기 Feature-Sliced Design(app/entities/features/shared) 구조를 pages/components/stores/hooks/api 중심 구조로 전면 재편했습니다.",
      "how": [
        "src/app/index.tsx -> src/pages/home.tsx 등 파일을 역할별 디렉터리로 이동",
        "보일러플레이트 예시 코드(entities/counter, features/counter-button) 삭제",
        "shared/ui -> components/common, shared/lib -> hooks 로 재배치",
        "동시에 stores/에 대응하는 단위 테스트 신규 추가"
      ],
      "decision": "도메인(entities)과 기능(features)이 각각 1개뿐이던 시점에 계층 구분의 실익이 적다고 판단해 단순화했습니다. 실제 논의 기록은 확인되지 않아 diff로부터의 추정입니다.",
      "files": ["src/pages/*", "src/components/common/*", "src/hooks/*", "src/styles/theme.ts", "src/router/_layout.tsx"],
      "code": {
        "lang": "text",
        "path": "git show 9c9e203 --stat",
        "snippet": "src/{app/index.tsx => pages/home.tsx}\nsrc/{app => }/providers/QueryProvider.tsx\nsrc/{app => router}/_layout.tsx\nsrc/{shared/ui => components/common}/themed-text.tsx\nsrc/{shared/lib => hooks}/use-theme.ts\nsrc/{shared/config => styles}/theme.ts\nsrc/entities/counter/model/store.ts        | 15 -- (삭제)\nsrc/features/counter-button/ui/CounterButton.tsx | 90 ----- (삭제)"
      }
    },
    {
      "name": "크로스플랫폼 지도 렌더링 분기 처리",
      "what": "동일한 지도 화면이 웹과 iOS/Android에서 각각 다른 방식으로 카카오맵을 렌더링하도록 구현했습니다.",
      "how": [
        "Platform.OS !== 'web'일 때만 조건부로 react-native-webview require 시도",
        "웹은 iframe, 네이티브는 WebView, 둘 다 불가하면 안내 텍스트로 3단 분기 렌더링",
        "선택된 장소명을 useMemo로 카카오맵 검색 링크로 인코딩"
      ],
      "decision": "네이티브 지도 SDK(react-native-maps 등) 대신 카카오맵 웹 링크를 iframe/WebView로 임베드하는 방식을 선택해 빠르게 지도 화면을 완성했으나, 마커 클릭 등 상호작용은 제공하지 못합니다.",
      "files": ["src/pages/map.tsx"],
      "code": {
        "lang": "typescript",
        "path": "src/pages/map.tsx",
        "snippet": "let WebView: any = null;\nif (Platform.OS !== 'web') {\n  try { WebView = require('react-native-webview').WebView; }\n  catch (e) { console.warn('react-native-webview is not available', e); }\n}\n// ...\n{Platform.OS === 'web' ? (\n  <iframe src={mapUrl} style={{ width: '100%', height: '100%', border: 'none' }} title=\"Kakao Map\" />\n) : WebView ? (\n  <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />\n) : (\n  <View style={styles.mapFallback}><Text>지도를 불러올 수 없습니다 (WebView 미지원)</Text></View>\n)}"
      }
    },
    {
      "name": "여행 초대 API 연동과 하위 호환 DTO 설계",
      "what": "이메일로 초대하고 수락/거절하는 기능의 API 계층을 구현하고 TanStack Query 훅, 마이페이지 UI에 연결했습니다.",
      "how": [
        "src/api/invitation.ts에 getMyInvitations, inviteMember, acceptInvitation, rejectInvitation 구현",
        "필드명 변경(counterpartNickname/Email -> inviterName/Email) 시 구 필드를 @deprecated로 유지",
        "백엔드 미구현 엔드포인트(getSentInvitations)는 빈 배열 스텁으로 구현하고 사유를 주석에 명시",
        "useAcceptInvitation/useRejectInvitation 성공 시 관련 쿼리 키 2개를 함께 invalidate"
      ],
      "decision": "구/신 필드를 공존시켜 여러 화면이 동시에 같은 DTO를 참조해도 백엔드 계약 변경이 컴파일을 깨뜨리지 않도록 했습니다. 실제 팀 합의였는지는 확인되지 않았습니다.",
      "files": ["src/api/invitation.ts", "src/hooks/use-invitations.ts", "src/components/route/TripCard.tsx"],
      "code": {
        "lang": "typescript",
        "path": "src/api/invitation.ts",
        "snippet": "export interface CourseInvitationResponseDto {\n  courseMemberId: number;\n  courseId: number;\n  inviterName: string;\n  inviterEmail: string;\n  /** @deprecated use inviterName */\n  counterpartNickname: string;\n  /** @deprecated use inviterEmail */\n  counterpartEmail: string;\n  status: InviteStatus;\n}\nexport function getMyInvitations() {\n  return get<CourseInvitationResponseDto[]>('/courses/invitations');\n}\n/** @deprecated use getMyInvitations */\nexport const getReceivedInvitations = getMyInvitations;\nexport async function getSentInvitations(): Promise<CourseInvitationResponseDto[]> {\n  return [];\n}"
      }
    },
    {
      "name": "마이페이지 프로필 수정/계정 삭제 API 연동과 플랫폼별 확인 UX",
      "what": "항상 성공 알림만 띄우던 저장/삭제 버튼을 실제 API 호출과 로딩/에러 상태 관리로 구현했습니다.",
      "how": [
        "handleSave를 async로 전환, isSaving으로 중복 클릭 방지",
        "updateProfile 실패 시 에러 메시지를 사용자에게 노출",
        "계정 삭제는 web은 window.confirm, 네이티브는 Alert.alert 버튼 콜백으로 분기",
        "삭제 성공 시 clearToken 후 welcome 화면으로 이동"
      ],
      "decision": "커스텀 모달 대신 플랫폼 네이티브 다이얼로그를 그대로 사용해 개발 비용을 줄였으나 웹/네이티브 간 디자인 일관성은 떨어집니다.",
      "files": ["src/pages/mypage.tsx", "src/api/auth.ts"],
      "code": {
        "lang": "typescript",
        "path": "src/pages/mypage.tsx",
        "snippet": "const handleSave = async () => {\n  if (isPasswordChangeEnabled && !confirmPassword.trim()) {\n    const msg = '비밀번호 재입력을 입력해 주세요.';\n    if (Platform.OS === 'web') window.alert(msg); else Alert.alert('알림', msg);\n    return;\n  }\n  setIsSaving(true);\n  try {\n    await updateProfile({ nickname, email, ...(isPasswordChangeEnabled ? { code: password } : {}) });\n    setIsPasswordChangeEnabled(false);\n    setConfirmPassword('');\n  } catch (e: any) {\n    const msg = e?.message ?? '저장에 실패했습니다.';\n    if (Platform.OS === 'web') window.alert(msg); else Alert.alert('오류', msg);\n  } finally {\n    setIsSaving(false);\n  }\n};"
      }
    },
    {
      "name": "Zustand 스토어 단위 테스트",
      "what": "homeStore, mapStore, mypageStore, routeStore 4개 스토어에 대해 액션 호출 후 상태 변화를 검증하는 단위 테스트를 작성했습니다.",
      "how": [
        "beforeEach에서 setState로 스토어 상태 초기화",
        "getState().액션(...)을 직접 호출해 렌더링 없이 로직만 검증",
        "배열 순서 변경, 필터링, id 기반 갱신 등 상태 전이를 케이스별 검증"
      ],
      "decision": "컴포넌트 렌더링 없이 스토어 로직만 분리 테스트해 UI 변경에 영향받지 않도록 했습니다.",
      "files": ["src/stores/__tests__/homeStore.test.ts", "src/stores/__tests__/mapStore.test.ts", "src/stores/__tests__/mypageStore.test.ts", "src/stores/__tests__/routeStore.test.ts"],
      "code": {
        "lang": "typescript",
        "path": "src/stores/__tests__/routeStore.test.ts",
        "snippet": "it('should move place up in itinerary', () => {\n  expect(useRouteStore.getState().itinerary[1].id).toBe('route-p2');\n  expect(useRouteStore.getState().itinerary[0].id).toBe('route-p1');\n\n  useRouteStore.getState().movePlaceUp(1);\n\n  expect(useRouteStore.getState().itinerary[0].id).toBe('route-p2');\n  expect(useRouteStore.getState().itinerary[1].id).toBe('route-p1');\n});"
      }
    }
  ],
  "troubleshooting": [],
  "results": [
    "전체 34개 커밋 중 12개(약 35%)를 본인이 작성 (git log 기준)",
    "현재 TS/TSX 파일 95개 중 44개(약 46%)를 본인이 최초 작성",
    "src/ 기준 본인 커밋 순변경량 +7,892 / -1,955줄",
    "Zustand 스토어 단위 테스트 4개 파일, 19개 케이스(299줄) 작성",
    "사용자 지표, 성능 벤치마크, 배포/운영 결과는 저장소 내에서 확인되지 않음 (확인 필요)"
  ],
  "retrospective": [
    "api/client.ts와 api/dto/client.ts로 API 클라이언트가 이원화되어 유사 기능이 중복 구현됨. 처음부터 단일 공통 클라이언트로 통일했어야 함",
    "components/route/RoutePlanner.tsx, PlaceReorderList.tsx가 팀원의 후속 구현으로 대체되며 미사용 코드로 남음. 기능 이관 시 죽은 코드를 함께 정리했어야 함",
    "README의 디렉터리 구조(MSW 기반 bootstrap/mocks) 및 기술 스택 버전 설명이 실제 구현과 어긋난 채로 남아 있음. 설계 변경 시 문서도 같은 PR에서 갱신했어야 함",
    "테스트가 Zustand 스토어에만 존재하고, 회귀 위험이 큰 getMockDataFallback 같은 분기 로직에는 테스트가 없음. 우선순위를 재조정했어야 함"
  ],
  "screenshots": [
    { "src": "01-home.png", "caption": "홈 화면(날씨 위젯 + 올레 행사 목록)" },
    { "src": "02-map-native.png", "caption": "지도 화면 네이티브(WebView) 렌더링" },
    { "src": "02-map-web.png", "caption": "지도 화면 웹(iframe) 렌더링" },
    { "src": "03-mypage-edit.png", "caption": "마이페이지 프로필 수정 폼(로딩 상태 포함)" },
    { "src": "04-invitation-flow.png", "caption": "초대 수락/거절 화면" },
    { "src": "05-architecture-diagram.png", "caption": "요청 처리 흐름도" },
    { "src": "06-directory-before-after.png", "caption": "FSD 구조와 화면 중심 구조 비교" }
  ],
  "documents": [],
  "links": [
    { "label": "GitHub Repository", "url": "https://github.com/SSU24f5/honja-front" }
  ]
};

REPORT_DATA.gallery = [];

REPORT_DATA.attachments = [];

REPORT_DATA.openQuestions = [
  {
    "heading": "직접 채워야 하는 정보",
    "items": [
      "프로젝트가 소속된 정식 명칭(교과목/공모전 등)과 소속 기관: Org명 SSU24f5, 팀원 이메일 도메인 @soongsil.ac.kr로 대학 팀 프로젝트로 추정되나 확정 근거 없음.",
      "배포 주소(웹/스토어), 실제 운영 여부.",
      "성능/사용자 지표(로딩 시간, 활성 사용자 수 등)의 측정 조건과 실측값.",
      "API 클라이언트 이원화(client.ts vs dto/client.ts), FSD → 화면 중심 구조 변경, WebView/iframe 방식 선택 등 여러 '선택지와 판단' 항목의 실제 팀 논의 배경(회의록, 이슈 코멘트 등)이 있다면 반영 필요.",
      "지원 직무(프론트엔드 개발자) 관점에서 강조하고 싶은 역량(성능 최적화, 접근성, 디자인 시스템 등) 중 레포에서 확인되지 않는 추가 경험이 있다면 별도로 기술 필요."
    ]
  },
  {
    "heading": "근거 부족으로 제외한 트러블슈팅 후보와 그 이유",
    "items": [
      "src/pages/mypage.tsx의 handleSave가 정적 성공 알림에서 실제 updateProfile API 호출로 바뀐 변경 — 버그를 수정한 것이 아니라 미구현 기능을 새로 구현한 것에 가까워, '문제 상황/원인 분석'을 구성할 근거(재현 조건, 실패 로그 등)가 없어 핵심 구현으로 옮겼습니다.",
      "커밋 2191170에서 src/api/client.ts가 681줄 변경(거의 전체 재작성)된 것 — diff 전체가 기존 코드 삭제 후 거의 동일한 내용 재작성으로 보여, 줄바꿈/포맷팅 정규화이거나 파일 재구성일 가능성이 높습니다. 실제 버그를 수정했다는 근거(에러 메시지, 실패 사례)를 diff에서 찾지 못해 트러블슈팅으로 분류하지 않았습니다.",
      "PR #11 refactor/#11-connection(병합 커밋 25b4d77) — 병합 커밋에는 제목만 있고 본문/개별 커밋 diff가 본인 작성 범위에 포함되지 않아, 무엇이 어떤 문제로 인해 리팩터링되었는지 코드로 검증하지 못했습니다.",
      "src/api/invitation.ts의 getSentInvitations가 빈 배열만 반환 — 이는 백엔드 미구현으로 인한 의도적 스텁이며, 프론트엔드 버그를 수정한 사례가 아니어서 트러블슈팅에서 제외하고 설계상의 판단으로 기록했습니다."
    ]
  }
];

REPORT_DATA.interviewQuestions = [
  {
    "q": "API 클라이언트에 Mock Fallback을 내장하는 방식과 MSW 같은 별도 모킹 레이어를 두는 방식 중 왜 전자를 선택했나요?",
    "a": "README에는 MSW 기반 구조가 문서화되어 있었지만 실제로는 client.ts 내장 방식으로 귀결된 경위(누가, 언제, 왜 바꿨는지)를 본인의 기억을 근거로 설명할 수 있어야 합니다."
  },
  {
    "q": "FSD에서 화면 중심 구조로 바꾼 기준이 무엇이었나요? 프로젝트 규모가 커지면 다시 FSD로 돌아갈 필요는 없었나요?",
    "a": "커밋 diff만으로는 팀 논의 과정이 드러나지 않으므로, 당시 의사결정 배경과 트레이드오프를 구체적으로 답할 준비가 필요합니다."
  },
  {
    "q": "src/api/client.ts와 src/api/dto/client.ts처럼 중복된 API 클라이언트가 왜 정리되지 않고 남아 있었나요?",
    "a": "회고에서 식별한 문제이며, 실제로 정리를 시도했는지, 시간/우선순위 제약이 있었는지 답변 준비가 필요합니다."
  },
  {
    "q": "카카오맵을 iframe/WebView로 임베드하는 방식의 한계(마커 클릭, 커스텀 오버레이 불가 등)를 알고도 선택한 이유는 무엇인가요?",
    "a": "네이티브 SDK 대비 트레이드오프를 코드 근거로 설명하되, 실제 대안 검토 여부는 본인의 기억에 의존해야 합니다."
  },
  {
    "q": "테스트가 Zustand 스토어에만 있고 API 클라이언트의 Mock Fallback 분기나 화면 컴포넌트에는 없는데, 우선순위를 어떻게 정했나요?",
    "a": "회귀 위험이 큰 getMockDataFallback 같은 로직에 테스트가 없는 점에 대한 자기 평가가 필요합니다."
  },
  {
    "q": ".env의 API 주소가 내부 IP(사설 대역)로 고정되어 있던데, 실제 배포 환경에서는 어떻게 관리할 계획이었나요?",
    "a": "배포 파이프라인이 확인되지 않는 상태이므로, 환경별 설정 관리 전략에 대한 본인의 구상을 준비해야 합니다."
  }
];
