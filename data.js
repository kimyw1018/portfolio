/**
 * ==============================================================================
 * 포트폴리오 데이터 관리 파일 (data.js)
 * ------------------------------------------------------------------------------
 * 포트폴리오 내용(프로필, 기술 스택, 프로젝트, 활동 이력 등)을 수정하고 싶을 때
 * 이 파일의 내용만 변경하면 화면에 자동으로 반영됩니다!
 * ==============================================================================
 */

const PORTFOLIO_DATA = {
  // 1. 기본 프로필 정보
  profile: {
    name: "김예원",
    englishName: "Kim Yewon",
    githubUsername: "kimyw1018",
    role: "Backend & Fullstack Developer",
    affiliation: "숭실대학교 컴퓨터학부 24학번",
    statusBadge: "🚀 프로젝트 협업 및 학습 진행 중",
    email: "poppppp00@gmail.com",
    github: "https://github.com/kimyw1018",
    avatar: "https://github.com/kimyw1018.png",
    
    // 메인 한 줄 슬로건
    tagline: "안정적인 백엔드 시스템과 유기적인 서비스 경험을 설계하는 개발자 김예원입니다.",
    
    // 자기소개 문단
    bio: [
      "Spring Boot와 Java를 기반으로 안정적이고 확장 가능한 백엔드 시스템을 구축하는 데 집중하고 있습니다.",
      "React, TypeScript 기반의 프론트엔드와 Android(Kotlin) 앱 개발 경험을 갖추고 있어 클라이언트와의 유기적인 API 설계 및 협업에 강점이 있습니다.",
      "새로운 기술 스택을 두려움 없이 탐구하며, 팀원들과의 열린 소통과 꾸준한 문제 해결을 통해 성장하고 있습니다."
    ]
  },

  // 2. 학력 정보
  education: [
    {
      period: "2024.03 ~ 재학 중",
      institution: "숭실대학교 (Soongsil Univ.)",
      major: "IT대학 컴퓨터학부 (24학번)",
      description: "컴퓨터공학 전공 / 학생회 및 IT 연합동아리(UMC) 활동"
    },
    {
      period: "2021.03 ~ 2024.02",
      institution: "판곡고등학교",
      major: "자연계열 졸업",
      description: "기초 프로그래밍 및 알고리즘 탐구"
    }
  ],

  // 3. 기술 스택 (카테고리별)
  skills: {
    "Backend & Cloud": [
      { name: "Java", level: "Advanced", icon: "devicon-java-plain colored" },
      { name: "Spring Boot", level: "Advanced", icon: "devicon-spring-plain colored" },
      { name: "PostgreSQL", level: "Intermediate", icon: "devicon-postgresql-plain colored" },
      { name: "MySQL / MariaDB", level: "Intermediate", icon: "devicon-mysql-plain colored" },
      { name: "Redis", level: "Intermediate", icon: "devicon-redis-plain colored" },
      { name: "Docker", level: "Intermediate", icon: "devicon-docker-plain colored" },
      { name: "AWS (S3/EC2)", level: "Intermediate", icon: "devicon-amazonwebservices-plain-wordmark colored" },
      { name: "GitHub Actions", level: "Intermediate", icon: "devicon-githubactions-plain colored" }
    ],
    "Frontend & Mobile": [
      { name: "TypeScript", level: "Intermediate", icon: "devicon-typescript-plain colored" },
      { name: "React", level: "Intermediate", icon: "devicon-react-original colored" },
      { name: "JavaScript", level: "Advanced", icon: "devicon-javascript-plain colored" },
      { name: "Kotlin (Android)", level: "Intermediate", icon: "devicon-kotlin-plain colored" },
      { name: "Tailwind CSS", level: "Intermediate", icon: "devicon-tailwindcss-plain colored" },
      { name: "HTML5 / CSS3", level: "Advanced", icon: "devicon-html5-plain colored" }
    ],
    "Tools & Workflow": [
      { name: "Git & GitHub", level: "Advanced", icon: "devicon-git-plain colored" },
      { name: "Flyway (DB Migration)", level: "Intermediate", icon: "devicon-devicon-plain" },
      { name: "Figma", level: "Intermediate", icon: "devicon-figma-plain colored" },
      { name: "Notion / Slack", level: "Advanced", icon: "devicon-notion-plain colored" }
    ]
  },

  // 4. 프로젝트 목록 (카테고리: backend, frontend, fullstack 등)
  projects: [
    {
      id: "assu",
      title: "A:SSU (아쑤)",
      subtitle: "대학 상권 제휴 관리 & 학생 혜택 연결 플랫폼",
      period: "2025.03 ~ 진행 중",
      category: "backend",
      categoryName: "Backend & Mobile",
      tags: ["Java", "Spring Boot", "Android", "Kotlin", "AWS", "MySQL"],
      summary: "학생회와 제휴 업체 간 인증 및 혜택 조회 과정을 디지털화하여 대학생과 소상공인을 연결하는 플랫폼",
      description: "대학생들이 학교 주변 제휴 혜택을 손쉽게 확인하고 인증받을 수 있도록 하며, 학생회와 제휴 업체의 제휴 관리 효율성을 높이기 위해 개발 중인 서비스입니다.",
      role: "Backend API 개발 & Android 앱 협업",
      highlights: [
        "Spring Boot 기반 RESTful API 설계 및 표준 응답/예외 처리 규격 수립",
        "학생 인증 및 제휴 혜택 유효성 검증 비즈니스 로직 구현",
        "Android(Kotlin) 프론트엔드 팀과의 API 스펙 조율 및 원활한 데이터 연동"
      ],
      links: [
        { label: "Backend Repository", url: "https://github.com/kimyw1018/ASSU_BE" },
        { label: "App Repository", url: "https://github.com/ASSU-dev/ASSU_FE_app" }
      ],
      featured: true
    },
    {
      id: "musereview",
      title: "뮤즈리뷰 (MuseReview)",
      subtitle: "음악/콘텐츠 리뷰 및 AI 분석 연계 플랫폼",
      period: "2026.06 ~ 2026.08",
      category: "backend",
      categoryName: "Backend",
      tags: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Flyway", "AWS S3", "AI 연동"],
      summary: "소셜 인증, Redis 캐싱, Flyway DB 형상관리 및 AI 분석 서버 연계를 갖춘 고성능 백엔드",
      description: "UMC 10기 데모데이 출품 프로젝트로, 안정적인 데이터베이스 설계와 트래픽 부하 분산을 고려한 캐싱 전략, 멀티미디어 업로드 및 AI 분석 비동기 연계를 담당한 백엔드 시스템입니다.",
      role: "Backend 핵심 기능 개발",
      highlights: [
        "카카오 / 구글 OAuth 2.0 소셜 로그인 및 JWT 기반 Access/Refresh Token 인증·인가 체계 구축",
        "Redis를 활용한 Refresh Token 관리 및 잦은 조회 쿼리에 대한 캐시 레이어 적용",
        "Flyway를 도입하여 팀 개발 환경에서의 DB 스키마 형상관리 및 마이그레이션 자동화",
        "AWS S3 이미지 업로드 파이프라인 구축 및 자체 AI 분석 서버와의 인터페이스 연동"
      ],
      links: [
        { label: "My Backend Repo", url: "https://github.com/kimyw1018/BE" },
        { label: "MuseReview Org", url: "https://github.com/Musereview/BE" }
      ],
      featured: true
    },
    {
      id: "ttorang",
      title: "또랑 (TTORANG)",
      subtitle: "웹캠 녹화 & 캔버스 기반 영상 합성 발표 피드백 플랫폼",
      period: "2025.12 ~ 2026.02",
      category: "frontend",
      categoryName: "Frontend",
      tags: ["React", "TypeScript", "Canvas API", "MediaRecorder", "HLS", "Chunk Upload"],
      summary: "웹캠 영상과 발표 슬라이드를 실시간 합성·동기화하고 청크 업로드를 지원하는 웹 플랫폼",
      description: "사용자가 웹 브라우저에서 별도의 프로그램 설치 없이 발표 영상을 녹화하고 슬라이드와 동기화된 피드백을 받을 수 있도록 개발한 React 기반 프론트엔드 프로젝트입니다.",
      role: "Frontend 핵심 인터랙션 개발",
      highlights: [
        "Webcam & Canvas API를 활용한 실시간 영상 합성 및 슬라이드 화면 전환 동기화 기능 구현",
        "MediaRecorder API와 청크(Chunk) 분할 업로드 방식을 도입하여 대용량 녹화 데이터의 전송 안정성 확보",
        "HLS(HTTP Live Streaming) 스트리밍 뷰어 및 타임라인 기반 피드백 인터페이스 구축"
      ],
      links: [
        { label: "Frontend Repository", url: "https://github.com/TTORANG/Web" }
      ],
      featured: true
    }
  ],

  // 5. 대내외 활동 & 이력
  experiences: [
    {
      period: "2026.05 ~ 2026.12",
      title: "구암고등학교 개발 동아리 자문",
      organization: "구암고등학교",
      role: "멘토 / 자문위원",
      description: "고교 개발 동아리 학생 대상 프로그래밍 기초 멘토링, 웹 개발 기술 가이드 및 프로젝트 설계 피드백 제공"
    },
    {
      period: "2026.03 ~ 현재",
      title: "UMC (Makeus Challenge) 10기",
      organization: "대학생 연합 IT 벤처 창업 동아리",
      role: "Spring Boot 파트",
      description: "Spring Boot 백엔드 심화 스터디 및 데모데이 팀 프로젝트(뮤즈리뷰) 백엔드 개발 주도"
    },
    {
      period: "2025.09 ~ 2026.02",
      title: "UMC (Makeus Challenge) 9기",
      organization: "대학생 연합 IT 벤처 창업 동아리",
      role: "Web (Frontend) 파트",
      description: "React/TypeScript 기반 프론트엔드 학습 및 크로스 플랫폼 협업 프로젝트(또랑) 웹 클라이언트 완성"
    },
    {
      period: "2025.01 ~ 2025.12",
      title: "숭실대학교 컴퓨터학부 제29대 학생회",
      organization: "숭실대학교 컴퓨터학부",
      role: "기획국원",
      description: "학부 주요 학술제 및 IT 해커톤 기획, 재학생 교류 행사 및 대내외 홍보 총괄"
    },
    {
      period: "2024.03 ~ 2024.12",
      title: "숭실대학교 컴퓨터학부 제28대 학생회",
      organization: "숭실대학교 컴퓨터학부",
      role: "복지국원",
      description: "학부생 편의 복지 사업 기획 및 대학 상권 제휴 프로그램 운영 관리"
    }
  ]
};
