/** 首頁「網站設計」區：四大商業場景篩選 */
const webDesignFilterCategories = [
  '電子商務',
  '品牌與企業形象',
  '數位產品與互動'
];

/** 作品 trade 分類（卡片副標）→ 篩選 chip */
const categoryToFilterGroup = {
  購物: '電子商務',
  行銷: '電子商務',
  廣告: '電子商務',
  科技: '品牌與企業形象',
  醫療: '品牌與企業形象',
  房屋: '品牌與企業形象',
  室內設計: '品牌與企業形象',
  室內: '品牌與企業形象',
  教育: '數位產品與互動',
  數位互動: '數位產品與互動',
  網站設計: '數位產品與互動'
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

function resolveFilterGroup(work, tradeCategory, displayCategory) {
  if (work.filterGroup) return work.filterGroup;

  return (
    categoryToFilterGroup[displayCategory]
    || categoryToFilterGroup[tradeCategory]
    || '數位產品與互動'
  );
}

function normalizeTradeCategory(category) {
  if (category === '室內') return '室內設計';
  return category;
}

const staticWebDesignWorks = [
  {
    title: '本網站',
    filterGroup: '數位產品與互動',
    href: 'pages/webdetail.html',
    image: 'images/web1-0.png',
    alt: '本網站作品集',
    thumbnails: ['images/web1-1.png', 'images/web1-2.png', 'images/web1-3.png'],
    badges: ['Web UI/UX', '前端開發'],
    clientProject: false,
    showCategory: false,
    showInAll: true,
    allOrder: 1,
    sortOrder: 5
  },
  {
    title: 'JF SWING Dance',
    filterGroup: '數位產品與互動',
    href: 'pages/Jf.html',
    image: 'images/JFSWING.png',
    alt: 'JF SWING Dance',
    thumbnails: ['images/10.jpg', 'images/11.jpg', 'images/01.jpg'],
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

function createFilterButton({ label, filter, active = false }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `works-filter-chip${active ? ' active' : ''}`;
  button.dataset.filter = filter;
  button.setAttribute('aria-selected', active ? 'true' : 'false');
  button.textContent = label;
  return button;
}

function getVisibleWorks(filter) {
  const webDesignWorks = getWebDesignWorks();

  if (filter === 'all') {
    return webDesignWorks
      .filter((work) => work.showInAll)
      .sort((a, b) => a.allOrder - b.allOrder);
  }

  return webDesignWorks.filter((work) => work.filterGroup === filter);
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
    createFilterButton({ label: '全部', filter: 'all', active: true }),
    ...webDesignFilterCategories.map((category) => createFilterButton({
      label: category,
      filter: category
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

document.addEventListener('DOMContentLoaded', initWebDesignWorks);
