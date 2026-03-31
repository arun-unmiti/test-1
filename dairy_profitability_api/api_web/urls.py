# api_web/urls.py
from django.urls import path

# ── User Management (existing) ─────────────────────────────────────────────
from api_web.views.auth.user_mgmt import UserMgmtView

# ── Forgot & Reset Password (new - ported from leaky-bucket commit) ────────
from api_web.views.auth.password_reset import ForgotPasswordView, ResetPasswordView

# ── Location Stats ─────────────────────────────────────────────────────────
from api_web.views.location_stats import LocationStatsView


urlpatterns = [
    # User Management
    path("auth/user_mgmt", UserMgmtView.as_view(), name="web_user_mgmt"),

    # Forgot & Reset Password
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    path("auth/reset-password/", ResetPasswordView.as_view(), name="reset_password"),

    # Location Stats
    path("location_stats", LocationStatsView.as_view(), name="web_location_stats"),
]