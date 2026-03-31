from rest_framework import serializers
from ..models import TblCoreCoopGroup
from api_form.models import TblFormFieldOption
from django.utils.timezone import datetime


class TblCoreCoopGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreCoopGroup
        fields = "__all__"

    def to_representation(self, instance):
        form_queryset = TblFormFieldOption.objects.filter(form_id=11)
        field_5074_vals = instance.field_5074 or []
        field_5076_vals = instance.field_5076 or []
        options_5074 = list(
            form_queryset.filter(field_id=5074, pk__in=field_5074_vals)
            .values_list("label", flat=True)
        ) or None
        options_5076 = list(
            form_queryset.filter(field_id=5076, pk__in=field_5076_vals)
            .values_list("label", flat=True)
        ) or None
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": getattr(instance, "data_id", None),
                "field_5070": getattr(instance.field_5070, "pk", None),
                "field_5071": getattr(instance.field_5071, "pk", None),
                "field_5072": getattr(instance.field_5072, "pk", None),
                "field_5073": getattr(instance.field_5073, "pk", None),
                "field_5074": field_5074_vals, # Array
                "field_5075": instance.field_5075,
                "field_5076": field_5076_vals, # Array
                "field_5077": instance.field_5077,
                "field_5078": getattr(instance.field_5078, "pk", None),
                "field_5079": getattr(instance.field_5079, "pk", None),
                "field_5080": instance.field_5080, 
                "field_5081": instance.field_5081,
                "additional_attributes": instance.additional_attributes,
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status, 
            }
            
            options_5074 = list(form_queryset.filter(field_id=5074, pk__in=values.get("field_5074")).values_list("label", flat=True)) or None
            options_5076 = list(form_queryset.filter(field_id=5076, pk__in=values.get("field_5076")).values_list("label", flat=True)) or None
            labels = {
                "field_5070": getattr(instance.field_5070, "name", None),
                "field_5071": getattr(instance.field_5071, "name", None),
                "field_5072": getattr(instance.field_5072, "label", None),
                "field_5073": getattr(instance.field_5073, "label", None),
                "field_5074": options_5074,
                "field_5076": options_5076,
                "field_5078": getattr(instance.field_5078, "label", None),
                "field_5079": getattr(instance.field_5079, "label", None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": getattr(instance, "data_id", None),
                "field_5070": getattr(instance.field_5070, "name", None),
                "field_5071": getattr(instance.field_5071, "name", None),
                "field_5072": getattr(instance.field_5072, "label", None),
                "field_5073": getattr(instance.field_5073, "label", None),
                "field_5074": options_5074,
                "field_5076": options_5076,
                "field_5078": getattr(instance.field_5078, "label", None),
                "field_5079": getattr(instance.field_5079, "label", None),
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status, 
            }
        