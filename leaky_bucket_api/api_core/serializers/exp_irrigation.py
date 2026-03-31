from rest_framework import serializers
from ..models import TblExpIrrigation
from django.utils.timezone import datetime


class TblExpIrrigationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpIrrigation
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
                "field_5102": instance.field_5102,
                "field_5103": instance.field_5103,
                "field_5104": instance.field_5104,
                "field_5105": getattr(instance.field_5105, "pk", None),
                "field_5106": getattr(instance.field_5106, "pk", None),
                "field_5107": getattr(instance.field_5107, "pk", None),
                "field_5108": instance.field_5108,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5102": instance.field_5102,
                "field_5103": instance.field_5103,
                "field_5105": getattr(instance.field_5105, 'label', None),
                "field_5106": getattr(instance.field_5106, 'label', None),
                "field_5107": getattr(instance.field_5107, 'label', None),
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
                "field_5102": instance.field_5102,
                "field_5103": instance.field_5103,
                "field_5104": instance.field_5104,
                "field_5105": getattr(instance.field_5105, 'label', None),
                "field_5106": getattr(instance.field_5106, 'label', None),
                "field_5107": getattr(instance.field_5107, 'label', None),
                "field_5108": instance.field_5108,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
