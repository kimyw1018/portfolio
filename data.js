/**
 * ==============================================================================
 * 포트폴리오 데이터 관리 파일 (data.js)
 * ==============================================================================
 */

const PORTFOLIO_DATA = {
  // 1. 기본 프로필 정보
  profile: {
    name: "김예원 (코코)",
    nickname: "코코",
    englishName: "Kim Yewon",
    githubUsername: "kimyw1018",
    role: "Backend & Fullstack Developer",
    affiliation: "숭실대학교 컴퓨터학부 (3학년 2학기 재학 중)",
    phone: "010-6555-6343",
    email: "poppppp00@gmail.com",
    github: "https://github.com/kimyw1018",
    avatar: "https://github.com/kimyw1018.png",
    
    tagline: "안정적인 백엔드 시스템과 유기적인 서비스 경험을 설계하는 개발자 김예원(코코)입니다.",
    
    bio: [
      "Spring Boot, Java를 주축으로 견고한 백엔드 아키텍처와 분산 인프라(K3s, GitOps)를 구축하고 최적화하는 데 깊은 열정을 가지고 있습니다.",
      "React, TypeScript 기반의 고도화된 웹 프론트엔드와 Android(Kotlin) 네이티브 클라이언트를 모두 직접 구현해보며, 클라이언트-서버 간 데이터 흐름과 트러블슈팅에 정통합니다.",
      "기술적 한계에 부딪혔을 때 타협하지 않고 아키텍처를 과감히 피벗하여 최적의 솔루션을 도출해냅니다."
    ]
  },

  // 2. 학력 정보 (숭실대학교 단독)
  education: [
    {
      period: "2024.03 ~ 재학 중",
      institution: "숭실대학교 (Soongsil University)",
      major: "IT대학 컴퓨터학부 (3학년 2학기 재학 중)",
      description: "컴퓨터공학 전공 / 2026 숭실대 컴퓨터학부 SW공모전 총장상 수상 / 제28·29대 학생회 활동"
    }
  ],

  // 3. 기술 스택 (공식 실제 SVG 로고 + 이름 + 숙련도 명도 텍스트)
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

  // 4. 수상 내역 (세로 한 줄 형태, 중복 문구 없이 본질적인 정보만 간결하게 기술)
  awards: [
    {
      date: "2026.08.04",
      badge: "총장상",
      title: "2026 숭실대학교 컴퓨터학부 소프트웨어공모전 총장상",
      project: "A:SSU (어슈)",
      organization: "숭실대학교",
      description: "대학-매장 제휴 관리 플랫폼 풀스택 개발 (Spring Boot GIS/통계 쿼리 최적화 및 Android 네이티브 클라이언트 구현)"
    },
    {
      date: "2026.02.20",
      badge: "최우수상",
      title: "UMC 9기 데모데이 최우수상",
      project: "또랑 (TTORANG)",
      organization: "Makeus Challenge (UMC)",
      description: "발표 피드백 플랫폼 브라우저 부하 격리 분리 녹화 및 1MB 청크 분할 업로드 프론트엔드 파이프라인 개발"
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
      description: "악기 연주 피드백 플랫폼 백엔드 코어 아키텍처 및 OAuth 2.0 / Redis 기반 보안 체계 구축"
    }
  ],

  // 5. 주요 프로젝트 목록 (Featured Case Studies 4개)
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
      summary: "일반 웹캠과 모바일 브라우저만으로 30fps 온디바이스 실시간 수어 인식 및 양방향 통화를 지원하는 배리어프리 커뮤니케이션 웹 서비스",
      role: "프론트엔드 & 실시간 AI 파이프라인 전담",
      highlights: [
        "MediaPipe 3D 랜드마크 추출 및 신체 상대적 정규화 + DTW 알고리즘 기반 온디바이스 30fps 수어 인식 구현",
        "발화 종료 감지 버퍼 및 직전 12턴 대화 히스토리 반영 LLM 구어체 문장 변환",
        "2초 주기 10초 케이던스 바 UI를 통한 사용자 맞춤형 수어 단어 온디바이스 등록",
        "LiveKit WebRTC 기반 화상 통화 및 iOS Safari 햅틱, DTMF 다이얼 톤 구현"
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
      summary: "숭실대학교 주변 제휴 매장 순위 추적 및 관리자 통계 대시보드를 구축하고, Android 네이티브 클라이언트부터 백엔드 GIS/통계 인프라까지 풀스택 개발",
      role: "백엔드 API·GIS·통계 및 Android 대시보드 풀스택 개발",
      highlights: [
        "[Android] Sealed Interface 기반 전수 상태 처리 및 StateFlow 반응형 아키텍처로 런타임 에러 0건 달성",
        "[Android] Kotlin Coroutines async/await를 활용한 3개 API 병렬 호출 최적화 및 MPAndroidChart 커스텀 렌더러 구현",
        "[Spring Boot] PostGIS R-Tree 공간 인덱스 및 WAS 메모리 필터링 분리로 지도 뷰포트 쿼리 성능 극대화 및 N+1 원천 차단",
        "[Infra] K3s + ArgoCD GitOps 파이프라인 구축 및 비관적 락 기반 동시성 제어"
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
      summary: "카카오/구글 다중 소셜 인증, Dual Token & Redis 세션/블랙리스트 관리, 표준 ApiResponse 및 전역 예외 처리 체계를 수립한 백엔드 코어",
      role: "백엔드 초기 아키텍처 수립 및 코어 기능 개발",
      highlights: [
        "소셜 로그인 리다이렉트 시 Access Token 평문 노출 위험을 HttpOnly 쿠키와 1회용 임시 인가 코드/POST 방식으로 원천 차단",
        "Redis 인메모리 저장소 기반 Refresh Token 관리 및 로그아웃/탈퇴 시 즉각적인 토큰 블랙리스트 무효화",
        "ApiResponse<T> 제네릭 레코드 및 @RestControllerAdvice 전역 예외 처리 패키지 설계",
        "Docker Compose 기반 로컬 DB/Redis 컨테이너 가상화 및 Swagger API 스키마 사전 배포"
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
      summary: "브라우저 부하를 격리한 분리 녹화 아키텍처, 1MB 청크 분할 업로드 파이프라인, Zustand 기반 비디오-슬라이드 동기화 엔진 개발",
      role: "웹 프론트엔드 핵심 미디어 파이프라인 개발",
      highlights: [
        "기존 Canvas 합성의 메모리 폭증 문제를 [웹캠 단독 캡처 + 슬라이드 타임스탬프 JSON 분리] 아키텍처로 전환하여 크래시 0건 달성",
        "대용량 비디오의 네트워크 타임아웃을 극복하는 3-Phase 1MB 청크 순차 업로드 파이프라인 구축",
        "Zustand 단일 상태 저장소로 비디오 시간-슬라이드-대본-댓글 간 밀리초 단위 양방향 동기화",
        "hls.js 기반 스트리밍 재생 최적화 및 DTO 스키마 엄격 타이핑"
      ],
      links: [
        { label: "상세 분석 보기", url: "projects/ttorang.html" },
        { label: "Frontend GitHub", url: "https://github.com/TTORANG/Web" }
      ],
      featured: true
    }
  ],

  // 6. 기타 프로젝트 목록 (Other Projects 5개)
  otherProjects: [
    {
      id: "ssurent",
      title: "SSURENT",
      subtitle: "26-1학기 캡스톤 디자인 합격 프로젝트",
      period: "2026.02 ~ 2026.03",
      category: "web",
      detailPage: "projects/ssurent.html",
      url: "https://github.com/kimyw1018",
      tags: ["Web", "캡스톤 디자인", "발표 자료", "최종 보고서", "포스터"],
      summary: "숭실대학교 2026학년도 1학기 캡스톤 디자인 합격 웹 서비스 프로젝트. 전체 개발 기획, 시스템 요구사항 분석, 발표 자료, 최종 보고서 및 포스터 완성.",
      deliverables: ["발표 자료 (영상용.pdf)", "프로젝트 최종 보고서 (SSURENT_최종보고서.pdf)", "SSURENT 포스터 (SSURENT 포스터.pdf)"],
      highlights: [
        "2026-1학기 캡스톤 디자인 합격 및 웹 서비스 종합 기획",
        "최종 보고서 및 발표 영상, 학술 포스터 산출물 제작 완료"
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
      tags: ["Android (Java)", "Firebase", "MaterialCalendarView", "알라딘 Open API", "Retrofit", "Glide", "ThreeTenABP"],
      summary: "읽은 책의 페이지, 별점, 감상평을 간편하게 기록하고 캘린더에 쌓이는 성취감을 통해 꾸준한 독서 습관을 형성하는 Android 네이티브 앱",
      highlights: [
        "Decorator 패턴 활용: WeekdayDecorator, SpecialDayDecorator, BookDateDecorator로 주말/오늘/독서 기록 시각적 구분",
        "성능 최적화: HashSet 자료구조로 날짜 조회를 O(1)에 처리하여 기록 누적 시에도 렉 없는 부드러운 UI 유지",
        "계층적 Fragment 아키텍처: RecordContainerFragment 기반 자식 Fragment 관리 및 타입 안전 데이터(Parcelable) 전달",
        "Firebase 실시간 DB 이중 컬렉션(books & records) 분리 및 Map 캐싱을 통한 비동기 조인·쿼리 최적화",
        "트러블슈팅: Firebase 문자열 vs MaterialCalendarView CalendarDay 간 타입 불일치를 정규화 변환 함수로 동기화"
      ]
    },
    {
      id: "travel-skyscanner",
      title: "여행 플래너 & Skyscanner 항공권 위젯",
      subtitle: "실시간 성/비수기 조회 및 위젯 자동 반응형 웹",
      period: "2025 ~ 2026",
      category: "web",
      detailPage: "projects/travel.html",
      url: "https://github.com/kimyw1018",
      tags: ["JavaScript", "HTML/CSS", "ResizeObserver", "Skyscanner Widget API", "Bootstrap", "Glassmorphism"],
      summary: "실시간 여행지별 성/비수기 정보 조회와 Skyscanner 항공권 검색 위젯을 유기적으로 통합하고, 위젯 높이 변화에 50ms 이내로 실시간 반응하는 동적 배경 시스템 구현",
      highlights: [
        "ResizeObserver API 기반 동적 배경 크기 자동 조정 시스템 구축 (위젯 높이 변화 감지 속도 50ms)",
        "외부 스크립트 중복 로드 방지 및 메모리 누수 원천 차단 (초기 로드 2.3초, 60fps 유지)",
        "구형 브라우저(IE 11 포함) 호환성을 위한 Polling Fallback 전략 구현",
        "정규식 기반 위치 문자열에서 IATA 공항 코드 안전 추출 및 Glassmorphism UI 스타일링"
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
      tags: ["React", "TypeScript", "Tailwind CSS", "CSS Keyframes", "Skeleton UI", "Animation"],
      summary: "부모 및 양육자를 위한 마음건강 자가진단 및 도우미 웹 플랫폼. 문항별 페이드 인/아웃 전환, 동적 피드백 애니메이션 및 스켈레톤 로딩 인터랙션 구현",
      highlights: [
        "CSS Transitions & React 상태 관리 결합: 문항 선택 시 자연스러운 슬라이드 및 페이드 인/아웃 전환 애니메이션",
        "진단 레벨에 따른 동적 색상/아이콘 피드백 결과 화면 및 북마크 클릭 시 하트 바운스 효과",
        "스켈레톤 UI를 도입하여 비동기 데이터 로딩 중 체감 대기 시간 감소",
        "트러블슈팅: 단일 파일 구조를 기능별/페이지별 컴포넌트로 모듈화하고 TypeScript Props/State 엄격 타이핑 적용"
      ]
    },
    {
      id: "coupang-scheduler",
      title: "쿠팡 WING 쿠폰 자동 갱신 스케줄러",
      subtitle: "당일 즉시할인 쿠폰 자동 갱신 & 실시간 장애 모니터링",
      period: "2025",
      category: "backend",
      detailPage: "projects/coupang.html",
      url: "https://github.com/kimyw1018",
      tags: ["TypeScript (v5.5+)", "Node.js (v20+)", "Axios", "Crypto (HMAC-SHA256)", "Discord Webhook", "Scheduler"],
      summary: "쿠팡 WING Open API 기반 당일 즉시할인 쿠폰 자동 롤오버 및 무중단 장애 모니터링을 수행하는 TypeScript 서버 사이드 백엔드 스케줄러",
      highlights: [
        "Node.js 내장 crypto 모듈을 활용한 쿠팡 WING API 규격 HMAC-SHA256 서명 자동 생성",
        "3단계 쿠폰 라이프사이클 롤오버 배치 파이프라인 (조회 -> 루프 폐기 -> 신규 KST 발행)",
        "장애 격리: 개별 쿠폰 실패 시에도 전체 배치가 중단되지 않는 예외 격리 및 실패 항목 선별 로깅",
        "다중 레이어 계약 ID 폴백 전략 (환경변수 -> 목록 API 캐시 -> 단일 API 폴백)",
        "Discord Webhook 실시간 모니터링: 장애 발생 위치/에러 스택 트레이스를 Embed 카드로 전송 및 dotenv Fail-Fast 검증"
      ]
    }
  ],

  // 7. 활동 이력 (Activities & Experience)
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
