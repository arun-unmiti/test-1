from rest_framework import serializers
from api_core.models import (
    TblCoreFarmer, TblCoreFarm, TblCoreCrop,
    TblCoreBuyer, TblCoreSupplier,
    TblIncome,
    TblExpConstruction, TblExpCropMgmt, TblExpDuration, TblExpFieldClearing,
    TblExpSoilPrep, TblExpHarvest, TblExpIrrigation, TblExpPbs, TblExpPdc,
    TblExpPlanting, TblExpProcessing, TblExpSales, TblExpSeeds, TblExpStorage,
    TblExpTillage, TblExpWeedMgmt,
    LkpCropCategory, LkpCropGroup, LkpCropStage, LkpCropCycle, LkpCrop, LkpAreaUnits
)

_AUDIT_EXCLUDE = ['created_by_user', 'updated_by_user', 'deleted_by_user']


class _AuditMixin(serializers.ModelSerializer):
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)


class SyncTblCoreFarmerSerializer(_AuditMixin):
    user_id = serializers.IntegerField()

    class Meta:
        model = TblCoreFarmer
        exclude = ['user'] + _AUDIT_EXCLUDE 


class SyncTblCoreFarmSerializer(_AuditMixin):
    class Meta:
        model = TblCoreFarm
        exclude = _AUDIT_EXCLUDE + ['farmer']


class SyncTblCoreCropSerializer(_AuditMixin):
    class Meta:
        model = TblCoreCrop
        exclude = _AUDIT_EXCLUDE + ['farmer', 'farm']


class SyncTblCoreBuyerSerializer(_AuditMixin):
    class Meta:
        model = TblCoreBuyer
        exclude = _AUDIT_EXCLUDE


class SyncTblCoreSupplierSerializer(_AuditMixin):
    class Meta:
        model = TblCoreSupplier
        exclude = _AUDIT_EXCLUDE


class SyncTblIncomeSerializer(_AuditMixin):
    class Meta:
        model = TblIncome
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop', 'buyer']


class SyncTblExpConstructionSerializer(_AuditMixin):
    class Meta:
        model = TblExpConstruction
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpCropMgmtSerializer(_AuditMixin):
    class Meta:
        model = TblExpCropMgmt
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpDurationSerializer(_AuditMixin):
    class Meta:
        model = TblExpDuration
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpFieldClearingSerializer(_AuditMixin):
    class Meta:
        model = TblExpFieldClearing
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpSoilPrepSerializer(_AuditMixin):
    class Meta:
        model = TblExpSoilPrep
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpHarvestSerializer(_AuditMixin):
    class Meta:
        model = TblExpHarvest
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpIrrigationSerializer(_AuditMixin):
    class Meta:
        model = TblExpIrrigation
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpPbsSerializer(_AuditMixin):
    class Meta:
        model = TblExpPbs
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpPdcSerializer(_AuditMixin):
    class Meta:
        model = TblExpPdc
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpPlantingSerializer(_AuditMixin):
    class Meta:
        model = TblExpPlanting
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpProcessingSerializer(_AuditMixin):
    class Meta:
        model = TblExpProcessing
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpSalesSerializer(_AuditMixin):
    class Meta:
        model = TblExpSales
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop', 'supplier']


class SyncTblExpSeedsSerializer(_AuditMixin):
    class Meta:
        model = TblExpSeeds
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpStorageSerializer(_AuditMixin):
    class Meta:
        model = TblExpStorage
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpTillageSerializer(_AuditMixin):
    class Meta:
        model = TblExpTillage
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncTblExpWeedMgmtSerializer(_AuditMixin):
    class Meta:
        model = TblExpWeedMgmt
        exclude = _AUDIT_EXCLUDE + ['farm', 'crop']


class SyncLkpCropCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropCategory
        fields = "__all__"


class SyncLkpCropGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropGroup
        fields = "__all__"


class SyncLkpCropStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCropStage
        fields = "__all__"


class SyncLkpCropCycleSerializer(serializers.ModelSerializer):
    crop_stage_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpCropCycle
        exclude = ['crop_stage']


class SyncLkpCropSerializer(serializers.ModelSerializer):
    crop_group_id = serializers.IntegerField(allow_null=True)
    crop_category_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpCrop
        exclude = ['crop_group', 'crop_category']


class SyncLkpAreaUnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAreaUnits
        fields = "__all__"
