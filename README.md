# 🌿 김예원 (Kim Yewon) 개발자 포트폴리오

> 숭실대학교 컴퓨터학부 24학번 | Backend & Fullstack Developer

별도의 복잡한 Node.js 빌드나 패키지 설치 없이, 브라우저와 GitHub Pages에서 바로 동작하는 **Zero-Build 경량 포트폴리오**입니다.

---

## 🚀 GitHub Pages 배포 방법 (1분 소요)

1. 이 레포지토리에 변경 사항을 커밋하고 `main` 브랜치에 푸시합니다.
   ```bash
   git add .
   git commit -m "feat: 포트폴리오 웹사이트 구축"
   git push origin main
   ```
2. GitHub 저장소 상단의 **`Settings`** 탭을 클릭합니다.
3. 좌측 메뉴에서 **`Pages`** 메뉴로 이동합니다.
4. **Build and deployment > Source** 항목을 **`Deploy from a branch`**로 설정합니다.
5. **Branch**를 `main` / `/ (root)`로 선택하고 **`Save`**를 누릅니다.
6. 1~2분 후 `https://kimyw1018.github.io/portfolio/` 주소로 포트폴리오 웹사이트가 자동 배포됩니다! 🎉

---

## 🛠️ 유지보수 & 내용 수정 방법 (핵심)

"관리하기 귀찮아서" 만든 포트폴리오인 만큼, **`data.js` 파일 하나만 수정**하면 화면의 모든 내용이 자동으로 바뀝니다. 복잡한 HTML/CSS를 건드릴 필요가 없습니다!

```javascript
// data.js 파일의 내용 예시
const PORTFOLIO_DATA = {
  profile: { ... },      // 자기소개, 이메일, 깃허브 링크
  education: [ ... ],    // 학력 정보
  skills: { ... },       // 기술 스택 (Java, Spring, React, DB 등)
  projects: [ ... ],     // 프로젝트 추가/수정 (A:SSU, 뮤즈리뷰, 또랑 등)
  experiences: [ ... ]   // 학생회, UMC, 멘토링 등 활동 이력
};
```

* **새 프로젝트 추가:** `data.js`의 `projects` 배열에 새 객체를 복사해서 넣으면 프로젝트 카드와 상세 모달이 자동 생성됩니다.
* **이메일 / 프로필 수정:** `data.js`의 `profile` 항목만 수정하면 됩니다.

---

## ✨ 주요 특징 & 디자인 시스템
- **🌿 Green TDS (Toss Design System)**: 토스(Toss) 특유의 극도로 직관적이고 미니멀한 UI 철학을 계승 (24px 둥근 화이트 카드 레이어, `#F2F4F6` 배경, `#00B050` 시그니처 그린 액션 버튼 & 칩)
- **Zero-Build Architecture**: CDN 기반 Tailwind CSS + Devicon + Lucide Icon 적용으로 빌드 오류나 패키지 의존성 충돌 없는 경량 구조
- **Toss Segmented Control & 상세 페이지**: 백엔드 / 프론트엔드 카테고리 필터 및 4개 핵심 프로젝트별 전용 기술 상세 페이지 제공
- **원클릭 이메일 복사 & 플로팅 토스트**: 토스 스타일 플로팅 토스트 피드백 및 모바일 전용 Sticky 액션 바 제공
- **반응형 디자인 & 테마 전환**: 모바일, 태블릿, 데스크톱 전 기기 최적화 및 프리미엄 다크/라이트 모드 지원

