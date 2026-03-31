from django.urls import path
from . import views


urlpatterns = [
    path("register", views.RegisterView.as_view(), name="register"),
    path("login", views.LoginView.as_view(), name="login"),
    path("self", views.SelfView.as_view(), name="self"),
    path("device_id", views.DeviceIdView.as_view(), name="device_id"),
    path("user_role", views.UserRoleView.as_view(), name="user_role"),
    path("user_mgmt", views.UserMgmtView.as_view(), name="user_mgmt"),
    path("profile", views.UserProfileView.as_view(), name="user_profile"),
    path("forgot_password", views.ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset_password", views.ResetPasswordView.as_view(), name="reset_password"),
]