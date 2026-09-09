/**
 * ==============================================================================
 * Green TDS (Toss Design System - Green Edition)
 * Application Logic & Dynamic Component Rendering (app.js)
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

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * 1. Theme Management (Light mode default for pristine Green Toss look)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  // Default to light for clean Toss grey & white card experience unless user explicitly chose dark
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
 * 2. Profile Rendering (Toss UX Tone)
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
 * 3. Education Rendering (Toss Subcard Layout)
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container || !PORTFOLIO_DATA?.education) return;

  container.innerHTML = PORTFOLIO_DATA.education.map(edu => `
    <div class="toss-subcard p-5 flex flex-col justify-between space-y-2.5">
      <div>
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="toss-chip text-[11px] font-semibold">${edu.period}</span>
          <span class="text-xs text-[var(--toss-text-tertiary)]">학력</span>
        </div>
        <h3 class="text-base font-bold text-[var(--toss-text-primary)]">${edu.institution}</h3>
        <p class="text-xs font-semibold text-[var(--toss-primary)] mt-0.5">${edu.major}</p>
      </div>
      ${edu.description ? `
        <p class="text-xs text-[var(--toss-text-secondary)] leading-relaxed pt-2 border-t border-[var(--toss-border-subtle)]">
          ${edu.description}
        </p>
      ` : ''}
    </div>
  `).join('');
}

/**
 * 4. Tech Stack Rendering (Organized Soft Groups)
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
 * 5. Awards & Honors Rendering
 */
function renderAwards() {
  const container = document.getElementById('awards-container');
  if (!container || !PORTFOLIO_DATA?.awards) return;

  container.innerHTML = PORTFOLIO_DATA.awards.map(award => `
    <div class="toss-subcard p-5 flex flex-col justify-between space-y-3 hover:border-[var(--toss-primary)] transition-all">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="toss-chip text-[11px] font-bold">
            ${award.badge}
          </span>
          <span class="text-[11px] font-mono text-[var(--toss-text-tertiary)]">${award.date}</span>
        </div>
        <h3 class="text-sm sm:text-base font-bold text-[var(--toss-text-primary)] mb-1">
          ${award.title}
        </h3>
        <p class="text-xs font-semibold text-[var(--toss-primary)] mb-2">
          프로젝트: ${award.project}
        </p>
        <p class="text-xs text-[var(--toss-text-secondary)] leading-relaxed">
          ${award.description}
        </p>
      </div>
      <div class="pt-2.5 border-t border-[var(--toss-border-subtle)] text-[11px] text-[var(--toss-text-tertiary)] flex items-center justify-between">
        <span>주최: ${award.organization}</span>
        <span class="text-[var(--toss-primary)] font-medium">검증된 역량 🌿</span>
      </div>
    </div>
  `).join('');
}

/**
 * 6. Projects Rendering (Toss Clean Cards with Action Button)
 */
function renderProjects(filterCategory = 'all') {
  const container = document.getElementById('projects-grid');
  if (!container || !PORTFOLIO_DATA?.projects) return;

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
      <div class="col-span-full toss-card p-10 text-center text-[var(--toss-text-tertiary)] text-xs">
        해당 카테고리의 프로젝트가 아직 없습니다. 🌿
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(proj => `
    <article class="toss-card toss-card-interactive p-6 sm:p-7 flex flex-col justify-between space-y-4">
      <div>
        <!-- Top Meta: Award & Period -->
        <div class="flex items-center justify-between gap-2 mb-3">
          ${proj.award ? `
            <span class="toss-chip text-[11px] font-bold">
              🏆 ${proj.award}
            </span>
          ` : `
            <span class="toss-chip-subtle text-[11px] font-medium">
              ${proj.category}
            </span>
          `}
          <span class="text-[11px] font-mono text-[var(--toss-text-tertiary)]">${proj.period}</span>
        </div>

        <!-- Title & Subtitle -->
        <h3 class="text-lg font-bold text-[var(--toss-text-primary)] hover:text-[var(--toss-primary)] transition-colors">
          <a href="${proj.detailPage}">
            ${proj.title}
          </a>
        </h3>
        <p class="text-xs font-semibold text-[var(--toss-primary)] mt-1 mb-3">
          ${proj.subtitle}
        </p>

        <!-- Summary -->
        <p class="text-xs sm:text-[13px] text-[var(--toss-text-secondary)] leading-relaxed mb-4 line-clamp-3">
          ${proj.summary}
        </p>

        <!-- Tags -->
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
          <span>상세 분석 보기</span>
          <i data-lucide="chevron-right" class="w-4 h-4 transition-transform group-hover:translate-x-1 text-[var(--toss-primary)]"></i>
        </a>

        ${(proj.links || []).filter(l => l.url && l.url.startsWith('http')).length > 0 ? `
          <div class="flex items-center justify-end gap-3 pt-1">
            ${proj.links.filter(l => l.url.startsWith('http')).map(link => `
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-[var(--toss-text-tertiary)] hover:text-[var(--toss-primary)] flex items-center gap-1 transition-colors">
                <i data-lucide="github" class="w-3.5 h-3.5"></i>
                <span>${link.label || 'GitHub'}</span>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </article>
  `).join('');

  initLucide();
}

/**
 * 7. Experience Rendering (Timeline Cards)
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
 * 8. Event Listeners & Interaction
 */
function initEventListeners() {
  // Segmented Control Project Filters
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
