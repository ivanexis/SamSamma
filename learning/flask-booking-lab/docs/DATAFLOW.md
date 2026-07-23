# DATAFLOW｜合理後端資料流（L1-4）

## 一句話

**官網生產**：Cloudflare＋Google Forms（可開「新回應 Email 通知」）＋Pinkoi 未來外連購買。  
**學習站**：表單 → DB（新進）→ Gmail 通知 → 後台改狀態（人工確認付款）。兩線不雙寫。

```
[訪客] 選「活動」或「商品」
   ↓
[Flask 驗證 + CSRF]
   ↓
[DB INSERT status=new]  ←── 一定會發生
   ↓
[SMTP Gmail → 工作人員] ←── 有設 MAIL_* 才寄；失敗不擋存檔
   ↓
[後台 /admin]
   新進置頂 → 已聯繫 → 已確認付款（人工）→ 結案
```

## 為什麼商品不是站內購買？

Pinkoi 未開賣前，站內「購買」會變成假結帳。  
改收 **商品**（同採購欄位概念），進度用人工狀態；真金流等 Pinkoi。

## Gmail 難不難？

**不難。** 技術上是標準 SMTP（約 30 行程式，已寫在 `app/notify.py`）。  
你要準備的是：

1. Gmail 開啟兩步驟驗證  
2. 建立「應用程式密碼」  
3. 寫進 `.env`（見下方）

約 10 分鐘設定；寄信失敗時資料**仍在資料庫**，後台看得到。

### `.env` 範例

```
MAIL_ENABLED=1
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=你的@gmail.com
MAIL_PASSWORD=十六位應用程式密碼
MAIL_FROM=你的@gmail.com
MAIL_TO=jeff11051212@gmail.com
```

## 官網雙寫（面試）

本機同時開：

1. Live Server：`http://127.0.0.1:5500/blog_uiux/index.html`  
2. `python run.py` → `5001`  

填 `#booking` → Google Sheets **＋** `/admin` 出現來源「官網雙寫」。  
Lab 沒開也不影響 Google 成功。

Google 表單 → 回應 → **取得新回應時以電子郵件通知我**  
→ 預約／採購本來就能通知；學習站是為了證明 Flask／DB／後台／通知鏈。

## 欄位對齊

| 類型 | 前端欄位 | 後台顯示 |
|------|----------|----------|
| 活動 | 方案、機構、聯絡人、Email、電話、備註 | 同左＋進度 |
| 商品 | 品項、數量、公司、統編、發票、配送、聯絡、備註 | 同左＋進度 |
