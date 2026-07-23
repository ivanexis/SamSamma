"""電話長度規則：數字 8～13 位（可含 - 空白 +）。"""
from __future__ import annotations

import re
from typing import Optional


def phone_digit_count(value: Optional[str]) -> int:
    return len(re.sub(r"\D", "", value or ""))


def is_valid_phone(value: Optional[str]) -> bool:
    n = phone_digit_count(value)
    return 8 <= n <= 13
