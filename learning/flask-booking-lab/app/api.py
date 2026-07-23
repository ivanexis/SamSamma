"""官網 → 學習站 JSON API（面試雙寫展示用）。"""
from __future__ import annotations

from flask import Blueprint, current_app, jsonify, request

from app.extensions import csrf, db
from app.models import Booking
from app.notify import send_new_inquiry_mail
from app.phone_util import is_valid_phone

api_bp = Blueprint("api", __name__, url_prefix="/api/v1")


def _cors(resp):
    origin = request.headers.get("Origin", "*")
    # 本機 Live Server / 靜態預覽常用來源
    allowed = current_app.config.get("CORS_ORIGINS") or []
    if origin in allowed or "*" in allowed or not allowed:
        resp.headers["Access-Control-Allow-Origin"] = origin if origin != "null" else "*"
    else:
        resp.headers["Access-Control-Allow-Origin"] = allowed[0]
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Lab-Key"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return resp


@api_bp.after_request
def _after(resp):
    return _cors(resp)


@api_bp.route("/bookings", methods=["OPTIONS"])
@csrf.exempt
def bookings_options():
    return _cors(jsonify({"ok": True}))


@api_bp.route("/bookings", methods=["POST"])
@csrf.exempt
def create_booking():
    """
    接收官網預約 JSON。Google Forms 仍為營運主路徑；此 API 為學習站鏡像。
    Body 例：
    {
      "plan","orgName","contactName","email","phone",
      "participants","date","duration","budget","addons","notes"
    }
    """
    expect_key = (current_app.config.get("INGEST_API_KEY") or "").strip()
    if expect_key:
        got = (request.headers.get("X-Lab-Key") or "").strip()
        if got != expect_key:
            return _cors(jsonify({"ok": False, "error": "unauthorized"})), 401

    data = request.get_json(silent=True) or {}
    contact = (data.get("contactName") or data.get("contact_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    plan = (data.get("plan") or "").strip()
    org = (data.get("orgName") or data.get("org_name") or "").strip()

    if not contact or not email or not phone or not plan:
        return _cors(
            jsonify({"ok": False, "error": "missing required fields"})
        ), 400

    if not is_valid_phone(phone):
        return _cors(
            jsonify({"ok": False, "error": "invalid phone (need 8–13 digits)"})
        ), 400

    addons = data.get("addons")
    if isinstance(addons, list):
        addons_s = "、".join(str(a) for a in addons if a)
    else:
        addons_s = (addons or "").strip()

    row = Booking(
        record_type="activity",
        source="official_site",
        plan=plan,
        org_name=org,
        contact_name=contact,
        email=email,
        phone=phone,
        participants=(data.get("participants") or "").strip(),
        preferred_date=(data.get("date") or data.get("preferred_date") or "").strip(),
        duration=(data.get("duration") or "").strip(),
        budget=(data.get("budget") or "").strip(),
        addons=addons_s,
        notes=(data.get("notes") or "").strip()[:500],
        status="new",
        admin_note="",
        notify_sent=False,
    )
    db.session.add(row)
    db.session.commit()

    ok, mail_msg = send_new_inquiry_mail(row)
    if ok:
        row.notify_sent = True
        db.session.commit()

    return _cors(
        jsonify(
            {
                "ok": True,
                "id": row.id,
                "status": row.status,
                "notify": ok,
                "notify_message": mail_msg,
            }
        )
    ), 201
