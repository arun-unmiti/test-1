from rest_framework import serializers
from ..models import TblExpSoilPrep
from django.utils.timezone import datetime


class TblExpSoilPrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpSoilPrep
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
                "field_5083": instance.field_5083,
                "field_5084": instance.field_5084,
                "field_5085": instance.field_5085,
                "field_5086": getattr(instance.field_5086, "pk", None),
                "field_5087": getattr(instance.field_5087, "pk", None),
                "field_5088": getattr(instance.field_5088, "pk", None),
                "field_5089": instance.field_5089,
                "field_5090": instance.field_5090,
                "field_5091": instance.field_5091,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5083": instance.field_5083,
                "field_5084": instance.field_5084,
                "field_5086": getattr(instance.field_5086, 'label', None),
                "field_5087": getattr(instance.field_5087, 'label', None),
                "field_5088": getattr(instance.field_5088, 'label', None),
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
                "field_5083": instance.field_5083,
                "field_5084": instance.field_5084,
                "field_5085": instance.field_5085,
                "field_5086": getattr(instance.field_5086, 'label', None),
                "field_5087": getattr(instance.field_5087, 'label', None),
                "field_5088": getattr(instance.field_5088, 'label', None),
                "field_5089": instance.field_5089,
                "field_5090": instance.field_5090,
                "field_5091": instance.field_5091,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
