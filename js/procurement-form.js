(function () {
  /* 待合作社建立 Google 採購表單後替換（建置步驟見 data/docs/procurement-google-form-setup.md） */
  var FORM_ID = '';
  var FORM_RESPONSE_URL = FORM_ID
    ? 'https://docs.google.com/forms/d/e/' + FORM_ID + '/formResponse'
    : '';

  var FIELD_MAP = {
    product: 'entry.000000001',
    company: 'entry.000000002',
    taxId: 'entry.000000003',
    contactName: 'entry.000000004',
    email: 'entry.000000005',
    phone: 'entry.000000006',
    quantity: 'entry.000000007',
    needInvoice: 'entry.000000008',
    delivery: 'entry.000000009',
    notes: 'entry.000000010'
  };

  var form = document.getElementById('procurementForm');
  var successPanel = document.getElementById('procurementSuccess');
  var submitBtn = document.getElementById('procurementSubmitBtn');
  var resetBtn = document.getElementById('procurementResetBtn');
  var demoNotice = document.getElementById('procurementDemoNotice');
  if (!form || !successPanel || !submitBtn) return;

  if (!FORM_ID && demoNotice) {
    demoNotice.hidden = false;
  }

  /* URL ?product=xxx 預填品項 */
  var params = new URLSearchParams(location.search);
  var productId = params.get('product');
  if (productId && form.elements.product) {
    var opt = form.elements.product.querySelector('option[value="' + productId + '"]');
    if (opt) form.elements.product.value = productId;
  }

  function buildBody() {
    var body = new FormData();
    ['product', 'company', 'taxId', 'contactName', 'email', 'phone',
      'quantity', 'needInvoice', 'delivery', 'notes'].forEach(function (key) {
      var el = form.elements[key];
      if (!el) return;
      var v = (el.value || '').toString().trim();
      if (v && FORM_ID) body.append(FIELD_MAP[key], v);
    });
    return body;
  }

  function buildMailtoBody() {
    var lines = [
      '【山莎蔓岸 · 企業採購詢價】',
      '',
      '品項：' + (form.elements.product.selectedOptions[0]?.text || form.elements.product.value),
      '公司：' + form.elements.company.value,
      '統編：' + form.elements.taxId.value,
      '聯絡人：' + form.elements.contactName.value,
      'Email：' + form.elements.email.value,
      '電話：' + form.elements.phone.value,
      '數量：' + form.elements.quantity.value,
      '發票：' + form.elements.needInvoice.value,
      '配送：' + form.elements.delivery.value,
      '備註：' + form.elements.notes.value
    ];
    return lines.join('\n');
  }

  function showSuccess(isDemo) {
    form.hidden = true;
    successPanel.hidden = false;
    if (isDemo) {
      var demoMsg = successPanel.querySelector('[data-demo-msg]');
      if (demoMsg) demoMsg.hidden = false;
    }
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i><span data-i18n-lang="zh">送出中...</span><span data-i18n-lang="en">Submitting...</span>';

    try {
      if (FORM_ID && FORM_RESPONSE_URL) {
        await fetch(FORM_RESPONSE_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: buildBody()
        });
        showSuccess(false);
      } else {
        /* 示範版：無 Google Form 時以 mailto 交付 + 顯示成功（面試/demo 用） */
        var mailto = 'mailto:jeff11051212@gmail.com?subject=' +
          encodeURIComponent('山莎蔓岸 · 企業採購詢價') +
          '&body=' + encodeURIComponent(buildMailtoBody());
        showSuccess(true);
        window.location.href = mailto;
      }
    } catch (err) {
      var mailto = 'mailto:jeff11051212@gmail.com?subject=' +
        encodeURIComponent('山莎蔓岸 · 企業採購詢價（連線失敗）') +
        '&body=' + encodeURIComponent(buildMailtoBody());
      alert(document.documentElement.classList.contains('i18n-zh')
        ? '連線失敗，將開啟 Email 讓您直接寄出'
        : 'Connection failed — opening email client');
      window.location.href = mailto;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.hidden = false;
      successPanel.hidden = true;
      var demoMsg = successPanel.querySelector('[data-demo-msg]');
      if (demoMsg) demoMsg.hidden = true;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
