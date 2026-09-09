/**
 * ==============================================================================
 * 포트폴리오 데이터 관리 파일 (data.js)
 * ==============================================================================
 */

const PORTFOLIO_DATA = {
  // 1. 기본 프로필 정보
  profile: {
    name: "김예원",
    englishName: "Kim Yewon",
    githubUsername: "kimyw1018",
    role: "Backend & Fullstack Developer",
    affiliation: "숭실대학교 컴퓨터학부 (3학년 2학기 재학 중)",
    statusBadge: "🚀 프로젝트 협업 및 학습 진행 중",
    phone: "010-6555-6343",
    email: "poppppp00@gmail.com",
    github: "https://github.com/kimyw1018",
    avatar: "https://github.com/kimyw1018.png",
    
    tagline: "안정적인 백엔드 시스템과 유기적인 서비스 경험을 설계하는 개발자 김예원입니다.",
    
    bio: [
      "Spring Boot, Java를 주축으로 견고한 백엔드 아키텍처와 분산 인프라(K3s, GitOps)를 구축하고 최적화하는 데 깊은 열정을 가지고 있습니다.",
      "React, TypeScript 기반의 고도화된 웹 프론트엔드와 Android(Kotlin) 네이티브 클라이언트를 모두 직접 구현해보며, 클라이언트-서버 간 데이터 흐름과 트러블슈팅에 정통합니다.",
      "기술적 한계에 부딪혔을 때 타협하지 않고 아키텍처를 과감히 피벗하여 최적의 솔루션을 도출해냅니다."
    ]
  },

  // 2. 학력 정보
  education: [
    {
      period: "2024.03 ~ 재학 중",
      institution: "숭실대학교 (Soongsil University)",
      major: "IT대학 컴퓨터학부 (3학년 2학기 재학 중)",
      description: "컴퓨터공학 전공 / 2026 숭실대 컴퓨터학부 SW공모전 총장상 수상 / 제28·29대 학생회 활동"
    },
    {
      period: "2021.03 ~ 2024.02",
      institution: "판곡고등학교",
      major: "자연계열 졸업",
      description: "기초 프로그래밍 및 공학적 사고 훈련"
    }
  ],

  // 3. 기술 스택
  skills: {
    "Backend & Database": [
      { name: "Java", level: "Advanced", icon: "devicon-java-plain colored" },
      { name: "Spring Boot", level: "Advanced", icon: "devicon-spring-plain colored" },
      { name: "MySQL / MariaDB", level: "Advanced", icon: "devicon-mysql-plain colored" },
      { name: "PostgreSQL & PostGIS", level: "Intermediate", icon: "devicon-postgresql-plain colored" },
      { name: "Redis", level: "Intermediate", icon: "devicon-redis-plain colored" },
      { name: "Spring Data JPA / Hibernate", level: "Advanced", icon: "devicon-spring-plain colored" }
    ],
    "Web & Frontend": [
      { name: "React (18 / 19)", level: "Advanced", icon: "devicon-react-original colored" },
      { name: "TypeScript", level: "Advanced", icon: "devicon-typescript-plain colored" },
      { name: "Vite / Bun", level: "Intermediate", icon: "devicon-vitejs-plain colored" },
      { name: "Tailwind CSS", level: "Advanced", icon: "devicon-tailwindcss-plain colored" },
      { name: "Zustand & TanStack Query", level: "Advanced", icon: "devicon-react-original" },
      { name: "LiveKit WebRTC", level: "Intermediate", icon: "" }
    ],
    "Mobile": [
      { name: "Android (Kotlin)", level: "Advanced", icon: "devicon-android-plain colored" },
      { name: "React Native", level: "Intermediate", icon: "devicon-react-original colored" },
      { name: "Hilt & Coroutines / Flow", level: "Advanced", icon: "devicon-kotlin-plain colored" }
    ],
    "DevOps & Infrastructure": [
      { name: "Git & GitHub", level: "Advanced", icon: "devicon-git-plain colored" },
      { name: "GitHub Actions", level: "Advanced", icon: "devicon-githubactions-plain colored" },
      { name: "Docker", level: "Intermediate", icon: "devicon-docker-plain colored" },
      { name: "K3s & ArgoCD (GitOps)", level: "Intermediate", icon: "devicon-kubernetes-plain colored" },
      { name: "AWS (S3 / EC2)", level: "Intermediate", icon: "devicon-amazonwebservices-plain-wordmark colored" }
    ]
  },

  // 4. 수상 내역 (Awards & Honors)
  awards: [
    {
      date: "2026.08.26",
      title: "2026 UNITHON 우수상",
      project: "나루 (Naru)",
      organization: "UNITHON",
      badge: "우수상",
      description: "온디바이스 실시간 수어-음성 양방향 통화 웹 서비스 기획 및 개발"
    },
    {
      date: "2026.08.21",
      title: "UMC 10기 데모데이 우수상",
      project: "뮤즈리뷰 (MuseReview)",
      organization: "Makeus Challenge (UMC)",
      badge: "우수상",
      description: "악기 연주 피드백 플랫폼 백엔드 코어 아키텍처 및 OAuth2/Redis 구축"
    },
    {
      date: "2026.08.04",
      title: "2026 숭실대학교 컴퓨터학부 소프트웨어공모전 총장상",
      project: "A:SSU (어슈)",
      organization: "숭실대학교",
      badge: "총장상 🏆",
      description: "대학-매장 제휴 관리 플랫폼 풀스택 개발 (Spring Boot GIS/통계 + Android 클라이언트)"
    },
    {
      date: "2026.02.20",
      title: "UMC 9기 데모데이 최우수상",
      project: "또랑 (TTORANG)",
      organization: "Makeus Challenge (UMC)",
      badge: "최우수상 🥇",
      description: "발표 피드백 플랫폼 분리 녹화 & 1MB 청크 업로드 프론트엔드 파이프라인 개발"
    }
  ],

  // 5. 주요 프로젝트 목록
  projects: [
    {
      id: "naru",
      title: "Naru (나루)",
      subtitle: "실시간 양방향 수어-음성 통화 웹 서비스",
      award: "2026 UNITHON 우수상",
      period: "2026.08 ~ 2026.09",
      category: "web",
      categoryName: "AI / WebRTC / Frontend",
      detailPage: "projects/naru.html",
      tags: ["React 19", "TypeScript", "Vite 8", "MediaPipe", "DTW Engine", "LiveKit WebRTC", "Zustand", "Tailwind CSS v4", "Cloudflare Pages"],
      summary: "일반 웹캠과 모바일 브라우저만으로 30fps 온디바이스 실시간 수어 인식 및 양방향 통화를 지원하는 배리어프리 커뮤니케이션 웹 서비스",
      role: "프론트엔드 & 실시간 AI 파이프라인 전담",
      highlights: [
        "MediaPipe + 3D 신체 상대적 정규화 및 경량 DTW 알고리즘 기반 100% 브라우저 온디바이스 30fps 수어 인식 구현",
        "발화 종료 제스처 감지 버퍼 및 직전 12턴 대화 히스토리 반영 LLM 구어체 문장 변환",
        "2초 주기 10초 케이던스 바(Cadence Bar) UI를 통한 사용자 맞춤형 수어 단어 온디바이스 고속 등록·캐싱",
        "LiveKit WebRTC 기반 화상 통화 상태 머신과 iOS 햅틱(ios-haptics) 및 Web Audio API DTMF 다이얼 톤 구현"
      ],
      links: [
        { label: "상세 페이지", url: "projects/naru.html" }
      ],
      featured: true
    },
    {
      id: "assu",
      title: "A:SSU (어슈)",
      subtitle: "대학-매장 제휴 관리 및 실시간 통계 플랫폼",
      award: "2026 숭실대 SW공모전 총장상 🏆",
      period: "2025.03 ~ 진행 중",
      category: "backend",
      categoryName: "Fullstack (Spring Boot & Android)",
      detailPage: "projects/assu.html",
      tags: ["Java", "Spring Boot", "Android", "Kotlin", "PostgreSQL", "PostGIS", "K3s", "ArgoCD", "Redis", "Hilt"],
      summary: "숭실대학교 주변 제휴 매장 순위 추적 및 관리자 통계 대시보드를 구축하고, Android 네이티브 클라이언트부터 백엔드 GIS/통계 인프라까지 풀스택 개발",
      role: "백엔드 API·GIS·통계 및 Android 대시보드 풀스택 개발",
      highlights: [
        "[Android] Sealed Interface 기반 전수 상태 처리 및 StateFlow 반응형 아키텍처로 런타임 에러 0건 달성",
        "[Android] Coroutines async/await 활용한 3개 API 병렬 호출 최적화 및 MPAndroidChart 커스텀 렌더러 구현",
        "[Spring Boot] PostGIS R-Tree 공간 인덱스 및 WAS 메모리 필터링 분리로 지도 뷰포트 쿼리 성능 극대화 및 N+1 원천 차단",
        "[Infra] K3s + ArgoCD GitOps 파이프라인 구축 및 비관적 락(Pessimistic Lock) 기반 동시성 제어"
      ],
      links: [
        { label: "상세 페이지", url: "projects/assu.html" },
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
      tags: ["Java", "Spring Boot", "OAuth 2.0", "JWT", "Redis", "PostgreSQL", "Flyway", "Docker Compose", "Swagger"],
      summary: "카카오/구글 다중 소셜 인증, Dual Token & Redis 세션/블랙리스트 관리, 표준 ApiResponse 및 전역 예외 처리 체계를 수립한 백엔드 코어",
      role: "백엔드 초기 아키텍처 수립 및 코어 기능 개발",
      highlights: [
        "소셜 로그인 리다이렉트 시 Access Token 평문 노출 위험을 HttpOnly 쿠키와 1회용 코드/POST 방식으로 원천 차단",
        "Redis 인메모리 저장소 기반 Refresh Token 관리 및 로그아웃/탈퇴 시 즉각적인 토큰 블랙리스트 무효화",
        "ApiResponse<T> 제네릭 레코드 및 @RestControllerAdvice 전역 예외 처리(apipayload) 패키지 설계",
        "Docker Compose 기반 로컬 DB/Redis 컨테이너 가상화 및 Swagger API 스키마 사전 배포"
      ],
      links: [
        { label: "상세 페이지", url: "projects/musereview.html" },
        { label: "My Backend Repo", url: "https://github.com/kimyw1018/BE" },
        { label: "MuseReview Org", url: "https://github.com/Musereview/BE" }
      ],
      featured: true
    },
    {
      id: "ttorang",
      title: "또랑 (TTORANG)",
      subtitle: "발표 자료·대본·영상 익명 피드백 웹 플랫폼",
      award: "UMC 9기 데모데이 최우수상 🥇",
      period: "2025.12 ~ 2026.02",
      category: "frontend",
      categoryName: "Web Frontend Architecture",
      detailPage: "projects/ttorang.html",
      tags: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "TanStack Query v5", "hls.js", "MediaRecorder"],
      summary: "브라우저 부하를 격리한 분리 녹화 아키텍처, 1MB 청크 분할 업로드 파이프라인, Zustand 기반 비디오-슬라이드 동기화 엔진 개발",
      role: "웹 프론트엔드 핵심 미디어 파이프라인 개발",
      highlights: [
        "기존 Canvas 합성의 메모리 폭증/크래시 문제를 [웹캠 단독 캡처 + 슬라이드 타임스탬프 JSON 분리] 아키텍처로 전환하여 크래시 0건 달성",
        "대용량 비디오의 네트워크 타임아웃을 극복하는 3-Phase 1MB 청크(Chunk) 순차 업로드 파이프라인 구축",
        "Zustand 단일 상태 저장소(useVideoFeedbackStore)로 비디오 시간-슬라이드-대본-댓글 간 밀리초(ms) 단위 양방향 동기화",
        "hls.js 기반 스트리밍 재생 최적화 및 DTO 스키마 엄격 타이핑"
      ],
      links: [
        { label: "상세 페이지", url: "projects/ttorang.html" },
        { label: "Frontend GitHub", url: "https://github.com/TTORANG/Web" }
      ],
      featured: true
    }
  ],

  // 6. 활동 이력 (Activities & Experience)
  experiences: [
    {
      period: "2026.05 ~ 2026.12",
      title: "구암고등학교 웹 개발 동아리 자문",
      organization: "구암고등학교",
      role: "자문위원 / 멘토",
      description: "고교 개발 동아리 학생 대상 웹 프로그래밍 기초 멘토링, 프로젝트 아키텍처 설계 피드백 및 코드 리뷰 진행"
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
      description: "React/TypeScript 기반 프론트엔드 과정 수료 및 데모데이 최우수상 프로젝트(또랑) 웹 클라이언트 전담 개발"
    },
    {
      period: "2025.01 ~ 2025.12",
      title: "숭실대학교 컴퓨터학부 제29대 학생회",
      organization: "숭실대학교 컴퓨터학부",
      role: "기획국",
      description: "학부 주요 학술제 및 IT 해커톤 기획 총괄, 재학생 편의 프로그램 및 제휴 연계 프로젝트 운영"
    },
    {
      period: "2024.03 ~ 2024.12",
      title: "숭실대학교 컴퓨터학부 제28대 학생회",
      organization: "숭실대학교 컴퓨터학부",
      role: "복지국",
      description: "학부생 편의 복지 사업 기획 및 대학 상권 제휴 프로그램 관리"
    }
  ]
};
