/**
 * 자동 생성: portfolio-out/assu/Assu.json 의 원문 JSON을 그대로 옮긴 REPORT_DATA.
 * openQuestions / interviewQuestions 는 같은 프로젝트의 .md 10/11장 원문을
 * 별도로 채워 넣는다 (json에는 없는 필드).
 */
const REPORT_DATA = {
  "title": "Assu",
  "period": "2025-08-05 ~ 2026-10-07 (첫 커밋 f9469dc ~ 최신 커밋 87e4c51, PR #505 기준 진행중)",
  "role": "백엔드 개발자 (추정, 확인 필요)",
  "summary": "숭실대학교 학생, 학생회, 제휴업체, 운영자가 함께 쓰는 교내 제휴 혜택 플랫폼의 Spring Boot 백엔드이며, 리뷰/학생회 대시보드/스탬프/백오피스 신고 관리/홈 큐레이션/Swagger 에러코드 자동화를 담당했습니다.",
  "keyResults": [
    {
      "value": "97개 에러코드 / 34개 컨트롤러",
      "label": "Swagger에 에러코드 자동 노출",
      "condition": "ErrorStatus(97개 상수, 161줄) 중 SwaggerErrorCodes(494줄)로 매핑, 커밋 87e4c51(PR #505, 33개 파일 변경) 기준, 2026-10-07, 미병합"
    },
    {
      "value": "4개 커밋, 당일 병합",
      "label": "패키지 리팩토링 후 JPQL FQCN 런타임 오류 핫픽스",
      "condition": "커밋 50937b6, 29ee3c9, a385e20, a61e25d / PR #345, 2026-05-25"
    }
  ],
  "overview": {
    "background": "Assu는 숭실대학교 학생, 학생회(ADMIN), 제휴업체(PARTNER), 운영자(BACKOFFICE) 네 역할이 참여하는 교내 제휴 혜택 플랫폼입니다(도메인모델.md:3-8). 학생회가 제휴업체와 제휴 계약(Paper)을 맺고, 학생은 QR 스캔으로 혜택을 사용하며, 운영자는 회원 승인/신고 처리/알림 발송을 담당합니다.",
    "problem": "역할별로 다른 회원 모델을 하나의 Member 애그리거트로 통합해야 했고, 알림 발송 실패가 핵심 비즈니스 로직(스탬프 적립 등)을 막지 않아야 했으며, 반복된 패키지 구조 변경(domain/mapping -> domain/admin 등)이 JPQL 문자열 속 하드코딩된 FQCN을 깨뜨리는 문제가 있었습니다.",
    "scope": [
      "리뷰 작성/조회/삭제, S3 이미지 업로드, 가게 평점 재계산 (#13, PR #30)",
      "학생회 대시보드 통계 API: 신규/누적 가입자, 제휴 사용자 수, 내 가게 순위 (#13, #98, PR #30, #99, #219)",
      "스탬프 적립 및 10개 달성 시 자동 이벤트 응모, StampEventApplicant 엔티티 분리 (#234, PR #239)",
      "매칭 추천(랜덤 오프셋) 쿼리 구현 및 패키지 리팩토링 후 런타임 쿼리 오류 핫픽스 (#344, PR #345)",
      "백오피스 신고 관리 API 및 N+1 방지 (#372, PR #373)",
      "홈 화면 큐레이션 수동 설정 + 평점 기반 자동 추천 분리 설계 (#441, PR #442)",
      "Swagger 에러코드 자동 노출을 위한 OperationCustomizer 구현 (#504, PR #505, 미병합)",
      "API 문서/DTO 포맷 통일, domain/mapping -> domain/admin 패키지 구조 정리 (#234, #294, #301, #310)"
    ],
    "collaboration": [
      "PR 템플릿(.github/PULL_REQUEST_TEMPLATE.md)에 연관 이슈/작업 내용/코드 설명/고민사항 섹션을 사용",
      "브랜치 네이밍 컨벤션 <type>/#<issue>-<description> (AGENTS.md)",
      "CodeRabbit AI가 .coderabbit.yaml 설정으로 모든 PR에 1차 리뷰 수행",
      "명세는 Notion/기획 문서 링크를 @Operation description에 버전 헤더로 남기는 방식(개발가이드.md:184-207)",
      "인증/인가, 인프라/CI-CD, 알림/메트릭 영역은 다른 팀원(2ghrms, BAEK0111, MiN)이 주로 작성"
    ]
  },
  "stack": [
    {
      "category": "언어/프레임워크",
      "items": [
        { "name": "Java 17 (toolchain)", "reason": null },
        { "name": "Spring Boot 3.5.3", "reason": null }
      ]
    },
    {
      "category": "데이터",
      "items": [
        { "name": "Spring Data JPA (Hibernate)", "reason": "계층형 DDD 구조에서 Domain/Repository 분리를 위해 사용 (개발가이드.md:1-20)" },
        { "name": "Hibernate Spatial + locationtech jts-core 1.19.0", "reason": "가게/학생회/제휴업체의 위경도 좌표(Point) 저장과 반경 검색(ST_Contains)에 사용" },
        { "name": "MariaDB (mariadb-java-client 3.4.1, 운영)", "reason": null },
        { "name": "H2 (테스트)", "reason": null },
        { "name": "Redis (spring-boot-starter-data-redis)", "reason": "Refresh Token 저장/회전, Access Token 블랙리스트" }
      ]
    },
    {
      "category": "인증/보안",
      "items": [
        { "name": "Spring Security", "reason": null },
        { "name": "JWT (jjwt 0.11.5)", "reason": "Bearer JWT, 역할별 인증 체인 분리" }
      ]
    },
    {
      "category": "비동기/메시징",
      "items": [
        { "name": "Spring AMQP (RabbitMQ)", "reason": "알림 Outbox 패턴 발행" },
        { "name": "Spring WebSocket + spring-security-messaging", "reason": "그룹 QR 인증, 채팅" },
        { "name": "Spring WebFlux (WebClient)", "reason": null },
        { "name": "Spring Batch", "reason": null }
      ]
    },
    {
      "category": "외부 연동",
      "items": [
        { "name": "AWS SDK S3 (BOM 2.25.33)", "reason": "리뷰 사진, 계약서 이미지, 프로필 이미지 저장" },
        { "name": "Firebase Admin SDK 9.2.0", "reason": "FCM 발송" },
        { "name": "OkHttp 4.10.0", "reason": null },
        { "name": "jsoup 1.21.1", "reason": null }
      ]
    },
    {
      "category": "문서화/모니터링",
      "items": [
        { "name": "springdoc-openapi-starter-webmvc-ui 2.8.4", "reason": "OperationCustomizer로 에러코드 자동 노출" },
        { "name": "Spring Boot Actuator + micrometer-registry-prometheus", "reason": null },
        { "name": "Thymeleaf", "reason": "QR 딥링크 리다이렉트 페이지(/verify)" }
      ]
    }
  ],
  "design": {
    "architecture": "계층형 DDD: Presentation(Controller) -> Application(Service) -> Domain(Entity, Repository interface) <- Infrastructure(Repository impl, External API client). 상위 레이어만 하위 레이어 접근 가능, 각 도메인은 서로 분리(개발가이드.md:1-20).",
    "dataModel": "Member 애그리거트가 역할(STUDENT/ADMIN/PARTNER/BACKOFFICE)별 프로필과 1:1 관계를 가짐. 내가 작성한 엔티티는 StampEventApplicant(student_id FK, eventVersion, appliedAt), HomeCuration/HomeCurationItem(제목, 상단 추천, 그룹 1/2 매장 목록). 내 작성 엔티티에는 명시적 @Index/unique 제약이 없음(확인 필요).",
    "api": "kebab-case 복수 명사 URL, 역할별 URL 접두사, 모든 응답은 BaseResponse<T> 래퍼, 에러는 ErrorStatus(97개 상수) -> GeneralException -> GlobalExceptionAdvice. SwaggerConfig의 OperationCustomizer가 @ApiErrorCodeExamples를 읽어 에러 예시를 자동 추가.",
    "infra": "Docker 멀티스테이지 빌드 + legacy EC2 Docker Compose Blue-Green, 현재는 ArgoCD GitOps + K3s로 전환. config/manifest는 private git submodule. CI는 GitHub Actions(ci.yml)로 develop push/PR 시 gradle build+test. 이 영역은 본인이 직접 작성하지 않음(2ghrms, BAEK0111 작성).",
    "tree": "src/main/java/com/assu/server/\n├── ServerApplication.java\n├── domain/\n│   ├── common/\n│   ├── admin/          # 학생회 + 대시보드 통계 (내 작업 영역)\n│   ├── appreview/\n│   ├── auth/           # 타인 작성\n│   ├── backoffice/     # 신고/홈 큐레이션 (내 작업 영역)\n│   ├── certification/\n│   ├── chat/\n│   ├── deviceToken/\n│   ├── inquiry/\n│   ├── map/\n│   ├── member/\n│   ├── notification/\n│   ├── partner/        # 일부 내 작업 영역\n│   ├── partnership/\n│   ├── qr/\n│   ├── report/         # 내 작업 영역\n│   ├── review/         # 내 작업 영역\n│   ├── store/\n│   ├── student/        # 스탬프/홈 큐레이션 (내 작업 영역)\n│   └── suggestion/\n├── global/\n│   ├── apiPayload/     # ErrorStatus, SwaggerErrorCodes (내 작업 영역)\n│   ├── config/         # SwaggerConfig (내 작업 영역)\n│   ├── exception/      # ApiErrorCodeExamples (내 작업 영역)\n│   ├── security/\n│   └── util/\n└── infra/\n    ├── aligo/\n    ├── firebase/\n    └── s3/",
    "diagrams": []
  },
  "features": [
    {
      "name": "Swagger 에러코드 자동 노출 (OperationCustomizer)",
      "what": "엔드포인트별로 실제 발생 가능한 ErrorStatus를 Swagger 응답 예시(JSON)에 자동 반영",
      "how": [
        "ApiErrorCodeExamples(@Target(METHOD)) 어노테이션 신설, SwaggerErrorCodes enum 값을 파라미터로 받음",
        "SwaggerErrorCodes(494줄)에 엔드포인트별 Set.of(ErrorStatus...) 정의, ErrorStatus(97개 상수)는 단일 소스로 유지",
        "SwaggerConfig에 OperationCustomizer 빈 등록, HandlerMethod.getMethodAnnotation으로 어노테이션 읽음",
        "HTTP 상태코드별로 ErrorStatus를 그룹핑해 ApiResponse에 다중 Example 추가",
        "34개 컨트롤러를 서비스 구현체까지 추적해 실제로 던지는 ErrorStatus만 매핑"
      ],
      "decision": "PR #505 본문에 따르면 JWT 필터의 전역 인증 에러는 해당 엔드포인트가 직접 던지는 경우에만 포함했고, 기존 로직은 건드리지 않는 순수 추가(additive) 변경으로 범위를 제한함",
      "files": [
        "src/main/java/com/assu/server/global/config/SwaggerConfig.java",
        "src/main/java/com/assu/server/global/apiPayload/code/status/SwaggerErrorCodes.java",
        "src/main/java/com/assu/server/global/exception/annotation/ApiErrorCodeExamples.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/global/config/SwaggerConfig.java",
        "snippet": "@Bean\npublic OperationCustomizer customExceptionOperationCustomizer() {\n    return (Operation operation, HandlerMethod handlerMethod) -> {\n        ApiErrorCodeExamples description = handlerMethod.getMethodAnnotation(ApiErrorCodeExamples.class);\n        if (description != null) {\n            addErrorResponseExamples(operation, description.value());\n        }\n        return operation;\n    };\n}"
      }
    },
    {
      "name": "홈 큐레이션 수동 설정 / 평점 기반 자동 추천 분리",
      "what": "학생 홈 화면 제휴 추천 섹션을 운영자가 직접 지정하는 큐레이션과, 폼 작성을 돕는 평점 기반 자동 추천 보조 기능으로 분리 구현",
      "how": [
        "HomeCuration(제목, 상단 추천 업체, 할인 문구), HomeCurationItem(그룹 인덱스, 정렬 순서, 매장, 커스텀 할인 문구) 엔티티 설계",
        "PUT 저장 시 validateCurationGroups로 그룹 2개/그룹당 매장 2개/정렬순서 {1,2} 제약 검증",
        "자동 추천은 storeRepository.findAll() 결과를 rate 내림차순 정렬 후 상위 5개를 1(상단)+2x2(그룹)로 배분",
        "데이터가 없을 때 예외 대신 빈 그룹 2개를 담은 기본 응답 반환",
        "할인 문구 미설정 시 PaperContent 조회로 자동 보완(resolveStoreDiscountDescription)"
      ],
      "decision": "PR #442 본문: 기존 프론트엔드 연동 API(GET /students/usable 등)에 영향 없이 독립 엔드포인트로 분리. 단, getHomeCuration/getAutoRecommendedCuration(GET)에도 @BackofficeAudited가 적용되어 있어 CLAUDE.md의 'GET 제외' 컨벤션과 다르게 구현된 부분이 확인됨",
      "files": [
        "src/main/java/com/assu/server/domain/backoffice/controller/BackofficeHomeCurationController.java",
        "src/main/java/com/assu/server/domain/backoffice/service/BackofficeHomeCurationServiceImpl.java",
        "src/main/java/com/assu/server/domain/student/entity/HomeCuration.java",
        "src/main/java/com/assu/server/domain/student/entity/HomeCurationItem.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/domain/backoffice/service/BackofficeHomeCurationServiceImpl.java",
        "snippet": "List<Store> candidateStores = storeRepository.findAll().stream()\n        .sorted(Comparator.comparing(Store::getRate, Comparator.nullsLast(Comparator.reverseOrder())))\n        .limit(5)\n        .toList();\nStore featuredStore = candidateStores.get(0);\nList<Store> remainingStores = candidateStores.subList(1, candidateStores.size());\n// remainingStores를 2개씩 group1Stores, group2Stores로 분배"
      }
    },
    {
      "name": "스탬프 적립 및 10개 달성 시 자동 이벤트 응모",
      "what": "QR 인증마다 스탬프 1 증가, 10개 달성 시 자동 응모 처리와 스탬프 초기화를 한 번의 API 호출로 처리",
      "how": [
        "Student.setStamp()로 스탬프 1 증가",
        "스탬프 10 이상이면 StampEventApplicant(eventVersion, appliedAt) 생성/저장",
        "알림 발송 후 student.resetStamp() 호출",
        "응답 메시지를 적립/자동응모 두 경우로 분기"
      ],
      "decision": "PR #239 본문: Student의 stamp 필드를 리셋해도 응모 이력을 영구 관리할 수 있도록 StampEventApplicant를 별도 엔티티로 분리",
      "files": [
        "src/main/java/com/assu/server/domain/student/service/StudentServiceImpl.java",
        "src/main/java/com/assu/server/domain/student/entity/StampEventApplicant.java",
        "src/main/java/com/assu/server/domain/student/entity/Student.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/domain/student/service/StudentServiceImpl.java",
        "snippet": "student.setStamp();\nif (student.getStamp() >= 10) {\n    StampEventApplicant applicant = StampEventApplicant.builder()\n            .student(student).appliedAt(LocalDateTime.now())\n            .eventVersion(\"2026_SEASON_1\").build();\n    stampEventApplicantRepository.save(applicant);\n    notificationCommandService.sendStamp(memberId);\n    student.resetStamp();\n}"
      }
    },
    {
      "name": "리뷰 작성/삭제 시 가게 평균 평점 동기 재계산",
      "what": "리뷰 작성/삭제 시점마다 가게 평균 평점(Store.rate)을 즉시 재계산해 반영",
      "how": [
        "writeReview/삭제 플로우 끝에 recalcAndUpdateStoreRate(storeId) 호출",
        "flush 후 standardScoreWithStatus(storeId, NORMAL, NORMAL)로 미신고 리뷰 평균 조회",
        "평균 없으면 0, 있으면 Store.rate 갱신"
      ],
      "decision": "조회(랭킹/목록) 빈도가 쓰기(리뷰 작성)보다 많다는 전제 하에 쓰기 시점 선계산을 선택한 것으로 추정되나, 근거 문서/주석은 찾지 못함 (확인 필요)",
      "files": [
        "src/main/java/com/assu/server/domain/review/service/ReviewServiceImpl.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/domain/review/service/ReviewServiceImpl.java",
        "snippet": "private void recalcAndUpdateStoreRate(Long storeId) {\n    reviewRepository.flush();\n    Float avg = reviewRepository.standardScoreWithStatus(storeId, ReportedStatus.NORMAL, ReportedStatus.NORMAL);\n    int rounded = (avg == null) ? 0 : (int) (Math.round(avg * 10f) / 10f);\n    storeRepository.findById(storeId).ifPresent(s -> {\n        s.setRate(rounded);\n        storeRepository.save(s);\n    });\n}"
      }
    },
    {
      "name": "백오피스 신고 목록/상세 N+1 방지",
      "what": "신고자 역할별 프로필을 함께 내려주면서 N+1 쿼리를 방지",
      "how": [
        "ReportRepository의 findAll(Pageable)/findById(Long)를 오버라이드",
        "@EntityGraph로 reporter 및 역할별 프로필 4종 + reported를 한 번에 fetch"
      ],
      "decision": null,
      "files": [
        "src/main/java/com/assu/server/domain/report/repository/ReportRepository.java"
      ],
      "code": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/domain/report/repository/ReportRepository.java",
        "snippet": "@Override\n@EntityGraph(attributePaths = {\n        \"reporter\", \"reporter.studentProfile\", \"reporter.adminProfile\",\n        \"reporter.partnerProfile\", \"reporter.backofficeProfile\", \"reported\"\n})\nPage<Report> findAll(Pageable pageable);"
      }
    }
  ],
  "troubleshooting": [
    {
      "title": "패키지 구조 변경 후 JPQL에 하드코딩된 FQCN이 런타임에 깨짐",
      "tags": ["JPQL", "N+1 아님", "패키지 리팩토링", "hotfix"],
      "problem": "domain.mapping -> domain.admin 패키지 이동(#310) 후 매칭 추천(미제휴 제휴업체 랜덤 추천) API에서 쿼리 오류 발생, 같은 날 #344 핫픽스 PR #345 생성",
      "cause": "(1) 네이티브 쿼리의 enum 문자열 비교/LIMIT 바인드 문법이 DB 방언에 민감했고, (2) JPQL 안에 enum을 'com.assu.server.domain.common.enums.ActivationStatus.ACTIVE' FQCN 문자열로 하드코딩, (3) DTO 생성자 표현식이 이동 전 패키지 경로(domain.mapping.dto)를 그대로 참조. 컴파일러가 체크하지 못하는 쿼리 문자열 속 FQCN이 IDE의 패키지 이동 리팩토링에서 갱신되지 않음",
      "options": [
        { "name": "네이티브 쿼리 유지 + enum 캐스팅만 수정", "pros": "변경 범위 최소", "cons": "DB 방언 차이에 계속 노출", "chosen": false },
        { "name": "JPQL + Pageable로 전환", "pros": "DB 방언 의존성 제거, 표준 페이징", "cons": "쿼리 재작성 필요", "chosen": true },
        { "name": "JPQL 내 enum을 FQCN 문자열로 유지", "pros": "파라미터 바인딩 불필요", "cons": "패키지 경로 변경 시 재발(근본 원인)", "chosen": false },
        { "name": "enum을 :status 파라미터로 바인딩", "pros": "패키지 경로와 무관, 재발 방지", "cons": "호출부에서 enum 값을 명시적으로 전달 필요", "chosen": true }
      ],
      "solution": "네이티브 쿼리를 JPQL로 전환하고, 쿼리 문자열 내 하드코딩된 FQCN(enum 리터럴, DTO 생성자 표현식)을 파라미터 바인딩 또는 올바른 경로로 교체. 4개 커밋이 같은 날 PR #345로 병합됨",
      "codeBefore": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/domain/admin/repository/AdminRepository.java",
        "snippet": "@Query(value = \"\"\"\n    SELECT COUNT(*)\n    FROM admin a\n    WHERE NOT EXISTS (\n        SELECT 1 FROM paper pa\n        WHERE pa.admin_id = a.id\n          AND pa.partner_id = :partnerId\n          AND pa.is_activated = 'ACTIVE'\n    )\n    \"\"\", nativeQuery = true)\nlong countPartner(@Param(\"partnerId\") Long partnerId);"
      },
      "codeAfter": {
        "lang": "java",
        "path": "src/main/java/com/assu/server/domain/admin/repository/AdminRepository.java",
        "snippet": "@Query(\"\"\"\n    SELECT a\n    FROM Admin a\n    WHERE NOT EXISTS (\n        SELECT 1 FROM Paper pa\n        WHERE pa.admin = a\n          AND pa.partner.id = :partnerId\n          AND pa.isActivated = :status\n    )\n    \"\"\")\nList<Partner> findUnpartneredActiveByAdminWithOffset(\n        @Param(\"adminId\") Long adminId,\n        @Param(\"status\") ActivationStatus status,\n        Pageable pageable);"
      },
      "result": "PR #345의 4개 커밋이 같은 날(2026-05-25) 병합됨. 이후 동일 쿼리에 대한 추가 수정 커밋은 발견되지 않음. 정량적 비교 수치는 확인 필요(벤치마크 없음)",
      "evidence": "커밋 50937b6, 29ee3c9, a385e20, a61e25d / PR #345 (close #344) / src/main/java/com/assu/server/domain/admin/repository/AdminRepository.java, PartnerRepository.java, AdminServiceImpl.java, StudentAdminRepository.java",
      "learned": "이후 #504 Swagger 에러코드 작업에서 34개 컨트롤러를 서비스 구현체까지 추적해 실제 던지는 예외만 매핑한 것이 유사한 신중함을 보이나, PR 본문에 #344 경험이 의도적으로 반영됐다는 명시적 서술은 없음 (확인 필요)"
    }
  ],
  "results": [
    "병합된 PR 11개: #30, #99, #219, #239, #295, #303, #311, #345, #373, #398, #442",
    "열려 있는 PR 1개: #505 (2026-10-07 생성, 미병합)",
    "병합 없이 닫힌 PR 2개: #76, #302",
    "git log 기준 커밋 수 82개 (poppppp00@gmail.com + 164151329+kimyw1018@users.noreply.github.com)",
    "레포 전체 커밋 987개, 전체 소스 파일 419개, 테스트 파일 41개",
    "본인이 작성한 테스트 파일 0개 (확인 필요: 테스트 커버리지)"
  ],
  "retrospective": [
    "PR 설명 품질이 작업 후반부(#442, #505)로 갈수록 초기(#99, #239)보다 구체화됨. 처음부터 상세하게 쓰는 습관을 더 일찍 들였어야 함",
    "#234, #294, #301 세 차례에 걸쳐 API 양식/설명 통일을 반복한 것으로 보아 DTO/Swagger 설명 포맷 컨벤션을 프로젝트 초반에 더 명확히 정했어야 함",
    "BackofficeHomeCurationController의 GET 핸들러(getHomeCuration, getAutoRecommendedCuration)에 @BackofficeAudited가 적용되어 있어 CLAUDE.md의 'GET 제외' 컨벤션과 다르게 구현된 부분이 있음",
    "패키지 이동 시 JPQL 문자열 내 FQCN에 대한 전수 검색 절차가 없어 #344 같은 런타임 전용 오류가 발생함. 다시 한다면 패키지 이동 PR 체크리스트에 grep 검증을 포함했을 것",
    "리뷰/스탬프/홈 큐레이션/백오피스 신고 기능 모두 본인이 작성한 단위 테스트가 없음. 기능 구현 시점에 테스트를 바로 붙였다면 런타임 전용 오류를 머지 전에 잡을 가능성이 높았을 것"
  ],
  "screenshots": [
    { "src": "(캡처 필요) swagger-error-examples.png", "caption": "Swagger UI의 엔드포인트 Response 탭에서 상태코드별 에러 예시 드롭다운" },
    { "src": "(캡처 필요) home-curation-admin-form.png", "caption": "백오피스 홈 큐레이션 수동 설정 폼(상단 추천 + 2x2 그룹)" },
    { "src": "GitHub PR #30 첨부 이미지(외부 URL)", "caption": "리뷰/스탬프/대시보드 초기 구현 화면 캡처" }
  ],
  "documents": [
    { "title": "도메인 모델", "file": "도메인모델.md" },
    { "title": "용어 사전", "file": "용어사전.md" },
    { "title": "개발 가이드", "file": "개발가이드.md" },
    { "title": "CI/CD 워크플로우 가이드", "file": ".github/workflows/README.md" },
    { "title": "민감정보 마스킹 고도화 제안 (미추적, 미구현)", "file": "민감정보마스킹.md" }
  ],
  "links": [
    { "label": "GitHub Repository", "url": "https://github.com/ASSU-dev/ASSU_BE" }
  ]
};

REPORT_DATA.gallery = [
  {
    "src": "assets/assu/gallery/contest-01.jpg",
    "caption": "A:SSU 소프트웨어공모전 발표 슬라이드 1"
  },
  {
    "src": "assets/assu/gallery/contest-02.jpg",
    "caption": "A:SSU 소프트웨어공모전 발표 슬라이드 2"
  },
  {
    "src": "assets/assu/gallery/contest-03.jpg",
    "caption": "A:SSU 소프트웨어공모전 발표 슬라이드 3"
  },
  {
    "src": "assets/assu/gallery/contest-04.jpg",
    "caption": "A:SSU 소프트웨어공모전 발표 슬라이드 4"
  },
  {
    "src": "assets/assu/gallery/contest-05.jpg",
    "caption": "A:SSU 소프트웨어공모전 발표 슬라이드 5"
  },
  {
    "src": "assets/assu/gallery/contest-06.jpg",
    "caption": "A:SSU 소프트웨어공모전 발표 슬라이드 6"
  },
  {
    "src": "assets/assu/gallery/appstore-01.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 1"
  },
  {
    "src": "assets/assu/gallery/appstore-02.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 2"
  },
  {
    "src": "assets/assu/gallery/appstore-03.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 3"
  },
  {
    "src": "assets/assu/gallery/appstore-04.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 4"
  },
  {
    "src": "assets/assu/gallery/appstore-05.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 5"
  },
  {
    "src": "assets/assu/gallery/appstore-06.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 6"
  },
  {
    "src": "assets/assu/gallery/appstore-07.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 7"
  },
  {
    "src": "assets/assu/gallery/appstore-08.jpg",
    "caption": "A:SSU 앱스토어 소개 화면 8"
  }
];

REPORT_DATA.attachments = [
  {
    "label": "컴퓨터학부_소프트웨어공모전_결과보고서.pdf",
    "href": "assets/assu/docs/assu-report.pdf"
  }
];

REPORT_DATA.openQuestions = [
  {
    "heading": "내가 직접 채워야 하는 정보",
    "items": [
      "지원 직무가 정확히 무엇인지 (현재 '백엔드 개발자'로 추정 작성)",
      "팀 구성 6명이 실제 역할 분담(프론트/백엔드/디자인 등)과 일치하는지",
      "배포 주소(dev/prod 도메인), 실제 서비스 URL",
      "Math.round(avg * 10f) / 10f를 다시 int로 캐스팅하는 부분이 의도된 동작인지, 아니면 사용하지 않는 코드인지",
      "WebFlux/Spring Batch/jsoup/Gson이 실제로 어느 코드에서 쓰이는지 (build.gradle에는 있으나 본 조사에서 호출부를 특정하지 못함)",
      "ReportRepository/큐레이션 엔티티에 DB 레벨 인덱스나 유니크 제약이 없는 것이 설계 의도인지",
      "테스트 커버리지 수치(현재 내가 작성한 기능에 대한 자동화된 테스트가 전혀 없음을 확인함)",
      "민감정보마스킹.md의 작성 주체 및 포트폴리오 포함 여부(git 미추적 파일)"
    ]
  },
  {
    "heading": "근거 부족으로 제외한 트러블슈팅 후보",
    "items": [
      "알림 전송 실패 시 try-catch 처리(c957bad, #270) — 코드 근거는 명확하나 작성자가 MiN으로 확인되어(본인 작업 아님) 제외",
      "리뷰 평점 반올림 로직의 int 캐스팅 — 의도된 동작인지 결함인지 추가 확인 없이는 '문제'로 단정하기 어려워 트러블슈팅이 아닌 코드 발췌로만 5장에 수록",
      "Kotlin 플러그인/의존성 존재 이유 — 실제 Kotlin 소스 파일을 찾지 못해(.kt 파일 미확인) 트러블슈팅/스택 선택 이유 어느 쪽에도 근거 있게 포함하지 못함"
    ]
  }
];

REPORT_DATA.interviewQuestions = [
  {
    "q": "Swagger 에러코드 자동화에서 OperationCustomizer가 34개 컨트롤러 전체를 어떻게 추적했는지, 누락된 엔드포인트가 없는지 어떻게 검증했나요?",
    "a": "PR #505 본문에는 '서비스 구현체까지 추적'했다고만 쓰여 있고, 자동화된 검증(예: 컨트롤러 전수를 순회하며 어노테이션 누락을 검사하는 테스트)이 있었는지는 레포에서 확인하지 못했습니다. 실제 면접에서는 이 부분의 검증 방법(수동 vs 자동)을 명확히 설명할 수 있어야 합니다. (확인 필요)"
  },
  {
    "q": "#344 트러블슈팅에서, 왜 처음부터 JPQL + 파라미터 바인딩으로 작성하지 않고 네이티브 쿼리 + 하드코딩된 enum 리터럴을 썼었나요?",
    "a": "최초 작성 시점의 의도(예: 성능, DB 함수 활용 등)는 당시 커밋/PR에 명시되어 있지 않습니다. 네이티브 쿼리를 처음 선택한 이유를 재구성해 설명할 준비가 필요합니다. (확인 필요)"
  },
  {
    "q": "홈 큐레이션 자동 추천에서 storeRepository.findAll()로 전체 매장을 메모리에 올려 정렬하는 방식이 매장 수가 많아지면 성능 문제가 될 수 있는데, 이에 대한 고려가 있었나요?",
    "a": "현재 코드는 애플리케이션 레벨 정렬(Comparator.comparing(Store::getRate)...limit(5))을 사용합니다. DB 레벨 ORDER BY rate DESC LIMIT 5 쿼리로 대체하지 않은 이유, 그리고 매장 수 규모에 대한 전제가 있었는지 설명이 필요합니다. (확인 필요: 실제 매장 수 규모와 성능 영향)"
  },
  {
    "q": "@BackofficeAudited가 GET 핸들러에도 적용되어 있는데, 이게 팀 컨벤션 위반이라는 걸 알고 있었나요? 왜 그렇게 작성했나요?",
    "a": "8장 회고에서 다룬 것처럼, 레포 문서상 컨벤션과 실제 구현이 다른 지점입니다. 조회 이력도 감사 대상으로 삼으려는 의도였는지, 단순 누락인지 답변을 준비해야 합니다. (확인 필요)"
  },
  {
    "q": "내가 만든 기능(리뷰, 스탬프, 홈 큐레이션, 백오피스 신고)에 단위 테스트가 하나도 없는데, 품질을 어떻게 보장했나요?",
    "a": "현재 레포 기준 사실이므로 회피하지 말고, 수동 테스트 방식(Swagger UI, Postman 등)이나 팀 내 QA 프로세스([FIX/#98] QA 반영 커밋들이 존재하는 것으로 보아 QA 단계가 있었던 것으로 추정)로 어떻게 검증했는지 구체적으로 답변할 준비가 필요합니다. (확인 필요: 실제 QA 프로세스 설명)"
  },
  {
    "q": "StampEventApplicant를 별도 테이블로 분리한 것과, 그냥 Student에 totalStampCount 같은 컬럼을 하나 더 두는 것의 차이는 무엇인가요?",
    "a": "PR #239에 명시된 '리셋 이후에도 응모 이력 보존' 외에, 회차(eventVersion)별 응모자 집계/중복 응모 방지 같은 추가 요구사항이 있었는지가 핵심 쟁점입니다. 현재 엔티티에는 회차별 유니크 제약이 없어, 이론상 한 학생이 같은 회차에 여러 번 응모 기록을 남길 수 있는 구조입니다. (확인 필요: 중복 응모 방지 로직의 실제 존재 여부)"
  }
];
