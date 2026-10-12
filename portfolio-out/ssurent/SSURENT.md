# 1. 3분 요약

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | SSURENT (숭실대 컴퓨터학부 물품 대여 서비스) |
| 한 줄 소개 | 숭실대 컴퓨터학부 학생을 대상으로 한 물품(우산, 보조배터리 등) 대여/반납 자동화 웹 서비스의 프론트엔드입니다. |
| 저장소 성격 | React 19 + TypeScript + Vite 기반 SPA (SSURENT-FE, 백엔드는 별도 저장소) |
| 담당 범위 | 관리자(Admin) 도메인 전 영역: 물품/회원/징계/대여이력/통계 관리 화면, 관리자 라우팅, 관리자 전용 API 연동, 배포(Vercel) 트러블슈팅 |
| 기간 | 2026-01-17 ~ 2026-06-09 (본인 커밋 기준, 저장소 전체 기간은 2025-08-10 ~ 2026-06-10) |
| 팀 구성 | 4인 (git author 기준, 실명 비공개) |
| 지원 직무 | 프론트엔드 개발자 |
| 링크 | 저장소: https://github.com/SSURENT/SSURENT-FE (확인 필요: 배포 주소 공개 여부) |

## 핵심 성과

- 커밋 로그 기준 본인 명의 커밋 36건(머지 커밋 제외), 8개 PR 단위 작업(#9, #23, #27, #38, #44, #48, #56)에 참여했습니다. (근거: `git shortlog -sne`, `git log --author`)
- 관리자 도메인 페이지 15개(AdminItems, AdminMembers, AdminMemberDetail, AdminPenaltyEdit, AdminRentalEdit, AdminStatistics, AdminInspect, InspectStatus, InspectHistory 등) 중 전량을 작성했습니다. (근거: `git log --name-only` 파일별 집계, 아래 2장 참조)
- Windows(대소문자 비구분 파일시스템)에서는 정상 동작하나 Vercel(Linux, 대소문자 구분)에서만 재현되는 import 해석 오류를 원인 파악 후 해결했습니다. (근거: 커밋 `d7fd90b`, `f708ebd9`, 상세는 6장)
- (수치 확인 필요: 실제 서비스 이용자 수, 대여 처리 건수, 응답 시간 등 운영 지표는 레포에 기록이 없어 확인 불가)

# 2. 개요

## 배경과 문제

- README에 명시된 목적은 "숭실대 컴퓨터학부 대여사업 자동화 웹 프로그램"입니다. (근거: `README.md`)
- 서비스는 일반 사용자용 대여/반납 플로우(Home, Rent, Return, MyPage)와 관리자용 운영 플로우(물품/회원/징계/대여이력/통계 관리, 물품 검수)로 나뉘어 있습니다. (근거: `src/App.tsx` 라우트 정의, `src/features/*` 디렉터리 구성)
- 기술적으로 어려웠던 지점은 다음 세 가지로 코드에서 확인됩니다.
  1. 여러 명이 동시에 관리자 화면을 병행 개발하면서 발생한 API 응답 스키마 불일치(카테고리 그룹 구조 vs 평탄화된 배열 구조)를 프론트에서 흡수해야 했습니다. (근거: `src/api/endpoints/AdminItem.ts`)
  2. 로컬 개발 환경(Windows)과 배포 환경(Vercel, Linux)의 파일시스템 대소문자 구분 차이로 인해 로컬에서는 재현되지 않는 배포 전용 오류가 발생했습니다. (근거: 커밋 `d7fd90b`, `f708ebd9`, 6장 참조)
  3. 인증 토큰을 헤더 주입이 아닌 `sessionStorage` 폴링 방식으로 갱신해야 했고, 이 과정에서 두 개의 서로 다른 인증 상태 저장소(`useAuthStore`, `useUserInfo`)가 병존하는 구조가 되었습니다. (근거: `src/features/auth/store/useAuthStore.ts`, `src/store/userStore.ts`, `src/hooks/UseAutoRefreshToken.ts`)
- 대상 사용자: 숭실대 컴퓨터학부 재학생(대여자), 학부 관리자/도우미(운영자). (근거: `src/types/Types.ts`의 `UserRoleType`이 `NORMAL/ADMIN/SUPERADMIN`으로 정의됨)

## 담당 범위

본인(git author: `kimyw1018 <poppppp00@gmail.com>`, `김예원 <164151329+kimyw1018@users.noreply.github.com>`)이 작성한 파일은 `git log --author` 기준 다음과 같이 집계됩니다. (근거: `git log --all --author="poppppp00@gmail.com" --author="164151329+kimyw1018" --name-only`)

| 영역 | 대표 경로 | 수정 횟수(커밋 수 기준) |
| --- | --- | --- |
| 물품 관리 | `src/features/admin/pages/AdminItems.tsx` | 11 |
| 회원 목록 | `src/features/admin/pages/MemberList.tsx` | 9 |
| 앱 라우팅 | `src/App.tsx` | 9 |
| 징계 관리 | `src/features/admin/pages/AdminPenaltyEdit.tsx` | 7 |
| 회원 상세 | `src/features/admin/pages/AdminMemberDetail.tsx` | 7 |
| 물품 검수 현황 | `src/features/admin/pages/InspectStatus.tsx` | 6 |
| 회원 관리 탭 | `src/features/admin/pages/AdminMembers.tsx` | 6 |
| 도우미 관리 | `src/features/admin/pages/AdminHelpers.tsx` | 6 |
| 회원 일괄 갱신 | `src/features/admin/pages/AdminMemberUpload.tsx` | 5 |
| 관리자 헤더 | `src/shared/components/Header/AdminHeader.tsx` | 4 |
| 검수 이력 | `src/features/admin/pages/InspectHistory.tsx` | 4 |
| 통계 | `src/features/admin/pages/AdminStatistics.tsx` | 4 |
| 대여내역 수정 | `src/features/admin/pages/AdminRentalEdit.tsx`(구 `Adminrentaledit.tsx`) | 4+2 |
| 관리자 메인 | `src/features/admin/pages/AdminHome.tsx` | 4 |
| 물품 검수 진입 | `src/features/admin/pages/AdminInspect.tsx` | 4 |
| 관리자 레이아웃 | `src/shared/components/Layout/AdminLayout.tsx` | 3 |
| API 클라이언트 | `src/api/Client.ts` | 2 |
| 관리자 회원/물품 API | `src/api/endpoints/AdminUser.ts`, `src/api/endpoints/AdminItem.ts` | 각 2 |
| 배포 설정 | `vercel.json`, `vite.config.ts`, `tsconfig*.json` | 각 1 |
| 보안 설정 | `.gitignore` (`.env` 제외 규칙 추가) | 2 |

- 참여한 PR/이슈 단위: `#9`(초기 환경 세팅), `#23`(관리자 UI 대량 구현), `#27`(Item DTO 타입 오류), `#38`(통계 UI/Vercel 배포/엑셀 내보내기), `#44`(배포 및 import 오류 해결), `#48`(관리자 대시보드 라우팅/징계 페이지), `#56`(관리자 회원/물품 조회 개선). (근거: 커밋 메시지의 `(#번호)` 표기)
- 요약하면 본인은 **관리자(Admin) 도메인 전체**(라우팅, 화면, API 연동, 배포 이슈 대응)를 담당했고, 일반 사용자 도메인(Home/Rent/Return, 인증 플로우 대부분)은 팀원이 작성했습니다. (근거: `src/features/home`, `src/features/rent`, `src/features/return`, `src/features/auth` 디렉터리에는 본인 커밋의 파일 목록에 해당 경로가 나타나지 않음)

## 타인 작성 영역과 협업 방식

- 통계 조회 훅(`src/hooks/useGetStatistics.ts`, 소문자 파일명)은 팀원이 `Feat: 통계 Hook 분리 (#44)`(커밋 `68ebfb6`)에서 작성했고, 이후 본인이 대문자 파일명(`UseGetStatistics.ts`)으로의 import 불일치를 수정했습니다. (근거: `git log --follow`로 확인한 파일 이력)
- 통계 페이지의 툴팁 타입 오류, 차트 데이터 미표시 수정(커밋 `1a550b9`, `e74f13d`)은 본인이 아닌 팀원이 진행했습니다. (근거: 해당 커밋의 author가 `sjieys`)
- Git 브랜치 전략: `feat/#번호`, `fix/#번호`, `refactor/#번호` 형태의 기능 브랜치를 `develop`에 PR로 병합하는 방식입니다. (근거: `git branch -a` 목록, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/` 하위 fix/refactor/feature 템플릿 존재)
- 이슈 템플릿이 fix/refactor/feature 3종으로 구분되어 있어 작업 성격별로 이슈를 먼저 생성하고 브랜치를 파는 방식으로 협업했음을 알 수 있습니다. (근거: `.github/ISSUE_TEMPLATE/fix-템플릿.md`, `refactor-템플릿.md`, `✨feature-템플릿.md`)
- 코드 리뷰 절차의 구체적인 방식(리뷰어 지정, 승인 규칙 등)은 레포 파일만으로는 확인되지 않습니다. (확인 필요)

# 3. 기술 스택

## 코어

| 분류 | 기술 | 버전 | 근거 |
| --- | --- | --- | --- |
| 언어 | TypeScript | ^5.9.3 | `package.json` |
| 프레임워크 | React | ^19.1.1 | `package.json` |
| 번들러 | Vite | ^7.3.1 | `package.json`, `vite.config.ts` |
| 라우팅 | react-router-dom | ^7.8.0 | `package.json` |

## 상태 관리 및 데이터

| 분류 | 기술 | 버전 | 근거 |
| --- | --- | --- | --- |
| 전역 상태 | zustand (+ persist 미들웨어) | ^5.0.10 | `package.json`, `src/features/auth/store/useAuthStore.ts` |
| 서버 상태 캐싱 | @tanstack/react-query | ^5.90.18 | `package.json`, `src/main.tsx` (Provider만 연결, 실제 쿼리 훅 사용처는 확인되지 않음) |

## UI

| 분류 | 기술 | 버전 | 근거 |
| --- | --- | --- | --- |
| CSS 프레임워크 | Tailwind CSS (@tailwindcss/vite) | ^4.1.18 | `package.json`, `vite.config.ts` |
| UI 킷 | react-bootstrap, bootstrap | ^2.10.10 / ^5.3.8 | `package.json`, `src/main.tsx` |
| 차트 | recharts | ^3.8.1 | `package.json`, `src/features/admin/pages/AdminStatistics.tsx` |
| 캐러셀 | react-items-carousel | ^2.8.0 | `package.json` |
| 아이콘 | react-bootstrap-icons | ^1.11.6 | `package.json` |

## 파일 처리

| 분류 | 기술 | 버전 | 근거 |
| --- | --- | --- | --- |
| 엑셀 생성 | exceljs | ^4.4.0 | `package.json`, `src/features/admin/pages/InspectStatus.tsx` |
| 엑셀 파싱 | xlsx | ^0.18.5 | `package.json` (사용처는 `AdminMemberUpload.tsx` 계열로 추정, 확인 필요) |
| 파일 다운로드 | file-saver | ^2.0.5 | `package.json`, `InspectStatus.tsx` |

## 품질/도구

| 분류 | 기술 | 버전 | 근거 |
| --- | --- | --- | --- |
| 포매터 | prettier (+ prettier-plugin-tailwindcss) | ^3.8.0 | `package.json`, `.prettierrc` |
| Git 훅 | husky + lint-staged | ^9.1.7 / ^16.2.7 | `.husky/pre-commit` (`npm run precommit` 실행) |
| 린트 | eslint-plugin-prettier, eslint-config-prettier | ^5.5.5 / ^10.1.8 | `package.json`에 devDependency로 존재하나 `.eslintrc`/`eslint.config.*` 파일은 레포에서 확인되지 않음 (확인 필요) |
| 테스트 | 없음 | - | `src` 하위에 `*.test.*` 파일 없음. `@testing-library/react`, `@types/jest`는 devDependency로 남아 있으나(Create React App 초기 세팅 잔재로 추정) 실제 테스트 코드나 test 스크립트는 없음 |

## 배포

| 분류 | 기술 | 근거 |
| --- | --- | --- |
| 호스팅 | Vercel | `vercel.json`, `.vercel/` 디렉터리 |
| 백엔드 연동 | Vercel rewrites를 통한 리버스 프록시 | `vercel.json`의 `rewrites` 설정 (내부 IP는 민감정보로 기록에서 제외) |
| 환경변수 | `VITE_API_BASE_URL` | `src/api/Client.ts` |

기술 선택 이유는 대부분 레포에 명시적으로 남아있지 않아 "(확인 필요)"로 둡니다. 다만 아래는 코드로 근거가 있습니다.
- Tailwind와 Bootstrap이 동시에 쓰이는 점은 초기 CRA+Bootstrap 세팅 위에 이후 Tailwind를 점진 도입한 흔적으로 보입니다. (근거: `src/main.tsx`에서 bootstrap CSS/JS 임포트, 관리자 페이지들은 Tailwind 유틸리티 클래스 사용)
- CRA에서 Vite로 마이그레이션한 이력이 있습니다. (근거: 최초 커밋 `0dbb773`의 메시지가 "Initialize project using Create React App"이며, 현재는 `vite.config.ts`, `tsconfig.json`의 `moduleResolution: bundler` 등 Vite 세팅만 남아 있음. 마이그레이션 커밋 자체는 로그에서 특정하지 못함, 확인 필요)

# 4. 설계

## 아키텍처

- SPA(Single Page Application) 구조이며, 최상위에서 역할(role)에 따라 두 개의 레이아웃으로 분기됩니다. (근거: `src/App.tsx`)
  - `/*` : `UserLayout` (일반 사용자 화면, `Header`/`AdminHeader`를 role에 따라 조건부 렌더링)
  - `/admin/*` : `ProtectedRoute` → `MemberProvider` → `AdminLayout` → 관리자 하위 라우트
- 계층 구성은 다음과 같습니다.
  1. `pages` (라우트 단위 화면, `src/features/*/pages`)
  2. `hooks` (데이터 페칭/비즈니스 로직, `src/hooks`, 일부는 `features/*/store`)
  3. `api/endpoints` (도메인별 API 함수, 예: `AdminItem.ts`, `AdminUser.ts`)
  4. `api/Client.ts` (공통 fetch 래퍼)
  5. `api/dto` (요청/응답 타입 정의)
- 요청 처리 흐름 예시(물품 목록 조회): `AdminItems.tsx`의 `fetchItems()` → `adminItemApi.getItems()`(`src/api/endpoints/AdminItem.ts`) → `apiClient()`(`src/api/Client.ts`, `sessionStorage`의 accessToken을 Authorization 헤더에 주입) → 응답을 `unwrapResponse()`로 언래핑 → 컴포넌트 state(`useState`)에 저장. (근거: 위 파일들의 실제 호출 관계)
- 인증 토큰은 `sessionStorage`에 저장되고, `useAutoRefreshToken` 훅이 5초 간격으로 만료 임박(잔여 30초 미만)을 폴링하여 갱신합니다. (근거: `src/hooks/UseAutoRefreshToken.ts`)
- 라우트 보호는 현재 `App.tsx` 내부에 정의된 로컬 `ProtectedRoute` 컴포넌트가 담당하며, 이 컴포넌트는 `useAuthStore`의 role이 아니라 `useAuth()`라는 하드코딩된 스텁(`isAuthenticated: true, isAdmin: true` 고정 반환)을 사용합니다. `TODO: REPLACE BEFORE PRODUCTION` 주석이 코드에 남아 있습니다. (근거: `src/App.tsx` 33~45번째 줄, `git blame` 결과 본인 커밋 `ee322d88`에서 도입)
- 별도로 존재하는 `src/shared/components/AdminRoute.tsx`(role 기반 실제 가드)와 `src/components/ProtectedRoute.tsx`(전체 주석 처리된 파일)는 현재 어느 라우트에서도 import되지 않는 미사용 코드입니다. (근거: 저장소 전체에서 `AdminRoute` 문자열 검색 결과 정의부 외 참조 없음)

## 데이터 모델

이 저장소는 프론트엔드 전용이므로 DB 스키마는 없고, API 계약을 나타내는 TypeScript DTO/타입으로 데이터 모델을 대신합니다.

- 공통 응답 포맷: `BaseResponseDto<T> = { code, message, data }` (근거: `src/api/dto/BaseResponse.dto.ts`)
- 도메인 타입
  - `UserRoleType = 'NORMAL' | 'ADMIN' | 'SUPERADMIN' | ''`, `UserStatusType = 'ACTIVE' | 'BANNED' | ''` (근거: `src/types/Types.ts`)
  - `AdminItemResponseDto = { itemId, itemName, itemDescription, status: 'ACTIVE'|'INACTIVE', condition: 'RENT'|'KEEP'|'OVERDUE' }` (근거: `src/api/dto/AdminItem.dto.ts`)
  - `AdminUserDetailResponseDto = { userId, userName, studentNum, role, status, phoneNum, penalties: AdminUserPenaltyDto[] }` (근거: `src/api/dto/AdminUser.dto.ts`)
  - `CategoryInfo = { categoryId, categoryName, rentalCount }`, `MonthRentalInfo = { year, month, rentalCount }` (근거: `src/types/Statistics.ts`)
- 응답 스키마가 두 가지 형태로 혼재한 이력이 있습니다. `adminItemApi.getItems()`는 백엔드가 "카테고리별로 그룹핑된 배열"(`{categoryId, categoryName, items: []}[]`)과 "평탄화된 물품 배열"(`AdminItemResponseDto[]`) 중 어느 쪽을 반환하든 처리하도록 방어 로직이 들어가 있습니다. (근거: `src/api/endpoints/AdminItem.ts`의 `unwrapped[0]`에 `'items' in unwrapped[0]` 체크, 6장 트러블슈팅 참조)
- 인덱스 설계는 프론트엔드 저장소 범위 밖이라 확인할 수 없습니다. (확인 필요: 백엔드 저장소 별도 확인)

## API 및 인터페이스

- 엔드포인트 구성: 도메인별 파일(`src/api/endpoints/*.ts`)에 객체 형태로 함수를 묶어 export합니다. 예: `adminItemApi = { getItems, createItem, updateItemStatus, ... }`. (근거: `src/api/endpoints/AdminItem.ts`)
- 공통 요청 함수 `apiClient<T>(url, options, config)`는 `withAuth`, `tokenType`(`access`/`refresh`) 옵션으로 인증 토큰 종류를 선택합니다. (근거: `src/api/Client.ts`)
- 응답 규격은 `{ code, message, data }` 래퍼가 기본이며, `unwrapResponse()` 헬퍼가 래퍼 유무와 무관하게 `data`를 꺼내도록 되어 있습니다. (근거: `src/api/Client.ts`의 `unwrapResponse` 주석: "서버가 wrapper를 사용할 수도 있고 직접 데이터를 반환할 수도 있음")
- 에러 처리는 `response.ok`가 아닐 때 `Error(API request failed: ${status})`를 던지고, 각 화면에서 `try/catch`로 잡아 `alert()`와 `console.error()`로 처리하는 패턴이 반복됩니다. (근거: `src/api/Client.ts`, `AdminItems.tsx`, `AdminPenaltyEdit.tsx` 등 다수)
- 204/빈 바디 응답에 대한 별도 처리가 있습니다(6장 트러블슈팅 참조). (근거: `src/api/Client.ts`)
- 전역 에러 바운더리나 인터셉터 기반 공통 에러 처리는 확인되지 않았습니다. (확인 필요)

## 인프라 및 배포

- 실행 환경: Vite 개발 서버(`vite`), 프로덕션 빌드는 `tsc && vite build`로 타입 체크를 빌드 게이트로 사용합니다. (근거: `package.json`의 `scripts.build`)
- 배포는 Vercel을 사용하며, `vercel.json`의 `rewrites`로 `/proxy/:path*` 요청을 백엔드 서버로 전달하는 리버스 프록시 구성을 갖고 있습니다(대상 주소는 내부 IP라 이 문서에서는 생략). (근거: `vercel.json`)
- 백엔드 API Base URL은 `VITE_API_BASE_URL` 환경변수로 주입됩니다. (근거: `src/api/Client.ts`)
- `.env`, `.env.local`은 `.gitignore`에 등록되어 있고, 저장소 이력상 실제 비밀값이 커밋된 흔적은 없습니다(빈 내용의 `.env`가 한 차례 커밋된 적은 있음). (근거: `.gitignore`, `git log -- .env`로 확인한 커밋 `770efa1`의 파일 내용이 0라인)
- CI 파이프라인(GitHub Actions 등)은 확인되지 않았습니다. `.github/`에는 이슈/PR 템플릿만 존재합니다. (근거: `.github/` 디렉터리 내용)
- Docker, k8s manifest, DB 마이그레이션 파일은 이 저장소에 존재하지 않습니다(프론트엔드 전용 저장소이므로 해당 없음).

## 디렉터리 구조

```
src/
├── api/
│   ├── Client.ts              # 공통 fetch 래퍼, 토큰 주입, 응답 파싱
│   ├── dto/                   # 요청/응답 타입 정의 (도메인별 .dto.ts)
│   └── endpoints/              # 도메인별 API 함수 모음
├── components/
│   └── ProtectedRoute.tsx      # 전체 주석 처리된 미사용 파일
├── features/
│   ├── admin/
│   │   ├── components/         # RoleChangeModal 등 관리자 전용 컴포넌트
│   │   ├── context/             # MemberContext (회원 일괄 갱신 미리보기 상태)
│   │   └── pages/               # AdminItems, AdminMembers, AdminMemberDetail,
│   │                             # AdminPenaltyEdit, AdminRentalEdit, AdminStatistics,
│   │                             # AdminInspect, InspectStatus, InspectHistory 등
│   ├── auth/
│   │   ├── pages/               # Login, ResetPW, SendSmsCode, VerifySmsCode
│   │   └── store/useAuthStore.ts # zustand persist 기반 role 저장소
│   ├── home/                    # 홈 화면, 캐러셀
│   ├── mypage/                  # 마이페이지, 징계 조회
│   ├── rent/                    # 대여 플로우 (카테고리/도우미/물품 선택)
│   └── return/                  # 반납 플로우, 반납/신고 모달
├── hooks/                       # UseAutoRefreshToken 등 커스텀 훅
├── shared/
│   ├── components/               # AdminRoute(미사용), Header, BottomBar, Layout
│   └── styles/                   # 전역 CSS
├── store/userStore.ts           # zustand 기반 사용자 정보/토큰 저장소 (useAuthStore와 별도)
├── types/                       # 공용 타입 (Types, Item, Category, Penalty 등)
└── App.tsx                      # 라우트 정의, 로컬 ProtectedRoute, 레이아웃 분기
```

(근거: `find src -type f` 결과와 각 디렉터리 내 파일 내용을 근거로 역할을 주석으로 정리했습니다.)

# 5. 핵심 구현

## 역할 기반 레이아웃 분기와 관리자 라우트 구성

**무엇을 구현했는가**: 하나의 SPA 안에서 일반 사용자 화면과 관리자 화면을 역할에 따라 분리하고, 관리자 하위 라우트 7개(물품/회원/회원상세/징계/통계/대여수정/검수)를 구성했습니다. (근거: `src/App.tsx`)

**어떻게 구현했는가**:
1. `App` 컴포넌트가 최상단에서 `/*`(UserLayout)와 `/admin`(AdminLayout) 두 갈래로 라우트를 나눕니다.
2. `/admin` 진입 시 `ProtectedRoute`(관리자 권한 체크) → `MemberProvider`(회원 일괄 갱신용 컨텍스트) → `AdminLayout`(공통 헤더/본문 레이아웃) 순서로 래핑됩니다.
3. `UserLayout` 내부에서는 `useAuthStore`의 role 값을 읽어 `admin`/`super_admin`이면 `AdminHeader`, 아니면 일반 `Header`를 렌더링해 같은 레이아웃 안에서도 헤더만 다르게 보여줍니다.
4. 하위 라우트는 `users/:id`, `users/:id/penalty`, `users/:id/rental-edit`처럼 회원 ID를 경로 파라미터로 전달하는 방식으로 구성했습니다.

**선택지와 판단**: 관리자 전용 레이아웃을 별도 라우트 트리(`/admin`)로 분리한 것과, 일반 라우트 안에서 헤더만 조건부 렌더링하는 것을 혼합한 이유는 코드만으로는 명확하지 않습니다. (확인 필요: 왜 관리자 레이아웃을 완전히 분리하지 않고 UserLayout에도 AdminHeader 분기를 남겼는지)

**코드 발췌** (`src/App.tsx`):
```tsx
const UserLayout: React.FC = () => {
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'admin' || role === 'super_admin';

  return (
    <div className="flex min-h-screen flex-col">
      {isAdmin ? <AdminHeader /> : <Header />}
      <main className="main-content mx-auto w-full max-w-[1200px] flex-1 px-4">
        <Routes>
          <Route index element={<Home />} />
          {/* ... */}
        </Routes>
      </main>
      <BottomBar />
    </div>
  );
};
```

## JWT 만료 폴링 기반 자동 토큰 갱신

**무엇을 구현했는가**: accessToken의 남은 유효 시간을 클라이언트에서 직접 계산해, 만료 임박 시 자동으로 refreshToken을 이용한 재발급을 수행하는 훅을 구현했습니다. (근거: `src/hooks/UseAutoRefreshToken.ts`)

**어떻게 구현했는가**:
1. `parseJwt()`가 JWT의 payload 부분을 base64 디코딩해 `exp`(만료 시각, epoch seconds)를 꺼냅니다.
2. `getTokenRemainingTime()`이 `exp - 현재시각`으로 잔여 초를 계산합니다.
3. `useEffect` 안에서 5초 간격 `setInterval`을 걸어 잔여 시간이 30초 미만이면 `getRefreshToken.refreshToken()`(`src/api/endpoints/RefreshToken.ts`)을 호출해 새 토큰을 받고, `sessionStorage`와 zustand 스토어(`useUserInfo`)를 함께 갱신합니다.
4. `accessToken`이 바뀔 때마다 `useEffect`의 의존성 배열에 따라 인터벌이 재설정됩니다.

**선택지와 판단**: 서버 응답 401을 가로채 재시도하는 인터셉터 방식 대신 클라이언트에서 만료 시각을 미리 계산해 선제적으로 갱신하는 방식을 택했습니다. 다만 `apiClient()`(`src/api/Client.ts`)에는 401 인터셉트/재시도 로직이 없어, 폴링 주기(5초) 사이에 토큰이 만료되면 요청이 그대로 실패할 수 있는 구조입니다. 이 트레이드오프가 의도된 설계인지는 코드만으로 확정할 수 없습니다. (확인 필요)

**코드 발췌** (`src/hooks/UseAutoRefreshToken.ts`):
```ts
export const useAutoRefreshToken = () => {
  const accessToken = useUserInfo((state) => state.accessToken);
  const setTokens = useUserInfo((state) => state.setTokens);
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(async () => {
      const remaining = getTokenRemainingTime(accessToken);
      if (remaining < 30) {
        try {
          const newToken = await getRefreshToken.refreshToken();
          sessionStorage.setItem('accessToken', newToken.accessToken);
          setTokens(newToken.accessToken, newToken.refreshToken);
        } catch (err) {
          console.error('토큰 갱신 실패', err);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [accessToken]);
};
```

## 백엔드 응답 스키마 변경에 대한 방어적 파싱

**무엇을 구현했는가**: 물품 목록 API가 응답 형태를 바꾸더라도(카테고리 그룹 배열 ↔ 평탄화 배열) 프론트가 깨지지 않도록 런타임에 형태를 판별해 처리하는 로직을 구현했습니다. (근거: `src/api/endpoints/AdminItem.ts`)

**어떻게 구현했는가**:
1. `unwrapResponse()`로 공통 응답 래퍼(`{code, message, data}`)를 벗겨냅니다.
2. 결과가 배열이 아니면 빈 배열을 반환해 화면이 에러 없이 "물품이 없습니다"로 빠지게 합니다.
3. 배열의 첫 번째 요소에 `items` 프로퍼티가 있으면 카테고리 그룹 구조로 판단해 `flatMap`으로 평탄화합니다.
4. 그렇지 않으면 이미 평탄화된 배열로 간주해 그대로 반환합니다.
5. 화면단(`AdminItems.tsx`)에서도 `normalizeItem()`으로 `itemId`/`id`, `itemName`/`name` 등 필드명이 다를 수 있는 상황을 한 번 더 방어합니다.

**선택지와 판단**: 백엔드 계약을 고정하고 타입 에러로 실패시키는 대신, 프론트에서 두 형태를 모두 수용하는 방어 코드를 선택했습니다. 백엔드 API가 실제로 두 버전이 혼재했는지, 혹은 프론트 개발 중 임시로 겪은 문제였는지는 커밋 메시지("관리자 물품 조회 에러 수정")로 미루어 실제 배포 환경에서 발생한 문제로 보이나, 백엔드 쪽 근거는 이 저장소 범위 밖이라 단정할 수 없습니다. (확인 필요: 백엔드 응답 스키마 변경 이력)

**코드 발췌** (`src/api/endpoints/AdminItem.ts`):
```ts
interface CategoryGroupResponse {
  categoryId: number;
  categoryName: string;
  items: AdminItemResponseDto[];
}

getItems: async (categoryId?: number): Promise<AdminItemResponseDto[]> => {
  const url = categoryId
    ? `/v1/admin/items?categoryId=${categoryId}`
    : '/v1/admin/items';
  const res = await apiClient<unknown>(url);
  const unwrapped = unwrapResponse<
    CategoryGroupResponse[] | AdminItemResponseDto[]
  >(res);
  if (!Array.isArray(unwrapped)) return [];

  if (unwrapped.length > 0 && 'items' in unwrapped[0]) {
    return (unwrapped as CategoryGroupResponse[]).flatMap(
      (group) => group.items ?? [],
    );
  }
  return unwrapped as AdminItemResponseDto[];
},
```

## ExcelJS 기반 리치 텍스트 엑셀 내보내기

**무엇을 구현했는가**: 물품 검수 현황 화면에서, 같은 물품명으로 그룹핑된 개별 재고(라벨 번호)의 상태를 색상이 입혀진 리치 텍스트로 엑셀에 내보내는 기능을 구현했습니다. (근거: `src/features/admin/pages/InspectStatus.tsx`)

**어떻게 구현했는가**:
1. `adminItemApi.getItems()`로 받은 물품 목록을 `mapConditionToStatus()`로 4가지 상태(`rented`/`returned`/`overdue`/`disabled`)로 정규화합니다.
2. `React.useMemo`로 물품명 기준 그룹핑(`groupedItems`)을 만듭니다.
3. `handleExcelDownload()`에서 `ExcelJS.Workbook`을 생성하고, 각 그룹의 개별 유닛을 상태별 색상(`argb`)이 적용된 `richText` 배열로 구성해 한 셀에 여러 색상의 텍스트를 넣습니다.
4. `workbook.xlsx.writeBuffer()`로 만든 버퍼를 `file-saver`의 `saveAs()`로 `SSURENT_물품현황_YYYY-MM-DD.xlsx` 파일명으로 다운로드합니다.

**선택지와 판단**: 단순 텍스트 대신 셀 내부에 색상이 다른 리치 텍스트를 넣기 위해 `xlsx`(파싱 전용) 대신 스타일링을 지원하는 `exceljs`를 내보내기 용도로 선택한 것으로 보입니다. 다만 두 라이브러리를 함께 의존성에 두고 있는 이유(파싱은 `xlsx`, 생성은 `exceljs`로 역할을 나눈 것인지)는 `AdminMemberUpload.tsx`의 파일 파싱 로직까지 확인해야 명확해집니다. (확인 필요)

**코드 발췌** (`src/features/admin/pages/InspectStatus.tsx`, 비밀값 없음):
```tsx
const handleExcelDownload = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('물품현황');
  worksheet.columns = [
    { header: '식별번호', key: 'no', width: 10 },
    { header: '대여물품명', key: 'name', width: 35 },
    { header: '라벨 및 상태 (상세)', key: 'details', width: 60 },
  ];
  groupedItems.forEach((item) => {
    const richText = item.units.map((u, i) => {
      const isLast = i === item.units.length - 1;
      let color = 'FF000000';
      let statusStr = '불가';
      if (u.status === 'returned') { color = 'FF22C55E'; statusStr = '완료'; }
      else if (u.status === 'rented') { color = 'FF94A3B8'; statusStr = '대여중'; }
      else if (u.status === 'overdue') { color = 'FFDC2626'; statusStr = '연체'; }
      return {
        text: `${u.id}(${statusStr})${isLast ? '' : ', '}`,
        font: { color: { argb: color }, bold: true },
      };
    });
    const row = worksheet.addRow({ no: item.no, name: item.name });
    row.getCell('details').value = { richText };
  });
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `SSURENT_물품현황_${new Date().toISOString().split('T')[0]}.xlsx`);
};
```

## 중복 클릭/중복 제출 방지가 적용된 관리 CRUD 패턴

**무엇을 구현했는가**: 물품 추가, 카테고리 추가/삭제, 상태 토글 등 관리자 CRUD 동작에 `isSubmitting` 플래그를 두어 버튼 중복 클릭으로 인한 중복 요청을 막았습니다. (근거: `src/features/admin/pages/AdminItems.tsx`)

**어떻게 구현했는가**:
1. 각 CRUD 핸들러(`handleAddItem`, `handleAddCategory`, `handleDeleteCategory`, `handleToggleItemStatus`) 진입 시 `if (isSubmitting) return;`으로 재진입을 막습니다.
2. `setIsSubmitting(true)` → API 호출 → `finally`에서 `setIsSubmitting(false)`로 항상 플래그를 되돌립니다.
3. 모달의 제출 버튼에 `disabled={isSubmitting}`을 걸고, 로딩 중 텍스트("추가 중...", "등록 중...")로 사용자에게 진행 상태를 알립니다.

**선택지와 판단**: react-query의 `mutation.isPending` 같은 내장 상태 대신 컴포넌트 로컬 `useState`로 직접 구현했습니다. react-query가 의존성에 설치되어 있고 Provider도 루트에 연결돼 있으나(`src/main.tsx`) 실제 데이터 페칭/뮤테이션에는 쓰이지 않고 있어, 왜 이 조합을 선택했는지는 코드만으로 알 수 없습니다. (확인 필요, 8장 회고 참조)

**코드 발췌** (`src/features/admin/pages/AdminItems.tsx`):
```tsx
const handleAddItem = async () => {
  if (!newItemCategory || !newItemCode || isSubmitting) return;
  setIsSubmitting(true);
  try {
    await adminItemApi.createItem({
      categoryName: newItemCategory,
      itemNum: newItemCode,
    });
    setNewItemCategory('');
    setNewItemCode('');
    setItemModalOpen(false);
    await fetchItems(selectedCategoryId ?? undefined);
  } catch (err) {
    console.error('물품 추가 실패', err);
    alert('물품 추가에 실패했습니다.');
  } finally {
    setIsSubmitting(false);
  }
};
```

# 6. 트러블 슈팅

## Windows와 Vercel(Linux) 간 파일명 대소문자 불일치로 인한 배포 전용 import 오류

**문제 상황**: 로컬(Windows) 개발 환경에서는 정상 동작하지만 Vercel 배포 환경에서만 통계 페이지(`AdminStatistics.tsx`) 관련 import가 깨지는 문제가 있었습니다. 커밋 메시지 자체가 "import 불일치 해결", "배포 해결"로 명시되어 있습니다. (근거: 커밋 `d7fd90b`, `f708ebd9`)

**원인 분석**: 팀원이 `Feat: 통계 Hook 분리 (#44)`(커밋 `68ebfb6`)에서 `src/hooks/useGetStatistics.ts`(소문자 u)를 생성했고, 이후 본인이 같은 훅을 대문자 파일명(`UseGetStatistics.ts`)으로 다시 만들면서 두 파일이 저장소에 공존하게 되었습니다. Windows는 파일시스템이 대소문자를 구분하지 않아 로컬에서는 어느 쪽이든 import가 해석되지만, Vercel의 Linux 빌드 환경은 대소문자를 구분하므로 실제 커밋된 파일명과 import 경로의 대소문자가 다르면 빌드가 실패합니다. `AdminStatistics.tsx`의 import 문이 `'../../../hooks/useGetStatistics'`(소문자)에서 `'../../../hooks/UseGetStatistics'`(대문자)로 바뀐 것이 diff로 확인됩니다. (근거: `git show d7fd90b -- src/features/admin/pages/AdminStatistics.tsx`)

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| import 경로를 실제 파일명(대문자)에 맞게 수정 | 즉시 해결, 코드 변경 최소 | 파일명 중복 문제 자체는 남음 | 채택 (`d7fd90b`) |
| 중복 파일(소문자본) 삭제 | 근본 원인 제거 | 다른 곳에서 소문자 경로를 참조 중이면 추가 수정 필요 | 채택 (`f708ebd9`에서 `useGetStatistics.ts` 66줄 전체 삭제) |
| 대소문자 구분 린트 규칙 도입(예: `eslint-plugin-import`의 case sensitivity 체크) | 재발 방지 | 레포에 도입 흔적 없음 | 미채택 (확인 필요) |

**해결 과정**: import 경로를 실제 파일명 대소문자에 맞춰 수정한 뒤(`d7fd90b`), 곧바로 후속 커밋에서 중복된 소문자 파일 자체를 삭제해(`f708ebd9`) 재발 소지를 없앴습니다.

**코드 발췌**:
- 변경 전 (`src/features/admin/pages/AdminStatistics.tsx`, 커밋 `d7fd90b` 이전):
```tsx
import { useGetStatics } from '../../../hooks/useGetStatistics';
```
- 변경 후:
```tsx
import { useGetStatics } from '../../../hooks/UseGetStatistics';
```
- 후속 조치 (`f708ebd9`): `src/hooks/useGetStatistics.ts` 파일 삭제(66줄 전체 삭제, diff 없음).

**결과**: 배포 환경에서의 import 해석 실패가 해결되었고, 이후 커밋 이력에서 동일 원인의 재발은 확인되지 않습니다. 정량적인 빌드 실패/성공 횟수나 Vercel 빌드 로그는 레포에 남아있지 않습니다. (수치 확인 필요: 실제 Vercel 빌드 로그)

**근거**: 커밋 `d7fd90b987e3be2a2e7f2ccd7bdcb3da2067c3e3`(fix : import 불일치 해결 (#44)), `f708ebd91936c1a643b08117a94917c93e1c3285`(fix : 배포 해결 (#44)), 이슈/PR `#44`.

**배운 점**: 이후 작업에서 파일 시스템 대소문자에 대한 별도 규칙 도입 여부는 커밋 이력에서 확인되지 않습니다. (확인 필요)

## fetch 응답 바디가 비어 있을 때 JSON.parse 실패

**문제 상황**: `apiClient()`가 항상 `response.json()`을 호출하도록 되어 있어, 204 No Content나 빈 바디를 반환하는 API(예: 상태 변경, 삭제류 요청)를 호출하면 `Unexpected end of JSON input` 형태의 파싱 오류가 발생할 수 있는 구조였습니다. (근거: 커밋 `206cb69`의 변경 전 코드 `return response.json();`)

**원인 분석**: `fetch`의 `Response.json()`은 바디가 빈 문자열이면 파싱에 실패합니다. 물품 관리 페이지 통합 작업(`206cb69`, "feat: implement admin item management pages and configure API client for service integration") 과정에서 이 문제를 인지하고 `Client.ts`를 수정한 것으로 보입니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| 상태 코드/`content-length`로 빈 응답 선판별 후 `null` 반환 | 별도 라이브러리 불필요, 호출부 수정 없이 공통 레이어에서 해결 | 서버가 `content-length` 헤더를 생략하는 경우 커버 못할 수 있음 | 채택 |
| 응답 텍스트를 먼저 읽고 빈 문자열이면 `null`, 아니면 `JSON.parse` | 헤더 유무와 무관하게 동작 | 코드가 한 단계 더 필요 | 채택(위 방식과 함께 적용) |
| 각 API 호출부에서 개별적으로 try/catch 처리 | 공통 레이어 수정 불필요 | 동일 문제를 매 호출부마다 반복 처리해야 함 | 미채택 |

**해결 과정**: `response.status === 204` 또는 `content-length === '0'`이면 즉시 `null`을 반환하고, 그렇지 않으면 `response.text()`로 먼저 읽어 빈 문자열이면 `null`, 아니면 `JSON.parse(text)`를 수행하도록 변경했습니다.

**코드 발췌** (`src/api/Client.ts`):
- 변경 전:
```ts
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};
```
- 변경 후:
```ts
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return null as unknown as T;
  }

  const text = await response.text();
  if (!text) {
    return null as unknown as T;
  }

  return JSON.parse(text);
};
```

**결과**: 빈 바디 응답을 반환하는 API 호출 시 파싱 예외가 발생하지 않게 되었습니다. 수정 전후의 실패율이나 에러 로그 수치는 레포에 존재하지 않습니다. (수치 확인 필요)

**근거**: 커밋 `206cb69c6baec1fb695cccc81899867a7afc536d`.

## 관리자 물품 목록 API 응답 구조 변경(카테고리 그룹화)으로 인한 조회 오류

**문제 상황**: 관리자 물품 목록 조회에서 오류가 발생했고, 커밋 메시지에 "관리자 물품 조회 에러 수정"으로 명시되어 있습니다. (근거: 커밋 `366be3d`)

**원인 분석**: `adminItemApi.getItems()`가 이전에는 `unwrapResponse<AdminItemResponseDto[]>(res) ?? []`로 응답을 바로 배열로 취급했으나, 실제 응답이 `{categoryId, categoryName, items: [...]}[]` 형태(카테고리별 그룹)로 내려오는 경우가 있어 이 배열을 그대로 화면에 매핑하면 필드가 맞지 않는 문제가 있었던 것으로 diff에서 확인됩니다.

**검토한 대안**:

| 대안 | 장점 | 한계 | 채택 여부 |
| --- | --- | --- | --- |
| 응답이 그룹 구조인지 배열 첫 요소로 판별 후 `flatMap`으로 평탄화 | 백엔드 응답 형태 변화에 프론트가 즉시 대응 가능 | 두 형태가 계속 혼재하면 임시방편에 그침 | 채택 |
| 백엔드에 응답 스키마 고정을 요청 | 근본적 해결 | 저장소 범위 밖이라 확인 불가 | 확인 필요 |

**해결 과정**: `CategoryGroupResponse` 타입을 추가하고, 언래핑된 값의 첫 원소에 `items` 필드가 있으면 그룹 구조로 판단해 `flatMap((group) => group.items ?? [])`으로 평탄화하도록 `AdminItem.ts`를 수정했습니다.

**코드 발췌** (`src/api/endpoints/AdminItem.ts`):
- 변경 전:
```ts
getItems: async (categoryId?: number): Promise<AdminItemResponseDto[]> => {
  const url = categoryId
    ? `/v1/admin/items?categoryId=${categoryId}`
    : '/v1/admin/items';
  const res = await apiClient<unknown>(url);
  return unwrapResponse<AdminItemResponseDto[]>(res) ?? [];
},
```
- 변경 후:
```ts
interface CategoryGroupResponse {
  categoryId: number;
  categoryName: string;
  items: AdminItemResponseDto[];
}

getItems: async (categoryId?: number): Promise<AdminItemResponseDto[]> => {
  const url = categoryId
    ? `/v1/admin/items?categoryId=${categoryId}`
    : '/v1/admin/items';
  const res = await apiClient<unknown>(url);
  const unwrapped = unwrapResponse<
    CategoryGroupResponse[] | AdminItemResponseDto[]
  >(res);
  if (!Array.isArray(unwrapped)) return [];

  if (unwrapped.length > 0 && 'items' in unwrapped[0]) {
    return (unwrapped as CategoryGroupResponse[]).flatMap(
      (group) => group.items ?? [],
    );
  }
  return unwrapped as AdminItemResponseDto[];
},
```

**결과**: 그룹 구조 응답과 평탄화 응답 모두에서 물품 목록이 정상적으로 렌더링되도록 변경되었습니다. 수정 전후의 오류 발생 빈도 수치는 레포에 없습니다. (수치 확인 필요)

**근거**: 커밋 `366be3db8657115d292ab1b7a434086065f680f6`(feat: 관리자 물품 조회 에러 수정 (#56)).

## 확인 필요로 분류하고 트러블슈팅에서 제외한 후보

- 커밋 `bb2712a`, `4827900`, `10396e0`("fix : vercel 에러 수정") — `package-lock.json`과 `pnpm-lock.yaml` 두 개의 락파일이 저장소에 공존한 상태에서 반복적으로 락파일만 수정하는 커밋 패턴이 확인됩니다. 두 락파일 공존이 Vercel의 패키지 매니저 자동 감지에 영향을 줄 가능성은 일반적으로 알려져 있으나, 이 저장소에는 실제 Vercel 빌드 에러 로그가 남아있지 않아 "무엇이 실패했는지"를 코드만으로 특정할 수 없어 트러블슈팅 항목에서 제외했습니다. (확인 필요: 당시 Vercel 빌드 실패 로그, 두 패키지 매니저 중 실제 배포에 쓰인 쪽)
- 커밋 `4afaba0`("feat : admin role 로직 수정") — 제목은 "role 로직 수정"이지만 실제 diff는 회원 관리 화면의 UI 재구성(컴포넌트 분리, CSS 리팩터링)이 대부분이라 role 판별 로직 자체의 버그 수정으로 보기 어려워 트러블슈팅이 아닌 일반 기능 변경으로 분류했습니다.
- `AdminRoute.tsx`가 `role !== 'admin'`만 검사해 `super_admin` 역할을 배제하는 것처럼 보이는 코드가 있으나, 이 컴포넌트 자체가 현재 어디서도 import되지 않는 미사용 코드라 실제 동작에 영향을 주지 않아 트러블슈팅이 아닌 8장 회고/10장 확인 필요 항목으로 이동했습니다.

# 7. 결과

- 본인 커밋 수: 36건(머지 커밋 제외), 저장소 전체 커밋 수: 344건. (근거: `git log --all --oneline | wc -l`, `git log --author`)
- 본인이 관여한 소스 파일: `src/features/admin/` 하위 페이지 15개 전량, `src/api/endpoints/`의 관리자 API 3종(AdminItem, AdminUser 일부), `src/api/Client.ts`. (근거: 2장 표)
- 코드 규모: `src` 전체 TypeScript/TSX 약 6,786줄, 파일 120개. (근거: `find src -name "*.ts" -o -name "*.tsx" | xargs wc -l`)
- 테스트: 자동화된 테스트 코드 없음(`*.test.*` 파일 0개). (근거: `find src -iname "*.test.*"` 결과 없음)
- 배포: Vercel에 배포되는 구성이 `vercel.json`/`.vercel/`로 확인되나, 실제 프로덕션 URL 공개 여부와 현재 배포 상태는 이 문서에서 확인하지 않았습니다. (확인 필요)
- 수상 이력은 레포에서 확인되지 않습니다. (확인 필요)

# 8. 회고

- 인증 상태가 `useAuthStore`(role만 저장, sessionStorage에 persist)와 `useUserInfo`(사용자 정보+토큰, 수동 sessionStorage 연동) 두 개로 분리되어 있어 동일한 개념(로그인 상태)이 두 저장소에 걸쳐 있습니다. 다시 만든다면 하나의 스토어로 통합했을 것 같습니다. (근거: `src/features/auth/store/useAuthStore.ts`, `src/store/userStore.ts`)
- `App.tsx`의 라우트 가드가 실제로는 `useAuth()`라는 하드코딩 스텁(`isAuthenticated: true, isAdmin: true` 고정)에 의존하고 있고, `TODO: REPLACE BEFORE PRODUCTION` 주석이 코드에 남아 있습니다. role 기반 실제 가드 컴포넌트(`AdminRoute.tsx`)를 만들어 두고도 실제로는 연결하지 않은 상태로 남긴 점은 아쉬운 부분입니다. (근거: `src/App.tsx` 33~45번째 줄)
- react-query를 의존성에 추가하고 Provider까지 루트에 연결했지만(`src/main.tsx`), 실제 데이터 페칭은 전부 `useState` + `useEffect` + 수동 `try/catch` 패턴으로 작성되어 있어 캐싱/재요청/로딩 상태 관리의 이점을 활용하지 못했습니다. 다시 구현한다면 관리자 페이지의 반복되는 fetch-loading-error 패턴을 react-query의 `useQuery`/`useMutation`으로 통일했을 것입니다.
- 백엔드 응답 스키마(카테고리 그룹 vs 평탄화 배열, 필드명 유연 처리 등)를 프론트에서 방어적으로 흡수하는 코드가 여러 곳에 반복되어 있습니다(`unwrapResponse`, `normalizeItem`, `CategoryGroupResponse` 판별 등). API 계약을 더 일찍 문서화하고 고정했다면 이런 방어 코드가 줄었을 것으로 보입니다.
- 파일명 대소문자 문제(6장)를 겪은 이후에도 `Adminrentaledit.tsx` → `AdminRentalEdit.tsx`처럼 파일명 표기가 흔들린 이력이 있어, 재발 방지를 위한 팀 차원의 네이밍 컨벤션이나 린트 규칙이 있었다면 더 좋았을 것 같습니다. (근거: `git log --follow` 결과 두 파일명이 시기별로 혼용됨)

# 9. 스크린샷 및 문서 제안

레포에 이미지/문서 파일은 다음이 존재합니다.
- `src/shared/assets/images/ssulogo.jpg`, `public/ssulogo.jpg` : 서비스 로고. 3분 요약/개요 섹션 상단에 사용 제안.
- `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*.md` : 협업 프로세스를 보여주는 문서. 2장 "협업 방식" 섹션에 캡처 또는 발췌 인용 제안.

추가로 촬영하면 좋은 화면(레포에는 없으므로 직접 캡처 필요, 파일명은 제안):
| 파일명 제안 | 촬영할 화면 | 들어갈 섹션 |
| --- | --- | --- |
| `admin-items.png` | `/admin/items` 물품 관리 카드 그리드, 물품 추가 모달 | 5장 핵심 구현 - CRUD 패턴 |
| `admin-statistics.png` | `/admin/stats` 바차트+라인차트 화면 | 5장 핵심 구현, 3장 기술 스택 |
| `admin-inspect-status.png` | `/admin/inspect` 물품 현황 색상 뱃지 + 엑셀 다운로드 버튼 | 5장 핵심 구현 - 엑셀 내보내기 |
| `admin-member-detail.png` | `/admin/users/:id` 회원 상세 + 징계내역 | 4장 설계 - API/데이터 모델 |
| `exported-excel.png` | `엑셀 다운로드` 클릭 후 생성된 xlsx 파일(리치 텍스트 색상 확인) | 5장 핵심 구현 |
| `route-diagram.png` | `App.tsx` 라우트 트리를 도식화한 다이어그램(직접 제작 필요) | 4장 설계 - 아키텍처 |

# 10. 확인 필요 항목

## 본인이 직접 채워야 하는 정보
- 실제 배포 주소(공개 가능 여부 포함)
- 팀 내 본인의 역할 경계(코드 리뷰 참여 여부, 명세 논의 방식, 이슈 분배 방식)
- 기술 선택 이유: Tailwind+Bootstrap 병행 이유, exceljs와 xlsx를 함께 쓴 이유, react-query 도입 배경과 실제 미사용 이유
- 수치: 실제 이용자 수, 대여/반납 처리 건수, 페이지 로딩/응답 시간 등 운영 지표(측정 방법 포함해서 채워야 함)
- CRA → Vite 마이그레이션을 누가, 언제, 어떤 이유로 진행했는지(커밋 로그에서 특정 커밋을 찾지 못함)

## 근거 부족으로 트러블슈팅에서 제외한 항목과 이유
- 중복 락파일(`package-lock.json`/`pnpm-lock.yaml`)로 인한 반복적인 "vercel 에러 수정" 커밋: 실제 빌드 실패 로그가 레포에 없어 원인을 코드만으로 단정할 수 없음
- "admin role 로직 수정" 커밋: 실제 diff가 UI 리팩터링 위주라 role 판별 버그로 보기 어려움
- `AdminRoute.tsx`의 `super_admin` 배제 가능성: 컴포넌트 자체가 미사용 코드라 실제 영향 없음

# 11. 면접 예상 질문

**Q1. `App.tsx`의 `ProtectedRoute`가 `useAuth()` 스텁을 쓰고 있고 항상 `true`를 반환하던데, 실제 배포 시에는 어떻게 처리했나요?**
- 확인 필요: 프로덕션 배포 시점에 이 스텁이 실제 인증 로직으로 교체되었는지, 아니면 관리자 라우트가 사실상 누구나 접근 가능한 상태로 배포되었는지 답변 준비가 필요합니다. (근거: `src/App.tsx`의 `TODO: REPLACE BEFORE PRODUCTION` 주석이 현재 HEAD에도 남아 있음)

**Q2. `useAuthStore`와 `useUserInfo` 두 스토어를 분리한 이유는 무엇인가요?**
- 코드상으로는 `useAuthStore`가 role만, `useUserInfo`가 사용자 정보+토큰을 담당하는 것으로 보이나, 왜 하나로 합치지 않았는지에 대한 설계 의도를 본인 언어로 설명할 수 있어야 합니다.

**Q3. Windows/Vercel 대소문자 이슈를 겪은 뒤 재발 방지를 위해 팀에 어떤 규칙을 제안했나요?**
- 커밋 이력상 후속 린트 규칙 도입 흔적이 없어(확인 필요), 실제로 어떤 조치를 취했는지(팀 공유, 컨벤션 문서화 등) 개인적으로 기억을 정리해 둘 필요가 있습니다.

**Q4. 물품 API 응답이 "카테고리 그룹 구조"와 "평탄화 배열" 두 가지로 왔던 근본 원인은 무엇이었나요?**
- 백엔드 쪽 변경 이력은 이 저장소 범위 밖이라 확인하지 못했습니다. 백엔드 담당자와의 소통 내용, API 버전 관리 방식에 대한 설명을 준비해야 합니다.

**Q5. react-query를 설치하고 Provider까지 연결했는데 실제로는 왜 사용하지 않았나요?**
- 코드만으로는 의도를 알 수 없는 부분이라, 도입 배경(팀 컨벤션, 도입 예정이었는지, 특정 화면에서 시도했다가 롤백했는지)을 직접 설명할 수 있어야 합니다.
