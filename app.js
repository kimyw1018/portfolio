/**
 * ==============================================================================
 * Green TDS (Toss Design System - Seamless & Flat Edition)
 * Application Logic & Dynamic Component Rendering (app.js)
 * ==============================================================================
 */

// Crisp Inline GitHub SVG (zero console errors, perfectly flat)
const GITHUB_SVG = `
<svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
</svg>
`;

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

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * 1. Theme Management (Light mode default for pristine flat aesthetic)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    initLucide();
  });
}

/**
 * 2. Profile Rendering
 */
function renderProfile() {
  const p = PORTFOLIO_DATA?.profile;
  if (!p) return;

  const affilEl = document.getElementById('hero-affiliation');
  const taglineEl = document.getElementById('hero-tagline');
  const avatarEl = document.getElementById('hero-avatar');

  if (affilEl && p.affiliation) affilEl.textContent = `${p.affiliation} • ${p.role}`;
  if (taglineEl && p.tagline) taglineEl.textContent = p.tagline;
  if (avatarEl && p.avatar) avatarEl.src = p.avatar;

  const bioContainer = document.getElementById('hero-bio-container');
  if (bioContainer && Array.isArray(p.bio)) {
    bioContainer.innerHTML = p.bio
      .map(paragraph => `
        <div class="flex items-start gap-2.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[var(--toss-primary)] mt-2 shrink-0"></span>
          <p class="leading-relaxed">${paragraph}</p>
        </div>
      `)
      .join('');
  }
}

/**
 * 3. Education Rendering (간결하고 정돈된 텍스트 형태)
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container || !PORTFOLIO_DATA?.education) return;

  container.innerHTML = `
    <div class="divide-y divide-[var(--toss-border-subtle)]">
      ${PORTFOLIO_DATA.education.map(edu => `
        <div class="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <div class="space-y-0.5 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-base font-bold text-[var(--toss-text-primary)]">${edu.institution}</h3>
              <span class="text-xs font-semibold text-[var(--toss-primary)]">${edu.major}</span>
            </div>
            ${edu.description ? `
              <p class="text-xs sm:text-[13px] text-[var(--toss-text-secondary)] leading-relaxed">
                ${edu.description}
              </p>
            ` : ''}
          </div>
          <span class="text-xs font-mono text-[var(--toss-text-tertiary)] shrink-0 sm:text-right">${edu.period}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 4. Tech Stack Rendering (실제 공식 SVG 로고 + 이름 + 숙련도 명도 텍스트)
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !PORTFOLIO_DATA?.skills) return;

  const categories = Object.keys(PORTFOLIO_DATA.skills);

  container.innerHTML = categories.map(category => {
    const skillsList = PORTFOLIO_DATA.skills[category];
    return `
      <div class="space-y-2">
        <h3 class="text-xs font-bold text-[var(--toss-text-tertiary)] uppercase tracking-wider pb-0.5">
          ${category}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
          ${skillsList.map(skill => `
            <div class="toss-skill-row">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-5 h-5 flex items-center justify-center shrink-0">
                  <img src="${skill.logo}" alt="${skill.name}" class="w-5 h-5 object-contain" loading="lazy" onerror="this.style.display='none'">
                </div>
                <span class="text-sm font-semibold text-[var(--toss-text-primary)] whitespace-normal break-words">${skill.name}</span>
              </div>
              <span class="text-xs font-semibold shrink-0 ${skill.level === 'Advanced' ? 'text-[var(--toss-primary)]' : 'text-[var(--toss-text-tertiary)]'}">
                ${skill.level}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 5. Awards & Honors Rendering (구분 박스 제거, PC 줄바꿈 없이 한 줄, 나머지 내용은 밑에 배치)
 */
function renderAwards() {
  const container = document.getElementById('awards-container');
  if (!container || !PORTFOLIO_DATA?.awards) return;

  container.innerHTML = `
    <div class="overflow-x-auto -mx-2 px-2">
      <div class="min-w-[680px] sm:min-w-0 divide-y divide-[var(--toss-border-subtle)]">
        ${PORTFOLIO_DATA.awards.map(award => `
          <div class="py-3.5 px-2 hover:bg-[var(--toss-surface)] transition-colors rounded-lg space-y-1">
            <!-- Top Line: 일자 | 구분(텍스트만) | 대회명(PC 줄바꿈 없음) | 프로젝트 -->
            <div class="flex items-baseline gap-3.5">
              <span class="font-mono text-xs text-[var(--toss-text-tertiary)] shrink-0 w-20">${award.date}</span>
              <span class="font-bold text-xs text-[var(--toss-primary)] shrink-0 w-16">${award.badge}</span>
              <span class="font-bold text-sm sm:text-[15px] text-[var(--toss-text-primary)] whitespace-nowrap flex-1">${award.title}</span>
              <span class="text-xs font-semibold text-[var(--toss-text-secondary)] shrink-0 whitespace-nowrap">${award.project}</span>
            </div>

            <!-- Bottom Line: 주최 및 주요 내용 (밑에 배치) -->
            <div class="flex items-baseline gap-2 pl-[106px] text-xs text-[var(--toss-text-secondary)] leading-relaxed">
              <span class="text-[var(--toss-text-tertiary)] shrink-0 font-medium">주최: ${award.organization}</span>
              <span class="text-[var(--toss-border)] shrink-0">•</span>
              <span>${award.description}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * 6. Projects Rendering (Featured 4개 + Other 5개, Flat & Seamless)
 */
function renderProjects(filterCategory = 'all') {
  renderFeaturedProjects(filterCategory);
  renderOtherProjects(filterCategory);
  initLucide();
}

/**
 * 6-1. Featured Projects (주요 프로젝트 4개 - 플랫 카드, 차분하고 담백한 링크)
 */
function renderFeaturedProjects(filterCategory) {
  const container = document.getElementById('projects-grid');
  const section = document.getElementById('featured-projects-section');
  if (!container || !PORTFOLIO_DATA?.projects) return;

  const filtered = PORTFOLIO_DATA.projects.filter(p => {
    if (filterCategory === 'all' || filterCategory === 'featured') return true;
    if (filterCategory === 'backend') return p.category.includes('backend');
    if (filterCategory === 'frontend') return p.category.includes('frontend') || p.category.includes('web') || p.category.includes('android');
    return true;
  });

  if (filtered.length === 0) {
    if (section) section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  if (section) section.classList.remove('hidden');

  container.innerHTML = filtered.map(proj => `
    <article class="toss-flat-card p-5 sm:p-6 flex flex-col justify-between space-y-4">
      <div>
        <!-- Screenshot Image -->
        <a href="${proj.detailPage}" class="block w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3.5 group">
          <img src="${proj.image}" alt="${proj.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy">
        </a>

        <div class="flex items-center justify-between gap-2 mb-1.5">
          ${proj.award ? `
            <span class="font-bold text-xs text-[var(--toss-primary)]">${proj.award}</span>
          ` : `
            <span class="text-xs text-[var(--toss-text-tertiary)] font-medium">${proj.categoryName}</span>
          `}
          <span class="text-xs font-mono text-[var(--toss-text-tertiary)]">${proj.period}</span>
        </div>

        <!-- Title & Subtitle -->
        <h3 class="text-lg font-bold text-[var(--toss-text-primary)]">
          <a href="${proj.detailPage}" class="hover:text-[var(--toss-primary)] transition-colors">
            ${proj.title}
          </a>
        </h3>
        <p class="text-xs font-medium text-[var(--toss-primary)] mt-0.5 mb-2">
          ${proj.subtitle}
        </p>

        <!-- Summary -->
        <p class="text-xs sm:text-[13.5px] text-[var(--toss-text-secondary)] leading-relaxed mb-3 line-clamp-3">
          ${proj.summary}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 mb-2">
          ${proj.tags.slice(0, 5).map(tag => `
            <span class="toss-chip-subtle !py-0.5 !px-2 !text-[11px]">${tag}</span>
          `).join('')}
          ${proj.tags.length > 5 ? `
            <span class="text-[10px] text-[var(--toss-text-tertiary)] self-center pl-1 font-medium">
              +${proj.tags.length - 5}
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Footer Action (Clean & Simple) -->
      <div class="pt-3 border-t border-[var(--toss-border-subtle)] flex items-center justify-between flex-wrap gap-2">
        <a href="${proj.detailPage}" class="text-xs font-semibold text-[var(--toss-primary)] hover:underline flex items-center gap-1">
          <span>상세 분석 보기</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </a>

        ${(proj.links || []).filter(l => l.url && l.url.startsWith('http')).length > 0 ? `
          <div class="flex items-center gap-3">
            ${proj.links.filter(l => l.url.startsWith('http')).map(link => `
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-[var(--toss-text-tertiary)] hover:text-[var(--toss-text-primary)] flex items-center gap-1.5 transition-colors">
                ${GITHUB_SVG}
                <span>${link.label || 'GitHub'}</span>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </article>
  `).join('');
}

/**
 * 6-2. Other Projects (기타 프로젝트 5개 - 클릭 시 상세 페이지 이동)
 */
function renderOtherProjects(filterCategory) {
  const container = document.getElementById('other-projects-grid');
  const section = document.getElementById('other-projects-section');
  if (!container || !PORTFOLIO_DATA?.otherProjects) return;

  if (filterCategory === 'featured') {
    if (section) section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const filtered = PORTFOLIO_DATA.otherProjects.filter(p => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'backend') return p.category.includes('backend');
    if (filterCategory === 'frontend') return p.category.includes('frontend') || p.category.includes('web') || p.category.includes('android');
    return true;
  });

  if (filtered.length === 0) {
    if (section) section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  if (section) section.classList.remove('hidden');

  container.innerHTML = filtered.map(proj => `
    <a href="${proj.detailPage || proj.url || '#'}" class="toss-flat-card p-5 sm:p-6 flex flex-col justify-between space-y-3 cursor-pointer group hover:bg-[var(--toss-surface-hover)] transition-all block">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="toss-chip text-[11px] font-bold">${proj.subtitle}</span>
          <div class="flex items-center gap-1 text-xs font-mono text-[var(--toss-text-tertiary)] group-hover:text-[var(--toss-primary)] transition-colors">
            <span>${proj.period}</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </div>
        </div>

        <h4 class="text-base font-bold text-[var(--toss-text-primary)] group-hover:text-[var(--toss-primary)] transition-colors">
          ${proj.title}
        </h4>

        <p class="text-xs sm:text-[13.5px] text-[var(--toss-text-secondary)] leading-relaxed">
          ${proj.summary}
        </p>

        ${proj.highlights && proj.highlights.length > 0 ? `
          <div class="pt-1.5 space-y-1 text-xs text-[var(--toss-text-secondary)]">
            ${proj.highlights.slice(0, 2).map(h => `
              <div class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--toss-primary)] mt-1.5 shrink-0"></span>
                <span class="leading-relaxed">${h}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${proj.deliverables ? `
          <div class="pt-1 flex flex-wrap gap-1.5">
            ${proj.deliverables.map(d => `
              <span class="px-2 py-0.5 rounded bg-[var(--toss-bg)] text-[11px] font-medium text-[var(--toss-text-primary)]">
                ${d}
              </span>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="pt-3 border-t border-[var(--toss-border-subtle)] flex items-center justify-between flex-wrap gap-2">
        <div class="flex flex-wrap gap-1.5">
          ${proj.tags.slice(0, 3).map(tag => `
            <span class="toss-chip-subtle !py-0.5 !px-2 !text-[10.5px]">${tag}</span>
          `).join('')}
        </div>
        <span class="text-xs font-semibold text-[var(--toss-primary)] flex items-center gap-0.5 group-hover:underline">
          <span>자세히 보기</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </span>
      </div>
    </a>
  `).join('');
}

/**
 * 7. Experience Rendering (높이를 대폭 줄이고 깔끔한 텍스트 리스트 형태로 전환)
 */
function renderExperiences() {
  const container = document.getElementById('experience-timeline');
  if (!container || !PORTFOLIO_DATA?.experiences) return;

  container.innerHTML = `
    <div class="divide-y divide-[var(--toss-border-subtle)]">
      ${PORTFOLIO_DATA.experiences.map(exp => `
        <div class="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <div class="space-y-0.5 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-sm text-[var(--toss-text-primary)]">${exp.title}</h3>
              <span class="text-xs font-semibold text-[var(--toss-primary)]">${exp.organization} · ${exp.role}</span>
            </div>
            <p class="text-xs text-[var(--toss-text-secondary)] leading-normal">${exp.description}</p>
          </div>
          <span class="text-xs font-mono text-[var(--toss-text-tertiary)] shrink-0 sm:text-right">${exp.period}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 8. Event Listeners
 */
function initEventListeners() {
  const filterBtns = document.querySelectorAll('#project-filters button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });

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
 * 9. Toast Notification (Flat)
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2300);
}
