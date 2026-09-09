/**
 * ==============================================================================
 * Green TDS (Toss Design System - Green Edition)
 * Application Logic & Dynamic Component Rendering (app.js)
 * ==============================================================================
 */

// Crisp Inline GitHub SVG (prevents Lucide missing icon console error)
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
 * 1. Theme Management (Light mode default for pristine Green Toss aesthetic)
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
 * 3. Education Rendering (숭실대학교 단독)
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container || !PORTFOLIO_DATA?.education) return;

  container.innerHTML = PORTFOLIO_DATA.education.map(edu => `
    <div class="toss-subcard p-5 sm:p-6 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <span class="toss-chip text-xs font-semibold">${edu.period}</span>
          <span class="text-xs text-[var(--toss-text-tertiary)] font-medium">재학 중</span>
        </div>
        <span class="text-xs font-bold text-[var(--toss-primary)]">컴퓨터공학 전공</span>
      </div>
      <div>
        <h3 class="text-lg font-bold text-[var(--toss-text-primary)]">${edu.institution}</h3>
        <p class="text-sm font-semibold text-[var(--toss-primary)] mt-0.5">${edu.major}</p>
      </div>
      ${edu.description ? `
        <p class="text-xs sm:text-[13px] text-[var(--toss-text-secondary)] leading-relaxed pt-2.5 border-t border-[var(--toss-border-subtle)]">
          ${edu.description}
        </p>
      ` : ''}
    </div>
  `).join('');
}

/**
 * 4. Tech Stack Rendering
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !PORTFOLIO_DATA?.skills) return;

  const categories = Object.keys(PORTFOLIO_DATA.skills);

  container.innerHTML = categories.map(category => {
    const skillsList = PORTFOLIO_DATA.skills[category];
    return `
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[var(--toss-primary)]"></span>
          <h3 class="text-xs font-bold text-[var(--toss-text-secondary)] uppercase tracking-wider">
            ${category}
          </h3>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          ${skillsList.map(skill => `
            <div class="toss-subcard p-3 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 overflow-hidden">
                <div class="w-6 h-6 flex items-center justify-center text-lg shrink-0">
                  ${skill.icon ? `<i class="${skill.icon}"></i>` : `<i data-lucide="check" class="w-4 h-4 text-[var(--toss-primary)]"></i>`}
                </div>
                <div class="truncate">
                  <p class="text-xs font-bold text-[var(--toss-text-primary)] truncate">${skill.name}</p>
                </div>
              </div>
              <span class="toss-chip !py-0.5 !px-2 !text-[10px] shrink-0 font-medium">${skill.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 5. Awards & Honors Rendering (상 이름 우선 세로 배치 및 클릭 시 프로젝트 리다이렉트)
 */
function renderAwards() {
  const container = document.getElementById('awards-container');
  if (!container || !PORTFOLIO_DATA?.awards) return;

  container.innerHTML = PORTFOLIO_DATA.awards.map(award => `
    <div 
      class="toss-award-card p-5 sm:p-6 flex flex-col justify-between space-y-4" 
      onclick="location.href='${award.projectDetailUrl || '#'}'"
      title="${award.project} 프로젝트 상세 분석 보러가기"
    >
      <div class="space-y-3">
        <!-- 1. Top Badge (Solid Filled Color) & Date -->
        <div class="flex items-center justify-between gap-2">
          <span class="toss-award-badge">
            ${award.badge}
          </span>
          <span class="text-xs font-mono text-[var(--toss-text-tertiary)]">${award.date}</span>
        </div>

        <!-- 2. Award Name (Top Title) -->
        <h3 class="text-base sm:text-[17px] font-bold text-[var(--toss-text-primary)] leading-snug">
          ${award.title}
        </h3>

        <!-- 3. Linked Project Pill -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--toss-primary-light)] text-[var(--toss-primary)] font-bold text-xs group">
          <span>관련 프로젝트: ${award.project}</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"></i>
        </div>

        <!-- 4. Description -->
        <p class="text-xs sm:text-[13px] text-[var(--toss-text-secondary)] leading-relaxed">
          ${award.description}
        </p>
      </div>

      <!-- 5. Footer (Host Organization & Direct Link Action) -->
      <div class="pt-3 border-t border-[var(--toss-border-subtle)] text-xs text-[var(--toss-text-tertiary)] flex items-center justify-between">
        <span>주최: ${award.organization}</span>
        <span class="text-[var(--toss-primary)] font-bold flex items-center gap-1 hover:underline">
          <span>상세 분석 보기</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </span>
      </div>
    </div>
  `).join('');
}

/**
 * 6. Projects Rendering (Featured Case Studies 4개 + Other Projects 5개)
 */
function renderProjects(filterCategory = 'all') {
  renderFeaturedProjects(filterCategory);
  renderOtherProjects(filterCategory);
  initLucide();
}

/**
 * 6-1. Featured Projects (주요 프로젝트 4개 - 이미지 포함)
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
    <article class="toss-card toss-card-interactive p-5 sm:p-6 flex flex-col justify-between space-y-4 group">
      <div>
        <!-- Project Screenshot / Image Container -->
        <div class="toss-project-image-wrap mb-4">
          <img src="${proj.image}" alt="${proj.title} 스크린샷" loading="lazy">
          ${proj.award ? `
            <div class="absolute top-3 left-3 bg-[#00B050] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <span>${proj.award}</span>
            </div>
          ` : ''}
          <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
            ${proj.period}
          </div>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1">
          <h3 class="text-lg sm:text-xl font-bold text-[var(--toss-text-primary)] group-hover:text-[var(--toss-primary)] transition-colors">
            <a href="${proj.detailPage}">
              ${proj.title}
            </a>
          </h3>
          <p class="text-xs font-semibold text-[var(--toss-primary)]">
            ${proj.subtitle}
          </p>
        </div>

        <!-- Summary -->
        <p class="text-xs sm:text-[13px] text-[var(--toss-text-secondary)] leading-relaxed mt-2.5 mb-3.5 line-clamp-3">
          ${proj.summary}
        </p>

        <!-- Tech Tags -->
        <div class="flex flex-wrap gap-1.5 mb-2">
          ${proj.tags.slice(0, 5).map(tag => `
            <span class="toss-chip-subtle !py-1 !px-2.5 !text-[11px]">${tag}</span>
          `).join('')}
          ${proj.tags.length > 5 ? `
            <span class="text-[10px] text-[var(--toss-text-tertiary)] self-center pl-1 font-medium">
              +${proj.tags.length - 5}
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-4 border-t border-[var(--toss-border-subtle)] space-y-2">
        <a href="${proj.detailPage}" class="toss-btn-secondary !w-full justify-between group !py-2.5 !px-4 !text-xs !rounded-xl">
          <span class="font-bold">상세 분석 케이스 스터디</span>
          <i data-lucide="chevron-right" class="w-4 h-4 transition-transform group-hover:translate-x-1 text-[var(--toss-primary)]"></i>
        </a>

        ${(proj.links || []).filter(l => l.url && l.url.startsWith('http')).length > 0 ? `
          <div class="flex items-center justify-end gap-3 pt-1">
            ${proj.links.filter(l => l.url.startsWith('http')).map(link => `
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-[var(--toss-text-tertiary)] hover:text-[var(--toss-primary)] flex items-center gap-1.5 font-medium transition-colors">
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
 * 6-2. Other Projects (기타 실전 프로젝트 5개)
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
    <div class="toss-subcard p-5 sm:p-6 flex flex-col justify-between space-y-3 hover:border-[var(--toss-primary)] transition-all">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="toss-chip text-[11px] font-bold">${proj.subtitle}</span>
          <span class="text-xs font-mono text-[var(--toss-text-tertiary)]">${proj.period}</span>
        </div>

        <h4 class="text-base font-bold text-[var(--toss-text-primary)]">
          ${proj.title}
        </h4>

        <p class="text-xs sm:text-[13px] text-[var(--toss-text-secondary)] leading-relaxed">
          ${proj.summary}
        </p>

        <!-- Highlights Bullet Points -->
        ${proj.highlights && proj.highlights.length > 0 ? `
          <div class="pt-2 space-y-1.5 text-xs text-[var(--toss-text-secondary)]">
            ${proj.highlights.slice(0, 3).map(h => `
              <div class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--toss-primary)] mt-1.5 shrink-0"></span>
                <span class="leading-relaxed">${h}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Deliverables (for SSURENT etc) -->
        ${proj.deliverables ? `
          <div class="pt-2 flex flex-wrap gap-1.5">
            ${proj.deliverables.map(d => `
              <span class="px-2 py-0.5 rounded-md bg-[var(--toss-card)] border border-[var(--toss-border)] text-[11px] font-medium text-[var(--toss-text-primary)]">
                📄 ${d}
              </span>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="pt-3 border-t border-[var(--toss-border-subtle)] flex flex-wrap gap-1.5">
        ${proj.tags.map(tag => `
          <span class="toss-chip-subtle !py-0.5 !px-2 !text-[10.5px]">${tag}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * 7. Experience Rendering
 */
function renderExperiences() {
  const container = document.getElementById('experience-timeline');
  if (!container || !PORTFOLIO_DATA?.experiences) return;

  container.innerHTML = PORTFOLIO_DATA.experiences.map(exp => `
    <div class="toss-subcard p-5 space-y-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 class="text-sm sm:text-base font-bold text-[var(--toss-text-primary)]">${exp.title}</h3>
        <span class="toss-chip text-[11px] font-mono self-start sm:self-auto">${exp.period}</span>
      </div>
      <p class="text-xs font-bold text-[var(--toss-primary)]">${exp.organization} • ${exp.role}</p>
      <p class="text-xs text-[var(--toss-text-secondary)] leading-relaxed pt-1">
        ${exp.description}
      </p>
    </div>
  `).join('');
}

/**
 * 8. Event Listeners & Interactions
 */
function initEventListeners() {
  // Segmented Control Filters
  const filterBtns = document.querySelectorAll('#project-filters button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });

  // Copy Email Handlers
  const handleCopyEmail = () => {
    const email = PORTFOLIO_DATA?.profile?.email || 'poppppp00@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast(`이메일 주소(${email})가 복사되었습니다 🌿`);
    }).catch(() => {
      showToast('이메일 복사에 실패했습니다. 직접 복사해 주세요.');
    });
  };

  document.getElementById('copy-email-btn')?.addEventListener('click', handleCopyEmail);
  document.getElementById('footer-copy-email-btn')?.addEventListener('click', handleCopyEmail);
  document.getElementById('mobile-sticky-copy-btn')?.addEventListener('click', handleCopyEmail);

  // Mobile Menu Dropdown
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
 * 9. Toast Floating Notification
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
