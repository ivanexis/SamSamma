# UAT Plan & Log — 山莎蔓岸合作社預約系統 v5 上線驗收

| 欄位 | 內容 |
|---|---|
| Document ID | UAT-SANSAMAAN-v5.0 |
| Linked PRD | `data/docs/PRD-v1.md` |
| Test Window | 2026-Q1（v5 正式上線前 1 週） |
| Owner | Sansamaan PM Workstream |
| Disclosure | **Reverse-Engineered Artefact** — 真實上線後，依照 3 條 Persona × 13 欄表單反向結構化撰寫。 |

---

## 1. Test Strategy

- **層級**：以「Persona × Happy Path」為單元（取代傳統 Function-by-Function 列表），更貼近合作社真實風險。
- **環境**：Production = Staging（單一 GitHub Pages 分支；無獨立 staging 環境，凍 commit 1 週）。
- **資料**：使用 3 組假帳號 `uat+p01@`, `uat+p02@`, `uat+p03@`，提交後 Sheets 行尾自動標記 `[UAT]`。
- **退場條件**：P0 案例 100% 通過、P1 案例 ≥ 90% 通過、無 Sev-1 缺陷未結。

## 2. Test Cases (12)

### Persona P01 學生（USR）— TP1
| ID | Severity | Description | Expected | Actual | Status |
|---|---|---|---|---|---|
| TC-01 | P0 | 學生用手機 iPhone 12 / Safari 開啟首頁 | LCP < 2.5 s，看到 4 顆 fact chips | 1.8 s, 4 chips | ✅ |
| TC-02 | P0 | 點 #plans 教育卡 CTA 跳預約表單 | URL 帶 `?plan=edu` 並預填方案欄位 | 通過 | ✅ |
| TC-03 | P0 | 提交完整表單（含學校單位） | 1.5 s 內顯示確認 Toast | 1.1 s | ✅ |
| TC-04 | P1 | 切英文 `?lang=en` 重複 TC-03 | 全表單英文化、提交成功 | 通過 | ✅ |

### Persona P02 老人社區 — TP2
| ID | Severity | Description | Expected | Actual | Status |
|---|---|---|---|---|---|
| TC-05 | P0 | 帶隊長以平板開 #contact 查詢『下雨會取消嗎』 | FAQ accordion 展開，回答 ≤ 80 字 | 通過 | ✅ |
| TC-06 | P0 | 在 #plans 找『銀髮社區』訊息 | 在文化卡內找到 8 人成團註記 | 通過 | ✅ |
| TC-07 | P0 | 提交飲食需求 = 過敏 + 備註 | Sheets 完整收到，備註不截斷 | 完整 | ✅ |
| TC-08 | P1 | 提交日期 = 今日 + 7 天（< 14 天） | 前端顯示中文錯誤『請至少預留 14 天』 | 通過 | ✅ |

### Persona P03 企業 ESG — TP3
| ID | Severity | Description | Expected | Actual | Status |
|---|---|---|---|---|---|
| TC-09 | P0 | 採購窗口尋找『可否開立統編』 | FAQ F08 直接回答 + 統編 95216178 | 通過 | ✅ |
| TC-10 | P0 | 提交表單時填寫統編 + 選 ESG 方案 | Sheets 統編欄位有資料 | 完整 | ✅ |
| TC-11 | P0 | 從 #cases 連結下載 `carbon-data.json` | 200 OK，檔案完整可解析 | 完整 | ✅ |
| TC-12 | P1 | 在 Edge 96 桌機重複 TC-09 → TC-11 | 表現一致 | 通過 | ✅ |

## 3. Defects Found & Resolved

| ID | Severity | Found | Fixed | Resolution |
|---|---|---|---|---|
| D-01 | Sev-2 | TC-05 行動裝置 FAQ accordion 點擊後 +/− 圖示未更新 | Fixed v5.0.1 | 加 `aria-expanded` toggle 並 sync 圖示 |
| D-02 | Sev-3 | TC-04 英文版 `#plans` 卡片高度因英文較長而錯位 | Fixed v5.0.1 | `min-height: 380px` + flex 對齊 |
| D-03 | Sev-3 | TC-08 中文錯誤訊息字串未本地化 | Fixed v5.0.2 | 接 i18n key `error.lead_time` |

## 4. Sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| 合作社理事長 | （略） | 2026-Q1 | ✓ 同意上線 |
| 發起人 | Ivan | 2026-Q1 | ✓ 同意上線 |
| PM / 開發 | Sansamaan PM | 2026-Q1 | ✓ 釋出 v5.0.2 |

## 5. Post-launch Monitoring (D+30)

- Google Sheets 收件數：47 筆（含 6 筆 UAT 標記、41 筆真實預約）
- 平均回信時間：1.7 工作天（SLA = 3）
- 主要訪客比例：學校 53% / 企業 22% / 文化 16% / 社區 9%
- 0 件 Sev-1 / Sev-2 線上缺陷回報
