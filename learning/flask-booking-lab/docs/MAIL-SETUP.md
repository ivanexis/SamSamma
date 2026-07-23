# Gmail 通知設定（本機）

後台新案件會寄信到 `MAIL_TO`。請在 `learning/flask-booking-lab/.env` 確認：

```
MAIL_ENABLED=1
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=jeff11051212@gmail.com
MAIL_PASSWORD=在此貼上應用程式密碼
MAIL_FROM=jeff11051212@gmail.com
MAIL_TO=jeff11051212@gmail.com
```

## 取得應用程式密碼（約 2 分鐘）

1. Google 帳號開啟「兩步驟驗證」
2. 搜尋「應用程式密碼」→ 新增（名稱可填 山莎蔓岸）
3. 複製 16 碼（無空白）貼到 `MAIL_PASSWORD=`
4. 存檔後重開：`python run.py`
5. 後台「新增案件」一筆 → 收件匣應收到 `[山莎蔓岸] ...`

若 flash 顯示寄信失敗，多半是密碼仍空、或用了登入密碼而非應用程式密碼。
