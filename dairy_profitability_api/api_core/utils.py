from django.utils.timezone import datetime
import re


def is_date_valid(date_str):
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False


def is_email_valid(email):
    # Example: adminuser1@domain.com
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_pattern, email) is not None


def is_phone_valid(phone):
    phone_str = str(phone)
    return phone_str.isdigit() and len(phone_str) <= 16


def is_valid_latitude(value):
    try:
        value = float(value)
        return -90 <= value <= 90
    except (TypeError, ValueError):
        return False


def is_valid_longitude(value):
    try:
        value = float(value)
        return -180 <= value <= 180
    except (TypeError, ValueError):
        return False


def is_truthy(value):
    if isinstance(value, bool): return value
    if isinstance(value, (int, float)): return value == 1
    if isinstance(value, str): return value.strip().lower() in {"true", "1", "yes", "y"}
    return False