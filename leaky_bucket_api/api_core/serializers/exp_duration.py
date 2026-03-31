from rest_framework import serializers
from ..models import TblExpDuration
from django.utils.timezone import datetime


class TblExpDurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpDuration
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
                "field_5098": instance.field_5098,
                "field_5099": instance.field_5099,
                "field_5100": instance.field_5100,
                "field_5101": getattr(instance.field_5101, "pk", None),
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5098": instance.field_5098,
                "field_5099": instance.field_5099,
                "field_5101": getattr(instance.field_5101, 'label', None),
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
                "field_5098": instance.field_5098,
                "field_5099": instance.field_5099,
                "field_5100": instance.field_5100,
                "field_5101": getattr(instance.field_5101, 'label', None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
