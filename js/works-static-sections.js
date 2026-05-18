/** 地方創生、海報設計 — 與網站設計區共用圖卡樣式 */
const localRevitalizationWorks = [
  {
    title: '山莎蔓岸竹炭合作社',
    href: 'pages/sa.html',
    image: 'images/初步構想圖.jpg',
    alt: '山莎蔓岸竹炭合作社園區初步構想圖',
    imageContainerClass: 'work-image-container--concept',
    contain: true,
    badges: ['Web UI/UX', '前端開發', 'Google API 整合', '自動化預約系統'],
    clientProject: false
  },
  {
    title: '大北坑社區故事書',
    href: 'pages/book1.html',
    image: 'images/book1-0.png',
    alt: '大北坑社區故事書',
    thumbnails: ['images/book1-1.png', 'images/book1-2.png', 'images/book1-3.png'],
    contain: true,
    badges: ['專案管理', '平面設計'],
    clientProject: false
  },
  {
    title: '創生 • 帝那度',
    href: 'pages/book2.html',
    image: 'images/book2-1.png',
    alt: '創生 • 帝那度',
    contain: true,
    badges: ['專案管理', '平面設計'],
    clientProject: false
  }
];

const posterDesignWorks = [
  {
    title: '職涯講座 - 返創人生',
    href: 'pages/Poster1.html',
    image: 'images/poster1.png',
    alt: '職涯講座 - 返創人生',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  },
  {
    title: '110年度工作會議暨原力培力',
    href: 'pages/Poster2.html',
    image: 'images/poster2.png',
    alt: '110年度工作會議暨原力培力',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  },
  {
    title: '職涯講座 - 不急夫妻返創人生',
    href: 'pages/Poster3.html',
    image: 'images/poster3.png',
    alt: '職涯講座 - 不急夫妻返創人生',
    contain: true,
    badges: ['平面設計'],
    clientProject: false
  },
  {
    title: '文鄉思起 - 創聚在三峽',
    href: 'pages/Poster4.html',
    image: 'images/poster4.png',
    alt: '文鄉思起 - 創聚在三峽',
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
