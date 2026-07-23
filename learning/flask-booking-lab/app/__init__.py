from flask import Flask

from app.config import Config
from app.extensions import csrf, db


def _ensure_booking_columns() -> None:
    from sqlalchemy import inspect, text

    insp = inspect(db.engine)
    if "bookings" not in insp.get_table_names():
        return
    existing = {c["name"] for c in insp.get_columns("bookings")}
    columns = [
        ("record_type", "VARCHAR(20) NOT NULL DEFAULT 'activity'"),
        ("product_name", "VARCHAR(200) NOT NULL DEFAULT ''"),
        ("quantity", "VARCHAR(80) NOT NULL DEFAULT ''"),
        ("tax_id", "VARCHAR(20) NOT NULL DEFAULT ''"),
        ("need_invoice", "VARCHAR(80) NOT NULL DEFAULT ''"),
        ("delivery", "VARCHAR(80) NOT NULL DEFAULT ''"),
        ("notes", "VARCHAR(500) NOT NULL DEFAULT ''"),
        ("status", "VARCHAR(32) NOT NULL DEFAULT 'new'"),
        ("admin_note", "VARCHAR(500) NOT NULL DEFAULT ''"),
        ("notify_sent", "BOOLEAN NOT NULL DEFAULT 0"),
        ("updated_at", "DATETIME"),
        ("participants", "VARCHAR(40) NOT NULL DEFAULT ''"),
        ("preferred_date", "VARCHAR(40) NOT NULL DEFAULT ''"),
        ("duration", "VARCHAR(120) NOT NULL DEFAULT ''"),
        ("budget", "VARCHAR(120) NOT NULL DEFAULT ''"),
        ("addons", "VARCHAR(500) NOT NULL DEFAULT ''"),
        ("source", "VARCHAR(40) NOT NULL DEFAULT 'lab_form'"),
    ]
    alters = [
        f"ALTER TABLE bookings ADD COLUMN {name} {decl}"
        for name, decl in columns
        if name not in existing
    ]
    if not alters:
        return
    with db.engine.begin() as conn:
        for stmt in alters:
            conn.execute(text(stmt))
        if "updated_at" not in existing:
            conn.execute(
                text("UPDATE bookings SET updated_at = created_at WHERE updated_at IS NULL")
            )


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    csrf.init_app(app)

    from app.api import api_bp
    from app.routes import bp as main_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    with app.app_context():
        from app import models  # noqa: F401

        db.create_all()
        _ensure_booking_columns()

    return app
