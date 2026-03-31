from rest_framework import serializers
from ..models import TblCoreCrop
from api_form.models import TblFormFieldOption
from django.utils.timezone import datetime


class TblCoreCropSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreCrop
        fields = "__all__"

    def to_representation(self, instance):
        form_queryset = TblFormFieldOption.objects.filter(form_id=3)
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farm_id": getattr(instance.farm, "pk", None),
                "farmer_id": getattr(instance.farmer, "pk", None),
                "field_5024": instance.field_5024,
                "field_5025": instance.field_5025,
                "field_5026": getattr(instance.field_5026, "pk", None),
                "field_5027": getattr(instance.field_5027, "pk", None),
                "field_5028": instance.field_5028,
                "field_5029": getattr(instance.field_5029, "pk", None),
                "field_5030": instance.field_5030,
                "field_5031": instance.field_5031,
                "field_5032": instance.field_5032,
                "field_5033": instance.field_5033,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5024": instance.field_5024,
                "field_5025": instance.field_5025,
                "field_5026": getattr(instance.field_5026, "crop_category", None),
                "field_5027": getattr(instance.field_5027, "crop_name", None),
                "field_5029": getattr(instance.field_5029, "area_unit", None),
                "field_5031": getattr(instance.field_5031, "label", None),
                "field_5032": getattr(instance.field_5032, "label", None),
                "field_5033": getattr(instance.field_5033, "label", None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farm_id": getattr(instance.farm, "pk", None),
                "farmer_id": getattr(instance.farmer, "pk", None),
                "field_5024": instance.field_5024,
                "field_5025": instance.field_5025,
                "field_5026": getattr(instance.field_5026, "crop_category", None),
                "field_5027": getattr(instance.field_5027, "crop_name", None),
                "field_5028": instance.field_5028,
                "field_5029": getattr(instance.field_5029, "area_unit", None),
                "field_5031": getattr(instance.field_5031, "label", None),
                "field_5032": getattr(instance.field_5032, "label", None),
                "field_5033": getattr(instance.field_5033, "label", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
