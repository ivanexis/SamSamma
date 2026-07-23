"""L1-2 smoke: admin requires login; login then dashboard."""
from __future__ import annotations

import os
import re
import sys

os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "1234")

from app import create_app


def _csrf(html: str) -> str:
    m = re.search(r'name="csrf_token"[^>]*value="([^"]+)"', html)
    if not m:
        m = re.search(r'value="([^"]+)"[^>]*name="csrf_token"', html)
    assert m, "csrf not found"
    return m.group(1)


def main() -> int:
    app = create_app()
    client = app.test_client()

    r = client.get("/admin", follow_redirects=False)
    assert r.status_code in (302, 301), r.status_code

    login_page = client.get("/admin/login")
    assert login_page.status_code == 200
    token = _csrf(login_page.data.decode("utf-8"))

    bad = client.post(
        "/admin/login",
        data={
            "csrf_token": token,
            "username": "wrong",
            "password": "wrong",
            "submit": "y",
        },
        follow_redirects=True,
    )
    assert "錯誤" in bad.data.decode("utf-8")

    login_page = client.get("/admin/login")
    token = _csrf(login_page.data.decode("utf-8"))
    ok = client.post(
        "/admin/login",
        data={
            "csrf_token": token,
            "username": "admin",
            "password": "1234",
            "submit": "y",
        },
        follow_redirects=True,
    )
    body = ok.data.decode("utf-8")
    assert ok.status_code == 200
    assert "總覽" in body and "活動預約" in body and "商品訂購" in body, body[:500]
    print("OK admin login + dashboard")
    return 0


if __name__ == "__main__":
    sys.exit(main())
