from django.urls import path
from api_web.views.auth.user_mgmt import UserMgmtView

urlpatterns = [
    # ── User Management (web-only) ───────────────────────────────────────────
    path("auth/user_mgmt", UserMgmtView.as_view(), name="web_user_mgmt"),
]
