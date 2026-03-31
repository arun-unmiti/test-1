from rest_framework import serializers
from ..models import TblCoreSupplier
from django.utils.timezone import datetime


class TblCoreSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreSupplier
        fields = "__all__"

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5034": getattr(instance.field_5034, "pk", None),
                "field_5035": getattr(instance.field_5035, "pk", None),
                "field_5036": getattr(instance.field_5036, "pk", None),
                "field_5037": getattr(instance.field_5037, "pk", None),
                "field_5038": getattr(instance.field_5038, "pk", None),
                "field_5039": getattr(instance.field_5038, "pk", None),
                "field_5040": instance.field_5040,
                "field_5041": instance.field_5041,
                "field_5042": instance.field_5042,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5034": getattr(instance.field_5034, 'name', None),
                "field_5035": getattr(instance.field_5035, 'name', None),
                "field_5036": getattr(instance.field_5036, 'name', None),
                "field_5037": getattr(instance.field_5037, 'name', None),
                "field_5038": getattr(instance.field_5038, 'name', None),
                "field_5039": getattr(instance.field_5038, 'label', None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5034": getattr(instance.field_5034, 'name', None),
                "field_5035": getattr(instance.field_5035, 'name', None),
                "field_5036": getattr(instance.field_5036, 'name', None),
                "field_5037": getattr(instance.field_5037, 'name', None),
                "field_5038": getattr(instance.field_5038, 'name', None),
                "field_5039": getattr(instance.field_5038, 'label', None),
                "field_5040": instance.field_5040,
                "field_5041": instance.field_5041,
                "field_5042": instance.field_5042,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
