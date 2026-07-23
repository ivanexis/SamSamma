(function () {
  /* 山莎蔓岸訂購表單 — FORM_ID / entry 來自 Google viewform FB_PUBLIC_LOAD_DATA_（2026-07-23） */
  var FORM_ID = '1FAIpQLSfYtxaYu4OnWSkS9AFdB8xRcjR7FyRoS_P_idODyCZHXuFf1w';
  var FORM_RESPONSE_URL = 'https://docs.google.com/forms/d/e/' + FORM_ID + '/formResponse';

  var FIELD_MAP = {
    product: 'entry.2124265472',
    company: 'entry.1956664878',
    taxId: 'entry.1668368198',
    contactName: 'entry.1365136276',
    email: 'entry.1258305091',
    phone: 'entry.1834958036',
    quantity: 'entry.954046029',
    needInvoice: 'entry.1921148235',
    delivery: 'entry.554810776',
    notes: 'entry.823967188'
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

  function fieldValue(key) {
    var el = form.elements[key];
    if (!el) return '';
    if (key === 'product' && el.selectedOptions && el.selectedOptions[0]) {
      return (el.selectedOptions[0].text || '').trim();
    }
    return (el.value || '').toString().trim();
  }

  function buildBody() {
    var body = new FormData();
    ['product', 'company', 'taxId', 'contactName', 'email', 'phone',
      'quantity', 'needInvoice', 'delivery', 'notes'].forEach(function (key) {
      var v = fieldValue(key);
      if (v) body.append(FIELD_MAP[key], v);
    });
    return body;
  }

  function buildMailtoBody() {
    var lines = [
      '【山莎蔓岸 · 訂購聯繫】',
      '',
      '品項：' + fieldValue('product'),
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

  function validatePhone() {
    var el = form.elements.phone;
    if (!el) return true;
    var digits = (el.value || '').replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 13) {
      el.setCustomValidity('電話請填 8～13 位數字（可含 - 或空格，例如 0912345678）');
      return false;
    }
    el.setCustomValidity('');
    return true;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    validatePhone();
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
          encodeURIComponent('山莎蔓岸 · 訂購聯繫') +
          '&body=' + encodeURIComponent(buildMailtoBody());
        showSuccess(true);
        window.location.href = mailto;
      }
    } catch (err) {
      var mailtoFail = 'mailto:jeff11051212@gmail.com?subject=' +
        encodeURIComponent('山莎蔓岸 · 訂購聯繫（連線失敗）') +
        '&body=' + encodeURIComponent(buildMailtoBody());
      alert(document.documentElement.classList.contains('i18n-zh')
        ? '連線失敗，將開啟 Email 讓您直接寄出'
        : 'Connection failed — opening email client');
      window.location.href = mailtoFail;
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
