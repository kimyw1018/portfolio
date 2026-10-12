/**
 * ==============================================================================
 * 프로젝트 상세 페이지 공용 스크린샷 라이트박스
 * .ed-gallery[data-gallery] 안의 .ed-gallery-item(button[data-src][data-caption])을
 * 그룹 단위로 묶어 전체화면 뷰어로 보여준다.
 * ==============================================================================
 */
(function () {
  const backdrop = document.createElement('div');
  backdrop.className = 'ed-lightbox-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `
    <div class="ed-lightbox-bar">
      <span class="ed-lightbox-caption"></span>
      <div class="flex items-center gap-2">
        <span class="ed-lightbox-counter"></span>
        <button type="button" class="ed-lightbox-close" aria-label="닫기">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
    <div class="ed-lightbox-stage">
      <button type="button" class="ed-lightbox-nav ed-lightbox-prev" aria-label="이전 이미지">
        <i data-lucide="chevron-left" class="w-5 h-5"></i>
      </button>
      <img src="" alt="">
      <button type="button" class="ed-lightbox-nav ed-lightbox-next" aria-label="다음 이미지">
        <i data-lucide="chevron-right" class="w-5 h-5"></i>
      </button>
    </div>
  `;
  document.body.appendChild(backdrop);

  const imgEl = backdrop.querySelector('img');
  const captionEl = backdrop.querySelector('.ed-lightbox-caption');
  const counterEl = backdrop.querySelector('.ed-lightbox-counter');
  const prevBtn = backdrop.querySelector('.ed-lightbox-prev');
  const nextBtn = backdrop.querySelector('.ed-lightbox-next');
  const closeBtn = backdrop.querySelector('.ed-lightbox-close');

  let currentItems = [];
  let currentIndex = 0;

  function render() {
    const item = currentItems[currentIndex];
    if (!item) return;
    imgEl.src = item.dataset.src;
    imgEl.alt = item.dataset.caption || '';
    captionEl.textContent = item.dataset.caption || '';
    counterEl.textContent = `${currentIndex + 1} / ${currentItems.length}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentItems.length - 1;
  }

  function open(items, index) {
    currentItems = items;
    currentIndex = index;
    render();
    backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function go(delta) {
    const next = currentIndex + delta;
    if (next < 0 || next >= currentItems.length) return;
    currentIndex = next;
    render();
  }

  document.querySelectorAll('.ed-gallery').forEach((gallery) => {
    const items = Array.from(gallery.querySelectorAll('.ed-gallery-item'));
    items.forEach((item, index) => {
      item.addEventListener('click', () => open(items, index));
    });
  });

  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  window.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('is-active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  if (window.lucide) window.lucide.createIcons();
})();
