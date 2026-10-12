/**
 * 자동 생성: portfolio-out/musereview/Muse Review.json 의 원문 JSON을 그대로 옮긴 REPORT_DATA.
 * openQuestions / interviewQuestions 는 같은 프로젝트의 .md 10/11장 원문을
 * 별도로 채워 넣는다 (json에는 없는 필드).
 */
const REPORT_DATA = {
  "title": "Muse Review",
  "period": "커밋 기준 2026-06-30 ~ 2026-08-13 (본인 활동), 레포 전체 기간 2026-06-29 ~ 2026-09-20(확인 시점 기준)",
  "role": "백엔드 개발자 (인증/인가 도메인 담당)",
  "summary": "악기 연주 녹음을 AI로 분석해 리포트와 학습 커리큘럼을 제공하는 서비스의 Spring Boot 백엔드로, 소셜 로그인/JWT 인증/인가와 회원 탈퇴 데이터 정합성을 담당했습니다.",
  "keyResults": [
    {
      "value": "커밋 206건",
      "label": "본인 작성 커밋 수 (전체 951건 중)",
      "condition": "git log --all --author=\"poppppp00@gmail.com|164151329+kimyw1018\" 기준, kimyw1018/김예원(noreply) 두 identity 합산"
    },
    {
      "value": "7건",
      "label": "회원 탈퇴 FK 제약 위반(hotfix/#114) 해결 커밋",
      "condition": "PR #115 (hotfix/#114-withdraw-hard-delete), 17개 이상 리포지토리에 벌크 삭제 메서드 추가 및 삭제 순서 재배치"
    },
    {
      "value": "@Test 447건 / 63개 파일",
      "label": "저장소 전체 테스트 규모",
      "condition": "2026-09-29 작업 트리 기준 grep -ro '@Test' src/test 집계, 본인 담당 영역(auth/security)에 8개 테스트 파일 포함"
    }
  ],
  "overview": {
    "background": "README 및 docker-compose.yml의 analysis 서비스(별도 Python 레포 ANALYSIS) 구성으로 미루어, 사용자가 악기 연주를 녹음하면 AI가 분석해 리포트·약점 노트·학습 커리큘럼을 제공하는 음악 교육 서비스로 추정됩니다. 정확한 서비스 소개 문구는 README에 명시되어 있지 않아 확인이 필요합니다.",
    "problem": "무상태 JWT 인증 위에서 동시 요청 상황의 데이터 정합성(동시 소셜 로그인 유니크 제약 위반 #64, 동시 토큰 재발급 경쟁 상태 #42, 회원 탈퇴 시 자식 엔티티 삭제 순서로 인한 참조 무결성 위반 #114)과, 온보딩 미완료 상태라는 중간 상태를 인가 계층에서 HTTP Method 단위까지 세밀하게 표현해야 했던 문제(#144)를 다뤘습니다.",
    "scope": [
      "src/main/java/com/mr/domain/auth/** — 소셜 로그인(카카오/구글), JWT 발급/재발급, 계정 연동, 로그아웃, 회원 탈퇴 (AuthService 45커밋, AuthController 31커밋, OAuthClientService 30커밋)",
      "src/main/java/com/mr/global/security/** — Spring Security 설정, JWT 필터/토큰 프로바이더, ROLE 기반 인가 (SecurityConfig 15커밋, JwtTokenProvider 9커밋)",
      "src/main/java/com/mr/domain/user/entity/UsageLimit.java, UsageLimitRepository.java — 사용량 제한 기능 (이후 이슈 #200/#230/#231에서 전량 삭제)",
      "MR_config/local/application.example.yml — 로컬 개발 환경 설정 템플릿"
    ],
    "collaboration": [
      "브랜치 전략: Git Flow (main/develop/기능 브랜치, Prefix/#이슈번호-작업내용 네이밍) — README.md 및 실제 커밋 로그로 확인",
      "커밋 컨벤션: '타입: 작업 내용 (#이슈번호)' 형식 일관 적용",
      "코드 리뷰: README에 최소 2명 이상 Approve, P1/P2/P3 리뷰 태그 가이드 명시 (실제 리뷰 코멘트 상세는 gh CLI 미인증으로 이번 조사에서 확인하지 못함)",
      "LearningServiceConcurrencyTest 클래스 주석에 '은우님 PR 리뷰 지적(#79) 검증용 통합 테스트'라는 문구가 있어, 리뷰 지적이 후속 테스트로 이어지는 협업 흐름 확인 (해당 파일 자체는 본인 작성 아님)",
      "API 문서는 Swagger(springdoc-openapi) 애너테이션으로 코드 내 관리, AuthController에 응답 예시 JSON까지 상세 기술",
      "OAuthTempCodeStore(Redis 기반 임시 코드 저장소)는 본인이 만든 인메모리 ConcurrentHashMap 버전(#64)을 팀원(ownue)이 이후 Redis 기반으로 교체한 것으로 추정 — 팀원과의 순차적 리팩터링 협업 사례"
    ]
  },
  "stack": [
    {
      "category": "언어/프레임워크",
      "items": [
        { "name": "Java 17 (toolchain)", "reason": null },
        { "name": "Spring Boot 3.2.2", "reason": null },
        { "name": "Spring JavaFormat Plugin 0.0.41 (빌드 시 포맷 강제)", "reason": null }
      ]
    },
    {
      "category": "인증/보안",
      "items": [
        { "name": "Spring Security", "reason": null },
        { "name": "jjwt 0.11.5 (JWT)", "reason": null },
        { "name": "Spring Data Redis (임시 코드/토큰 저장)", "reason": null }
      ]
    },
    {
      "category": "데이터",
      "items": [
        { "name": "Spring Data JPA", "reason": null },
        { "name": "Flyway Core (V1~V8 마이그레이션)", "reason": null },
        { "name": "PostgreSQL 18 (README/로컬 기준, CI는 16)", "reason": null }
      ]
    },
    {
      "category": "비동기/외부연동",
      "items": [
        { "name": "Spring Retry + Spring AOP (알림 저장 재시도용)", "reason": "build.gradle 주석: 알림 저장 실패 재시도용" },
        { "name": "AWS SDK v2 (S3, bom 2.25.60)", "reason": null },
        { "name": "springdoc-openapi-starter-webmvc-ui 2.3.0", "reason": null },
        { "name": "Spring Boot Actuator", "reason": null }
      ]
    },
    {
      "category": "인프라/배포",
      "items": [
        { "name": "Docker (eclipse-temurin:17-jre-jammy, non-root 실행)", "reason": null },
        { "name": "docker-compose (backend + redis + analysis 3서비스)", "reason": null },
        { "name": "GitHub Actions CI/CD (EC2 SSH 배포, 배포 시에만 보안그룹 SSH 임시 허용)", "reason": null }
      ]
    }
  ],
  "design": {
    "architecture": "com.mr.domain.*(도메인별 수직 분할, 13개 도메인) + com.mr.global.*(공통 인프라) 구조. 각 도메인은 controller/service/repository/entity/dto/exception 계층 패턴을 반복합니다. 본인이 작성한 소셜 로그인 흐름은 AuthController(웹 리다이렉트 시작/콜백) → AuthService(읽기 전용 트랜잭션 기본, 쓰기 시 Propagation.NOT_SUPPORTED로 트랜잭션 분리) → OAuthClientService(외부 카카오/구글 API) → AuthTransactionService(@Transactional 실제 쓰기 담당) → SocialAuthRepository/UserRepository 순으로 흐릅니다. 인증이 필요한 요청은 JwtAuthenticationFilter가 SecurityContext를 채우고 SecurityConfig가 URL/HTTP Method 단위로 ROLE을 검사합니다.",
    "dataModel": "Flyway 마이그레이션 8건(V1~V8)이 존재하며 소셜 인증 제약 정규화, 레거시 MIDI 데이터 정규화, 파일 URL의 S3 objectKey 전환, 타임존 컬럼 수정 등을 다룹니다. 본인이 작성한 SocialAuth 엔티티는 (social_type, social_id)와 (user_id, social_type) 두 복합 유니크 제약, refresh_token_hash 컬럼 유니크 제약으로 동시성/중복 문제를 DB 레벨에서 방지하고, 정적 팩토리(create)에서 유효성 검증 후에만 생성 가능하도록 설계되어 있습니다.",
    "api": "공통 응답 포맷 ApiResponse<T>{isSuccess, code, message, data}로 통일, 에러 코드는 {도메인}_{HTTP상태}_{순번}(예: AUTH_400_01) 컨벤션을 따릅니다. GlobalExceptionHandler(@RestControllerAdvice)가 도메인 예외/검증 실패/파싱 실패 등을 모두 동일 포맷으로 변환합니다. 본인이 작성한 auth 도메인은 8개 엔드포인트(소셜 로그인 시작/콜백, 토큰 교환, Access Token 직접 로그인, 재발급, 계정 연동, 로그아웃, 탈퇴)로 구성됩니다.",
    "infra": "Docker 이미지를 non-root 유저로 실행하며, GitHub Actions CD가 main push 시 Docker Hub에 이미지를 푸시하고 EC2에 SSH로 배포합니다. 배포 시에만 GitHub Actions 러너의 공인 IP를 EC2 보안그룹에 임시로 SSH 허용하고 완료 후 회수하는 방식으로 상시 SSH 노출을 피합니다. 민감정보(.env, MR_config/local/application.yml)는 모두 .gitignore 대상으로 git 이력에 커밋된 적이 없습니다.",
    "tree": "BE/\n├── src/main/java/com/mr/\n│   ├── domain/\n│   │   ├── auth/              # [본인 담당] 소셜 로그인, JWT, 계정 연동/탈퇴\n│   │   ├── analysis/          # 연주 분석 리포트/이벤트/스케줄러 (타인 담당)\n│   │   ├── backingtrack/      # 백킹트랙/코드 진행 (타인 담당)\n│   │   ├── learning/          # 학습 커리큘럼 (타인 담당)\n│   │   ├── mentor/            # AI 멘토 채팅 (타인 담당)\n│   │   ├── user/              # 유저/학생 프로필, UsageLimit(본인 작성, 이후 삭제)\n│   │   └── ...(history, home, notification, playing, statistics, subscriptions, weakness)\n│   └── global/\n│       ├── security/          # [본인 담당] SecurityConfig, JWT 필터/프로바이더\n│       ├── apipayload/        # 공통 응답/에러 포맷 (타인 담당)\n│       ├── client/ai, gemini/ # 외부 AI 연동 (타인 담당)\n│       └── file/s3/           # S3 업로드 (타인 담당)\n├── src/main/resources/db/migration/  # Flyway V1~V8\n├── src/test/                   # 63개 파일, @Test 447건\n├── .github/workflows/          # ci.yml, cd.yml\n├── docker-compose.yml\n└── Dockerfile",
    "diagrams": []
  },
  "features": [
    {
      "name": "JWT 기반 무상태 인증",
      "what": "Access/Refresh Token을 발급하고 매 요청마다 필터에서 검증해 SecurityContext에 인증 정보를 채우는 무상태 인증 체계",
      "how": [
        "JwtTokenProvider가 Base64 인코딩된 시크릿을 HMAC 키로 변환 후 HS256으로 서명",
        "Access(기본 30분)/Refresh(기본 7일) 토큰에 각각 type 클레임(access/refresh)을 넣어 혼용 공격 차단",
        "JwtAuthenticationFilter가 Bearer 헤더를 파싱하고 세분화된 JwtValidationResult(VALID/EXPIRED/INVALID_SIGNATURE 등)로 분기",
        "CustomUserDetailsService가 매 요청 시점의 user.isOnboardingCompleted() 값으로 ROLE_GUEST/ROLE_STUDENT를 동적 부여"
      ],
      "decision": "권한을 JWT 클레임이 아닌 매 요청 DB 조회로 판단하도록 한 이유는 코드에 명시되어 있지 않으나, 온보딩 완료 여부가 즉시 반영되어야 하는 요구사항 때문으로 추정됩니다 (확인 필요).",
      "files": [
        "src/main/java/com/mr/global/security/jwt/JwtTokenProvider.java",
        "src/main/java/com/mr/global/security/jwt/JwtAuthenticationFilter.java",
        "src/main/java/com/mr/global/security/principal/CustomUserDetailsService.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/mr/global/security/jwt/JwtTokenProvider.java",
        "snippet": "private JwtValidationResult validateTokenWithType(String token, String expectedType) {\n    try {\n        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();\n        String tokenType = claims.get(TOKEN_TYPE_CLAIM, String.class);\n        return expectedType.equals(tokenType) ? JwtValidationResult.VALID : JwtValidationResult.INVALID_TYPE;\n    } catch (ExpiredJwtException e) {\n        return JwtValidationResult.EXPIRED;\n    } catch (SignatureException e) {\n        return JwtValidationResult.INVALID_SIGNATURE;\n    } catch (MalformedJwtException e) {\n        return JwtValidationResult.MALFORMED;\n    } catch (UnsupportedJwtException e) {\n        return JwtValidationResult.UNSUPPORTED;\n    } catch (JwtException | IllegalArgumentException e) {\n        return JwtValidationResult.INVALID;\n    }\n}"
      }
    },
    {
      "name": "Refresh Token Rotation과 비관적 락",
      "what": "토큰 재발급 시 기존 토큰을 즉시 무효화하는 RTR과, 동시 재발급 요청에 대한 동시성 제어",
      "how": [
        "SocialAuthRepository.findByRefreshTokenHashWithLock에 @Lock(PESSIMISTIC_WRITE) JPQL 쿼리 정의",
        "AuthService.reissueToken이 락으로 SocialAuth 행을 잠근 뒤 새 토큰 발급 및 해시 갱신",
        "logout에서도 동일 락 쿼리로 무효화 시점의 경쟁 상태 방지"
      ],
      "decision": "낙관적 락(@Version) 등 다른 대안을 검토했는지는 커밋 메시지('동시성 락', cdc38d5)만으로는 확인되지 않습니다 (확인 필요).",
      "files": [
        "src/main/java/com/mr/domain/auth/repository/SocialAuthRepository.java",
        "src/main/java/com/mr/domain/auth/service/AuthService.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/auth/repository/SocialAuthRepository.java",
        "snippet": "@Lock(LockModeType.PESSIMISTIC_WRITE)\n@Query(\"SELECT s FROM SocialAuth s WHERE s.refreshTokenHash = :refreshTokenHash\")\nOptional<SocialAuth> findByRefreshTokenHashWithLock(@Param(\"refreshTokenHash\") String refreshTokenHash);"
      }
    },
    {
      "name": "OAuth 소셜 로그인 (Authorization Code + 임시 교환 코드)",
      "what": "카카오/구글 소셜 로그인을 Authorization Code 방식으로 처리하되, JWT를 리다이렉트 URL에 직접 노출하지 않기 위해 1회성 임시 코드를 한 단계 더 거치는 흐름",
      "how": [
        "AuthController.startOAuthLogin이 CSRF 방지 state를 HttpOnly 쿠키에 저장 후 소셜 인가 URL로 302 리다이렉트",
        "oAuthCallback이 state 검증 후 AuthService.generateTempCodeByCode 호출, 2분 TTL의 tempCode(UUID)만 프론트엔드로 전달",
        "프론트엔드가 POST /api/auth/token/exchange로 tempCode를 실제 JWT로 교환"
      ],
      "decision": "최초(커밋 908f033, 본인)에는 인메모리 ConcurrentHashMap을 임시 저장소로 사용했으나, 다중 인스턴스 스케일아웃 시 실패하는 한계가 있어 현재 코드(OAuthTempCodeStore, 팀원 작성)는 Redis 기반으로 교체되었습니다.",
      "files": [
        "src/main/java/com/mr/domain/auth/controller/AuthController.java",
        "src/main/java/com/mr/domain/auth/service/AuthService.java",
        "src/main/java/com/mr/domain/auth/service/OAuthTempCodeStore.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/auth/controller/AuthController.java",
        "snippet": "try {\n    String tempCode = authService.generateTempCodeByCode(\n            socialType, code, backendOAuthRedirectUri, deviceInfo);\n    String targetFrontendUrl = oAuthClientService.buildFrontendRedirectUrl(tempCode, frontendTargetRedirectUri);\n    response.sendRedirect(targetFrontendUrl);\n} catch (Exception e) {\n    log.error(\"{} OAuth callback processing failed: {}\", socialType, e.getMessage(), e);\n    String errorRedirectUrl = oAuthClientService.buildFrontendErrorRedirectUrl(\"authentication_failed\", frontendTargetRedirectUri);\n    response.sendRedirect(errorRedirectUrl);\n}"
      }
    },
    {
      "name": "온보딩 상태 기반 ROLE 접근 제어",
      "what": "소셜 로그인만 완료하고 프로필 등록을 마치지 않은 사용자에게 최소한의 API(HTTP Method 단위)만 열어주는 접근 제어",
      "how": [
        "CustomUserDetailsService가 매 요청마다 온보딩 완료 여부로 ROLE_GUEST/ROLE_STUDENT를 동적 부여",
        "SecurityConfig의 ALLOWED_ONBOARDING_URLS(Map<HttpMethod, String[]>)가 POST /api/users/me/profile, GET /api/users/verify-nickname만 GUEST에게 허용",
        "JwtAccessDeniedHandler가 GUEST의 인가 실패 시 403 대신 ONBOARDING_REQUIRED 에러 코드로 응답"
      ],
      "decision": "이슈 #144에서 9개 커밋(본인 6개+팀원 3개)에 걸쳐 URL 전체 허용 → ROLE 제한 → HTTP Method 단위 제한 순으로 3단계 점진적으로 좁혀졌습니다. 상세 변천사는 troubleshooting 항목 참고.",
      "files": [
        "src/main/java/com/mr/global/security/SecurityConfig.java",
        "src/main/java/com/mr/global/security/jwt/JwtAccessDeniedHandler.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/mr/global/security/SecurityConfig.java",
        "snippet": "private static final Map<HttpMethod, String[]> ALLOWED_ONBOARDING_URLS = Map.of(\n        HttpMethod.POST, new String[]{\"/api/users/me/profile\"},\n        HttpMethod.GET, new String[]{\"/api/users/verify-nickname\"}\n);\n...\nauth.requestMatchers(publicMatchers).permitAll();\nALLOWED_ONBOARDING_URLS.forEach((method, urls) ->\n        auth.requestMatchers(method, urls).hasAnyRole(\"GUEST\", \"STUDENT\", \"TEACHER\", \"ADMIN\"));\nauth.anyRequest().hasAnyRole(\"STUDENT\", \"TEACHER\", \"ADMIN\");"
      }
    },
    {
      "name": "회원 탈퇴 시 연관 데이터 일괄 삭제",
      "what": "회원 탈퇴 시 17개 이상 테이블에 흩어진 사용자 연관 데이터를 참조 무결성 위반 없이 삭제",
      "how": [
        "각 도메인 리포지토리에 @Modifying(clearAutomatically = true) 벌크 삭제 쿼리 정의",
        "AuthService.withdraw()에서 자식 엔티티(멘토 메시지→세션, 분석 리포트→분석 등)를 참조 방향의 역순으로 삭제",
        "마지막에 SocialAuth 만료·삭제 후 User 삭제"
      ],
      "decision": "ON DELETE CASCADE나 JPA cascade=REMOVE 대신 Repository 벌크 삭제를 명시적 순서로 호출하는 방식을 채택했습니다. 삭제 순서를 코드로 명확히 제어할 수 있지만, 새 연관 테이블 추가 시 수동으로 추가해야 하는 한계가 있습니다.",
      "files": [
        "src/main/java/com/mr/domain/auth/service/AuthService.java",
        "src/main/java/com/mr/domain/analysis/repository/AnalysisReportRepository.java 외 16개 리포지토리"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/auth/service/AuthService.java",
        "snippet": "@Transactional\npublic void withdraw(Long userId) {\n    User user = userRepository.findById(userId)\n            .orElseThrow(() -> new GeneralException(UserErrorStatus.USER_NOT_FOUND));\n\n    studentInstrumentRepository.deleteAllByUserId(userId);\n    studentRepository.deleteAllByUserId(userId);\n    userLearningProgressRepository.deleteAllByUserId(userId);\n\n    llmCallLogRepository.deleteAllByUserId(userId);\n    mentorMessageRepository.deleteAllByUserId(userId);\n    mentorChatSessionRepository.deleteAllByUserId(userId);\n    // ... (분석/연주/백킹트랙/알림/통계/구독 동일 패턴)\n\n    List<SocialAuth> socialAuths = socialAuthRepository.findAllByUser_UserId(userId);\n    if (!socialAuths.isEmpty()) {\n        socialAuths.forEach(SocialAuth::expireToken);\n        socialAuthRepository.deleteAll(socialAuths);\n    }\n    userRepository.delete(user);\n}"
      }
    }
  ],
  "troubleshooting": [
    {
      "title": "동시 소셜 로그인 시 유니크 제약 위반 및 고아 레코드 (#64)",
      "tags": ["Race Condition", "Lost Update", "동시성 제어"],
      "problem": "같은 소셜 계정으로 짧은 시간 안에 두 번의 로그인 요청이 거의 동시에 들어오면, 최초 구현은 준비 단계에서 바로 User를 생성해 SocialAuth 없이 User만 남는 고아 레코드가 생길 수 있었고, 이후 단계에서도 두 요청이 동시에 신규 생성 분기에 진입하면 (social_type, social_id) 유니크 제약 위반(DataIntegrityViolationException)으로 한쪽 요청이 실패했습니다.",
      "cause": "git log -p로 추적한 결과 두 단계 원인이 확인됩니다. (1) prepareSocialLogin이 SocialAuth 없으면 즉시 User를 생성해 이후 단계 실패 시 고아 레코드가 남는 구조였음(커밋 25e3dc0 이전). (2) completeTokenExchange가 '조회 후 없으면 생성'만 하고 유니크 제약 위반 예외 처리가 없어 동시 생성 시 한쪽이 500 에러로 실패(커밋 393755b 이전).",
      "options": [
        { "name": "유니크 제약 없이 애플리케이션 레벨에서만 중복 체크", "pros": "예외 처리 불필요", "cons": "Race Condition에서 근본적으로 중복 생성 가능", "chosen": false },
        { "name": "유니크 제약 + 예외 발생 시 그대로 500 반환", "pros": "구현 단순", "cons": "다른 요청이 이미 정상 처리했는데도 실패로 보임", "chosen": false },
        { "name": "User 생성을 완료 단계로 지연 + 유니크 제약 위반 시 재조회 후 성공 응답", "pros": "고아 레코드 방지, 동시 요청도 항상 로그인 성공으로 수렴, DB 정합성은 유니크 제약이 보장", "cons": "예외 처리 로직과 트랜잭션 전파(Propagation.NOT_SUPPORTED) 구조가 복잡해짐", "chosen": true }
      ],
      "solution": "prepareSocialLogin에서 User 생성을 completeTokenExchange 단계로 지연시켜 고아 레코드를 방지했습니다(25e3dc0). PostgreSQL이 제약 위반 시 트랜잭션 전체를 abort시키는 특성 때문에, DataIntegrityViolationException을 같은 트랜잭션에서 잡지 않고 그대로 전파시켜 롤백한 뒤, 호출자(AuthService)가 새 트랜잭션에서 재조회하는 구조로 최종 정착했습니다.",
      "codeBefore": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/auth/service/AuthTransactionService.java (커밋 393755b 이전)",
        "snippet": "Optional<SocialAuth> optionalSocialAuth = socialAuthRepository.findBySocialTypeAndSocialId(socialType, socialId);\nif (optionalSocialAuth.isPresent()) {\n    SocialAuth socialAuth = optionalSocialAuth.get();\n    socialAuth.updateRefreshToken(refreshTokenHash, expiryTime, deviceInfo);\n} else {\n    SocialAuth newSocialAuth = SocialAuth.create(user, socialType, socialId, refreshTokenHash, expiryTime, deviceInfo);\n    socialAuthRepository.saveAndFlush(newSocialAuth);\n}"
      },
      "codeAfter": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/auth/service/AuthService.java",
        "snippet": "@Transactional(propagation = Propagation.NOT_SUPPORTED)\npublic AuthResponseDTO.LoginResponse socialLogin(SocialType socialType, String accessToken, String deviceInfo) {\n    OAuthUserInfo userInfo = oAuthClientService.getUserInfo(socialType, accessToken);\n    try {\n        return authTransactionService.executeSocialLogin(socialType, userInfo, deviceInfo);\n    } catch (DataIntegrityViolationException e) {\n        return authTransactionService.executeSocialLoginForExistingUser(socialType, userInfo, deviceInfo);\n    }\n}"
      },
      "result": "동시 로그인 요청 중 하나가 유니크 제약에 걸려도 사용자에게는 정상 로그인 응답이 돌아가도록 개선되었습니다. (수치 확인 필요: 수정 전 실제 오류율이나 발생 빈도는 기록되어 있지 않음)",
      "evidence": "커밋 908f033, 25e3dc0, 393755b, c477f0a 등 (이슈 #64, PR #82, feat/#64-social-token-exchange) / 파일: src/main/java/com/mr/domain/auth/service/AuthTransactionService.java, AuthService.java",
      "learned": null
    },
    {
      "title": "회원 탈퇴 시 참조 무결성 위반 (#114)",
      "tags": ["FK Constraint Violation", "JPA Bulk Delete", "영속성 컨텍스트"],
      "problem": "회원 탈퇴(AuthService.withdraw) 시 User를 먼저 삭제하거나 자식 엔티티 삭제 순서를 고려하지 않으면 외래키 제약 위반이 발생했습니다. 브랜치명이 hotfix/#114-withdraw-hard-delete인 것으로 보아 운영/QA 단계에서 실제로 발견되어 hotfix로 처리된 것으로 추정됩니다.",
      "cause": "세 층위 원인이 확인됩니다. (1) user_id를 참조하는 다수 엔티티에 일괄 삭제 메서드 자체가 없었음(df59eed에서 17개 리포지토리에 신규 추가). (2) 자식-부모 참조 관계(멘토 메시지→세션, 코드 진행→백킹트랙 등)를 고려하지 않은 삭제 순서로 FK 위반 발생(7a62a02, 587caf1에서 순서 재배치). (3) @Modifying 벌크 삭제가 영속성 컨텍스트를 자동 갱신하지 않아 이후 조회가 스테일 상태를 참조할 수 있음(75095e0에서 clearAutomatically=true 일괄 적용).",
      "options": [
        { "name": "DB에 ON DELETE CASCADE 설정", "pros": "애플리케이션 코드 불필요", "cons": "Flyway 마이그레이션에 관련 변경 흔적 없음, 검토 여부 확인 필요", "chosen": false },
        { "name": "JPA 연관관계 cascade=REMOVE/orphanRemoval", "pros": "엔티티 그래프 자동 순회 삭제", "cons": "대량 삭제 시 N+1 개별 DELETE 쿼리 발생 가능", "chosen": false },
        { "name": "Repository별 @Modifying 벌크 삭제를 참조 역순으로 명시적 호출", "pros": "삭제 순서를 코드로 명확히 제어, 벌크 쿼리라 쿼리 수 적음", "cons": "새 연관 테이블 추가 시 withdraw()에 수동으로 추가해야 함", "chosen": true }
      ],
      "solution": "17개 이상 리포지토리에 @Modifying(clearAutomatically = true) 벌크 삭제 메서드를 추가하고, AuthService.withdraw()에서 자식→부모 순서로 명시적으로 호출하도록 재구성했습니다.",
      "codeBefore": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/analysis/repository/AnalysisReportRepository.java (커밋 df59eed 이전)",
        "snippet": "public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {\n    Optional<AnalysisReport> findFirstByAnalysisIdAndLlmStatusOrderByCreatedAtDesc(\n            Long analysisId, LlmStatus llmStatus);\n    // deleteAllByUserId 없음 -> User 삭제 시 FK 위반\n}"
      },
      "codeAfter": {
        "lang": "java",
        "path": "src/main/java/com/mr/domain/analysis/repository/AnalysisReportRepository.java",
        "snippet": "public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {\n    Optional<AnalysisReport> findFirstByAnalysisIdAndLlmStatusOrderByCreatedAtDesc(\n            Long analysisId, LlmStatus llmStatus);\n\n    @Modifying(clearAutomatically = true)\n    @Query(\"delete from AnalysisReport ar where ar.analysis.user.userId = :userId\")\n    void deleteAllByUserId(@Param(\"userId\") Long userId);\n}"
      },
      "result": "회원 탈퇴 API가 FK 위반 없이 완료되도록 수정되었습니다. 17개 리포지토리에 걸쳐 135줄이 추가되었습니다(1차 커밋 df59eed 기준). (수치 확인 필요: hotfix 이전 실패율은 기록 없음)",
      "evidence": "커밋 df59eed, 2473882, 7a62a02, 587caf1, 75095e0, 68a2822, ef3073e (PR #115, hotfix/#114-withdraw-hard-delete) / 파일: src/main/java/com/mr/domain/auth/service/AuthService.java 및 17개 도메인 리포지토리",
      "learned": "동일한 '참조 순서 고려 삭제 + clearAutomatically=true' 패턴이 SubscriptionRepository, UsageLimitRepository, WeaknessNoteRepository 등 본인이 관여하지 않은 다른 리포지토리에도 동일하게 적용되어(75095e0), 팀 내 표준 패턴으로 자리잡은 것으로 보입니다."
    },
    {
      "title": "ROLE 기반 온보딩 접근 제어 설계 (#144)",
      "tags": ["RBAC", "Spring Security"],
      "problem": "최초 구현은 PUBLIC_URLS를 제외한 모든 요청에 .anyRequest().authenticated()만 적용해, 온보딩(프로필 등록)을 마치지 않은 사용자도 JWT만 유효하면 모든 API를 호출할 수 있었습니다. 이 경우 서비스 레이어에서 Student 엔티티가 없어 STUDENT_NOT_FOUND 같은 의미 없는 에러가 노출될 수 있었습니다(코드 주석에 명시).",
      "cause": "최초 설계가 '인증 여부'만 확인하고 '온보딩 완료 여부'라는 비즈니스 상태를 인가 계층에 반영하지 않았습니다.",
      "options": [
        { "name": "각 서비스 메서드에서 온보딩 여부 개별 검사", "pros": "인가 계층 변경 불필요", "cons": "검사 누락 위험, 횡단 관심사가 서비스 계층에 흩어짐", "chosen": false },
        { "name": "인가 계층(SecurityConfig)에서 URL/HTTP Method 단위로 ROLE 기반 통제", "pros": "누락 위험 없이 한 곳에서 일관되게 통제, 프론트가 에러 코드로 온보딩 필요 여부 구분 가능", "cons": "허용 URL 목록을 수동으로 관리해야 함", "chosen": true }
      ],
      "solution": "ROLE_GUEST 도입 → 403 대신 ONBOARDING_REQUIRED 에러 코드 분기(ce94fc9) → PUBLIC_URLS/ALLOWED_ONBOARDING_URLS/그 외 3단계로 인가 규칙 분리(3b5fca6) → 온보딩 허용 URL을 HTTP Method 단위로 세분화(1da91f7, 팀원)의 4단계로 점진적으로 구현했습니다.",
      "codeBefore": {
        "lang": "java",
        "path": "src/main/java/com/mr/global/security/SecurityConfig.java (초기 버전)",
        "snippet": ".authorizeHttpRequests(auth -> auth\n        .requestMatchers(matchers).permitAll()\n        .anyRequest().authenticated()\n)"
      },
      "codeAfter": {
        "lang": "java",
        "path": "src/main/java/com/mr/global/security/SecurityConfig.java (커밋 3b5fca6)",
        "snippet": ".authorizeHttpRequests(auth -> auth\n        .requestMatchers(publicMatchers).permitAll()\n        .requestMatchers(onboardingMatchers).hasAnyRole(\"GUEST\", \"STUDENT\", \"TEACHER\", \"ADMIN\")\n        .anyRequest().hasAnyRole(\"STUDENT\", \"TEACHER\", \"ADMIN\")\n)"
      },
      "result": "온보딩 미완료 사용자가 호출 가능한 API 표면적이 '인증된 모든 API'에서 '프로필 등록(POST)과 닉네임 중복 확인(GET) 단 2개 엔드포인트'로 축소되었습니다. (수치 확인 필요: 수정 전 잘못된 API 호출 발생 빈도는 기록 없음)",
      "evidence": "커밋 1fe81c7, 0ef6cef, ce94fc9, 3b5fca6, 330ddc7, e647da0(본인) + 1da91f7, af84590, 7dcc2e1(팀원) (이슈/PR #144, #149, feat/#144-onboarding-interceptor) / 파일: src/main/java/com/mr/global/security/SecurityConfig.java, JwtAccessDeniedHandler.java",
      "learned": null
    }
  ],
  "results": [
    "저장소 전체 src/test 하위 63개 파일, @Test 447건 (2026-09-29 작업 트리 기준 grep 집계)",
    "본인 담당 영역(인증/보안)에 8개 테스트 파일 존재: AuthServiceTest, AuthTransactionServiceTest, OAuthClientServiceTest, OAuthTempCodeStoreTest, JwtTokenProviderTest, JwtAuthenticationFilterTest, JwtAccessDeniedHandlerTest, SecurityConfigTest",
    "GitHub Actions CI가 PR마다 PostgreSQL 16 + Redis 7 컨테이너로 전체 빌드/테스트 자동 실행",
    "main 브랜치 push 시 Docker 이미지가 자동 빌드되어 EC2에 배포됨 (서비스 URL: https://www.musereview.site/)",
    "본인 커밋 206건(전체 951커밋 중), 본인이 최다 기여자인 핵심 파일 3개(AuthService.java 45커밋, AuthController.java 31커밋, OAuthClientService.java 30커밋)"
  ],
  "retrospective": [
    "usage_limit 기능을 본인이 초기에 설계·구현했으나(feat/#75-usage-limit) 이후 이슈 #200/#230/#231에서 전량 삭제되었습니다. 삭제 사유가 커밋 메시지에 남아있지 않아 정확한 배경은 확인이 필요하지만, 기능 구현 전에 정책의 확정 여부를 먼저 확인했다면 더 나았을 것 같습니다.",
    "회원 탈퇴 로직이 17개 이상의 리포지토리를 직접 호출하는 구조라, 새 도메인이 추가될 때마다 삭제 로직을 수동으로 추가해야 하는 위험이 있습니다. 다시 설계한다면 이벤트 기반으로 관심사를 분리했을 수도 있을 것 같습니다(단, 실제로 검토된 대안은 아니며 사후 회고입니다).",
    "동시성 제어(#42, #64) 관련 커밋 메시지가 짧게만 남아 있어, 왜 그 방식을 택했는지에 대한 설계 의도가 충분히 기록되지 않았습니다. 다시 한다면 PR 설명이나 ADR 형태로 남겼을 것 같습니다."
  ],
  "screenshots": [
    { "src": "swagger-auth-overview.png", "caption": "Swagger UI의 /api/auth 태그 엔드포인트 목록 전체 화면 (제작 필요)" },
    { "src": "oauth-sequence-diagram.png", "caption": "OAuth 5단계 흐름(브라우저 → 콜백 → tempCode → 교환) 시퀀스 다이어그램 (제작 필요)" },
    { "src": "withdraw-erd-diagram.png", "caption": "AuthService.withdraw()가 삭제하는 17개 테이블과 User의 관계 ERD (제작 필요)" },
    { "src": "security-role-flowchart.png", "caption": "PUBLIC_URLS/ALLOWED_ONBOARDING_URLS/그 외 요청의 ROLE 분기 플로우차트 (제작 필요)" }
  ],
  "documents": [],
  "links": [
    { "label": "배포 서비스", "url": "https://www.musereview.site/" }
  ]
};

REPORT_DATA.gallery = [
  {
    "src": "assets/musereview/gallery/musereview-01.jpg",
    "caption": "뮤즈리뷰 서비스 화면"
  },
  {
    "src": "assets/musereview/gallery/musereview-02.jpg",
    "caption": "뮤즈리뷰 랜딩 페이지"
  }
];

REPORT_DATA.attachments = [];

REPORT_DATA.openQuestions = [
  {
    "heading": "본인이 직접 채워야 하는 정보",
    "items": [
      "정확한 팀 인원 수와 각자의 역할(본 조사는 git 커밋 작성자 수로만 추정: 최소 5~6명).",
      "서비스의 정확한 타깃 사용자층과 한 줄 소개 문구(README에 명시되어 있지 않음, 배포 URL의 실제 랜딩 페이지 문구 확인 권장).",
      "usage_limit 기능이 삭제된 정확한 이유(정책 변경/스코프 축소 여부).",
      "@Lock(PESSIMISTIC_WRITE)를 채택할 때 낙관적 락 등 다른 대안을 실제로 검토했는지 여부.",
      "PostgreSQL 버전: 로컬(docker-compose.local.yml)은 README와 동일하게 postgres:18을 쓰지만, CI(ci.yml)만 postgres:16 이미지를 사용합니다. CI가 다른 버전을 쓰는 것이 의도적 선택(호환성/속도)인지 단순 미갱신인지, 그리고 실제 운영(EC2) DB 버전이 18과 동일한지 확인 필요.",
      "배포 주소(https://www.musereview.site/)가 포트폴리오 공개 시점까지 계속 운영되는지 여부.",
      "GitHub PR 코멘트/리뷰 상세 내용 — 이번 조사는 gh auth login이 설정되어 있지 않아 PR 본문·리뷰 코멘트를 API로 가져오지 못했습니다. 필요하면 gh auth login 이후 gh pr view <번호>로 보완 가능합니다."
    ]
  },
  {
    "heading": "근거 부족으로 제외한 트러블슈팅 후보",
    "items": [
      "usage_limit 삭제(#200, #230, #231): '코드가 삭제되었다'는 사실은 확인되지만, 삭제에 이르게 된 문제 상황(버그였는지, 정책 변경이었는지)에 대한 근거가 커밋 메시지나 코드에 없어 트러블슈팅 항목으로 넣지 않고 8장 회고로만 다뤘습니다.",
      "#42 동시성 락: 실제 장애나 버그 리포트로 이어진 정황(에러 로그, 재현 조건 등)이 커밋 메시지에 없고 '동시성 락 적용'이라는 사전적/예방적 조치로 보여, 트러블슈팅이 아닌 5장 핵심 구현으로 분류했습니다.",
      "#176(fix: url 안쓰는 것 정리, fix: url 수정): 본인 커밋이지만 diff 확인 결과 단순 정리성 변경으로 판단되어 트러블슈팅 규모의 서사(문제-원인-해결)를 구성하기 어려워 제외했습니다."
    ]
  }
];

REPORT_DATA.interviewQuestions = [
  {
    "q": "Refresh Token 재발급에 비관적 락(PESSIMISTIC_WRITE)을 쓴 이유는? 낙관적 락과 비교했을 때 트레이드오프는?",
    "a": "커밋 메시지에 구체적 판단 근거가 남아있지 않으므로, 실제 답변 전에 '재발급 요청 빈도가 얼마나 됐는지', '낙관적 락으로 재시도할 경우 클라이언트 UX에 미치는 영향을 검토했는지'를 스스로 정리해 둘 필요가 있습니다."
  },
  {
    "q": "DataIntegrityViolationException을 catch해서 재조회하는 방식이 일반적인 'try-catch로 예외를 숨기는' 안티패턴과 어떻게 다른가?",
    "a": "PostgreSQL의 트랜잭션 abort 특성(코드 주석에 명시)과, 왜 재조회를 같은 트랜잭션이 아닌 새 트랜잭션(Propagation.NOT_SUPPORTED 조합)에서 해야 했는지를 설명할 수 있어야 합니다."
  },
  {
    "q": "회원 탈퇴 로직이 17개 이상의 리포지토리를 직접 호출하는 구조인데, 새 도메인이 추가될 때마다 이 메서드를 빠뜨리지 않는다는 보장이 있는가?",
    "a": "현재 구조상 컴파일 타임에 강제되지 않는 부분이므로, 실제로 이 리스크를 어떻게 인지하고 있었는지, 이벤트 기반 등 대안을 고려했는지 답변을 준비해 둘 필요가 있습니다(8장 회고 참고, 실제로 시도되지 않은 대안이므로 '이렇게 했다'가 아니라 '이렇게 개선할 수 있을 것 같다'는 톤으로 답해야 합니다)."
  },
  {
    "q": "ROLE_GUEST/ROLE_STUDENT를 JWT 클레임이 아니라 매 요청 DB 조회로 판단하게 한 이유는? 트래픽이 늘어나면 어떤 문제가 생길 수 있는가?",
    "a": "설계 의도가 코드에 명시되어 있지 않으므로, 실제 서비스 트래픽 규모와 이 조회가 성능에 미치는 영향을 직접 측정해보고 답변을 준비하는 것을 권장합니다."
  },
  {
    "q": "usage_limit 기능을 만들었다가 지운 경험에서 무엇을 배웠는가?",
    "a": "삭제 사유가 레포에 명시되어 있지 않으므로, 실제 배경(정책 변경/우선순위 조정 등)을 본인 기억에 근거해 준비해야 합니다."
  }
];
