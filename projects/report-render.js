/**
 * ==============================================================================
 * 공용 "완전판 리포트" 렌더러
 * portfolio-out/<slug>/*.json(구조화 데이터) + *.md의 "확인 필요 항목"/"면접 예상
 * 질문" 섹션(JSON에는 없음)을 합친 REPORT_DATA를 받아, 요약 없이 전체 내용을
 * 하나의 통일된 템플릿으로 렌더링한다. 모달 없음(아코디언 인라인 확장만),
 * 갤러리는 슬라이드/크롭 없는 연속 리스트(object-fit: contain)로 표시한다.
 * ==============================================================================
 */
(function (global) {
  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escLines(v) {
    return esc(v).replace(/\n/g, '<br>');
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  // 코드/트리처럼 공백과 특수문자를 그대로 보존해야 하는 블록은
  // innerHTML 조립 후 textContent로 안전하게 주입한다 (이스케이프 버그 방지).
  function registerCodeSlot(slots, text) {
    const i = slots.length;
    slots.push(text == null ? '' : String(text));
    return `<pre class="ed-code" data-code-slot="${i}"></pre>`;
  }

  function codeBlock(slots, codeObj, label) {
    if (!codeObj) return '';
    const path = codeObj.path ? `<div class="ed-code-path">${esc(label || '')}${label ? ' · ' : ''}${esc(codeObj.path)}${codeObj.lang ? ' (' + esc(codeObj.lang) + ')' : ''}</div>` : '';
    return `${path}${registerCodeSlot(slots, codeObj.snippet || codeObj.code || '')}`;
  }

  function section(num, title, innerHtml) {
    if (innerHtml === '' || innerHtml == null) return '';
    return `
      <section class="space-y-4" data-report-section>
        <span class="ed-eyebrow"><span class="num">${pad2(num)}</span><span>${esc(title)}</span></span>
        ${innerHtml}
      </section>`;
  }

  function renderStats(keyResults) {
    if (!keyResults || !keyResults.length) return '';
    return `
      <div class="ed-stats">
        ${keyResults.map(k => `
          <div class="ed-stat">
            <div class="ed-stat-value">${esc(k.value)}</div>
            <div class="ed-stat-label">${esc(k.label)}</div>
            ${k.condition ? `<div class="ed-stat-condition">${esc(k.condition)}</div>` : ''}
          </div>
        `).join('')}
      </div>`;
  }

  function renderOverview(ov) {
    if (!ov) return '';
    const list = (title, arr) => !arr || !arr.length ? '' : `
      <div class="pt-3">
        <p class="ed-mono text-[11px] text-[var(--ed-ink-faint)] uppercase tracking-wider mb-1.5">${esc(title)}</p>
        <ul class="ed-ref-list">${arr.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      </div>`;
    return `
      <div class="ed-callout text-[14px] leading-relaxed space-y-1">
        <p><strong class="text-[var(--ed-ink)]">배경:</strong> ${esc(ov.background)}</p>
        ${ov.problem ? `<p class="pt-2"><strong class="text-[var(--ed-ink)]">기술적으로 어려웠던 지점:</strong> ${esc(ov.problem)}</p>` : ''}
      </div>
      ${list('담당 범위 (scope)', ov.scope)}
      ${list('협업 방식 (collaboration)', ov.collaboration)}`;
  }

  function renderStack(stack) {
    if (!stack || !stack.length) return '';
    return `
      <div class="ed-table-wrap">
        <table class="ed-table">
          <thead><tr><th style="width:22%">분야</th><th>기술 / 선택 이유</th></tr></thead>
          <tbody>
            ${stack.map(group => `
              <tr>
                <td>${esc(group.category)}</td>
                <td>
                  <ul class="space-y-1.5">
                    ${group.items.map(it => `<li><strong class="text-[var(--ed-ink)]">${esc(it.name)}</strong>${it.reason ? ` — <span class="text-[var(--ed-ink-soft)]">${esc(it.reason)}</span>` : ''}</li>`).join('')}
                  </ul>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderDesign(design, slots) {
    if (!design) return '';
    const row = (label, value) => !value ? '' : `
      <div class="py-4 flex gap-4">
        <span class="ed-mono text-xs text-[var(--ed-ink-faint)] pt-0.5 w-20 shrink-0">${esc(label)}</span>
        <p class="text-sm text-[var(--ed-ink-soft)] leading-relaxed">${esc(value)}</p>
      </div>`;
    const tree = design.tree ? `
      <div class="pt-2">
        <p class="ed-mono text-[11px] text-[var(--ed-ink-faint)] uppercase tracking-wider mb-1.5">디렉터리 구조</p>
        ${registerCodeSlot(slots, design.tree)}
      </div>` : '';
    const diagrams = (design.diagrams && design.diagrams.length) ? `
      <div class="pt-2">
        <p class="ed-mono text-[11px] text-[var(--ed-ink-faint)] uppercase tracking-wider mb-1.5">다이어그램</p>
        <ul class="ed-ref-list">${design.diagrams.map(d => `<li>${esc(typeof d === 'string' ? d : JSON.stringify(d))}</li>`).join('')}</ul>
      </div>` : '';
    return `
      <div class="ed-divide">
        ${row('아키텍처', design.architecture)}
        ${row('데이터 모델', design.dataModel)}
        ${row('API/인터페이스', design.api)}
        ${row('인프라/배포', design.infra)}
      </div>
      ${tree}${diagrams}`;
  }

  function renderFeatures(features, slots) {
    if (!features || !features.length) return '';
    return features.map((f, i) => `
      <article class="ed-toggle-card" data-id="feat-${i}">
        <div class="ed-toggle-header">
          <div class="ed-toggle-title-area">
            <div class="ed-toggle-meta"><span class="ed-tag ed-tag-accent">핵심 구현 ${i + 1}</span></div>
            <h3 class="ed-toggle-title">${esc(f.name)}</h3>
            <p class="ed-toggle-summary">${esc(f.what)}</p>
          </div>
          <div class="ed-toggle-icon"><i data-lucide="plus" class="w-4 h-4"></i></div>
        </div>
        <div class="ed-toggle-body text-sm space-y-3">
          <div>
            <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">무엇을 구현했는가</h4>
            <p class="text-[var(--ed-ink-soft)] leading-relaxed">${esc(f.what)}</p>
          </div>
          ${f.how && f.how.length ? `
            <div>
              <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">어떻게 구현했는가</h4>
              <ol class="ed-ref-list list-decimal list-inside">${f.how.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
            </div>` : ''}
          ${f.decision ? `
            <div>
              <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">선택지와 판단</h4>
              <p class="text-[var(--ed-ink-soft)] leading-relaxed">${esc(f.decision)}</p>
            </div>` : ''}
          ${f.files && f.files.length ? `
            <div>
              <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">관련 파일</h4>
              <ul class="ed-ref-list">${f.files.map(p => `<li><code>${esc(p)}</code></li>`).join('')}</ul>
            </div>` : ''}
          ${f.code ? `<div>${codeBlock(slots, f.code)}</div>` : ''}
        </div>
      </article>
    `).join('');
  }

  function renderTroubleshooting(items, slots) {
    if (!items || !items.length) return '';
    return items.map((t, i) => `
      <article class="ed-toggle-card" data-id="ts-${i}">
        <div class="ed-toggle-header">
          <div class="ed-toggle-title-area">
            <div class="ed-toggle-meta">
              ${(t.tags || []).map(tag => `<span class="ed-tag ed-tag-accent">${esc(tag)}</span>`).join('')}
            </div>
            <h3 class="ed-toggle-title">${esc(t.title)}</h3>
          </div>
          <div class="ed-toggle-icon"><i data-lucide="plus" class="w-4 h-4"></i></div>
        </div>
        <div class="ed-toggle-body text-sm space-y-3">
          <div>
            <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">문제 상황</h4>
            <p class="text-[var(--ed-ink-soft)] leading-relaxed">${esc(t.problem)}</p>
          </div>
          <div>
            <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">원인 분석</h4>
            <p class="text-[var(--ed-ink-soft)] leading-relaxed">${esc(t.cause)}</p>
          </div>
          ${t.options && t.options.length ? `
            <div>
              <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">검토한 대안</h4>
              <div class="ed-table-wrap">
                <table class="ed-table">
                  <thead><tr><th>대안</th><th>장점</th><th>한계</th><th>채택</th></tr></thead>
                  <tbody>
                    ${t.options.map(o => `<tr><td>${esc(o.name)}</td><td>${esc(o.pros)}</td><td>${esc(o.cons)}</td><td class="${o.chosen ? 'is-chosen' : ''}">${o.chosen ? '채택' : '미채택'}</td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </div>` : ''}
          <div>
            <h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">해결 과정</h4>
            <p class="text-[var(--ed-ink-soft)] leading-relaxed">${esc(t.solution)}</p>
          </div>
          ${t.codeBefore ? `<div><h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">변경 전</h4>${codeBlock(slots, t.codeBefore)}</div>` : ''}
          ${t.codeAfter ? `<div><h4 class="ed-mono text-[11px] text-[var(--ed-accent)] uppercase tracking-wider mb-1">변경 후</h4>${codeBlock(slots, t.codeAfter)}</div>` : ''}
          ${t.result ? `<div class="pt-1 text-xs text-[var(--ed-ink-faint)]"><strong class="text-[var(--ed-ink-soft)]">결과:</strong> ${esc(t.result)}</div>` : ''}
          ${t.evidence ? `<div class="text-xs text-[var(--ed-ink-faint)]"><strong class="text-[var(--ed-ink-soft)]">근거:</strong> ${esc(t.evidence)}</div>` : ''}
          ${t.learned ? `<div class="text-xs text-[var(--ed-ink-faint)]"><strong class="text-[var(--ed-ink-soft)]">배운 점:</strong> ${esc(t.learned)}</div>` : ''}
        </div>
      </article>
    `).join('');
  }

  function renderGallery(gallery) {
    if (!gallery || !gallery.length) return '';
    return `
      <div class="ed-shots">
        ${gallery.map(g => `
          <figure>
            <img src="${esc(g.src)}" alt="${esc(g.caption || '')}" loading="lazy">
            ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>`;
  }

  function renderSuggestedShots(screenshots) {
    if (!screenshots || !screenshots.length) return '';
    return `
      <p class="text-xs text-[var(--ed-ink-faint)] mb-1">레포 분석 과정에서 제안된 캡처 목록 원문입니다 (파일명·설명 그대로).</p>
      <ul class="ed-ref-list">
        ${screenshots.map(s => `<li><code>${esc(s.src)}</code> — ${esc(s.caption)}</li>`).join('')}
      </ul>`;
  }

  function renderAttachments(attachments) {
    if (!attachments || !attachments.length) return '';
    return attachments.map(a => `
      <div class="ed-doc">
        <div class="ed-doc-header">
          <span>${esc(a.label)}</span>
          <a href="${esc(a.href)}" target="_blank" class="ed-link">새 탭에서 열기</a>
        </div>
        <iframe src="${esc(a.href)}" class="ed-doc-frame" title="${esc(a.label)}"></iframe>
      </div>
    `).join('');
  }

  function renderDocuments(documents) {
    if (!documents || !documents.length) return '';
    return `
      <p class="text-xs text-[var(--ed-ink-faint)] mb-1">레포 내에 존재하는 참고 문서 목록입니다 (저장소 경로 기준).</p>
      <ul class="ed-ref-list">
        ${documents.map(d => `<li><strong class="text-[var(--ed-ink)]">${esc(d.title)}</strong> — <code>${esc(d.file)}</code></li>`).join('')}
      </ul>`;
  }

  function renderList(arr) {
    if (!arr || !arr.length) return '';
    return `<ul class="ed-ref-list">${arr.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  }

  // openQuestions: [{ heading, items: [string,...] }, ...] — md 10장 원문 그대로
  function renderGroupedList(groups) {
    if (!groups || !groups.length) return '';
    return groups.map(g => `
      <div class="pt-3">
        <p class="ed-mono text-[11px] text-[var(--ed-ink-faint)] uppercase tracking-wider mb-1.5">${esc(g.heading)}</p>
        <ul class="ed-ref-list">${(g.items || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  function renderQA(items) {
    if (!items || !items.length) return '';
    return items.map(qa => {
      if (typeof qa === 'string') return `<div class="ed-qa"><p class="ed-qa-q">${esc(qa)}</p></div>`;
      return `<div class="ed-qa"><p class="ed-qa-q">${esc(qa.q)}</p>${qa.a ? `<p class="ed-qa-a">${esc(qa.a)}</p>` : ''}</div>`;
    }).join('');
  }

  function renderLinks(links) {
    if (!links || !links.length) return '';
    return `<div class="flex flex-wrap gap-2.5">${links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" class="ed-btn !py-2 !px-3.5 !text-[11px]"><span>${esc(l.label)}</span></a>`).join('')}</div>`;
  }

  /**
   * data: REPORT_DATA 객체 (json 전체 필드 + openQuestions/interviewQuestions/gallery/attachments)
   * opts: { mount: '#report-root', startNum: 1 }
   */
  function renderReport(data, opts) {
    opts = opts || {};
    const mountEl = typeof opts.mount === 'string' ? document.querySelector(opts.mount) : opts.mount;
    if (!mountEl || !data) return;
    const start = opts.startNum || 1;
    const slots = [];

    const parts = [];
    parts.push(renderStats(data.keyResults));
    parts.push(section(start, '개요 (Overview)', renderOverview(data.overview)));
    parts.push(section(start + 1, '기술 스택 (Stack)', renderStack(data.stack)));
    parts.push(section(start + 2, '설계 (Design)', renderDesign(data.design, slots)));
    const feat = renderFeatures(data.features, slots);
    parts.push(feat ? section(start + 3, '핵심 구현 (Features)', `<div class="ed-accordion">${feat}</div>`) : '');
    const shots = renderGallery(data.gallery);
    parts.push(shots ? section(start + 4, '스크린샷 갤러리 (실제 첨부)', shots) : '');
    const suggested = renderSuggestedShots(data.screenshots);
    parts.push(suggested ? section(start + 5, '제안된 캡처 목록 (원문)', suggested) : '');
    const attach = renderAttachments(data.attachments);
    parts.push(attach ? section(start + 6, '첨부 문서 (실제 파일)', `<div class="space-y-4">${attach}</div>`) : '');
    const docs = renderDocuments(data.documents);
    parts.push(docs ? section(start + 7, '참고 문서 (레포 내 원문 목록)', docs) : '');
    const ts = renderTroubleshooting(data.troubleshooting, slots);
    parts.push(ts ? section(start + 8, '트러블 슈팅', `<div class="ed-accordion">${ts}</div>`) : '');
    parts.push(section(start + 9, '결과 (Results)', renderList(data.results)));
    parts.push(section(start + 10, '회고 (Retrospective)', renderList(data.retrospective)));
    parts.push(section(start + 11, '확인 필요 항목 (원문)', renderGroupedList(data.openQuestions)));
    const qa = renderQA(data.interviewQuestions);
    parts.push(qa ? section(start + 12, '면접 예상 질문 (원문)', `<div class="ed-divide">${qa}</div>`) : '');
    const links = renderLinks(data.links);
    parts.push(links ? section(start + 13, '링크', links) : '');

    mountEl.innerHTML = parts.join('');

    // 코드/트리 블록을 textContent로 안전하게 주입 (HTML 이스케이프 걱정 없음)
    mountEl.querySelectorAll('[data-code-slot]').forEach(el => {
      const idx = Number(el.getAttribute('data-code-slot'));
      el.textContent = slots[idx] || '';
    });

    // 아코디언: 모달 없이 헤더 클릭 시 카드가 그 자리에서 펼쳐짐
    mountEl.querySelectorAll('.ed-toggle-card').forEach(card => {
      const header = card.querySelector('.ed-toggle-header');
      header?.addEventListener('click', () => card.classList.toggle('is-open'));
    });

    if (global.lucide) global.lucide.createIcons();
  }

  global.renderReport = renderReport;
  global.escReport = esc;

  // 모든 리포트 페이지에서 공통으로 쓰는 히어로(타이틀/역할/기간/요약) 렌더링.
  function renderHero(mountSelector, data) {
    const mountEl = typeof mountSelector === 'string' ? document.querySelector(mountSelector) : mountSelector;
    if (!mountEl || !data) return;
    mountEl.innerHTML = `
      <div class="flex flex-wrap items-center gap-3">
        <span class="ed-eyebrow"><span>${esc(data.role || '')}</span></span>
        <span class="ed-mono text-xs text-[var(--ed-ink-faint)]">${esc(data.period || '')}</span>
      </div>
      <div>
        <h1 class="ed-display text-4xl sm:text-5xl text-[var(--ed-ink)]">${esc(data.title)}</h1>
        <p class="ed-serif text-lg sm:text-xl text-[var(--ed-accent)] mt-2 leading-snug max-w-2xl">${esc(data.summary)}</p>
      </div>
    `;
  }
  global.renderHero = renderHero;
})(window);
