"""送出後 Gmail 通知（SMTP）。未設定 MAIL_* 時略過，資料仍進 DB。"""
from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from flask import current_app

from app.models import Booking

logger = logging.getLogger(__name__)


def _mail_configured() -> bool:
    cfg = current_app.config
    return bool(
        cfg.get("MAIL_ENABLED")
        and cfg.get("MAIL_USERNAME")
        and cfg.get("MAIL_PASSWORD")
        and cfg.get("MAIL_TO")
    )


def build_notify_body(row: Booking) -> str:
    lines = [
        "【山莎蔓岸｜新案件通知】",
        f"類型：{row.type_label()}",
        f"狀態：{row.status_label()}",
        f"ID：{row.id}",
        "",
        f"主旨：{row.summary_title()}",
        f"單位：{row.org_name or '—'}",
        f"聯絡人：{row.contact_name}",
        f"Email：{row.email}",
        f"電話：{row.phone}",
    ]
    if row.record_type == "product":
        lines += [
            f"數量：{row.quantity or '—'}",
            f"統編：{row.tax_id or '—'}",
            f"發票：{row.need_invoice or '—'}",
            f"配送：{row.delivery or '—'}",
        ]
    if row.notes:
        lines += ["", f"備註：{row.notes}"]
    lines += [
        "",
        "後台：",
        f"{current_app.config.get('PUBLIC_BASE_URL', 'http://127.0.0.1:5001')}/admin/bookings/{row.id}",
    ]
    return "\n".join(lines)


def send_new_inquiry_mail(row: Booking) -> tuple[bool, str]:
    """
    Returns (ok, message).
    ok=False 且 message 說明原因（未設定／寄送失敗）。
    """
    if not _mail_configured():
        return False, "未啟用郵件：請在 .env 設定 MAIL_ENABLED=1 與 Gmail 應用程式密碼"

    cfg = current_app.config
    msg = EmailMessage()
    subject_item = row.summary_title()
    msg["Subject"] = f"[山莎蔓岸] {row.type_label()}｜{subject_item}｜#{row.id}"
    msg["From"] = cfg.get("MAIL_FROM") or cfg["MAIL_USERNAME"]
    msg["To"] = cfg["MAIL_TO"]
    msg.set_content(build_notify_body(row))

    try:
        with smtplib.SMTP(cfg["MAIL_SERVER"], int(cfg["MAIL_PORT"]), timeout=20) as smtp:
            smtp.starttls()
            smtp.login(cfg["MAIL_USERNAME"], cfg["MAIL_PASSWORD"])
            smtp.send_message(msg)
        return True, "通知信已寄出"
    except Exception as exc:  # noqa: BLE001 — 學習站要回傳可讀錯誤
        logger.exception("mail send failed")
        return False, f"寄信失敗：{exc}"
