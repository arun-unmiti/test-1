from .sql_structure import RawSQL
import random
import string
from django.utils.timezone import now, datetime
import re

def generate_data_id(logged_in_user_id):
    chars = string.ascii_uppercase + string.digits
    random_six = ''.join(random.choices(chars, k=6))
    epoch = now().timestamp().__int__()
    return f"{epoch}-{random_six}-{logged_in_user_id}"
    

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


def is_required(value):
    return value is not None


def is_integer(value):
    return isinstance(value, int) and not isinstance(value, bool)


def is_float(value):
    return isinstance(value, float)


def is_string(value):
    return isinstance(value, str) and value.strip() != ""


def is_number(value):
    return isinstance(value, (int, float))


def is_valid_latitude(value):
    return isinstance(value, (int, float)) and -90 <= value <= 90


def is_valid_longitude(value):
    return isinstance(value, (int, float)) and -180 <= value <= 180


def is_boolean(value):
    if isinstance(value, bool):
        return True
    if isinstance(value, int) and value in (0, 1):
        return True
    return False


def is_array(value):
    return isinstance(value, (list, tuple))
