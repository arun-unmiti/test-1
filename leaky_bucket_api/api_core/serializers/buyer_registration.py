from rest_framework import serializers
from ..models import TblCoreBuyer
from django.utils.timezone import datetime


class TblCoreBuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreBuyer
        fields = "__all__"

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5043": getattr(instance.field_5043, "pk", None),
                "field_5044": getattr(instance.field_5044, "pk", None),
                "field_5045": getattr(instance.field_5045, "pk", None),
                "field_5046": getattr(instance.field_5046, "pk", None),
                "field_5047": getattr(instance.field_5047, "pk", None),
                "field_5048": getattr(instance.field_5048, "pk", None),
                "field_5049": instance.field_5049,
                "field_5050": instance.field_5050,
                "field_5051": instance.field_5051,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5043": getattr(instance.field_5043, 'name', None),
                "field_5044": getattr(instance.field_5044, 'name', None),
                "field_5045": getattr(instance.field_5045, 'name', None),
                "field_5046": getattr(instance.field_5046, 'name', None),
                "field_5047": getattr(instance.field_5047, 'name', None),
                "field_5048": getattr(instance.field_5048, 'label', None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5043": getattr(instance.field_5043, 'name', None),
                "field_5044": getattr(instance.field_5044, 'name', None),
                "field_5045": getattr(instance.field_5045, 'name', None),
                "field_5046": getattr(instance.field_5046, 'name', None),
                "field_5047": getattr(instance.field_5047, 'name', None),
                "field_5048": getattr(instance.field_5048, 'label', None),
                "field_5049": instance.field_5049,
                "field_5050": instance.field_5050,
                "field_5051": instance.field_5051,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
