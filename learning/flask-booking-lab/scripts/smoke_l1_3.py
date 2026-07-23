"""L1-3: update booking status via detail page."""
from __future__ import annotations

import os
import re
import sys

os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "1234")

from app import create_app
from app.extensions import db
from app.models import Booking


def _csrf(html: str, name: str = "csrf_token") -> str:
    m = re.search(rf'name="{name}"[^>]*value="([^"]+)"', html)
    if not m:
        m = re.search(rf'value="([^"]+)"[^>]*name="{name}"', html)
    assert m, f"csrf {name} not found"
    return m.group(1)


def main() -> int:
    app = create_app()
    client = app.test_client()

    with app.app_context():
        row = db.session.get(Booking, 1)
        if row is None:
            row = Booking(
                record_type="activity",
                plan="文化體驗半日",
                org_name="測試機構",
                contact_name="測試人",
                email="test@example.com",
                phone="0912345678",
                status="new",
            )
            db.session.add(row)
            db.session.commit()
            bid = row.id
        else:
            bid = 1
            row.status = "new"
            db.session.commit()

    login = client.get("/admin/login")
    token = _csrf(login.data.decode("utf-8"))
    client.post(
        "/admin/login",
        data={"csrf_token": token, "username": "admin", "password": "1234", "submit": "y"},
        follow_redirects=True,
    )

    page = client.get(f"/admin/bookings/{bid}")
    html = page.data.decode("utf-8")
    assert page.status_code == 200
    tok = _csrf(html)
    res = client.post(
        f"/admin/bookings/{bid}",
        data={
            "csrf_token": tok,
            "record_type": "activity",
            "plan": "文化體驗半日",
            "product_name": "",
            "quantity": "",
            "tax_id": "",
            "need_invoice": "",
            "delivery": "",
            "org_name": "測試機構",
            "contact_name": "測試人",
            "email": "test@example.com",
            "phone": "0912345678",
            "notes": "",
            "status": "paid_confirmed",
            "admin_note": "L1-3 smoke 人工確認",
            "submit": "y",
        },
        follow_redirects=True,
    )
    assert res.status_code == 200
    with app.app_context():
        b = db.session.get(Booking, bid)
        assert b is not None and b.status == "paid_confirmed"
        print(f"OK booking#{bid} status={b.status} note={b.admin_note}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
