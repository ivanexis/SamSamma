/**
 * Niwah Widget — 山莎蔓岸介紹頁的浮動策展式對話入口
 * ─────────────────────────────────────────────────────────────────
 * 設計決策（參見 Chatbot_PRD_v1.txt 第 8 章 Decision Log D-008）：
 *   從「自由對話 chatbot」→「策展式按鈕入口」
 *
 * 為什麼這樣設計：
 *   1. 真實使用者觀察：「我不知道要問什麼」是 chatbot 第一痛點
 *      → 改成 6 個按鈕，使用者不用想
 *   2. 成本：合作社還在申請經費，零 LLM token 消耗
 *      → 全靜態 Q&A，內容與頁面 FAQ section 同源
 *   3. UI mental model：使用者預期「右下角小圓圈點開」
 *      → 不是全頁 chat（全頁版保留在 /chatbot/ 給面試 demo）
 *   4. 漸進升級路徑：等合作社經費下來再開 LLM 模式
 *      → 此檔案只做 Phase 1.5（策展式），Phase 2+ 升級邏輯放 /chatbot/
 *
 * 整合方式（一行就好）：
 *   <script src="../chatbot/widget.js" defer></script>
 *
 * 零 dependency、不污染全域、不打 API、自動跟隨頁面 i18n
 */
(function () {
  'use strict';

  // ── 偵測語言（跟介紹頁 i18n 機制保持一致）─────────────────
  function getLang() {
    var d = document.documentElement;
    if (d.classList.contains('i18n-en')) return 'en';
    if (d.classList.contains('i18n-zh')) return 'zh';
    var p = new URLSearchParams(location.search).get('lang');
    return p === 'zh' ? 'zh' : 'en';
  }

  // ── 字串資源（雙語）──────────────────────────────────────
  // Decision Log D-011 (2026/06/06)：移除「方案 C 預約收集」
  // 理由：(1) 介紹頁本身已有透明 4 步驟預約流程，widget 再做一次反而重複
  //       (2) widget 定位應該回到「純回答機器人」，不要兼差銷售漏斗
  //       (3) prefill 跳轉只帶 plan，size/duration React 端未接 → 使用者進去
  //           還是要重來，反而比直接預約還差
  // 這是上線後第二次自我退回，與 D-008 同類：知道何時要退
  var T = {
    zh: {
      greeting: '我是 Niwah，賽夏語「紋路」。',
      sub: '把你常問的問題織得清楚一點。',
      ask: '有問題嗎？',
      pickOne: '點一個問題看看 ──',
      tryChat: '想多問？',
      tryChatLink: '試試對話版',
      mailLink: '寄 email',
      close: '收起來',
      back: '← 回問題列表',
      assistantName: 'Niwah · 山莎蔓岸 助理',
      footnote: '純靜態回答 · 零 token · 預約請至介紹頁底部 4 步驟'
    },
    en: {
      greeting: "I'm Niwah — Saisiyat for 'pattern'.",
      sub: 'Helping the most common questions land clearly.',
      ask: 'Got a question?',
      pickOne: 'Pick one to see the answer —',
      tryChat: 'Want to ask freely?',
      tryChatLink: 'Try the chat demo',
      mailLink: 'Send email',
      close: 'Close',
      back: '← Back to questions',
      assistantName: 'Niwah · SamSamma assistant',
      footnote: 'Static Q&A · zero tokens · for booking see the 4-step flow above'
    }
  };

  // ── 對外信箱（所有 mailto / fallback 引導使用這個常數）─────
  var CONTACT_EMAIL = 'ivanzhao.link@gmail.com';

  // ── FAQ 內容（與 index_SamSamma.html line 3667-3746 同源）──
  // 維護時兩邊請保持一致（Chatbot_PRD_v1.txt 第 9 章 SOP）
  var FAQ = [
    {
      zh: { q: '現在可以買竹炭嗎？',
            a: '目前竹炭產線還在升級（115-116 年高溫窯升級至 900-1000°C），預計 2027 年正式量產並開放預購。\n建設期間可預訂「企業 ESG 採購提案」，由合作社報價並安排首批。' },
      en: { q: 'Can I buy bamboo charcoal now?',
            a: 'The charcoal line is being upgraded (high-temp kiln raised to 900–1000°C in 2026–2027), full production and pre-orders expected in 2027.\nDuring construction, you can reserve a "corporate ESG procurement proposal".' }
    },
    {
      zh: { q: '可以隨時參觀基地嗎？',
            a: '基地仍在建設中，為了安全與導覽品質，所有參訪都需事先預約。\n預約之後，會幫你安排專業族人導覽，而不是自助瀏覽。' },
      en: { q: 'Can I visit the site anytime?',
            a: 'The site is still under construction. For safety and tour quality, all visits require advance booking.\nAfter booking, a tribal guide will be arranged for you rather than self-guided browsing.' }
    },
    {
      zh: { q: '體驗費用怎麼算？',
            a: '費用看方案、人數、時長、附加（餐 / 宿 / 接駁 / 保險）綜合報。\n表單可標預算範圍，合作社提供透明報價單；學校價、企業價、客製價分流計算。' },
      en: { q: 'How are fees calculated?',
            a: 'Based on plan, group size, duration, and add-ons (meals / lodging / shuttle / insurance).\nNote your budget in the form; the co-op gives a transparent quote. School, corporate, and custom rates are separate.' }
    },
    {
      zh: { q: '怎麼取消或變更預約？',
            a: '活動 7 天前可免費變更或取消；3-7 天內取消酌收 30% 行政費；72 小時內可能酌收場域準備費。\n颱風、地震等不可抗力，會協助延期或全額退款。' },
      en: { q: 'How do I cancel or change?',
            a: 'Free changes 7+ days ahead; 3–7 days = 30% admin fee; within 72 hours a site-prep fee may apply.\nFor force majeure (typhoon, earthquake), we help reschedule or fully refund.' }
    },
    {
      zh: { q: '行動不便可以參加嗎？',
            a: '基地在山區，部分步道仍在無障礙改善中。\n請在表單註明人數與需求（輪椅、手杖、視聽障），會幫你客製可參與的動線。\n竹徑文化講堂（一期）已優先納入無障礙設計。' },
      en: { q: 'Can guests with limited mobility join?',
            a: "The site is in the mountains; some trails are still being made accessible.\nNote the number and needs in the form (wheelchair, cane, hearing/vision), and we'll customize an accessible route.\nThe Bamboo Path Cultural Hall (Phase 1) already prioritizes accessibility." }
    },
    {
      zh: { q: '有企業 ESG 可揭露資料嗎？',
            a: '有。企業 ESG 參訪方案包含：減碳量估算（太陽能 + 高溫窯節能）、竹林撫育公頃數、培訓人次、Saisiyat Raromaeh 品牌授權、與 SDGs 8 / 12 / 13 / 15 對齊清單，可直接放入企業永續報告書。\n詳細資料包請與合作社洽談。' },
      en: { q: 'Disclosable ESG data?',
            a: 'Yes. The corporate ESG plan includes: carbon-reduction estimates (solar + efficient kiln), hectares of bamboo tended, training headcount, Saisiyat Raromaeh brand licensing, and SDGs 8 / 12 / 13 / 15 alignment — ready for your sustainability report.\nContact the co-op for the full data pack.' }
    }
  ];

  // ── 樣式（注入 <style>，前綴 .niwah-w- 避免衝突）──────────
  var CSS = [
    '.niwah-w-fab{position:fixed;right:20px;bottom:22px;width:60px;height:60px;border-radius:50%;background:#2c5530;border:2px solid #d4af37;box-shadow:0 6px 20px rgba(0,0,0,.35),0 0 0 0 rgba(212,175,55,.55);cursor:pointer;z-index:9998;display:flex;align-items:center;justify-content:center;padding:0;transition:transform .2s,box-shadow .2s;animation:niwah-w-pulse 2.6s ease-out infinite}',
    '.niwah-w-fab:hover{transform:scale(1.07);box-shadow:0 10px 28px rgba(0,0,0,.45)}',
    '.niwah-w-fab:focus-visible{outline:3px solid #d4af37;outline-offset:3px}',
    '.niwah-w-fab img{width:44px;height:44px;border-radius:50%;object-fit:cover;pointer-events:none}',
    '.niwah-w-fab .niwah-w-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#d4af37;color:#1c1408;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;letter-spacing:.02em;box-shadow:0 2px 6px rgba(0,0,0,.3)}',
    '@keyframes niwah-w-pulse{0%{box-shadow:0 6px 20px rgba(0,0,0,.35),0 0 0 0 rgba(212,175,55,.45)}70%{box-shadow:0 6px 20px rgba(0,0,0,.35),0 0 0 14px rgba(212,175,55,0)}100%{box-shadow:0 6px 20px rgba(0,0,0,.35),0 0 0 0 rgba(212,175,55,0)}}',

    '.niwah-w-panel{position:fixed;right:20px;bottom:96px;width:360px;max-width:calc(100vw - 32px);max-height:min(560px,calc(100vh - 130px));background:#16261a;color:#f4efe5;border:1px solid #2b3f30;border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.55);z-index:9999;display:none;flex-direction:column;overflow:hidden;font-family:"Noto Sans TC",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;line-height:1.6;opacity:0;transform:translateY(12px) scale(.98);transition:opacity .18s,transform .18s}',
    '.niwah-w-panel.is-open{display:flex;opacity:1;transform:translateY(0) scale(1)}',

    '.niwah-w-head{display:flex;gap:10px;padding:14px 16px;background:linear-gradient(135deg,#2c5530,#4a7c59);border-bottom:1px solid #2b3f30;align-items:center}',
    '.niwah-w-head img{width:36px;height:36px;border-radius:50%;border:1.5px solid #d4af37;object-fit:cover;flex-shrink:0}',
    '.niwah-w-head-text{flex:1;line-height:1.25}',
    '.niwah-w-head-title{font-weight:700;font-size:13.5px;color:#fff;margin:0;letter-spacing:.02em}',
    '.niwah-w-head-sub{font-size:11.5px;color:rgba(244,239,229,.78);margin-top:2px}',
    '.niwah-w-close{width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.25);border:0;color:#f4efe5;cursor:pointer;font-size:18px;line-height:1;padding:0;display:flex;align-items:center;justify-content:center;transition:background .15s}',
    '.niwah-w-close:hover{background:rgba(0,0,0,.45)}',

    '.niwah-w-body{flex:1;overflow-y:auto;padding:14px 16px}',
    '.niwah-w-body::-webkit-scrollbar{width:6px}',
    '.niwah-w-body::-webkit-scrollbar-thumb{background:#2b3f30;border-radius:3px}',

    '.niwah-w-greeting{padding:10px 12px;background:#1a2c1f;border:1px solid #2b3f30;border-radius:10px;margin-bottom:12px}',
    '.niwah-w-greeting p{margin:0;font-size:13px;color:#c4d2c8}',
    '.niwah-w-greeting p+p{margin-top:4px;color:#8aa091;font-size:12px}',

    '.niwah-w-section-label{font-size:11px;letter-spacing:.08em;color:#d4af37;text-transform:uppercase;margin:6px 0 8px;font-weight:600}',
    '.niwah-w-q-list{display:flex;flex-direction:column;gap:6px;list-style:none;margin:0;padding:0}',
    '.niwah-w-q-btn{width:100%;text-align:left;background:#1a2c1f;border:1px solid #2b3f30;border-radius:9px;padding:10px 12px;font:inherit;font-size:13px;color:#f4efe5;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:9px;line-height:1.45}',
    '.niwah-w-q-btn:hover{border-color:#d4af37;background:#20321f;color:#d4af37}',
    '.niwah-w-q-btn:focus-visible{outline:2px solid #d4af37;outline-offset:2px}',
    '.niwah-w-q-btn .niwah-w-q-icon{color:#d4af37;flex-shrink:0;font-size:13px}',

    '.niwah-w-answer{background:#1a2c1f;border:1px solid #2b3f30;border-radius:10px;padding:12px 14px;margin-bottom:12px;white-space:pre-line;font-size:13px;color:#f4efe5;line-height:1.65}',
    '.niwah-w-back{background:none;border:0;color:#d4af37;font:inherit;font-size:12.5px;cursor:pointer;padding:0 0 10px;display:inline-flex;align-items:center;gap:4px}',
    '.niwah-w-back:hover{text-decoration:underline}',

    '.niwah-w-cta{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px dashed #2b3f30}',
    '.niwah-w-cta a{flex:1;min-width:90px;text-align:center;padding:8px 6px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.4);border-radius:7px;color:#d4af37;text-decoration:none;font-size:12px;font-weight:600;transition:all .15s}',
    '.niwah-w-cta a:hover{background:#d4af37;color:#1c1408}',
    '.niwah-w-cta a.niwah-w-cta-ghost{background:transparent;border-color:#2b3f30;color:#c4d2c8}',
    '.niwah-w-cta a.niwah-w-cta-ghost:hover{border-color:#d4af37;color:#d4af37}',

    '.niwah-w-foot{padding:10px 16px;background:#1a2c1f;border-top:1px solid #2b3f30;font-size:11px;color:#8aa091;text-align:center;line-height:1.5}',
    '.niwah-w-foot a{color:#d4af37;text-decoration:none;border-bottom:1px dashed rgba(212,175,55,.45)}',
    '.niwah-w-foot a:hover{color:#f0c659}',

    '@media (max-width:480px){.niwah-w-fab{width:54px;height:54px;right:14px;bottom:14px}.niwah-w-fab img{width:38px;height:38px}.niwah-w-panel{right:14px;left:14px;bottom:80px;width:auto;max-height:calc(100vh - 110px)}}'
  ].join('\n');

  // ── 偵測 logo 路徑（介紹頁是 ../images/sa.webp，從根是 /images/sa.webp）
  function resolveLogo() {
    var path = location.pathname;
    if (/\/pages\//.test(path)) return '../images/sa.webp';
    return '/images/sa.webp';
  }

  // ── 偵測 chatbot 路徑（PoC 全頁版的連結） ─────────────────
  function resolveChatbotURL() {
    var path = location.pathname;
    if (/\/pages\//.test(path)) return '../chatbot/';
    return '/chatbot/';
  }

  // ── 構造 DOM ─────────────────────────────────────────────
  function init() {
    if (document.querySelector('.niwah-w-fab')) return;

    var lang = getLang();
    var t = T[lang];
    var logo = resolveLogo();
    var chatbotUrl = resolveChatbotURL();

    var style = document.createElement('style');
    style.id = 'niwah-widget-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var fab = document.createElement('button');
    fab.className = 'niwah-w-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', t.ask);
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'niwah-w-panel');
    fab.innerHTML =
      '<img src="' + logo + '" alt="">' +
      '<span class="niwah-w-badge">' + FAQ.length + '</span>';

    var panel = document.createElement('aside');
    panel.className = 'niwah-w-panel';
    panel.id = 'niwah-w-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', t.assistantName);
    panel.innerHTML =
      '<header class="niwah-w-head">' +
        '<img src="' + logo + '" alt="">' +
        '<div class="niwah-w-head-text">' +
          '<p class="niwah-w-head-title">' + t.assistantName + '</p>' +
          '<p class="niwah-w-head-sub">' + t.sub + '</p>' +
        '</div>' +
        '<button class="niwah-w-close" type="button" aria-label="' + t.close + '">×</button>' +
      '</header>' +
      '<div class="niwah-w-body" id="niwah-w-body"></div>' +
      '<footer class="niwah-w-foot">' + t.footnote + ' · <a href="' + chatbotUrl + '">' + t.tryChatLink + '</a></footer>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var body = panel.querySelector('#niwah-w-body');
    var closeBtn = panel.querySelector('.niwah-w-close');

    function renderList() {
      var html =
        '<div class="niwah-w-greeting">' +
          '<p>' + t.greeting + '</p>' +
          '<p>' + t.pickOne + '</p>' +
        '</div>' +
        '<div class="niwah-w-section-label">FAQ · ' + FAQ.length + '</div>' +
        '<ul class="niwah-w-q-list">';
      FAQ.forEach(function (item, i) {
        var q = item[lang].q;
        html +=
          '<li><button class="niwah-w-q-btn" type="button" data-idx="' + i + '">' +
            '<span class="niwah-w-q-icon">●</span>' +
            '<span>' + escapeHtml(q) + '</span>' +
          '</button></li>';
      });
      html += '</ul>';
      body.innerHTML = html;
      body.scrollTop = 0;

      body.querySelectorAll('.niwah-w-q-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = parseInt(btn.getAttribute('data-idx'), 10);
          renderAnswer(idx);
        });
      });
    }

    function renderAnswer(idx) {
      var item = FAQ[idx][lang];
      var html =
        '<button class="niwah-w-back" type="button">' + t.back + '</button>' +
        '<div class="niwah-w-section-label">' + escapeHtml(item.q) + '</div>' +
        '<div class="niwah-w-answer">' + escapeHtml(item.a) + '</div>' +
        '<div class="niwah-w-section-label" style="margin-top:14px;">' + t.tryChat + '</div>' +
        '<div class="niwah-w-cta">' +
          '<a href="mailto:' + CONTACT_EMAIL + '">' + t.mailLink + '</a>' +
          '<a class="niwah-w-cta-ghost" href="' + chatbotUrl + '">' + t.tryChatLink + ' →</a>' +
        '</div>';
      body.innerHTML = html;
      body.scrollTop = 0;
      body.querySelector('.niwah-w-back').addEventListener('click', renderList);
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    function openPanel() {
      panel.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      fab.style.animation = 'none';
      renderList();
      var first = body.querySelector('.niwah-w-q-btn');
      if (first) first.focus();
    }
    function closePanel() {
      panel.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      fab.focus();
    }
    function toggle() {
      panel.classList.contains('is-open') ? closePanel() : openPanel();
    }

    fab.addEventListener('click', toggle);
    closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
