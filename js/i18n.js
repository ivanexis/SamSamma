/**
 * i18n.js · 純 URL Query 路由 + 內部 href 自動補 lang
 * ─────────────────────────────────────────────────────────────────
 * 設計理念：URL 決定一切。訪客進站時 URL 帶 ?lang=zh → 中文，
 *           無參數或其他值 → 英文預設。
 *           訪客若想看另一語言，請使用瀏覽器內建翻譯（Google 翻譯等）。
 *
 * 不提供：手動切換按鈕、localStorage 記憶、setLang/toggleLang API。
 *         （投放網址直接帶 ?lang=zh 即可決定整段瀏覽路徑的語言。）
 *
 * 載入策略：
 *   1. 此檔案必須在所有依賴 i18n 的渲染腳本（work-detail-data.js,
 *      works-web-design.js 等）之前載入，但翻譯動作在 DOMContentLoaded
 *      事件中執行。
 *   2. 暴露在 window.I18N 命名空間下。
 *
 * 公開 API：
 *   window.I18N.currentLang             // 'en' | 'zh'（唯讀）
 *   window.I18N.t(key, fallback)        // 取字串
 *   window.I18N.applyDom()              // 將 data-i18n 標記元素翻譯
 *   window.I18N.rewriteInternalHrefs()  // 內部 <a> 自動補當前 lang query
 */

(function () {
  'use strict';

  const SUPPORTED = ['en', 'zh'];
  const DEFAULT_LANG = 'en';

  /* ─────────── 翻譯字典 ─────────── */
  const translations = {
    /* ===== Navbar / 全站共用 ===== */
    'nav.home': { en: 'Home', zh: '首頁' },
    'nav.about': { en: 'About', zh: '關於我' },
    'nav.contact': { en: 'Contact', zh: '聯絡我' },
    'nav.cases': { en: 'Portfolio', zh: '作品集' },

    /* ===== cases.html · Hero ===== */
    'cases.hero.h1': {
      en: 'Selected Web Cases',
      zh: '精選網頁實績集'
    },
    'cases.hero.lead': {
      en: '21 commercial web Hi-Fi delivery drafts. Visuals are anonymized; full files and shareable live references available by email.',
      zh: '21 件商業網頁 Hi-Fi 交付樣稿；視覺已去識別化，完整稿與可公開之參考站請來信索取。'
    },
    'cases.metric.cases.label': { en: 'Hi-Fi Cases', zh: 'Hi-Fi 交付樣稿' },
    'cases.metric.industries.label': { en: 'Industries', zh: '產業類別' },
    'cases.metric.delivery.label': {
      en: 'Direct Hi-Fi Delivery',
      zh: '高保真直接交付'
    },

    /* ===== cases.html · Section ===== */
    'cases.backLink': { en: '← Back to Portfolio', zh: '← 回到主作品集' },
    'cases.subtitle': {
      en: 'All Web Cases · 21 Hi-Fi Deliveries',
      zh: '全部網頁案例 · 21 件 Hi-Fi 交付樣稿'
    },
    'cases.filterAria': { en: 'Case category filter', zh: '作品分類篩選' },

    /* ===== cases.html · Filter Chips ===== */
    'filter.all': { en: 'All', zh: '全部' },
    'filter.ecommerce': {
      en: 'E-commerce & Brand Marketing',
      zh: '電商與品牌行銷'
    },
    'filter.techBiomed': {
      en: 'Tech & BioMed Systems',
      zh: '科技與生醫系統'
    },
    'filter.spatialEdu': {
      en: 'Spatial, Real Estate & Education',
      zh: '空間地產與文教'
    },

    /* ===== cases.html · Trust ===== */
    'cases.trust': {
      en: 'Image assets have been substituted to respect client IP; technical execution and design process remain original. Full Figma files, component specs, and screen recordings are available upon request.',
      zh: '圖片素材已抽換以尊重業主資產，技術與設計流程為原始版本。如需查看完整 Figma 設計檔、原始切版過程或螢幕錄影，歡迎來信索取。'
    },

    /* ===== cases.html · Contact Section ===== */
    'contact.h2': { en: 'Get in Touch', zh: '聯絡我' },
    'contact.lead': {
      en: 'Looking for the full Figma Hi-Fi files, component specs, or screen recordings? Or want to discuss collaboration? Drop a message below — I respond within 24 hours.',
      zh: '想看完整 Figma 高保真設計檔、元件規範或螢幕錄影？或聊聊未來合作？歡迎透過下方表單留言，我會在 24 小時內回覆。'
    },
    'contact.form.name': { en: 'Name', zh: '姓名' },
    'contact.form.email': { en: 'Email', zh: '電子郵件' },
    'contact.form.message': { en: 'Message', zh: '留言內容' },
    'contact.form.messagePlaceholder': {
      en: 'Which Figma case to request, collaboration brief, or anything else…',
      zh: '想索取的 Figma 案、合作需求或其他訊息...'
    },
    'contact.form.submit': { en: 'Send Message', zh: '發送訊息' },
    'contact.form.success': {
      en: 'Message sent. I will reply to your email shortly.',
      zh: '訊息已送出，我會盡快回覆您的 Email。'
    },
    'contact.form.error': {
      en: 'Submission failed. Please try again later or email me directly at jeff11051212@gmail.com.',
      zh: '送出失敗，請稍後再試或直接寄信至 jeff11051212@gmail.com。'
    },
    'contact.aria.github': { en: 'GitHub', zh: 'GitHub' },
    'contact.aria.linkedin': {
      en: 'LinkedIn profile',
      zh: 'LinkedIn 個人頁面'
    },
    'contact.aria.email': { en: 'Email', zh: 'Email' },

    /* ===== Work Card · Title (依業種推導 / 共用 8 業種) ===== */
    'work.title.shopping': { en: 'E-commerce Storefront', zh: '購物網站' },
    'work.title.interior': { en: 'Interior Design Studio', zh: '室內設計網站' },
    'work.title.education': { en: 'Education Platform', zh: '教育網站' },
    'work.title.marketing': { en: 'Marketing Landing Page', zh: '行銷網站' },
    'work.title.housing': { en: 'Real Estate (PropTech)', zh: '房屋網站' },
    'work.title.medical': { en: 'HealthTech Site', zh: '醫療網站' },
    'work.title.tech': { en: 'Enterprise Tech Site', zh: '科技網站' },
    'work.title.advertising': { en: 'Brand Campaign', zh: '廣告網站' },

    /* ===== Work Card · displayCategory (副標小字) ===== */
    'work.cat.shopping': { en: 'E-commerce', zh: '購物' },
    'work.cat.interior': { en: 'Interior Design', zh: '室內設計' },
    'work.cat.education': { en: 'Education', zh: '教育' },
    'work.cat.marketing': { en: 'Marketing', zh: '行銷' },
    'work.cat.housing': { en: 'Real Estate', zh: '房屋' },
    'work.cat.medical': { en: 'HealthTech', zh: '醫療' },
    'work.cat.tech': { en: 'Tech', zh: '科技' },
    'work.cat.advertising': { en: 'Advertising', zh: '廣告' },
    'work.cat.webDesign': { en: 'Web Design', zh: '網站設計' },

    /* ===== Work Card · 靜態三件 (山莎蔓岸 / 本網站 / JF) ===== */
    'work.title.samsamma': {
      en: 'SamSamma Bamboo Industry Co-op',
      zh: '山莎蔓岸竹炭合作社'
    },
    'work.title.thisSite': {
      en: 'Live Portfolio Build',
      zh: '本網站'
    },
    'work.title.jfSwing': {
      en: 'JF SWING Dance',
      zh: 'JF SWING Dance'
    },

    /* ===== Work Card · Badge ===== */
    'work.badge.clientProject': {
      en: 'Live Client Project',
      zh: '實際商案'
    },

    /* ===== index.html · Filter Chip（首頁網站設計 3 大分類）===== */
    'filter.indexEcom': { en: 'E-commerce', zh: '電商交易' },
    'filter.indexCorp': { en: 'Corporate Sites', zh: '企業官網' },
    'filter.indexSpecial': { en: 'Featured Work', zh: '特色作品' },

    /* ===== Work Card · Badge（作品技能標籤）===== */
    'badge.frontendDev': { en: 'Frontend Development', zh: '前端開發' },
    'badge.frontend': { en: 'Frontend', zh: '前端' },
    'badge.backend': { en: 'Backend', zh: '後端' },
    'badge.googleApi': { en: 'Google API Integration', zh: 'Google API 整合' },
    'badge.autoReservation': { en: 'Automated Reservation System', zh: '自動化預約系統' },
    'badge.projectMgmt': { en: 'Project Management', zh: '專案管理' },
    'badge.graphicDesign': { en: 'Graphic Design', zh: '平面設計' },

    /* ===== index.html · Hero ===== */
    'home.hero.scrollDown': { en: 'Scroll Down', zh: '向下滾動' },

    /* ===== index.html · About ===== */
    'home.about.h1': {
      en: 'Crafting boundless beauty — where soul awakens through design.',
      zh: '創作無界之美，讓靈魂在美之中覺醒。'
    },
    'home.about.name': { en: 'Ivan Zhao', zh: '趙冠柏 Guan-Bo' },
    'home.about.role1': {
      en: '— Product-Minded Design Engineer',
      zh: '— Technical PM / 數位轉型 PM'
    },
    'home.about.role2': {
      en: '— IT Ops · Cathay General Hospital',
      zh: '— 國泰醫院資訊維運工程師'
    },
    'home.about.role3': {
      en: '— Co-founder · SamSamma Co-op',
      zh: '— 山莎蔓岸竹木產業合作社 共同創辦人'
    },
    'home.about.role4': {
      en: '— Spatial × Engineering Translator',
      zh: '— 景觀全局思維 × 工程邏輯 × 需求轉譯者'
    },
    'home.about.learnMore': { en: 'Learn More', zh: '了解更多' },
    'home.about.p1': {
      en: '1998 · New Taipei. Full-stack engineering × visual design × spatial planning — converging into requirements translation.',
      zh: '1998 年生，現居新北永和。兼具全端開發、視覺設計與景觀規劃背景，工作模式聚焦於「需求收斂與技術轉譯」。'
    },
    'home.about.p2': {
      en: 'Co-founded SamSamma Co-op for regional digital transformation, architecting a zero-server-cost reservation workflow. Concurrently shipped enterprise-grade backend at Cathay General Hospital — forging rigorous engineering discipline.',
      zh: '與族人共同創辦山莎蔓岸合作社，獨立打造零伺服器成本的自動化預約工作流；同時於國泰醫院負責正式後端維護與功能迭代，培養出嚴謹的工程邏輯。'
    },
    'home.about.p3': {
      en: 'Spatial thinking × place-branding × healthcare rigor — a Technical PM with engineering muscle and design empathy, precision-mapping technology to market.',
      zh: '融合景觀思維、創生執行力與醫療嚴謹性，兼具技術硬實力與設計同理心，成為精準對接技術與市場的 Technical PM。'
    },

    /* ===== index.html · Works ===== */
    'home.works.title': { en: 'Featured Works', zh: '作品列表' },
    'home.works.webDesign': { en: 'Web Design & Development', zh: '網站設計' },
    'home.works.localRevit': { en: 'Regional Transformation & Branding', zh: '地方創生' },
    'home.works.poster': { en: 'Visual & Brand Design', zh: '海報設計' },
    'home.works.viewAll': { en: 'Explore All 21 Commercial Cases', zh: '檢視全部 21 件商案' },

    /* ===== index.html · Skills ===== */
    'home.skills.title': { en: 'Technical Skills', zh: '技術能力' },

    /* ===== index.html · Parallax CTA ===== */
    'home.cta.h2': {
      en: 'Innovative Mindset · Engineering Mastery',
      zh: '創新思維，卓越技術'
    },
    'home.cta.lead': {
      en: 'Let\'s build the next immersive digital experience together.',
      zh: '讓我們一起創造下一個精彩的數位體驗'
    },
    'home.cta.btn': { en: 'Start Collaboration', zh: '開始合作' },

    /* ===== index.html · Contact 區 ===== */
    'home.contact.viewResume': { en: 'View Resume', zh: '查看履歷' },

    /* ===== pages/aboutme.html · 個人深度頁（獵頭友善英文版） ===== */
    'aboutPage.portfolioTitle': { en: 'About Me', zh: '關於我' },
    'aboutPage.name': { en: 'Ivan Zhao', zh: '趙冠柏 Guan-Bo' },
    'aboutPage.subtitle': {
      en: 'Design Engineer · Product-Minded Frontend ｜ Cross-disciplinary roots in landscape architecture × enterprise backend × place-based digital transformation ｜ Cathay General Hospital (1 yr production ops) → SamSamma Co-op Co-founder',
      zh: 'Technical PM / 數位轉型 PM｜景觀全局思維 × 工程邏輯 × 需求轉譯者｜國泰醫院後端首年實戰 → 山莎蔓岸共同創辦人'
    },
    'aboutPage.p1': {
      en: 'My career started in <strong>landscape architecture</strong>. During my undergraduate years at Fu Jen Catholic University, I worked on multiple rural community-development projects — going deep into the relationships between land, culture, and residents. The work spanned 2D plans, 3D modeling, and on-site result presentations, but the truly durable training was elsewhere: <strong>aligning residents, government officials, and designers around a single shared vision</strong>. That stakeholder-orchestration instinct became the foundation of everything I now do as a product person.',
      zh: '職涯的起點是<strong>景觀設計</strong>。輔仁大學景觀設計系期間，參與多個農村社區營造計畫，深入土地、文化與居民之間。從 2D 平面、3D 模型到現場成果展示，這段訓練養成的不只是設計能力，更是「<strong>如何讓居民、政府、設計師對同一份願景產生共鳴</strong>」── 這份「全局利害關係人思維」，後來成為做 PM 最核心的底層工具。'
    },
    'aboutPage.p2': {
      en: 'In those community projects I kept observing the same pattern: physical infrastructure kept improving, while the <strong>digital layer stagnated</strong>. That observation triggered a deliberate career pivot — first into UX/UI design, then into the <strong>III Cross-Domain Java Software Engineering Bootcamp (570 hours)</strong>, where I rebuilt my stack from language fundamentals through backend logic to database design. Not a hobby pivot. A full re-architecture of my career trajectory.',
      zh: '在社區規劃過程中觀察到一個現象：基礎設施逐步完善，資訊化建設卻明顯停滯。這種<strong>數位落差</strong>促成了第二次跳板 ── 先完成 UX/UI 設計班，再進入<strong>資策會跨域 Java 軟體工程師就業養成班（570 小時）</strong>，從基礎程式語言、後端邏輯到資料庫設計，逐步建立構建應用系統的核心能力。'
    },
    'aboutPage.p3': {
      en: 'In 2025 I joined <strong>Cathay General Hospital</strong> as an IT Operations Engineer (Assistant Developer), completing my first year on a real production environment. The takeaways were sharp: the gap between practice projects and live healthcare systems; cross-functional <strong>requirements scoping and technical translation</strong> between clinical and administrative teams; and a <strong>Legacy migration project moving core web systems from IE to Chrome / Edge</strong>, including UAT coordination and go-live. This year forged what I consider the most critical Technical PM muscle: <strong>engineering rigor</strong> — the ability to scope MVP slices in language engineers actually respect.',
      zh: '2025 年進入<strong>國泰世華總醫院</strong>擔任資訊維運工程師（助理程式師），完成第一年正職實戰。這一年具體沉澱出對「生產系統」與「練習專案」的差距感：問卷／表單類功能的迭代與訪談、醫療與行政單位的<strong>需求收斂與技術轉譯</strong>、核心 Web 系統由 <strong>IE 遷移到 Chrome／Edge</strong> 的 Legacy 升級專案、跨部門溝通與 UAT 上線。這段大型醫療系統的維運經驗，培養出 Technical PM 最重要的「<strong>嚴謹的工程邏輯</strong>」── 在團隊內用工程師聽得懂的語言進行精準的 MVP 範疇切片。'
    },
    'aboutPage.p4': {
      en: 'In parallel, I co-founded <strong>SamSamma Bamboo Industry Co-op</strong> with Saisiyat indigenous community members, serving as Digital Transformation PM and solo frontend builder. My role: <strong>converting scattered field notes, academic site-visit photos, and ethnographic material into a clean, structured digital content architecture</strong>. To solve the real-world constraint that rural co-ops can\'t afford a full-time engineering team, I independently <strong>architected a zero-server-cost automated reservation workflow</strong> — fully replacing manual phone bookings. In a multi-stakeholder environment, I became the bridge: translating team consensus into concrete technical specs.',
      zh: '與醫院實務並行，與賽夏族族人共同創辦<strong>山莎蔓岸竹木產業生產合作社</strong>，擔任數位轉型 PM 兼前端開發者。職責是把現場零散的活動紀錄、學術訪視照片與田野素材，<strong>結構化為清晰的數位內容架構</strong>；同時針對偏鄉沒有預算養工程師的真實痛點，獨立打造<strong>零伺服器成本的自動化預約工作流</strong>，取代傳統人工電話登錄。在多方協作的環境中擔任溝通橋樑，把團隊共識轉譯為清晰的技術規格。'
    },
    'aboutPage.p5': {
      en: 'Spatial thinking from landscape design, execution discipline from place-branding, and healthcare-grade rigor — converging into what I am now: <strong>a Technical PM precision-mapping technology to market</strong>. In an era where AI has democratized the act of <em>writing code</em>, the truly scarce skill has shifted from <em>coding</em> to <strong>converging messy requirements into the right specs</strong>. I don\'t pitch undeliverable visions; I build the bridge between technology and business. <strong>If you\'re looking for someone who can align seamlessly with your engineering team — let\'s talk.</strong>',
      zh: '融合景觀全局思維、創生執行力與醫療嚴謹性，兼具技術硬實力與設計同理心 ── 這就是我現在的職涯定位：<strong>一位精準對接技術與市場的 Technical PM</strong>。在 AI 把「把東西做出來」的門檻民主化之後，市場真正稀缺的能力，已經從「寫代碼」轉為「<strong>把複雜需求收斂成正確的規格</strong>」。我不擅長畫無法落地的商業大餅，但擅長成為技術與業務之間的橋樑 ── 如果你正在找一位能與工程師無縫對齊的夥伴，期待與你聊聊。'
    },

    /* ===== WebDesign.html · 商案詳情（全 21 件共用） ===== */
    'workDetail.disclosure': {
      en: 'This page presents anonymized Hi-Fi deliverables from <strong>commercial web projects I actually contributed to</strong>. Live client URLs and original brand assets are <strong>not published here</strong> due to intellectual property and confidentiality. Full design files, process artifacts, and shareable references are available on request — <a href="../index.html#contact">contact me</a> or email <a href="mailto:jeff11051212@gmail.com">jeff11051212@gmail.com</a>.',
      zh: '本頁展示我<strong>實際參與</strong>之商業網頁 Hi-Fi 交付成果，畫面已去識別化。因<strong>智慧財產權與客戶保密</strong>，正式上線網址與原始品牌素材不在此公開。完整設計稿、製作流程與可對外提供之參考站，請<a href="../index.html#contact">聯絡我</a>或來信 <a href="mailto:jeff11051212@gmail.com">jeff11051212@gmail.com</a> 索取。'
    },
    'workDetail.disclosureShort': {
      en: 'Screens below are anonymized Hi-Fi drafts — not the client\'s current live website.',
      zh: '以下截圖為去識別化 Hi-Fi 樣稿，不代表客戶現行上線網站。'
    },
    'workDetail.insidePages.title': { en: 'Inside Pages', zh: '內頁展示' },
    'workDetail.insidePages.desc1': {
      en: 'Representative screens showing information architecture, layout rhythm, and interaction details.',
      zh: '挑選作品中具代表性的內頁，呈現資訊架構、版面節奏與互動細節。'
    },
    'workDetail.insidePages.desc2': {
      en: 'Use the browser mockup on the right to scroll full-length captures; switch pages with the chips below.',
      zh: '右側模擬瀏覽器視窗，可滾動瀏覽完整長截圖；下方按鈕可切換不同頁面。'
    },
    'workDetail.inquiryBtn': { en: 'Request Full Files', zh: '索取完整稿件' },
    'workDetail.relatedTitle': { en: 'More Works', zh: '瀏覽更多作品' },
    'workDetail.colorPlanTitle': { en: 'Color System', zh: '色彩計畫' },

    /* ===== webdetail.html · Deep Dive Note (英文模式下的禮貌性提示) ===== */
    'deepDive.note': {
      en: 'Note: This deep dive is documented in Traditional Chinese to preserve engineering nuance. Core architecture, library names, and technical terms remain in English — you may use your browser\'s built-in translation (e.g., Google Translate) if needed.',
      zh: '※ 本技術深度敘事採用繁體中文撰寫以保留工程語境的精準度，核心系統架構與技術術語維持英文標準。'
    },

    /* ===== Footer ===== */
    'footer.about.title': { en: 'About', zh: '關於我' },
    'footer.about.text': {
      en: 'Committed to delivering innovative technical solutions, specializing in web development and user experience design.',
      zh: '致力於提供創新的技術解決方案，專注於網頁開發與使用者體驗設計。'
    },
    'footer.links.title': { en: 'Quick Links', zh: '快速連結' },
    'footer.links.about': { en: 'About', zh: '關於我' },
    'footer.links.works': { en: 'Portfolio', zh: '作品集' },
    'footer.links.contact': { en: 'Contact', zh: '聯絡方式' },
    'footer.follow.title': { en: 'Follow', zh: '追蹤我' },
    'footer.copyright': {
      en: 'Designed and developed by Ivan Zhao. All rights reserved.',
      zh: '本網站由 Ivan Zhao 親自設計撰寫並保留所有權利。'
    }
  };

  /* ─────────── 初始化：純讀 URL ?lang= ─────────── */
  function detectInitialLang() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('lang');
    if (fromUrl && SUPPORTED.includes(fromUrl)) return fromUrl;
    return DEFAULT_LANG;
  }

  const currentLang = detectInitialLang();

  /* ─────────── 取字串 ─────────── */
  function t(key, fallback) {
    const entry = translations[key];
    if (!entry) return fallback != null ? fallback : key;
    return entry[currentLang] || entry[DEFAULT_LANG] || (fallback != null ? fallback : key);
  }

  /* ─────────── 翻譯 DOM（data-i18n / data-i18n-attr）─────────── */
  function applyDom() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      // 格式：data-i18n-attr="placeholder:contact.form.messagePlaceholder,title:nav.cases"
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    // <html lang> 同步
    document.documentElement.setAttribute('lang', currentLang === 'zh' ? 'zh-TW' : 'en');
  }

  /* ─────────── 內部連結自動補當前 lang query ─────────── */
  function rewriteInternalHrefs() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      // 語言切換鈕：保留自身指定的 ?lang，不被覆寫
      if (anchor.hasAttribute('data-i18n-skip') || anchor.closest('.lang-switch')) return;
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('#')) return; // 純錨點不動

      const hashIdx = href.indexOf('#');
      const queryIdx = href.indexOf('?');
      const base = queryIdx !== -1 ? href.slice(0, queryIdx) : (hashIdx !== -1 ? href.slice(0, hashIdx) : href);
      const queryStr = queryIdx !== -1 ? href.slice(queryIdx + 1, hashIdx !== -1 ? hashIdx : undefined) : '';
      const hashStr = hashIdx !== -1 ? href.slice(hashIdx) : '';

      const params = new URLSearchParams(queryStr);
      params.set('lang', currentLang);
      anchor.setAttribute('href', `${base}?${params.toString()}${hashStr}`);
    });
  }

  /* ─────────── 對外暴露 ─────────── */
  window.I18N = {
    get currentLang() { return currentLang; },
    SUPPORTED,
    DEFAULT_LANG,
    t,
    applyDom,
    rewriteInternalHrefs
  };

  /* ─────────── 自動執行 ─────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyDom();
      rewriteInternalHrefs();
    });
  } else {
    applyDom();
    rewriteInternalHrefs();
  }
})();
