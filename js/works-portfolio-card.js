/** 首頁作品區共用圖卡渲染（網站設計 / 地方創生 / 海報） */
const DEFAULT_PORTFOLIO_BADGES = ['Web UI/UX'];
const CLIENT_PROJECT_BADGE = '實際商案';

/** Badge 中文 → i18n key（不在此 mapping 內者 = 國際通用詞，原樣顯示）
 *  例：'Web UI/UX' 為國際通用詞，中英文都直接保留不翻
 */
const BADGE_I18N_KEYS = {
  '前端開發': 'badge.frontendDev',
  '前端': 'badge.frontend',
  '後端': 'badge.backend',
  'Google API 整合': 'badge.googleApi',
  '自動化預約系統': 'badge.autoReservation',
  '專案管理': 'badge.projectMgmt',
  '平面設計': 'badge.graphicDesign'
};

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

/* i18n helper：依當前語系決定顯示的卡片文字
 *  - 若 work 物件帶 *I18nKey 屬性 → 透過 window.I18N.t() 取對應字串
 *  - 否則直接 fallback 到 work 上的中文欄位
 *  - 渲染時把字串包進 <span data-i18n="..."> 讓切換語系時 applyDom() 自動翻譯
 */
function getI18n() {
  return (typeof window !== 'undefined' && window.I18N) ? window.I18N : null;
}

function wrapI18n(key, fallback) {
  if (!key) return fallback;
  const i18n = getI18n();
  const text = i18n ? i18n.t(key, fallback) : fallback;
  return `<span data-i18n="${key}">${text}</span>`;
}

function resolveClientBadgeLabel() {
  const i18n = getI18n();
  return i18n ? i18n.t('work.badge.clientProject', CLIENT_PROJECT_BADGE) : CLIENT_PROJECT_BADGE;
}

/** 把 badge 字串包裝成 <span data-i18n="key">text</span>（中英文都會正確顯示）
 *  - 'Web UI/UX' 等國際通用詞 → 不在 BADGE_I18N_KEYS 中 → 直接原樣輸出
 *  - 中文詞（如 '前端開發'）→ 取對應 i18n key → 渲染時依當前語系顯示
 */
function resolveBadgeDisplay(label) {
  if (label === CLIENT_PROJECT_BADGE) {
    const text = resolveClientBadgeLabel();
    return `<span data-i18n="work.badge.clientProject">${text}</span>`;
  }
  const i18nKey = BADGE_I18N_KEYS[label];
  if (i18nKey) {
    const i18n = getI18n();
    const text = i18n ? i18n.t(i18nKey, label) : label;
    return `<span data-i18n="${i18nKey}">${text}</span>`;
  }
  return label;
}

function createPortfolioWorkCard(work, index) {
  const col = document.createElement('div');
  col.className = 'col-md-4';
  col.dataset.aos = 'fade-up';
  col.dataset.aosDelay = String(100 + (index % 3) * 100);

  const thumbnails = (work.thumbnails || [])
    .map((src, thumbnailIndex) => `<img src="${src}" class="thumbnail" alt="縮圖${thumbnailIndex + 1}" loading="lazy" decoding="async">`)
    .join('');

  const useContain = work.contain !== false;
  const imageClass = `img-fluid main-image${useContain ? ' main-image--contain' : ''}`;
  const containerExtra = work.imageContainerClass ? ` ${work.imageContainerClass}` : '';
  const thumbnailHtml = thumbnails
    ? `<div class="thumbnail-container">${thumbnails}</div>`
    : '';
  const categoryFallback = work.displayCategory || work.tradeCategory || work.filterGroup || '';
  const categoryHtml = work.showCategory
    ? `<p class="work-category">${wrapI18n(work.categoryI18nKey, categoryFallback)}</p>`
    : '';
  const cardBadges = resolveCardBadges(work);
  const badgesHtml = cardBadges.length
    ? `<div class="work-badges">${cardBadges.map((label) => {
      const isClient = label === CLIENT_PROJECT_BADGE;
      const modifier = isClient ? ' work-badge--client' : '';
      return `<span class="work-badge${modifier}">${resolveBadgeDisplay(label)}</span>`;
    }).join('')}</div>`
    : '';

  const titleHtml = wrapI18n(work.titleI18nKey, work.title);

  col.innerHTML = `
    <a href="${work.href}" class="text-decoration-none">
      <div class="work-card">
        <div class="work-image-container${containerExtra}">
          <img src="${work.image}" class="${imageClass}" alt="${work.alt || work.title}" loading="lazy" decoding="async">
          ${thumbnailHtml}
        </div>
        <div class="work-info mt-3">
          <h6 class="work-title">${titleHtml}</h6>
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
