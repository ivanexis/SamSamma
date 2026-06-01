(function () {
  function getWorkId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || document.body.dataset.workId || window.defaultPortfolioWorkId;
  }

  function getWork() {
    const works = window.portfolioWorkDetails || {};
    const id = getWorkId();
    const work = works[id] || works[window.defaultPortfolioWorkId];
    if (work) work.id = works[id] ? id : window.defaultPortfolioWorkId;
    return work;
  }

  function imagePath(work, image) {
    if (!image) return '';
    if (/^(https?:)?\/\//.test(image) || image.startsWith('../') || image.startsWith('/')) {
      return image;
    }
    return `${work.basePath}/${image}`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  }

  function loadImageSize(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          src,
          width: img.naturalWidth || 1,
          height: img.naturalHeight || 1
        });
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function setPhonePreviewToTallestPage(work, phone) {
    const candidates = (work.pages || [])
      .filter((page) => page.image && page.image !== work.hero && page.label !== '主視覺' && !page.hidden)
      .map((page) => imagePath(work, page.image));

    if (!phone || candidates.length === 0) return;

    const sizes = await Promise.all(candidates.map(loadImageSize));
    const tallest = sizes
      .filter(Boolean)
      .sort((a, b) => (b.height / b.width) - (a.height / a.width))[0];

    if (!tallest) return;
    phone.src = tallest.src;
    phone.alt = `${work.title} 手機長版頁面展示`;
  }

  function renderHeader(work) {
    setText('workCategory', work.category);
    setText('workTitle', work.title);
    document.title = `${work.title} - Ivan's Portfolio`;
  }

  function renderHero(work) {
    const hero = document.getElementById('workHero');
    const laptop = document.getElementById('workLaptopImage');
    const phone = document.getElementById('workPhoneImage');
    const src = imagePath(work, work.hero);

    [hero, laptop].forEach((img) => {
      if (!img) return;
      img.src = src;
      img.alt = work.heroAlt || work.title;
    });

    if (phone) {
      const phonePreview = work.phonePreview || work.colorPlan?.phoneImage;
      if (phonePreview) {
        phone.src = imagePath(work, phonePreview);
        phone.alt = `${work.title} 手機長版頁面展示`;
        return;
      }

      const fallbackPage = (work.pages || []).find((page) => page.image && page.label !== '主視覺' && !page.hidden);
      phone.src = imagePath(work, fallbackPage?.image || work.hero);
      phone.alt = `${work.title} 手機頁面展示`;
      setPhonePreviewToTallestPage(work, phone);
    }
  }

  function renderColorPlan(work) {
    const description = document.getElementById('workColorPlanDescription');
    const palette = document.getElementById('workColorPalette');
    const colorPlan = work.colorPlan || {};

    if (description) {
      description.replaceChildren();
      (colorPlan.description || []).forEach((text) => {
        const p = document.createElement('p');
        p.textContent = text;
        description.appendChild(p);
      });
    }

    if (palette) {
      palette.replaceChildren();
      (colorPlan.colors || []).forEach((color) => {
        const chip = document.createElement('div');
        chip.className = 'color-chip';
        chip.style.background = color.hex;
        chip.style.color = color.textColor || '#ffffff';
        chip.textContent = [color.name, color.hex, color.ratio].filter(Boolean).join('　');
        palette.appendChild(chip);
      });
    }
  }

  function createSlide(work, page, index) {
    const slide = document.createElement('div');
    slide.className = 'showcase-slide';

    const img = document.createElement('img');
    img.alt = page.alt || page.label;
    img.loading = 'lazy';
    img.decoding = 'async';

    const src = imagePath(work, page.image);
    if (index === 0) {
      img.src = src;
    } else {
      img.dataset.src = src;
    }

    slide.appendChild(img);
    return slide;
  }

  function createShowcaseButton(page, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `showcase-btn${index === 0 ? ' is-active' : ''}`;
    button.dataset.index = String(index);
    button.textContent = page.label;
    return button;
  }

  function getShowcasePages(work) {
    return (work.pages || []).filter((page) => page.label !== '主視覺' && !page.hidden);
  }

  function renderShowcase(work) {
    const track = document.getElementById('showcaseTrack');
    const controls = document.getElementById('showcaseControls');
    const pages = getShowcasePages(work);
    if (!track || !controls) return;

    track.replaceChildren();
    controls.replaceChildren();

    pages.forEach((page, index) => {
      track.appendChild(createSlide(work, page, index));
      controls.appendChild(createShowcaseButton(page, index));
    });
  }

  function getOrderedWebDesignIds() {
    const works = window.portfolioWorkDetails || {};

    return Object.keys(works)
      .filter((id) => /^web-design-\d+-\d+$/.test(id))
      .sort((a, b) => {
        const [, aCategory, aItem] = a.match(/^web-design-(\d+)-(\d+)$/).map(Number);
        const [, bCategory, bItem] = b.match(/^web-design-(\d+)-(\d+)$/).map(Number);
        return (aCategory - bCategory) || (aItem - bItem);
      });
  }

  function getSequentialRelatedWorks(work) {
    const works = window.portfolioWorkDetails || {};
    const orderedIds = getOrderedWebDesignIds().filter((id) => works[id]);
    const currentIndex = orderedIds.indexOf(work.id);

    if (currentIndex === -1 || orderedIds.length < 2) return [];

    const relatedIds = [
      orderedIds[(currentIndex - 1 + orderedIds.length) % orderedIds.length],
      orderedIds[(currentIndex + 1) % orderedIds.length],
      orderedIds[(currentIndex + 2) % orderedIds.length]
    ];

    return relatedIds.map((id) => {
      const relatedWork = works[id];
      return {
        href: `WebDesign.html?id=${id}`,
        image: imagePath(relatedWork, relatedWork.pages?.[0]?.image || relatedWork.hero),
        label: relatedWork.cardTitle || relatedWork.title
      };
    });
  }

  function renderRelatedWorks(work) {
    const grid = document.getElementById('relatedWorksGrid');
    if (!grid) return;

    const relatedWorks = work.relatedWorks || getSequentialRelatedWorks(work);

    grid.replaceChildren();
    relatedWorks.forEach((item) => {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'more-work-item';
      link.innerHTML = `
        <div class="more-work-thumb">
          <img src="${item.image}" alt="${item.label}" loading="lazy" decoding="async">
        </div>
        <div class="more-work-label">${item.label}</div>
      `;
      grid.appendChild(link);
    });
  }

  function initShowcase() {
    const showcase = document.getElementById('uiShowcase');
    const track = document.getElementById('showcaseTrack');
    const prevBtn = document.getElementById('showcasePrev');
    const nextBtn = document.getElementById('showcaseNext');
    if (!showcase || !track || track.children.length === 0) return;

    const buttons = showcase.querySelectorAll('.showcase-btn');
    const total = track.children.length;
    let current = 0;
    let autoplayTimer = null;

    const loadSlideImage = (index) => {
      const slide = track.children[index];
      const img = slide?.querySelector('img[data-src]');
      if (!img) return;

      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    };

    const goTo = (index) => {
      current = (index + total) % total;
      loadSlideImage(current);
      loadSlideImage((current + 1) % total);
      const activeSlide = track.children[current];
      if (activeSlide) activeSlide.scrollTop = 0;
      track.style.transform = `translateX(-${current * 100}%)`;
      buttons.forEach((button) => button.classList.remove('is-active'));
      const active = showcase.querySelector(`.showcase-btn[data-index="${current}"]`);
      if (active) active.classList.add('is-active');
    };

    const restartAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (total <= 1) return;
      autoplayTimer = setInterval(() => goTo(current + 1), 4500);
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-index') || 0);
        goTo(index);
        restartAutoplay();
      });
    });

    prevBtn?.addEventListener('click', () => {
      goTo(current - 1);
      restartAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      goTo(current + 1);
      restartAutoplay();
    });

    showcase.addEventListener('mouseenter', () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
    });

    showcase.addEventListener('mouseleave', restartAutoplay);
    goTo(0);
    restartAutoplay();
  }

  function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-layer-title', {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.hero-layer-wrap', start: 'top 80%' }
    });

    gsap.from('.hero-layer-media', {
      x: -50,
      opacity: 0,
      duration: 0.95,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.hero-layer-wrap', start: 'top 78%' }
    });

    gsap.from('.feature-surface', {
      y: 36,
      opacity: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.portfolio-content', start: 'top 76%' }
    });
  }

  function initWorkDetailPage() {
    const work = getWork();
    if (!work) return;

    renderHeader(work);
    renderHero(work);
    renderColorPlan(work);
    renderShowcase(work);
    renderRelatedWorks(work);
    initShowcase();
    initAnimations();
  }

  document.addEventListener('DOMContentLoaded', initWorkDetailPage);
})();
