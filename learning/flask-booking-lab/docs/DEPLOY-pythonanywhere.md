# PythonAnywhere 部署｜超詳細（帳號 ivangoldaura）

> 你剛才失敗的原因：**PA 上還沒有程式資料夾**。  
> `cd ~/flask-booking-lab` 找不到是正常的——要先「上傳」或「clone」。  
> 學習站目前在你電腦：`c:\SamSamma\blog_uiux\learning\flask-booking-lab`  
> **還沒進 GitHub**，所以不能用 `git clone` 一次抓到。請用下面「上傳 zip」。

完成後網址：`https://ivangoldaura.pythonanywhere.com`

---

## 先清掉剛才誤建的環境（在 PA Bash）

你現在提示符是 `(.venv) 15:39 ~ $`，代表在**家目錄**誤開了虛擬環境。先做：

```bash
deactivate
rm -rf ~/.venv
```

做完提示符應變回：`15:xx ~ $`（前面沒有 `.venv`）。

---

## 第 1 步｜在你的 Windows 準備 zip

本機已幫你打好（若沒有就自己壓）：

```text
c:\SamSamma\blog_uiux\learning\flask-booking-lab-for-pa.zip
```

用檔案總管打開這個路徑，確認 zip 存在。

---

## 第 2 步｜上傳到 PythonAnywhere

1. 瀏覽器登入 [https://www.pythonanywhere.com](https://www.pythonanywhere.com)
2. 上方選單點 **文件（Files）**
3. 確認你在：`/home/ivangoldaura/`（畫面上方會顯示路徑）
4. 找到 **Upload a file**（上傳檔案）
5. 選本機的 `flask-booking-lab-for-pa.zip`，等上傳完成
6. 上傳後，檔案列表應出現 `flask-booking-lab-for-pa.zip`

---

## 第 3 步｜用 Bash 解壓（很重要）

1. 上方選單點 **遊戲機（Consoles）**
2. 點 **Bash**（開一個新的）
3. **逐行**貼下列指令，每行貼完按 Enter：

```bash
cd ~
ls
```

你應該看到 `flask-booking-lab-for-pa.zip`。

```bash
unzip -o flask-booking-lab-for-pa.zip
ls
```

你應該看到資料夾 **`flask-booking-lab`**。

```bash
cd ~/flask-booking-lab
ls
```

你應該看到：`app`、`requirements.txt`、`run.py` 等。  
**若這裡還是 No such file，代表第 2 步 zip 沒上傳成功，不要繼續。**

---

## 第 4 步｜建虛擬環境並安裝套件

仍在 Bash，確認路徑正確後：

```bash
pwd
```

應顯示：`/home/ivangoldaura/flask-booking-lab`

然後：

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

成功時最後會看到一堆 `Successfully installed ...`。  
提示符前面會有 `(.venv)`，且路徑仍在 `flask-booking-lab`，例如：

```text
(.venv) 15:xx ~/flask-booking-lab $
```

---

## 第 5 步｜建立密碼設定檔 `.env`

仍在 `~/flask-booking-lab`、且已 `activate` 時，貼：

```bash
cat > .env << 'EOF'
SECRET_KEY=請改成一串自己想的亂數英文數字
FLASK_DEBUG=0
DATABASE_URL=sqlite:///bookings.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=請改成你的後台密碼
MAIL_ENABLED=0
PUBLIC_BASE_URL=https://ivangoldaura.pythonanywhere.com
CORS_ORIGINS=https://ivangoldaura.pages.dev,http://127.0.0.1:5500,null
EOF
```

用記事本心裡記住：`ADMIN_USERNAME` / `ADMIN_PASSWORD`（之後登入後台用）。

檢查：

```bash
ls -la .env
cat .env
```

---

## 第 6 步｜新增 Web 應用

1. 上方選單點 **網站（Web）**
2. 點左側 **Add a new web app**（新增）
3. 網域選免費的：`ivangoldaura.pythonanywhere.com` → Next
4. 選 **Manual configuration**（手動）→ Next  
   （不要選 Django / Flask 嚮導也可以，我們用手動最穩）
5. Python 版本選 **3.12** → Next → Finish

---

## 第 7 步｜告訴 PA 虛擬環境在哪

仍在 **網站（Web）** 設定頁，往下找 **Virtualenv**：

填這一行（完全一樣）：

```text
/home/ivangoldaura/flask-booking-lab/.venv
```

按旁邊的勾勾／Enter 儲存。若它自動偵測到套件路徑，就對了。

---

## 第 8 步｜改 WSGI（讓網站真正跑 Flask）

1. 同一頁找 **WSGI configuration file** 那一行藍色連結，點進去
2. **全部選取刪掉**原本內容
3. 貼上下面整段，存檔（Save）：

```python
import sys
from pathlib import Path

project = Path("/home/ivangoldaura/flask-booking-lab")
sys.path.insert(0, str(project))

from app import create_app
application = create_app()
```

---

## 第 9 步｜Reload 並測試

1. 回到 **網站（Web）** 頁
2. 點上方綠色 **Reload ivangoldaura.pythonanywhere.com**
3. 瀏覽器開：

- https://ivangoldaura.pythonanywhere.com/
- https://ivangoldaura.pythonanywhere.com/admin

用第 5 步的 `admin` + 你設的密碼登入。

---

## 若出現 500 錯誤

**網站（Web）** → 下方 **Log files** → 點 **Error log**，把**最後 20 行**複製貼給我。

---

## 你不用做的（免費帳）

- 任務（Tasks）→ 要付費，跳過  
- 資料庫 MySQL → 要付費，跳過（我們用 SQLite）  
- Jupyter → 要升級，跳過  

---

## 對照：你剛才錯在哪

| 你做的 | 問題 |
|--------|------|
| `cd ~/flask-booking-lab` | 資料夾還不存在（沒上傳） |
| 在 `~` 家目錄 `python3.12 -m venv` | 虛擬環境建錯地方 |
| `pip install -r requirements.txt` | 當前目錄沒有該檔 |

正確順序永遠是：**先有資料夾 → 再 cd 進去 → 再 venv → 再 pip**。
