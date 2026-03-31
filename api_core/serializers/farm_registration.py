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
            values =  {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5001": getattr(instance.field_5001, "pk", None),
                "field_5002": getattr(instance.field_5002, "pk", None),
                "field_5003": getattr(instance.field_5003, "pk", None),
                "field_5004": getattr(instance.field_5004, "pk", None),
                "field_5005": getattr(instance.field_5005, "pk", None),
                "field_5006": instance.field_5006,
                "field_5007": instance.field_5007,
                "field_5008": instance.field_5008,
                "field_5009": instance.field_5009,
                "field_5010": instance.field_5010,
                "field_5011": getattr(instance.field_5011, "pk", None),
                "field_5012": getattr(instance.field_5012, "pk", None),
                "field_5013": getattr(instance.field_5013, "pk", None),
                "field_5014": getattr(instance.field_5014, "pk", None),
                "field_5015": getattr(instance.field_5015, "pk", None),
                "field_5016": getattr(instance.field_5016, "pk", None),
                "field_5017": instance.field_5009,
                "field_5018": instance.field_5010,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5001": getattr(instance.field_5001, "name", None),
                "field_5002": getattr(instance.field_5002, "name", None),
                "field_5003": getattr(instance.field_5003, "name", None),
                "field_5004": getattr(instance.field_5004, "name", None),
                "field_5005": getattr(instance.field_5005, "name", None),
                "field_5011": getattr(instance.field_5011, "label", None),
                "field_5012": getattr(instance.field_5012, "label", None),
                "field_5013": getattr(instance.field_5013, "label", None),
                "field_5014": getattr(instance.field_5014, "label", None),
                "field_5015": getattr(instance.field_5015, "label", None),
                "field_5016": getattr(instance.field_5016, "label", None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5001": getattr(instance.field_5001, "name", None),
                "field_5002": getattr(instance.field_5002, "name", None),
                "field_5003": getattr(instance.field_5003, "name", None),
                "field_5004": getattr(instance.field_5004, "name", None),
                "field_5005": getattr(instance.field_5005, "name", None),
                "field_5006": instance.field_5006,
                "field_5007": instance.field_5007,
                "field_5008": instance.field_5008,
                "field_5009": instance.field_5009,
                "field_5010": instance.field_5010,
                "field_5011": getattr(instance.field_5011, "label", None),
                "field_5012": getattr(instance.field_5012, "label", None),
                "field_5013": getattr(instance.field_5013, "label", None),
                "field_5014": getattr(instance.field_5014, "label", None),
                "field_5015": getattr(instance.field_5015, "label", None),
                "field_5016": getattr(instance.field_5016, "label", None),
                "field_5017": instance.field_5009,
                "field_5018": instance.field_5010,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
