from datetime import datetime, timezone

from app.extensions import db

STATUS_CHOICES = [
    ("new", "新進"),
    ("contacted", "已聯繫"),
    ("paid_confirmed", "已確認付款（人工）"),
    ("closed", "結案"),
    ("voided", "作廢"),
]
STATUS_LABELS = dict(STATUS_CHOICES)
STATUS_SORT_ORDER = {
    "new": 0,
    "contacted": 1,
    "paid_confirmed": 2,
    "closed": 3,
    "voided": 9,
}
# 列表預設不顯示作廢（篩選「作廢」或搜尋時除外）
ACTIVE_STATUSES = ("new", "contacted", "paid_confirmed", "closed")

RECORD_TYPES = [
    ("activity", "活動預約"),
    ("product", "商品"),
]
RECORD_TYPE_LABELS = dict(RECORD_TYPES)

# 與官網／學習站前端選項對齊
ACTIVITY_PLANS = [
    ("文化體驗半日", "文化體驗半日"),
    ("一日深度遊程", "一日深度遊程"),
    ("二日山城遊程", "二日山城遊程"),
    ("企業 ESG 參訪", "企業 ESG 參訪"),
]
PRODUCT_OPTIONS = [
    ("竹炭除臭包", "竹炭除臭包"),
    ("竹炭除濕包", "竹炭除濕包"),
    ("除臭竹炭磚", "除臭竹炭磚"),
    ("竹醋液生活噴霧", "竹醋液生活噴霧"),
    ("賽夏竹編小籃", "賽夏竹編小籃"),
    ("ESG 企業禮盒", "ESG 企業禮盒"),
    ("客製組合", "客製組合"),
]


class Booking(db.Model):
    """活動預約或商品案件（無金流；狀態由後台人工推進）。"""

    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    record_type = db.Column(db.String(20), nullable=False, default="activity")

    # 共用聯絡
    org_name = db.Column(db.String(200), nullable=False, default="")
    contact_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(40), nullable=False)

    # 活動（對齊官網 #booking 11 欄精簡擴充）
    plan = db.Column(db.String(120), nullable=False, default="")
    participants = db.Column(db.String(40), nullable=False, default="")
    preferred_date = db.Column(db.String(40), nullable=False, default="")
    duration = db.Column(db.String(120), nullable=False, default="")
    budget = db.Column(db.String(120), nullable=False, default="")
    addons = db.Column(db.String(500), nullable=False, default="")

    # 來源：official_site（官網雙寫）| lab_form（學習站表單）
    source = db.Column(db.String(40), nullable=False, default="lab_form")

    # 商品
    product_name = db.Column(db.String(200), nullable=False, default="")
    quantity = db.Column(db.String(80), nullable=False, default="")
    tax_id = db.Column(db.String(20), nullable=False, default="")
    need_invoice = db.Column(db.String(80), nullable=False, default="")
    delivery = db.Column(db.String(80), nullable=False, default="")

    notes = db.Column(db.String(500), nullable=False, default="")
    status = db.Column(db.String(32), nullable=False, default="new")
    admin_note = db.Column(db.String(500), nullable=False, default="")
    notify_sent = db.Column(db.Boolean, nullable=False, default=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def status_label(self) -> str:
        return STATUS_LABELS.get(self.status, self.status)

    def type_label(self) -> str:
        return RECORD_TYPE_LABELS.get(self.record_type, self.record_type)

    def summary_title(self) -> str:
        if self.record_type == "product":
            return self.product_name or "（未填品項）"
        return self.plan or "（未填方案）"

    def __repr__(self) -> str:
        return f"<Booking {self.id} {self.record_type} {self.status}>"
