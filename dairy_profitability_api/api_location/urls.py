from django.urls import path
from . import views


urlpatterns = [
    # existing location hierarchy endpoints
    path("location/adm_level", views.LkpAdmLevelView.as_view(), name="lkp_adm_level"),
    path("location/adm",       views.LkpAdmView.as_view(),      name="lkp_adm"),

    # lookup endpoints (previously under web/)
    path("country",  views.CountryListView.as_view(),    name="lkp_country"),
    path("location", views.LocationCascadeView.as_view(), name="lkp_location_cascade"),
]
