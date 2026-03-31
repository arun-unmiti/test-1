from rest_framework import serializers
from ..models import TblExpHarvest
from django.utils.timezone import datetime


class TblExpHarvestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpHarvest
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
                "field_5127": instance.field_5127,
                "field_5128": instance.field_5128,
                "field_5129": instance.field_5129,
                "field_5130": getattr(instance.field_5130, "pk", None),
                "field_5131": getattr(instance.field_5131, "pk", None),
                "field_5132": instance.field_5132,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5127": instance.field_5127,
                "field_5128": instance.field_5128,
                "field_5130": getattr(instance.field_5130, 'label', None),
                "field_5131": getattr(instance.field_5131, 'label', None),
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
                "field_5127": instance.field_5127,
                "field_5128": instance.field_5128,
                "field_5129": instance.field_5129,
                "field_5130": getattr(instance.field_5130, 'label', None),
                "field_5131": getattr(instance.field_5131, 'label', None),
                "field_5132": instance.field_5132,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
