from ..utils.sql_structure import RawSQL, LOOKUP_TABLES, CORE_TABLES, FINANCIAL_TABLES
from api_auth.models import TblUser
from ..serializers.location import (
    SyncLkpAdm0Serializer, SyncLkpAdm1Serializer, SyncLkpAdm2Serializer,
    SyncLkpAdm3Serializer, SyncLkpAdm4Serializer, SyncLkpAdmHierarchySerializer,
)
from ..serializers.form import (
    SyncTblFormTypeSerializer, SyncTblFormSerializer,
    SyncTblFormFieldSerializer, SyncTblFormFieldOptionSerializer,
)
from ..serializers.core import (
    SyncTblCoreFarmerSerializer, SyncTblCoreFarmSerializer, SyncTblCoreCropSerializer,
    SyncTblCoreBuyerSerializer, SyncTblCoreSupplierSerializer,
    SyncTblIncomeSerializer,
    SyncTblExpConstructionSerializer, SyncTblExpCropMgmtSerializer,
    SyncTblExpDurationSerializer, SyncTblExpFieldClearingSerializer,
    SyncTblExpSoilPrepSerializer, SyncTblExpHarvestSerializer,
    SyncTblExpIrrigationSerializer, SyncTblExpPbsSerializer, SyncTblExpPdcSerializer,
    SyncTblExpPlantingSerializer, SyncTblExpProcessingSerializer,
    SyncTblExpSalesSerializer, SyncTblExpSeedsSerializer, SyncTblExpStorageSerializer,
    SyncTblExpTillageSerializer, SyncTblExpWeedMgmtSerializer,
    SyncLkpCropCategorySerializer, SyncLkpCropGroupSerializer, SyncLkpCropCycleSerializer,
    SyncLkpCropStageSerializer, SyncLkpCropSerializer, SyncLkpAreaUnitsSerializer
)
from api_location.models import (LkpAdm0, LkpAdm1, LkpAdm2, LkpAdm3, LkpAdm4, LkpAdmHierarchy,)
from api_form.models import (TblFormType, TblForm, TblFormField, TblFormFieldOption,)
from api_core.models import (
    LkpCropCategory, LkpCropGroup, LkpCropCycle, LkpCropStage, LkpCrop, LkpAreaUnits,
    TblCoreFarmer, TblCoreFarm, TblCoreCrop,
    TblCoreBuyer, TblCoreSupplier,
    TblIncome,
    TblExpConstruction, TblExpCropMgmt, TblExpDuration, TblExpFieldClearing,
    TblExpSoilPrep, TblExpHarvest, TblExpIrrigation, TblExpPbs, TblExpPdc,
    TblExpPlanting, TblExpProcessing, TblExpSales, TblExpSeeds, TblExpStorage,
    TblExpTillage, TblExpWeedMgmt,
)
from django.db.models import Q


class SyncDownload():
    def __init__(self):
        pass


    # ── LOOKUP ──────────────────────────────────────────────────────────────

    def get_lookup_structure(self):
        return RawSQL().get_table_defs(tables=LOOKUP_TABLES)

    def get_lookup_records(self, logged_in_user_id):
        logged_in_user = TblUser.objects.filter(pk=logged_in_user_id).first()

        if logged_in_user:
            adm0_id = logged_in_user.adm0_id
            adm1_id = logged_in_user.adm1_id
            adm2_id = logged_in_user.adm2_id
            adm3_id = logged_in_user.adm3_id
            adm4_id = logged_in_user.adm4_id
            qs_adm0 = (LkpAdm0.objects.filter(pk=adm0_id) if adm0_id else LkpAdm0.objects.all())
            qs_adm1 = (
                LkpAdm1.objects.filter(pk=adm1_id) if adm1_id 
                else LkpAdm1.objects.filter(adm0_id=adm0_id) if adm0_id 
                else LkpAdm1.objects.all()
            )
            qs_adm2 = (
                LkpAdm2.objects.filter(pk=adm2_id) if adm2_id 
                else LkpAdm2.objects.filter(adm1_id=adm1_id) if adm1_id 
                else LkpAdm2.objects.filter(adm0_id=adm0_id) if adm0_id 
                else LkpAdm2.objects.all()
            )
            qs_adm3 = (
                LkpAdm3.objects.filter(pk=adm3_id) if adm3_id 
                else LkpAdm3.objects.filter(adm2_id=adm2_id) if adm2_id 
                else LkpAdm3.objects.filter(adm1_id=adm1_id) if adm1_id 
                else LkpAdm3.objects.filter(adm0_id=adm0_id) if adm0_id 
                else LkpAdm3.objects.all()
            )
            qs_adm4 = (
                LkpAdm4.objects.filter(pk=adm4_id) if adm4_id 
                else LkpAdm4.objects.filter(adm3_id=adm3_id) if adm3_id 
                else LkpAdm4.objects.filter(adm2_id=adm2_id) if adm2_id 
                else LkpAdm4.objects.filter(adm1_id=adm1_id) if adm1_id 
                else LkpAdm4.objects.filter(adm0_id=adm0_id) if adm0_id 
                else LkpAdm4.objects.all()
            )
            qs_adm_hierarchy = LkpAdmHierarchy.objects.filter(adm0_id=adm0_id) if adm0_id else LkpAdmHierarchy.objects.all()
        else:
            qs_adm0 = LkpAdm0.objects.none()
            qs_adm1 = LkpAdm1.objects.none()
            qs_adm2 = LkpAdm2.objects.none()
            qs_adm3 = LkpAdm3.objects.none()
            qs_adm4 = LkpAdm4.objects.none()
            qs_adm_hierarchy = LkpAdmHierarchy.objects.none()

        return {
            "lkp_adm_hierarchy": SyncLkpAdmHierarchySerializer(qs_adm_hierarchy, many=True).data,
            "lkp_adm0": SyncLkpAdm0Serializer(qs_adm0, many=True).data,
            "lkp_adm1": SyncLkpAdm1Serializer(qs_adm1, many=True).data,
            "lkp_adm2": SyncLkpAdm2Serializer(qs_adm2, many=True).data,
            "lkp_adm3": SyncLkpAdm3Serializer(qs_adm3, many=True).data,
            "lkp_adm4": SyncLkpAdm4Serializer(qs_adm4, many=True).data,
            "lkp_crop_category": SyncLkpCropCategorySerializer(LkpCropCategory.objects.all(), many=True).data,
            "lkp_crop_group": SyncLkpCropGroupSerializer(LkpCropGroup.objects.all(), many=True).data,
            "lkp_crop_cycle": SyncLkpCropCycleSerializer(LkpCropCycle.objects.all(), many=True).data,
            "lkp_crop_stage": SyncLkpCropStageSerializer(LkpCropStage.objects.all(), many=True).data,
            "lkp_crop": SyncLkpCropSerializer(LkpCrop.objects.all(), many=True).data,
            "lkp_area_units": SyncLkpAreaUnitsSerializer(LkpAreaUnits.objects.all(), many=True).data,
            "tbl_form_type": SyncTblFormTypeSerializer(TblFormType.objects.all(), many=True).data,
            "tbl_form": SyncTblFormSerializer(TblForm.objects.all(), many=True).data,
            "tbl_form_field": SyncTblFormFieldSerializer(TblFormField.objects.all(), many=True).data,
            "tbl_form_field_option": SyncTblFormFieldOptionSerializer(TblFormFieldOption.objects.all(), many=True).data,
        }


    # ── CORE ─────────────────────────────────────────────────────────────────

    def get_core_structure(self):
        return RawSQL().get_table_defs(tables=CORE_TABLES)

    def get_core_records(self, logged_in_user_id):
        user_filter_criteria = Q(created_by_user_id=logged_in_user_id)

        buyer_loc_filter_criteria = Q()
        supplier_loc_filter_criteria = Q()
        logged_in_farmer = TblCoreFarmer.objects.filter(user_id=logged_in_user_id).first()

        if logged_in_farmer:
            if logged_in_farmer.field_5007:  # adm0
                buyer_loc_filter_criteria    &= Q(field_5043=logged_in_farmer.field_5007)
                supplier_loc_filter_criteria &= Q(field_5034=logged_in_farmer.field_5007)
            if logged_in_farmer.field_5008:  # adm1
                buyer_loc_filter_criteria    &= Q(field_5044=logged_in_farmer.field_5008)
                supplier_loc_filter_criteria &= Q(field_5035=logged_in_farmer.field_5008)
            if logged_in_farmer.field_5009:  # adm2
                buyer_loc_filter_criteria    &= Q(field_5045=logged_in_farmer.field_5009)
                supplier_loc_filter_criteria &= Q(field_5036=logged_in_farmer.field_5009)
            if logged_in_farmer.field_5010:  # adm3
                buyer_loc_filter_criteria    &= Q(field_5046=logged_in_farmer.field_5010)
                supplier_loc_filter_criteria &= Q(field_5037=logged_in_farmer.field_5010)
            # adm4 -- no need to filter village (buyers from other villages/neighbourhoods can be shown)
        farmer = TblCoreFarmer.objects.filter(user_id=logged_in_user_id).first()
        if farmer:
            profile_fields = [
                farmer.field_5002, farmer.field_5003, farmer.field_5004,
                farmer.field_5005_id, farmer.field_5006, farmer.field_5007_id,
                farmer.field_5008_id, farmer.field_5009_id, farmer.field_5010_id,
                farmer.field_5012_id, farmer.field_5013,
            ]
            is_profile_completed = all(f is not None for f in profile_fields)
        else:
            is_profile_completed = False
        farmer_level_criteria = Q(user_id=logged_in_user_id) 
        qs_tbl_core_farmer = (
            TblCoreFarmer.objects.filter(farmer_level_criteria)
            if is_profile_completed
            else TblCoreFarmer.objects.none()
        )
        return {
            "tbl_core_farmer": SyncTblCoreFarmerSerializer(qs_tbl_core_farmer, many=True).data, #farmer_filter_criteria
            "tbl_core_farm": SyncTblCoreFarmSerializer(TblCoreFarm.objects.filter(user_filter_criteria), many=True).data,
            "tbl_core_crop": SyncTblCoreCropSerializer(TblCoreCrop.objects.filter(user_filter_criteria), many=True).data,
            "tbl_core_buyer": SyncTblCoreBuyerSerializer(TblCoreBuyer.objects.filter(buyer_loc_filter_criteria), many=True).data,
            "tbl_core_supplier": SyncTblCoreSupplierSerializer(TblCoreSupplier.objects.filter(supplier_loc_filter_criteria), many=True).data,
        }


    # ── FINANCIAL ────────────────────────────────────────────────────────────

    def get_financial_structure(self):
        return RawSQL().get_table_defs(tables=FINANCIAL_TABLES)

    def get_financial_records(self, logged_in_user_id):
        user_filter_criteria = Q(created_by_user_id=logged_in_user_id)
        return {
            "tbl_income": SyncTblIncomeSerializer(TblIncome.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_construction": SyncTblExpConstructionSerializer(TblExpConstruction.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_crop_mgmt": SyncTblExpCropMgmtSerializer(TblExpCropMgmt.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_duration": SyncTblExpDurationSerializer(TblExpDuration.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_field_clearing": SyncTblExpFieldClearingSerializer(TblExpFieldClearing.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_soil_prep": SyncTblExpSoilPrepSerializer(TblExpSoilPrep.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_harvest": SyncTblExpHarvestSerializer(TblExpHarvest.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_irrigation": SyncTblExpIrrigationSerializer(TblExpIrrigation.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_pbs": SyncTblExpPbsSerializer(TblExpPbs.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_pdc": SyncTblExpPdcSerializer(TblExpPdc.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_planting": SyncTblExpPlantingSerializer(TblExpPlanting.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_processing": SyncTblExpProcessingSerializer(TblExpProcessing.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_sales": SyncTblExpSalesSerializer(TblExpSales.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_seeds": SyncTblExpSeedsSerializer(TblExpSeeds.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_storage": SyncTblExpStorageSerializer(TblExpStorage.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_tillage": SyncTblExpTillageSerializer(TblExpTillage.objects.filter(user_filter_criteria), many=True).data,
            "tbl_exp_weed_mgmt": SyncTblExpWeedMgmtSerializer(TblExpWeedMgmt.objects.filter(user_filter_criteria), many=True).data,
        }
