from rest_framework import serializers
from ..models import TblCoreFarm
from django.utils.timezone import datetime


class TblCoreFarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreFarm
        fields = "__all__"

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farmer_id": getattr(instance.farmer, "pk", None),
                "field_5014": instance.field_5014,
                "field_5015": instance.field_5015,
                "field_5016": getattr(instance.field_5016, "pk", None),
                "field_5017": getattr(instance.field_5017, "pk", None),
                "field_5018": getattr(instance.field_5018, "pk", None),
                "field_5019": getattr(instance.field_5019, "pk", None),
                "field_5020": getattr(instance.field_5020, "pk", None),
                "field_5021": instance.field_5021,
                "field_5022": getattr(instance.field_5022, "pk", None),
                "field_5023": instance.field_5023,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5014": instance.field_5014,
                "field_5016": getattr(instance.field_5016, "name", None),
                "field_5017": getattr(instance.field_5017, "name", None),
                "field_5018": getattr(instance.field_5018, "name", None),
                "field_5019": getattr(instance.field_5019, "name", None),
                "field_5020": getattr(instance.field_5020, "name", None),
                "field_5022": getattr(instance.field_5022, "area_unit", None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farmer_id": getattr(instance.farmer, "pk", None),
                "field_5014": instance.field_5014,
                "field_5015": instance.field_5015,
                "field_5016": getattr(instance.field_5016, "name", None),
                "field_5017": getattr(instance.field_5017, "name", None),
                "field_5018": getattr(instance.field_5018, "name", None),
                "field_5019": getattr(instance.field_5019, "name", None),
                "field_5020": getattr(instance.field_5020, "name", None),
                "field_5021": instance.field_5021,
                "field_5022": getattr(instance.field_5022, "area_unit", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
