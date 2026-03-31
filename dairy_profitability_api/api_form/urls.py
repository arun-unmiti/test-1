from django.urls import path
from . import views


urlpatterns = [
    path("form/types", views.TblFormTypeView.as_view(), name="form_types"),
    path("forms", views.TblFormView.as_view(), name="forms"),
    path("form/fields", views.TblFormFieldView.as_view(), name="form_fields"),
]