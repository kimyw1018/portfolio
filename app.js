/**
 * ==============================================================================
 * Editorial Portfolio — Application Logic & Dynamic Rendering (app.js)
 * ==============================================================================
 */

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
  if (window.lucide) window.lucide.createIcons();
}

function pad2(n) {
  return String(n + 1).padStart(2, '0');
}

/**
 * 1. Theme
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
 * 2. Profile
 */
function renderProfile() {
  const p = PORTFOLIO_DATA?.profile;
  if (!p) return;

  const affilEl = document.getElementById('hero-affiliation');
  const taglineEl = document.getElementById('hero-tagline');
  const avatarEl = document.getElementById('hero-avatar');

  if (affilEl && p.affiliation) affilEl.textContent = `${p.affiliation} · ${p.role}`;
  if (taglineEl && p.tagline) taglineEl.textContent = p.tagline;
  if (avatarEl && p.avatar) avatarEl.src = p.avatar;

  const bioContainer = document.getElementById('hero-bio-container');
  if (bioContainer && Array.isArray(p.bio)) {
    bioContainer.innerHTML = p.bio
      .map(paragraph => `<p class="leading-relaxed">${paragraph}</p>`)
      .join('');
  }
}

/**
 * 3. Education
 */
function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container || !PORTFOLIO_DATA?.education) return;

  container.innerHTML = `
    <div class="ed-divide">
      ${PORTFOLIO_DATA.education.map(edu => `
        <div class="ed-row py-5 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
          <span class="ed-mono text-xs text-[var(--ed-ink-faint)] shrink-0 sm:w-40">${edu.period}</span>
          <div class="space-y-1 flex-1">
            <div class="flex items-baseline gap-2.5 flex-wrap">
              <h3 class="text-base font-bold text-[var(--ed-ink)]">${edu.institution}</h3>
              <span class="ed-serif-italic text-sm text-[var(--ed-accent)]">${edu.major}</span>
            </div>
            ${edu.description ? `<p class="text-[13px] text-[var(--ed-ink-soft)] leading-relaxed">${edu.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 4. Skills
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !PORTFOLIO_DATA?.skills) return;

  const categories = Object.keys(PORTFOLIO_DATA.skills);

  container.innerHTML = categories.map(category => {
    const skillsList = PORTFOLIO_DATA.skills[category];
    return `
      <div>
        <span class="ed-eyebrow mb-2 block"><span>${category}</span></span>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6">
          ${skillsList.map(skill => `
            <div class="ed-skill-row">
              <div class="flex items-center gap-2.5 min-w-0">
                <img src="${skill.logo}" alt="${skill.name}" class="w-4 h-4 object-contain shrink-0" loading="lazy" onerror="this.style.display='none'">
                <span class="text-sm font-medium text-[var(--ed-ink)] whitespace-normal break-words">${skill.name}</span>
              </div>
              <span class="ed-mono text-[11px] shrink-0 ${skill.level === 'Advanced' ? 'text-[var(--ed-accent)]' : 'text-[var(--ed-ink-faint)]'}">
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
 * 5. Awards
 */
function renderAwards() {
  const container = document.getElementById('awards-container');
  if (!container || !PORTFOLIO_DATA?.awards) return;

  container.innerHTML = `
    <div class="ed-divide">
      ${PORTFOLIO_DATA.awards.map(award => `
        <div class="ed-row py-5 space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <span class="ed-mono text-xs text-[var(--ed-ink-faint)] shrink-0 sm:w-24">${award.date}</span>
            <span class="ed-badge shrink-0">${award.badge}</span>
            <h3 class="font-bold text-sm sm:text-[15px] text-[var(--ed-ink)] flex-1">${award.title}</h3>
            <span class="text-xs font-semibold text-[var(--ed-ink-soft)] shrink-0">${award.project}</span>
          </div>
          <div class="sm:pl-[172px] text-xs text-[var(--ed-ink-soft)] leading-relaxed">
            <span class="text-[var(--ed-ink-faint)] font-medium">${award.organization}</span>
            <span class="mx-1.5 text-[var(--ed-line)]">·</span>
            <span>${award.description}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 6. Projects
 */
function renderProjects(filterCategory = 'all') {
  renderFeaturedProjects(filterCategory);
  renderOtherProjects(filterCategory);
  initLucide();
}

function matchesFilter(p, filterCategory) {
  if (filterCategory === 'all' || filterCategory === 'featured') return true;
  if (filterCategory === 'backend') return p.category.includes('backend');
  if (filterCategory === 'frontend') return p.category.includes('frontend') || p.category.includes('web') || p.category.includes('android');
  return true;
}

/**
 * 6-1. Featured Projects — asymmetric alternating rows
 */
function renderFeaturedProjects(filterCategory) {
  const container = document.getElementById('projects-grid');
  const section = document.getElementById('featured-projects-section');
  if (!container || !PORTFOLIO_DATA?.projects) return;

  const filtered = PORTFOLIO_DATA.projects.filter(p => matchesFilter(p, filterCategory));

  if (filtered.length === 0) {
    if (section) section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }
  if (section) section.classList.remove('hidden');

  container.innerHTML = filtered.map((proj, i) => `
    <article class="ed-rule-b pb-12 sm:pb-14 last:border-b-0 last:pb-0">
      <div class="flex flex-col md:flex-row gap-8 md:gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}">
        <div class="md:w-[42%] shrink-0">
          <a href="${proj.detailPage}" class="ed-project-media aspect-[4/3] flex">
            <img src="${proj.image}" alt="${proj.title}" class="w-full h-full object-cover" loading="lazy">
          </a>
        </div>

        <div class="flex-1 min-w-0 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <span class="ed-folio text-4xl sm:text-5xl">${pad2(i)}</span>
            <span class="ed-mono text-xs text-[var(--ed-ink-faint)] pt-2">${proj.period}</span>
          </div>

          <div>
            ${proj.award
              ? `<span class="ed-badge">${proj.award}</span>`
              : `<span class="ed-eyebrow"><span>${proj.categoryName}</span></span>`}
            <h3 class="ed-display text-2xl sm:text-[28px] mt-2.5">
              <a href="${proj.detailPage}" class="hover:text-[var(--ed-accent)] transition-colors">${proj.title}</a>
            </h3>
            <p class="ed-serif-italic text-[15px] text-[var(--ed-accent)] mt-1">${proj.subtitle}</p>
          </div>

          <p class="text-[14.5px] text-[var(--ed-ink-soft)] leading-relaxed">${proj.summary}</p>

          ${proj.highlights && proj.highlights.length > 0 ? `
            <div class="ed-callout text-[13.5px]">
              ${proj.highlights[0]}
            </div>
          ` : ''}

          <div class="flex flex-wrap gap-1.5 pt-1">
            ${proj.tags.slice(0, 6).map(tag => `<span class="ed-tag">${tag}</span>`).join('')}
            ${proj.tags.length > 6 ? `<span class="ed-mono text-[11px] text-[var(--ed-ink-faint)] self-center pl-1">+${proj.tags.length - 6}</span>` : ''}
          </div>

          <div class="flex items-center justify-between flex-wrap gap-3 pt-4 ed-rule">
            <a href="${proj.detailPage}" class="ed-link text-sm font-semibold flex items-center gap-1">
              <span>상세 분석 보기</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
            ${(proj.links || []).filter(l => l.url && l.url.startsWith('http')).length > 0 ? `
              <div class="flex items-center gap-4">
                ${proj.links.filter(l => l.url.startsWith('http')).map(link => `
                  <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-[var(--ed-ink-faint)] hover:text-[var(--ed-ink)] flex items-center gap-1.5 transition-colors">
                    ${GITHUB_SVG}
                    <span>${link.label || 'GitHub'}</span>
                  </a>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * 6-2. Other Projects — compact editorial list
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

  const filtered = PORTFOLIO_DATA.otherProjects.filter(p => matchesFilter(p, filterCategory));

  if (filtered.length === 0) {
    if (section) section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }
  if (section) section.classList.remove('hidden');

  container.innerHTML = `
    <div class="ed-divide">
      ${filtered.map((proj, i) => `
        <a href="${proj.detailPage || proj.url || '#'}" class="ed-row group block py-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4 sm:gap-5 min-w-0">
              <span class="ed-folio text-2xl sm:text-3xl text-[var(--ed-ink-faint)] shrink-0 pt-0.5">${pad2(i)}</span>
              <div class="min-w-0 space-y-1.5">
                <div class="flex items-baseline gap-2.5 flex-wrap">
                  <h4 class="text-base font-bold text-[var(--ed-ink)] group-hover:text-[var(--ed-accent)] transition-colors">${proj.title}</h4>
                  <span class="ed-mono text-[11px] text-[var(--ed-ink-faint)]">${proj.period}</span>
                </div>
                <p class="ed-serif-italic text-[13px] text-[var(--ed-accent)]">${proj.subtitle}</p>
                <p class="text-[13px] text-[var(--ed-ink-soft)] leading-relaxed max-w-xl">${proj.summary}</p>
                <div class="flex flex-wrap gap-1.5 pt-1.5">
                  ${proj.tags.slice(0, 4).map(tag => `<span class="ed-tag">${tag}</span>`).join('')}
                  ${proj.deliverables ? proj.deliverables.map(d => `<span class="ed-tag ed-tag-accent">${d}</span>`).join('') : ''}
                </div>
              </div>
            </div>
            <i data-lucide="arrow-up-right" class="w-4 h-4 text-[var(--ed-ink-faint)] group-hover:text-[var(--ed-accent)] transition-colors shrink-0 mt-1.5"></i>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

/**
 * 7. Experience
 */
function renderExperiences() {
  const container = document.getElementById('experience-timeline');
  if (!container || !PORTFOLIO_DATA?.experiences) return;

  container.innerHTML = `
    <div class="ed-divide">
      ${PORTFOLIO_DATA.experiences.map(exp => `
        <div class="ed-row py-5 flex flex-col sm:flex-row gap-1.5 sm:gap-6">
          <span class="ed-mono text-xs text-[var(--ed-ink-faint)] shrink-0 sm:w-40">${exp.period}</span>
          <div class="space-y-1 flex-1">
            <div class="flex items-baseline gap-2.5 flex-wrap">
              <h3 class="font-bold text-sm text-[var(--ed-ink)]">${exp.title}</h3>
              <span class="text-xs font-semibold text-[var(--ed-accent)]">${exp.organization} · ${exp.role}</span>
            </div>
            <p class="text-[13px] text-[var(--ed-ink-soft)] leading-relaxed">${exp.description}</p>
          </div>
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
 * 9. Toast
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2300);
}
