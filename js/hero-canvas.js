/* hero-canvas.js · index.html inline script extraction (Phase 5)
 * Contents:
 *   - Icon Cloud Canvas (3D glass beads)
 *   - Hero morph text (GSAP)
 *   - 3D text intro
 *   - AOS init, scroll listener, parallax, smooth scroll
 *   - Progress bar IntersectionObserver
 *   - Particles canvas
 *   - Resume CH/EN toggle
 *   - Web3Forms contact form handler
 */

// 取得 canvas 與 context
const canvas = document.getElementById('iconCloudCanvas');
const ctx = canvas.getContext('2d');

// 設置 canvas 寬高隨視窗大小調整
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 設定基本參數
const numIcons = 30;
const iconSize = 15;
const radius = 150;
const icons = [];

// 定義 10 種玻璃珠/膠狀小球的色彩資料
const beadColors = [
  { // 深黑色（Black / Charcoal Glass）
    base: "rgba(30,30,30,0.8)",
    highlight: "rgba(255,255,255,0.5)",
    outer: "rgba(0,0,0,0)"
  },
  { // 鮮紅色（Bright Red / Ruby Glass）
    base: "rgba(210,22,26,0.8)",
    highlight: "rgba(255,59,59,0.9)",
    outer: "rgba(210,22,26,0)"
  },
  { // 琥珀/蜂蜜色（Amber / Honey Glass）
    base: "rgba(224,166,60,0.7)",
    highlight: "rgba(255,199,95,0.8)",
    outer: "rgba(224,166,60,0)"
  },
  { // 鮮黃（Vibrant Yellow / Lemon Jelly）
    base: "rgba(255,234,0,0.7)",
    highlight: "rgba(255,255,100,0.8)",
    outer: "rgba(255,234,0,0)"
  },
  { // 鮮綠/草綠（Bright Green / Lime Glass）
    base: "rgba(88,196,67,0.7)",
    highlight: "rgba(196,255,140,0.8)",
    outer: "rgba(88,196,67,0)"
  },
  { // 淺青綠/水藍（Aqua / Turquoise Jelly）
    base: "rgba(62,195,201,0.6)",
    highlight: "rgba(167,255,248,0.8)",
    outer: "rgba(62,195,201,0)"
  },
  { // 天藍/湖藍（Sky Blue / Lake Glass）
    base: "rgba(0,150,239,0.7)",
    highlight: "rgba(224,247,255,0.8)",
    outer: "rgba(0,150,239,0)"
  },
  { // 深藍/靛藍（Deep Blue / Indigo Glass）
    base: "rgba(25,59,130,0.65)",
    highlight: "rgba(76,121,224,0.8)",
    outer: "rgba(25,59,130,0)"
  },
  { // 淡玫瑰粉（Soft Rose Pink / Rose Quartz）
    base: "rgba(221,164,179,0.6)",
    highlight: "rgba(255,240,243,0.8)",
    outer: "rgba(221,164,179,0)"
  },
  { // 銀灰/半透明（Silver / Translucent Grey / Frosted Glass）
    base: "rgba(226,226,226,0.4)",
    highlight: "rgba(255,255,255,0.8)",
    outer: "rgba(226,226,226,0)"
  }
];

// 利用 Fibonacci Sphere 生成圖標位置，並依循環取對應玻璃珠色彩資料
for (let i = 0; i < numIcons; i++) {
  const offset = 2 / numIcons;
  const y = i * offset - 1 + offset / 2;
  const r = Math.sqrt(1 - y * y);
  const phi = i * Math.PI * (3 - Math.sqrt(5));
  icons.push({
    x: Math.cos(phi) * r * radius,
    y: y * radius,
    z: Math.sin(phi) * r * radius,
    bead: beadColors[i % beadColors.length], // 依序取出固定 10 種顏色
    id: i
  });
}

// 初始化旋轉角度與旋轉速率
let rotation = { x: 0, y: 0 };
const baseVelocity = { x: 0.002, y: 0.005 };
let velocity = { x: baseVelocity.x * 4, y: baseVelocity.y * 4 }; // 初始速率為基礎值的4倍

// 拖動與互動相關變數
let isDragging = false;
let mouseDown = false;
let lastMousePos = { x: 0, y: 0 };
let dragVelocity = { x: 0, y: 0 };
let mousePos = { x: null, y: null };
let paused = false;
let frozenElapsed = 0;
let pausedScaleFactor = 0;

// 動畫控制參數
const introDuration = 8000; // 8秒
let introStart = Date.now();
const centerThreshold = 150; // 中心觸發區域半徑

// 事件監聽器
canvas.addEventListener('mousedown', (e) => {
  mouseDown = true;
  isDragging = true;
  lastMousePos = { x: e.clientX, y: e.clientY };
  velocity.x = 0;
  velocity.y = 0;
});

canvas.addEventListener('mouseup', () => {
  mouseDown = false;
  isDragging = false;
  introStart = Date.now(); // 重置時間軸
  velocity.x = baseVelocity.x * 4;
  velocity.y = baseVelocity.y * 4;
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;

  if (isDragging) {
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    rotation.y -= dx * 0.005;
    rotation.x -= dy * 0.005;
    dragVelocity.x = -dx * 0.005;
    dragVelocity.y = -dy * 0.005;
    lastMousePos = { x: e.clientX, y: e.clientY };
  }
});

canvas.addEventListener('mouseleave', () => {
  mouseDown = false;
  isDragging = false;
  mousePos = { x: null, y: null };
  velocity.x = baseVelocity.x * 4;
  velocity.y = baseVelocity.y * 4;
});

// 檢查滑鼠是否在中心觸發區域
function checkMouseCenter() {
  if (mousePos.x === null || mousePos.y === null || isDragging || mouseDown) return;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dist = Math.sqrt((mousePos.x - centerX) ** 2 + (mousePos.y - centerY) ** 2);

  if (dist < centerThreshold && !paused) {
    paused = true;
    frozenElapsed = Date.now() - introStart;
    pausedScaleFactor = 6.0 - (6.0 - 0.2) * (frozenElapsed / introDuration);
    // 降低旋轉速率至 25%
    velocity.x = baseVelocity.x;
    velocity.y = baseVelocity.y;
  } else if (dist >= centerThreshold && paused) {
    paused = false;
    introStart = Date.now() - frozenElapsed;
    // 恢復正常旋轉速率
    velocity.x = baseVelocity.x * 4;
    velocity.y = baseVelocity.y * 4;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  checkMouseCenter();

  if (!isDragging && !mouseDown) {
    rotation.x += velocity.x;
    rotation.y -= velocity.y;
    dragVelocity.x *= 0.95;
    dragVelocity.y *= 0.95;
    rotation.x += dragVelocity.x;
    rotation.y += dragVelocity.y;
  }

  let elapsed = Date.now() - introStart;
  let globalScaleFactor;

  if (mouseDown || isDragging) {
    globalScaleFactor = 6.0;
  } else if (paused) {
    globalScaleFactor = pausedScaleFactor;
  } else {
    if (elapsed < introDuration) {
      globalScaleFactor = 6.0 - (6.0 - 0.0001) * (elapsed / introDuration);
      // 旋轉速率從4倍逐漸過渡到2倍
      const speedFactor = 9.0 - (1.0 * elapsed / introDuration);
      velocity.x = baseVelocity.x * speedFactor;
      velocity.y = baseVelocity.y * speedFactor;
    } else {
      globalScaleFactor = 0.1;
      velocity.x = baseVelocity.x * 2;
      velocity.y = baseVelocity.y * 2;
    }
  }

  icons.forEach(icon => {
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);

    // 使用當前 globalScaleFactor 將原始 3D 座標縮放
    const dx = icon.x * globalScaleFactor;
    const dy = icon.y * globalScaleFactor;
    const dz = icon.z * globalScaleFactor;

    // 經過旋轉矩陣計算新的 3D 座標
    let x = dx * cosY - dz * sinY;
    let z = dx * sinY + dz * cosY;
    let y = dy * cosX - z * sinX;
    z = dy * sinX + z * cosX;

    // 投影與縮放
    const scale = (z + 200) / 300;
    const screenX = canvas.width / 2 + x;
    const screenY = canvas.height / 2 + y;
    const alpha = Math.max(0.2, Math.min(1, (z + 150) / 200));

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;

    // 計算動態光源位置
    const time = Date.now() * 0.001;
    const dynamicLightX = Math.cos(time) * iconSize * 0.5;
    const dynamicLightY = Math.sin(time) * iconSize * 0.5;

    // 建立具有動態光源偏移的漸層
    const gradient = ctx.createRadialGradient(
      dynamicLightX, dynamicLightY, iconSize * 0.1,
      0, 0, iconSize
    );
    gradient.addColorStop(0, icon.bead.highlight);
    gradient.addColorStop(0.3, icon.bead.base);
    gradient.addColorStop(0.6, icon.bead.base);
    gradient.addColorStop(1, icon.bead.outer);

    ctx.beginPath();
    ctx.arc(0, 0, iconSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  });

  requestAnimationFrame(animate);
}

animate();

// 原有的文字动画代码
document.addEventListener('DOMContentLoaded', () => {
  // 文字清單
  const textSequence = [
    { text: "Visual Designer", fontSize: "55px" },
    { text: "Ivan Zhao", fontSize: "64px" },
    { text: "Full Stack Engineer", fontSize: "48px" },
    { text: "Ivan Zhao", fontSize: "64px" },
  ];

  // 取得容器
  const morphEl = document.querySelector('.hero-morph-text');
  if (!morphEl) return;

  // 初始化 GSAP 時間軸
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    repeat: -1  // 無限循環
  });

  function setTextContent(obj) {
    morphEl.textContent = obj.text;
    morphEl.style.fontSize = obj.fontSize;
  }

  textSequence.forEach((item) => {
    tl.call(() => setTextContent(item));

    // 文字進場 (淡入 + 旋轉)
    tl.fromTo(morphEl,
      { 
        filter: "blur(30px)", 
        scale: 0.8, 
        opacity: 0, 
        rotationY: 90 
      },
      { 
        filter: "blur(0px)", 
        scale: 1, 
        opacity: 1, 
        rotationY: 0, 
        duration: 1 
      }
    );

    // 停留時間
    tl.to(morphEl, { duration: 1 });

    // 文字退出 (淡出 + 旋轉)
    tl.to(morphEl,
      { 
        filter: "blur(30px)", 
        scale: 0.8, 
        opacity: 0, 
        rotationY: -90, 
        duration: 1 
      }
    );
  });
});

// 等整个页面加载完成后执行3D文字动画
window.addEventListener('DOMContentLoaded', () => {
  gsap.to('.hero-text-3d span', {
    duration: 1,
    rotationY: 0,
    opacity: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });
});

// 初始化 AOS
AOS.init({
  duration: 1000,
  once: false,
  mirror: true
});

// 添加滚动监听
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar-custom');
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector('.hero-section').offsetHeight;
  
  // 当滚动超过hero section高度的80%时改变navbar样式
  if (scrolled > heroHeight * 0.8) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }

  // 视差效果
  const hero = document.querySelector('.hero-section');
  hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// 進度條動畫
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
});

document.querySelectorAll('.progress-bar').forEach((bar) => {
  observer.observe(bar);
});

// 視差滾動效果
window.addEventListener('scroll', () => {
  const parallaxBg = document.getElementById('parallaxBg');
  if (parallaxBg) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
  }
});

/* ========== 粒子效果程式碼 ========== */
(() => {
  // 使用 HTML 內既有的粒子 canvas，避免重複建立相同 id。
  const particlesCanvas = document.getElementById('particlesCanvas');
  if (!particlesCanvas) return;
  const pctx = particlesCanvas.getContext('2d');

  // 設定粒子 canvas 樣式
  particlesCanvas.style.position = 'absolute';
  particlesCanvas.style.top = '0';
  particlesCanvas.style.left = '0';
  particlesCanvas.style.width = '100%';
  particlesCanvas.style.height = '100%';
  particlesCanvas.style.zIndex = '0';
  particlesCanvas.style.pointerEvents = 'none';

  // 取得實際尺寸與設定 dpr
  const dpr = window.devicePixelRatio || 1;
  let canvasWidth = particlesCanvas.clientWidth;
  let canvasHeight = particlesCanvas.clientHeight;
  particlesCanvas.width = canvasWidth * dpr;
  particlesCanvas.height = canvasHeight * dpr;
  pctx.scale(dpr, dpr);

  // 建立粒子陣列與預設數量
  const particles = [];
  const particleCount = 100;
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  // 設定開始時間與總持續時間（6秒）
  const startTime = performance.now();
  const totalDuration = 6000;

  function createParticle() {
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.5 + 0.5
    };
  }

  function updateParticles() {
    // 計算已經過的時間，並依據 6 秒線性淡出：
    // 起始時 densityFactor 為 1；6秒後降至 0.3（即保留 30% 強度）
    const elapsed = performance.now() - startTime;
    const densityFactor = 0.6 + 0.7 * Math.max(0, (totalDuration - elapsed) / totalDuration);
    
    pctx.clearRect(0, 0, canvasWidth, canvasHeight);
    particles.forEach(p => {
      // 粒子向上漂浮
      p.y -= p.speed;
      // 每幀逐漸減少透明度
      p.alpha -= 0.005;
      // 若粒子超出上邊界或透明度過低則從下方重生
      if (p.alpha <= 0 || p.y < -p.size) {
        p.x = Math.random() * canvasWidth;
        p.y = canvasHeight + p.size;
        p.alpha = Math.random() * 0.5 + 0.5;
      }
      pctx.beginPath();
      pctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      // 將每個粒子的 alpha 乘上 densityFactor，以達到全局強度逐漸下降的效果
      pctx.fillStyle = `rgba(255,255,255,${p.alpha * densityFactor})`;
      pctx.fill();
    });
    requestAnimationFrame(updateParticles);
  }
  updateParticles();
})();

/* ========== 履歷中英切換 ========== */
(() => {
  const img = document.getElementById('resume-modal-img');
  const toggleBtn = document.getElementById('resume-lang-toggle');
  const modal = document.getElementById('resumeModal');
  if (!img || !toggleBtn || !modal) return;

  const RESUME = {
    ch: {
      src: 'images/Resume_CH.webp',
      alt: '履歷（中文）',
      toggleLabel: 'English',
      toggleAria: '切換為英文履歷'
    },
    en: {
      src: 'images/Resume_E.webp',
      alt: 'Resume (English)',
      toggleLabel: '中文',
      toggleAria: '切換為中文履歷'
    }
  };

  let currentLang = 'ch';

  function applyLang(lang) {
    currentLang = lang;
    const data = RESUME[lang];
    img.src = data.src;
    img.alt = data.alt;
    toggleBtn.textContent = data.toggleLabel;
    toggleBtn.setAttribute('aria-label', data.toggleAria);
  }

  toggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    applyLang(currentLang === 'ch' ? 'en' : 'ch');
  });

  modal.addEventListener('show.bs.modal', () => applyLang('ch'));
})();

/* ========== 聯絡表單 Web3Forms ========== */
(() => {
  const redirectInput = document.getElementById('web3forms-redirect');
  if (redirectInput) {
    const base = window.location.href.split('#')[0].split('?')[0];
    redirectInput.value = `${base}?success=1#contact`;
  }

  const params = new URLSearchParams(window.location.search);
  const alertEl = document.getElementById('contact-form-alert');
  if (!alertEl) return;

  const I18N = window.I18N;
  const tr = (key, fallback) => (I18N && typeof I18N.t === 'function') ? I18N.t(key, fallback) : fallback;

  if (params.get('success') === '1') {
    alertEl.textContent = tr('contact.form.success', '訊息已送出，我會盡快回覆您的 Gmail。');
    alertEl.setAttribute('data-i18n', 'contact.form.success');
    alertEl.classList.remove('d-none', 'alert-danger');
    alertEl.classList.add('alert-success');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history.replaceState) {
      window.history.replaceState({}, '', `${window.location.pathname}#contact`);
    }
  } else if (params.get('success') === '0') {
    alertEl.textContent = tr('contact.form.error', '送出失敗，請稍後再試或直接寄信至 jeff11051212@gmail.com。');
    alertEl.setAttribute('data-i18n', 'contact.form.error');
    alertEl.classList.remove('d-none', 'alert-success');
    alertEl.classList.add('alert-danger');
  }
})();

/* ========== 球體旋轉動畫程式碼 ========== */
(() => {
  // 取得 canvas 與 context
  const sphereCanvas = document.getElementById('iconCloudCanvas');
  const sphereCtx = sphereCanvas.getContext('2d');

  // 設置 canvas 寬高隨視窗大小調整
  function resizeSphereCanvas() {
    sphereCanvas.width = sphereCanvas.offsetWidth;
    sphereCanvas.height = sphereCanvas.offsetHeight;
  }
  resizeSphereCanvas();
  window.addEventListener('resize', resizeSphereCanvas);

  // 其他球体动画代码保持不变，但将所有的 canvas 改为 sphereCanvas，ctx 改为 sphereCtx
})();
