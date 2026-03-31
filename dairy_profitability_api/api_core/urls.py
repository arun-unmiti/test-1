from django.urls import path
from . import views


urlpatterns = [
    path("core", views.CoreView.as_view(), name="data_core"),
    path("core/lkp/<str:lkp>", views.CoreLkpView.as_view(), name="data_core_lkp"),
]
