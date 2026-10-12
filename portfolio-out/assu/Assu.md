# 1. 3분 요약

| 항목 | 내용 |
|---|---|
| 프로젝트명 | Assu (레포지토리명 `ASSU_BE`, `settings.gradle:14` 기준 Gradle 프로젝트명 `Assu`) |
| 한 줄 소개 | 숭실대학교 학생, 학생회(관리자), 제휴업체, 운영자가 함께 쓰는 교내 제휴 혜택 플랫폼의 Spring Boot 백엔드 (`도메인모델.md:5`) |
| 이 레포의 성격 | Spring Boot 3.5.3 / Java 17 백엔드 단일 레포 (`build.gradle`, `AGENTS.md`) |
| 내 git author | `kimyw1018 <poppppp00@gmail.com>`, `김예원 <164151329+kimyw1018@users.noreply.github.com>` (`git shortlog -sne` 기준 두 식별자 72건 + 10건 = 82건) |
| 지원 직무 | 백엔드 개발자 (레포 성격 기준 추정값, **확인 필요**: 실제 지원 직무 확정 필요) |
| 기간 | 2025-08-05(첫 커밋 `f9469dc`) ~ 2026-10-07(최신 커밋 `87e4c51`, PR #505 기준 아직 미병합) |
| 팀 구성 | git 커밋 작성자 기준 총 6명으로 추정 (`git shortlog -sne --all`에서 이메일/별칭을 동일인으로 묶은 결과: MiN, 이호근(2ghrms), eeeeeaaan/Heeya, BAEK0111, 김예원(본인), SJ Hwang) |
| 담당 범위 요약 | 리뷰/학생회 대시보드 초기 구현(#13, #98), 스탬프 적립-자동 응모(#234), 백오피스 신고 관리(#372), 홈 큐레이션 수동/자동 추천(#441), 전역 Swagger 에러코드 자동 노출(#504), API 패키지 구조·문서 포맷 리팩토링(#234, #294, #301, #310, #344) |
| 스택 요약 | Spring Boot 3.5.3, Java 17, Spring Data JPA, Spring Security, Redis, RabbitMQ, MariaDB/H2, Hibernate Spatial, JWT(jjwt), AWS S3, Firebase Admin(FCM), SpringDoc OpenAPI, WebSocket/STOMP |
| 링크 | GitHub: `https://github.com/ASSU-dev/ASSU_BE` (org `ASSU-dev`). 배포 주소 등 공개 URL은 **확인 필요** |

## 핵심 성과

- **97개 에러코드를 34개 컨트롤러에 자동 문서화**: `ErrorStatus` enum(97개 상수, `src/main/java/com/assu/server/global/apiPayload/code/status/ErrorStatus.java`, 161줄) 중 각 핸들러가 실제로 던질 수 있는 코드만 추적해 `SwaggerErrorCodes`(494줄)로 매핑하고, `SwaggerConfig`의 `OperationCustomizer`로 Swagger 응답 예시에 자동 반영했습니다. 측정 조건: 커밋 `87e4c51` 기준 33개 파일, 34개 컨트롤러 변경 (PR #505, 2026-10-07, 아직 미병합).
- **패키지 리팩토링 직후 발생한 런타임 쿼리 오류를 당일 핫픽스로 해결**: `#310`에서 `domain/mapping` 패키지를 `domain/admin`으로 옮기는 과정에서 JPQL 문자열에 하드코딩된 FQCN(패키지 전체 경로)이 갱신되지 않아 발생한 오류를 `#344`에서 4개 커밋(쿼리 수정 → Pageable 구조 전환 → enum 파라미터 바인딩 → DTO 생성자 표현식 경로 수정)으로 해결했습니다. 근거: 커밋 `50937b6`, `29ee3c9`, `a385e20`, `a61e25d` (PR #345, 2026-05-25, 같은 날 전부 병합).

---

# 2. 개요

## 배경과 문제

Assu는 숭실대학교 학생, 학생회(ADMIN), 제휴업체(PARTNER), 운영자(BACKOFFICE) 네 역할이 참여하는 교내 제휴 혜택 플랫폼입니다(`도메인모델.md:3-8`). 학생회가 제휴업체와 계약(Paper)을 맺고, 학생은 QR 스캔으로 혜택을 사용하며, 운영자는 회원 승인·신고 처리·알림 발송 등을 담당합니다.

레포 안에서 확인되는 기술적으로 어려웠던 지점은 다음과 같습니다.

- **역할별로 다른 회원 모델을 하나의 `Member` 애그리거트로 통합**: `Member`는 역할(STUDENT/ADMIN/PARTNER/BACKOFFICE)에 따라 `Student`/`Admin`/`Partner`/`BackofficeUser` 중 하나와만 1:1 관계를 가지도록 설계되어 있습니다(`도메인모델.md:27-42`). 역할마다 응답에 노출해야 하는 이름(학생 이름/학생회 단체명/업체명)이 다르기 때문에 `resolveName()` 같은 행위 메서드로 분기를 흡수합니다.
- **알림 발송의 유실 없는 비동기 처리**: `NotificationOutbox` 테이블에 먼저 저장한 뒤 트랜잭션 커밋 후 RabbitMQ로 발행하는 Outbox 패턴을 사용합니다(`도메인모델.md:341-354`, `용어사전.md:34`). 알림 발송 자체가 실패해도 핵심 비즈니스 로직(예: 스탬프 적립)은 성공해야 한다는 요구사항이 있었습니다(아래 5장, 6장에서 상세 설명).
- **패키지 구조 변경의 런타임 리스크**: 이 레포는 `domain/mapping` → `domain/admin`, `domain/user` → `domain/student` 처럼 도메인 패키지 이름을 여러 차례 재정비했습니다(REFACTOR #234, #310 등). JPQL `@Query` 문자열이나 생성자 표현식에 하드코딩된 FQCN은 IDE의 자동 패키지 이동 리팩토링 대상에서 빠지기 때문에, 컴파일은 되지만 런타임에만 깨지는 문제가 반복적으로 발생했습니다(6장 트러블슈팅 참고).

## 담당 범위

### 내가 작성한 디렉터리/기능 (근거 경로 포함)

`git log --author` 기준으로 내가 변경한 파일을 집계하면 아래 영역에 집중되어 있습니다.

| 영역 | 주요 경로 | 관련 이슈/PR |
|---|---|---|
| 리뷰 작성/조회/삭제, S3 이미지 | `domain/review/service/ReviewServiceImpl.java`(12건 변경), `domain/review/controller/ReviewController.java`(11건), `domain/review/converter/ReviewConverter.java`(7건) | #13 (PR #30) |
| 학생회 대시보드 통계 API (StudentAdmin, 현재 `domain/admin`) | `domain/admin/service/StudentAdminServiceImpl.java`(과거 경로 기준 13건 변경), `domain/admin/repository/StudentAdminRepository.java`(12건), `domain/admin/controller/StudentAdminController.java`(11건) | #13, #98 (PR #30, #99, #219) |
| 스탬프 적립/자동 이벤트 응모 | `domain/student/service/StudentServiceImpl.java`(`addStamp`), `domain/student/entity/StampEventApplicant.java`, `domain/student/repository/StampEventApplicantRepository.java` | #234 (PR #239) |
| 매칭 추천(랜덤 오프셋) 쿼리 및 핫픽스 | `domain/admin/repository/AdminRepository.java`(7건), `domain/partner/repository/PartnerRepository.java`(4건), `domain/admin/service/AdminServiceImpl.java`(3건) | #344 (PR #345) |
| 백오피스 신고 관리 | `domain/backoffice/controller/BackofficeReportController.java`, `domain/backoffice/service/BackofficeReportServiceImpl.java`, `domain/report/repository/ReportRepository.java` | #372 (PR #373) |
| 홈 큐레이션(수동 설정 + 평점 기반 자동 추천) | `domain/backoffice/controller/BackofficeHomeCurationController.java`, `domain/backoffice/service/BackofficeHomeCurationServiceImpl.java`(244줄 신규), `domain/student/entity/HomeCuration.java`, `domain/student/entity/HomeCurationItem.java` | #441 (PR #442) |
| Swagger 에러코드 자동 노출 | `global/config/SwaggerConfig.java`, `global/apiPayload/code/status/SwaggerErrorCodes.java`, `global/exception/annotation/ApiErrorCodeExamples.java` + 34개 컨트롤러 | #504 (PR #505, 미병합) |
| API 문서/DTO 포맷 통일, 패키지 구조 정리 | 전역 컨트롤러 `@Operation` description, `domain/mapping` → `domain/admin` 패키지 이동 | #234, #294, #301, #310 (PR #239, #295, #303, #311) |

`git log --author="poppppp00@gmail.com|164151329+kimyw1018" -i --all` 기준 총 82개 커밋, 11개 PR이 병합되었고(#30, #99, #219, #239, #295, #303, #311, #345, #373, #398, #442), 1개 PR(#505)이 열려 있으며, 2개 PR(#76, #302)은 병합 없이 닫혔습니다.

**테스트 코드 작성 여부**: `git log --author ... -- 'src/test/**'`로 확인한 결과 내가 직접 작성한 테스트 파일은 없고(`src/test/resources/application-secret.yml` 리소스 변경 1건만 존재), 현재 `AdminServiceImplTest.java`/`StudentAdminServiceImplTest.java`는 다른 팀원(`2ghrms`)이 `TEST/#378`에서 전 도메인 일괄 작성한 것입니다. 이 부분은 10장 "확인 필요 항목"에도 다시 적어둡니다.

### 타인 작성 영역과 협업 방식

- **인증/인가 체계**(`domain/auth/**`, `global/security/**`)는 거의 전량 다른 팀원이 작성했습니다. 내가 직접 수정한 파일은 `domain/auth/service/SignUpServiceImpl.java`(2건) 정도입니다.
- **알림/Outbox, 채팅, 제휴 계약(Partnership), 메트릭(Micrometer/Grafana)**: `feat/#487-add-domain-metrics`, `feat/#497-auth-failure-metrics` 등 최근 메트릭 관련 커밋(`55ed738`, `9e50aae`)은 `MiN` 작성입니다.
- **인프라/CI-CD**(Dockerfile, docker-compose, GitHub Actions, ArgoCD manifest): `2ghrms`(이호근), `BAEK0111`이 주로 작성했습니다 (`git log --follow -- docker-compose.yml` 기준).
- **협업 방식**: PR 템플릿(`.github/PULL_REQUEST_TEMPLATE.md`)에 연관 이슈/작업 내용/코드 설명/고민사항 섹션이 있고, 브랜치 네이밍은 `<type>/#<issue>-<description>` 컨벤션(`AGENTS.md`)을 따릅니다. CodeRabbit AI 리뷰 봇이 `.coderabbit.yaml`로 설정되어 모든 PR에 1차 리뷰를 수행합니다. 명세는 Notion/기획 문서 링크를 `@Operation` description에 버전 헤더로 남기는 방식(`개발가이드.md:184-207`)을 사용합니다.

---

# 3. 기술 스택

빌드 파일(`build.gradle`)에서 버전까지 확인되는 항목만 정리했습니다. 선택 이유는 레포 내 문서/커밋에 근거가 있는 것만 적었습니다.

| 분야 | 기술 | 버전 | 선택 이유 |
|---|---|---|---|
| 언어/런타임 | Java | 17 (toolchain) | (확인 필요) |
| 프레임워크 | Spring Boot | 3.5.3 | (확인 필요) |
| 빌드 도구 | Gradle | wrapper 8.4.0 (`Dockerfile`의 `gradle:8.4.0-jdk17` 이미지 기준) | - |
| ORM | Spring Data JPA (Hibernate) | spring-boot-starter-data-jpa | 계층형 DDD 구조에서 Domain/Repository 분리를 위해 사용 (`개발가이드.md:1-20`) |
| 공간 데이터 | Hibernate Spatial + `org.locationtech.jts:jts-core` | 1.19.0 | 가게/학생회/제휴업체의 위경도 좌표(`Point`) 저장과 반경 검색(`ST_Contains`, `ST_GeomFromText`)에 사용 (`도메인모델.md:140`, `AdminRepository.java`) |
| DB (운영) | MariaDB | `mariadb-java-client:3.4.1` | - |
| DB (테스트) | H2 (in-memory) | `com.h2database:h2` (runtime) | `src/test/resources/application-test.yml` |
| 인증 | Spring Security + JWT | `jjwt:0.11.5` | Bearer JWT, 역할별 인증 체인 분리(`CLAUDE.md` 인증 흐름 섹션) |
| 캐시/세션 | Spring Data Redis | spring-boot-starter-data-redis | Refresh Token 저장/회전, Access Token 블랙리스트 |
| 메시지 브로커 | Spring AMQP (RabbitMQ) | spring-boot-starter-amqp | 알림 Outbox 패턴 발행 |
| 실시간 통신 | spring-boot-starter-websocket + spring-security-messaging | - | 그룹 QR 인증, 채팅 |
| 비동기 HTTP | Spring WebFlux (WebClient) | spring-boot-starter-webflux | 외부 API(Kakao Local, USaint) 호출용으로 추정 (확인 필요: 실제 WebClient 사용 지점) |
| 배치 | Spring Batch | spring-boot-starter-batch | (확인 필요: 실제 Job 정의 위치) |
| 파일 스토리지 | AWS SDK S3 | BOM `2.25.33` | 리뷰 사진, 계약서 이미지, 프로필 이미지 저장 |
| 푸시 알림 | Firebase Admin SDK | 9.2.0 | FCM 발송 |
| HTTP 클라이언트(FCM) | OkHttp | 4.10.0 | - |
| API 문서화 | springdoc-openapi-starter-webmvc-ui | 2.8.4 | Swagger UI, `OperationCustomizer`로 에러코드 자동 노출(5장) |
| 템플릿 엔진 | Thymeleaf | spring-boot-starter-thymeleaf | QR 딥링크 리다이렉트 페이지(`/verify`) |
| 크롤링 | jsoup | 1.21.1 | (확인 필요: 사용 지점) |
| 직렬화 | Jackson, Gson | jackson-databind(버전 미고정), gson 2.11.0 | (확인 필요: 두 라이브러리 병행 사용 이유) |
| 모니터링 | Spring Boot Actuator + Micrometer Prometheus | micrometer-registry-prometheus | 헬스체크, 메트릭 수집 (`feat/#447-grafana-cloud-based-metric-logs-observabillity` 브랜치 존재) |
| 기타 플러그인 | Kotlin JVM 플러그인 2.2.0, `kotlin-stdlib-jdk8` | - | (확인 필요: 실제 Kotlin 소스 사용 범위. `build.gradle`에 플러그인/의존성은 있으나 본 리포트 작성 시점에 직접 확인하지 못함) |

### 인프라/배포

| 분야 | 기술 | 설명 |
|---|---|---|
| 컨테이너 | Docker (멀티스테이지: dependencies → builder → `amazoncorretto:17`) | `Dockerfile` |
| 배포 (legacy) | Docker Compose, Blue-Green(`app-blue`:8080, `app-green`:8081) | `docker-compose.yml`, `.github/workflows/unused/cd-*-docker.yml` |
| 배포 (현재) | ArgoCD GitOps + K3s | `.github/workflows/cd-dev-argocd.yml`, `cd-prod-argocd.yml`. 이미지 빌드 후 별도 `ASSU_BE_manifest` 레포의 `overlays/{dev,prod}/deployment-patch.yaml` 이미지 태그를 커밋하면 ArgoCD가 동기화 |
| 설정 관리 | Git submodule (`ASSU_BE_config`, `ASSU_BE_manifest`, 둘 다 private) | `.gitmodules`, `config/README.md` |
| CI | GitHub Actions (`ci.yml`) | `develop` push/PR 시 `./gradlew clean build test` |
| 알림 | Discord Webhook | 배포 성공/실패를 CD 워크플로우에서 Discord로 통지 |

---

# 4. 설계

## 아키텍처

계층형 DDD(Domain-Driven Design) 구조를 사용합니다(`개발가이드.md:1-20`, `CLAUDE.md`).

```text
Presentation  (Controller)   ← 클라이언트 요청 수신, DTO 반환
      ↓
Application   (Service)      ← 비즈니스 로직, 트랜잭션
      ↓
Domain        (Entity, Repository interface)
      ↑
Infrastructure (Repository impl, External API client)
```

규칙(문서 그대로):
- 상위 레이어만 하위 레이어에 접근 가능, 역방향 불가
- 각 도메인은 서로 철저히 분리
- 각 레이어는 하나의 관심사에만 집중

내가 작성한 기능 중 하나(백오피스 홈 큐레이션 자동 추천, `GET /backoffice/home/curation/auto-recommend`)를 예로 요청 처리 흐름을 그리면 다음과 같습니다.

```text
BackofficeHomeCurationController.getAutoRecommendedCuration()
  → @PreAuthorize("hasRole('BACKOFFICE')")로 역할 검증
  → @BackofficeAudited(action = "HOME_CURATION_AUTO_RECOMMEND_READ")로 AOP 기반 감사 로그 기록
  → BackofficeHomeCurationService.getAutoRecommendedCuration() 호출
    → StoreRepository.findAll() 조회 후 평점(rate) 내림차순 정렬, 상위 5개 추출
    → 상위 1개는 상단 추천(Featured), 나머지 4개를 2개 그룹(2x2)으로 분배
    → 그룹별 매장마다 PaperContentRepository로 할인 문구 조회(resolveStoreDiscountDescription)
  → BackofficeHomeAutoRecommendResponseDTO로 변환
  → BaseResponse<T>로 래핑하여 응답
```

## 데이터 모델

전체 엔티티/관계는 `도메인모델.md`에 애그리거트 단위로 문서화되어 있습니다. 핵심 애그리거트는 회원(Member), 가게(Store), 제휴(Paper/PaperContent/Goods), QR 인증(QRCertification/AssociateCertification/Qr), 채팅(ChattingRoom/Message/Block), 알림(Notification/NotificationOutbox), 리뷰(Review/ReviewPhoto), 신고(Report), 제안(Suggestion), 문의(Inquiry)입니다.

내가 작성한 엔티티는 다음과 같습니다.

- `StampEventApplicant`(`domain/student/entity/StampEventApplicant.java`): 학생의 스탬프 10개 적립 시 자동 응모 이력을 별도 테이블로 분리한 엔티티. `student_id` FK만 가지고 `eventVersion`(회차 식별 문자열, 예: `"2026_SEASON_1"`)과 `appliedAt`을 저장합니다.
- `HomeCuration`/`HomeCurationItem`(`domain/student/entity/`): 학생 홈 화면 큐레이션 제목, 상단 추천 업체, 그룹(1,2)별 매장 목록을 관리합니다.

### 인덱스 설계

내가 작성한 엔티티(`StampEventApplicant`, `HomeCuration`, `HomeCurationItem`)에는 `@Table(indexes=...)`나 `@Column(unique=true)` 같은 명시적 DB 레벨 제약이 없습니다(grep으로 확인). 신고 중복 방지는 `ReportRepository.existsByReporterIdAndTargetTypeAndTargetId`로 저장 전에 애플리케이션 레벨에서 확인하는 방식이고, DB 유니크 제약은 걸려 있지 않습니다. 레포 전체에서 확인되는 DB 레벨 복합 유니크 제약 사례는 `ChattingRoom`의 `(admin_id, partner_id)` 정도입니다(`도메인모델.md:293`, 타인 작성 영역). **인덱스 설계 의도(동시 신고 레이스 컨디션 허용 여부 등)는 확인 필요합니다.**

## API 및 인터페이스

- 모든 엔드포인트는 kebab-case 복수 명사 URL을 쓰고, 동사는 HTTP 메서드로 표현합니다(`개발가이드.md:126-174`).
- 역할별 URL 접두사(`/admin/**`, `/partner/**`, `/students/**`, `/backoffice/**`)로 권한 범위를 구분합니다.
- 모든 응답은 `BaseResponse<T>` 래퍼 (`isSuccess`, `code`, `message`, `result`)를 사용합니다.
- 에러는 `ErrorStatus` enum(97개 상수, HTTP 상태 + 커스텀 코드 + 메시지) → `GeneralException(ErrorStatus)` → `GlobalExceptionAdvice`가 일괄 처리합니다.
- 내가 구현한 `SwaggerConfig`의 `OperationCustomizer`가 `@ApiErrorCodeExamples` 어노테이션을 리플렉션으로 읽어, 각 엔드포인트가 실제로 던지는 에러코드만 HTTP 상태코드별로 그룹핑해 Swagger 응답 예시(JSON)에 자동 추가합니다(5장에서 상세 설명).

## 인프라 및 배포

- 로컬 실행: `./gradlew bootRun --args='--spring.profiles.active=local'`. `config/local`, `config/dev`, `config/prod`를 `processResources` 단계에서 `src/main/resources`로 복사하는 커스텀 Gradle 태스크(`copyPrivateConfig`)가 있습니다(`build.gradle`).
- 설정 파일 자체는 private 서브모듈(`ASSU_BE_config`)에 있어 이 레포만으로는 실제 값(DB 접속정보 등)을 확인할 수 없습니다. → **민감정보 존재**로만 기록합니다.
- 배포는 두 경로가 공존합니다: (1) legacy EC2 + Docker Compose Blue-Green, (2) 현재 표준 경로인 ArgoCD GitOps + K3s (`.github/workflows/README.md`). 두 경로 모두 `main`(prod)/`develop`(dev) 브랜치 push를 트리거로 합니다.
- 이 영역은 git log 기준 내가 직접 작성하지 않았습니다(2ghrms, BAEK0111 작성).

## 디렉터리 구조

```text
src/main/java/com/assu/server/
├── ServerApplication.java
├── domain/
│   ├── common/          # BaseEntity, AdminUser, 공통 enum
│   ├── admin/           # 학생회 계정 + 대시보드 통계(내 작업 영역)
│   ├── appreview/       # 앱 스토어 리뷰 작성 기록
│   ├── auth/            # 인증/인가(JWT, 회원가입, 탈퇴) - 타인 작성
│   ├── backoffice/      # 운영자 전용 API (신고/홈 큐레이션: 내 작업 영역)
│   ├── certification/   # QR 스캔 인증(개인/그룹)
│   ├── chat/            # 학생회-제휴업체 채팅
│   ├── deviceToken/     # FCM 디바이스 토큰
│   ├── inquiry/         # 학생 1:1 문의
│   ├── map/             # Kakao Local API 장소 검색
│   ├── member/          # 공통 회원 프로필 이미지
│   ├── notification/    # FCM 알림, RabbitMQ Outbox
│   ├── partner/         # 제휴업체 계정(일부 내 작업 영역)
│   ├── partnership/     # 제휴 계약(Paper/PaperContent/Goods)
│   ├── qr/              # 임시 QR, 딥링크 리다이렉트
│   ├── report/          # 리뷰/채팅 신고(내 작업 영역)
│   ├── review/          # 가게 리뷰(내 작업 영역)
│   ├── store/           # 가게 정보/랭킹
│   ├── student/         # 학생 계정, 스탬프, 홈 큐레이션(내 작업 영역)
│   └── suggestion/      # 학생→학생회 제휴 건의
├── global/
│   ├── apiPayload/      # BaseResponse, ErrorStatus, SwaggerErrorCodes(내 작업 영역)
│   ├── config/          # SwaggerConfig(내 작업 영역) 등 Spring 설정
│   ├── exception/       # 전역 예외 처리, ApiErrorCodeExamples 어노테이션(내 작업 영역)
│   ├── security/        # 인증 에러 핸들러
│   └── util/            # 유틸리티
└── infra/
    ├── aligo/           # 알리고 SMS
    ├── firebase/        # FCM, RabbitMQ
    └── s3/              # AWS S3
```

레포 전체 기준 `src/main/java` 하위 `.java` 파일은 419개, 컨트롤러는 35개, `src/test/java`의 테스트 파일은 41개입니다(`find` 집계).

---

# 5. 핵심 구현

## Swagger 문서에 에러코드를 자동으로 노출하는 `OperationCustomizer`

**무엇을 구현했는가**

기존에는 각 엔드포인트가 어떤 에러코드를 던질 수 있는지가 코드(서비스 구현체의 `throw new GeneralException(ErrorStatus...)`)에만 있고 Swagger 문서에는 나타나지 않아서, 프론트엔드가 에러 분기를 처리하려면 백엔드 코드를 직접 읽어야 하는 문제가 있었습니다(PR #505 본문). 이를 해결하기 위해 컨트롤러 메서드에 어노테이션 하나만 붙이면 Swagger UI의 응답 예시에 실제로 발생 가능한 에러코드별 JSON 샘플이 자동으로 추가되도록 구현했습니다.

**어떻게 구현했는가**

1. `ApiErrorCodeExamples`(`global/exception/annotation/ApiErrorCodeExamples.java`, `@Target(METHOD)`) 어노테이션을 신설하고, `SwaggerErrorCodes` enum 값을 파라미터로 받습니다.
2. `SwaggerErrorCodes`(`global/apiPayload/code/status/SwaggerErrorCodes.java`, 494줄) enum에 엔드포인트(또는 엔드포인트 그룹) 단위로 `Set.of(ErrorStatus...)`를 정의합니다. `ErrorStatus`(97개 상수, 기존 단일 소스)는 그대로 두고 참조만 묶는 방식입니다.
3. `SwaggerConfig`에 `OperationCustomizer` 빈을 등록해, springdoc이 각 핸들러 메서드를 OpenAPI `Operation`으로 변환할 때 `HandlerMethod.getMethodAnnotation(ApiErrorCodeExamples.class)`로 어노테이션을 읽습니다.
4. 읽어온 `SwaggerErrorCodes`의 `ErrorStatus` 목록을 HTTP 상태코드별로 그룹핑(`groupingBy(ExampleHolder::httpStatus)`)한 뒤, 상태코드마다 하나의 `ApiResponse`에 여러 `Example`(코드명 → `{isSuccess:false, code, message}` JSON)을 추가합니다.
5. 34개 컨트롤러 전체를 서비스 구현체까지 추적해서, 실제로 해당 핸들러 체인에서 던질 수 있는 `ErrorStatus`만 매핑했습니다. 예외를 던지지 않는 순수 조회 엔드포인트는 어노테이션을 달지 않았습니다.

**선택지와 판단**

PR #505 본문에 따르면 "JWT 필터 단의 전역 인증 에러(`AUTHORIZATION_EXCEPTION` 등)는 해당 엔드포인트 로직이 직접 던지는 경우에만 포함"했다고 명시되어 있습니다. 즉, 모든 엔드포인트에 전역 인증 예외를 일괄로 붙이는 대신, 핸들러별로 실제 호출 가능한 예외만 정밀하게 매핑하는 방식을 선택했습니다. 또한 기존 로직은 건드리지 않고 어노테이션과 import만 추가하는 순수 추가(additive) 변경으로 범위를 제한했습니다. 작업 중 `ReportServiceImpl`에서 리뷰 미존재 시 `ErrorStatus.NO_SUCH_MEMBER`를 던지는 네이밍 이슈를 발견했지만, PR 범위를 벗어난다고 판단해 수정하지 않고 발견한 그대로 문서화했다고 PR 본문에 기록되어 있습니다.

**코드 발췌**

```java
// src/main/java/com/assu/server/global/config/SwaggerConfig.java
@Bean
public OperationCustomizer customExceptionOperationCustomizer() {
    return (Operation operation, HandlerMethod handlerMethod) -> {
        ApiErrorCodeExamples description = handlerMethod.getMethodAnnotation(ApiErrorCodeExamples.class);
        if (description != null) {
            addErrorResponseExamples(operation, description.value());
        }
        return operation;
    };
}

private void addErrorResponseExamples(Operation operation, SwaggerErrorCodes swaggerErrorCodes) {
    ApiResponses responses = operation.getResponses();

    Map<Integer, List<ExampleHolder>> byHttpStatus = swaggerErrorCodes.getErrorCodes().stream()
            .map(errorStatus -> new ExampleHolder(
                    toExample(errorStatus),
                    errorStatus.name(),
                    errorStatus.getHttpStatus().value()))
            .collect(groupingBy(ExampleHolder::httpStatus));

    byHttpStatus.forEach((httpStatus, holders) -> {
        MediaType mediaType = new MediaType();
        holders.forEach(holder -> mediaType.addExamples(holder.name(), holder.example()));
        Content content = new Content().addMediaType("application/json", mediaType);
        responses.addApiResponse(String.valueOf(httpStatus), new ApiResponse().description("").content(content));
    });
}
```

## 백오피스 수동 큐레이션과 평점 기반 자동 추천의 분리 설계

**무엇을 구현했는가**

학생 홈 화면에 노출되는 "제휴 추천" 섹션을 (1) 운영자가 직접 지정하는 큐레이션과 (2) 운영자가 폼을 빠르게 채우기 위한 자동 추천 보조 기능으로 나누어 구현했습니다(#441, PR #442). 학생용 조회 API(`GET /students/recommend/curation`)와 백오피스 관리 API(`GET/PUT/PATCH /backoffice/home/curation`) 양쪽을 모두 구현했습니다.

**어떻게 구현했는가**

1. `HomeCuration`(제목, 상단 추천 업체, 상단 할인 문구)과 `HomeCurationItem`(그룹 인덱스 1/2, 정렬 순서, 매장, 커스텀 할인 문구) 두 엔티티로 큐레이션 상태를 저장합니다.
2. 운영자가 저장(`PUT /backoffice/home/curation`)할 때는 `validateCurationGroups`로 "그룹은 정확히 2개, 그룹당 매장은 정확히 2개, 정렬 순서는 {1,2} 집합"이라는 제약을 검증한 뒤, 기존 `curation.getItems().clear()`로 비우고 새 아이템을 채워 저장합니다.
3. 자동 추천(`GET /backoffice/home/curation/auto-recommend`)은 저장된 큐레이션과 무관하게, `storeRepository.findAll()` 결과를 평점(`rate`) 내림차순으로 정렬해 상위 5개를 뽑고 1개는 상단 추천, 나머지 4개를 2개 그룹(2x2)으로 자동 배분합니다. 이 결과는 운영자가 폼을 채울 때 참고하는 값일 뿐 즉시 저장되지는 않습니다.
4. 큐레이션 데이터/자동 추천 데이터가 모두 없을 때는 예외를 던지지 않고 빈 그룹 2개를 담은 기본 응답을 반환하도록 했습니다(운영 초기 상태 대응).
5. 학생에게 보여줄 할인 문구가 비어 있으면 해당 매장의 최신 `PaperContent`를 조회해 자동으로 채워주는 `resolveStoreDiscountDescription`을 양쪽 경로(수동/자동) 모두에서 공유합니다.

**선택지와 판단**

PR #442 본문에 "기존 프론트엔드 연동 API들(`GET /students/usable`, `GET /students/recommend/carousel`, `GET /store/best` 등)에 영향 없는 독립적인 전용 엔드포인트로 분리"했다고 명시되어 있습니다. 기존 홈 화면 API를 확장하는 대신 새 엔드포인트를 만든 이유로, 이미 서비스 중인 프론트엔드 연동을 깨뜨리지 않는 것을 우선했다는 근거가 PR 본문에 있습니다. 또한 큐레이션 CUD 핸들러에는 `@BackofficeAudited`를 적용했으나, 조회(GET) 핸들러인 `getHomeCuration()`/`getAutoRecommendedCuration()`에도 `@BackofficeAudited(action = "HOME_CURATION_READ")`가 적용되어 있는데, 이는 `CLAUDE.md`의 "GET 제외" 컨벤션과 다르게 작성된 부분으로 확인됩니다(8장 회고에서 다시 설명).

**코드 발췌**

```java
// src/main/java/com/assu/server/domain/backoffice/service/BackofficeHomeCurationServiceImpl.java
@Override
@Transactional(readOnly = true)
public BackofficeHomeAutoRecommendResponseDTO getAutoRecommendedCuration() {
    List<Store> candidateStores = storeRepository.findAll().stream()
            .sorted(Comparator.comparing(Store::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(5)
            .toList();

    if (candidateStores.isEmpty()) {
        return BackofficeHomeAutoRecommendResponseDTO.of(
                DEFAULT_TITLE, null,
                List.of(
                        BackofficeHomeAutoRecommendResponseDTO.AutoGroupDTO.of(1, "추천 제휴 1", List.of()),
                        BackofficeHomeAutoRecommendResponseDTO.AutoGroupDTO.of(2, "추천 제휴 2", List.of())
                )
        );
    }

    Store featuredStore = candidateStores.get(0);
    List<Store> remainingStores = candidateStores.subList(1, candidateStores.size());
    // remainingStores를 2개씩 두 그룹(group1Stores, group2Stores)으로 분배 (이하 생략)
}
```

## 스탬프 적립과 10개 달성 시 자동 이벤트 응모

**무엇을 구현했는가**

QR 인증 1회마다 학생의 스탬프를 1 증가시키고, 10개가 모이면 API 호출 한 번으로 이벤트 자동 응모 처리와 스탬프 초기화를 수행하는 로직을 구현했습니다(#234, PR #239).

**어떻게 구현했는가**

1. `Student.setStamp()`로 스탬프를 1 증가시킵니다(`domain/student/entity/Student.java:51`).
2. `addStamp(memberId)`에서 증가 후 스탬프가 10 이상이면, `StampEventApplicant`(회차 식별자 `eventVersion`, 응모 시각 `appliedAt`)를 생성해 저장합니다.
3. 알림 발송(`notificationCommandService.sendStamp`) 후 `student.resetStamp()`로 스탬프를 0으로 되돌립니다.
4. 응답 메시지를 분기해("스탬프가 적립되었습니다." / "스탬프 10개를 모아 자동 응모 되었습니다.") 클라이언트가 추가 안내 없이 바로 결과를 표시할 수 있게 했습니다.

**선택지와 판단**

PR #239 본문에 "Student 테이블의 stamp 필드를 리셋하더라도 응모 이력을 영구적으로 관리할 수 있도록 별도 엔티티 도입"이라는 설계 이유가 명시되어 있습니다. 즉 `stamp` 카운터는 Student 엔티티의 가변 상태(리셋됨)이고, 응모 이력은 불변 사실이므로 둘을 분리해 리셋 이후에도 과거 응모 내역을 조회할 수 있게 한 것입니다. (이후 다른 팀원이 `#270`에서 알림 발송 실패가 스탬프 적립 자체를 롤백시키지 않도록 `try-catch`를 추가로 감쌌습니다 - 커밋 `c957bad`, 이 부분은 내 작업이 아닙니다.)

**코드 발췌**

```java
// src/main/java/com/assu/server/domain/student/service/StudentServiceImpl.java
@Transactional
public StudentResponseDTO.CheckStampResponseDTO addStamp(Long memberId) {
    Student student = studentRepository.findById(memberId)
            .orElseThrow(() -> new DatabaseException(ErrorStatus.NO_SUCH_STUDENT));

    student.setStamp();
    String responseMessage = "스탬프가 적립되었습니다.";

    if (student.getStamp() >= 10) {
        StampEventApplicant applicant = StampEventApplicant.builder()
                .student(student)
                .appliedAt(LocalDateTime.now())
                .eventVersion("2026_SEASON_1")
                .build();
        stampEventApplicantRepository.save(applicant);
        notificationCommandService.sendStamp(memberId);
        student.resetStamp();
        responseMessage = "스탬프 10개를 모아 자동 응모 되었습니다.";
    }
    return StudentResponseDTO.CheckStampResponseDTO.builder()
            .userId(student.getId())
            .stamp(student.getStamp())
            .message(responseMessage)
            .build();
}
```

## 리뷰 작성/삭제 시 가게 평균 평점 동기 재계산

**무엇을 구현했는가**

학생이 리뷰를 작성하거나 삭제할 때마다 해당 가게의 평균 평점(`Store.rate`)을 즉시 다시 계산해 반영하는 로직을 구현했습니다(#13, PR #30).

**어떻게 구현했는가**

1. 리뷰 작성(`writeReview`) 또는 삭제 플로우 마지막에 `recalcAndUpdateStoreRate(storeId)`를 호출합니다.
2. 이 메서드는 먼저 `reviewRepository.flush()`로 방금 변경한 리뷰를 DB에 반영한 뒤, `standardScoreWithStatus(storeId, ReportedStatus.NORMAL, ReportedStatus.NORMAL)`로 신고되지 않은(`NORMAL`) 리뷰만 집계한 평균을 조회합니다.
3. 평균이 없으면(리뷰가 모두 삭제된 경우) 0으로, 있으면 평균값을 반영해 `Store.rate`를 갱신하고 저장합니다.

**선택지와 판단**

평균 평점을 조회 시점에 매번 집계하는 대신 쓰기 시점에 미리 계산해 `Store.rate`에 저장해 두는 방식을 선택했습니다. 가게 목록/랭킹 조회가 리뷰 작성보다 훨씬 빈번하다고 가정하면, 읽기 경로의 집계 쿼리 비용을 쓰기 경로로 옮기는 것이 합리적인 트레이드오프입니다. 다만 이 트레이드오프가 실제로 명문화된 근거(주석, 문서, PR 논의)는 찾지 못했습니다 — **(확인 필요: 읽기/쓰기 비율에 대한 실제 근거)**.

**코드 발췌**

```java
// src/main/java/com/assu/server/domain/review/service/ReviewServiceImpl.java
private void recalcAndUpdateStoreRate(Long storeId) {
    reviewRepository.flush();
    Float avg = reviewRepository.standardScoreWithStatus(storeId, ReportedStatus.NORMAL, ReportedStatus.NORMAL);
    int rounded = (avg == null) ? 0 : (int) (Math.round(avg * 10f) / 10f);

    storeRepository.findById(storeId).ifPresent(s -> {
        s.setRate(rounded);
        storeRepository.save(s);
    });
}
```

## 백오피스 신고 목록/상세 조회 N+1 방지

**무엇을 구현했는가**

백오피스 신고 관리 기능(#372, PR #373)에서 신고 목록 페이징 조회와 단건 상세 조회 시, 신고자(`reporter`)의 역할별 프로필을 함께 내려주면서도 N+1 쿼리가 발생하지 않도록 구현했습니다.

**어떻게 구현했는가**

`ReportRepository`가 JPA의 `findAll(Pageable)`/`findById(Long)`를 오버라이드하면서 `@EntityGraph`로 `reporter`와 그 하위 4개 역할 프로필(`studentProfile`, `adminProfile`, `partnerProfile`, `backofficeProfile`) 및 `reported`까지 한 번에 fetch join 하도록 지정했습니다. 신고자는 `Member`이고 실제 표시 이름은 역할별 프로필에 있기 때문에(2장 참고), 프로필을 지연 로딩하면 신고 목록 건수만큼 추가 쿼리가 발생할 수 있는 구조입니다.

**코드 발췌**

```java
// src/main/java/com/assu/server/domain/report/repository/ReportRepository.java
@Override
@EntityGraph(attributePaths = {
        "reporter",
        "reporter.studentProfile",
        "reporter.adminProfile",
        "reporter.partnerProfile",
        "reporter.backofficeProfile",
        "reported"
})
Page<Report> findAll(Pageable pageable);

@Override
@EntityGraph(attributePaths = {
        "reporter",
        "reporter.studentProfile",
        "reporter.adminProfile",
        "reporter.partnerProfile",
        "reporter.backofficeProfile",
        "reported"
})
Optional<Report> findById(Long id);
```

---

# 6. 트러블 슈팅

## 패키지 구조 변경 후 JPQL에 하드코딩된 FQCN이 런타임에 깨짐

**문제 상황**

`#310`에서 `domain.mapping` 패키지를 `domain.admin`으로 옮기는 작업(PR #311, 커밋 `500d211`)을 진행한 뒤, 매칭 추천(미제휴 제휴업체 랜덤 추천) 관련 API에서 쿼리 오류가 발생했습니다. 같은 날(2026-05-25) `#344` 이슈로 핫픽스 PR #345가 올라갔고, 제목부터 "AdminRepository 내 네이티브 쿼리 문법 정정 (Hotfix)"로 명시되어 있습니다.

**원인 분석**

네 개의 연속 커밋을 추적한 결과, 서로 다른 세 가지 원인이 겹쳐 있었습니다.

1. `AdminRepository.countPartner`/`findPartnerWithOffset`가 MariaDB 네이티브 쿼리로 `LIMIT :offset, :limit`과 `pa.is_activated = 'ACTIVE'`(enum을 문자열 리터럴로 직접 비교)를 사용하고 있었습니다. 커밋 `50937b6`에서 enum 비교를 `CAST(pa.is_activated AS VARCHAR) = 'ACTIVE'`로, `ST_Contains(function(...))` 래퍼 호출을 `ST_Contains(...)` 직접 호출로 바꾼 것으로 보아, 네이티브 쿼리 문법이 기대한 대로 동작하지 않는 상황이 있었던 것으로 보입니다. **(확인 필요: 당시 실제 에러 메시지/스택트레이스)**
2. 커밋 `29ee3c9`에서 네이티브 쿼리 자체를 JPQL + Spring Data `Pageable`로 전환했습니다. 네이티브 쿼리의 `LIMIT :offset, :limit` 바인드 파라미터 문법은 MariaDB 전용이라 테스트 환경(H2)과 운영 환경(MariaDB)에서 동작이 달라질 수 있는 지점이었습니다.
3. 커밋 `a385e20`에서는 JPQL 안에 enum 값을 `pa.isActivated = com.assu.server.domain.common.enums.ActivationStatus.ACTIVE`처럼 **패키지 전체 경로 문자열**로 하드코딩해 둔 부분을, `:status` 바인드 파라미터로 교체했습니다.
4. 커밋 `a61e25d`에서는 `StudentAdminRepository`의 JPQL 생성자 표현식(`SELECT new com.assu.server.domain.mapping.dto.StoreUsageWithPaper(...)`)이 패키지 이동 이전의 경로(`domain.mapping.dto`)를 그대로 가리키고 있던 것을 새 경로(`domain.admin.dto`)로 수정했습니다.

즉, 컴파일러가 체크할 수 없는 **JPQL/네이티브 쿼리 문자열 안의 FQCN**(enum 리터럴, DTO 생성자 표현식)이 패키지 이동 리팩토링(IDE의 "Move Package")에서 자동으로 갱신되지 않아, 컴파일은 성공하지만 해당 쿼리가 실행되는 순간에만 실패하는 문제였습니다.

**검토한 대안**

| 대안 | 장점 | 한계 | 채택 여부 |
|---|---|---|---|
| 네이티브 쿼리를 유지하고 enum 캐스팅만 수정 | 변경 범위 최소 | DB 방언(H2/MariaDB) 차이에 계속 노출됨 | 1차 임시 조치로만 적용(`50937b6`), 최종 미채택 |
| JPQL + `Pageable`로 전환 | DB 방언 의존성 제거, Spring Data 표준 페이징 사용 | 쿼리 재작성 필요 | 채택 (`29ee3c9`) |
| JPQL 내 enum을 FQCN 문자열로 유지 | 파라미터 바인딩 코드 불필요 | 패키지 경로가 바뀌면 다시 깨짐(근본 원인) | 미채택 |
| enum을 `:status` 파라미터로 바인딩 | 패키지 경로와 완전히 무관해짐, 재발 방지 | 호출부에서 enum 값을 명시적으로 전달해야 함 | 채택 (`a385e20`) |

**해결 과정**

네이티브 쿼리를 JPQL로 전환하고, 쿼리 문자열 안에 하드코딩되어 있던 FQCN(enum 리터럴, DTO 생성자 표현식 경로)을 모두 파라미터 바인딩 또는 올바른 경로로 교체했습니다. 네 커밋 모두 같은 날 하나의 PR(#345)로 병합되었습니다.

**코드 발췌 (변경 전/후)**

```java
// 변경 전 (네이티브 쿼리, 커밋 50937b6 이전)
@Query(value = """
    SELECT COUNT(*)
    FROM admin a
    WHERE NOT EXISTS (
        SELECT 1 FROM paper pa
        WHERE pa.admin_id = a.id
          AND pa.partner_id = :partnerId
          AND pa.is_activated = 'ACTIVE'
    )
    """, nativeQuery = true)
long countPartner(@Param("partnerId") Long partnerId);
```

```java
// 변경 후 (JPQL + 파라미터 바인딩, 커밋 a385e20)
@Query("""
    SELECT a
    FROM Admin a
    WHERE NOT EXISTS (
        SELECT 1 FROM Paper pa
        WHERE pa.admin = a
          AND pa.partner.id = :partnerId
          AND pa.isActivated = :status
    )
    """)
List<Partner> findUnpartneredActiveByAdminWithOffset(
        @Param("adminId") Long adminId,
        @Param("status") ActivationStatus status,
        Pageable pageable);
```

**결과**

PR #345는 4개 커밋이 같은 날(2026-05-25) 병합되었습니다. 이후 동일 쿼리에 대한 추가 수정 커밋은 git 로그에서 발견되지 않았습니다. 정량적인 개선 수치(쿼리 실행 시간 등)는 **(수치 확인 필요: 변경 전후 벤치마크 없음)**.

**근거**

커밋 `50937b6`, `29ee3c9`, `a385e20`, `a61e25d` / PR #345 (`close #344`) / 파일 `src/main/java/com/assu/server/domain/admin/repository/AdminRepository.java`, `src/main/java/com/assu/server/domain/partner/repository/PartnerRepository.java`, `src/main/java/com/assu/server/domain/admin/service/AdminServiceImpl.java`, `src/main/java/com/assu/server/domain/admin/repository/StudentAdminRepository.java`

**배운 점**

이후 작업(`#504` Swagger 에러코드 자동화)에서는 문자열 기반 매핑(`SwaggerErrorCodes`) 대신 어노테이션 + enum 조합을 쓰면서도, 34개 컨트롤러를 서비스 구현체까지 추적해 실제로 던지는 예외만 매핑하는 방식을 취했습니다. 이는 "문자열/리플렉션으로 연결되는 지점은 리팩토링 시 깨지기 쉽다"는 `#344`의 경험이 반영된 것으로 보이나, PR 본문에 명시적으로 그렇게 서술되어 있지는 않아 **(확인 필요: 실제로 #344 경험이 의도적으로 반영된 것인지, 아니면 우연히 유사한 접근인지)**.

---

## 확인 필요 항목으로 분류한 트러블슈팅 후보

- 스탬프 적립 시 알림 전송 실패가 트랜잭션에 영향을 주지 않도록 `try-catch`를 감싼 변경(`c957bad`, `#270`)은 코드/커밋 메시지로 명확히 뒷받침되지만, **작성자가 `MiN`이라 본인 트러블슈팅으로 포함하지 않았습니다.**
- 리뷰 평점 재계산 로직(`recalcAndUpdateStoreRate`)의 `Math.round(avg * 10f) / 10f`를 다시 `int`로 캐스팅하는 부분은 소수점 반올림 의도가 최종적으로 사라지는 구조로 보이지만, `Store.rate`가 정수형임을 감안하면 실질적인 결과 차이가 있는지 확인하지 못해 트러블슈팅이 아닌 5장 코드 발췌로만 남겼습니다. **(확인 필요)**

---

# 7. 결과

- 병합된 PR: 11개 (#30, #99, #219, #239, #295, #303, #311, #345, #373, #398, #442)
- 열려 있는 PR: 1개 (#505, 2026-10-07 생성, 미병합)
- 병합되지 않고 닫힌 PR: 2개 (#76, #302)
- git log 기준 커밋 수: 82개 (`poppppp00@gmail.com` + `164151329+kimyw1018@users.noreply.github.com` 합산)
- 레포 전체 커밋 수: 987개, 전체 소스 파일 419개(`src/main/java`), 테스트 파일 41개
- 내가 작성한 테스트 파일: 0개 (위 2장 참고) — **(확인 필요: 테스트 커버리지 측정값)**
- 배포/운영 결과(실제 트래픽, 장애, SLA 등): **(확인 필요: 운영 지표 접근 권한 필요)**
- 수상 내역: 레포 내 근거 없음 — **(확인 필요)**

---

# 8. 회고

- **PR 설명 품질이 작업 후반부로 갈수록 좋아졌습니다.** 초기 PR(#99 "dashboard", #239 "예원 리팩토링")은 PR 템플릿의 "작업한 내용을 작성해주세요" 같은 placeholder 문구가 그대로 남아있는 경우가 있었던 반면, 최근 PR(#442, #505)은 변경 이유, 코드 설명, 고민사항까지 구체적으로 작성했습니다(근거: `gh pr view` 결과 비교). 다시 한다면 처음부터 PR 본문을 상세하게 쓰는 습관을 더 일찍 들였을 것 같습니다.
- **API 문서/포맷 컨벤션을 더 일찍 확정했어야 합니다.** `#234`(예원 리팩토링), `#294`, `#301` 세 번에 걸쳐 "API 양식 통일", "description 수정"을 반복한 것으로 보아, DTO/Swagger 설명 포맷 컨벤션이 프로젝트 초반에 명확히 정해지지 않아 사후에 여러 차례 되돌아가 정리해야 했습니다.
- **GET 핸들러에 `@BackofficeAudited`를 적용한 사례가 남아 있습니다.** `BackofficeHomeCurationController.getHomeCuration()`, `getAutoRecommendedCuration()`(둘 다 `@GetMapping`)에 `@BackofficeAudited`가 붙어 있는데, `CLAUDE.md`/`개발가이드.md`에는 "GET 제외"가 명시되어 있습니다. 코드 리뷰나 셀프 체크 단계에서 걸러지지 않은 컨벤션 위반이며, 조회 요청마다 불필요한 감사 로그가 쌓이고 있을 가능성이 있습니다.
- **패키지 구조 변경 시 문자열 기반 참조(JPQL FQCN)에 대한 점검 절차가 없었습니다.** `#344` 트러블슈팅에서 보듯, IDE의 패키지 이동 리팩토링은 Java 코드의 import는 갱신하지만 `@Query` 문자열 내부의 FQCN까지는 갱신하지 못합니다. 다시 한다면 패키지 이동 PR에는 `grep -r "com.assu.server.domain.<old>"` 같은 전수 검색을 체크리스트에 포함했을 것 같습니다.
- **내가 작성한 기능에 대한 테스트 코드가 없습니다.** 리뷰, 스탬프, 홈 큐레이션, 백오피스 신고 기능 모두 단위 테스트를 직접 작성하지 않았고, 현재 존재하는 `admin` 패키지 테스트는 다른 팀원이 전 도메인 일괄 작성(`#378`)한 것입니다. 기능을 만들 때 바로 테스트를 붙였다면 `#344`류의 런타임 전용 오류를 머지 전에 잡을 가능성이 더 높았을 것입니다.

---

# 9. 스크린샷 및 문서 제안

| 파일명(제안) | 촬영할 화면 | 들어갈 섹션 | 비고 |
|---|---|---|---|
| `swagger-error-examples.png` | Swagger UI에서 `/backoffice/home/curation` 등 엔드포인트의 Response 탭을 열어 상태코드별 에러 예시 드롭다운이 보이는 화면 | 5장 핵심 구현(Swagger 에러코드) | 코드만으로는 전달이 안 되는 시각적 효과라 캡처 권장 |
| `home-curation-admin-form.png` | 백오피스 화면에서 홈 큐레이션 수동 설정 폼(상단 추천 + 2x2 그룹) | 5장 핵심 구현(홈 큐레이션) | 프론트가 있다면 캡처, 없다면 Swagger UI로 대체 |
| `stamp-event-flow.png` 또는 다이어그램 | 스탬프 적립 → 10개 달성 → 자동 응모 → 알림의 흐름도 | 5장 핵심 구현(스탬프) | PR #30에 이미 올라간 스크린샷(GitHub PR 첨부, 외부 URL)이 있어 재사용 가능 — 단, 레포 로컬 파일이 아니라 GitHub 호스팅 이미지입니다 |
| `admin-dashboard-stats.png` | 학생회 대시보드(신규 가입자/오늘 제휴 사용자/누적 가입자) 화면 | 2장 개요(담당 범위) | PR #30 본문에 이미 첨부된 스크린샷 다수 존재(외부 URL) |
| 패키지 이동 전/후 diff 다이어그램 | `domain/mapping` → `domain/admin` 디렉터리 트리 비교 | 6장 트러블슈팅 | 직접 제작 필요 (레포에 기존 이미지 없음) |

레포에 이미 존재하는 문서(이미지/PDF는 없음, 모두 Markdown):

- `도메인모델.md` (엔티티/애그리거트 전체 정의)
- `용어사전.md` (도메인 용어집)
- `개발가이드.md` (코드 컨벤션, API 규칙)
- `민감정보마스킹.md` (저장소 루트, **git에 커밋되지 않은 미추적 파일**. 로그/감사로그에 평문 PII가 남는 지점에 대한 개선 제안 문서이며 아직 구현되지 않은 설계안입니다. 포트폴리오에 포함할지는 사용자 판단 필요 — **확인 필요**)
- `.github/workflows/README.md` (CI/CD 워크플로우 가이드)
- `config/README.md` (설정 서브모듈 안내, 1줄짜리 placeholder)

---

# 10. 확인 필요 항목

## 내가 직접 채워야 하는 정보

1. 지원 직무가 정확히 무엇인지 (현재 "백엔드 개발자"로 추정 작성)
2. 팀 구성 6명이 실제 역할 분담(프론트/백엔드/디자인 등)과 일치하는지
3. 배포 주소(dev/prod 도메인), 실제 서비스 URL
4. `Math.round(avg * 10f) / 10f`를 다시 `int`로 캐스팅하는 부분이 의도된 동작인지, 아니면 사용하지 않는 코드인지
5. `WebFlux`/`Spring Batch`/`jsoup`/`Gson`이 실제로 어느 코드에서 쓰이는지 (build.gradle에는 있으나 본 조사에서 호출부를 특정하지 못함)
6. `ReportRepository`/큐레이션 엔티티에 DB 레벨 인덱스나 유니크 제약이 없는 것이 설계 의도인지
7. 테스트 커버리지 수치(현재 내가 작성한 기능에 대한 자동화된 테스트가 전혀 없음을 확인함)
8. `민감정보마스킹.md`의 작성 주체 및 포트폴리오 포함 여부(git 미추적 파일)

## 근거 부족으로 제외한 트러블슈팅 후보

| 후보 | 제외 이유 |
|---|---|
| 알림 전송 실패 시 `try-catch` 처리(`c957bad`, `#270`) | 코드 근거는 명확하나 작성자가 `MiN`으로 확인되어(본인 작업 아님) 제외 |
| 리뷰 평점 반올림 로직의 `int` 캐스팅 | 의도된 동작인지 결함인지 추가 확인 없이는 "문제"로 단정하기 어려워 트러블슈팅이 아닌 코드 발췌로만 5장에 수록 |
| Kotlin 플러그인/의존성 존재 이유 | 실제 Kotlin 소스 파일을 찾지 못해(.kt 파일 미확인) 트러블슈팅/스택 선택 이유 어느 쪽에도 근거 있게 포함하지 못함 |

---

# 11. 면접 예상 질문

1. **"Swagger 에러코드 자동화에서 `OperationCustomizer`가 34개 컨트롤러 전체를 어떻게 추적했는지, 누락된 엔드포인트가 없는지 어떻게 검증했나요?"**
   - PR #505 본문에는 "서비스 구현체까지 추적"했다고만 쓰여 있고, 자동화된 검증(예: 컨트롤러 전수를 순회하며 어노테이션 누락을 검사하는 테스트)이 있었는지는 레포에서 확인하지 못했습니다. 실제 면접에서는 이 부분의 검증 방법(수동 vs 자동)을 명확히 설명할 수 있어야 합니다. **(확인 필요)**

2. **"`#344` 트러블슈팅에서, 왜 처음부터 JPQL + 파라미터 바인딩으로 작성하지 않고 네이티브 쿼리 + 하드코딩된 enum 리터럴을 썼었나요?"**
   - 최초 작성 시점의 의도(예: 성능, DB 함수 활용 등)는 당시 커밋/PR에 명시되어 있지 않습니다. 네이티브 쿼리를 처음 선택한 이유를 재구성해 설명할 준비가 필요합니다. **(확인 필요)**

3. **"홈 큐레이션 자동 추천에서 `storeRepository.findAll()`로 전체 매장을 메모리에 올려 정렬하는 방식이 매장 수가 많아지면 성능 문제가 될 수 있는데, 이에 대한 고려가 있었나요?"**
   - 현재 코드는 애플리케이션 레벨 정렬(`Comparator.comparing(Store::getRate)...limit(5)`)을 사용합니다. DB 레벨 `ORDER BY rate DESC LIMIT 5` 쿼리로 대체하지 않은 이유, 그리고 매장 수 규모에 대한 전제가 있었는지 설명이 필요합니다. **(확인 필요: 실제 매장 수 규모와 성능 영향)**

4. **"`@BackofficeAudited`가 GET 핸들러에도 적용되어 있는데, 이게 팀 컨벤션 위반이라는 걸 알고 있었나요? 왜 그렇게 작성했나요?"**
   - 8장 회고에서 다룬 것처럼, 레포 문서상 컨벤션과 실제 구현이 다른 지점입니다. 조회 이력도 감사 대상으로 삼으려는 의도였는지, 단순 누락인지 답변을 준비해야 합니다. **(확인 필요)**

5. **"내가 만든 기능(리뷰, 스탬프, 홈 큐레이션, 백오피스 신고)에 단위 테스트가 하나도 없는데, 품질을 어떻게 보장했나요?"**
   - 현재 레포 기준 사실이므로 회피하지 말고, 수동 테스트 방식(Swagger UI, Postman 등)이나 팀 내 QA 프로세스(`[FIX/#98] QA 반영` 커밋들이 존재하는 것으로 보아 QA 단계가 있었던 것으로 추정)로 어떻게 검증했는지 구체적으로 답변할 준비가 필요합니다. **(확인 필요: 실제 QA 프로세스 설명)**

6. **"StampEventApplicant를 별도 테이블로 분리한 것과, 그냥 Student에 `totalStampCount` 같은 컬럼을 하나 더 두는 것의 차이는 무엇인가요?"**
   - PR #239에 명시된 "리셋 이후에도 응모 이력 보존" 외에, 회차(`eventVersion`)별 응모자 집계/중복 응모 방지 같은 추가 요구사항이 있었는지가 핵심 쟁점입니다. 현재 엔티티에는 회차별 유니크 제약이 없어, 이론상 한 학생이 같은 회차에 여러 번 응모 기록을 남길 수 있는 구조입니다. **(확인 필요: 중복 응모 방지 로직의 실제 존재 여부)**
