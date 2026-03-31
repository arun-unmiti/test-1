from rest_framework import serializers
from ..models import TblExpConstruction
from django.utils.timezone import datetime


class TblExpConstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpConstruction
        fields = "__all__"

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farm_id": getattr(instance.farm, "pk", None),
                "crop_id": getattr(instance.crop, "pk", None),
                "crop_lkp_id": getattr(getattr(instance.crop, "field_5027", None), "pk", None),
                "crop_name": getattr(getattr(instance.crop, "field_5027", None), "crop_name", None),
                "field_5062": instance.field_5062,
                "field_5063": instance.field_5063,
                "field_5064": instance.field_5064,
                "field_5065": getattr(instance.field_5065, "pk", None),
                "field_5066": instance.field_5066,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5062": instance.field_5062,
                "field_5063": instance.field_5063,
                "field_5065": getattr(instance.field_5065, 'label', None),
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
                "crop_id": getattr(instance.crop, "pk", None),
                "crop_lkp_id": getattr(getattr(instance.crop, "field_5027", None), "pk", None),
                "crop_name": getattr(getattr(instance.crop, "field_5027", None), "crop_name", None),
                "field_5062": instance.field_5062,
                "field_5063": instance.field_5063,
                "field_5064": instance.field_5064,
                "field_5065": getattr(instance.field_5065, 'label', None),
                "field_5066": instance.field_5066,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
