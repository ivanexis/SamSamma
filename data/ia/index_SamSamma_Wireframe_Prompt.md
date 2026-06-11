# FIGMA Wireframe 提示詞｜index_SamSamma.html v5.5

> 建檔：2026-06-08
> 對齊版本：`index_SamSamma.html` v5.5（故事 + 預約 雙焦點客戶網站）
> 用途：餵給 FigmaAI / Galileo AI / Uizard / Visily / Magic Patterns 等 AI Wireframe 生成器
> 對應 PM 履歷頁：`SamSamma.html` § 02.6 IA Artefacts 區段

---

## A. 一次餵滿（Master Prompt · 直接複製使用）

> 把下方整段貼進 FigmaAI 對話框（或 Galileo AI / Visily 的「自然語言生成」入口），即可生成低保真 Wireframe 草稿。

```
Create a low-fidelity wireframe for a single-page bilingual (Traditional Chinese + English)
client-facing website for a Taiwanese indigenous bamboo-cooperative named "Sansamaan
山莎蔓岸". The site has only TWO focal points: STORY + BOOKING. No e-commerce, no
case-grid, no venue-tour gallery.

Target users: 3 personas — (1) School USR Coordinators, (2) Enterprise ESG/CSR
Procurement, (3) Cultural/Family Travelers. The whole site converges into ONE
in-page booking form that submits directly to Google Forms backend without
redirection.

Tech stack: HTML5 + Bootstrap 5.3 + AOS + Font Awesome + vanilla JS (no React,
no framework). i18n via inline <span data-i18n-lang="zh|en"> markers. Booking
form uses fetch POST to Google formResponse endpoint with mode:'no-cors',
shows in-page success panel on completion, falls back to mailto on failure.

Design language:
- Color palette: bamboo green (#4a7c59 / #2d4a36), gold (#c9a96e / #d4af37),
  cream/parchment (#f5f0e8 / #fdfaf2), dark green (#1f2d23), pure black footer
- Typography: 'Noto Sans TC' + 'Inter', magazine-style large H1 with serif
  accent for storytelling sections
- Visual rhythm from top to bottom: deep green → cream → deep green → light
  cream (FAQ card) → black (footer)
- Storytelling sections use editorial/documentary photography hero style;
  data sections use 2×2 fact-grid trust panels

Generate the following 5 KEY SCREENS as separate frames in a Figma file at
1440×900 desktop viewport (also generate 375×812 mobile variants):

═════════════════════════════════════════════════════════════════════════
SCREEN 1 ── #home Hero (above-the-fold) · v5.6 Culture × Trust Matrix
═════════════════════════════════════════════════════════════════════════
Layout: Two-column 1fr 1fr at desktop, stacked on mobile.
LEFT column:
  - Small "Saisiyat raromaeh" eyebrow label in gold
  - Magazine-style H1 in Chinese: "山中的竹之家" (bilingual EN subtitle below)
  - Lead paragraph (3 lines max) about bamboo + indigenous co-op
  - Single primary CTA button (gold) "立即預約 / Book Now" → smooth-scroll
    anchor to #bookingForm (NOT external link, NOT new tab)
RIGHT column: "Culture × Trust Matrix" — a TWO-LAYER glassmorphism card.
NEVER render a duplicate company logo here (causes visual redundancy with
nav logo, the brain ignores duplicates within the first 3s).

  TOP LAYER — Cultural Anchor (hashtag tag-cloud):
    - Small uppercase eyebrow in gold: "CORE PILLARS · 核心價值"
    - 6 pill-shaped hashtags in 2-line flex-wrap layout:
      # 文化復振 / Culture Revival
      # 土地共生 / Land Symbiosis
      # 部落自主 / Tribal Autonomy
      # 循環經濟 / Circular Economy
      # 青年洄游 / Youth Return
      # 共榮永續 / Shared Prosperity
    Each pill: semi-transparent forest-green bg (rgba(74,124,89,0.28)),
    gold border on hover, gentle lift transform.

  ──────── GOLD GRADIENT DIVIDER ────────
  (linear-gradient 90deg from transparent → rgba(212,175,55,0.35) → transparent)

  BOTTOM LAYER — Quantified Trust (2×2 fact-grid):
  ┌─────────────────┬─────────────────┐
  │  12 ha          │  Founded 2024   │
  │  bamboo forest  │  legal co-op    │
  ├─────────────────┼─────────────────┤
  │  MUST × USR     │  Kyoto 2026     │
  │  university tie │  exhibition     │
  └─────────────────┴─────────────────┘
  Each cell: big gold Inter number/keyword (1.55rem, 800 weight) +
  small white descriptive label (0.78rem, 500 weight).

Card padding 2rem 1.5rem · border 1px solid rgba(212,175,55,0.35) ·
border-radius 24px · backdrop-filter blur(16px) ·
box-shadow 0 20px 50px rgba(0,0,0,0.35).

Background: full-bleed bamboo forest photo overlay with 70% dark green tint.
Logo top-left, slim 5-item nav top-right: 關於 / 足跡 / 方案 / 流程 / 預約

DESIGN RATIONALE (mention in Figma frame caption):
"Two-layer matrix hits B2B/USR decision-makers' first 3s with simultaneous
emotional (cultural affinity) + rational (quantified trust) signals.
The same 6 keywords later expand into a 6-pillar card grid in #about
section — Progressive Disclosure overview → detail pattern."

═════════════════════════════════════════════════════════════════════════
SCREEN 2 ── #about (合作社故事 + 6 支柱卡)
═════════════════════════════════════════════════════════════════════════
Section eyebrow "OUR STORY", H2 "關於山莎蔓岸 / About Sansamaan".
Lead paragraph (2 short paragraphs) — bilingual.
6-pillar grid (3 columns × 2 rows on desktop, 2 columns × 3 rows on tablet,
1 column on mobile) — each pillar card has:
  - Font Awesome icon top
  - Pillar title (zh+en)
  - 1-line description
  - Subtle gold border-bottom
The 6 pillars: 文化復振 / 土地共生 / 部落自主 / 循環經濟 / 青年洄游 / 共榮永續
Card background: cream (#fdfaf2), hover lifts with gold underline.

═════════════════════════════════════════════════════════════════════════
SCREEN 3 ── #why-us (我們的足跡 mini-timeline + 3-act story)
═════════════════════════════════════════════════════════════════════════
Section eyebrow "OUR JOURNEY".
TOP: Horizontal mini-timeline — 6 dots across 24 months (2024/06 → 2026/05),
     each dot is a milestone with date + 1-line caption.
MIDDLE: 3-act story column (vertical), each act is a hero card with:
     - Act number 01/02/03 in large display type
     - Act title (zh+en)
     - 2-3 line narrative
     - Documentary photo on alternating left/right
     Act 01: 部落篇 (tribe) — co-op formation
     Act 02: 大學 USR 篇 — academic-industry collaboration
     Act 03: 京都篇 — international exhibition 2026
BOTTOM: One short "story-prelude" italic quote before the next section.

═════════════════════════════════════════════════════════════════════════
SCREEN 4 ── #plans (3 Persona Cards 來山裡走走)
═════════════════════════════════════════════════════════════════════════
Section eyebrow "PLANS", H2 "來山裡走走 / Pick Your Path".
Three side-by-side cards at desktop (1024px+), stacked on tablet & mobile:
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ 📚 EDU       │ │ 🏢 ESG       │ │ 🎋 CULTURAL  │
  │              │ │              │ │              │
  │ 學校教育     │ │ 企業 ESG 認養 │ │ 文化體驗     │
  │ USR 方案     │ │ 採購方案     │ │ 深度旅遊     │
  │              │ │              │ │              │
  │ • 時長       │ │ • 時長       │ │ • 時長       │
  │ • 成團人數   │ │ • 成團人數   │ │ • 成團人數   │
  │ • 交付物     │ │ • 交付物     │ │ • 交付物     │
  │              │ │              │ │              │
  │ [選此方案 →] │ │ [選此方案 →] │ │ [選此方案 →] │
  └──────────────┘ └──────────────┘ └──────────────┘
Each CTA button passes ?plan=education|esg|cultural to pre-fill the form.
Card has 3-step "process-step" mini-flow above: 1️⃣ 線上填表 → 2️⃣ 2 工作天回覆 → 3️⃣ 確認成行

═════════════════════════════════════════════════════════════════════════
SCREEN 5 ── #booking (booking-faq + booking-info + booking-form)
═════════════════════════════════════════════════════════════════════════
Top: section header "預約造訪 / Book Your Visit" on deep green (#1f2d23) bg.

PART A: booking-faq (light cream card #fdfaf2 floating on the deep green)
  - Section eyebrow "BEFORE YOU BOOK · 預約前常見問題"
  - 6 <details>/<summary> accordion items (native HTML, no JS):
    Q1 開立統編？ / Q2 雨備？ / Q3 飲食？ / Q4 改期？ / Q5 接駁？ / Q6 ESG 證明？
  - Each <details> closed by default, gold chevron rotates on open.

PART B: booking-content (two-column 1fr 1.2fr on desktop, stacked on mobile)

  LEFT — booking-info card (sticky on scroll):
    - Phone (large display) +886-xxx
    - Email (large display)
    - Address: 新竹縣五峰鄉…
    - SLA card: "2 工作天回覆 · 7 天免費改期 · 颱風全退費"
    - Tax-ID card (統一編號 + invoice ready)
    - Rain-backup card (雨備方案)
    - Trust badges row at bottom

  RIGHT — booking-form (white card, 4 numbered sections):
    Section 1 「選擇方案」: radio group — Edu / ESG / Cultural
    Section 2 「聯絡資訊」: 4 fields — orgName / contactName / email / phone
    Section 3 「行程細節」: participants(number) / date(date-picker) /
                          duration(select) / budget(select)
    Section 4 「加值選項與備註」: addons checkboxes (6 options) / notes(textarea)
    Submit button (full-width gold) "送出預約 / Submit Booking"
    Notice card above button: "本表單直送 Google 表單後台，不會跳離本頁。"
    Loading state: spinner + "送出中…"

  SUCCESS PANEL (hidden by default, fades in on submit success):
    ✓ Large green checkmark with bounce animation
    "預約已送出 / Booking Submitted"
    Subtext: "我們會在 2 個工作天內以電話/Email 回覆。"
    "再送出一份 / Submit Another" button to reset form

  ERROR STATE (red banner):
    "⚠️ 連線異常，已為您開啟 Email 視窗備援"
    Auto-opens mailto: with all user input pre-filled in body

Footer (separate <footer> with black bg + top gold 4px border):
  4 columns: 品牌簡介 / 探索（5 items）/ 聯絡（3 items）/ 法律
  Bottom bar: © 2026 山莎蔓岸合作社 · Sansamaan Co-op

═════════════════════════════════════════════════════════════════════════
GLOBAL RULES
═════════════════════════════════════════════════════════════════════════
- NO floating chatbot widget (currently disabled).
- NO standalone #venue or #cases sections (removed in v5.4 streamlining).
- NO #contact section (info merged into booking-info left rail).
- Nav: 5 items only — 關於 / 足跡 / 方案 / 流程 / 預約
- All CTAs link to in-page anchors only (no external pages, no new tabs).
- AOS fade-up animations on every section, 50–150ms stagger.
- Mobile: hamburger nav, single column, sticky bottom CTA bar "立即預約".
- Accessibility: semantic <section>/<article>/<details>/<form>, ARIA labels,
  focus-visible outlines, keyboard nav, color contrast AA.

Output: 5 Figma frames (desktop 1440×900) + 5 mobile variants (375×812),
all with proper auto-layout, named styles for colors/typography, and
component library for: nav-bar, fact-grid-cell, pillar-card, persona-card,
process-step, faq-item, form-section, info-card, success-panel.
```

---

## B. 分段提示詞（Per-Screen Prompts · 一次一張）

> 若 AI 工具一次處理不了上面整段，可用下列分段版逐張生成。

### B.1 SCREEN 1 ── Hero (v5.6 Culture × Trust Matrix)

```
Generate a hero section wireframe for a bilingual (zh-TW + en) bamboo
co-op website. Two-column 1fr 1fr layout at 1440px desktop.

Left column (60% content weight):
- Small gold eyebrow label "Saisiyat raromaeh"
- Magazine-style H1 "山中的竹之家" in dark green
- English subtitle below: "Where bamboo grows into a way of living"
- 3-line lead paragraph
- Single gold primary CTA button "立即預約 / Book Now" (anchor #bookingForm)

Right column: TWO-LAYER "Culture × Trust Matrix" glassmorphism card.
DO NOT render a duplicate company logo here — the nav already shows it,
a second logo creates Visual Redundancy and gets ignored.

TOP LAYER — Cultural Anchor:
- Gold uppercase eyebrow "CORE PILLARS · 核心價值"
- 6 pill-shaped hashtags wrapping in 2 lines:
  #文化復振 #土地共生 #部落自主 #循環經濟 #青年洄游 #共榮永續
- Pill style: semi-transparent forest green bg, white text, hover to gold

GOLD GRADIENT DIVIDER (linear-gradient horizontal, 1px height)

BOTTOM LAYER — Quantified Trust 2×2 fact-grid:
- Cell 1: "12 ha" + "bamboo forest"
- Cell 2: "Founded 2024" + "legal co-op"
- Cell 3: "MUST × USR" + "university tie"
- Cell 4: "Kyoto 2026" + "exhibition"
- Big gold Inter numbers + small white descriptive labels

Card: backdrop-filter blur(16px), gold 1px border, 24px radius,
deep shadow, padding 2rem 1.5rem.

Background: full-bleed forest photo with 70% dark green overlay.
Top nav: logo left, 5-item nav right (關於/足跡/方案/流程/預約), lang switcher.

Use semantic HTML structure as visual annotations. Output as Figma frame.
Add a small caption: "Two-layer matrix — emotional × rational dual strike
for B2B / USR decision paths in first 3s."
```

### B.2 SCREEN 2 ── About + 6 Pillars

```
Generate an "About" section wireframe with:
- Section eyebrow "OUR STORY"
- H2 bilingual title
- 2-paragraph bilingual lead text
- 6-pillar grid (3×2 desktop, 2×3 tablet, 1 col mobile)

Each pillar card: Font Awesome icon top + zh title + en title + 1-line desc.
Card style: cream bg (#fdfaf2), gold border-bottom, hover-lift shadow.

Pillars (in order): 文化復振 / 土地共生 / 部落自主 / 循環經濟 / 青年洄游 / 共榮永續
```

### B.3 SCREEN 3 ── Why-Us Timeline + 3-Act Story

```
Generate a "Journey" section wireframe.
Top: horizontal mini-timeline with 6 milestone dots (2024/06 → 2026/05),
each dot has date + 1-line caption above/below alternating.

Middle: 3 storytelling cards stacked vertically, alternating photo position
(left/right). Each card:
- Large display act number "01" / "02" / "03"
- Act title bilingual
- 2–3 line narrative
- Documentary-style photo placeholder (16:9)

Acts: 01 部落篇 / 02 大學 USR 篇 / 03 京都篇

Bottom: italic quote line as story-prelude before next section.
```

### B.4 SCREEN 4 ── 3 Persona Cards

```
Generate a "Plans" section with 3 side-by-side persona cards at desktop.

Each card includes:
- Emoji + persona tag (📚 EDU / 🏢 ESG / 🎋 CULTURAL)
- Plan name bilingual
- 3-row spec list: duration / group size / deliverable
- Gold "選此方案 →" CTA button (passes ?plan=<key>)

Above the cards: a 3-step horizontal process flow
1️⃣ 線上填表 → 2️⃣ 2 工作天回覆 → 3️⃣ 確認成行

Cards stack to single column on mobile (<768px).
```

### B.5 SCREEN 5 ── Booking (FAQ + Info + Form)

```
Generate the booking section wireframe with 3 stacked parts on deep green
(#1f2d23) background.

PART A — booking-faq card (cream #fdfaf2 floating card):
- Eyebrow "BEFORE YOU BOOK · 預約前常見問題"
- 6 native HTML <details>/<summary> accordion rows
- Topics: 統編 / 雨備 / 飲食 / 改期 / 接駁 / ESG 證明

PART B — Two-column booking-content (1fr 1.2fr desktop):

LEFT: booking-info sticky card
- Phone (large) / Email / Address
- SLA card: 2 工作天回覆 / 7 天免費改期 / 颱風全退費
- Tax-ID card (統編可開發票)
- Rain-backup card
- Trust badges row

RIGHT: booking-form (white card) with 4 numbered sections
- S1 選擇方案: radio (Edu/ESG/Cultural)
- S2 聯絡資訊: orgName / contactName / email / phone
- S3 行程細節: participants(num) / date / duration(select) / budget(select)
- S4 加值選項與備註: addons checkboxes (6) / notes(textarea)
- Notice card: "本表單直送，不跳離本頁"
- Full-width gold submit button with loading state

HIDDEN states (overlay or sibling):
- Success panel: large green checkmark + "預約已送出" + reset button
- Error banner: red + mailto fallback note

PART C — Site footer (black bg, gold 4px top border)
- 4 columns: 品牌 / 探索(5) / 聯絡(3) / 法律
- Bottom: © 2026 山莎蔓岸合作社
```

---

## C. 視覺規範速查表（Design Tokens）

```
COLORS
  --bamboo-deep      #1f2d23   /* hero / booking section bg */
  --bamboo-green     #2d4a36   /* primary text on light */
  --bamboo-mid       #4a7c59   /* accent green */
  --gold             #c9a96e   /* CTA / accents */
  --gold-deep        #d4af37   /* gold-deep variant */
  --cream            #fdfaf2   /* card bg (faq, pillar) */
  --parchment        #f5f0e8   /* section bg light */
  --slate-500        #6b7563   /* muted text */
  --black-footer     #0a0a0a   /* footer bg */

TYPOGRAPHY
  H1 (hero)          'Noto Serif TC' 56–72px, weight 700, line-height 1.15
  H2 (section)       'Noto Sans TC' 36–44px, weight 700
  H3 (card title)    'Noto Sans TC' 22–28px, weight 600
  Body               'Noto Sans TC' 16–18px, line-height 1.7
  Eyebrow            'Inter' 12px uppercase, letter-spacing 0.15em, gold
  Fact number        'Inter' 48–64px, weight 800
  Fact label         'Noto Sans TC' 13px, color slate-500

SPACING
  Section vertical   80–120px desktop / 56–72px mobile
  Container max      1200px
  Card padding       24–32px
  Grid gap           24px desktop / 16px mobile

ELEVATION
  Card               0 10px 30px rgba(0,0,0,0.08)
  Hover lift         translateY(-4px) + shadow upgrade
  FAQ card on dark   inset 0 1px 0 rgba(255,255,255,0.05) + 0 10px 30px rgba(0,0,0,0.18)

BORDER
  Card border-bottom 2px solid gold (pillar / persona)
  Footer top border  4px solid gold

ANIMATION
  AOS fade-up 600ms ease-out, 50–150ms stagger
  Success bounce 800ms cubic-bezier(0.68, -0.55, 0.27, 1.55)
  CTA hover 200ms
```

---

## D. 元件命名建議（Figma Component Library）

| 元件 | Figma 命名 | 變體 |
|---|---|---|
| 導覽列 | `nav/desktop-5item` | desktop / mobile-hamburger |
| 事實單元 | `fact-grid/cell` | number-emphasis / keyword-emphasis |
| 支柱卡 | `card/pillar` | default / hover |
| Persona 卡 | `card/persona` | edu / esg / cultural |
| 流程步驟 | `process-step` | 1 / 2 / 3 / active |
| FAQ 摺疊 | `faq-item` | closed / open |
| 表單區段 | `form-section` | s1-plan / s2-contact / s3-detail / s4-extra |
| 資訊卡 | `info-card` | phone / email / sla / tax / rain |
| 成功面板 | `panel/booking-success` | default / animating |
| 錯誤橫幅 | `banner/booking-error` | network / mailto-open |
| 頁尾 | `footer/site-footer` | desktop / mobile |

---

## E. 給 FigmaAI / Galileo 額外的引導語（Negative Prompt）

```
DO NOT generate:
- E-commerce product cards or cart icons
- Standalone case-study grids (#cases removed)
- Standalone venue tour gallery (#venue removed)
- Standalone contact form section (#contact removed, merged into booking-info)
- Multi-step booking wizard with "Next/Back" buttons
- iframe embed of Google Forms
- Chatbot floating widget (currently disabled)
- Multiple primary CTAs in hero (only one)
- Cards with rounded corners > 20px (we use 12–16px)
- Bright colors outside the bamboo green / gold / cream palette
- A second/duplicate company logo inside the hero right column
  (v5.6 explicitly removed this to eliminate Visual Redundancy with the nav)
- Pure tag-cloud only OR pure number-grid only in hero right column
  (must be BOTH stacked with divider — Culture × Trust Matrix is the spec)
```

---

## F. 對應檔案速查

| 用途 | 路徑 |
|---|---|
| 客戶網站本體 | `blog_uiux/pages/index_SamSamma.html` |
| PM 履歷頁 IA 區段 | `blog_uiux/pages/SamSamma.html` § 02.6 |
| User Flow 原始檔 | `blog_uiux/data/ia/user-flow.mmd` |
| Site Map 原始檔 | `blog_uiux/data/ia/site-map.mmd` |
| Wireframe SVG（已存在低保真）| `blog_uiux/data/ia/wireframe-hero.svg` / `wireframe-plans.svg` / `wireframe-booking.svg` |
| Prototype 規格 | `blog_uiux/data/ia/prototype-spec.json` |
| 客戶網站文件 | `blog_uiux/pages/專案狀態/網站狀態/山莎蔓岸/客戶網站_index_SamSamma.txt`（v5.5 patch note）|
| React 對照展示 | `samsamma-booking-react/src/config.ts` / `lib/googleForm.ts` |

---

## G. 使用建議

1. **快速概念稿**：直接貼 §A 的 Master Prompt 給 FigmaAI / Galileo，2–3 分鐘出 5 張 frame。
2. **逐張精修**：用 §B 的 per-screen prompt 一張一張要求 AI 重畫，每張可帶 §C 的 design tokens 強制風格。
3. **建 Library**：先按 §D 在 Figma 手動建好 component library，再用 AI 填內容，會比一次全自動更穩定。
4. **避免亂生**：把 §E Negative Prompt 貼在每次對話開頭，告訴 AI 不要生不需要的東西。
5. **PM 履歷頁直接引用**：生成完的 Figma 連結可直接嵌入 `SamSamma.html` § 02.6 IA Artefacts 區段，取代或補充現有的 SVG wireframe。
