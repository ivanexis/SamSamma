"""L1-4 smoke: product inquiry + admin shows type."""
from __future__ import annotations

import os
import re
import sys

os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "1234")

from app import create_app
from app.models import Booking


def csrf(html: str, name: str = "csrf_token") -> str:
    m = re.search(rf'name="{name}"[^>]*value="([^"]+)"', html)
    if not m:
        m = re.search(rf'value="([^"]+)"[^>]*name="{name}"', html)
    assert m, name
    return m.group(1)


def main() -> int:
    app = create_app()
    client = app.test_client()

    page = client.get("/register?type=product")
    assert page.status_code == 200
    tok = csrf(page.data.decode("utf-8"))
    res = client.post(
        "/register",
        data={
            "csrf_token": tok,
            "record_type": "product",
            "product_name": "竹炭除臭包",
            "quantity": "10",
            "delivery": "Pinkoi 開賣後購買",
            "contact_name": "測試",
            "email": "a@b.com",
            "phone": "0912345678",
            "org_name": "",
            "plan": "",
            "notes": "意向測試",
            "submit": "y",
        },
        follow_redirects=True,
    )
    body = res.data.decode("utf-8")
    assert res.status_code == 200 and ("已建立" in body or "案件" in body or "登入" in body), body[:400]

    login = client.get("/admin/login")
    client.post(
        "/admin/login",
        data={
            "csrf_token": csrf(login.data.decode("utf-8")),
            "username": "admin",
            "password": "1234",
            "submit": "y",
        },
        follow_redirects=True,
    )
    adm = client.get("/admin/products")
    ab = adm.data.decode("utf-8")
    assert "商品訂購" in ab or "竹炭除臭包" in ab

    with app.app_context():
        last = Booking.query.order_by(Booking.id.desc()).first()
        assert last is not None
        assert last.record_type == "product" and last.status == "new"
        print(f"OK product#{last.id} status={last.status} notify={last.notify_sent}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
