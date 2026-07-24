"""灌入各狀態假資料，方便驗後台列表／篩選／詳情／作廢區。

用法（在 flask-booking-lab 目錄、已啟動 venv）：
  python scripts/seed_demo_data.py

預設會先刪除 source=seed_demo 的舊假資料再重建（真實案件不受影響）。
加 --keep 則只追加、不刪舊假資料。
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# 允許直接 python scripts/seed_demo_data.py
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import create_app
from app.extensions import db
from app.models import Booking

SEED_SOURCE = "seed_demo"


def _rows() -> list[Booking]:
    now = datetime.now(timezone.utc)
    specs: list[dict] = [
        # —— 活動預約：五種狀態各一 ——
        {
            "record_type": "activity",
            "status": "new",
            "plan": "文化體驗半日",
            "org_name": "苗栗縣文化局（假）",
            "contact_name": "林小美",
            "email": "demo.new.activity@example.com",
            "phone": "0911111001",
            "participants": "12",
            "preferred_date": "2026-08-15",
            "duration": "半天",
            "budget": "約 1.5 萬",
            "addons": "導覽解說",
            "notes": "希望安排週末",
            "admin_note": "",
            "days_ago": 0,
        },
        {
            "record_type": "activity",
            "status": "contacted",
            "plan": "一日深度遊程",
            "org_name": "新竹某國小家長會（假）",
            "contact_name": "陳主任",
            "email": "demo.contacted.activity@example.com",
            "phone": "0911111002",
            "participants": "28",
            "preferred_date": "2026-09-02",
            "duration": "一日",
            "budget": "約 4 萬",
            "addons": "午餐、交通協助",
            "notes": "需無障礙動線說明",
            "admin_note": "已電話確認人數，待回傳報價單",
            "days_ago": 2,
        },
        {
            "record_type": "activity",
            "status": "paid_confirmed",
            "plan": "二日山城遊程",
            "org_name": "台北某旅遊社團（假）",
            "contact_name": "王小姐",
            "email": "demo.paid.activity@example.com",
            "phone": "0911111003",
            "participants": "16",
            "preferred_date": "2026-08-22",
            "duration": "二日一夜",
            "budget": "約 8 萬",
            "addons": "住宿媒合、風味餐",
            "notes": "匯款後附圖給窗口",
            "admin_note": "人工確認匯款；行程表已寄出",
            "days_ago": 5,
        },
        {
            "record_type": "activity",
            "status": "closed",
            "plan": "企業 ESG 參訪",
            "org_name": "雙生紫焰科技（假）",
            "contact_name": "趙窗口",
            "email": "demo.closed.activity@example.com",
            "phone": "0911111004",
            "participants": "20",
            "preferred_date": "2026-07-10",
            "duration": "半日",
            "budget": "企業專案",
            "addons": "ESG 簡報、合照",
            "notes": "活動已結束",
            "admin_note": "結案：滿意度回饋已收",
            "days_ago": 14,
        },
        {
            "record_type": "activity",
            "status": "voided",
            "plan": "文化體驗半日",
            "org_name": "取消測試單位（假）",
            "contact_name": "張先生",
            "email": "demo.voided.activity@example.com",
            "phone": "0911111005",
            "participants": "8",
            "preferred_date": "2026-08-01",
            "duration": "半天",
            "budget": "未定",
            "addons": "",
            "notes": "行程衝突取消",
            "admin_note": "作廢：對方改期後改走其他方案",
            "days_ago": 7,
        },
        # —— 商品訂購：五種狀態各一 ——
        {
            "record_type": "product",
            "status": "new",
            "product_name": "竹炭除臭包",
            "quantity": "20 包",
            "org_name": "個人訂購（假）",
            "contact_name": "吳小姐",
            "email": "demo.new.product@example.com",
            "phone": "0922222001",
            "tax_id": "",
            "need_invoice": "不需要",
            "delivery": "宅配",
            "notes": "希望本週出貨",
            "admin_note": "",
            "days_ago": 0,
        },
        {
            "record_type": "product",
            "status": "contacted",
            "product_name": "除臭竹炭磚",
            "quantity": "5 組",
            "org_name": "某咖啡廳（假）",
            "contact_name": "黃店長",
            "email": "demo.contacted.product@example.com",
            "phone": "0922222002",
            "tax_id": "12345678",
            "need_invoice": "三聯式",
            "delivery": "宅配",
            "notes": "店門口可放貨",
            "admin_note": "已報價，等對方確認數量",
            "days_ago": 1,
        },
        {
            "record_type": "product",
            "status": "paid_confirmed",
            "product_name": "ESG 企業禮盒",
            "quantity": "50 盒",
            "org_name": "某金控永續部（假）",
            "contact_name": "李專員",
            "email": "demo.paid.product@example.com",
            "phone": "0922222003",
            "tax_id": "87654321",
            "need_invoice": "三聯式",
            "delivery": "貨運到公司",
            "notes": "名片印製說明已附",
            "admin_note": "人工確認款項；排程出貨 8/5",
            "days_ago": 4,
        },
        {
            "record_type": "product",
            "status": "closed",
            "product_name": "竹醋液生活噴霧",
            "quantity": "12 瓶",
            "org_name": "社區共購（假）",
            "contact_name": "周媽媽",
            "email": "demo.closed.product@example.com",
            "phone": "0922222004",
            "tax_id": "",
            "need_invoice": "不需要",
            "delivery": "面交",
            "notes": "已取貨",
            "admin_note": "結案：面交完成",
            "days_ago": 20,
        },
        {
            "record_type": "product",
            "status": "voided",
            "product_name": "賽夏竹編小籃",
            "quantity": "3 個",
            "org_name": "重複下單（假）",
            "contact_name": "許先生",
            "email": "demo.voided.product@example.com",
            "phone": "0922222005",
            "tax_id": "",
            "need_invoice": "不需要",
            "delivery": "宅配",
            "notes": "誤送兩次",
            "admin_note": "作廢：與 #新進案件合併",
            "days_ago": 3,
        },
        # —— 多一筆新進，讓總覽數字 > 1 ——
        {
            "record_type": "activity",
            "status": "new",
            "plan": "一日深度遊程",
            "org_name": "官網雙寫示範（假）",
            "contact_name": "訪客甲",
            "email": "demo.official@example.com",
            "phone": "0933333001",
            "participants": "6",
            "preferred_date": "2026-08-30",
            "duration": "一日",
            "budget": "未定",
            "addons": "",
            "notes": "來源模擬 official_site",
            "admin_note": "",
            "source": "official_site",
            "days_ago": 0,
        },
        {
            "record_type": "product",
            "status": "new",
            "product_name": "竹炭除濕包",
            "quantity": "10 包",
            "org_name": "學習站表單（假）",
            "contact_name": "訪客乙",
            "email": "demo.labform@example.com",
            "phone": "0933333002",
            "tax_id": "",
            "need_invoice": "二聯式",
            "delivery": "超商取貨",
            "notes": "想問客製包裝",
            "admin_note": "",
            "days_ago": 1,
        },
    ]

    out: list[Booking] = []
    for s in specs:
        days = int(s.pop("days_ago", 0))
        created = now - timedelta(days=days, hours=days)
        source = s.pop("source", SEED_SOURCE)
        row = Booking(
            source=source,
            notify_sent=False,
            created_at=created,
            updated_at=created,
            **s,
        )
        out.append(row)
    return out


def seed(*, keep: bool) -> int:
    app = create_app()
    with app.app_context():
        if not keep:
            # 清假資料：source=seed_demo，或 email 落在 demo.*@example.com
            old = db.session.scalars(
                db.select(Booking).where(
                    (Booking.source == SEED_SOURCE)
                    | (Booking.email.like("demo.%@example.com"))
                )
            ).all()
            for row in old:
                db.session.delete(row)
            db.session.commit()
            print(f"已清除舊假資料 {len(old)} 筆")

        rows = _rows()
        for row in rows:
            db.session.add(row)
        db.session.commit()

        by_status: dict[str, int] = {}
        by_type: dict[str, int] = {}
        for row in rows:
            by_status[row.status] = by_status.get(row.status, 0) + 1
            by_type[row.record_type] = by_type.get(row.record_type, 0) + 1

        print(f"已建立假資料 {len(rows)} 筆")
        print("  類型：", ", ".join(f"{k}={v}" for k, v in sorted(by_type.items())))
        print("  狀態：", ", ".join(f"{k}={v}" for k, v in sorted(by_status.items())))
        print("請開後台驗：總覽／活動／商品／作廢區")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed demo bookings")
    parser.add_argument(
        "--keep",
        action="store_true",
        help="不刪舊假資料，只追加",
    )
    args = parser.parse_args()
    return seed(keep=args.keep)


if __name__ == "__main__":
    sys.exit(main())
