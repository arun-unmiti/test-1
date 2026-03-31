from rest_framework import serializers
from ..models import TblFarmVisit
from django.utils.timezone import datetime


class TblFarmVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFarmVisit
        fields = "__all__"

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values =  {
                "id": instance.pk,
                "data_id": getattr(instance.field_5024, "data_id", None),
                "farm_data_id": getattr(instance, "farm_data_id", None),
                
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                
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
                
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
