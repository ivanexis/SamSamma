/** 首頁「網站設計」區：v2 分類重構（8 業種 → 3 類）
 *  變更原因：v1「電子商務／品牌／數位產品」混用商業模式與業種維度，
 *           面試官追問會破功（例：行銷不是真電商）。
 *  v2 改採「業種純化」3 類：電商交易 / 企業官網 / 特色作品。
 */
const webDesignFilterCategories = [
  '電商交易',
  '企業官網',
  '特色作品'
];

/** 作品 trade 分類（卡片副標）→ 篩選 chip
 *  v2：購物 = 真電商；行銷/廣告/醫療/科技/房屋/室內 = 企業官網；
 *      教育/數位互動/網站設計 = 特色作品（含本網站、JF、山莎蔓岸）
 */
const categoryToFilterGroup = {
  購物: '電商交易',
  行銷: '企業官網',
  廣告: '企業官網',
  科技: '企業官網',
  醫療: '企業官網',
  房屋: '企業官網',
  室內設計: '企業官網',
  室內: '企業官網',
  教育: '特色作品',
  數位互動: '特色作品',
  網站設計: '特色作品'
};

const webDesignCategoryByFolder = {
  1: '購物',
  2: '室內設計',
  3: '教育',
  4: '行銷',
  5: '房屋',
  6: '醫療',
  7: '科技',
  8: '廣告'
};

/** 業種中文 → i18n key 對應（給卡片 title / displayCategory 用） */
const tradeCategoryToTitleKey = {
  購物: 'work.title.shopping',
  室內設計: 'work.title.interior',
  室內: 'work.title.interior',
  教育: 'work.title.education',
  行銷: 'work.title.marketing',
  房屋: 'work.title.housing',
  醫療: 'work.title.medical',
  科技: 'work.title.tech',
  廣告: 'work.title.advertising'
};
const tradeCategoryToCategoryKey = {
  購物: 'work.cat.shopping',
  室內設計: 'work.cat.interior',
  室內: 'work.cat.interior',
  教育: 'work.cat.education',
  行銷: 'work.cat.marketing',
  房屋: 'work.cat.housing',
  醫療: 'work.cat.medical',
  科技: 'work.cat.tech',
  廣告: 'work.cat.advertising',
  網站設計: 'work.cat.webDesign'
};

/** cases.html 專用：依業種歸納的 3 大產業群（21 件總攬）
 *  與 index.html 的 webDesignFilterCategories 獨立，不互相干擾。
 *  策略動機：依「商業屬性 + 產業群」維度切割，比首頁的「商業模式」更
 *           精準（電商與行銷同屬流量轉換、科技醫療同屬系統設計、
 *           空間地產文教同屬實體服務數位化）。
 *  件數規劃：電商與品牌行銷 8（購物3+行銷3+廣告2）
 *           科技與生醫系統 6（科技3+醫療3）
 *           空間地產與文教 7（房屋2+室內設計3+教育2）
 *           合計 21 件
 */
const casesFilterCategories = [
  '電商與品牌行銷',
  '科技與生醫系統',
  '空間地產與文教'
];

const casesCategoryToFilterGroup = {
  購物: '電商與品牌行銷',
  行銷: '電商與品牌行銷',
  廣告: '電商與品牌行銷',
  科技: '科技與生醫系統',
  醫療: '科技與生醫系統',
  房屋: '空間地產與文教',
  室內設計: '空間地產與文教',
  室內: '空間地產與文教',
  教育: '空間地產與文教'
};

function resolveCasesFilterGroup(work) {
  return (
    casesCategoryToFilterGroup[work.tradeCategory]
    || casesCategoryToFilterGroup[work.displayCategory]
    || '電商與品牌行銷'
  );
}

function resolveFilterGroup(work, tradeCategory, displayCategory) {
  if (work.filterGroup) return work.filterGroup;

  return (
    categoryToFilterGroup[displayCategory]
    || categoryToFilterGroup[tradeCategory]
    || '特色作品'
  );
}

function normalizeTradeCategory(category) {
  if (category === '室內') return '室內設計';
  return category;
}

const staticWebDesignWorks = [
  {
    title: '山莎蔓岸竹炭合作社',
    titleI18nKey: 'work.title.samsamma',
    filterGroup: '特色作品',
    href: 'pages/SamSamma.html',
    image: 'images/saa.webp',
    alt: '山莎蔓岸竹炭合作社園區初步構想圖',
    imageContainerClass: 'work-image-container--concept',
    contain: false,
    badges: ['Web UI/UX', '前端開發', 'Google API 整合', '自動化預約系統'],
    clientProject: false,
    showCategory: false,
    showInAll: true,
    allOrder: 0,
    sortOrder: 1
  },
  {
    title: '本網站',
    titleI18nKey: 'work.title.thisSite',
    filterGroup: '特色作品',
    href: 'pages/webdetail.html',
    image: 'images/web1-0.webp',
    alt: '本網站作品集',
    thumbnails: ['images/web1-1.webp', 'images/web1-2.webp', 'images/web1-3.webp'],
    badges: ['Web UI/UX', '前端開發'],
    clientProject: false,
    showCategory: false,
    showInAll: true,
    allOrder: 1,
    hideInCategory: true,
    sortOrder: 2
  },
  {
    title: 'JF SWING Dance',
    titleI18nKey: 'work.title.jfSwing',
    filterGroup: '特色作品',
    href: 'pages/Jf.html',
    image: 'images/JFSWING.webp',
    alt: 'JF SWING Dance',
    thumbnails: ['images/10.webp', 'images/11.webp', 'images/01.webp'],
    badges: ['Web UI/UX', '前端', '後端'],
    clientProject: false,
    showCategory: false,
    showInAll: false,
    sortOrder: 910
  }
];

function normalizeIndexPath(path) {
  return path.replace(/^\.\.\//, '');
}

function getDetailImagePath(work) {
  const image = work.cardImage || work.hero;
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) return image;
  if (image.startsWith('../')) return normalizeIndexPath(image);

  return `${normalizeIndexPath(work.basePath)}/${image}`;
}

function createWorkFromDetail(id, work) {
  const match = id.match(/^web-design-(\d+)-(\d+)$/);
  const folderOrder = match ? Number(match[1]) : 99;
  const itemOrder = match ? Number(match[2]) : 99;
  const tradeCategory = normalizeTradeCategory(
    work.listCategory || webDesignCategoryByFolder[folderOrder] || work.displayCategory || work.category
  );
  const displayCategory = work.displayCategory || tradeCategory;
  const filterGroup = resolveFilterGroup(work, tradeCategory, displayCategory);

  return {
    title: window.PortfolioCard.formatCardTitle(work),
    titleI18nKey: tradeCategoryToTitleKey[tradeCategory] || null,
    categoryI18nKey: tradeCategoryToCategoryKey[displayCategory] || tradeCategoryToCategoryKey[tradeCategory] || null,
    tradeCategory,
    filterGroup,
    displayCategory,
    href: `pages/WebDesign.html?id=${id}`,
    image: getDetailImagePath(work),
    alt: work.heroAlt || work.title,
    contain: work.contain !== false,
    badges: window.PortfolioCard.resolveCardBadges(work),
    showCategory: work.showCategory === true,
    clientProject: work.clientProject !== false,
    showInAll: work.showInAll ?? itemOrder === 1,
    allOrder: work.allOrder ?? folderOrder + 1,
    sortOrder: folderOrder * 10 + itemOrder
  };
}

function getWebDesignWorks() {
  const detailWorks = Object.entries(window.portfolioWorkDetails || {})
    .filter(([id]) => id.startsWith('web-design-'))
    .map(([id, work]) => createWorkFromDetail(id, work))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return [...staticWebDesignWorks, ...detailWorks].sort((a, b) => a.sortOrder - b.sortOrder);
}

function createFilterButton({ label, filter, active = false, i18nKey = null }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `works-filter-chip${active ? ' active' : ''}`;
  button.dataset.filter = filter;
  button.setAttribute('aria-selected', active ? 'true' : 'false');
  if (i18nKey) {
    button.setAttribute('data-i18n', i18nKey);
    const i18n = (typeof window !== 'undefined') ? window.I18N : null;
    button.textContent = i18n ? i18n.t(i18nKey, label) : label;
  } else {
    button.textContent = label;
  }
  return button;
}

/** filter group 中文 → i18n key（cases.html 用）*/
const casesFilterI18nKeys = {
  '電商與品牌行銷': 'filter.ecommerce',
  '科技與生醫系統': 'filter.techBiomed',
  '空間地產與文教': 'filter.spatialEdu'
};

/** filter group 中文 → i18n key（index.html 首頁網站設計區用）*/
const webDesignFilterI18nKeys = {
  '電商交易': 'filter.indexEcom',
  '企業官網': 'filter.indexCorp',
  '特色作品': 'filter.indexSpecial'
};

function getVisibleWorks(filter) {
  const webDesignWorks = getWebDesignWorks();

  if (filter === 'all') {
    return webDesignWorks
      .filter((work) => work.showInAll)
      .sort((a, b) => a.allOrder - b.allOrder)
      .slice(0, 9);
  }

  return webDesignWorks.filter(
    (work) => work.filterGroup === filter && !work.hideInCategory
  );
}

function renderWorks(row, filter) {
  row.replaceChildren();
  getVisibleWorks(filter).forEach((work, index) => {
    row.appendChild(window.PortfolioCard.createPortfolioWorkCard(work, index));
  });

  if (typeof AOS !== 'undefined') AOS.refresh();
}

function initWebDesignWorks() {
  const filters = document.getElementById('works-web-design-filters');
  const row = document.getElementById('works-web-design-row');
  if (!filters || !row) return;

  const buttons = [
    createFilterButton({ label: '全部', filter: 'all', active: true, i18nKey: 'filter.all' }),
    ...webDesignFilterCategories.map((category) => createFilterButton({
      label: category,
      filter: category,
      i18nKey: webDesignFilterI18nKeys[category] || null
    }))
  ];

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      renderWorks(row, button.dataset.filter);
    });

    filters.appendChild(button);
  });

  renderWorks(row, 'all');
}

/** cases.html 專用：拿全部 21 件 web-design-X-X 接案（不含山莎蔓岸/本網站/JF）
 *  與首頁 9 件邏輯獨立，避免互相影響。
 *  重點：重新計算 filterGroup 為 casesCategoryToFilterGroup 的 3 大產業群，
 *       覆蓋 createWorkFromDetail 內預設的 webDesign 3 分類。
 */
function getAllCasesWorks(filter) {
  const detailWorks = Object.entries(window.portfolioWorkDetails || {})
    .filter(([id]) => id.startsWith('web-design-'))
    .map(([id, work]) => {
      const baseWork = createWorkFromDetail(id, work);
      return {
        ...baseWork,
        filterGroup: resolveCasesFilterGroup(baseWork)
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (filter === 'all') return detailWorks;
  return detailWorks.filter((work) => work.filterGroup === filter);
}

function renderAllCases(row, filter) {
  row.replaceChildren();
  getAllCasesWorks(filter).forEach((work, index) => {
    row.appendChild(window.PortfolioCard.createPortfolioWorkCard(work, index));
  });

  if (typeof AOS !== 'undefined') AOS.refresh();
}

function initAllCasesView() {
  const filters = document.getElementById('works-all-cases-filters');
  const row = document.getElementById('works-all-cases-row');
  if (!filters || !row) return;

  const buttons = [
    createFilterButton({ label: '全部', filter: 'all', active: true, i18nKey: 'filter.all' }),
    ...casesFilterCategories.map((category) => createFilterButton({
      label: category,
      filter: category,
      i18nKey: casesFilterI18nKeys[category] || null
    }))
  ];

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      renderAllCases(row, button.dataset.filter);
    });

    filters.appendChild(button);
  });

  renderAllCases(row, 'all');

  /* 卡片內 <span data-i18n=...> 由 i18n.applyDom() 在 DOMContentLoaded 階段
   * 統一翻譯。語系由 URL ?lang= 進站時決定，不支援頁中切換。
   */
}

document.addEventListener('DOMContentLoaded', () => {
  initWebDesignWorks();
  initAllCasesView();
});
