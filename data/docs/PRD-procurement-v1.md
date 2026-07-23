# PRD v1.0 — 山莎蔓岸合作社 · 企業採購詢價（Phase 6）

| 欄位 | 內容 |
|---|---|
| Document ID | PRD-SANSAMAAN-PROCUREMENT-v1.0 |
| Owner | Sansamaan PM Workstream（兼前端） |
| Status | **Demo Ready**（展示版 mailto；Google Form ID 待接） |
| Last Updated | 2026-06-12 |
| Stakeholders | 合作社理事長、企業 ESG 採購窗口、學校總務 |
| Linked Artefacts | `shop.html`, `procurement.html`, `data/products.json`, `js/procurement-form.js`, `data/docs/procurement-google-form-setup.md` |
| Disclosure | **Forward-Looking Artefact** — 架構與前端已交付；後端 Form ID 待合作社確認 SKU 與理貨人力後上線。 |

---

## 1. Problem / Background

Phase 5 預約系統解決「參訪」轉換，但 **商品採購** 仍散落於 Email / LINE / 電話：

1. **B2C 與 B2B 混雜**：個人小單與企業禮盒（需統編、報價、合約）共用 mailto，資料難追溯。
2. **無商品展示載體**：企業窗口需先看 SKU 與 ESG 敘事，再決定是否詢價。
3. **仍須 Zero-Server**：資訊人力僅 1 人（兼職），不得自建金流與購物車後端。

## 2. Goals & Non-Goals

### Goals
- **G1**｜`shop.html` JSON 驅動商品型錄，雙語，可篩選分類。
- **G2**｜B2C 導流至 Pinkoi（平台 PCI），官網不收款。
- **G3**｜B2B 獨立 `procurement.html`，10 欄詢價表，架構同 booking。
- **G4**｜合作社 2–3 工作天報價 SLA；可開統編發票。

### Non-Goals
- **N1**｜官網內建購物車 / 線上刷卡（Phase 6 不做）。
- **N2**｜庫存即時同步（由平台或人工表管理）。
- **N3**｜國際物流自動報關（另案評估）。

## 3. Persona

| Persona | 路徑 | 驗收 |
|---|---|---|
| P04 企業 ESG 採購 | shop → procurement 表單 | 填完 ≤ 4 min，收到報價承諾 |
| P05 一般消費者 | shop → Pinkoi | 不離開品牌敘事即可進平台 |
| P03 學校總務（大宗） | procurement 直接進入 | 統編 + 數量欄位完整 |

## 4. Scope — 採購表單 10 欄

| # | 欄位 ID | 必填 | 類型 | Google Form 建議題型 |
|---|---|---|---|---|
| 1 | product | ✓ | select | 下拉選單 |
| 2 | company | ✓ | text | 簡答 |
| 3 | taxId | – | text(8) | 簡答 |
| 4 | contactName | ✓ | text | 簡答 |
| 5 | email | ✓ | email | 簡答（驗證 Email） |
| 6 | phone | ✓ | tel | 簡答 |
| 7 | quantity | ✓ | text | 簡答（例：100 組） |
| 8 | needInvoice | ✓ | select | 單選 |
| 9 | delivery | – | select | 下拉選單 |
| 10 | notes | – | textarea | 段落 |

### product 選項（須與 `data/products.json` id 對齊）

- charcoal-deodorizer / charcoal-humidifier / charcoal-fridge
- vinegar-spray / craft-basket / esg-gift-box / custom

## 5. System Architecture

```
[ shop.html · JSON 型錄 ]
        │
        ├── B2C ──→ Pinkoi（外部金流）
        │
        └── B2B ──→ procurement.html
                      │ fetch POST (no-cors)
                      ▼
              [ Google Form → Sheets ]
                      │
                      ▼
              [ 理事長 2–3 工作天報價 Email ]
```

## 6. 上線驗收（UAT 摘要）

| ID | 案例 | 預期 |
|---|---|---|
| U1 | shop 載入 products.json | 6 張卡片、分類篩選正常 |
| U2 | 點 Pinkoi | 新分頁開啟（URL 來自 JSON） |
| U3 | 點企業採購 | 進 procurement，`?product=` 預填 |
| U4 | 表單必填驗證 | 缺欄位無法送出 |
| U5 | 正式 FORM_ID 接上 | Sheets 新增一列 |
| U6 | `?lang=en` | 雙語切換正常 |

## 7. 維運（一人資訊）

| 任務 | 頻率 | 動作 |
|---|---|---|
| 新增 SKU | 依產品 | 編輯 `data/products.json` |
| 改 Pinkoi 連結 | 一次 | `channels.pinkoi.url` |
| 接 Google Form | 上線前 | 見 `procurement-google-form-setup.md` |
| 理貨 / 報價 | 平日合作社 | 非資訊職責 |

## 8. 相關頁面

- 客戶站：`../shop.html`、`../procurement.html`
- PM 展示：`../pages/Phase6-Commerce-Demo.html`
