from django.urls import path
from . import views


urlpatterns = [
    path("sync", views.SyncView.as_view(), name="mobile_sync"),
    path("token_registration", views.TokenRegistrationView.as_view(), name="token_registration"),
]
