from django.urls import path
from . import views


urlpatterns = [
    path("adm_level", views.LkpAdmLevelView.as_view(), name="lkp_adm_level"),
    path("adm", views.LkpAdmView.as_view(), name="lkp_adm"),
]
