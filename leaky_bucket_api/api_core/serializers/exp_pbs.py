from rest_framework import serializers
from ..models import TblExpPbs
from django.utils.timezone import datetime


class TblExpPbsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpPbs
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
                "field_5133": instance.field_5133,
                "field_5134": instance.field_5134,
                "field_5135": instance.field_5135,
                "field_5136": getattr(instance.field_5136, "pk", None),
                "field_5137": getattr(instance.field_5137, "pk", None),
                "field_5138": instance.field_5138,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5133": instance.field_5133,
                "field_5134": instance.field_5134,
                "field_5136": getattr(instance.field_5136, 'label', None),
                "field_5137": getattr(instance.field_5137, 'label', None),
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
                "field_5133": instance.field_5133,
                "field_5134": instance.field_5134,
                "field_5135": instance.field_5135,
                "field_5136": getattr(instance.field_5136, 'label', None),
                "field_5137": getattr(instance.field_5137, 'label', None),
                "field_5138": instance.field_5138,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
