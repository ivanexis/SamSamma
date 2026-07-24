import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-only-insecure-fallback"
    DEBUG = os.environ.get("FLASK_DEBUG", "0") == "1"

    _db_url = os.environ.get("DATABASE_URL", "sqlite:///bookings.db")
    if _db_url.startswith("sqlite:///") and ":///" in _db_url:
        _name = _db_url.replace("sqlite:///", "", 1)
        if not os.path.isabs(_name):
            instance = BASE_DIR / "instance"
            instance.mkdir(exist_ok=True)
            _db_url = "sqlite:///" + str(instance / _name).replace("\\", "/")
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    WTF_CSRF_ENABLED = True

    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

    # Gmail SMTP 通知（填寫後寄給工作人員）
    MAIL_ENABLED = os.environ.get("MAIL_ENABLED", "0") == "1"
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", "587"))
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "")  # Gmail「應用程式密碼」
    MAIL_FROM = os.environ.get("MAIL_FROM", "")
    MAIL_TO = os.environ.get("MAIL_TO", "")  # 工作人員收件

    # 官網雙寫 API
    INGEST_API_KEY = os.environ.get("INGEST_API_KEY", "")  # 空＝本機 demo 不檢查
    CORS_ORIGINS = [
        o.strip()
        for o in os.environ.get(
            "CORS_ORIGINS",
            "http://127.0.0.1:5500,http://localhost:5500,https://samsamma.jeff11051212.workers.dev,https://ivangoldaura.pages.dev,null",
        ).split(",")
        if o.strip()
    ]
    # 學習站對外網址（通知信／文件用）
    PUBLIC_BASE_URL = os.environ.get(
        "PUBLIC_BASE_URL", "http://127.0.0.1:5001"
    ).rstrip("/")
