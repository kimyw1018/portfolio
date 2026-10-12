# 1. 3분 요약

| 항목 | 내용 |
| --- | --- |
| 한 줄 소개 | Coupang WING(입점사 관리 시스템) Open API를 호출해 즉시할인 쿠폰을 매일 폐기·재발급하는 Node.js/TypeScript CLI 스크립트입니다. |
| 핵심 성과 | 코드로 확인 가능한 규모: TypeScript 소스 6개 파일, 총 494 lines(`src/`), 커스텀 서비스 클래스 4개(`CoupangService`, `CouponManager`, `DiscordService`, 소스에서는 제거된 `SlackService`). 실 운영 처리량·성공률 등 성과 수치는 레포에서 확인되지 않습니다(수치 확인 필요: 실제 운영 로그 또는 모니터링 기록 필요). |
| 담당 범위 | 전체 코드베이스(`src/config`, `src/services`, `src/utils`, `src/index.ts`)를 단독 작성. 근거: `git shortlog -sne` 결과 전체 3개 커밋의 author가 `kimyw1018 <poppppp00@gmail.com>` 1인. |
| 스택 | Node.js, TypeScript 5.5, axios, dotenv (상세는 3장 참조) |
| 기간 | 2026-06-23 하루, 커밋 3건(14:47:51 ~ 15:37:31 KST). 이 시간대는 git 커밋 타임스탬프 기준이며 실제 설계·검토에 소요된 기간은 확인되지 않습니다(확인 필요). |
| 팀 구성 | 단독 개발. 근거: 전체 히스토리 3개 커밋 모두 동일 author, PR 리뷰 흔적(별도 브랜치, 머지 커밋) 없음. |
| 링크 | GitHub: https://github.com/kimyw1018/coupang-wing-coupon-manager (근거: `git remote -v`) |

> 주의: 이 저장소의 로컬 작업 트리(`git log` 3커밋) 기준으로는 현재 로컬이 origin보다 1커밋 앞서 있어(`git status`), 마지막 커밋(`e9f5bf1`, .env 삭제 및 키 교체)이 아직 GitHub에 반영되지 않은 상태입니다. 자세한 내용은 10장을 참고하시기 바랍니다.

---

# 2. 개요

## 배경과 문제

- 이 스크립트는 Coupang WING 입점사가 운영해야 하는 "즉시할인 쿠폰"을 매일 폐기하고 새로 발급하는 반복 작업을 자동화합니다. 근거: `package.json`의 `description` 필드("Coupang WING API coupon manager scheduler script")와 `src/services/coupon.manager.ts`의 `runDailyRollover()` 메서드.
- 대상 사용자는 Coupang WING에 입점한 판매자(계정 소유자)입니다. 사용자 규모나 실제 사용처는 레포에서 확인되지 않습니다(확인 필요).
- 기술적으로 어려웠던 지점은 다음 두 가지가 코드로 확인됩니다.
    1. Coupang Open API 고유의 HMAC-SHA256 서명 기반 인증 헤더 생성(`src/utils/signature.ts`).
    2. 최초 구현 시 가정했던 API 경로·파라미터 스펙이 실제 스펙과 달라, 커밋 `c726127`에서 엔드포인트 경로·요청 바디·타입 정의를 전면 교체(6장에서 상세 서술).
- "scheduler"라는 표현이 `package.json` description에 있으나, 실제 저장소에는 크론(cron), PM2, systemd timer, GitHub Actions 스케줄 트리거 등 반복 실행을 담당하는 설정이 전혀 없습니다. `src/index.ts`는 `--run` CLI 플래그로 1회 실행되는 구조이며, 반복 실행은 외부(운영체제 크론 등)에 의존하는 것으로 보이나 그 설정은 이 레포 범위 밖입니다(확인 필요: 실제 스케줄링 방식).

## 담당 범위

- 아래 전체 디렉터리와 파일을 본인이 작성했습니다(전체 커밋 author 1인, `git log --format=%an` 확인).

| 경로 | 역할 |
| --- | --- |
| `src/index.ts` | 엔트리포인트. 설정 로그 출력, 서명 생성 테스트, `--run` 플래그로 실제 롤오버 실행 |
| `src/config/env.ts` | 환경변수 로드 및 검증(`dotenv`), 플레이스홀더 값 방어 |
| `src/services/coupang.service.ts` | Coupang WING FMS API 클라이언트(계약 ID 조회, 쿠폰 목록/폐기/생성) |
| `src/services/coupon.manager.ts` | 일일 롤오버 오케스트레이션(조회 → 폐기 → 신규 발급) |
| `src/services/discord.service.ts` | 오류 발생 시 Discord Webhook 알림 |
| `src/utils/signature.ts` | Coupang API 인증용 HMAC-SHA256 서명/Authorization 헤더 생성 |

- 타인 작성 영역: 없음(레포 내 모든 소스 코드가 단일 author). 다만 `dist/services/slack.service.js`라는 컴파일 결과물이 존재하는데, 이에 대응하는 `src/services/slack.service.ts` 소스는 git 히스토리 전체(`git log --all --full-history -- "**/slack*"`)에서도 발견되지 않습니다. 즉 이 파일은 커밋되지 않은 로컬 소스로 한 번 빌드된 뒤, 이후 `discord.service.ts`로 대체되었으나 `dist/` 산출물만 정리되지 않고 남아있는 것으로 추정됩니다(확인 필요: 실제 경위).
- 협업 방식: 브랜치 전략, 코드 리뷰, PR 단위 작업 흔적이 로컬 저장소에는 없습니다. `main` 브랜치에 3개 커밋이 순차적으로 직접 반영되었습니다. GitHub 상의 PR 이력은 `gh` 인증이 되어있지 않아 이 환경에서 조회하지 못했습니다(확인 필요: GitHub 웹에서 PR/이슈 존재 여부 직접 확인).
- 명세 선정의, 문서화 산출물(설계 문서, API 명세서, README)은 레포에 존재하지 않습니다(확인 필요 또는 해당 없음).

---

# 3. 기술 스택

빌드 파일(`package.json`, `tsconfig.json`)에서 확인된 항목만 기재합니다.

| 분야 | 기술 | 버전(명시된 range) | 근거 | 선택 이유 |
| --- | --- | --- | --- | --- |
| 런타임 | Node.js | 미지정(`engines` 필드 없음) | `package.json` | (확인 필요) |
| 언어 | TypeScript | `^5.5.2` (devDependency) | `package.json` | (확인 필요) |
| 컴파일 타깃 | ES2022 / CommonJS | `tsconfig.json` `target: ES2022`, `module: CommonJS` | `tsconfig.json` | (확인 필요) |
| HTTP 클라이언트 | axios | `^1.7.2` | `package.json` | Coupang API 서명 헤더를 직접 구성해 요청해야 해서 저수준 제어가 쉬운 axios를 사용한 것으로 보이나, 다른 HTTP 클라이언트와의 비교 근거는 문서에 없음(확인 필요) |
| 환경변수 관리 | dotenv | `^16.4.5` | `package.json` | `.env` 파일 기반 설정 로드(`src/config/env.ts`) |
| 개발 실행기 | ts-node | `^10.9.2` (devDependency) | `package.json` | `npm run dev` 스크립트에서 TS를 즉시 실행하기 위해 사용 |
| 타입 정의 | @types/node | `^20.14.9` (devDependency) | `package.json` | Node.js 내장 모듈(`crypto`, `path`) 타입 지원 |
| 알림 채널 | Discord Webhook | - | `src/services/discord.service.ts` | 오류 발생 시 운영자에게 알리기 위한 채널로 확인됨 |
| 알림 채널(레거시/미사용) | Slack Webhook | - | `dist/services/slack.service.js`, `.env.example`의 `SLACK_WEBHOOK_URL` | 현재 `src/`에는 대응 소스가 없어 실제로 사용 중인지 불명확(확인 필요) |
| 빌드 도구 | tsc | `package.json`의 `build` 스크립트(`tsc`) | - | TypeScript 표준 컴파일러 |
| 테스트 프레임워크 | 없음 | - | `package.json`에 테스트 관련 의존성/스크립트 없음 | 해당 없음 |
| CI/CD | 없음 | - | `.github/workflows` 등 CI 설정 파일이 레포에 없음 | 해당 없음 |
| 컨테이너/배포 | 없음 | - | `Dockerfile`, k8s manifest 등이 레포에 없음 | 해당 없음 |
| 데이터베이스 | 없음 | - | 소스 전체에 DB 클라이언트/ORM 의존성 없음 | 해당 없음(쿠폰 상태는 Coupang API 원격 조회로만 관리) |

---

# 4. 설계

## 아키텍처

- 단일 프로세스 CLI 스크립트로, 계층은 3단계로 구분됩니다.
    1. **엔트리포인트(`src/index.ts`)**: 설정 로드 확인, 서명 생성 데모 출력, `--run` 플래그 분기.
    2. **오케스트레이션(`src/services/coupon.manager.ts`)**: `CouponManager.runDailyRollover()`가 "조회 → 폐기 → 신규 발급" 3단계를 순서대로 실행하고 각 단계 실패 시 알림을 발송.
    3. **외부 연동(`src/services/coupang.service.ts`, `src/services/discord.service.ts`, `src/utils/signature.ts`)**: Coupang API 호출과 서명 생성, Discord 알림 발송을 담당.
- 요청 처리 흐름(정상 케이스):
  1. `main()`(`src/index.ts:5`)이 `config`를 로드하고 서명 생성을 1회 테스트 출력.
  2. `--run` 플래그가 있으면 `CouponManager.runDailyRollover()` 호출.
  3. `CoupangService.getActiveCoupons()`로 현재 `ACTIVE` 상태 쿠폰 목록 조회(`GET /v2/providers/fms/apis/api/v2/vendors/{vendorId}/coupons`).
  4. 조회된 쿠폰마다 `CoupangService.expireCoupon(couponId)` 호출(`PUT .../coupons/{couponId}?action=expire`), 개별 실패는 `catch`로 격리하고 계속 진행.
  5. `CoupangService.createCoupon(discountValue)` 호출 전, `getContractId()`로 계약 ID를 조회(캐시 우선 → env 변수 → 계약 목록 API → 단일 계약 조회 API 순으로 fallback).
  6. 신규 쿠폰을 `POST /v2/providers/fms/apis/api/v2/vendors/{vendorId}/coupon`으로 생성.
  7. 각 단계에서 예외가 발생하면 `DiscordService.sendErrorNotification()`이 Discord Webhook으로 오류 컨텍스트와 스택 트레이스 일부를 전송.
- 스케줄러, 큐, 워커 등 비동기 처리/동시성 구성 요소는 레포에 없습니다. 실행은 항상 단일 동기 흐름(순차 await)입니다.

## 데이터 모델

- 별도 데이터베이스가 없어 "데이터 모델"은 Coupang API와 주고받는 TypeScript interface로만 존재합니다(`src/services/coupang.service.ts`).
  - `CoupangCoupon`: `couponId`, `name`, `status`(`ACTIVE`/`EXPIRED`/`STOPPED`), `discount`, `type`(`RATE`/`FIXED_WITH_QUANTITY`/`PRICE`), `startAt`, `endAt`, `vendorId?`.
  - `CreateCouponResponse`: `couponId`, `requestedId`, `status`.
  - `CoupangApiErrorResponse`: `code`, `message`.
- 이 interface들은 커밋 `c726127`에서 필드명과 타입이 전면 교체되었습니다(예: `couponName`→`name`, `discountValue`→`discount`, `discountType`→`type`, ISO 문자열 필드명 `startDateTime`→`startAt`). 교체 이유(실측 API 응답과의 불일치 등)는 커밋 메시지("타입 안정성 확인")로 짐작할 수는 있으나 구체적 근거 로그는 없습니다(확인 필요).
- 인덱스 설계: 해당 없음(로컬 저장소/DB가 없어 인덱스 개념이 적용되지 않음).

## API 및 인터페이스

- 이 프로젝트 자체는 API 서버가 아니라 API **클라이언트**입니다. 외부에 노출하는 엔드포인트는 없습니다.
- Coupang WING API 호출 규약(`src/services/coupang.service.ts`):
  - Base URL: `https://api-gateway.coupang.com`
  - 인증: 모든 요청에 `Authorization: CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...` 헤더 첨부(`src/utils/signature.ts`의 `generateSignature()`가 생성).
  - 응답 파싱: `response.data || response.content || response` 형태로 여러 응답 래핑 구조를 모두 허용하도록 방어적으로 작성(`getActiveCoupons()`, `getContractId()` 내부).
  - 에러 처리: `request()` 메서드에서 발생한 예외를 `handleError()`가 가로채 `axios.isAxiosError` 여부로 분기하고, HTTP status/Coupang 응답 코드/메시지를 로그로 남긴 뒤 원래 예외를 다시 throw(`src/services/coupang.service.ts:210-226`). 상위(`CouponManager`)에서 최종적으로 Discord 알림으로 전달.
  - 타임아웃: axios 요청에 10000ms(10초) 고정 타임아웃 적용(`coupang.service.ts:69`).
- 응답 규격 통일(예: 공통 응답 wrapper, 에러 코드 표준화)은 이 프로젝트가 API 서버가 아니므로 해당 없음.

## 인프라 및 배포

- 실행 환경: 로컬 Node.js 프로세스(`npm run dev` 또는 `npm run build && npm start`)로만 확인됩니다. 실제 배포 서버, 클라우드 환경, 컨테이너 여부는 레포에 근거가 없습니다(확인 필요).
- 배포 파이프라인: `.github/workflows` 등 CI/CD 설정 파일 없음. `package.json`에 `build`/`start`/`dev` 스크립트만 존재(해당 없음/확인 필요).
- 설정 관리: `.env` 파일과 `dotenv`로 관리(`src/config/env.ts`). `.env.example`에 필요한 키 목록이 문서화되어 있습니다: `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`, `COUPANG_VENDOR_ID`, `DISCOUNT_VALUE`, `SLACK_WEBHOOK_URL`. 다만 실제 코드(`env.ts`)가 참조하는 변수명은 `DISCORD_WEBHOOK_URL`이라 `.env.example`(`SLACK_WEBHOOK_URL`)과 실제 코드가 불일치합니다(10장에서 추가 서술).
- 민감정보 존재: 과거 커밋에 실제 Coupang API 자격 증명과 Discord Webhook URL이 평문으로 포함되어 있었습니다. 구체적 값은 본 문서에 기재하지 않습니다. 근거와 대응 현황은 6장, 10장에서 다룹니다.

## 디렉터리 구조

```
coupang-wing-coupon-manager/
├── src/                          # TypeScript 소스 (컴파일 대상)
│   ├── config/
│   │   └── env.ts                # dotenv 로드 및 환경변수 검증
│   ├── services/
│   │   ├── coupang.service.ts    # Coupang WING FMS API 클라이언트
│   │   ├── coupon.manager.ts     # 일일 롤오버 오케스트레이션
│   │   └── discord.service.ts    # Discord Webhook 오류 알림
│   ├── utils/
│   │   └── signature.ts          # HMAC-SHA256 서명/Authorization 헤더 생성
│   └── index.ts                  # 엔트리포인트(CLI)
├── dist/                          # tsc 컴파일 산출물 (현재 git에 커밋된 상태, 10장 참고)
│   └── services/slack.service.js # src에 대응 소스가 없는 잔존 산출물
├── package.json                   # 의존성 및 npm 스크립트(build/start/dev)
├── tsconfig.json                  # TypeScript 컴파일 설정
├── .env.example                   # 필요한 환경변수 키 목록(값은 placeholder)
└── .gitignore                     # node_modules/dist/.env 제외 설정(현재 신규 추가 상태, 10장 참고)
```

---

# 5. 핵심 구현

## Coupang API 커스텀 HMAC-SHA256 서명 인증

**무엇을 구현했는가**: Coupang Open API가 요구하는 자체 서명 인증 방식(`CEA algorithm=HmacSHA256`)을 구현했습니다. 표준 OAuth나 API Key 단일 헤더가 아니라, 매 요청마다 타임스탬프·메서드·경로·쿼리스트링을 조합한 메시지를 비밀키로 HMAC 서명해야 하는 방식입니다.

**어떻게 구현했는가**(`src/utils/signature.ts`):
1. UTC 기준 `YYMMDDTHHmmssZ` 포맷의 타임스탬프를 직접 생성(`Date.getUTCFullYear/Month/...`를 조합, 라이브러리 미사용).
2. 쿼리스트링 선두에 `?`가 있으면 제거해 정규화.
3. `{timestamp}{METHOD}{path}{queryString}` 순서로 메시지 문자열을 조립.
4. Node.js 내장 `crypto.createHmac('sha256', secretKey)`로 서명 후 `hex` 인코딩.
5. `CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...` 형태의 Authorization 헤더 문자열을 조립해 반환.
6. `CoupangService.request()`가 매 API 호출 시 이 함수를 호출해 헤더를 재생성(서명은 요청마다 새로 계산되며 캐시하지 않음).

**선택지와 판단**: 서명 로직을 별도 유틸 함수(`generateSignature`)로 분리해 `CoupangService`와 `src/index.ts`(서명 테스트 출력용)에서 재사용하도록 구성했습니다. HMAC 라이브러리(예: 서드파티 crypto 패키지) 대신 Node 내장 `crypto` 모듈만 사용한 점이 `package.json` 의존성 목록에서 확인됩니다. 다른 서명 구현 방식(예: 클래스 캡슐화)과 비교한 근거는 문서화되어 있지 않습니다(확인 필요).

**코드 발췌** (`src/utils/signature.ts:24-53`):
```typescript
const date = new Date();
const yy = date.getUTCFullYear().toString().slice(-2);
const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
const dd = String(date.getUTCDate()).padStart(2, '0');
const hh = String(date.getUTCHours()).padStart(2, '0');
const mi = String(date.getUTCMinutes()).padStart(2, '0');
const ss = String(date.getUTCSeconds()).padStart(2, '0');
const timestamp = `${yy}${mm}${dd}T${hh}${mi}${ss}Z`;

const methodUpper = method.toUpperCase();
let cleanQuery = queryString;
if (cleanQuery.startsWith('?')) {
  cleanQuery = cleanQuery.substring(1);
}

const message = `${timestamp}${methodUpper}${path}${cleanQuery}`;

const signature = crypto
  .createHmac('sha256', secretKey)
  .update(message)
  .digest('hex');

const authorizationHeader = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${timestamp}, signature=${signature}`;
```

## 계약(Contract) ID 캐싱 및 다단계 Fallback 조회

**무엇을 구현했는가**: 신규 쿠폰 생성 시 필요한 `contractId`를 여러 소스에서 순차적으로 조회하는 로직을 구현했습니다(`CoupangService.getContractId()`).

**어떻게 구현했는가**(`src/services/coupang.service.ts:82-138`):
1. 인스턴스 필드 `cachedContractId`에 값이 있으면 즉시 반환(같은 프로세스 내 반복 API 호출 방지).
2. 캐시가 없으면 환경변수 `COUPANG_CONTRACT_ID`를 확인해 숫자로 파싱 가능하면 캐시 후 반환.
3. 둘 다 없으면 계약 목록 조회 API(`GET .../contract/list`)를 호출해 첫 번째 계약의 `contractId`를 추출(배열/객체 응답 구조를 모두 처리).
4. 목록 조회가 실패하거나 값이 없으면 단일 계약 조회 API(`GET .../contract`)로 재시도.
5. 모든 경로에서 값을 얻지 못하면 사용자에게 `.env`에 `COUPANG_CONTRACT_ID`를 직접 지정하라는 안내 메시지와 함께 예외를 throw.

**선택지와 판단**: env 변수 우선 조회를 첫 fallback으로 둔 것은 API 호출 없이 즉시 값을 얻을 수 있도록 하기 위한 것으로 보이나, 이 설계 의도가 커밋 메시지나 문서로 명시되어 있지는 않습니다(확인 필요). 목록 조회와 단일 조회 두 API를 모두 대비한 것은 계약이 1개인 셀러와 여러 개인 셀러 상황을 모두 다루기 위한 것으로 추정되나 마찬가지로 명시적 근거는 없습니다(확인 필요).

**코드 발췌** (`src/services/coupang.service.ts:82-117`):
```typescript
async getContractId(): Promise<number> {
  if (this.cachedContractId !== null) {
    return this.cachedContractId;
  }

  if (process.env.COUPANG_CONTRACT_ID) {
    const parsed = parseInt(process.env.COUPANG_CONTRACT_ID, 10);
    if (!isNaN(parsed)) {
      this.cachedContractId = parsed;
      return parsed;
    }
  }

  try {
    const listPath = `/v2/providers/fms/apis/api/v2/vendors/${this.vendorId}/contract/list`;
    const response = await this.request<any>('GET', listPath);
    const list = response.data || response.content || response;

    let contractId: number | undefined;
    if (Array.isArray(list)) {
      contractId = list[0]?.contractId;
    } else if (list && typeof list === 'object') {
      contractId = list.contractId || list.data?.contractId;
    }

    if (contractId) {
      this.cachedContractId = contractId;
      return contractId;
    }
  } catch (err) {
    console.warn('[CoupangService] Failed to fetch contract list dynamically. Trying single contract lookup...');
  }
  // ... 단일 계약 조회 fallback, src/services/coupang.service.ts:119-137
}
```

## 단계별 실패 격리를 적용한 순차 롤오버 오케스트레이션

**무엇을 구현했는가**: "기존 쿠폰 조회 → 폐기 → 신규 발급" 3단계를 하나의 실패가 전체를 중단시키지 않도록 격리해서 실행하는 오케스트레이션 로직입니다(`CouponManager.runDailyRollover()`).

**어떻게 구현했는가**(`src/services/coupon.manager.ts`):
1. 1단계 조회가 실패하면 알림을 보내고 즉시 전체를 중단(`throw`) — 조회 자체가 안 되면 이후 단계를 진행할 데이터가 없기 때문으로 보입니다.
2. 2단계 폐기는 `for...of` 루프 안에서 쿠폰 1개씩 `try/catch`로 감싸, 특정 쿠폰 폐기가 실패해도 다음 쿠폰 폐기를 계속 시도합니다. 실패한 건은 개별적으로 Discord 알림을 발송합니다.
3. 3단계 신규 발급이 실패하면 알림 후 다시 `throw`.
4. 전체를 감싸는 최상위 `try/catch`가 있어, 어느 단계에서 throw가 올라와도 프로세스가 처리되지 않은 예외로 죽지 않고 로그만 남기고 종료합니다.

**선택지와 판단**: 2단계만 부분 실패를 허용하고 1·3단계는 즉시 중단하도록 설계한 것은, "일부 쿠폰 폐기 실패는 감내할 수 있지만 조회 실패나 신규 발급 실패는 그날 쿠폰 운영 자체가 안 되는 상황"이라는 판단으로 해석할 수 있습니다. 다만 이 판단 기준이 문서나 커밋 메시지로 명시되어 있지는 않습니다(확인 필요).

**코드 발췌** (`src/services/coupon.manager.ts:15-53`):
```typescript
async runDailyRollover(): Promise<void> {
  try {
    let activeCoupons;
    try {
      activeCoupons = await this.coupangService.getActiveCoupons();
    } catch (err) {
      await this.discordService.sendErrorNotification('1단계: 기존 활성 쿠폰 조회 실패', err);
      throw err;
    }

    for (const coupon of activeCoupons) {
      try {
        await this.coupangService.expireCoupon(coupon.couponId);
      } catch (err) {
        await this.discordService.sendErrorNotification(
          `2단계: 기존 쿠폰 폐기 실패 (Coupon ID: ${coupon.couponId})`,
          err
        );
      }
    }

    try {
      const newCoupon = await this.coupangService.createCoupon(config.DISCOUNT_VALUE);
    } catch (err) {
      await this.discordService.sendErrorNotification(
        `3단계: 신규 당일 쿠폰 생성 실패 (설정 금액: ${config.DISCOUNT_VALUE}원)`,
        err
      );
      throw err;
    }
  } catch (error) {
    console.error('[CouponManager] Daily rollover process terminated with errors.', error);
  }
}
```

## 환경변수 검증 시 플레이스홀더 값 방어

**무엇을 구현했는가**: `.env` 설정값이 비어있거나 예시 파일의 placeholder(`your_...`)를 그대로 두고 실행한 경우를 기동 시점에 감지해 즉시 에러로 알리는 로직입니다(`src/config/env.ts`).

**어떻게 구현했는가**:
1. `getEnvOrThrow(key)`가 값이 없거나, 공백이거나, 문자열에 `'your_'`가 포함되면 `[Configuration Error]` 예외를 throw.
2. `DISCOUNT_VALUE`는 `parseDiscountValue()`로 정수 변환 후 양수인지 검증.
3. `DISCORD_WEBHOOK_URL`은 필수값이 아니라, 값이 있고 `'your/'`를 포함하지 않을 때만 유효한 값으로 채택하고, 그렇지 않으면 `undefined`로 처리해 알림 기능을 조용히 비활성화.

**선택지와 판단**: 런타임에 API를 호출하기 전에 설정 오류를 기동 시점(모듈 로드 시점)에 조기 발견하도록 한 설계입니다. 문자열 포함 검사(`includes('your_')`)로 placeholder를 감지하는 방식은 `.env.example`의 실제 placeholder 표기(`your_access_key_here` 등)와 맞춰 만든 것으로 보입니다.

**코드 발췌** (`src/config/env.ts:15-29`):
```typescript
const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value || value.trim() === '' || value.includes('your_')) {
    throw new Error(`[Configuration Error] Environment variable '${key}' is required but not configured correctly in .env.`);
  }
  return value;
};

const parseDiscountValue = (value: string): number => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`[Configuration Error] Environment variable 'DISCOUNT_VALUE' must be a positive integer. Got: "${value}"`);
  }
  return parsed;
};
```

---

# 6. 트러블 슈팅

## Coupang API 엔드포인트 경로·요청 스펙 전면 교체

**문제 상황**: 최초 구현(커밋 `3cb5e37`)은 쿠폰 조회/폐기/생성에 `openapi` 계열 경로(`/v2/providers/openapi/apis/api/v4/vendors/{vendorId}/coupons`)와 ISO 8601 날짜 포맷, `couponName`/`discountType`/`discountValue` 필드명을 사용했습니다. 바로 다음 커밋(`c726127`, 같은 날 14:51, 최초 커밋 4분 뒤)에서 이 경로와 필드 구조가 전면 교체되었습니다. 정확한 실패 응답(HTTP status, Coupang 에러 코드)이나 재현 조건은 커밋 메시지나 로그로 남아있지 않아 확인이 필요합니다(확인 필요: 원 실패 로그).

**원인 분석**: 두 커밋의 diff(`git show c726127 -- src/services/coupang.service.ts`)로 다음 변경이 코드로 확인됩니다.
- 조회: `openapi v4` 경로 → `fms v2` 경로(`/v2/providers/fms/apis/api/v2/vendors/{vendorId}/coupons`)로 교체.
- 폐기: 경로 끝에 `/expire`를 붙이는 방식 → 별도 쿼리 파라미터 `?action=expire`를 붙이는 방식(`/v1/vendors/{vendorId}/coupons/{couponId}?action=expire`)으로 교체.
- 생성: 경로가 `/coupons`(복수, v4)에서 `/coupon`(단수, v2)로 변경되었고, 요청 바디에 `contractId`가 새로 추가되었으며 날짜 포맷이 `toISOString()` → `"YYYY-MM-DD HH:mm:ss"` 커스텀 포맷으로 변경.
- 타입: `CoupangCoupon`, `CreateCouponResponse` interface의 필드명과 값 도메인이 전부 교체(`discountType: 'FIXED_AMOUNT'|'PERCENTAGE'` → `type: 'RATE'|'FIXED_WITH_QUANTITY'|'PRICE'` 등).
- 이 패턴(경로 버전 교체 + 필수 파라미터 추가 + 날짜 포맷 변경)은 최초 구현이 문서만 보고 추정한 스펙이었고, 실제 API가 요구하는 스펙(계약 기반 API, 특정 날짜 포맷)과 달랐다는 것을 강하게 시사하지만, 이는 diff 내용에 기반한 추론이며 원인을 직접 증명하는 에러 로그는 레포에 없습니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| 기존 openapi v4 경로 유지, 파라미터만 보정 | 변경 범위 최소화 | 실제 API가 v4 경로에서 요구 응답을 주지 않았다면 근본 해결 불가 | 채택 안 됨(경로 자체를 fms v2로 교체) |
| fms v2 경로 + contractId 조회 로직 추가 | 실제 Coupang FMS API 스펙에 맞춰 계약 기반 쿠폰 생성 가능 | 계약 조회용 API 호출이 추가되어 요청 수 증가 | 채택됨 |

**해결 과정**: `getContractId()`(5장 참고)를 신설해 계약 ID를 캐싱 및 다단계 fallback으로 조회하도록 하고, 세 API 호출(조회/폐기/생성)의 경로·쿼리·바디를 fms v2/v1 스펙에 맞춰 재작성했습니다. 날짜 포맷도 Coupang이 요구하는 `"YYYY-MM-DD HH:mm:ss"` 형태로 직접 포맷하는 `formatDate()` 헬퍼를 추가했습니다.

**코드 발췌 (변경 전, `git show 3cb5e37:src/services/coupang.service.ts` 발췌)**:
```typescript
async createCoupon(discountValue: number): Promise<CreateCouponResponse> {
  const path = `/v2/providers/openapi/apis/api/v4/vendors/${this.vendorId}/coupons`;

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const body = {
    couponName: `즉시할인쿠폰_${now.toISOString().split('T')[0]}`,
    discountType: 'FIXED_AMOUNT',
    discountValue: discountValue,
    startDateTime: now.toISOString(),
    endDateTime: tomorrow.toISOString(),
  };

  return await this.request<CreateCouponResponse>('POST', path, {}, body);
}
```

**코드 발췌 (변경 후, `src/services/coupang.service.ts:178-205`)**:
```typescript
async createCoupon(discountValue: number): Promise<CreateCouponResponse> {
  const path = `/v2/providers/fms/apis/api/v2/vendors/${this.vendorId}/coupon`;
  const contractId = await this.getContractId();

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const body = {
    contractId: contractId,
    name: `즉시할인쿠폰_${now.toISOString().split('T')[0]}`,
    maxDiscountPrice: discountValue,
    discount: discountValue,
    startAt: formatDate(now),
    endAt: formatDate(tomorrow),
    type: 'PRICE',
    wowExclusive: false
  };

  return await this.request<CreateCouponResponse>('POST', path, {}, body);
}
```

**결과**: 변경 전/후 실제 API 호출 성공 여부를 비교할 로그나 테스트 결과가 레포에 없습니다(수치 확인 필요: 실제 Coupang API에 대한 호출 성공/실패 기록). 코드 관점에서는 필수 파라미터(`contractId`)가 없던 상태에서 있는 상태로 바뀐 것과 날짜 포맷이 명확한 스펙 형태로 바뀐 것은 사실로 확인됩니다.

**근거**: 커밋 `c726127379a395cf86fac8ba55a494c86fa040a7`("feat: 즉시할인 쿠폰 경로 교체 및 타입 안정성 확인"), 이전 커밋 `3cb5e37d690106939f6e045b2b1aac3a95281aba`, 파일 `src/services/coupang.service.ts`.

**배운 점**: 다른 곳에 적용한 사례는 레포 범위(3커밋, 단일 파일 그룹) 내에서 확인되지 않습니다(확인 필요).

## 저장소에 커밋된 실제 API 자격 증명 삭제 및 키 교체

**문제 상황**: 프로젝트 초기 커밋(`3cb5e37`)에서 `.env` 파일이 `.gitignore`에 등록되지 않은 상태로 커밋되어, 실제 Coupang API Access Key/Secret Key/Vendor ID와 Discord Webhook URL이 평문으로 git 히스토리에 포함되었습니다. 구체적 값은 이 문서에 기재하지 않습니다.

**원인 분석**: 최초 커밋 시점의 `.gitignore`(당시 파일)에 `.env` 제외 규칙이 없었던 것으로 보이며(현재 워킹트리의 `.gitignore`는 아직 커밋되지 않은 신규 파일 상태, `git status` 확인), `.env`가 다른 소스 파일들과 함께 그대로 add된 것이 원인입니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| 워킹트리에서 `.env` 삭제 커밋만 추가 | 작업이 간단함 | git 히스토리(과거 커밋의 blob)에는 여전히 값이 남아 완전한 해결이 아님 | 채택됨(단, 한계 그대로 남아있음. 아래 결과 참고) |
| `git filter-repo`/BFG로 히스토리 재작성 후 force-push | 히스토리에서 완전히 제거 가능 | 이미 push된 히스토리라면 강제 재작성/force-push 필요, 공동 작업자 영향 | 채택 안 됨(현재 레포 상태에서 흔적 없음) |

**해결 과정**: 커밋 `e9f5bf1`에서 `.env` 파일을 삭제(`git rm` 상당)하고 커밋 메시지에 "키 변경"이라고 명시했습니다. 동시에 `.gitignore`를 새로 추가해 `node_modules/`, `dist/`, `.env`, `.env.local`, `.env.*.local`, `*.log`, `.DS_Store`를 제외 대상으로 등록했습니다(단, 이 `.gitignore` 자체는 아직 커밋되지 않고 staged 상태입니다).

**코드 발췌 (변경 전 → 후 요약, 값은 비공개)**:
```diff
--- a/.env  (commit 3cb5e37에서 추가됨, 실제 키/시크릿/웹훅 URL 포함 — 값 비공개)
+++ /dev/null  (commit e9f5bf1에서 삭제)
```

**결과**: 워킹트리와 최신 커밋 시점 기준으로 `.env`는 더 이상 추적되지 않습니다(`git ls-files | grep '^\.env$'` 결과 없음, 확인됨). 다만 **과거 커밋(`3cb5e37`)의 blob 자체는 여전히 로컬 git 히스토리에 남아 있으며, `git show 3cb5e37:.env`로 지금도 조회가 가능합니다.** 또한 `git status` 기준 로컬이 origin보다 1커밋 앞서 있어, 키를 삭제한 커밋(`e9f5bf1`)이 아직 GitHub에 push되지 않았을 가능성이 있습니다. 즉 이 삭제/키교체 작업이 원격 저장소에도 반영되어 실제로 노출이 종료되었는지는 이 로컬 조회만으로 확정할 수 없습니다(확인 필요, 10장에서 강조).

**근거**: 커밋 `e9f5bf11958e78ba7cbb9cee2bb759bd108a49af`("chore: gitignore 업데이트 및 키 변경"), 커밋 `3cb5e37d690106939f6e045b2b1aac3a95281aba`, 파일 `.env`, `.gitignore`.

**배운 점**: 다른 곳에 적용한 사례는 레포 범위 내에서 확인되지 않습니다. 다만 이 사례 자체가 "커밋 전 `.gitignore`를 먼저 설정해야 한다"는 일반적 교훈을 보여주는 사례로 판단됩니다.

### 확인 필요 항목으로 이동된 후보

- `dist/services/slack.service.js`와 `src`에 대응 소스가 없는 불일치는 "발굴"되었지만, 이를 문제/원인/해결로 서술할 수 있는 diff나 커밋 메시지가 없어(즉 언제, 왜 `slack.service.ts`가 사라졌는지 기록이 없음) 트러블슈팅 항목이 아니라 10장 "확인 필요 항목"으로 분류했습니다.

---

# 7. 결과

- 정량 지표: 코드 규모(TypeScript 494 lines, 6개 파일, 4개 서비스/유틸 클래스) 외에는 실 운영 처리량, 성공률, 응답 시간 등 성과를 나타내는 수치가 레포에 없습니다(수치 확인 필요: 운영 로그 또는 모니터링 도구 연동 필요).
- 수상: 확인되지 않음(해당 없음).
- 배포와 운영 결과: 실제 배포 여부, 배포 주소, 운영 기간이 레포에서 확인되지 않습니다(확인 필요).
- 테스트 현황: 단위 테스트, 통합 테스트, 테스트 프레임워크 설정이 전혀 없습니다(`package.json`에 test 스크립트 없음, `src`/`dist`에 `*.test.ts`, `*.spec.ts` 파일 없음). 코드 검증은 `src/index.ts`의 서명 생성 콘솔 출력(수동 확인 목적)이 유일합니다.

---

# 8. 회고

- 테스트 코드가 전혀 없어, 6장의 API 스펙 전면 교체(`c726127`)처럼 외부 API 연동 로직을 변경할 때 회귀를 자동으로 검증할 방법이 없었습니다. 다시 한다면 최소한 `generateSignature()`(순수 함수라 테스트가 쉬움)와 `getContractId()`의 fallback 분기에 대해 유닛 테스트를 먼저 작성했을 것입니다.
- `.env`가 초기 커밋에 그대로 포함되어 실제 키가 노출된 이력이 남았습니다(6장). 다시 한다면 저장소 초기화 시점에 `.gitignore`를 가장 먼저 커밋하고, 그 다음에 소스와 설정 파일을 추가하는 순서로 작업했을 것입니다.
- `dist/` 컴파일 산출물과 `node_modules/`가 git에 커밋되어 있어(현재도 959개 파일이 추적 중, `git ls-files` 확인) 저장소가 불필요하게 커집니다. 다시 한다면 프로젝트 시작 시점부터 `dist/`, `node_modules/`를 커밋 대상에서 제외했을 것입니다.
- `.env.example`은 `SLACK_WEBHOOK_URL`을 안내하지만 실제 코드(`env.ts`)는 `DISCORD_WEBHOOK_URL`을 사용합니다. 다시 한다면 예시 파일과 실제 코드의 변수명을 항상 같은 커밋에서 함께 갱신했을 것입니다.
- "scheduler script"라는 설명이 있지만 실제 반복 실행 트리거(cron 등)가 레포에 포함되어 있지 않아, 이 코드만으로는 실제 "매일 자동 실행"이 보장되지 않습니다. 다시 한다면 스케줄링 방식(예: GitHub Actions `schedule` 트리거, 또는 서버의 crontab 설정 파일)까지 레포에 포함해 문서화했을 것입니다.

---

# 9. 스크린샷 및 문서 제안

- 이 레포에는 이미지, PDF, 다이어그램, docs 폴더가 존재하지 않습니다(확인됨: 루트에 `docs/`, `*.png`, `*.pdf` 없음).
- 포트폴리오 상세 페이지에 추가하면 좋을 캡처/다이어그램 제안:

| 파일명(제안) | 촬영/제작할 대상 | 들어갈 섹션 |
| --- | --- | --- |
| `arch-flow.png` | 4장 "요청이 처리되는 흐름" 7단계를 도식화한 시퀀스 다이어그램(직접 제작 필요, 레포에 원본 없음) | 4. 설계 - 아키텍처 |
| `cli-run-log.png` | `npm run dev -- --run` 실행 시 터미널 콘솔 출력 캡처(설정 로드 로그, 서명 생성 로그, 각 단계 진행 로그) | 5. 핵심 구현 / 7. 결과 |
| `discord-alert.png` | 오류 발생 시 Discord 채널에 실제로 표시되는 Embed 알림 캡처(테스트 웹훅 필요) | 5. 핵심 구현 - DiscordService |
| `coupang-console.png` | Coupang WING 판매자 콘솔에서 실제 쿠폰이 생성/폐기된 화면(비즈니스 계정 접근 필요) | 2. 개요 - 배경과 문제 |
| `commit-diff-c726127.png` | 6장 트러블슈팅의 diff를 보기 좋게 편집한 코드 비교 이미지 | 6. 트러블 슈팅 |

---

# 10. 확인 필요 항목

## 사용자가 직접 채워야 하는 정보

- 지원 직무: 사용자 입력에 명시되지 않았습니다. 백엔드/서버사이드 관점으로 서술했으나, 실제 지원 직무에 맞춰 3장(스택 선택 이유)과 5장(구현 판단 근거)의 강조점을 조정할 필요가 있습니다.
- 프로젝트명(포트폴리오 표기용): `package.json`의 `name`(`coupang-wing-coupon-manager`)을 그대로 사용했습니다. 별도 서비스명이 있다면 교체가 필요합니다.
- 실제 운영 여부와 기간: 이 스크립트가 실제로 반복 운영되고 있는지, 얼마나 오래 운영되었는지 확인이 필요합니다.
- 팀 구성/역할 경계: 로컬 히스토리상 단독 개발로 보이나, GitHub 상 이슈/PR/코드리뷰 참여자가 있었는지 재확인이 필요합니다(이 환경에서는 `gh` 인증이 없어 조회 불가).
- 스택 선택 이유(3장에 "(확인 필요)"로 남긴 항목 전부): TypeScript/axios/dotenv를 택한 배경.
- 실제 스케줄링 방식(2장, 4장에서 언급): cron, GitHub Actions, PM2 등 중 무엇을 사용하는지.
- 배포 환경/주소: 로컬 실행만 확인되고 서버 배포 여부는 불명확합니다.
- 수치 성과(1장, 7장): 처리 건수, 성공률, 알림 발송 횟수 등 실측 데이터.

## 보안 관련 확인 필요(우선순위 높음)

- 6장에서 서술한 것처럼 커밋 `3cb5e37`에 실제 Coupang API Access Key/Secret Key/Vendor ID와 Discord Webhook URL이 평문으로 포함되어 있고, `git status` 기준 이 저장소는 origin보다 1커밋 앞서 있어(즉 삭제 커밋 `e9f5bf1`이 아직 origin에 반영되지 않았을 가능성) **해당 자격 증명이 현재 GitHub 원격 저장소 히스토리에 그대로 남아있을 가능성이 있습니다.** 아래 순서로 직접 확인/조치가 필요합니다.
  1. GitHub 저장소(`https://github.com/kimyw1018/coupang-wing-coupon-manager`)에서 커밋 `3cb5e37`이 push되어 있는지 확인.
  2. push되어 있다면, 노출된 Coupang Access Key/Secret Key와 Discord Webhook URL이 이미 회전(rotate)되었는지 Coupang WING 판매자센터와 Discord 서버 설정에서 확인.
  3. 회전이 안 되어 있다면 즉시 키/웹훅을 재발급.
  4. 히스토리에서 완전히 제거하려면 `git filter-repo` 등으로 재작성 후 force-push가 필요하나, 이는 파괴적 작업이라 별도로 신중히 진행이 필요합니다(이번 분석에서는 코드 수정을 하지 않는다는 지침에 따라 실행하지 않았습니다).
- `.env.example`의 `SLACK_WEBHOOK_URL`과 실제 코드의 `DISCORD_WEBHOOK_URL` 불일치도 함께 정리가 필요합니다.
- 현재 `dist/`와 `node_modules/`(959개 파일)가 git에 커밋된 상태입니다. 신규 `.gitignore`는 아직 커밋되지 않았고, 커밋되어도 이미 추적 중인 파일은 자동으로 제외되지 않습니다(`git rm -r --cached dist node_modules` 필요). 이는 코드 수정에 해당하므로 이번 분석에서는 실행하지 않았습니다.

## 근거 부족으로 제외한 트러블슈팅 후보

- `dist/services/slack.service.js` 관련 이력: Slack 연동에서 Discord 연동으로 전환된 것으로 추정되나, 이 전환을 보여주는 커밋이나 diff가 git 히스토리에 없어(해당 파일의 `.ts` 원본이 커밋된 적이 없음) 트러블슈팅으로 서술할 근거가 부족합니다. "왜, 언제 전환했는지"는 확인이 필요합니다.

---

# 11. 면접 예상 질문

- "scheduler script"라고 설명했는데, 실제로는 코드에 반복 실행 트리거가 없습니다. 실제 운영 환경에서는 무엇으로 매일 실행을 트리거했는지 설명할 수 있어야 합니다(확인 필요: 실제 크론/스케줄러 구성).
- 커밋 `c726127`에서 API 경로와 파라미터가 전면 교체된 근본 원인(정확히 어떤 에러 응답을 받았는지)을 질문받을 수 있습니다. 현재 diff만으로는 "무엇이 실패했는지"의 1차 증거(에러 로그, 응답 바디)가 없으므로, 실제 겪었던 에러 메시지나 Coupang 문서와의 비교 과정을 별도로 기억해 두어야 합니다.
- `.env`가 커밋에 포함되었던 사건에 대해 "실제로 원격에도 반영되었는지, 키를 회전했는지, 언제 알았는지"를 질문받을 가능성이 높습니다. 10장의 보안 확인 필요 항목을 실제로 점검한 뒤 답변을 준비해야 합니다.
- `expireCoupon` 실패가 개별적으로 격리되도록 만든 이유(3단계 중 2단계만 부분 실패 허용)를 설명할 수 있어야 합니다. 코드상 설계는 확인되지만 "왜 그렇게 판단했는지"에 대한 문서화된 근거는 없으므로, 실제 의도를 본인 말로 재구성해 둘 필요가 있습니다.
- `getContractId()`의 캐시가 프로세스 재시작 시 초기화되는 인메모리 캐시라는 점, 그리고 이 스크립트가 프로세스 단위로 매번 새로 실행되는 구조라면 이 캐시가 실질적으로 어떤 효과를 주는지 질문받을 수 있습니다. 프로세스 생존 기간과 캐시 효용의 관계를 설명할 수 있어야 합니다.
- 테스트 코드가 전혀 없는 상태에서 외부 API 연동 코드를 안전하게 변경하기 위해 어떤 방법(수동 테스트, `src/index.ts`의 서명 출력 등)을 사용했는지 질문받을 수 있습니다.
