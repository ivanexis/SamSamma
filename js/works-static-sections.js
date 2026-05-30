/** 地方創生、海報設計 — 與網站設計區共用圖卡樣式 */
const localRevitalizationWorks = [
  {
    title: '大北坑社區故事書',
    href: 'pages/book1.html',
    image: 'images/book1-0.webp',
    alt: '大北坑社區故事書',
    thumbnails: ['images/book1-1.webp', 'images/book1-2.webp', 'images/book1-3.webp'],
    imageContainerClass: 'work-image-container--natural',
    contain: true,
    badges: ['專案管理', '平面設計'],
    clientProject: false
  },
  {
    title: '創生 • 帝那度',
    href: 'pages/book2.html',
    image: 'images/book2-1.webp',
    alt: '創生 • 帝那度',
    imageContainerClass: 'work-image-container--natural',
    contain: true,
    badges: ['專案管理', '平面設計'],
    clientProject: false
  }
];

const posterDesignWorks = [
  {
    title: '職涯講座 - 返創人生',
    href: 'pages/Poster1.html',
    image: 'images/poster1.webp',
    alt: '職涯講座 - 返創人生',
    imageContainerClass: 'work-image-container--natural',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  },
  {
    title: '110年度工作會議暨原力培力',
    href: 'pages/Poster2.html',
    image: 'images/poster2.webp',
    alt: '110年度工作會議暨原力培力',
    imageContainerClass: 'work-image-container--natural',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  },
  {
    title: '職涯講座 - 不急夫妻返創人生',
    href: 'pages/Poster3.html',
    image: 'images/poster3.webp',
    alt: '職涯講座 - 不急夫妻返創人生',
    imageContainerClass: 'work-image-container--natural',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  },
  {
    title: '文鄉思起 - 創聚在三峽',
    href: 'pages/Poster4.html',
    image: 'images/poster4.webp',
    alt: '文鄉思起 - 創聚在三峽',
    imageContainerClass: 'work-image-container--natural',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  }
];

function initStaticPortfolioSections() {
  window.PortfolioCard.renderPortfolioWorkRow('works-local-revitalization-row', localRevitalizationWorks);
  window.PortfolioCard.renderPortfolioWorkRow('works-poster-row', posterDesignWorks);
}

document.addEventListener('DOMContentLoaded', initStaticPortfolioSections);
