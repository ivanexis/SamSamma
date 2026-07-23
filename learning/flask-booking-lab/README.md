# flask-booking-lab｜紫生對齊學習站

**狀態：** L1-1～L1-3 已可跑（進庫、後台、狀態／人工確認付款）。  
**不是**合作社 Cloudflare 生產後端。

## 快速啟動

```powershell
cd c:\SamSamma\blog_uiux\learning\flask-booking-lab
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python run.py
```

| 頁面 | 網址 |
|------|------|
| 登入 | http://127.0.0.1:5001/admin/login |
| 總覽 | http://127.0.0.1:5001/admin |
| 活動預約 | http://127.0.0.1:5001/admin/activities |
| 商品訂購 | http://127.0.0.1:5001/admin/products |
| 作廢區 | http://127.0.0.1:5001/admin/voided |

後台：左側分類導覽；搜尋、詳情編輯、分模組新增、作廢。帳密（.env）：**admin**／**1234**

Gmail：見 [docs/MAIL-SETUP.md](./docs/MAIL-SETUP.md)（`.env` 設 `MAIL_PASSWORD` 應用程式密碼）。

**線上部署（PythonAnywhere）：** 見 [docs/DEPLOY-pythonanywhere.md](./docs/DEPLOY-pythonanywhere.md)

### 資料流（L1-4）

訪客選活動或商品 → DB（新進置頂）→ 可寄 Gmail → 後台改進度（人工確認付款）。  
詳見 [docs/DATAFLOW.md](./docs/DATAFLOW.md)。

### 如何驗證

1. 登入 `/admin` → 總覽可見活動／商品待處理  
2. `/admin/activities` 與 `/admin/products` 列表分離  
3. 詳情可改狀態為「已確認付款（人工）」並寫備註  
4. 未登入進不去後台  
4. 未登入進不去列表  

煙霧測試：

```powershell
$env:PYTHONPATH = (Get-Location).Path
python scripts\smoke_l1_1.py
python scripts\smoke_l1_2.py
python scripts\smoke_l1_3.py
```

## 文件（開工前）

| 檔案 | 用途 |
|------|------|
| [AGENTS.md](./AGENTS.md) | AI 角色＋架構 |
| [docs/STRATEGY.md](./docs/STRATEGY.md) | 為何雙軌 |
| [docs/SECURITY.md](./docs/SECURITY.md) | 安全最低標 |
| [docs/AI-PROMPT-PROTOCOL.md](./docs/AI-PROMPT-PROTOCOL.md) | 收斂 AI |
| [docs/TASK-TEMPLATE.md](./docs/TASK-TEMPLATE.md) | 任務卡 |

## 目錄

```
app/
  __init__.py      create_app
  config.py        SECRET_KEY / DATABASE_URL
  models.py        Booking（5 欄）
  forms.py         Flask-WTF + CSRF
  routes.py        /  /register  /success  /admin(+login)
```

## 與官網對照

| 官網（Cloudflare） | 本學習站 |
|--------------------|----------|
| Google Forms → Sheets | Flask → SQLite／PostgreSQL |
| 試算表人工查看 | `/admin` 列表＋統計 |
| 真實營運 | 測試資料／職能證明 |

## 下一張任務卡建議

**P0-5** 生產站 changelog，或 **L3** `docs/DEPLOY.md`（之後 GCP／查 log）
