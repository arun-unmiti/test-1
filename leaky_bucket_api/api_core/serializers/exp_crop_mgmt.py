from rest_framework import serializers
from ..models import TblExpCropMgmt
from django.utils.timezone import datetime


class TblExpCropMgmtSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpCropMgmt
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
                "field_5109": instance.field_5109,
                "field_5110": instance.field_5110,
                "field_5111": instance.field_5111,
                "field_5112": instance.field_5112,
                "field_5113": instance.field_5113,
                "field_5114": instance.field_5114,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5109": instance.field_5109,
                "field_5110": instance.field_5110,
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
                "field_5109": instance.field_5109,
                "field_5110": instance.field_5110,
                "field_5111": instance.field_5111,
                "field_5112": instance.field_5112,
                "field_5113": instance.field_5113,
                "field_5114": instance.field_5114,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
