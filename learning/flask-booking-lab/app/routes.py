from functools import wraps
from typing import Optional

from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
import hmac
from sqlalchemy import case, or_

from app.extensions import db
from app.forms import AdminLoginForm, BookingEditForm, InquiryForm
from app.models import ACTIVE_STATUSES, STATUS_CHOICES, Booking
from app.notify import send_new_inquiry_mail

bp = Blueprint("main", __name__)

# 列表狀態篩選不含作廢（作廢有獨立頁）
LIST_STATUS_CHOICES = [c for c in STATUS_CHOICES if c[0] != "voided"]

MODULES = {
    "activity": {
        "key": "activity",
        "nav": "activities",
        "label": "活動預約",
        "list_endpoint": "main.admin_activities",
        "create_endpoint": "main.admin_activity_create",
        "create_nav": "activities_new",
    },
    "product": {
        "key": "product",
        "nav": "products",
        "label": "商品訂購",
        "list_endpoint": "main.admin_products",
        "create_endpoint": "main.admin_product_create",
        "create_nav": "products_new",
    },
}


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("admin_ok"):
            return redirect(url_for("main.admin_login", next=request.path))
        return view(*args, **kwargs)

    return wrapped


def _check_admin(username: str, password: str) -> bool:
    expect_user = (current_app.config.get("ADMIN_USERNAME") or "").strip()
    expect_pass = current_app.config.get("ADMIN_PASSWORD") or ""
    if not expect_user or not expect_pass:
        return False
    return hmac.compare_digest((username or "").strip(), expect_user) and hmac.compare_digest(
        password or "", expect_pass
    )


def _status_order_expr():
    return case(
        (Booking.status == "new", 0),
        (Booking.status == "contacted", 1),
        (Booking.status == "paid_confirmed", 2),
        (Booking.status == "closed", 3),
        (Booking.status == "voided", 9),
        else_=8,
    )


def _count(*, record_type: Optional[str] = None, status: Optional[str] = None) -> int:
    q = db.select(db.func.count(Booking.id))
    if record_type:
        q = q.where(Booking.record_type == record_type)
    if status:
        q = q.where(Booking.status == status)
    elif record_type:
        q = q.where(Booking.status.in_(ACTIVE_STATUSES))
    return db.session.scalar(q) or 0


def _booking_from_inquiry(form: InquiryForm, *, source: str) -> Booking:
    return Booking(
        record_type=form.record_type.data,
        source=source,
        plan=(form.plan.data or "").strip() if form.record_type.data == "activity" else "",
        product_name=(form.product_name.data or "").strip()
        if form.record_type.data == "product"
        else "",
        quantity=(form.quantity.data or "").strip(),
        tax_id=(form.tax_id.data or "").strip(),
        need_invoice=(form.need_invoice.data or "").strip(),
        delivery=(form.delivery.data or "").strip(),
        org_name=(form.org_name.data or "").strip(),
        contact_name=form.contact_name.data.strip(),
        email=form.email.data.strip().lower(),
        phone=form.phone.data.strip(),
        notes=(form.notes.data or "").strip(),
        status="new",
        admin_note="",
        notify_sent=False,
    )


def _apply_edit_form(row: Booking, form: BookingEditForm) -> None:
    # 類型不可在詳情隨意改（避免模組混亂）；以資料庫既有類型為準
    rt = row.record_type
    form.record_type.data = rt
    row.plan = (form.plan.data or "").strip() if rt == "activity" else ""
    row.product_name = (form.product_name.data or "").strip() if rt == "product" else ""
    row.quantity = (form.quantity.data or "").strip()
    row.tax_id = (form.tax_id.data or "").strip()
    row.need_invoice = (form.need_invoice.data or "").strip()
    row.delivery = (form.delivery.data or "").strip()
    row.org_name = (form.org_name.data or "").strip()
    row.contact_name = form.contact_name.data.strip()
    row.email = form.email.data.strip().lower()
    row.phone = form.phone.data.strip()
    row.notes = (form.notes.data or "").strip()
    row.status = form.status.data
    row.admin_note = (form.admin_note.data or "").strip()


def _edit_form_from_row(row: Booking) -> BookingEditForm:
    return BookingEditForm(
        record_type=row.record_type,
        plan=row.plan or "",
        product_name=row.product_name or "",
        quantity=row.quantity or "",
        tax_id=row.tax_id or "",
        need_invoice=row.need_invoice or "",
        delivery=row.delivery or "",
        org_name=row.org_name or "",
        contact_name=row.contact_name,
        email=row.email,
        phone=row.phone,
        notes=row.notes or "",
        status=row.status,
        admin_note=row.admin_note or "",
    )


def _module_list(record_type: str):
    mod = MODULES[record_type]
    status_filter = (request.args.get("status") or "").strip()
    q_text = (request.args.get("q") or "").strip()

    query = db.select(Booking).where(Booking.record_type == record_type)
    if status_filter:
        query = query.where(Booking.status == status_filter)
    else:
        query = query.where(Booking.status.in_(ACTIVE_STATUSES))

    if q_text:
        like = f"%{q_text}%"
        if record_type == "activity":
            query = query.where(
                or_(
                    Booking.contact_name.ilike(like),
                    Booking.email.ilike(like),
                    Booking.phone.ilike(like),
                    Booking.org_name.ilike(like),
                    Booking.plan.ilike(like),
                )
            )
        else:
            query = query.where(
                or_(
                    Booking.contact_name.ilike(like),
                    Booking.email.ilike(like),
                    Booking.phone.ilike(like),
                    Booking.org_name.ilike(like),
                    Booking.product_name.ilike(like),
                    Booking.quantity.ilike(like),
                )
            )

    query = query.order_by(_status_order_expr(), Booking.created_at.desc(), Booking.id.desc())
    rows = db.session.scalars(query).all()
    total = _count(record_type=record_type)
    new_count = _count(record_type=record_type, status="new")

    return render_template(
        "admin_list.html",
        module=mod,
        nav=mod["nav"],
        rows=rows,
        total=total,
        new_count=new_count,
        status_choices=LIST_STATUS_CHOICES,
        status_filter=status_filter,
        q=q_text,
    )


def _module_create(record_type: str):
    mod = MODULES[record_type]
    form = InquiryForm()
    if request.method == "GET":
        form.record_type.data = record_type
    else:
        form.record_type.data = record_type

    if form.validate_on_submit():
        form.record_type.data = record_type
        row = _booking_from_inquiry(form, source="admin")
        db.session.add(row)
        db.session.commit()
        ok, mail_msg = send_new_inquiry_mail(row)
        if ok:
            row.notify_sent = True
            db.session.commit()
            flash(f"已新增 #{row.id}。{mail_msg}", "success")
        else:
            flash(f"已新增 #{row.id}。通知：{mail_msg}", "success")
        return redirect(url_for("main.admin_detail", booking_id=row.id))

    # 強制類型（POST 驗證失敗時也鎖住）
    form.record_type.data = record_type
    return render_template(
        "admin_form.html",
        form=form,
        module=mod,
        nav=mod["create_nav"],
        locked_type=record_type,
        title=f"新增{mod['label']}",
    )


@bp.route("/")
def index():
    if session.get("admin_ok"):
        return redirect(url_for("main.admin_dashboard"))
    return redirect(url_for("main.admin_login"))


@bp.route("/register", methods=["GET", "POST"])
def register():
    form = InquiryForm()
    preset = request.args.get("type")
    if request.method == "GET" and preset in ("activity", "product"):
        form.record_type.data = preset

    if form.validate_on_submit():
        row = _booking_from_inquiry(form, source="lab_form")
        db.session.add(row)
        db.session.commit()
        ok, mail_msg = send_new_inquiry_mail(row)
        if ok:
            row.notify_sent = True
            db.session.commit()
            flash(f"案件已建立。{mail_msg}", "success")
        else:
            flash(f"案件已建立。通知：{mail_msg}", "success")
        return redirect(url_for("main.success", booking_id=row.id))

    return render_template("register.html", form=form)


@bp.route("/success/<int:booking_id>")
def success(booking_id: int):
    row = db.session.get(Booking, booking_id)
    if row is None:
        flash("找不到該筆資料。", "error")
        return redirect(url_for("main.admin_dashboard"))
    if session.get("admin_ok"):
        return redirect(url_for("main.admin_detail", booking_id=booking_id))
    return render_template("success.html", booking=row)


@bp.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if session.get("admin_ok"):
        return redirect(url_for("main.admin_dashboard"))
    form = AdminLoginForm()
    configured = bool(
        (current_app.config.get("ADMIN_USERNAME") or "").strip()
        and (current_app.config.get("ADMIN_PASSWORD") or "")
    )
    if form.validate_on_submit():
        if not configured:
            flash("後台帳密尚未設定。", "error")
        elif _check_admin(form.username.data, form.password.data):
            session["admin_ok"] = True
            flash("已登入。", "success")
            nxt = request.args.get("next") or url_for("main.admin_dashboard")
            if not str(nxt).startswith("/"):
                nxt = url_for("main.admin_dashboard")
            return redirect(nxt)
        else:
            flash("帳號或密碼錯誤。", "error")
    return render_template(
        "admin_login.html",
        form=form,
        configured=configured,
        show_hint=current_app.config.get("DEBUG"),
    )


@bp.route("/admin/logout", methods=["POST"])
def admin_logout():
    session.pop("admin_ok", None)
    flash("已登出。", "success")
    return redirect(url_for("main.admin_login"))


@bp.route("/admin")
@admin_required
def admin_dashboard():
    activity_new = _count(record_type="activity", status="new")
    product_new = _count(record_type="product", status="new")
    activity_total = _count(record_type="activity")
    product_total = _count(record_type="product")
    recent = db.session.scalars(
        db.select(Booking)
        .where(Booking.status.in_(ACTIVE_STATUSES))
        .order_by(Booking.created_at.desc(), Booking.id.desc())
        .limit(5)
    ).all()
    return render_template(
        "admin_dashboard.html",
        nav="dashboard",
        activity_new=activity_new,
        product_new=product_new,
        activity_total=activity_total,
        product_total=product_total,
        recent=recent,
    )


# 舊網址相容：混列表 → 總覽
@bp.route("/admin/list")
@admin_required
def admin_list():
    type_filter = (request.args.get("type") or "").strip()
    if type_filter == "activity":
        return redirect(url_for("main.admin_activities", status=request.args.get("status")))
    if type_filter == "product":
        return redirect(url_for("main.admin_products", status=request.args.get("status")))
    return redirect(url_for("main.admin_dashboard"))


@bp.route("/admin/activities")
@admin_required
def admin_activities():
    return _module_list("activity")


@bp.route("/admin/products")
@admin_required
def admin_products():
    return _module_list("product")


@bp.route("/admin/activities/new", methods=["GET", "POST"])
@admin_required
def admin_activity_create():
    return _module_create("activity")


@bp.route("/admin/products/new", methods=["GET", "POST"])
@admin_required
def admin_product_create():
    return _module_create("product")


@bp.route("/admin/bookings/new", methods=["GET", "POST"])
@admin_required
def admin_create():
    return redirect(url_for("main.admin_dashboard"))


@bp.route("/admin/voided")
@admin_required
def admin_voided():
    rows = db.session.scalars(
        db.select(Booking)
        .where(Booking.status == "voided")
        .order_by(Booking.updated_at.desc(), Booking.id.desc())
    ).all()
    return render_template(
        "admin_voided.html",
        nav="voided",
        rows=rows,
        status_filter=None,
    )


@bp.route("/admin/bookings/<int:booking_id>", methods=["GET", "POST"])
@admin_required
def admin_detail(booking_id: int):
    row = db.session.get(Booking, booking_id)
    if row is None:
        flash("找不到該筆資料。", "error")
        return redirect(url_for("main.admin_dashboard"))

    mod = MODULES.get(row.record_type, MODULES["activity"])

    if request.method == "POST":
        form = BookingEditForm()
        if form.validate_on_submit():
            _apply_edit_form(row, form)
            db.session.commit()
            flash(f"已儲存 #{booking_id}。", "success")
            return redirect(url_for("main.admin_detail", booking_id=booking_id))
    else:
        form = _edit_form_from_row(row)

    return render_template(
        "admin_detail.html",
        booking=row,
        form=form,
        module=mod,
        nav=mod["nav"],
        status_filter=None,
    )


@bp.route("/admin/bookings/<int:booking_id>/void", methods=["POST"])
@admin_required
def admin_void(booking_id: int):
    row = db.session.get(Booking, booking_id)
    if row is None:
        flash("找不到該筆資料。", "error")
        return redirect(url_for("main.admin_dashboard"))
    row.status = "voided"
    note = (request.form.get("admin_note") or "").strip()
    if note:
        row.admin_note = note
    elif not row.admin_note:
        row.admin_note = "已作廢"
    db.session.commit()
    flash(f"#{booking_id} 已作廢。", "success")
    return redirect(url_for("main.admin_voided"))
