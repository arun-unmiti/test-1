from rest_framework import serializers
from ..models import TblExpTillage
from django.utils.timezone import datetime


class TblExpTillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpTillage
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
                "field_5077": instance.field_5077,
                "field_5078": instance.field_5078,
                "field_5079": instance.field_5079,
                "field_5080": getattr(instance.field_5080, "pk", None),
                "field_5081": getattr(instance.field_5081, "pk", None),
                "field_5082": instance.field_5082,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5077": instance.field_5077,
                "field_5078": instance.field_5078,
                "field_5080": getattr(instance.field_5080, 'label', None),
                "field_5081": getattr(instance.field_5081, 'label', None),
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
                "field_5077": instance.field_5077,
                "field_5078": instance.field_5078,
                "field_5079": instance.field_5079,
                "field_5080": getattr(instance.field_5080, 'label', None),
                "field_5081": getattr(instance.field_5081, 'label', None),
                "field_5082": instance.field_5082,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
