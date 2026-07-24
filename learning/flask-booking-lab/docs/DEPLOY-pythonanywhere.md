# PythonAnywhere 小白完整教學｜串接已上線官網

**你的現況**

| 項目 | 狀態 |
|------|------|
| 前端官網 | 已上線：https://samsamma.jeff11051212.workers.dev/ |
| PythonAnywhere | 已有帳號 `ivangoldaura`，**還沒有 Web 應用** |
| 學習站程式 | 已在 GitHub：https://github.com/ivanexis/SamSamma （資料夾 `learning/flask-booking-lab`） |

**完成後你會有**

- 後台：https://ivangoldaura.pythonanywhere.com/admin  
- API：https://ivangoldaura.pythonanywhere.com/api/v1/bookings  
- 官網預約成功 → Google（營運）＋ 順便寫進 PA 資料庫（面試 demo）

**不用管**：任務（Tasks）、MySQL、Jupyter（免費沒有／不需要）。

---

## 總流程（照數字做）

1. Bash 用 git 拉程式  
2. 建虛擬環境、裝套件、建 `.env`  
3. 網站 → 新增 Web 應用（Manual）  
4. 填 Virtualenv、改 WSGI  
5. Reload，測後台  
6. 改官網 `LAB.apiUrl` 再部署前端  

---

## 第 0 步｜登入 PythonAnywhere

1. 開 https://www.pythonanywhere.com/  
2. Log in → 帳號 `ivangoldaura`  
3. 進儀表板後，上方選單會看到：儀表板／遊戲機／文件／**網站**／任務／資料庫  

---

## 第 1 步｜用 Bash 從 GitHub 拉程式（推薦）

1. 點 **遊戲機（Consoles）**  
2. 點藍色 **Bash**（開一個新控制台）  
3. **一行一行**貼，每行按 Enter：

```bash
cd ~
git clone https://github.com/ivanexis/SamSamma.git
ls SamSamma
ls SamSamma/learning/flask-booking-lab
```

最後一個 `ls` 要看到：`app`、`requirements.txt`、`run.py`。

> 若 `git clone` 失敗（偶發網路），改用文末「備用：上傳 zip」。

為了後面指令好打，做一個捷徑：

```bash
ln -sfn ~/SamSamma/learning/flask-booking-lab ~/flask-booking-lab
cd ~/flask-booking-lab
pwd
```

應顯示：`/home/ivangoldaura/flask-booking-lab`

---

## 第 2 步｜虛擬環境＋安裝套件

仍在 Bash、且在 `~/flask-booking-lab`：

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

成功會看到 `Successfully installed Flask ...`  
提示符前面要有 `(.venv)`。

---

## 第 3 步｜建立 `.env`（帳密＋CORS）

仍在 `~/flask-booking-lab` 且已 activate，整段貼上：

```bash
cat > .env << 'EOF'
SECRET_KEY=請改成一串自己亂打的英文數字
FLASK_DEBUG=0
DATABASE_URL=sqlite:///bookings.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=請改成你的後台密碼
MAIL_ENABLED=0
PUBLIC_BASE_URL=https://ivangoldaura.pythonanywhere.com
CORS_ORIGINS=https://samsamma.jeff11051212.workers.dev,http://127.0.0.1:5500,null
EOF
```

檢查：

```bash
cat .env
```

記住 `ADMIN_USERNAME` / `ADMIN_PASSWORD`（之後登入後台用）。

---

## 第 4 步｜新增 Web 應用（你現在是「沒有任何網頁應用」）

1. 上方點 **網站（Web）**  
2. 點 **Add a new web app**／新增  
3. 網域選免費：`ivangoldaura.pythonanywhere.com` → Next  
4. 選 **Manual configuration**（手動設定）→ Next  
   - **不要**選 Django  
5. Python 選 **3.12**（跟剛才 venv 一樣）→ Next → Finish  

---

## 第 5 步｜告訴 PA 虛擬環境在哪

仍在 **網站（Web）** 設定頁，往下找 **Virtualenv**：

填（完全一樣）：

```text
/home/ivangoldaura/flask-booking-lab/.venv
```

按旁邊勾勾或 Enter 儲存。若出現套件路徑提示，代表對了。

---

## 第 6 步｜改 WSGI（最關鍵）

1. 同一頁找 **WSGI configuration file** 藍色連結，點進去  
2. **全部刪光**原本內容  
3. 貼上下面，存檔（Save / 磁碟圖示）：

```python
import sys
from pathlib import Path

project = Path("/home/ivangoldaura/flask-booking-lab")
sys.path.insert(0, str(project))

from app import create_app
application = create_app()
```

---

## 第 7 步｜Reload 並測試後台

1. 回到 **網站（Web）**  
2. 點上方綠色 **Reload**  
3. 瀏覽器開：

- https://ivangoldaura.pythonanywhere.com/  
  （應跳到登入）  
- https://ivangoldaura.pythonanywhere.com/admin/login  

用 `.env` 的帳密登入。  
側欄應有：總覽／活動預約／商品訂購。

**若出現 500：** Web 頁下方 **Error log** → 把最後 20 行貼給我。

---

## 第 8 步｜串接已上線官網（Workers）

官網目前還指向本機 `127.0.0.1:5001`，線上訪客連不到你電腦。

在本機改 [`index.html`](../../index.html) 裡的 `LAB`（搜尋 `apiUrl`）：

```javascript
var LAB = {
  enabled: true,
  apiUrl: 'https://ivangoldaura.pythonanywhere.com/api/v1/bookings',
  apiKey: ''
};
```

然後：

1. commit／push 到 GitHub `SamSamma`  
2. 等 Cloudflare／Workers 重新部署  
3. 開 https://samsamma.jeff11051212.workers.dev/  
4. 填一筆**預約**送出  
5. 開 PA 後台 **活動預約** 看有沒有新單（來源會像「官網」）

> Google 表單仍會進試算表（營運主路徑）。  
> PA 失敗也**不會擋**預約成功畫面。

---

## 兩個網址怎麼並存（面試可講）

```text
https://samsamma.jeff11051212.workers.dev/     ← 前端 UI（Cloudflare）
        │
        ├─① Google Forms → Sheets（正式營運）
        └─② fetch API → ivangoldaura.pythonanywhere.com（學習站 SQL＋後台）
```

---

## 備用：若 git clone 失敗 → 上傳 zip

本機檔：

```text
c:\SamSamma\blog_uiux\learning\flask-booking-lab-for-pa.zip
```

1. PA → **文件** → `/home/ivangoldaura/` → Upload  
2. Bash：

```bash
cd ~
unzip -o flask-booking-lab-for-pa.zip
cd ~/flask-booking-lab
```

之後從「第 2 步」繼續。

---

## 已上線後：更新程式＋灌假資料（最短）

本機 zip 已含 `scripts/seed_demo_data.py`。站已建好時只做這段：

1. 本機檔：`c:\SamSamma\blog_uiux\learning\flask-booking-lab-for-pa.zip`  
2. PA → **文件** → 進 `/home/ivangoldaura/` → **Upload** 覆蓋上傳  
3. **遊戲機 → Bash** 貼上：

```bash
cd ~
unzip -o flask-booking-lab-for-pa.zip
cd ~/flask-booking-lab
source .venv/bin/activate
python scripts/seed_demo_data.py
```

4. 上方 **網站** → 該 Web app → 綠鈕 **Reload**  
5. 開 https://ivangoldaura.pythonanywhere.com/admin 驗：總覽／活動／商品／作廢區應有假資料

> `unzip -o` 會覆寫程式碼，**不會刪** `.env`、`.venv`、既有 `*.db`（zip 裡本來就沒帶這些）。  
> 假資料可重跑；只清 `demo.*@example.com`／`source=seed_demo`，真實案件會留下。

---

## 常見錯誤

| 現象 | 原因／處理 |
|------|------------|
| 沒有 Web 應用 | 還沒做第 4 步 Add web app |
| `No such file flask-booking-lab` | 還沒 clone／解壓 |
| ModuleNotFoundError | Virtualenv 路徑錯，或沒 pip install |
| 500 | 看 Error log；多半 WSGI 路徑或 `.env` |
| 官網有預約、後台沒單 | `LAB.apiUrl` 還是 127.0.0.1，或 CORS 沒含 workers.dev，或還沒 Reload |
| 免費不能 MySQL | **正常**，我們用 SQLite |

---

## 做到哪可以跟我說

貼其中一種即可：

- 「第 7 步後台登入成功」  
- 「Error log 最後幾行：…」  
- 「第 8 步預約了，後台有／沒有」  
