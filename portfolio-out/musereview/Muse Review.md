# 1. 3분 요약

| 항목 | 내용 |
|---|---|
| 프로젝트명 | Muse Review (뮤즈리뷰) |
| 한 줄 소개 | 악기 연주(실기) 녹음을 AI로 분석해 리포트와 학습 커리큘럼을 제공하는 Spring Boot 백엔드 |
| 레포 성격 | Spring Boot 3.2.2 / Java 17 백엔드 API 서버 (`BE` 레포). 분석 엔진은 별도 `ANALYSIS` 레포(Python, docker-compose 기준 별도 컨테이너)로 분리되어 있음 |
| 담당 범위 | 인증/인가 도메인(소셜 로그인, JWT, Redis 기반 임시 코드 교환, ROLE 기반 접근 제어), 회원 탈퇴 데이터 정합성, 사용량 제한(usage_limit) 기능 (이후 제거) |
| 기간 | 커밋 기준 2026-06-30 ~ 2026-08-13 (약 6주). 레포 전체 기간은 2026-06-29 ~ 2026-09-20(확인 시점 기준, 이후로도 활동 지속 가능성 있음) |
| 팀 구성 | git 커밋 작성자 기준 최소 5~6명 (본인 포함). 정확한 인원 수·역할 분담 기준은 (확인 필요) |
| 배포 | https://www.musereview.site/ |
| 레포 | GitHub `Musereview/BE` (원격 URL은 CI/CD 워크플로에서 확인, `.github/workflows/cd.yml`) |

## 핵심 성과

- **인증 도메인 커밋 206건**(kimyw1018 + noreply 계정 합산, `git log --all --author` 기준)을 직접 작성했고, `AuthService.java`(45커밋), `AuthController.java`(31커밋), `OAuthClientService.java`(30커밋)가 본인이 가장 많이 수정한 파일 상위 3개입니다 (근거: `git log --author="poppppp00@gmail.com\|164151329+kimyw1018" --name-only`).
- 회원 탈퇴 시 발생하던 참조 무결성 문제를 이슈 #114 (hotfix/#114-withdraw-hard-delete, PR #115)에서 커밋 7건에 걸쳐 해결했습니다. (수치 확인 필요: 장애 발생 빈도나 영향받은 사용자 수는 커밋 로그에 기록되어 있지 않음)
- 테스트 코드: 저장소 전체 기준 `src/test` 하위 63개 파일에 `@Test` 447건 (grep 집계, 2026-09-29 기준 작업 트리). 인증 도메인에는 13개 테스트 파일(`AuthServiceTest`, `OAuthClientServiceTest`, `SecurityConfigTest`, `JwtTokenProviderTest` 등)이 존재합니다.

---

# 2. 개요

## 배경과 문제

- README(`README.md`)에 따르면 이 레포는 "뮤즈리뷰 백엔드"이며, `docker-compose.yml`에 정의된 `analysis` 서비스(별도 `ANALYSIS` 레포, Python, `/health` 헬스체크)가 실제 연주/미디(MIDI) 분석을 수행하는 것으로 보아, 사용자가 연주를 녹음하면 AI가 분석해 리포트·약점 노트(`weakness`)·학습 커리큘럼(`learning`)을 제공하는 음악 교육 서비스로 추정됩니다.
- 도메인 패키지 구성(`analysis`, `backingtrack`, `history`, `learning`, `mentor`, `playing`, `statistics`, `weakness` 등, 근거: `src/main/java/com/mr/domain/*`)으로 미루어 대상 사용자는 악기(특히 코드 진행/백킹트랙 관련 패키지로 보아 기타·피아노 등 화성 악기) 연습자로 추정됩니다. (확인 필요: 정확한 타깃 사용자층, 서비스 소개 문구는 README에 명시되어 있지 않음)
- 기술적으로 어려웠던 지점(본인이 직접 다룬 범위 기준):
  - 동시 요청 상황에서의 데이터 정합성: 같은 소셜 계정으로 동시에 최초 로그인을 시도할 때의 유니크 제약 위반(#64), 여러 기기에서 동시에 토큰을 재발급받는 경쟁 상태(#42), 회원 탈퇴 시 자식 엔티티 삭제 순서로 인한 참조 무결성 위반(#114).
  - 무상태(stateless) JWT 인증 위에서 "온보딩 미완료 사용자"라는 중간 상태를 표현하고, 이 상태에서 접근 가능한 API 범위를 HTTP Method 단위까지 좁혀야 했던 문제(#144).

## 담당 범위

본인(kimyw1018, poppppp00@gmail.com / 164151329+kimyw1018@users.noreply.github.com)이 작성한 디렉터리·패키지는 다음과 같습니다 (근거: 각 파일의 `git log --format='%an' -- <path>` 기준 본인이 최다 기여자인 파일).

| 패키지/디렉터리 | 역할 | 근거 |
|---|---|---|
| `src/main/java/com/mr/domain/auth/**` | 소셜 로그인(카카오/구글), JWT 발급/재발급, 계정 연동, 로그아웃, 회원 탈퇴 | `AuthService.java`(45), `AuthController.java`(32), `OAuthClientService.java`(29), `AuthTransactionService.java`(5), `SocialAuth.java`(13) 등 커밋 수 기준 |
| `src/main/java/com/mr/global/security/**` | Spring Security 설정, JWT 필터/토큰 프로바이더, ROLE 기반 인가 | `SecurityConfig.java`(15), `JwtTokenProvider.java`(9), `JwtAuthenticationFilter.java`(6) |
| `src/main/java/com/mr/domain/user/entity/UsageLimit.java`, `UsageLimitRepository.java` | 사용량 제한 기능 (이후 제거됨, #200/#230/#231) | 전량 본인 커밋(`git log --format='%an'` 5건 모두 kimyw1018) |
| `MR_config/local/application.example.yml` | 로컬 개발 환경 설정 템플릿 | 본인 5회 수정 |

본인이 작성하지 않은 영역(교차 확인, 근거: 해당 파일의 `git log --format='%an'` 상위 기여자가 본인이 아님):

- `LearningService.java` / `LearningServiceConcurrencyTest.java`: p1001q(박수연)가 주 작성자.
- `GeminiClient.java`, `GeminiStreamingClient.java`, `GlobalExceptionHandler.java`, `AnalysisRequestedEventListener.java`, `AnalysisRecoveryScheduler.java`: ownue(eunwoo)가 주 작성자.
- `S3FileService.java`: onlyoneprivate가 주 작성자.
- `MasterAuthController.java`, `MasterAuthService.java`(마스터 인증/#221): ownue가 주 작성자.
- `OAuthTempCodeStore.java`(Redis 기반 임시 코드 저장소, 현재 코드 기준): ownue가 작성. 본인이 초기에 만든 인메모리 `ConcurrentHashMap` 기반 임시 코드 저장소(#64, 커밋 908f033)를 팀원이 이후 Redis 기반으로 교체한 것으로 추정됩니다 (근거: 아래 5장 "OAuth 소셜 로그인" 항목의 코드 변천 참고). (확인 필요: 교체가 별도 이슈/PR로 진행됐는지 여부)

## 협업 방식

- **브랜치 전략**: README에 Git Flow 기반 전략이 명시되어 있습니다. `main`(배포), `develop`(통합), 기능 브랜치는 `Prefix/#이슈번호-작업내용` 형식(예: `feat/#10-login-api`). 실제 커밋 로그에서도 `feat/#64-social-token-exchange`, `hotfix/#114-withdraw-hard-delete`, `feat/#144-onboarding-interceptor` 등 동일 패턴이 확인됩니다.
- **커밋 컨벤션**: `타입: 작업 내용 (#이슈번호)` 형식. 실제 로그도 `fix: ...(#64)`, `refactor: ...(#200)` 형태로 일관되게 지켜지고 있습니다.
- **코드 리뷰**: README에 "PR 머지 조건: 최소 2명 이상 Approve", "리뷰 태그 가이드(P1/P2/P3)"가 명시되어 있습니다. 실제 리뷰 태그 적용 여부나 구체적 리뷰 코멘트는 (확인 필요: GitHub PR 코멘트는 `gh auth login` 미설정으로 이번 조사에서 조회하지 못함).
- **명세 선정의 근거**: `LearningServiceConcurrencyTest.java`의 클래스 주석에 "은우님 PR 리뷰 지적(#79) 검증용 통합 테스트"라는 문구가 있어, PR 리뷰에서 나온 지적 사항이 후속 테스트로 이어지는 협업 흐름이 실제로 있었음을 알 수 있습니다 (근거: `src/test/java/com/mr/domain/learning/service/LearningServiceConcurrencyTest.java:33-37`, 단 이 파일 자체는 본인 작성 아님).
- **문서화**: API 문서는 코드 내 Swagger(`springdoc-openapi`) 애너테이션으로 관리되며(`AuthController.java`에 `@Operation`, `@ApiResponses`, 응답 예시 JSON까지 상세 기술), 별도 API 문서 레포/노션 등 외부 문서 존재 여부는 (확인 필요).

---

# 3. 기술 스택

## 백엔드 핵심

| 분야 | 기술 | 버전 | 근거 |
|---|---|---|---|
| 언어 | Java | 17 (toolchain) | `build.gradle` |
| 프레임워크 | Spring Boot | 3.2.2 | `build.gradle` |
| 의존성 관리 | Spring Dependency Management Plugin | 1.1.7 | `build.gradle` |
| 코드 포맷 | Spring JavaFormat Plugin | 0.0.41 (빌드 시 포맷 미준수하면 컴파일 실패) | `build.gradle`, `README.md` |
| API 문서화 | springdoc-openapi-starter-webmvc-ui | 2.3.0 | `build.gradle` |
| 인증 | Spring Security + JWT(jjwt) | jjwt 0.11.5 | `build.gradle` |
| ORM | Spring Data JPA | Spring Boot 관리 버전 | `build.gradle` |
| DB 마이그레이션 | Flyway Core | Spring Boot 관리 버전 | `build.gradle`, `src/main/resources/db/migration/V1~V8` |
| DB | PostgreSQL | 18 (README 명시, `docker-compose.local.yml`도 `postgres:18` 사용). CI만 `postgres:16` 이미지 사용 | `README.md`, `docker-compose.local.yml`, `.github/workflows/ci.yml` |
| 캐시/세션 저장소 | Redis (spring-boot-starter-data-redis) | 로컬/CI: redis 7.x 이미지 | `build.gradle`, `docker-compose.yml`(redis:7.4-alpine), `ci.yml`(redis:7-alpine) |
| 비동기 재시도 | Spring Retry + Spring AOP | Spring Boot 관리 버전 | `build.gradle` 주석: "알림 저장 실패 재시도용" |
| 파일 스토리지 | AWS S3 SDK v2 (bom 2.25.60) | 2.25.60 | `build.gradle` |
| 유틸리티 | Lombok | Spring Boot 관리 버전 | `build.gradle` |
| 헬스체크 | Spring Boot Actuator | Spring Boot 관리 버전 | `build.gradle` |
| 테스트 | spring-boot-starter-test, JUnit Platform | - | `build.gradle` |

## 인프라 / 배포

| 분야 | 기술 | 근거 |
|---|---|---|
| 컨테이너 | Docker (`eclipse-temurin:17-jre-jammy` 베이스, non-root `spring` 유저로 실행) | `Dockerfile` |
| 오케스트레이션(로컬/운영) | docker-compose (backend + redis + analysis 3개 서비스) | `docker-compose.yml` |
| CI | GitHub Actions (`ci.yml`) — PR 시 Gradle 빌드+테스트, PostgreSQL 16 / Redis 7 서비스 컨테이너 사용 | `.github/workflows/ci.yml` |
| CD | GitHub Actions (`cd.yml`) — main push 시 Docker 이미지 빌드 후 Docker Hub push, EC2에 SSH로 배포 | `.github/workflows/cd.yml` |
| 배포 대상 | AWS EC2 (Security Group에 GitHub Actions 러너 IP를 임시로 SSH 허용 후 배포 완료 시 회수) | `.github/workflows/cd.yml` |

**선택 이유**: 대부분 프레임워크/라이브러리 선택 이유는 코드나 문서에 별도로 기록되어 있지 않아 **(확인 필요)**로 둡니다. 예외적으로 확인되는 것:
- `@Modifying(clearAutomatically = true)` 채택 이유는 커밋 메시지와 코드 변화로 추정 가능(5장/6장 참고).
- PostgreSQL 트랜잭션 abort 특성에 대한 대응은 `AuthTransactionService.java`의 코드 주석(69~72행)에 명시.

---

# 4. 설계

## 아키텍처

- 패키지 최상위는 `com.mr.domain.*`(도메인별 수직 분할)과 `com.mr.global.*`(공통 인프라)로 나뉩니다 (근거: `src/main/java/com/mr` 디렉터리 구조).
- 도메인 패키지 13개: `analysis, auth, backingtrack, history, home, learning, mentor, notification, playing, statistics, subscriptions, user, weakness`.
- 각 도메인은 대체로 `controller / service / repository / entity / entity/enums / dto/req / dto/res / exception` 계층으로 구성됩니다 (근거: `auth`, `analysis`, `learning`, `mentor` 등 대부분 도메인에서 동일 패턴 반복 확인).
- 요청 처리 흐름 예시 (본인이 작성한 소셜 로그인 흐름, 웹 브라우저 기준):
  1. `GET /api/auth/login/{socialType}` (`AuthController.startOAuthLogin`) — CSRF 방지용 `state` 값과 커스텀 리다이렉트 URI를 HttpOnly 쿠키에 저장 후 소셜 인가 URL로 302 리다이렉트.
  2. 소셜 제공자가 `GET /api/auth/{socialType}/callback` (`AuthController.oAuthCallback`)으로 인가 코드(`code`)와 `state`를 반환. 쿠키에 저장된 `state`와 일치 여부를 검증(CSRF 방지).
  3. `AuthService.generateTempCodeByCode` → `OAuthClientService.getUserInfoByCode`(소셜 서버에 code를 access token으로 교환 후 사용자 정보 조회) → `AuthTransactionService.prepareSocialLogin`(기존 회원 여부 조회, 읽기 전용 트랜잭션) → 1회성 `tempCode`(UUID)를 발급해 `OAuthTempCodeStore`(Redis, TTL 2분)에 저장.
  4. 프론트엔드로 `?code={tempCode}` 파라미터와 함께 리다이렉트.
  5. 프론트엔드가 `POST /api/auth/token/exchange`(`AuthController.exchangeToken`)로 tempCode를 보내면 `AuthService.exchangeTempCode` → Redis에서 `consume`(조회 즉시 삭제) → `AuthTransactionService.completeTokenExchange`에서 JWT Access/Refresh Token 발급 및 `SocialAuth` upsert.
- 인증이 필요한 모든 요청은 `JwtAuthenticationFilter`(OncePerRequestFilter)가 `Authorization: Bearer` 헤더를 파싱해 `SecurityContextHolder`에 인증 정보를 설정하고, `SecurityConfig`의 `SecurityFilterChain`이 URL/HTTP Method 단위로 `hasAnyRole`을 적용합니다.
- 본인 담당 영역은 아니지만, 시스템 전체 구조를 이해하는 데 필요한 다른 비동기 처리 패턴도 코드 근거와 함께 참고로 남깁니다 (모두 팀원 작성, 근거: 각 파일 `git log --format='%an'` 결과 본인 커밋 0건):
  - **AI 분석 비동기 처리**: `AnalysisRequestedEventListener`가 `@TransactionalEventListener(phase = AFTER_COMMIT)`로 트랜잭션 커밋 후에만 이벤트를 받아 `TaskExecutor`로 AI 서버(`ANALYSIS`, 별도 Python 레포) 호출을 비동기 위임하고, 제출 자체가 실패해도 예외를 삼킵니다. `AnalysisRecoveryScheduler`가 30초 주기로 `PENDING`/`PROCESSING` 상태가 임계 시간을 넘긴 건을 재제출하는 self-healing 구조로 이를 보완합니다.
  - **알림 저장 재시도**: `NotificationEventListener`가 `@Async` + `@TransactionalEventListener(AFTER_COMMIT)` + `@Transactional(REQUIRES_NEW)` + `@Retryable(maxAttempts=3, backoff=1000ms)` + `@Recover` 조합으로 메인 트랜잭션과 별개의 새 트랜잭션에서 알림을 저장하고, 3회 재시도 후에도 실패하면 로그만 남깁니다 (`build.gradle`의 "Spring Retry 및 AOP (알림 저장 실패 재시도용)" 주석과 일치).
  - **S3 파일 업로드**: `S3FileService`가 Presigned PUT URL을 발급해 클라이언트가 S3에 직접 업로드하게 하고, 서버는 `HeadObjectRequest`로 업로드된 객체의 크기/Content-Type/소유권만 사후 검증(실패 시 즉시 삭제)하는 방식으로, 파일 바이트가 서버를 경유하지 않도록 설계되어 있습니다.

## 데이터 모델

- Flyway 마이그레이션 8건(`V1~V8`, `src/main/resources/db/migration/`)이 존재하며 제목으로 보아 다음과 같은 변경이 있었습니다: 멘토 채팅 제약/인덱스 추가(V1), 소셜 인증 `social_type` 체크 제약 정규화(V2), 레거시 연주 MIDI 데이터 정규화(V3), 멘토 생성 컬럼 추가(V4), 녹음 파일 URL → object key 마이그레이션(V5), 멘토 채팅 세션 상태 체크 제약 정규화(V6), 백킹트랙 오디오 파일 URL → object key 마이그레이션(V7), 분석 시간 컬럼을 timestamptz로 변경(V8). (V1, V3~V8은 본인 작성 영역 밖이라 내용만 파일명 기준으로 기록, 상세 사유는 확인 필요)
- 본인이 작성한 `SocialAuth` 엔티티(`src/main/java/com/mr/domain/auth/entity/SocialAuth.java`)의 설계:
  - `@Table(uniqueConstraints = {...})`로 두 개의 복합 유니크 제약을 겁니다: `uk_social_auth_type_id(social_type, social_id)`(같은 소셜 계정으로 중복 가입 방지), `uk_social_auth_user_type(user_id, social_type)`(한 유저가 같은 소셜 타입을 두 번 연동하는 것 방지).
  - `refresh_token_hash` 컬럼에 `unique = true` 제약을 걸어 해시 충돌/재사용을 DB 레벨에서도 막습니다.
  - Refresh Token 원문이 아닌 SHA-256 해시(`JwtTokenProvider.hashToken`)만 저장해 DB 유출 시에도 토큰 재사용을 방지합니다.
  - 정적 팩토리 메서드(`create`)에서 user/socialType/socialId/token/만료시간을 모두 검증한 뒤 `@Builder(access = PRIVATE)`로 생성해 불변식이 깨진 객체가 생성되지 못하도록 했습니다.
  - `SocialAuthRepository.findByRefreshTokenHashWithLock`에 `@Lock(LockModeType.PESSIMISTIC_WRITE)`를 적용해 토큰 재발급 시 행 단위 잠금을 겁니다 (7장 5. 참고).

## API 및 인터페이스

- 공통 응답 포맷(`com.mr.global.apipayload.ApiResponse`, 본인 작성 아님, 1회 수정 이력)은 `{isSuccess, code, message, data}` 구조의 record이며, `onSuccess`/`onFailure` 정적 팩토리로 생성합니다.
- 에러 코드 컨벤션: `{도메인}_{HTTP상태}_{순번}` (예: `AUTH_400_01`, `AUTH_401_04`, `AUTH_503_01`). 공통 에러는 `COMMON_xxx` (예: `COMMON_200`, `COMMON_400_01`). 도메인별 에러는 `BaseCode` 인터페이스(`getStatus/getCode/getMessage`)를 구현하는 enum(`AuthErrorStatus` 등)으로 관리됩니다.
- 예외 처리는 `GlobalExceptionHandler`(`@RestControllerAdvice`, 본인 작성 아님)가 `GeneralException`(도메인 예외 래퍼), `MethodArgumentNotValidException`(`@Valid` 실패), `HttpMessageNotReadableException`(JSON 파싱 실패), `ConstraintViolationException`, `MethodArgumentTypeMismatchException`, 그리고 마지막으로 모든 `Exception`을 잡아 `COMMON_500_01`로 응답하며 서버 로그(`log.error`)를 남깁니다.
- 본인이 작성한 `auth` 도메인 엔드포인트 (`AuthController.java` 기준):

| Method | Path | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/api/auth/login/{socialType}` | 웹 소셜 로그인 시작 (302 리다이렉트) | X |
| GET | `/api/auth/{socialType}/callback` | 소셜 로그인 콜백 수신 | X |
| POST | `/api/auth/token/exchange` | 임시 교환 코드로 JWT 발급 | X |
| POST | `/api/auth/login/{socialType}` | 소셜 Access Token으로 직접 로그인 (모바일/SDK용) | X |
| POST | `/api/auth/reissue` | Refresh Token으로 JWT 재발급 (RTR 적용) | X (Refresh Token 자체가 인증 수단) |
| POST | `/api/auth/link/{socialType}` | 소셜 계정 추가 연동 | O |
| POST | `/api/auth/logout` | 로그아웃 (해당 기기 Refresh Token 만료) | O |
| POST | `/api/auth/withdraw` | 회원 탈퇴 | O |

- Swagger UI는 `http://localhost:8080/swagger-ui/index.html`에서 확인 가능 (README 명시), 각 엔드포인트에 `@ExampleObject`로 성공/실패 응답 예시가 코드에 직접 포함되어 있습니다.

## 인프라 및 배포

- **실행 환경**: Docker 이미지(`eclipse-temurin:17-jre-jammy`)를 non-root `spring` 유저로 실행, `TZ=Asia/Seoul`, 8080 포트 노출.
- **배포 파이프라인** (`.github/workflows/cd.yml`, main 브랜치 push 트리거):
  1. Gradle로 `bootJar` 빌드 (`-x test`, 테스트 미실행)
  2. Docker Hub에 `musereview:latest` 및 `musereview:{commit sha}` 태그로 이미지 push
  3. AWS 자격 증명 설정 후 GitHub Actions 러너의 공인 IP를 조회해 EC2 보안 그룹에 22번 포트 임시 허용
  4. SSH로 EC2에 접속해 `ANALYSIS`/`BE` 레포를 각각 `git reset --hard origin/main`으로 최신화하고 `docker compose pull/build/up -d`로 재배포
  5. 배포 완료 후(`if: always()`) 보안 그룹에서 방금 허용한 IP 규칙을 회수(revoke)
- **설정 관리**: 민감 정보는 `.env` 파일 및 `MR_config/local/application.yml`로 관리하며 둘 다 `.gitignore`에 등록되어 git 이력에 커밋된 적이 없습니다(근거: `git check-ignore -v`, `git ls-files`로 확인, `MR_config/local/application.example.yml`만 템플릿으로 커밋됨). docker-compose는 `env_file: .env`로 런타임 환경변수를 주입하며, `DEFAULT_PROFILE_IMAGE_URL`·`AI_INTERNAL_BASE_URL` 등 필수 환경변수는 `${VAR:?VAR is required}` 문법으로 누락 시 컨테이너 기동을 막습니다.
- **CI**: PR 생성/업데이트 시 및 `develop` 직접 push 시 실행. PostgreSQL 16 + Redis 7 서비스 컨테이너를 띄우고 `./gradlew clean build -x checkFormatMain -x checkFormatTest`로 빌드+테스트, 실패 시 테스트 리포트를 아티팩트로 업로드. 같은 브랜치의 이전 CI 실행은 `concurrency` 설정으로 자동 취소됩니다.
- **민감정보 존재 확인**: 로컬 작업 트리에 `.env`, `MR_config/local/application.yml` 파일이 실제로 존재함을 확인했으나(내용 미인용), 둘 다 git 추적 대상이 아니므로 레포 히스토리에는 노출되지 않았습니다.

## 디렉터리 구조

```
BE/
├── src/main/java/com/mr/
│   ├── domain/
│   │   ├── auth/              # [본인 담당] 소셜 로그인, JWT, 계정 연동/탈퇴
│   │   │   ├── controller/    # AuthController, MasterAuthController(타인 작성)
│   │   │   ├── service/       # AuthService, AuthTransactionService, OAuthClientService, OAuthTempCodeStore
│   │   │   ├── entity/        # SocialAuth
│   │   │   ├── repository/    # SocialAuthRepository (PESSIMISTIC_WRITE 락 쿼리 포함)
│   │   │   └── exception/     # AuthErrorStatus
│   │   ├── analysis/          # 연주 분석 리포트/이벤트/스케줄러 (타인 담당)
│   │   ├── backingtrack/      # 백킹트랙/코드 진행 (타인 담당)
│   │   ├── history/           # 연습 이력 (타인 담당)
│   │   ├── home/              # 홈 화면 집계 (타인 담당)
│   │   ├── learning/          # 이론/실기 학습 커리큘럼 (타인 담당)
│   │   ├── mentor/            # AI 멘토 채팅(Gemini 연동) (타인 담당)
│   │   ├── notification/      # 알림 (타인 담당)
│   │   ├── playing/           # 연주 세션/MIDI 이벤트 (타인 담당)
│   │   ├── statistics/        # 연습 통계 집계 (타인 담당)
│   │   ├── subscriptions/     # 구독 (타인 담당)
│   │   ├── user/               # 유저/학생 프로필, UsageLimit(본인 작성, 이후 삭제)
│   │   └── weakness/          # 약점 노트 (타인 담당)
│   └── global/
│       ├── security/          # [본인 담당] SecurityConfig, JWT 필터/프로바이더
│       ├── apipayload/        # 공통 응답 포맷, 에러 코드, 예외 핸들러 (타인 담당)
│       ├── client/ai, gemini/ # 외부 AI 서버·Gemini 연동 클라이언트 (타인 담당)
│       ├── file/s3/           # S3 업로드 (타인 담당)
│       ├── event/             # 도메인 간 이벤트 정의 (타인 담당)
│       └── config/            # Flyway/OAuth/Gemini/Swagger 등 설정 (일부 OAuthProperties 본인 담당)
├── src/main/resources/
│   └── db/migration/          # Flyway 마이그레이션 V1~V8
├── src/test/                   # 도메인별 단위/통합 테스트 (63개 파일, @Test 447건)
├── MR_config/local/            # 로컬 민감정보 설정 (gitignore 대상)
├── .github/workflows/          # ci.yml(빌드/테스트), cd.yml(EC2 배포)
├── docker-compose.yml           # backend + redis + analysis(Python) 3서비스 구성
└── Dockerfile                   # non-root 실행, JRE 17 기반
```

---

# 5. 핵심 구현

## JWT 기반 무상태 인증

**무엇을 구현했는가**: Access/Refresh Token을 발급하고, 매 요청마다 필터에서 검증해 `SecurityContext`에 인증 정보를 채우는 무상태(stateless) 인증 체계.

**어떻게 구현했는가**:
1. `JwtTokenProvider`가 `@PostConstruct`에서 Base64로 인코딩된 시크릿을 `Keys.hmacShaKeyFor`로 HMAC 키로 변환합니다.
2. Access Token(기본 30분)과 Refresh Token(기본 7일, `application.yml`의 `jwt.access-token-validity-in-seconds`/`refresh-token-validity-in-seconds`로 설정)을 각각 `type` 클레임(`access`/`refresh`)으로 구분해 발급합니다. 같은 서명 키를 쓰기 때문에 Access Token을 Refresh Token 자리에 넣는 공격을 `type` 클레임 검증(`validateTokenWithType`)으로 차단합니다.
3. `JwtAuthenticationFilter`(OncePerRequestFilter)가 `Authorization: Bearer` 헤더를 파싱하고, `validateAccessTokenResult`로 `VALID/EXPIRED/INVALID_SIGNATURE/MALFORMED/...` 등 세분화된 결과(`JwtValidationResult` enum)를 받아 로그와 예외 처리를 분기합니다.
4. 검증 성공 시 `CustomUserDetailsService.loadUserByUsername`에서 유저의 `isOnboardingCompleted()` 값에 따라 `ROLE_GUEST` 또는 `ROLE_STUDENT` 권한을 동적으로 부여합니다(권한을 토큰이 아닌 매 요청 시점의 DB 상태로 판단).

**선택지와 판단**: 권한을 JWT 클레임에 담아 캐싱하는 대신 매 요청 DB 조회로 판단하도록 한 이유는 코드에 명시되어 있지 않으나, 온보딩 완료 여부가 바뀌는 즉시(재로그인 없이) 권한이 반영되어야 하는 요구사항 때문으로 추정됩니다 (확인 필요: 트래픽 규모에서 이 방식의 조회 비용을 검토한 기록은 없음).

**코드 발췌** (`src/main/java/com/mr/global/security/jwt/JwtTokenProvider.java:105-129`):
```java
private JwtValidationResult validateTokenWithType(String token, String expectedType) {
    try {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        String tokenType = claims.get(TOKEN_TYPE_CLAIM, String.class);
        return expectedType.equals(tokenType) ? JwtValidationResult.VALID : JwtValidationResult.INVALID_TYPE;
    } catch (ExpiredJwtException e) {
        return JwtValidationResult.EXPIRED;
    } catch (SignatureException e) {
        return JwtValidationResult.INVALID_SIGNATURE;
    } catch (MalformedJwtException e) {
        return JwtValidationResult.MALFORMED;
    } catch (UnsupportedJwtException e) {
        return JwtValidationResult.UNSUPPORTED;
    } catch (JwtException | IllegalArgumentException e) {
        return JwtValidationResult.INVALID;
    }
}
```

## Refresh Token Rotation과 비관적 락(PESSIMISTIC_WRITE)

**무엇을 구현했는가**: Refresh Token 재발급(`POST /api/auth/reissue`) 시 기존 토큰을 즉시 무효화하고 새 토큰 세션을 발급하는 RTR(Refresh Token Rotation), 그리고 동시 재발급 요청에 대한 동시성 제어.

**어떻게 구현했는가**:
1. `SocialAuthRepository.findByRefreshTokenHashWithLock`에 `@Lock(LockModeType.PESSIMISTIC_WRITE)`를 건 JPQL 쿼리를 정의(`SELECT s FROM SocialAuth s WHERE s.refreshTokenHash = :refreshTokenHash`).
2. `AuthService.reissueToken`은 이 락 쿼리로 `SocialAuth` 행을 잠근 뒤, 새 Access/Refresh Token을 만들고 `socialAuth.updateRefreshToken(...)`으로 해시를 갱신합니다. 트랜잭션이 끝날 때까지 같은 행에 대한 다른 트랜잭션의 쓰기를 차단합니다.
3. `logout`에서도 동일한 락 쿼리를 사용해 토큰 무효화(`expireToken()`) 시점의 경쟁 상태를 막습니다.

**선택지와 판단**: 비관적 락 대신 버전 컬럼 기반 낙관적 락(`@Version`)을 쓰는 대안도 있었을 것으로 보이나, 이 레포에는 해당 대안이 시도된 흔적이 없어 **(확인 필요)**로 남깁니다. 커밋 메시지가 단순히 "동시성 락"(`cdc38d5`)으로만 남아있어, 왜 비관적 락을 택했는지에 대한 명시적 기록은 없습니다.

**코드 발췌** (`src/main/java/com/mr/domain/auth/repository/SocialAuthRepository.java`):
```java
public interface SocialAuthRepository extends JpaRepository<SocialAuth, Long> {

    List<SocialAuth> findAllByUser_UserId(Long userId);
    Optional<SocialAuth> findBySocialTypeAndSocialId(SocialType socialType, String socialId);
    Optional<SocialAuth> findByUser_UserIdAndSocialType(Long userId, SocialType socialType);
    Optional<SocialAuth> findByRefreshTokenHash(String refreshTokenHash);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SocialAuth s WHERE s.refreshTokenHash = :refreshTokenHash")
    Optional<SocialAuth> findByRefreshTokenHashWithLock(@Param("refreshTokenHash") String refreshTokenHash);
}
```

## OAuth 소셜 로그인 (Authorization Code + 임시 교환 코드)

**무엇을 구현했는가**: 카카오/구글 소셜 로그인을 Authorization Code 방식으로 처리하되, 백엔드 콜백에서 곧바로 JWT를 프론트엔드 URL 쿼리에 노출하지 않기 위해 1회성 임시 코드(`tempCode`)를 한 단계 더 거치는 흐름.

**어떻게 구현했는가**: 4장 "아키텍처"의 요청 흐름 참고. 핵심은 `AuthController.oAuthCallback`이 최종 JWT를 바로 리다이렉트 URL에 담지 않고, 2분 TTL의 `tempCode`(UUID)만 프론트엔드로 넘긴다는 점입니다. 프론트엔드는 이 코드를 다시 `POST /api/auth/token/exchange`로 교환해야 실제 JWT를 받을 수 있습니다. 이렇게 하면 Access/Refresh Token이 브라우저 히스토리·리퍼러·서버 로그에 노출될 위험을 줄입니다.

**선택지와 판단**: 코드 변천사에서 설계가 진화한 과정이 확인됩니다.
- 최초(커밋 `908f033`, 본인)에는 서버 인스턴스 메모리(`ConcurrentHashMap<String, TempExchangeData>`)에 임시 코드를 저장했습니다. 이 방식은 서버가 여러 인스턴스로 스케일아웃되면 로그인 요청과 토큰 교환 요청이 서로 다른 인스턴스로 라우팅될 경우 실패한다는 한계가 있습니다.
- 현재 코드(`OAuthTempCodeStore.java`, 팀원 ownue 작성)는 동일한 역할을 Redis(`StringRedisTemplate`)로 옮겨, 다중 인스턴스 환경에서도 동작하도록 개선되어 있습니다. 이 부분은 본인이 직접 작성하지 않았지만, 본인이 만든 `AuthService`/`AuthTransactionService`의 `prepareSocialLogin`/`completeTokenExchange` 분리 구조 위에서 저장소 구현체만 교체된 것으로 보입니다.
- `OAuthTempCodeStore.key()`가 원본 tempCode를 그대로 Redis 키로 쓰지 않고 SHA-256 해시로 변환해서 사용하는 점도 특징입니다(Redis 키 노출 시에도 원본 코드 역산 방지).

**코드 발췌** (`src/main/java/com/mr/domain/auth/controller/AuthController.java:222-236`, 본인 작성):
```java
try {
    String tempCode = authService.generateTempCodeByCode(
            socialType,
            code,
            backendOAuthRedirectUri,
            deviceInfo
    );
    String targetFrontendUrl = oAuthClientService.buildFrontendRedirectUrl(tempCode, frontendTargetRedirectUri);
    response.sendRedirect(targetFrontendUrl);
} catch (Exception e) {
    log.error("{} OAuth callback processing failed: {}", socialType, e.getMessage(), e);
    String errorRedirectUrl = oAuthClientService.buildFrontendErrorRedirectUrl("authentication_failed", frontendTargetRedirectUri);
    response.sendRedirect(errorRedirectUrl);
}
```

## 온보딩 상태 기반 ROLE 접근 제어

**무엇을 구현했는가**: 소셜 로그인은 했지만 프로필(닉네임 등) 등록을 마치지 않은 "온보딩 미완료" 사용자에게는 전체 API가 아닌, 온보딩에 필요한 최소한의 API(HTTP Method 단위)만 열어주는 접근 제어.

**어떻게 구현했는가**:
1. `CustomUserDetailsService`가 로그인 시점이 아닌 **매 요청 인증 시점**에 `user.isOnboardingCompleted()`를 보고 `ROLE_GUEST`/`ROLE_STUDENT`를 부여합니다.
2. `SecurityConfig`의 `ALLOWED_ONBOARDING_URLS`(`Map<HttpMethod, String[]>`)에 `POST /api/users/me/profile`(최초 프로필 등록), `GET /api/users/verify-nickname`(닉네임 중복 확인)만 `ROLE_GUEST`에게 허용하고, 나머지 모든 요청은 `hasAnyRole("STUDENT", "TEACHER", "ADMIN")`으로 차단합니다.
3. 이 코드에는 왜 HTTP Method까지 나눴는지 설명하는 팀 코멘트가 남아 있습니다: "`/api/users/me/profile`은 최초 등록(POST)만 허용 — GET/PATCH는 온보딩을 이미 마친 사용자를 전제로 하는 동작이라 GUEST에게 열어두면 서비스 레이어에서 STUDENT_NOT_FOUND 등 엉뚱한 오류로 이어진다."
4. 권한 부족 시 `JwtAccessDeniedHandler`가 인증 주체의 role을 다시 확인해, `ROLE_GUEST`이면 일반 `403 FORBIDDEN` 대신 `UserErrorStatus.ONBOARDING_REQUIRED`라는 좀 더 구체적인 에러 코드를 응답합니다(프론트엔드가 "권한 없음"과 "온보딩 필요"를 구분해서 처리할 수 있도록).

**선택지와 판단**: 이 기능은 이슈 #144에서 총 9개 커밋(본인 6개 + 팀원 3개)에 걸쳐 3단계로 점진적으로 발전했습니다. 자세한 변천 과정은 6장 트러블슈팅 "ROLE 기반 접근 제어 설계" 항목 참고.

**코드 발췌** (`src/main/java/com/mr/global/security/SecurityConfig.java:42-49, 71-76`):
```java
// 온보딩 미완료(ROLE_GUEST) 사용자에게도 허용할 (HTTP Method, URL) 조합.
// /api/users/me/profile은 최초 등록(POST)만 허용 — GET/PATCH는 온보딩을 이미 마친
// 사용자를 전제로 하는 동작이라 GUEST에게 열어두면 서비스 레이어에서 STUDENT_NOT_FOUND 등
// 엉뚱한 오류로 이어진다.
private static final Map<HttpMethod, String[]> ALLOWED_ONBOARDING_URLS = Map.of(
        HttpMethod.POST, new String[]{"/api/users/me/profile"},
        HttpMethod.GET, new String[]{"/api/users/verify-nickname"}
);
...
auth.requestMatchers(publicMatchers).permitAll();
ALLOWED_ONBOARDING_URLS.forEach((method, urls) ->
        auth.requestMatchers(method, urls).hasAnyRole("GUEST", "STUDENT", "TEACHER", "ADMIN"));
auth.anyRequest().hasAnyRole("STUDENT", "TEACHER", "ADMIN");
```

## 회원 탈퇴 시 연관 데이터 일괄 삭제

**무엇을 구현했는가**: 회원 탈퇴(`POST /api/auth/withdraw`) 시 17개 이상 테이블에 흩어진 사용자 연관 데이터를 참조 무결성 위반 없이 삭제.

**어떻게 구현했는가**: 6장 트러블슈팅 "#114 회원 탈퇴 참조 무결성 위반" 항목에서 상세히 다룹니다. 최종 구현은 `AuthService.withdraw()`에서 자식 엔티티(멘토 메시지 → 세션, 분석 리포트 → 분석 등 참조 방향의 역순)를 `@Modifying(clearAutomatically = true)` 벌크 삭제 쿼리로 순서대로 지운 뒤 `User`를 삭제합니다.

**코드 발췌** (`src/main/java/com/mr/domain/auth/service/AuthService.java:156-194`):
```java
@Transactional
public void withdraw(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new GeneralException(UserErrorStatus.USER_NOT_FOUND));

    studentInstrumentRepository.deleteAllByUserId(userId);
    studentRepository.deleteAllByUserId(userId);
    userLearningProgressRepository.deleteAllByUserId(userId);

    llmCallLogRepository.deleteAllByUserId(userId);
    mentorMessageRepository.deleteAllByUserId(userId);
    mentorChatSessionRepository.deleteAllByUserId(userId);

    weaknessNoteRepository.deleteAllByUserId(userId);
    analysisReportRepository.deleteAllByUserId(userId);
    analysisRepository.deleteAllByUserId(userId);
    // ... (playing, backingtrack, notification, statistics, subscription 등 동일 패턴)

    List<SocialAuth> socialAuths = socialAuthRepository.findAllByUser_UserId(userId);
    if (!socialAuths.isEmpty()) {
        socialAuths.forEach(SocialAuth::expireToken);
        socialAuthRepository.deleteAll(socialAuths);
    }
    userRepository.delete(user);
}
```

---

# 6. 트러블 슈팅

## #64 동시 소셜 로그인 시 유니크 제약 위반 (Lost Update 방지)

**문제 상황**: 같은 소셜 계정(예: 같은 카카오 계정)으로 짧은 시간 안에 두 번의 로그인 요청이 거의 동시에 들어오는 경우(예: 프론트엔드에서 중복 클릭, 또는 네트워크 재시도), 두 요청 모두 "기존 SocialAuth 없음 → 신규 생성"으로 분기해 동시에 `INSERT`를 시도할 수 있습니다. `social_auth` 테이블에는 `(social_type, social_id)` 복합 유니크 제약이 걸려 있어(`SocialAuth.java`의 `uk_social_auth_type_id`), 두 트랜잭션 중 하나는 `DataIntegrityViolationException`으로 실패합니다.

**원인 분석**: 코드 변천사(`git log -p`)로 추적한 결과 두 단계의 원인이 확인됩니다.
1. **고아 레코드(Orphan Record) 생성**: 최초 구현의 `AuthTransactionService.prepareSocialLogin`은 기존 `SocialAuth`가 없으면 그 자리에서 바로 `User`를 생성했습니다. 이후 단계(`completeTokenExchange`)가 실패하거나 동시 요청이 겹치면 `SocialAuth` 없이 `User`만 남는 고아 레코드가 생길 수 있는 구조였습니다. 커밋 `25e3dc0`(고아 레코드 방지)에서 `prepareSocialLogin`이 `User`를 바로 만들지 않고 `userId=null`만 반환하도록 바꾸고, 실제 `User` 생성(`registerNewUserByProfileUrl`)을 `completeTokenExchange` 단계로 지연시켰습니다(검증: `git show 25e3dc0` diff에서 `registerNewUser` 호출이 `prepareSocialLogin`에서 제거되고 `completeTokenExchange` 내부의 `userId == null` 분기로 이동한 것을 확인).
2. **유니크 제약 위반 미처리**: 위 수정 이후에도 `completeTokenExchange`는 "조회 후 없으면 생성"만 하고 유니크 제약 위반에 대한 예외 처리가 없어, 두 요청이 동시에 `else` 분기(신규 생성)에 진입하면 실패한 쪽은 그대로 500 에러로 전파되는 구조였습니다. `393755b` 커밋 메시지("유니크 위반 발생시 순서대로")로 보아 실제로 이 문제가 관찰되어 수정된 것으로 판단됩니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
|---|---|---|---|
| DB 유니크 제약 없이 애플리케이션 레벨에서만 중복 체크 | 예외 처리 불필요 | Race Condition에서 근본적으로 중복 생성 가능 (신뢰 불가) | 미채택 |
| 유니크 제약 + 예외 발생 시 그대로 500 반환 | 구현 단순 | 사용자에게 실패로 보이지만 실제로는 다른 요청이 이미 로그인 처리를 완료한 정상 상황 | 미채택(기존 방식, 문제의 원인) |
| 유니크 제약 + `DataIntegrityViolationException` catch 후 재조회하여 성공 응답으로 전환 | 사용자 입장에서는 항상 로그인 성공, DB 정합성은 유니크 제약이 보장 | 컨트롤러/서비스 계층에서 예외를 명시적으로 처리해야 하는 복잡도 증가 | **채택** |

**해결 과정**: `AuthTransactionService.completeTokenExchange`에서 `INSERT`(또는 `UPDATE`)를 시도하다 `DataIntegrityViolationException`이 발생하면, 이를 실패로 전파하지 않고 같은 메서드 안에서 `socialAuthRepository.findBySocialTypeAndSocialId`로 재조회해 이미 다른 트랜잭션이 만들어 둔 레코드를 가져와 정상 로그인 응답을 반환하도록 변경했습니다. 이후 `PostgreSQL은 제약 위반이 나는 즉시 트랜잭션 전체를 abort 상태로 만든다`는 제약 때문에(코드 주석 참고), 재조회 자체를 같은 트랜잭션이 아니라 **호출자(`AuthService`)가 새 트랜잭션에서 재시도**하도록 한 번 더 구조를 개선했습니다(`AuthService.socialLogin`이 `catch (DataIntegrityViolationException e)`로 `executeSocialLoginForExistingUser`를 별도 호출).

**코드 발췌 (변경 전, 일부)** — 유니크 제약 위반에 대한 처리가 없던 구조 (`git show 393755b`의 diff 좌측, `AuthTransactionService.java`):
```java
Optional<SocialAuth> optionalSocialAuth = socialAuthRepository.findBySocialTypeAndSocialId(socialType, socialId);
if (optionalSocialAuth.isPresent()) {
    SocialAuth socialAuth = optionalSocialAuth.get();
    socialAuth.updateRefreshToken(refreshTokenHash, expiryTime, deviceInfo);
} else {
    SocialAuth newSocialAuth = SocialAuth.create(user, socialType, socialId, refreshTokenHash, expiryTime, deviceInfo);
    socialAuthRepository.saveAndFlush(newSocialAuth);
}
```

**코드 발췌 (최종본)** (`src/main/java/com/mr/domain/auth/service/AuthService.java:70-79`):
```java
@Transactional(propagation = Propagation.NOT_SUPPORTED)
public AuthResponseDTO.LoginResponse socialLogin(SocialType socialType, String accessToken, String deviceInfo) {
    OAuthUserInfo userInfo = oAuthClientService.getUserInfo(socialType, accessToken);

    try {
        return authTransactionService.executeSocialLogin(socialType, userInfo, deviceInfo);
    } catch (DataIntegrityViolationException e) {
        return authTransactionService.executeSocialLoginForExistingUser(socialType, userInfo, deviceInfo);
    }
}
```

**결과**: 동시 로그인 요청 중 하나가 유니크 제약에 걸려도 사용자에게는 로그인 실패가 아닌 정상 응답이 돌아가도록 개선되었습니다. (수치 확인 필요: 실제 운영에서 이 경쟁 상태가 발생한 빈도나, 수정 전 오류율은 측정된 기록이 없습니다)

**근거**: 커밋 `908f033`(원자적 파이프 라인 적용), `393755b`(유니크 위반 발생시 순서대로), `25e3dc0`(고아 레코드 방지), `c477f0a`(macher 동기화), `c59586d`~`e52053e` 등 이슈 #64 전체 커밋 / PR #82 (`feat/#64-social-token-exchange`) / 파일: `src/main/java/com/mr/domain/auth/service/AuthTransactionService.java`, `AuthService.java`.

**배운 점**: (확인 필요: 이후 다른 도메인에서 동일한 "유니크 제약 + catch 후 재조회" 패턴을 재사용했는지는 이번 조사에서 확인되지 않음)

---

## #114 회원 탈퇴 시 참조 무결성 위반 (FK Constraint Violation)

**문제 상황**: 회원 탈퇴(`AuthService.withdraw`) 시 `User` 엔티티를 먼저 삭제하거나, 자식 엔티티들을 참조 순서를 고려하지 않고 삭제하면 외래키(FK) 제약 조건 위반이 발생합니다. 브랜치명이 `hotfix/#114-withdraw-hard-delete`인 것으로 보아 이 문제는 운영 또는 QA 단계에서 실제로 발견되어 hotfix로 처리된 것으로 추정됩니다.

**원인 분석**: 커밋 히스토리를 순서대로 추적한 결과, 문제는 두 가지 층위였습니다.
1. **삭제 대상 자체가 부재**: 초기에는 `user_id`를 참조하는 여러 엔티티(분석 리포트, 학습 진도, 멘토 채팅, 알림, 통계, 구독 등)에 대해 `deleteAllByUserId` 같은 일괄 삭제 메서드 자체가 없어 `User` 삭제 시 FK 위반이 발생했습니다(커밋 `df59eed`: 17개 리포지토리에 `@Modifying` 삭제 메서드 신규 추가).
2. **삭제 순서 문제**: 멘토 메시지(`MentorMessage`)가 멘토 채팅 세션(`MentorChatSession`)을 참조하고, 코드 진행(`ChordProgression`)이 백킹트랙(`BackingTrack`)을 참조하는 등 엔티티 간 참조 관계가 있어, 참조되는 쪽을 먼저 지워버리면 참조하는 쪽에서 FK 위반이 납니다. 커밋 `7a62a02`(백킹트랙 자식 엔티티 먼저 일괄 삭제), `587caf1`(llm 자식 엔티티 먼저 일괄 삭제)에서 삭제 순서를 자식 → 부모로 재배치했습니다.
3. **영속성 컨텍스트 캐시 문제**: `@Modifying` 벌크 삭제 쿼리는 JPA 영속성 컨텍스트(1차 캐시)를 자동으로 갱신하지 않습니다. 커밋 `75095e0`에서 전 리포지토리의 `@Modifying`에 `clearAutomatically = true`를 추가해, 벌크 삭제 이후 영속성 컨텍스트를 비워 이후 조회가 DB의 최신 상태(삭제된 상태)를 정확히 반영하도록 했습니다.
4. **최종 순서 보장**: 커밋 `68a2822`에서 `weaknessNoteRepository.deleteAllByUserId(userId)` 호출 위치를 트랜잭션 읽기/쓰기 순서상 더 적절한 위치로 재배치해 "LlmCallLog, WeaknessNote 최적 선삭제 순서"를 최종적으로 보장했습니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
|---|---|---|---|
| DB에 `ON DELETE CASCADE` 설정 | 애플리케이션 코드 불필요 | 이번 조사에서 Flyway 마이그레이션에 CASCADE 관련 변경이 확인되지 않음 (스키마가 이미 FK 제약을 갖고 있었는지, CASCADE 옵션 자체가 검토됐는지는 확인 필요) | 미채택으로 추정 |
| JPA 연관관계 `cascade = REMOVE` / `orphanRemoval` | 엔티티 그래프 순회로 자동 삭제 | 대량 데이터 삭제 시 N+1 개별 DELETE 쿼리 발생 가능, 연관관계 양방향 설정 필요 | 미채택으로 추정(코드에 흔적 없음) |
| Repository별 `@Modifying` 벌크 삭제 쿼리를 참조 역순으로 명시적 호출 | 삭제 순서를 코드로 명확히 제어 가능, 벌크 쿼리라 대량 삭제 시에도 쿼리 수가 적음 | 새 연관 테이블이 추가될 때마다 `withdraw()`에 수동으로 추가해야 함(순서를 사람이 관리) | **채택** |

**해결 과정**: 위 원인 분석의 1~4단계를 그대로 반영해, 현재 `AuthService.withdraw()`는 자식 → 부모 순서로 17개 이상의 `deleteAllByUserId` 벌크 삭제를 명시적으로 호출한 뒤 `SocialAuth`를 만료·삭제하고 마지막에 `User`를 삭제합니다(5장 "회원 탈퇴 시 연관 데이터 일괄 삭제" 코드 발췌 참고).

**코드 발췌 (변경 전)** — 리포지토리에 삭제 메서드가 없던 시점의 `AnalysisReportRepository` (`git show df59eed`의 diff 기준 이전 상태):
```java
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {
    Optional<AnalysisReport> findFirstByAnalysisIdAndLlmStatusOrderByCreatedAtDesc(
            Long analysisId, LlmStatus llmStatus);
    // deleteAllByUserId 없음 → User 삭제 시 FK 위반
}
```

**코드 발췌 (변경 후)** (`src/main/java/com/mr/domain/analysis/repository/AnalysisReportRepository.java`):
```java
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {
    Optional<AnalysisReport> findFirstByAnalysisIdAndLlmStatusOrderByCreatedAtDesc(
            Long analysisId, LlmStatus llmStatus);

    @Modifying(clearAutomatically = true)
    @Query("delete from AnalysisReport ar where ar.analysis.user.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
```

**결과**: 회원 탈퇴 API가 FK 위반 없이 완료되도록 수정되었습니다. (수치 확인 필요: hotfix 이전 실패율이나 영향받은 사용자 수는 기록되어 있지 않음). 이 수정으로 17개 리포지토리에 걸쳐 135줄이 추가되었습니다(`git show df59eed --stat` 기준 1차 커밋만).

**근거**: 커밋 `df59eed`, `2473882`, `7a62a02`, `587caf1`, `75095e0`, `68a2822`, `ef3073e` (총 7건, 모두 본인 작성) / PR #115 (`hotfix/#114-withdraw-hard-delete`) / 파일: `src/main/java/com/mr/domain/auth/service/AuthService.java` 및 17개 도메인 리포지토리.

**배운 점**: 동일한 "부모-자식 참조 관계를 고려한 삭제 순서 + `clearAutomatically = true`" 패턴이 `SubscriptionRepository`, `UsageLimitRepository`, `WeaknessNoteRepository` 등 본인이 관여하지 않은 다른 리포지토리에도 동일하게 적용된 것이 `75095e0` 커밋에서 확인되어, 이 문제 해결 패턴이 팀 내에서 표준으로 자리잡은 것으로 보입니다.

---

## #144 ROLE 기반 온보딩 접근 제어 설계

**문제 상황**: 최초 구현에서는 `SecurityConfig`가 `PUBLIC_URLS`(로그인/콜백 등)를 제외한 모든 요청에 대해 `.anyRequest().authenticated()`만 적용했습니다. 즉 JWT만 유효하면 온보딩(프로필 등록)을 마치지 않은 사용자도 모든 API(예: 학습 진도 저장, 연주 분석 요청 등)를 호출할 수 있었고, 이 경우 서비스 레이어에서 `Student` 엔티티가 없어 `STUDENT_NOT_FOUND` 같은 의미 없는 에러가 사용자에게 노출될 수 있는 상태였습니다(코드 주석 명시).

**원인 분석**: 최초 설계는 "인증 여부"만 확인했을 뿐 "온보딩 완료 여부"라는 비즈니스 상태를 인가 계층에 반영하지 않았습니다. 이를 인지한 후 3단계로 나눠 좁혀나간 과정이 커밋 로그에 남아 있습니다.

**검토한 대안 / 실제 반영 과정 (시간순)**:

| 단계 | 커밋 | 변경 내용 | 채택 여부 |
|---|---|---|---|
| 1 | `1fe81c7` | 온보딩 시 학생 권한 부여 로직 추가(권한 승격의 트리거 마련) | 채택(기반 작업) |
| 2 | `0ef6cef` | 온보딩 관련 예외 케이스 추가 | 채택 |
| 3 | `ce94fc9` | 403 Forbidden 대신 `UserErrorStatus.ONBOARDING_REQUIRED` 응답(에러 메시지 구체화) | 채택 |
| 4 | `3b5fca6` | URL 전체 허용에서 "온보딩 허용 URL만 별도 분리 + ROLE 제한"으로 변경 (`.anyRequest().authenticated()` → `.anyRequest().hasAnyRole(...)`) | 채택 |
| 5 | `1da91f7`(팀원 p1001q) | URL 단위 허용을 HTTP Method 단위(`Map<HttpMethod, String[]>`)로 더 좁힘 (GET/PATCH `/api/users/me/profile`을 GUEST에게 열어두면 온보딩 완료를 전제한 로직에서 오류 발생) | 채택(최종) |

대안으로 "온보딩 여부를 매번 서비스 레이어에서 개별 검사"하는 방식도 있었을 것으로 보이나, 이는 검사 누락 위험이 크고 횡단 관심사를 인가 계층(Security Filter)이 아닌 각 서비스 메서드에 흩뿌리는 결과를 낳습니다. 실제 코드는 인가 계층(SecurityConfig)에서 통제하는 방식을 최종 채택했습니다.

**해결 과정**: 최종적으로 `SecurityConfig`는 `PUBLIC_URLS`(인증 불필요), `ALLOWED_ONBOARDING_URLS`(GUEST까지 허용, HTTP Method 단위로 세분화), 그 외 전체(`STUDENT` 이상만 허용) 3단계로 인가 규칙을 나눕니다(5장 코드 발췌 참고). 이후 `af84590`, `e647da0`, `7dcc2e1`(본인 + 팀원) 커밋으로 이 접근 제어 로직에 대한 통합 테스트를 추가했습니다.

**코드 발췌 (변경 전)** — 온보딩 상태를 구분하지 않던 최초 인가 규칙:
```java
.authorizeHttpRequests(auth -> auth
        .requestMatchers(matchers).permitAll()
        .anyRequest().authenticated()
)
```

**코드 발췌 (변경 후, 중간 단계 — `3b5fca6`)**:
```java
.authorizeHttpRequests(auth -> auth
        .requestMatchers(publicMatchers).permitAll()
        .requestMatchers(onboardingMatchers).hasAnyRole("GUEST", "STUDENT", "TEACHER", "ADMIN")
        .anyRequest().hasAnyRole("STUDENT", "TEACHER", "ADMIN")
)
```
(HTTP Method 단위로 더 좁힌 최종본은 5장 "온보딩 상태 기반 ROLE 접근 제어" 코드 발췌 참고)

**결과**: 온보딩 미완료 사용자가 호출 가능한 API 표면적이 "인증된 모든 API"에서 "프로필 등록(POST)과 닉네임 중복 확인(GET) 단 2개 엔드포인트"로 축소되었습니다. (수치 확인 필요: 수정 전 실제로 잘못된 API 호출이 얼마나 발생했는지는 기록 없음)

**근거**: 커밋 `1fe81c7`, `0ef6cef`, `ce94fc9`, `3b5fca6`, `330ddc7`, `e647da0`(이상 본인) + `1da91f7`, `af84590`, `7dcc2e1`(팀원) / 이슈·PR #144, #149 (`feat/#144-onboarding-interceptor`) / 파일: `src/main/java/com/mr/global/security/SecurityConfig.java`, `JwtAccessDeniedHandler.java`.

**배운 점**: (확인 필요: 이 "인가 계층에서 상태 기반 접근 제어를 처리"하는 패턴을 다른 상태 플래그에도 재사용했는지는 확인되지 않음)

---

# 7. 결과

- **테스트 현황**: 저장소 전체 `src/test` 하위 63개 파일, `@Test` 447건 (2026-09-29 작업 트리 기준 grep 집계). 본인 담당 영역(인증/보안)에는 `AuthServiceTest`, `AuthTransactionServiceTest`, `OAuthClientServiceTest`, `OAuthTempCodeStoreTest`, `JwtTokenProviderTest`, `JwtAuthenticationFilterTest`, `JwtAccessDeniedHandlerTest`, `SecurityConfigTest` 등 8개 테스트 파일이 존재합니다.
- **CI**: GitHub Actions로 PR마다 PostgreSQL 16 + Redis 7 컨테이너를 띄워 전체 빌드·테스트를 자동 실행합니다 (`.github/workflows/ci.yml`). (수치 확인 필요: 실제 CI 성공률, 평균 빌드 시간 등은 GitHub Actions 대시보드에서 별도 확인 필요)
- **배포**: main 브랜치 push 시 Docker 이미지가 자동 빌드되어 Docker Hub를 거쳐 EC2에 배포됩니다(`.github/workflows/cd.yml`). 서비스 URL: https://www.musereview.site/
- **정량 지표**: 본인 커밋 206건(전체 951커밋 중), 본인이 최다 기여자인 핵심 파일 3개(`AuthService.java` 45커밋, `AuthController.java` 31커밋, `OAuthClientService.java` 30커밋).
- **수상/외부 인증 이력**: (확인 필요 — 레포 내에서 확인되는 근거 없음)

---

# 8. 회고

- **usage_limit 기능의 추가와 제거**: 본인이 초기에 `feat/#75-usage-limit` 브랜치에서 `UsageLimit` 엔티티와 관련 로직을 설계·구현했으나(커밋 `6e40de7` 등), 이후 이슈 #200/#230/#231에서 관련 코드가 전량 삭제되었습니다(`18473b0`: `AuthService.java`에서 10줄, `UsageLimit.java` 109줄, `UsageLimitRepository.java` 14줄 삭제). 삭제 사유가 커밋 메시지에 남아있지 않아 정확한 배경은 **(확인 필요)**이지만, 사용량 제한이라는 제품 정책 자체가 재검토되었을 가능성이 있습니다. 다시 한다면, 기능을 구현하기 전에 정책이 확정적인지, 아니면 실험적 기능인지를 먼저 확인해 초기 설계에 반영했을 것 같습니다.
- **회원 탈퇴 로직(#114)이 hotfix로 처리된 점**: `withdraw()`가 관여하는 연관 테이블이 17개 이상이라는 점을 감안하면, 애초에 도메인이 늘어날 때마다 삭제 로직을 수동으로 추가해야 하는 현재 구조는 새 도메인 추가 시 이 메서드를 빠뜨릴 위험이 있습니다. 다시 설계한다면 도메인별로 "회원 탈퇴 시 처리할 작업"을 이벤트 리스너(`UserWithdrawnEvent`)로 등록하게 해서, `AuthService`가 각 리포지토리를 직접 알 필요가 없도록 관심사를 분리했을 것 같습니다. (다만 이는 사후 판단이며, 실제 대안이 코드에서 검토된 흔적은 없어 어디까지나 회고입니다.)
- **동시성 제어(#42, #64)에 대한 문서화 부족**: `@Lock(PESSIMISTIC_WRITE)` 적용이나 유니크 제약 예외 처리 모두 커밋 메시지가 "동시성 락", "유니크 위반 발생시 순서대로" 정도로 짧게 남아 있어, 왜 그 방식을 택했는지에 대한 설계 의도가 코드/커밋에 충분히 기록되지 않았습니다. 다시 한다면 이런 동시성 관련 결정은 PR 설명이나 ADR(Architecture Decision Record) 형태로 남겼을 것 같습니다.

---

# 9. 스크린샷 및 문서 제안

이번 조사 시점(2026-09-29) 기준, 레포 안에는 스크린샷·ERD·다이어그램 파일이 존재하지 않습니다(`*.png`, `*.jpg`, `*.pdf`, `docs/` 디렉터리 등을 검색했으나 결과 없음). 아래는 새로 촬영/제작을 제안하는 목록입니다.

| 파일명(제안) | 촬영/제작할 화면 | 들어갈 섹션 |
|---|---|---|
| `swagger-auth-overview.png` | `http://localhost:8080/swagger-ui/index.html`에서 `/api/auth` 태그 엔드포인트 목록 전체 화면 | 4장 API 및 인터페이스 |
| `swagger-auth-withdraw-example.png` | `POST /api/auth/withdraw`의 Swagger 응답 예시 확장 화면 | 5장 "회원 탈퇴" |
| `oauth-sequence-diagram.png` | 4장 "아키텍처"에 서술한 OAuth 5단계 흐름(브라우저 → 콜백 → tempCode → 교환)을 시퀀스 다이어그램으로 새로 제작 | 4장 아키텍처, 5장 OAuth 항목 |
| `withdraw-erd-diagram.png` | `AuthService.withdraw()`가 삭제하는 17개 테이블과 `User`의 관계를 ERD로 새로 제작 | 6장 "#114" 트러블슈팅 |
| `security-role-flowchart.png` | `PUBLIC_URLS` / `ALLOWED_ONBOARDING_URLS` / 그 외 요청이 각각 어떤 ROLE 조건으로 분기되는지 플로우차트로 새로 제작 | 5장 "온보딩 ROLE 접근 제어" |
| `github-actions-cd-run.png` | 실제 GitHub Actions `cd.yml` 실행 로그(EC2 배포 단계) 캡처 | 4장 인프라 및 배포 |
| `ci-test-report.png` | 실패한 PR의 "Print test failure summary" 또는 성공한 빌드의 테스트 요약 캡처 | 7장 결과 |

---

# 10. 확인 필요 항목

## 본인이 직접 채워야 하는 정보

- 정확한 팀 인원 수와 각자의 역할(본 조사는 git 커밋 작성자 수로만 추정: 최소 5~6명).
- 서비스의 정확한 타깃 사용자층과 한 줄 소개 문구(README에 명시되어 있지 않음, 배포 URL의 실제 랜딩 페이지 문구 확인 권장).
- usage_limit 기능이 삭제된 정확한 이유(정책 변경/스코프 축소 여부).
- `@Lock(PESSIMISTIC_WRITE)`를 채택할 때 낙관적 락 등 다른 대안을 실제로 검토했는지 여부.
- PostgreSQL 버전: 로컬(`docker-compose.local.yml`)은 README와 동일하게 `postgres:18`을 쓰지만, CI(`ci.yml`)만 `postgres:16` 이미지를 사용합니다. CI가 다른 버전을 쓰는 것이 의도적 선택(호환성/속도)인지 단순 미갱신인지, 그리고 실제 운영(EC2) DB 버전이 18과 동일한지 확인 필요.
- 배포 주소(https://www.musereview.site/)가 포트폴리오 공개 시점까지 계속 운영되는지 여부.
- GitHub PR 코멘트/리뷰 상세 내용 — 이번 조사는 `gh auth login`이 설정되어 있지 않아 PR 본문·리뷰 코멘트를 API로 가져오지 못했습니다. 필요하면 `gh auth login` 이후 `gh pr view <번호>`로 보완 가능합니다.

## 근거 부족으로 제외한 트러블슈팅 후보

- **usage_limit 삭제(#200, #230, #231)**: "코드가 삭제되었다"는 사실은 확인되지만, 삭제에 이르게 된 문제 상황(버그였는지, 정책 변경이었는지)에 대한 근거가 커밋 메시지나 코드에 없어 트러블슈팅 항목으로 넣지 않고 8장 회고로만 다뤘습니다.
- **#42 동시성 락**: 실제 장애나 버그 리포트로 이어진 정황(에러 로그, 재현 조건 등)이 커밋 메시지에 없고 "동시성 락 적용"이라는 사전적/예방적 조치로 보여, 트러블슈팅이 아닌 5장 핵심 구현으로 분류했습니다.
- **#176(fix: url 안쓰는 것 정리, fix: url 수정)**: 본인 커밋이지만 diff 확인 결과 단순 정리성 변경으로 판단되어 트러블슈팅 규모의 서사(문제-원인-해결)를 구성하기 어려워 제외했습니다.

---

# 11. 면접 예상 질문

- **Q. Refresh Token 재발급에 비관적 락(PESSIMISTIC_WRITE)을 쓴 이유는? 낙관적 락과 비교했을 때 트레이드오프는?**
  커밋 메시지에 구체적 판단 근거가 남아있지 않으므로, 실제 답변 전에 "재발급 요청 빈도가 얼마나 됐는지", "낙관적 락으로 재시도할 경우 클라이언트 UX에 미치는 영향을 검토했는지"를 스스로 정리해 둘 필요가 있습니다.
- **Q. DataIntegrityViolationException을 catch해서 재조회하는 방식이 일반적인 "try-catch로 예외를 숨기는" 안티패턴과 어떻게 다른가?**
  PostgreSQL의 트랜잭션 abort 특성(코드 주석에 명시)과, 왜 재조회를 같은 트랜잭션이 아닌 새 트랜잭션(`Propagation.NOT_SUPPORTED` 조합)에서 해야 했는지를 설명할 수 있어야 합니다.
- **Q. 회원 탈퇴 로직이 17개 이상의 리포지토리를 직접 호출하는 구조인데, 새 도메인이 추가될 때마다 이 메서드를 빠뜨리지 않는다는 보장이 있는가?**
  현재 구조상 컴파일 타임에 강제되지 않는 부분이므로, 실제로 이 리스크를 어떻게 인지하고 있었는지, 이벤트 기반 등 대안을 고려했는지 답변을 준비해 둘 필요가 있습니다(8장 회고 참고, 실제로 시도되지 않은 대안이므로 "이렇게 했다"가 아니라 "이렇게 개선할 수 있을 것 같다"는 톤으로 답해야 합니다).
- **Q. ROLE_GUEST/ROLE_STUDENT를 JWT 클레임이 아니라 매 요청 DB 조회로 판단하게 한 이유는? 트래픽이 늘어나면 어떤 문제가 생길 수 있는가?**
  설계 의도가 코드에 명시되어 있지 않으므로, 실제 서비스 트래픽 규모와 이 조회가 성능에 미치는 영향을 직접 측정해보고 답변을 준비하는 것을 권장합니다.
- **Q. usage_limit 기능을 만들었다가 지운 경험에서 무엇을 배웠는가?**
  삭제 사유가 레포에 명시되어 있지 않으므로, 실제 배경(정책 변경/우선순위 조정 등)을 본인 기억에 근거해 준비해야 합니다.
