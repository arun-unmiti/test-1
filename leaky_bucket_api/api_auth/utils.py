import re, random, string
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from leaky_bucket_api.settings import env, EMAIL_HOST_USER


def is_email_valid(email):
    # Example: adminuser1@domain.com
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_pattern, email) is not None


def is_password_valid(password):
    # At least one uppercase letter, one lowecase letter and one number
    if len(password) < 8: return False
    if not re.search(r"[A-Z]", password): return False
    if not re.search(r"[a-z]", password): return False
    if not re.search(r"[0-9]", password): return False
    return True


def generate_random_password():
    length = random.randint(8, 16)
    required = [
        random.choice(string.ascii_lowercase),
        random.choice(string.ascii_uppercase),
        random.choice(string.digits),
    ]
    remaining_length = length - len(required)
    all_chars = string.ascii_letters + string.digits
    required += random.choices(all_chars, k=remaining_length)
    random.shuffle(required)
    return ''.join(required)


def send_initial_password_email(**kwargs):
    receiver = kwargs.get("receiver")
    email_template = render_to_string(
        "api_auth/initial_password.html",
        context={
            "name": kwargs.get("name"),
            "role": kwargs.get("role"),
            "initial_password": kwargs.get("initial_password"),
        }
    )
    email_obj = EmailMultiAlternatives(
        subject="Leaky Bucket App - You have been registered",
        body=email_template,
        from_email=EMAIL_HOST_USER,
        to=[receiver]
    )
    email_obj.attach_alternative(email_template, mimetype="text/html")
    result = email_obj.send(fail_silently=False)
    return result


def send_admin_reset_password_email(**kwargs):
    receiver = kwargs.get("receiver")
    email_template = render_to_string(
        "api_auth/admin_reset_password.html",
        context={
            "name": kwargs.get("name"),
            "new_password": kwargs.get("new_password"),
        }
    )
    email_obj = EmailMultiAlternatives(
        subject="Leaky Bucket App - Reset account password by site admin",
        body=email_template,
        from_email=EMAIL_HOST_USER,
        to=[receiver]
    )
    email_obj.attach_alternative(email_template, mimetype="text/html")
    result = email_obj.send(fail_silently=False)
    return result


def send_password_reset_email(**kwargs):
    receiver = kwargs.get("receiver")
    password_reset_token = kwargs.get("password_reset_token")
    reset_link = f"{env.get('UI_BASE_URL')}/reset-password?uuid={password_reset_token}&email={receiver}"
    email_template = render_to_string(
        "api_auth/reset_password.html",
        context={
            "name": kwargs.get("name"),
            "reset_link": reset_link,
        }
    )
    email_obj = EmailMultiAlternatives(
        subject="Leaky Bucket App - Reset account password",
        body=email_template,
        from_email=EMAIL_HOST_USER,
        to=[receiver]
    )
    email_obj.attach_alternative(email_template, mimetype="text/html")
    result = email_obj.send(fail_silently=False)
    return result
