# SECURITY｜學習站安全最低標（主流預設）

> 目標：符合「能上面試／能給主管看」的基本安全，而非通過正式滲透測試。  
> 對齊：OWASP 常見 Web 風險的**開發期預設**。

---

## 1. 機密與設定

| 規則 | 作法 |
|------|------|
| 密鑰不進 Git | `.env` + `.gitignore`；提供 `.env.example`（假值） |
| `SECRET_KEY` | 隨機長字串，僅環境變數 |
| DB URL | `DATABASE_URL` 環境變數 |
| Admin 帳密 | 環境變數；禁止寫死 `admin/admin` 上任何公開環境 |

---

## 2. Web 應用

| 風險 | 預設對策 |
|------|----------|
| SQL Injection | SQLAlchemy／參數化；禁止 f-string 拼 SQL |
| XSS | Jinja2 預設跳脫；`|safe` 僅用於可信靜態 HTML |
| CSRF | Flask-WTF 或同等 CSRF token（有狀態表單必做） |
| 超量提交 | 基本 length／型別驗證；之後可加 rate limit 文件說明 |
| 錯誤洩漏 | 正式環境 `DEBUG=False`；訪客頁不顯示 traceback |
| 檔案上傳 | 第一版**不做**上傳；若做則白名單副檔名＋大小上限 |

---

## 3. Admin

- `/admin` 必須驗證（Basic Auth 或 session login 二選一，任務卡指定）
- 不做「全世界可看的個資列表」公開 URL
- 學習站資料視為**測試個資**：勿填真實客戶個資當 demo

---

## 4. AI 協作安全

- 貼給 AI 的內容：可貼 schema、錯誤訊息、**脫敏**後的 log  
- 不可貼：真實密碼、生產 DB 連線、客戶完整個資匯出  
- AI 若產出「關閉 CSRF／DEBUG=True 上線」→ **拒絕合併**

---

## 5. 與生產站（Cloudflare）的關係

- 學習站**預設不**接收合作社官網的真實表單流量  
- 若未來要「官網雙寫 Forms＋API」→ 另開任務卡＋夥伴同意＋HTTPS＋驗證，本階段不做
