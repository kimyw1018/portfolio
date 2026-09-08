/**
 * ==============================================================================
 * GitHub Primer-Inspired Portfolio Interaction & Rendering Logic (app.js)
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
 * 1. GitHub Style Theme Management (Dark by default, crisp contrast)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
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
  const p = PORTFOLIO_DATA.profile;
  if (!p) return;

  const nameEl = document.getElementById('hero-name');
  const roleEl = document.getElementById('hero-role-badge');
  const affilEl = document.getElementById('hero-affiliation');
  const statusEl = document.getElementById('hero-status');
  const taglineEl = document.getElementById('hero-tagline');
  const avatarEl = document.getElementById('hero-avatar');

  if (nameEl) nameEl.textContent = p.name;
  if (roleEl) roleEl.textContent = p.role;
  if (affilEl) affilEl.textContent = p.affiliation;
  if (statusEl) statusEl.textContent = "🚀 Available for opportunities";
  if (taglineEl) taglineEl.textContent = p.tagline;
  if (avatarEl && p.avatar) avatarEl.src = p.avatar;

  const bioContainer = document.getElementById('hero-bio-container');
  if (bioContainer && Array.isArray(p.bio)) {
    bioContainer.innerHTML = p.bio
      .map(paragraph => `<p class="leading-relaxed">${paragraph}</p>`)
      .join('');
  }
}

/**
 * 3. Education Rendering
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container || !PORTFOLIO_DATA.education) return;

  container.innerHTML = PORTFOLIO_DATA.education.map(edu => `
    <div class="border border-gh-border rounded-md bg-gh-card p-4 transition-colors">
      <div class="flex items-baseline justify-between gap-2 mb-1">
        <h3 class="text-sm font-semibold text-gh-text">${edu.institution}</h3>
        <span class="text-[11px] text-gh-subtle font-mono">${edu.period}</span>
      </div>
      <p class="text-xs font-medium text-gh-blue mb-1.5">${edu.major}</p>
      ${edu.description ? `<p class="text-xs text-gh-body leading-relaxed">${edu.description}</p>` : ''}
    </div>
  `).join('');
}

/**
 * 4. Tech Stack Rendering
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !PORTFOLIO_DATA.skills) return;

  const categories = Object.keys(PORTFOLIO_DATA.skills);

  container.innerHTML = categories.map(category => {
    const skillsList = PORTFOLIO_DATA.skills[category];
    return `
      <div>
        <h3 class="text-xs font-semibold text-gh-subtle uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-gh-blue"></span>
          ${category}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          ${skillsList.map(skill => `
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-md border border-gh-border bg-gh-card text-xs">
              <div class="text-base flex items-center justify-center w-5 h-5 text-gh-text">
                ${skill.icon ? `<i class="${skill.icon}"></i>` : `<i data-lucide="check" class="w-3.5 h-3.5 text-gh-blue"></i>`}
              </div>
              <div class="overflow-hidden">
                <p class="font-medium text-gh-text truncate">${skill.name}</p>
                <p class="text-[10px] text-gh-subtle">${skill.level}</p>
              </div>
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
  if (!container || !PORTFOLIO_DATA.awards) return;

  container.innerHTML = PORTFOLIO_DATA.awards.map(award => `
    <div class="border border-gh-border rounded-md bg-gh-card p-4 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30 bg-amber-950/20 text-amber-400">
            ${award.badge}
          </span>
          <span class="text-[11px] font-mono text-gh-subtle">${award.date}</span>
        </div>
        <h3 class="text-sm font-semibold text-gh-text mb-1">${award.title}</h3>
        <p class="text-xs text-gh-blue font-medium mb-1.5">프로젝트: ${award.project}</p>
        <p class="text-xs text-gh-body leading-relaxed">${award.description}</p>
      </div>
      <p class="text-[11px] text-gh-subtle border-t border-gh-border pt-2.5 mt-3">
        주최: ${award.organization}
      </p>
    </div>
  `).join('');
}

/**
 * 6. Projects Rendering (GitHub Pinned Repos Style)
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
      <div class="col-span-full text-center py-8 text-gh-subtle text-xs">
        해당 카테고리의 프로젝트가 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(proj => `
    <div class="gh-card flex flex-col justify-between p-5 rounded-md">
      <div>
        <!-- Card Top Header -->
        <div class="flex items-baseline justify-between gap-2 mb-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <i data-lucide="book-mark" class="w-4 h-4 text-gh-subtle shrink-0"></i>
            <a href="${proj.detailPage}" class="text-sm font-semibold text-gh-blue hover:underline truncate">
              ${proj.title}
            </a>
          </div>
          <span class="text-[11px] font-mono text-gh-subtle shrink-0">${proj.period}</span>
        </div>

        <!-- Award / Subtitle -->
        <div class="flex flex-wrap items-center gap-2 mb-2.5">
          ${proj.award ? `
            <span class="text-[11px] font-medium text-amber-400">
              🏆 ${proj.award}
            </span>
          ` : ''}
          <span class="text-[11px] text-gh-subtle">
            • ${proj.subtitle}
          </span>
        </div>

        <!-- Description (High Contrast & Very Readable) -->
        <p class="text-xs text-gh-body leading-relaxed mb-4 line-clamp-3">
          ${proj.summary}
        </p>

        <!-- Tech Tags (Clean pills) -->
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${proj.tags.slice(0, 5).map(tag => `
            <span class="gh-tag">${tag}</span>
          `).join('')}
          ${proj.tags.length > 5 ? `<span class="text-[10px] text-gh-subtle self-center">+${proj.tags.length - 5}</span>` : ''}
        </div>
      </div>

      <!-- Card Footer -->
      <div class="pt-3 border-t border-gh-border flex items-center justify-between text-xs">
        <a href="${proj.detailPage}" class="inline-flex items-center gap-1 font-semibold text-gh-blue hover:underline">
          <span>상세 분석 보기</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </a>

        <div class="flex items-center gap-2">
          ${(proj.links || []).filter(l => l.url.startsWith('http')).map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.label}" class="text-gh-subtle hover:text-gh-text p-1">
              <i data-lucide="github" class="w-3.5 h-3.5"></i>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  initLucide();
}

/**
 * 7. Experience Rendering
 */
function renderExperiences() {
  const container = document.getElementById('experience-timeline');
  if (!container || !PORTFOLIO_DATA.experiences) return;

  container.innerHTML = PORTFOLIO_DATA.experiences.map(exp => `
    <div class="border border-gh-border rounded-md bg-gh-card p-4 transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
        <h3 class="text-sm font-semibold text-gh-text">${exp.title}</h3>
        <span class="text-[11px] font-mono text-gh-subtle">${exp.period}</span>
      </div>
      <p class="text-xs text-gh-blue font-medium mb-1.5">${exp.organization} • ${exp.role}</p>
      <p class="text-xs text-gh-body leading-relaxed">${exp.description}</p>
    </div>
  `).join('');
}

/**
 * 8. Event Listeners
 */
function initEventListeners() {
  // Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('border', 'border-gh-border', 'bg-gh-bg', 'text-gh-text', 'font-medium');
        b.classList.add('text-gh-subtle');
      });
      btn.classList.add('border', 'border-gh-border', 'bg-gh-bg', 'text-gh-text', 'font-medium');
      btn.classList.remove('text-gh-subtle');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });

  // Copy Email
  const copyBtn = document.getElementById('copy-email-btn');
  copyBtn?.addEventListener('click', () => {
    const email = PORTFOLIO_DATA.profile.email;
    navigator.clipboard.writeText(email).then(() => {
      showToast(`이메일(${email})이 복사되었습니다.`);
    }).catch(() => {
      showToast('이메일 복사에 실패했습니다.');
    });
  });

  // Mobile Nav
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
 * 9. Toast Notification
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
  }, 2000);
}
