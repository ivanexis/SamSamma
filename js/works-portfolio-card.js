/** 首頁作品區共用圖卡渲染（網站設計 / 地方創生 / 海報） */
const DEFAULT_PORTFOLIO_BADGES = ['Web UI/UX'];
const CLIENT_PROJECT_BADGE = '實際商案';

function formatCardTitle(work) {
  if (work.cardTitle) return work.cardTitle;

  return String(work.title || '')
    .replace(/^\*+/, '')
    .replace(/\s*\(實際商案\)\s*/g, '')
    .trim();
}

function resolveCardBadges(work) {
  const base = [...(work.badges || DEFAULT_PORTFOLIO_BADGES)];
  if (work.clientProject === false || base.includes(CLIENT_PROJECT_BADGE)) {
    return base;
  }
  return [...base, CLIENT_PROJECT_BADGE];
}

function createPortfolioWorkCard(work, index) {
  const col = document.createElement('div');
  col.className = 'col-md-4';
  col.dataset.aos = 'fade-up';
  col.dataset.aosDelay = String(100 + (index % 3) * 100);

  const thumbnails = (work.thumbnails || [])
    .map((src, thumbnailIndex) => `<img src="${src}" class="thumbnail" alt="縮圖${thumbnailIndex + 1}">`)
    .join('');

  const useContain = work.contain !== false;
  const imageClass = `img-fluid main-image${useContain ? ' main-image--contain' : ''}`;
  const containerExtra = work.imageContainerClass ? ` ${work.imageContainerClass}` : '';
  const thumbnailHtml = thumbnails
    ? `<div class="thumbnail-container">${thumbnails}</div>`
    : '';
  const categoryHtml = work.showCategory
    ? `<p class="work-category">${work.displayCategory || work.tradeCategory || work.filterGroup}</p>`
    : '';
  const cardBadges = resolveCardBadges(work);
  const badgesHtml = cardBadges.length
    ? `<div class="work-badges">${cardBadges.map((label) => {
      const modifier = label === CLIENT_PROJECT_BADGE ? ' work-badge--client' : '';
      return `<span class="work-badge${modifier}">${label}</span>`;
    }).join('')}</div>`
    : '';

  col.innerHTML = `
    <a href="${work.href}" class="text-decoration-none">
      <div class="work-card">
        <div class="work-image-container${containerExtra}">
          <img src="${work.image}" class="${imageClass}" alt="${work.alt || work.title}">
          ${thumbnailHtml}
        </div>
        <div class="work-info mt-3">
          <h6 class="work-title">${work.title}</h6>
          ${categoryHtml}
          ${badgesHtml}
        </div>
      </div>
    </a>
  `;

  return col;
}

function renderPortfolioWorkRow(rowId, works) {
  const row = document.getElementById(rowId);
  if (!row) return;

  row.replaceChildren();
  works.forEach((work, index) => {
    row.appendChild(createPortfolioWorkCard(work, index));
  });

  if (typeof AOS !== 'undefined') AOS.refresh();
}

window.PortfolioCard = {
  DEFAULT_PORTFOLIO_BADGES,
  CLIENT_PROJECT_BADGE,
  formatCardTitle,
  resolveCardBadges,
  createPortfolioWorkCard,
  renderPortfolioWorkRow
};
