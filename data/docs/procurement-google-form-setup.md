# Google 採購詢價表 · 建置手冊（複製預約表單做法）

> 對象：趙冠柏（資訊）+ 合作社理事長（試填驗收）  
> 預計時間：30–45 分鐘  
> 完成後：更新 `js/procurement-form.js` 的 `FORM_ID` 與 `FIELD_MAP`

---

## Step 1｜建立表單

1. 登入合作社 Google 帳號
2. Google 表單 → **空白表單**
3. 標題：`山莎蔓岸 · 企業採購詢價`
4. 說明：填寫後 2–3 工作天內 Email 報價

---

## Step 2｜依序新增 10 題（題目文字需與下方完全一致）

| 順序 | 題型 | 題目文字（複製貼上） | 選項 |
|------|------|---------------------|------|
| 1 | 下拉式選單 | 意向商品 | 見 PRD 商品列表 |
| 2 | 簡答 | 公司 / 機構名稱 | — |
| 3 | 簡答 | 統一編號 | — |
| 4 | 簡答 | 聯絡人 | — |
| 5 | 簡答 | Email | 勾選「回覆驗證」 |
| 6 | 簡答 | 電話 | — |
| 7 | 簡答 | 預計數量 | — |
| 8 | 單選 | 是否需要發票 | 要開統編發票 / 不需發票 |
| 9 | 下拉式選單 | 配送方式 | 宅配到府 / 集中配送 / 到合作社自取 |
| 10 | 段落 | 備註 | — |

**意向商品下拉選項：**

```
竹炭除臭包
竹炭除濕包
冰箱除臭竹炭磚
竹醋液生活噴霧
賽夏竹編小籃
ESG 企業禮盒
客製組合
```

---

## Step 3｜連結試算表

1. 表單 → **回應** → 連結到試算表 → 建立新試算表  
2. 試算表命名：`山莎蔓岸採購詢價紀錄`

---

## Step 4｜取得 FORM_ID 與 entry ID

### FORM_ID

發布表單後，網址形如：

```
https://docs.google.com/forms/d/e/1FAIpQLScxxxxxxxxxxxxxxxxxxxxxxxxx/viewform
```

`1FAIpQLSc...` 整段即 **FORM_ID**。

### entry.xxxxx（欄位 ID）

方法一（推薦）：

1. 表單 → **預先填入網址**
2. 每題隨便填測試值 → 取得連結
3. URL 參數即 `entry.123456789=測試值`，記下每題 entry 數字

方法二：瀏覽器開發者工具檢視表單 HTML `name="entry.xxx"`

---

## Step 5｜寫入 procurement-form.js

開啟 `blog_uiux/js/procurement-form.js`：

```
var FORM_ID = '1FAIpQLSfYtxaYu4OnWSkS9AFdB8xRcjR7FyRoS_P_idODyCZHXuFf1w';

var FIELD_MAP = {
  product:      'entry.2124265472',
  company:      'entry.1956664878',
  taxId:        'entry.1668368198',
  contactName:  'entry.1365136276',
  email:        'entry.1258305091',
  phone:        'entry.1834958036',
  quantity:     'entry.954046029',
  needInvoice:  'entry.1921148235',
  delivery:     'entry.554810776',
  notes:        'entry.823967188'
};
```

> 已於 2026-07-23 寫入 `js/procurement-form.js`。下文 Step 5 可略過；改做試送驗收。

儲存後，打開 `procurement.html` 試送一筆 → 確認試算表新增一列。

---

## Step 6｜通知理事長（建議）

Google 表單 → 回應 → **取得新回應時以電子郵件通知我**

或試算表：擴充功能 → 通知規則 → 新列時 Email。

---

## 故障排除

| 現象 | 處理 |
|------|------|
| 送出成功但試算表沒資料 | entry ID 錯誤，重查預填 URL |
| 下拉選項沒寫入 | 網頁 option value 與表單選項文字不一致 |
| 展示版一直開 Email | `FORM_ID` 仍為空字串，完成 Step 5 |

---

## 與預約表單差異

| 項目 | 預約 booking | 採購 procurement |
|------|-------------|------------------|
| 頁面 | index.html#booking | procurement.html |
| 欄位數 | 11 | 10 |
| 後續 | 確認參訪日期 | 報價 + 匯款 + 出貨 |
| JS | index.html 內嵌 | procurement-form.js |

兩張表、兩個試算表，**不要混在同一張 Google Form**。
