# PRD v1.0 — 山莎蔓岸合作社預約系統

| 欄位 | 內容 |
|---|---|
| Document ID | PRD-SANSAMAAN-BOOKING-v1.0 |
| Owner | Sansamaan PM Workstream（兼前端） |
| Status | Released (deployed to production 2026-Q1) |
| Last Updated | 2026-06-07 |
| Stakeholders | 合作社理事長、發起人、明新科大 USR 老師、企業 ESG 採購窗口 |
| Linked Artefacts | `data/persona-data.json`, `data/ia/user-flow.mmd`, `data/ia/prototype-spec.json`, `data/docs/UAT-plan.md` |
| Disclosure | **Reverse-Engineered Artefact** — 本 PRD 為已上線系統的反向結構化文件，依 v5 真實上線範圍補齊撰寫，符合敏捷專案「先交付、後補規格」之常見實務。 |

---

## 1. Problem / Background

合作社擁有 12 公頃竹林、4 類來訪族群（學校 USR、企業 ESG、文化體驗、社區參訪），但 v4 之前僅有理事長個人手機接收電話與 LINE 訊息，呈現以下 3 項痛點：

1. **訊息散落**：電話、LINE、Email 三處共存，無單一真實來源（Single Source of Truth）。
2. **無 SLA**：訪客送出詢問後無回覆時間承諾，導致企業窗口流失。
3. **無預算養工程師**：合作社全年資訊預算 = 0；任何方案不得引入伺服器、資料庫授權、第三方付費 SaaS。

## 2. Goals & Non-Goals

### Goals (G1-G4)
- **G1**｜建立單一預約入口，匯集 13 欄關鍵資訊。
- **G2**｜明確承諾「3 個工作天內 Email 確認」之 SLA。
- **G3**｜後端 0 元成本，理事長能獨立維運（不依賴 PM）。
- **G4**｜支援雙語（zh-TW / en-US）以利國際交流（京都府 / USR 國際組）。

### Non-Goals
- **N1**｜不做線上付款（金流合規成本過高）。
- **N2**｜不做即時聊天（人力無法支撐 24/7）。
- **N3**｜不做會員系統（一次性參訪為主，無需登入）。

## 3. User Persona Coverage

| Persona | Coverage | Key Acceptance |
|---|---|---|
| P01 學生（USR）   | ✓ Education 方案下拉選項 + 預填學校欄位 | TP1 happy-path ≤ 3 min |
| P02 老人社區     | ✓ FAQ 含雨備 / 成團 / 飲食 / 無障礙   | TP2 happy-path ≤ 4 min |
| P03 企業 ESG     | ✓ 統編欄位 + ESG 揭露 FAQ + 案例佐證    | TP3 happy-path ≤ 5 min |

> 完整 Persona 細節見 `data/persona-data.json#personas`；測試路徑見 `data/ia/prototype-spec.json#test_paths`。

## 4. Scope — 13 Form Fields

| # | 欄位 | 必填 | 類型 | 備註 |
|---|---|---|---|---|
| 1 | 姓名 | ✓ | text | — |
| 2 | 聯絡電話 | ✓ | tel | 前端正則驗證 09xxxxxxxx |
| 3 | Email | ✓ | email | RFC5322 |
| 4 | 單位 / 學校 / 公司 | – | text | — |
| 5 | 統一編號 | – | text(8) | 企業勾選 ESG 方案時 highlight |
| 6 | 參訪方案 | ✓ | select | Education / ESG / Culture / Senior |
| 7 | 參訪人數 | ✓ | number | 1-50 |
| 8 | 預定日期 | ✓ | date | 須 ≥ 今日 + 14 天 |
| 9 | 備援日期 | – | date | — |
| 10 | 飲食需求 | – | select | 葷 / 蛋奶素 / 純素 / 過敏 |
| 11 | 交通安排 | – | select | 自駕 / 包車 / 大眾運輸 |
| 12 | 備註 | – | textarea | ≤ 500 字元 |
| 13 | 同意條款 | ✓ | checkbox | 個資 + 拍攝授權 |

## 5. System Architecture (Zero-Server)

```
[ Visitor Browser ]
        │ POST (HTTPS)
        ▼
[ Google Forms iframe ]   ← embed in #booking
        │
        ▼
[ Google Sheets ]         ← auto-archive (1 row / submission)
        │  (manual trigger)
        ▼
[ Co-op Chair / Founder ] ← review within 1 working day
        │
        ▼
[ Email Reply ]           ← personalized confirmation within 3 working days
```

**設計決策**：採 Google Forms + Sheets，總授權成本 NT$ 0／年；理事長以日常 Google 帳號即可維運，無需 SSH、無需 git。

## 6. Functional Requirements (FR)

- **FR-01** Visitor SHALL be able to submit a booking within 90 seconds on a 4G mobile network.
- **FR-02** System SHALL render bilingual UI driven by `?lang=zh` / `?lang=en` URL parameter.
- **FR-03** Required fields SHALL show inline error in zh-TW upon blur.
- **FR-04** On submit success, system SHALL display a confirmation Toast / Modal within 1.5 s and reset the form.
- **FR-05** Submitted data SHALL land in Google Sheets within 5 s of submission (Google's native SLA).
- **FR-06** Co-op SHALL respond by Email within 3 working days; if exceeded, FAQ instructs visitor to call 0975-958-121.

## 7. Non-Functional Requirements (NFR)

| Code | Requirement | Target | Verified |
|---|---|---|---|
| NFR-01 | First Contentful Paint (mobile 4G) | < 2.0 s | ✓ 1.6 s (PageSpeed v5) |
| NFR-02 | Largest Contentful Paint | < 2.5 s | ✓ 1.8 s |
| NFR-03 | WCAG 2.1 AA — colour contrast | AA pass | ✓ axe-core 0 critical |
| NFR-04 | a11y — keyboard navigation | full Tab cycle | ✓ |
| NFR-05 | Cost of operation | NT$ 0 / yr | ✓ |
| NFR-06 | Browser support | Safari 14+, Chrome 90+, Edge 90+ | ✓ |

## 8. Out of Scope (will revisit in v2)

- 線上信用卡 / LinePay 付款（金流合規成本待評估）
- 多場次自動排程（涉及行事曆同步）
- LINE Bot 同步通知（理事長無 LINE Bot 開發資源）

## 9. Release Criteria

1. UAT 全部 P0 案例通過（見 `data/docs/UAT-plan.md`）。
2. 理事長能獨立完成「收件 → 回信 → 歸檔」3 步 SOP（見 `data/docs/manual-co-op.md`）。
3. 線上 LCP < 2.5 s（PageSpeed Insights 行動版）。
4. FAQ 已涵蓋 P01/P02/P03 的 12 題 gating questions。

## 10. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| v1.0 | 2026-06-07 | PM | 反向結構化首版（基於 v5 上線範圍） |
