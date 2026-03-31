from rest_framework import serializers
from ..models import TblExpProcessing
from django.utils.timezone import datetime


class TblExpProcessingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpProcessing
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
                "field_5145": instance.field_5145,
                "field_5146": instance.field_5146,
                "field_5147": instance.field_5147,
                "field_5148": getattr(instance.field_5148, "pk", None),
                "field_5149": getattr(instance.field_5149, "pk", None),
                "field_5150": instance.field_5150,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5145": instance.field_5145,
                "field_5146": instance.field_5146,
                "field_5148": getattr(instance.field_5148, 'label', None),
                "field_5149": getattr(instance.field_5149, 'label', None),
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
                "field_5145": instance.field_5145,
                "field_5146": instance.field_5146,
                "field_5147": instance.field_5147,
                "field_5148": getattr(instance.field_5148, 'label', None),
                "field_5149": getattr(instance.field_5149, 'label', None),
                "field_5150": instance.field_5150,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
