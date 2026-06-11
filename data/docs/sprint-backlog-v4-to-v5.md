# Sprint Backlog — v4 → v5 真實工時記錄

| 欄位 | 內容 |
|---|---|
| Document ID | BACKLOG-SANSAMAAN-v4-v5 |
| Sprint Window | 2025-12-20 ~ 2026-03-10（共 12 週、3 個 4 週 Sprint） |
| Methodology | Solo PM + Dev（單人 dual-role），週週 demo 給合作社理事長 |
| Total Effort | **64.5 工時**（含 PM 規劃 16 h + 開發 38 h + 維運/UAT 10.5 h） |
| Velocity Avg | 21.5 h / Sprint |
| Owner | Sansamaan PM Workstream |
| Disclosure | 對位國泰金控 JD I0001759「敏捷專案 Sprint 規劃」之 PM 產出物範本；工時為實際投入紀錄。 |

---

## Sprint 19｜2025-12-20 ~ 2026-01-16｜v4 痛點盤點 + UR 訪談

| ID | Type | Title | Acceptance | Est | Act |
|---|---|---|---|---|---|
| S19-01 | Discovery | 訪談合作社理事長 × 發起人 × 部落耆老 3 場 | 完成 3 場 ≥ 40 分鐘記錄 | 6 | 7 |
| S19-02 | Research | 整理 USR 學生 9/7 入山照片與口語回饋 | 產出 Interview Log I01 | 3 | 2.5 |
| S19-03 | Analysis | 鄰社老人 11/17 來訪觀察 + Interview Log I02 | 完成 design feedback 摘要 | 2 | 2 |
| S19-04 | Research | 反向整理企業 ESG 來電諮詢 → Interview Log I03 | 1 篇紀錄 + 5 條 design feedback | 1 | 1 |
| S19-05 | Synthesis | 3 條 Persona + 12 題 FAQ 對應矩陣 | 產出 `persona-data.json` 草稿 | 5 | 6 |
| S19-06 | Review | 與合作社 Demo + 同意 v5 範圍 | 簽核會議紀錄 | 2 | 1.5 |
| **Subtotal** | | | | **19** | **20.0** |

---

## Sprint 20｜2026-01-17 ~ 2026-02-13｜v5 IA 設計 + 預約系統開發

| ID | Type | Title | Acceptance | Est | Act |
|---|---|---|---|---|---|
| S20-01 | IA | User Flow / Site Map mermaid 製圖 | 兩張可在 Mermaid Live 預覽 | 3 | 3 |
| S20-02 | IA | Wireframe 3 張 SVG（hero / plans / booking） | 3 個 .svg 檔可放入 #ia-artefacts | 4 | 5 |
| S20-03 | Dev | Hero 區 4 顆 fact chips + bilingual headline | LCP < 2.5 s | 3 | 3.5 |
| S20-04 | Dev | #plans 三卡（教育 / ESG / 文化）+ per-card CTA | URL 帶 `?plan=` 預填 | 5 | 6 |
| S20-05 | Dev | Google Forms 13 欄位嵌入 + 前端驗證 | 必填紅框 + 中文錯誤 | 4 | 5 |
| S20-06 | Dev | #contact FAQ accordion + 12 題 | a11y Tab 巡覽 | 3 | 4 |
| S20-07 | Dev | i18n URL `?lang=zh/en` 切換 | 全頁雙語可切 | 4 | 5.5 |
| **Subtotal** | | | | **26** | **32.0** |

---

## Sprint 21｜2026-02-14 ~ 2026-03-10｜上線 / UAT / 文件回填

| ID | Type | Title | Acceptance | Est | Act |
|---|---|---|---|---|---|
| S21-01 | QA | UAT 12 案例執行 + 3 個缺陷修復 | 全 P0 通過 | 5 | 5.5 |
| S21-02 | Ops | 理事長 SOP 教育訓練（5 個 SOP × 2 場） | 理事長獨立操作通過 | 3 | 2.5 |
| S21-03 | Docs | PRD-v1.md 反向結構化撰寫 | 1 頁 1300 字 | 2 | 2 |
| S21-04 | Docs | UAT-plan.md + UAT-log.md 撰寫 | 12 TC + 3 defects | 1.5 | 1 |
| S21-05 | Docs | manual-co-op.md（教育手冊） | 5 個 SOP | 1 | 1 |
| S21-06 | Deploy | Cloudflare DNS + GitHub Pages 上線 | 線上 200 OK | 0.5 | 0.5 |
| **Subtotal** | | | | **13** | **12.5** |

---

## 工時總結與分析

| 類別 | 工時 | 占比 |
|---|---|---|
| Discovery / Research | 11.5 h | 17.8% |
| IA / Wireframe | 8 h | 12.4% |
| Dev / Frontend | 24 h | 37.2% |
| QA / UAT | 8 h | 12.4% |
| Docs / Manual | 5.5 h | 8.5% |
| Ops / Deploy / Demo | 7.5 h | 11.6% |
| **Total** | **64.5 h** | 100% |

### 估算誤差分析
- **3 個 Sprint 估 58 h，實際 64.5 h，誤差 +11.2%**（業界 ±20% 內可接受）。
- 偏差最大者：S20-07 i18n（+37%）— 因 URL-driven 切換需處理 anti-FOUC，事前低估。
- 偏差最小者：S21-06 Deploy（0%）— 已熟悉 Cloudflare / GH Pages 流程。

### 回顧（Retrospective）
- **Went Well**：Sprint 19 的 Persona 反向整理省下後續開發迷失方向的時間；3 場 Interview Log 直接驅動 12 題 FAQ 設計。
- **To Improve**：i18n 開發前未做 spike，下次涉及全域能力先做 1 日 spike 再下估算。
- **Action Item**：未來新功能皆需在規劃 Sprint 內加 1 個「未知探索」buffer block（≥ 2 h）。

---

## 版本紀錄

| Version | Date | Author | Change |
|---|---|---|---|
| v1.0 | 2026-06-07 | PM | 反向結構化首版（基於 Git commits + 個人工時表） |
