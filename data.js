/**
 * ==============================================================================
 * 포트폴리오 데이터 (data.js)
 * ==============================================================================
 */

const PORTFOLIO_DATA = {
  // 1. 기본 프로필 정보
  profile: {
    name: "김예원",
    nickname: "코코",
    englishName: "Kim Yewon",
    githubUsername: "kimyw1018",
    role: "Backend & Fullstack Developer",
    affiliation: "숭실대학교 컴퓨터학부 3학년 2학기 재학",
    phone: "010-6555-6343",
    email: "poppppp00@gmail.com",
    github: "https://github.com/kimyw1018",
    avatar: "projects/img/증명사진.jpg",

    tagline: "쿼리 실행 계획부터 컨테이너 오케스트레이션까지, 시스템의 병목을 직접 찾아 고치는 개발자입니다.",

    bio: [
      "Spring Boot와 Java로 백엔드를 만들고, PostgreSQL과 PostGIS로 쿼리를 튜닝하고, K3s와 ArgoCD로 그 서비스를 직접 배포합니다. A:SSU 프로젝트에서는 CTE와 Window Function으로 집계 쿼리를 단일 쿼리로 묶어 주간 매장 순위 조회 속도를 83% 줄였고, PostGIS R-Tree 공간 인덱스로 지오펜싱 조회의 N+1 문제를 없앴습니다.",
      "프론트엔드도 같은 기준으로 다룹니다. React와 TypeScript로 웹 클라이언트를, Kotlin으로 Android 클라이언트를 직접 구현하면서 API 스키마를 먼저 정의하고 팀과 공유하는 방식으로 작업합니다. 나루 프로젝트에서는 MediaPipe 랜드마크 추출과 DTW 알고리즘을 조합해 브라우저 안에서만 동작하는 30fps 수어 인식을 만들었습니다.",
      "UDP, TCP, STOMP 같은 전송 프로토콜을 직접 뜯어보고 스레드 풀과 락 경합을 원인 단위로 추적하는 편입니다. 겪은 문제와 해결 과정은 디렉터리 구조와 에러 페이로드 규격까지 문서로 남겨서, 같은 이슈를 팀이 두 번 겪지 않도록 합니다."
    ]
  },

  // 2. 학력
  education: [
    {
      period: "2024.03 ~ 재학 중",
      institution: "숭실대학교",
      major: "IT대학 컴퓨터학부 · 3학년 2학기",
      description: "2026 숭실대 컴퓨터학부 SW공모전 총장상 수상 · 제28, 29대 학생회 활동"
    }
  ],

  // 3. 기술 스택
  skills: {
    "Backend & Database": [
      { name: "Java", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
      { name: "Spring Boot", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg" },
      { name: "MySQL / MariaDB", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
      { name: "PostgreSQL & PostGIS", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
      { name: "Redis", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
      { name: "Spring Data JPA / Hibernate", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hibernate/hibernate-original.svg" }
    ],
    "Web & Frontend": [
      { name: "React (18 / 19)", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "TypeScript", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
      { name: "Vite / Bun", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
      { name: "Tailwind CSS", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Zustand & TanStack Query", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "LiveKit WebRTC", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg" }
    ],
    "Mobile": [
      { name: "Android (Kotlin / Java)", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg" },
      { name: "React Native", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "Hilt & Coroutines / Flow", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" }
    ],
    "DevOps & Infrastructure": [
      { name: "Git & GitHub", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
      { name: "GitHub Actions", level: "Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
      { name: "Docker", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      { name: "K3s & ArgoCD (GitOps)", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/argocd/argocd-original.svg" },
      { name: "AWS (S3 / EC2)", level: "Intermediate", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" }
    ]
  },

  // 4. 수상 내역
  awards: [
    {
      date: "2026.08.04",
      badge: "총장상",
      title: "2026 숭실대학교 컴퓨터학부 소프트웨어공모전 총장상",
      project: "A:SSU (어슈)",
      organization: "숭실대학교",
      description: "대학-매장 제휴 관리 플랫폼 풀스택 개발. Spring Boot GIS/통계 쿼리 최적화 및 Android 네이티브 클라이언트 구현"
    },
    {
      date: "2026.02.20",
      badge: "최우수상",
      title: "UMC 9기 데모데이 최우수상",
      project: "또랑 (TTORANG)",
      organization: "Makeus Challenge (UMC)",
      description: "발표 피드백 플랫폼의 브라우저 부하 분리 녹화 아키텍처와 1MB 청크 분할 업로드 파이프라인 개발"
    },
    {
      date: "2026.08.26",
      badge: "우수상",
      title: "2026 UNITHON 우수상",
      project: "나루 (Naru)",
      organization: "UNITHON",
      description: "온디바이스 실시간 30fps 수어-음성 양방향 통화 웹 서비스 기획 및 실시간 AI 파이프라인 개발"
    },
    {
      date: "2026.08.21",
      badge: "우수상",
      title: "UMC 10기 데모데이 우수상",
      project: "뮤즈리뷰 (MuseReview)",
      organization: "Makeus Challenge (UMC)",
      description: "악기 연주 피드백 플랫폼 백엔드 코어 아키텍처 및 OAuth 2.0 / Redis 기반 인증 체계 구축"
    }
  ],

  // 5. 주요 프로젝트 (4개)
  projects: [
    {
      id: "naru",
      title: "Naru (나루)",
      subtitle: "실시간 양방향 수어-음성 통화 웹 서비스",
      award: "2026 UNITHON 우수상",
      period: "2026.08 ~ 2026.09",
      category: "frontend",
      categoryName: "AI / WebRTC / Frontend",
      detailPage: "projects/naru.html",
      image: "projects/img/나루.png",
      tags: ["React 19", "TypeScript", "Vite 8", "MediaPipe", "DTW Engine", "LiveKit WebRTC", "Zustand", "Tailwind CSS v4"],
      summary: "일반 웹캠과 모바일 브라우저만으로 30fps 온디바이스 수어 인식과 양방향 통화를 지원하는 배리어프리 커뮤니케이션 서비스",
      role: "프론트엔드 및 실시간 AI 파이프라인 전담",
      highlights: [
        "MediaPipe 3D 랜드마크 추출과 신체 상대적 정규화, DTW 알고리즘을 결합한 온디바이스 30fps 수어 인식",
        "발화 종료 감지 버퍼와 직전 12턴 대화 히스토리를 반영한 LLM 구어체 문장 변환",
        "10초 케이던스 UI를 통한 사용자 맞춤 수어 단어 온디바이스 등록",
        "LiveKit WebRTC 기반 화상 통화, iOS Safari 햅틱 및 DTMF 다이얼 톤 구현"
      ],
      links: [
        { label: "상세 분석 보기", url: "projects/naru.html" }
      ],
      featured: true
    },
    {
      id: "assu",
      title: "A:SSU (어슈)",
      subtitle: "대학-매장 제휴 관리 및 실시간 통계 플랫폼",
      award: "2026 숭실대 SW공모전 총장상",
      period: "2025.03 ~ 진행 중",
      category: "backend",
      categoryName: "Fullstack (Spring Boot & Android)",
      detailPage: "projects/assu.html",
      image: "projects/img/ASSU – 대학생 제휴 어플.png",
      tags: ["Java", "Spring Boot", "Android", "Kotlin", "PostgreSQL", "PostGIS", "K3s", "ArgoCD", "Redis", "Hilt"],
      summary: "숭실대 인근 제휴 매장의 순위 추적과 관리자 통계 대시보드를 Android 클라이언트부터 백엔드 GIS/통계 인프라까지 전 계층 개발",
      role: "백엔드 API·GIS·통계 및 Android 대시보드 풀스택 개발",
      highlights: [
        "N:M 정규화와 복합 인덱스, CTE·Window Function 단일 쿼리 집계로 주간 매장 순위 조회 속도 83% 개선",
        "PostGIS R-Tree 공간 인덱스 필터링과 메모리(HashSet) 권한 검증 분리, IN절 Bulk Read로 N+1 해결",
        "제휴 사용량 동시 갱신 시 Lost Update 방지를 위한 비관적 락(SELECT ... FOR UPDATE) 적용",
        "K3s 3-Node 클러스터와 ArgoCD GitOps 파이프라인 구축, Flannel VXLAN 프로토콜 분석 및 Ingress 충돌 해결",
        "Sealed Interface 상태 관리, Coroutines async/await 병렬 API 호출, MPAndroidChart 커스텀 렌더러 구현"
      ],
      links: [
        { label: "상세 분석 보기", url: "projects/assu.html" },
        { label: "Backend GitHub", url: "https://github.com/kimyw1018/ASSU_BE" },
        { label: "Android GitHub", url: "https://github.com/ASSU-dev/ASSU_FE_app" }
      ],
      featured: true
    },
    {
      id: "musereview",
      title: "뮤즈리뷰 (MuseReview)",
      subtitle: "악기 연주 피드백 플랫폼 백엔드 코어 시스템",
      award: "UMC 10기 데모데이 우수상",
      period: "2026.06 ~ 2026.08",
      category: "backend",
      categoryName: "Backend Core Architecture",
      detailPage: "projects/musereview.html",
      image: "projects/img/Muse Review .png",
      tags: ["Java", "Spring Boot", "OAuth 2.0", "JWT", "Redis", "PostgreSQL", "Flyway", "Docker Compose", "Swagger"],
      summary: "카카오·구글 다중 소셜 인증과 Dual Token 세션 관리, 표준 응답·예외 처리 체계를 처음부터 설계한 백엔드 코어",
      role: "백엔드 초기 아키텍처 수립 및 코어 기능 개발",
      highlights: [
        "소셜 로그인 리다이렉트 시 Access Token 노출 위험을 HttpOnly 쿠키와 1회용 인가 코드로 차단",
        "Redis 기반 Refresh Token 관리와 로그아웃·탈퇴 시 즉시 토큰 블랙리스트 무효화",
        "ApiResponse<T> 제네릭 레코드와 @RestControllerAdvice 전역 예외 처리 패키지 설계",
        "Docker Compose 기반 로컬 DB/Redis 구성과 Swagger API 스키마 사전 배포"
      ],
      links: [
        { label: "상세 분석 보기", url: "projects/musereview.html" },
        { label: "My Backend Repo", url: "https://github.com/kimyw1018/BE" },
        { label: "MuseReview Org", url: "https://github.com/Musereview/BE" }
      ],
      featured: true
    },
    {
      id: "ttorang",
      title: "또랑 (TTORANG)",
      subtitle: "발표 자료·대본·영상 익명 피드백 웹 플랫폼",
      award: "UMC 9기 데모데이 최우수상",
      period: "2025.12 ~ 2026.02",
      category: "frontend",
      categoryName: "Web Frontend Architecture",
      detailPage: "projects/ttorang.html",
      image: "projects/img/또랑.png",
      tags: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "TanStack Query v5", "hls.js", "MediaRecorder"],
      summary: "브라우저 부하를 분리한 녹화 아키텍처와 1MB 청크 업로드 파이프라인, 비디오-슬라이드 동기화 엔진 개발",
      role: "웹 프론트엔드 핵심 미디어 파이프라인 개발",
      highlights: [
        "Canvas 합성 방식의 메모리 폭증 문제를 웹캠 단독 캡처 + 슬라이드 타임스탬프 분리 구조로 전환해 크래시 제거",
        "대용량 비디오 네트워크 타임아웃을 해결하는 3단계 1MB 청크 순차 업로드 파이프라인 구축",
        "Zustand 단일 스토어로 비디오 시간, 슬라이드, 대본, 댓글 간 밀리초 단위 동기화",
        "hls.js 기반 스트리밍 재생 최적화 및 DTO 스키마 엄격 타이핑"
      ],
      links: [
        { label: "상세 분석 보기", url: "projects/ttorang.html" },
        { label: "Frontend GitHub", url: "https://github.com/TTORANG/Web" }
      ],
      featured: true
    }
  ],

  // 6. 기타 프로젝트 (5개)
  otherProjects: [
    {
      id: "ssurent",
      title: "SSURENT",
      subtitle: "26-1학기 캡스톤 디자인 합격 프로젝트",
      period: "2026.02 ~ 2026.03",
      category: "web",
      detailPage: "projects/ssurent.html",
      url: "https://github.com/kimyw1018",
      tags: ["Web", "캡스톤 디자인", "요구사항 분석", "최종 보고서"],
      summary: "숭실대 2026학년도 1학기 캡스톤 디자인 심사를 통과한 웹 서비스 기획. 요구사항 분석부터 발표 자료, 최종 보고서, 포스터까지 단독 작성",
      deliverables: ["발표 자료", "최종 보고서", "포스터"],
      highlights: [
        "캡스톤 디자인 심사 합격 및 서비스 전체 기획, 도메인 분석 담당",
        "최종 보고서와 발표 자료, 학술 포스터를 문서 형태로 정리해 심사 제출"
      ]
    },
    {
      id: "book-calendar",
      title: "독서 기록 관리 앱 (Book Log)",
      subtitle: "캘린더 기반 독서 습관 형성 Android 애플리케이션",
      period: "2025 ~ 2026",
      category: "android",
      detailPage: "projects/booklog.html",
      url: "https://github.com/kimyw1018",
      tags: ["Android (Java)", "Firebase", "MaterialCalendarView", "알라딘 Open API", "Retrofit"],
      summary: "읽은 책의 페이지, 별점, 감상평을 캘린더에 기록해 독서 습관을 시각적으로 관리하는 Android 네이티브 앱",
      highlights: [
        "Decorator 패턴으로 주말, 오늘, 독서 기록일을 캘린더에서 시각적으로 구분",
        "HashSet 자료구조로 기록 날짜 조회를 O(1)로 처리해 기록이 쌓여도 스크롤 유지",
        "RecordContainerFragment 기반 계층적 Fragment 구조와 Parcelable 타입 안전 데이터 전달",
        "Firebase 이중 컬렉션(books/records) 분리와 Map 캐싱으로 비동기 조인 비용 절감",
        "Firebase 문자열 날짜와 MaterialCalendarView CalendarDay 간 타입 불일치를 변환 함수로 정리"
      ]
    },
    {
      id: "travel-skyscanner",
      title: "여행 플래너 & Skyscanner 항공권 위젯",
      subtitle: "실시간 성수기 조회 및 위젯 자동 반응형 웹",
      period: "2025 ~ 2026",
      category: "web",
      detailPage: "projects/travel.html",
      url: "https://github.com/kimyw1018",
      tags: ["JavaScript", "ResizeObserver", "Skyscanner Widget API", "Bootstrap"],
      summary: "여행지별 성수기 정보 조회와 Skyscanner 항공권 검색 위젯을 결합하고, 위젯 높이 변화에 실시간으로 반응하는 배경 시스템 구현",
      highlights: [
        "ResizeObserver API로 위젯 높이 변화를 50ms 이내에 감지해 배경 레이아웃 자동 조정",
        "외부 스크립트 중복 로드 방지 구조로 초기 로드 2.3초, 60fps 유지",
        "ResizeObserver 미지원 구형 브라우저를 위한 폴링 폴백 전략 구현",
        "정규식 기반 위치 문자열 파싱으로 IATA 공항 코드 추출"
      ]
    },
    {
      id: "parent-rest",
      title: "부모쉼터 (마음건강 도우미)",
      subtitle: "마음건강 자가진단 및 인터랙티브 웹 서비스",
      period: "2025.11",
      category: "web",
      detailPage: "projects/parentrest.html",
      url: "https://github.com/kimyw1018",
      tags: ["React", "TypeScript", "Tailwind CSS", "Skeleton UI"],
      summary: "양육자를 위한 마음건강 자가진단 웹 플랫폼. 문항별 전환 애니메이션과 진단 결과에 따른 동적 피드백 구현",
      highlights: [
        "React 상태 관리와 CSS Transition을 결합한 문항 전환 애니메이션",
        "진단 레벨에 따른 색상과 아이콘 동적 렌더링",
        "스켈레톤 UI 도입으로 비동기 로딩 중 레이아웃 시프트 방지",
        "단일 파일 구조를 기능별 컴포넌트로 리팩토링하고 TypeScript 타입 정의 적용"
      ]
    },
    {
      id: "coupang-scheduler",
      title: "쿠팡 WING 쿠폰 자동 갱신 스케줄러",
      subtitle: "당일 즉시할인 쿠폰 자동 갱신 및 장애 모니터링",
      period: "2025",
      category: "backend",
      detailPage: "projects/coupang.html",
      url: "https://github.com/kimyw1018",
      tags: ["TypeScript", "Node.js", "Axios", "HMAC-SHA256", "Discord Webhook"],
      summary: "쿠팡 WING Open API 기반으로 당일 즉시할인 쿠폰을 자동 갱신하고, 실패 지점을 실시간으로 알리는 서버 사이드 스케줄러",
      highlights: [
        "Node.js 내장 crypto 모듈로 쿠팡 WING API 규격 HMAC-SHA256 서명 자체 생성",
        "조회, 폐기, 신규 발행 3단계 롤오버 배치 파이프라인 구현",
        "개별 쿠폰 실패가 전체 배치를 막지 않도록 예외 격리 및 실패 항목 로깅",
        "환경변수, 목록 API 캐시, 단일 API 순서의 다중 계약 ID 폴백 전략",
        "Discord Webhook으로 장애 위치와 에러 스택을 즉시 전송, dotenv Fail-Fast 검증"
      ]
    },
    {
      id: "honja",
      title: "혼저옵서예 (Honja)",
      subtitle: "동행 유형별 제주 올레길 여행 플래너 (Expo)",
      period: "2026.07 ~ 2026.08",
      category: "frontend",
      detailPage: "projects/honja.html",
      url: "https://github.com/SSU24f5/honja-front",
      tags: ["Expo", "React Native", "TypeScript", "Zustand", "TanStack Query", "Jest"],
      summary: "제주 올레길과 여행지를 혼자·가족·배리어프리·반려동물 등 동행 유형별로 탐색하고 일정을 짜서 초대할 수 있는 Expo 기반 여행 플래너 앱의 프론트엔드 개발",
      highlights: [
        "백엔드 명세 변경 중에도 개발이 끊기지 않도록 모든 API 함수에 Mock Data Fallback 자동 전환 구현",
        "Feature-Sliced Design을 팀 규모 대비 과도한 추상화로 판단해 화면 중심 구조로 전면 재구조화",
        "Platform.OS 분기로 웹은 iframe, 네이티브는 WebView를 쓰는 크로스플랫폼 지도 렌더링 구현",
        "백엔드 필드명 변경 시 @deprecated 공존 전략으로 여행 초대 DTO의 하위 호환성 유지",
        "Zustand 스토어 4종에 단위 테스트 19개(299줄) 작성, 컴포넌트 렌더링 없이 상태 전이 검증"
      ]
    }
  ],

  // 7. 활동 이력
  experiences: [
    {
      period: "2026.05 ~ 2026.12",
      title: "구암고등학교 웹 개발 동아리 자문",
      organization: "구암고등학교",
      role: "자문위원 / 멘토",
      description: "고교 개발 동아리 학생 대상 웹 프로그래밍 멘토링과 프로젝트 아키텍처 코드 리뷰 진행"
    },
    {
      period: "2026.03 ~ 현재",
      title: "UMC (Makeus Challenge) 10기",
      organization: "대학생 연합 IT 벤처 창업 동아리",
      role: "Spring 파트",
      description: "Spring Boot 백엔드 심화 과정 수료 및 데모데이 우수상 프로젝트(뮤즈리뷰) 백엔드 코어 개발"
    },
    {
      period: "2025.09 ~ 2026.02",
      title: "UMC (Makeus Challenge) 9기",
      organization: "대학생 연합 IT 벤처 창업 동아리",
      role: "Web 파트",
      description: "React/TypeScript 프론트엔드 과정 수료 및 데모데이 최우수상 프로젝트(또랑) 웹 클라이언트 개발"
    },
    {
      period: "2025.01 ~ 2025.12",
      title: "숭실대학교 컴퓨터학부 제29대 학생회",
      organization: "숭실대학교 컴퓨터학부",
      role: "기획국",
      description: "학부 학술제와 해커톤 기획, 재학생 편의 프로그램 및 제휴 연계 프로젝트 운영"
    },
    {
      period: "2024.03 ~ 2024.12",
      title: "숭실대학교 컴퓨터학부 제28대 학생회",
      organization: "숭실대학교 컴퓨터학부",
      role: "복지국",
      description: "학부생 복지 사업 기획 및 대학 상권 제휴 프로그램 관리"
    }
  ]
};
