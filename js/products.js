(function () {
  var lang = document.documentElement.classList.contains('i18n-zh') ? 'zh' : 'en';

  function t(obj) {
    if (!obj) return '';
    return obj[lang] || obj.zh || '';
  }

  function formatPrice(product) {
    if (product.priceDisplay) return t(product.priceDisplay);
    if (!product.priceTwd) return t({ zh: '洽詢', en: 'Inquire' });
    var note = product.priceNote ? ' ' + t(product.priceNote) : '';
    return 'NT$ ' + product.priceTwd.toLocaleString() + note;
  }

  function statusLabel(status) {
    var map = {
      available: { zh: '現貨', en: 'In stock' },
      preorder: { zh: '預購', en: 'Pre-order' },
      soldout: { zh: '售完', en: 'Sold out' }
    };
    return t(map[status] || map.available);
  }

  function buildProductCard(product, channels) {
    var card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.dataset.aos = 'fade-up';

    var statusClass = product.status === 'preorder' ? ' is-preorder' : '';
    var tagsHtml = (product.tags || []).map(function (tag) {
      return '<span class="product-tag">' + t(tag) + '</span>';
    }).join('');

    var actions = '';
    /* 每件商品統一兩顆：Pinkoi（即將或已開賣）＋聯繫訂購 */
    if (channels.pinkoi && channels.pinkoi.enabled && channels.pinkoi.url) {
      actions += '<a class="btn-gold" href="' + channels.pinkoi.url + '" target="_blank" rel="noopener">' +
        '<i class="fas fa-store"></i> ' + t(channels.pinkoi.label || { zh: '前往 Pinkoi', en: 'Buy on Pinkoi' }) + '</a>';
    } else {
      var soon = (channels.pinkoi && channels.pinkoi.label)
        ? t(channels.pinkoi.label)
        : t({ zh: '即將於 Pinkoi 開賣', en: 'Coming soon on Pinkoi' });
      actions += '<span class="btn-gold is-disabled" aria-disabled="true">' +
        '<i class="fas fa-clock"></i> ' + soon + '</span>';
    }
    var procUrl = 'procurement.html?product=' + encodeURIComponent(product.id);
    actions += '<a class="btn-outline-green" href="' + procUrl + '">' +
      '<i class="fas fa-envelope"></i> <span data-i18n-lang="zh">聯繫我們訂購</span><span data-i18n-lang="en">Contact to order</span></a>';

    card.innerHTML =
      '<div class="product-card-img">' +
        '<img src="' + product.image + '" alt="' + t(product.name) + '" loading="lazy">' +
        '<span class="product-status' + statusClass + '">' + statusLabel(product.status) + '</span>' +
      '</div>' +
      '<div class="product-card-body">' +
        '<div class="product-tags">' + tagsHtml + '</div>' +
        '<h3>' + t(product.name) + '</h3>' +
        '<p class="product-card-desc">' + t(product.desc) + '</p>' +
        '<p class="product-price">' + formatPrice(product) + '</p>' +
        '<div class="product-actions">' + actions + '</div>' +
      '</div>';

    return card;
  }

  function renderFilters(categories, grid) {
    var wrap = document.getElementById('shopFilters');
    if (!wrap) return;

    categories.forEach(function (cat, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shop-filter-btn' + (idx === 0 ? ' is-active' : '');
      btn.dataset.filter = cat.id;
      btn.textContent = t(cat.label);
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.shop-filter-btn').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        var filter = cat.id;
        grid.querySelectorAll('.product-card').forEach(function (card) {
          var show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
      wrap.appendChild(btn);
    });
  }

  fetch('data/products.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var grid = document.getElementById('shopGrid');
      if (!grid) return;

      renderFilters(data.categories, grid);

      data.products.forEach(function (product) {
        grid.appendChild(buildProductCard(product, data.channels));
      });

      if (typeof AOS !== 'undefined') AOS.refresh();
    })
    .catch(function (err) {
      console.error('products.json load failed', err);
      var grid = document.getElementById('shopGrid');
      if (grid) {
        grid.innerHTML = '<p style="text-align:center;color:#666;grid-column:1/-1;">商品資料載入失敗 / Failed to load products</p>';
      }
    });
})();
