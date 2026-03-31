from rest_framework import serializers
from ..models import TblCoreHerd
from django.utils.timezone import datetime


class TblCoreHerdSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreHerd
        fields = "__all__"
    

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values =  {
                "id": instance.pk,
                "data_id": getattr(instance, "data_id", None),
                "farm_data_id": instance.farm_data_id,
                "field_5019": getattr(instance.field_5019, "pk", None),
                "field_5020": getattr(instance.field_5020, "pk", None),
                "field_5021": getattr(instance.field_5021, "pk", None),
                "field_5022": getattr(instance.field_5022, "pk", None),
                "field_5023": getattr(instance.field_5023, "pk", None),
                "field_5024": getattr(instance.field_5024, "pk", None),
                "field_5025": instance.field_5025,
                "field_5026": getattr(instance.field_5026, "pk", None),
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5019": getattr(instance.field_5019, "name", None),
                "field_5020": getattr(instance.field_5020, "name", None),
                "field_5021": getattr(instance.field_5021, "name", None),
                "field_5022": getattr(instance.field_5022, "name", None),
                "field_5023": getattr(instance.field_5023, "name", None),
                "field_5024": getattr(instance.field_5024, "farm_name", None),
                "field_5026": getattr(instance.field_5026, "label", None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": getattr(instance.field_5024, "data_id", None),
                "farm_data_id": getattr(instance, "farm_data_id", None),
                "field_5019": getattr(instance.field_5019, "name", None),
                "field_5020": getattr(instance.field_5020, "name", None),
                "field_5021": getattr(instance.field_5021, "name", None),
                "field_5022": getattr(instance.field_5022, "name", None),
                "field_5023": getattr(instance.field_5023, "name", None),
                "field_5024": getattr(instance.field_5024, "label", None),
                "field_5026": getattr(instance.field_5026, "label", None),
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
