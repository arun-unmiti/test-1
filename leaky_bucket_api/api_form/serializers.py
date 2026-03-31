from rest_framework import serializers
from .models import TblFormType, TblForm, TblFormField, TblFormFieldOption


class TblFormTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormType
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "type": instance.form_type,
        }
    

class TblFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblForm
        fields = "__all__"
    

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "title": instance.form_title,
            "type": getattr(instance.form_type, "form_type", None),
            "crop_stage": getattr(instance.crop_stage, "crop_stage", None),
        }
    

class TblFormFieldOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormFieldOption
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "multi_id": instance.pk,
            "field_id": instance.field_id,
            "form_id": instance.form_id,
            "label": instance.label,
            "selected": instance.selected,
        }


class TblFormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormField
        fields = "__all__"

    def to_representation(self, instance):
        representation = {
            "form_id": instance.form_id,
            "field_id": instance.pk,
            "attribute_key": instance.attribute_key,
            "type": instance.type,
            "subtype": instance.subtype,
            "label": instance.label,
            "description": instance.description,
            "parent_id": instance.parent_id,
            "parent_value": instance.parent_value,
            "lookup_table": instance.ref_table,
        }
        if instance.type in ["radio-group", "checkbox-group", "select"]:
            queryset = TblFormFieldOption.objects.filter(field_id=instance.pk, status=1).order_by("order_by")
            if queryset:
                representation["options"] = TblFormFieldOptionSerializer(queryset, many=True).data
        representation["status"] = instance.status
        return representation
    