from rest_framework import serializers
from ..models import TblCoreFarmer
from api_form.models import TblFormFieldOption
from django.utils.timezone import datetime


class TblCoreFarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreFarmer
        fields = "__all__"

    def to_representation(self, instance):
        form_queryset = TblFormFieldOption.objects.filter(form_id=1)
        field_5013_vals = instance.field_5013 or []
        options_5013 = list(
            form_queryset.filter(field_id=5013, pk__in=field_5013_vals)
            .values_list("label", flat=True)
        ) or None
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "user_id": getattr(instance.user, "pk", None),
                "field_5002": instance.field_5002,
                "field_5003": instance.field_5003,
                "field_5004": instance.field_5004,
                "field_5005": getattr(instance.field_5005, "pk", None),
                "field_5006": instance.field_5006,
                "field_5007": getattr(instance.field_5007, "pk", None),
                "field_5008": getattr(instance.field_5008, "pk", None),
                "field_5009": getattr(instance.field_5009, "pk", None),
                "field_5010": getattr(instance.field_5010, "pk", None),
                "field_5011": getattr(instance.field_5011, "pk", None),
                "field_5012": getattr(instance.field_5012, "pk", None),
                "field_5013": instance.field_5013,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5005": getattr(instance.field_5005, "label", None),
                "field_5007": getattr(instance.field_5007, "name", None),
                "field_5008": getattr(instance.field_5008, "name", None),
                "field_5009": getattr(instance.field_5009, "name", None),
                "field_5010": getattr(instance.field_5010, "name", None),
                "field_5011": getattr(instance.field_5011, "name", None),
                "field_5012": getattr(instance.field_5012, "label", None),
                "field_5013": options_5013,
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "field_5002": instance.field_5002,
                "field_5003": instance.field_5003,
                "field_5004": instance.field_5004,
                "field_5005": getattr(instance.field_5005, "label", None),
                "field_5006": instance.field_5006,
                "field_5007": getattr(instance.field_5007, "name", None),
                "field_5008": getattr(instance.field_5008, "name", None),
                "field_5009": getattr(instance.field_5009, "name", None),
                "field_5010": getattr(instance.field_5010, "name", None),
                "field_5011": getattr(instance.field_5011, "name", None),
                "field_5012": getattr(instance.field_5012, "label", None),
                "field_5013": options_5013,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
