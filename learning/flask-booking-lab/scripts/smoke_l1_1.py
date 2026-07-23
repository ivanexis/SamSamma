"""L1-1 smoke test: GET form → POST with CSRF → row in DB."""
from __future__ import annotations

import re
import sys

from app import create_app
from app.models import Booking


def main() -> int:
    app = create_app()
    client = app.test_client()

    r = client.get("/register")
    assert r.status_code == 200, r.status_code
    html = r.data.decode("utf-8")
    m = re.search(r'name="csrf_token"[^>]*value="([^"]+)"', html)
    if not m:
        m = re.search(r'value="([^"]+)"[^>]*name="csrf_token"', html)
    assert m, "csrf_token not found in form HTML"
    token = m.group(1)

    r2 = client.post(
        "/register",
        data={
            "csrf_token": token,
            "plan": "文化體驗半日",
            "org_name": "測試機構",
            "contact_name": "測試人",
            "email": "test@example.com",
            "phone": "0912345678",
            "submit": "y",
        },
        follow_redirects=True,
    )
    assert r2.status_code == 200, r2.status_code
    body = r2.data.decode("utf-8")
    assert "測試機構" in body or "已寫入" in body, body[:800]

    with app.app_context():
        n = Booking.query.count()
        last = Booking.query.order_by(Booking.id.desc()).first()
        assert n >= 1 and last is not None
        print(f"OK count={n} last_id={last.id} org={last.org_name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
