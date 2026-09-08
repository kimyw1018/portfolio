/**
 * ==============================================================================
 * 포트폴리오 렌더링 & 인터랙션 로직 (app.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProfile();
  renderEducation();
  renderSkills();
  renderAwards();
  renderProjects('all');
  renderExperiences();
  initEventListeners();
  initLucide();
});

// Lucide 아이콘 초기화 헬퍼
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * 1. 테마(다크/라이트 모드) 초기화 및 토글
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (savedTheme === 'dark' || prefersDark) {
    document.documentElement.classList.add('dark');
  }

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    initLucide();
  });
}

/**
 * 2. 프로필 및 히어로 섹션 렌더링
 */
function renderProfile() {
  const p = PORTFOLIO_DATA.profile;
  if (!p) return;

  const nameEl = document.getElementById('hero-name');
  const navBrandEl = document.getElementById('nav-brand-name');
  const roleEl = document.getElementById('hero-role-badge');
  const affilEl = document.getElementById('hero-affiliation');
  const statusEl = document.getElementById('hero-status');
  const taglineEl = document.getElementById('hero-tagline');
  const emailTextEl = document.getElementById('email-text');
  const phoneEl = document.getElementById('hero-phone');
  const avatarEl = document.getElementById('hero-avatar');
  const navGithubLink = document.getElementById('nav-github-link');
  const heroGithubBtn = document.getElementById('hero-github-btn');

  if (nameEl) nameEl.textContent = p.name;
  if (navBrandEl) navBrandEl.textContent = `${p.name}.dev`;
  if (roleEl) roleEl.textContent = p.role;
  if (affilEl) affilEl.textContent = p.affiliation;
  if (statusEl) statusEl.textContent = p.statusBadge;
  if (taglineEl) taglineEl.textContent = p.tagline;
  if (emailTextEl) emailTextEl.textContent = p.email;
  if (phoneEl && p.phone) phoneEl.textContent = p.phone;
  if (avatarEl && p.avatar) avatarEl.src = p.avatar;
  if (navGithubLink && p.github) navGithubLink.href = p.github;
  if (heroGithubBtn && p.github) heroGithubBtn.href = p.github;

  const bioContainer = document.getElementById('hero-bio-container');
  if (bioContainer && Array.isArray(p.bio)) {
    bioContainer.innerHTML = p.bio
      .map(paragraph => `<p class="leading-relaxed">${paragraph}</p>`)
      .join('');
  }
}

/**
 * 3. 학력 섹션 렌더링
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container || !PORTFOLIO_DATA.education) return;

  container.innerHTML = PORTFOLIO_DATA.education.map(edu => `
    <div class="glass-card p-6 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">${edu.institution}</h3>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          ${edu.period}
        </span>
      </div>
      <p class="text-sm font-medium text-brand-600 dark:text-brand-400 mb-2">${edu.major}</p>
      ${edu.description ? `<p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${edu.description}</p>` : ''}
    </div>
  `).join('');
}

/**
 * 4. 기술 스택 섹션 렌더링
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !PORTFOLIO_DATA.skills) return;

  const categories = Object.keys(PORTFOLIO_DATA.skills);

  container.innerHTML = categories.map(category => {
    const skillsList = PORTFOLIO_DATA.skills[category];
    return `
      <div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <span class="w-1.5 h-4 bg-brand-500 rounded-full"></span>
          ${category}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          ${skillsList.map(skill => `
            <div class="glass-card flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div class="text-2xl flex items-center justify-center w-8 h-8">
                ${skill.icon ? `<i class="${skill.icon}"></i>` : `<i data-lucide="check" class="w-5 h-5 text-brand-500"></i>`}
              </div>
              <div class="overflow-hidden">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">${skill.name}</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${skill.level}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 5. 수상 내역 (Awards & Honors) 렌더링
 */
function renderAwards() {
  const container = document.getElementById('awards-container');
  if (!container || !PORTFOLIO_DATA.awards) return;

  container.innerHTML = PORTFOLIO_DATA.awards.map(award => `
    <div class="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            ${award.badge}
          </span>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
            ${award.date}
          </span>
        </div>

        <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">
          ${award.title}
        </h3>
        <p class="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2">
          프로젝트: ${award.project}
        </p>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ${award.description}
        </p>
      </div>
      <div class="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
        주최: ${award.organization}
      </div>
    </div>
  `).join('');
}

/**
 * 6. 프로젝트 섹션 렌더링 (각 프로젝트별 전용 상세 페이지 링크 탑재)
 */
function renderProjects(filterCategory = 'all') {
  const container = document.getElementById('projects-grid');
  if (!container || !PORTFOLIO_DATA.projects) return;

  const projects = PORTFOLIO_DATA.projects.filter(project => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'backend') {
      return project.category.toLowerCase().includes('backend');
    }
    if (filterCategory === 'frontend') {
      return project.category.toLowerCase().includes('frontend') || project.category.toLowerCase().includes('web');
    }
    return project.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
        해당 카테고리의 프로젝트가 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(proj => `
    <div class="glass-card flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-brand-500/50 dark:hover:border-brand-500/50 group">
      <div>
        <!-- 상단 뱃지 영역 -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              ${proj.categoryName || proj.category}
            </span>
            ${proj.award ? `
              <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ${proj.award}
              </span>
            ` : ''}
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
            ${proj.period}
          </span>
        </div>

        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">
          <a href="${proj.detailPage}">
            ${proj.title}
          </a>
        </h3>
        <p class="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">
          ${proj.subtitle}
        </p>

        <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          ${proj.summary}
        </p>

        <!-- 태그 리스트 -->
        <div class="flex flex-wrap gap-1.5 mb-6">
          ${proj.tags.slice(0, 5).map(tag => `
            <span class="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              ${tag}
            </span>
          `).join('')}
          ${proj.tags.length > 5 ? `<span class="px-1.5 py-0.5 rounded text-[11px] text-slate-400">+${proj.tags.length - 5}</span>` : ''}
        </div>
      </div>

      <!-- 카드 하단: 상세 페이지 이동 버튼 & 링크 -->
      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <a href="${proj.detailPage}" class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 group-hover:translate-x-0.5 transition-transform">
          <span>상세 분석 보기 (Deep Dive)</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>

        <div class="flex items-center gap-2">
          ${(proj.links || []).filter(l => l.url.startsWith('http')).map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.label}" class="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i data-lucide="github" class="w-4 h-4"></i>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  initLucide();
}

/**
 * 7. 활동 이력 (타임라인) 렌더링
 */
function renderExperiences() {
  const container = document.getElementById('experience-timeline');
  if (!container || !PORTFOLIO_DATA.experiences) return;

  container.innerHTML = PORTFOLIO_DATA.experiences.map(exp => `
    <div class="relative pl-6 md:pl-8 group">
      <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-brand-500 group-hover:scale-125 transition-transform shadow-sm"></div>

      <div class="glass-card p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">${exp.title}</h3>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-fit">
            ${exp.period}
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs font-medium text-brand-600 dark:text-brand-400 mb-2">
          <span>${exp.organization || ''}</span>
          ${exp.role ? `<span>•</span><span>${exp.role}</span>` : ''}
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          ${exp.description}
        </p>
      </div>
    </div>
  `).join('');
}

/**
 * 8. 이벤트 리스너 등록
 */
function initEventListeners() {
  // 프로젝트 카테고리 필터 버튼 이벤트
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
        b.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });

  // 이메일 복사 기능
  const copyBtn = document.getElementById('copy-email-btn');
  copyBtn?.addEventListener('click', () => {
    const email = PORTFOLIO_DATA.profile.email;
    navigator.clipboard.writeText(email).then(() => {
      showToast(`이메일 주소(${email})가 복사되었습니다!`);
    }).catch(() => {
      showToast('이메일 복사에 실패했습니다.');
    });
  });

  // 모바일 메뉴 토글
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });
}

/**
 * 9. 토스트 알림 표시
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}
