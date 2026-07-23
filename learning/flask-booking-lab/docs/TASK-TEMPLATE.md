# 任務卡模板（複製到 Cursor 聊天）

```
【任務卡】
任務 ID：L1-?
軌道：B-學習站（learning/flask-booking-lab）
主線欄位：預約 / 採購（擇一）

為何：
（一句，對齊紫生或合作社）

Scope（只准改）：
- learning/flask-booking-lab/...

禁止：
- 不動 blog_uiux/index.html 等生產站
- 不進金流／不關 CSRF
- 密鑰不寫死

驗收：
- [ ] …
- [ ] …
- [ ] …

參考：
- AGENTS.md
- docs/STRATEGY.md
- docs/SECURITY.md
```

---

## 範例｜L1-1 快樂路徑

```
【任務卡】
任務 ID：L1-1
軌道：B-學習站
主線欄位：預約（精簡 5 欄即可：方案、機構、聯絡人、Email、電話）

為何：證明表單 POST → DB INSERT，對齊紫生 Flask／資料持久化。

Scope：
- learning/flask-booking-lab/ 內新建 app 骨架、model、register 表單、README 啟動步驟

禁止：
- 不改合作社官網
- 不做 admin（下一張卡）
- 不部署 GCP

驗收：
- [ ] python 可啟動
- [ ] 送出一筆後 DB 有列（或 SQLite 檔可見）
- [ ] README 寫明如何啟動與如何驗證
- [ ] .env.example 存在且無真實密鑰
```

---

## 範例｜軌 A 生產站（對照）

```
【任務卡】
任務 ID：P0-5
軌道：A-生產站
為何：留下 Phase6 改動說明，面試可口述。
Scope：data/docs/CHANGELOG-phase6.md、規劃.txt §7
禁止：大範圍重構 index.html
驗收：
- [ ] 列出 P0-1～P0-4 的 Why／Verify
- [ ] 部署方式註明 Cloudflare 丟檔
```
