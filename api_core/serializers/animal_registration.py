from rest_framework import serializers
from ..models import TblCoreAnimal
from api_form.models import TblFormFieldOption
from django.utils.timezone import datetime


class TblCoreAnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreAnimal
        fields = "__all__"

    def to_representation(self, instance):
        field_5054_vals = instance.field_5054 or []
        field_5065_vals = instance.field_5065 or []
        field_5067_vals = instance.field_5067 or []
        form_queryset = TblFormFieldOption.objects.filter(form_id=3)
        options_5054 = list(
            form_queryset.filter(field_id=5054, pk__in=field_5054_vals)
            .values_list("label", flat=True)
        ) or None
        options_5065 = list(
            form_queryset.filter(field_id=5065, pk__in=field_5065_vals)
            .values_list("label", flat=True)
        ) or None
        options_5067 = list(
            form_queryset.filter(field_id=5067, pk__in=field_5067_vals)
            .values_list("label", flat=True)
        ) or None
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": getattr(instance, "data_id", None),
                "farm_data_id": instance.farm_data_id,
                "herd_data_id": instance.herd_data_id,
                "field_5027": getattr(instance.field_5027, "pk", None),
                "field_5028": getattr(instance.field_5028, "pk", None),
                "field_5029": getattr(instance.field_5029, "pk", None),
                "field_5030": getattr(instance.field_5030, "pk", None),
                "field_5031": getattr(instance.field_5031, "pk", None),
                "field_5032": getattr(instance.field_5032, "pk", None),
                "field_5033": getattr(instance.field_5033, "pk", None),
                "field_5034": instance.field_5034,
                "field_5035": instance.field_5035,
                "field_5036": instance.field_5036,
                "field_5037": instance.field_5037,
                "field_5038": getattr(instance.field_5038, "pk", None),
                "field_5039": instance.field_5039,
                "field_5040": instance.field_5040,
                "field_5041": instance.field_5041,
                "field_5042": instance.field_5042,
                "field_5043": getattr(instance.field_5043, "pk", None),
                "field_5044": instance.field_5044,
                "field_5045": getattr(instance.field_5045, "pk", None),
                "field_5046": instance.field_5046,
                "field_5047": getattr(instance.field_5047, "pk", None),
                "field_5048": instance.field_5048,
                "field_5049": getattr(instance.field_5049, "pk", None),
                "field_5050": getattr(instance.field_5050, "pk", None),
                "field_5051": instance.field_5051,
                "field_5052": instance.field_5052,
                "field_5053": getattr(instance.field_5053, "pk", None),
                "field_5054": field_5054_vals,
                "field_5055": instance.field_5055,
                "field_5056": getattr(instance.field_5056, "pk", None),
                "field_5057": instance.field_5057,
                "field_5058": getattr(instance.field_5058, "pk", None),
                "field_5059": getattr(instance.field_5059, "pk", None),
                "field_5060": instance.field_5060,
                "field_5061": getattr(instance.field_5061, "pk", None),
                "field_5062": getattr(instance.field_5062, "pk", None),
                "field_5063": getattr(instance.field_5063, "pk", None),
                "field_5064": instance.field_5064,
                "field_5065": field_5065_vals,
                "field_5066": instance.field_5066,
                "field_5067": field_5067_vals,
                "field_5068": instance.field_5068,
                "field_5069": instance.field_5069,
                "additional_attributes": instance.additional_attributes,
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5027": getattr(instance.field_5027, "name", None),
                "field_5028": getattr(instance.field_5028, "name", None),
                "field_5029": getattr(instance.field_5029, "name", None),
                "field_5030": getattr(instance.field_5030, "name", None),
                "field_5031": getattr(instance.field_5031, "name", None),
                "field_5032": getattr(instance.field_5032, "field_5006", None),
                "field_5033": getattr(instance.field_5033, "field_5025", None),
                "field_5038": getattr(instance.field_5038, "label", None),
                "field_5043": getattr(instance.field_5043, "animal_type", None),
                "field_5045": getattr(instance.field_5045, "label", None),
                "field_5047": getattr(instance.field_5047, "label", None),
                "field_5049": getattr(instance.field_5049, "field_5037", None),
                "field_5050": getattr(instance.field_5050, "label", None),
                "field_5053": getattr(instance.field_5053, "field_5037", None),
                "field_5054": options_5054,
                "field_5056": getattr(instance.field_5056, "label", None),
                "field_5058": getattr(instance.field_5058, "label", None),
                "field_5059": getattr(instance.field_5059, "label", None),
                "field_5061": getattr(instance.field_5061, "cattlebreed_name", None),
                "field_5062": getattr(instance.field_5062, "label", None),
                "field_5063": getattr(instance.field_5063, "cattlebreed_name", None),
                "field_5065": options_5065,
                "field_5067": options_5067,
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": getattr(instance, "data_id", None),
                "farm_data_id": instance.farm_data_id,
                "herd_data_id": instance.herd_data_id,
                "field_5027": getattr(instance.field_5027, "name", None),
                "field_5028": getattr(instance.field_5028, "name", None),
                "field_5029": getattr(instance.field_5029, "name", None),
                "field_5030": getattr(instance.field_5030, "name", None),
                "field_5031": getattr(instance.field_5031, "name", None),
                "field_5032": getattr(instance.field_5032, "field_5006", None),
                "field_5033": getattr(instance.field_5033, "field_5025", None),
                "field_5034": instance.field_5034,
                "field_5035": instance.field_5035,
                "field_5036": instance.field_5036,
                "field_5037": instance.field_5037,
                "field_5038": getattr(instance.field_5038, "label", None),
                "field_5039": instance.field_5039,
                "field_5040": instance.field_5040,
                "field_5041": instance.field_5041,
                "field_5042": instance.field_5042,
                "field_5043": getattr(instance.field_5043, "animal_type", None),
                "field_5044": instance.field_5044,
                "field_5045": getattr(instance.field_5045, "label", None),
                "field_5046": instance.field_5046,
                "field_5047": getattr(instance.field_5047, "label", None),
                "field_5049": getattr(instance.field_5049, "field_5037", None),
                "field_5050": getattr(instance.field_5050, "label", None),
                "field_5051": instance.field_5051,
                "field_5052": instance.field_5052,
                "field_5053": getattr(instance.field_5053, "field_5037", None),
                "field_5054": options_5054,
                "field_5055": instance.field_5055,
                "field_5056": getattr(instance.field_5056, "label", None),
                "field_5057": instance.field_5057,
                "field_5058": getattr(instance.field_5058, "label", None),
                "field_5059": getattr(instance.field_5059, "label", None),
                "field_5060": instance.field_5060,
                "field_5061": getattr(instance.field_5061, "cattlebreed_name", None),
                "field_5062": getattr(instance.field_5062, "label", None),
                "field_5063": getattr(instance.field_5063, "cattlebreed_name", None),
                "field_5065": options_5065,
                "field_5067": options_5067,
                "created_by": getattr(instance.created_by_user, "name", None),
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
