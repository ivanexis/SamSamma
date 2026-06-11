/**
 * 撅梯??硫 AI Chatbot ??Phase 1 PoC
 * ?????????????????????????????????????????????????????????????????
 * 蝝?蝡?demo嚗? *   - Mock 璅∪?嚗?圈??萄??寥?嚗? API key
 *   - OpenAI 璅∪?嚗??Chat Completions API嚗ey ?怠? localStorage嚗? *   - Anthropic 璅∪?嚗??Messages API
 *
 * Phase 2 ??頝臬?嚗? fetch ?寞??芸振 Cloudflare Worker proxy嚗? * ??Worker secrets 瘜典 key嚗蒂??rate-limit?? */

(function () {
  const $ = (sel) => document.querySelector(sel);
  const messagesEl = $('#messages');
  const form = $('#composer');
  const input = $('#input');
  const sendBtn = $('#sendBtn');
  const providerSel = $('#provider');
  const apiKeyInput = $('#apiKey');
  const apiKeyField = $('#apiKeyField');
  const saveKeyBtn = $('#saveKeyBtn');
  const clearBtn = $('#clearBtn');
  const statusEl = $('#status');

  const SYSTEM_PROMPT = window.SAMSAMMA_FAQ;
  const STORAGE_KEY_PROVIDER = 'samsamma_chat_provider';
  const STORAGE_KEY_OPENAI = 'samsamma_chat_openai_key';
  const STORAGE_KEY_ANTHROPIC = 'samsamma_chat_anthropic_key';
  const STORAGE_KEY_HISTORY = 'samsamma_chat_history';

  // history: 銝 system prompt嚗?雿輻???拍?撠店
  let history = [];

  // ?? Demo Mode ?文?嚗ecision Log D-009嚗?????????????????????
  // 銝?祈赤摰ｇ?dev-panel ?梯??撥??mock 璅∪?嚗????炊撠赤摰ｇ?
  // ?Ｚ岫 demo嚗RL ???demo=1 閫?? LLM ???剁??曉撅內 API 銝脫?賢?
  const isDemoMode = (() => {
    try {
      return new URLSearchParams(location.search).get('demo') === '1';
    } catch { return false; }
  })();

  // ?? ??????????????????????????????????????????????????????
  function init() {
    const devPanel = $('#dev-panel');
    const visitorPanel = $('#visitor-panel');

    if (isDemoMode) {
      if (devPanel) devPanel.hidden = false;
      if (visitorPanel) visitorPanel.hidden = true;
      const savedProvider = localStorage.getItem(STORAGE_KEY_PROVIDER) || 'mock';
      providerSel.value = savedProvider;
    } else {
      // visitor mode嚗撥??mock嚗?霈撖?provider localStorage
      providerSel.value = 'mock';
    }

    refreshKeyField();
    loadHistory();
    bind();
  }

  function bind() {
    providerSel.addEventListener('change', () => {
      if (isDemoMode) {
        localStorage.setItem(STORAGE_KEY_PROVIDER, providerSel.value);
      }
      refreshKeyField();
    });
    if (saveKeyBtn) {
      saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        const provider = providerSel.value;
        if (provider === 'openai') localStorage.setItem(STORAGE_KEY_OPENAI, key);
        if (provider === 'anthropic') localStorage.setItem(STORAGE_KEY_ANTHROPIC, key);
        flashStatus('Key 撌脣?嚗??祆?嚗?);
      });
    }
    const onClear = () => {
      if (!confirm('蝣箏?皜?桀?撠店嚗?)) return;
      history = [];
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      messagesEl.innerHTML = '';
      appendAssistant('撠店撌脫??扎???喃?閫??暻潘?', { meta: '撌脤?蝵?session' });
    };
    if (clearBtn) clearBtn.addEventListener('click', onClear);
    const clearSimple = $('#clearBtnSimple');
    if (clearSimple) clearSimple.addEventListener('click', onClear);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      handleUserMessage(text);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
    input.addEventListener('input', autoResizeTextarea);
    document.querySelectorAll('.suggest').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-q');
        if (!q) return;
        input.value = q;
        autoResizeTextarea();
        form.requestSubmit();
      });
    });
  }

  function refreshKeyField() {
    const provider = providerSel.value;
    if (provider === 'mock') {
      apiKeyField.style.display = 'none';
      saveKeyBtn.style.display = 'none';
      return;
    }
    apiKeyField.style.display = '';
    saveKeyBtn.style.display = '';
    const stored =
      provider === 'openai'
        ? localStorage.getItem(STORAGE_KEY_OPENAI) || ''
        : localStorage.getItem(STORAGE_KEY_ANTHROPIC) || '';
    apiKeyInput.value = stored;
    apiKeyInput.placeholder = provider === 'openai' ? 'sk-...' : 'sk-ant-...';
  }

  function autoResizeTextarea() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  }

  function flashStatus(text) {
    statusEl.textContent = text;
    setTimeout(() => (statusEl.textContent = ''), 1800);
  }

  // ?? 閮皜脫? ????????????????????????????????????????????????
  function appendUser(text) {
    const wrap = document.createElement('div');
    wrap.className = 'msg msg-user';
    wrap.innerHTML = `
      <div class="avatar">??/div>
      <div class="bubble"></div>
    `;
    wrap.querySelector('.bubble').textContent = text;
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function appendAssistant(text, opts = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'msg msg-assistant';
    wrap.innerHTML = `
      <div class="avatar">撅?/div>
      <div class="bubble"></div>
    `;
    const bubble = wrap.querySelector('.bubble');
    bubble.textContent = text;
    if (opts.meta) {
      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.innerHTML = opts.meta;
      bubble.appendChild(meta);
    }
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return bubble;
  }

  function appendTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg msg-assistant msg-typing';
    wrap.id = 'typing-indicator';
    wrap.innerHTML = `
      <div class="avatar">撅?/div>
      <div class="bubble">
        ?葉
        <span class="dot-flash"><span></span><span></span><span></span></span>
      </div>
    `;
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }
  function removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return;
      arr.forEach((m) => {
        if (m.role === 'user') appendUser(m.content);
        else if (m.role === 'assistant') appendAssistant(m.content);
      });
      history = arr;
    } catch {}
  }
  function persistHistory() {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(-30)));
  }

  // ?? 撠店瘚? ????????????????????????????????????????????????
  async function handleUserMessage(text) {
    appendUser(text);
    history.push({ role: 'user', content: text });
    persistHistory();
    input.value = '';
    autoResizeTextarea();
    setSending(true);
    appendTyping();

    const provider = providerSel.value;
    try {
      let answer;
      if (provider === 'openai') answer = await callOpenAI(text);
      else if (provider === 'anthropic') answer = await callAnthropic(text);
      else answer = await callMock(text);

      removeTyping();
      appendAssistant(answer);
      history.push({ role: 'assistant', content: answer });
      persistHistory();
    } catch (err) {
      removeTyping();
      appendAssistant(
        `[Demo ?航炊] ${err.message || err}`,
        {
          meta:
            '隢炎?亙椰??API key ?臬甇?Ⅱ嚗?????<em>Mock 璅∪?</em> 擃?撠店瘚???,
        }
      );
    } finally {
      setSending(false);
    }
  }

  function setSending(busy) {
    sendBtn.disabled = busy;
    input.disabled = busy;
    sendBtn.textContent = busy ? '?銝凌? : '?';
  }

  // ?? Mock 璅∪?嚗? API key嚗?????????????????????????????????
  // 瘜冽?嚗ock ??敹?撠? Chatbot_PRD_v1.txt 蝚?3 蝡?Tone of Voice
  // ?? 蝳? / 蝡 / ??梢? / ???芸??
  // ?? ?刻???ㄐ / ?Ｘ??/ ?隢?/ ????
  async function callMock(text) {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));

    if (/隤院雿|niwah|憒桀?|雿|??|??|撱箇蔭|?|?箔?暻潭?/i.test(text)) {
      return '? Niwah嚗魚憭???頝胯????? ??閮?敺?璇??犖?n\n???其犖??Phase 1 PoC嚗 Ivan Zhao嚗???嚗遣蝵殷??唾岫閰衣?????FAQ ??撠店撘??銝皜??桀???敺n\n憒???蝑?銝?憟踝??湔 email ivanzhao.link@gmail.com嚗??????????;
    }
    if (/??|??|??暻慝?鈭瘣餃?|憿寧|?|?寞?/.test(text)) {
      return '?桀?撅梯??硫撠????\n\n1. ??擃?嚗魚憭姘撌亥??楊蝐平甇???閬踝?\n2. ESG 隡平?赤嚗??亙鈭嚗摰Ｚˊ嚗n3. 蝡寧??嚗?璆凋?蝣喟旨?偶蝥鞈潘?\n4. ??蝡寞???嚗?銵???航?蝵殷?\n\n雿?頛鈭圾?芯???';
    }
    if (/esg|隡平|?砍|??|?赤|carbon|瘞貊?|cs[rR]/i.test(text)) {
      return '? 30 鈭箇? ESG 擃??臭誑??撣貉?蝯??胯姘??閬?+ 雿４?? + 憸典擗n\n?ㄐ??脫 12 ?祇?蝡寞?????４?脣蝺????拙???ESG ?勗?雿?嚗n\n?嫣?閬??挾??暺????嚗遣霅啣 https://ivanzhao.dpdns.org/booking/ 憛思?銝???蝷暸??閬??湔???;
    }
    if (/蝡寧|??|?∟頃|鞈潸眺|?Ｗ?|蝳桃?/.test(text)) {
      return '蝡寧???桀?隞乩?璆凋?蝣喟旨?偶蝥鞈潛銝鳴??嗅?閬??n\n?∟頃?岷?寡? email嚗nfo@samsamma.tw\n?酉?∟頃?賊????瘙????????蝎暹???;
    }
    if (/??|?勗?|瘚?|憭?|?獐??.test(text)) {
      return '??韏圈?嚗ttps://ivanzhao.dpdns.org/booking/\n\n憛怠?銋?嚗?雿冗??憭抒? 1-3 ?極雿??閬n憒?瘥??伐??湔 email ivanzhao.link@gmail.com 銋隞乓?;
    }
    if (/鈭日?啣?|?圈?|?獐?誡?芾ㄐ|雿蔭/.test(text)) {
      return '?游??冽蝡寧腦鈭陸?之??嚗魚憭??喟絞??嚗n\n撱箄降?芷?嚗?蝡寞銝?122 蝮???脖?撜堆?頠?蝝?40 ???n憭抒?撓銝云?嫣噶嚗?券?蝝??酉嚗??獐摰???;
    }
    if (/蝝?|?⊿?蝷撠??撠酋|?咱|撟湧翩|?育憭批飛??圈?|摮貊?/.test(text)) {
      return '??摰Ｚˊ嚗?憌???僑朣～?飛????賢隞亥?隡堆?\n\n繚 憸典擗摰Ｚˊ蝝?\n繚 憭擃??拙???銝剖僑蝝誑銝n繚 ?嗅???恕?批?獢n\n蝝啁???https://ivanzhao.dpdns.org/booking/ ????閮颱?銝???email ivanzhao.link@gmail.com ?賢隞乓?;
    }
    if (/??|??|?怎?蟡迢蟡剖?|靽∩趕|raromaeh|saisiyat|鞈賢?/i.test(text)) {
      return '??頝???撘?頛楛???閬?犖?砌犖靘牧??頛????? ??銝餉??臭?蝝寞?????????n\n憒??單楛?乩?閫???惜?ｇ??臭誑 email ivanzhao.link@gmail.com嚗???獐摰???;
    }
    if (/?頌憭??└鞎餌|憭?|撟曄|撟曉?/.test(text)) {
      return '?嫣???銝云?嫣噶雓Ⅱ摰摮??? ??畾萸犖?詻?暺????蝯?嚗榆頝?皛踹之?n\n撱箄降??https://ivanzhao.dpdns.org/booking/ 憛思?銝?瘙???蝷暸????蝣箏?憭?;
    }
    return '嚗ock 蝷箇?璅∪?嚗?憿?頛敦蝭嚗遣霅啁??email ivanzhao.link@gmail.com嚗???https://ivanzhao.dpdns.org/booking/ ????閮鳴???蝷暸??鼠雿Ⅱ隤??啁?瘜n\n雿??臭誑閰西岫撌血??Ｚ?嚗岫閰阡??翰??撽?demo??;
  }

  // ?? OpenAI 璅∪? ????????????????????????????????????????????
  async function callOpenAI(text) {
    const key = (localStorage.getItem(STORAGE_KEY_OPENAI) || apiKeyInput.value || '').trim();
    if (!key) throw new Error('隢??典椰?渲撓??OpenAI API key');

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
      .concat(history.slice(-12).map((m) => ({ role: m.role, content: m.content })));

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.5,
        max_tokens: 600,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 200)}`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || '嚗??嚗?;
  }

  // ?? Anthropic 璅∪? ?????????????????????????????????????????
  async function callAnthropic(text) {
    const key = (localStorage.getItem(STORAGE_KEY_ANTHROPIC) || apiKeyInput.value || '').trim();
    if (!key) throw new Error('隢??典椰?渲撓??Anthropic API key');

    const msgs = history
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: msgs,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 200)}`);
    }
    const data = await res.json();
    const txt = data?.content?.[0]?.text;
    return (txt || '嚗??嚗?).trim();
  }

  init();
})();
