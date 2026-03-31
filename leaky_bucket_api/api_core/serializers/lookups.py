from ..models import (
    LkpCropGroup, LkpCropCategory, LkpCropStage, LkpCropCycle, LkpCrop,
    LkpAreaUnits,
)
from rest_framework import serializers


class LkpCropGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropGroup
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "crop_group": instance.crop_group,
            "status": instance.status,
        }


class LkpCropCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropCategory
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "crop_category": instance.crop_category,
            "status": instance.status,
        }


class LkpCropStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropStage
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "crop_stage": instance.crop_stage,
            "status": instance.status,
        }


class LkpCropCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropCycle
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "crop_stage_id": getattr(instance.crop_stage, "pk", None),
            "crop_stage": getattr(instance.crop_stage, "crop_stage", None),
            "activity": instance.activity,
            "status": instance.status,
        }


class LkpCropSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCrop
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "crop_group_id": getattr(instance.crop_group, "pk", None),
            "crop_group": getattr(instance.crop_group, "crop_group", None),
            "crop_category_id": getattr(instance.crop_category, "pk", None),
            "crop_category": getattr(instance.crop_category, "crop_category", None),
            "crop_name": instance.crop_name,
            "crop_type": instance.crop_type,
            "status": instance.status,
        }


class LkpAreaUnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAreaUnits
        fields = "__all__"
    
    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "area_unit": instance.area_unit,
            "formula": instance.formula,
            "status": instance.status,
        }