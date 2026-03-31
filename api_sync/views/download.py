from ..utils.sql_structure import RawSQL

# Location serializers
from ..serializers.location import (
    SyncLkpAdm0Serializer, SyncLkpAdm1Serializer, SyncLkpAdm2Serializer,
    SyncLkpAdm3Serializer, SyncLkpAdm4Serializer, SyncLkpAdmHierarchySerializer,
)
# Form serializers
from ..serializers.form import (
    SyncTblFormTypeSerializer, SyncTblFormSerializer,
    SyncTblFormFieldSerializer, SyncTblFormFieldOptionSerializer,
)
# Core serializers
from ..serializers.core import (
    SyncLkpAnimalTypeSerializer, SyncLkpBreedMatrixSerializer,
    SyncLkpCalfFeedTypeSerializer, SyncLkpCostCategorySerializer,
    SyncLkpFeedTypeSerializer, SyncLkpForageCombinationSerializer,
    SyncLkpForageRatioSerializer, SyncLkpHealthEventTypeSerializer,
    SyncLkpMilkChannelSerializer, SyncLkpSaleTypeSerializer,
    SyncTblCoreCoopGroupSerializer, SyncTblCoreFarmSerializer,
    SyncTblCoreHerdSerializer, SyncTblCoreAnimalSerializer,
    SyncTblFarmVisitSerializer, SyncTblHerdStructureSerializer,
    SyncTblAnimalMeasurementSerializer, SyncTblMilkProductionSerializer,
    SyncTblFeedInputsSerializer, SyncTblForagePreferenceSerializer,
    SyncTblRevenueItemsSerializer, SyncTblMilkChannelPriceSerializer,
    SyncTblBreedingCostsSerializer, SyncTblReproductiveParamsSerializer,
    SyncTblHerdHealthCostsSerializer, SyncTblLabourCostsSerializer,
    SyncTblOperationalCostsSerializer, SyncTblCalfFeedingPlanSerializer,
    SyncTblCalfFeedingWeeklySerializer, SyncTblProfitabilitySnapshotSerializer,
    SyncTblProfitabilityLineItemsSerializer, SyncTblGapAnalysisSerializer,
    SyncTblRecommendationsSerializer, SyncTblSystemAssumptionsSerializer,
    SyncTblConcentrateGuideSerializer,
)

# Models
from api_location.models import LkpAdm0, LkpAdm1, LkpAdm2, LkpAdm3, LkpAdm4, LkpAdmHierarchy
from api_auth.models import TblUser
from api_form.models import TblFormType, TblForm, TblFormField, TblFormFieldOption
from api_core.models import (
    LkpAnimalType, LkpBreedMatrix, LkpCalfFeedType, LkpCostCategory,
    LkpFeedType, LkpForageCombination, LkpForageRatio, LkpHealthEventType,
    LkpMilkChannel, LkpSaleType,
    TblCoreCoopGroup, TblCoreFarm, TblCoreHerd, TblCoreAnimal,
    TblFarmVisit, TblHerdStructure, TblAnimalMeasurement, TblMilkProduction,
    TblFeedInputs, TblForagePreference, TblRevenueItems, TblMilkChannelPrice,
    TblBreedingCosts, TblReproductiveParams, TblHerdHealthCosts,
    TblLabourCosts, TblOperationalCosts,
    TblCalfFeedingPlan, TblCalfFeedingWeekly,
    TblProfitabilitySnapshot, TblProfitabilityLineItems,
    TblGapAnalysis, TblRecommendations,
    TblSystemAssumptions, TblConcentrateGuide,
)


class SyncDownload():
    def __init__(self):
        pass

    def get_structure(self, purpose=None):
        return RawSQL().get_table_defs(purpose=purpose)

    def get_records(self, purpose=None, **kwargs):
        logged_in_user_id = kwargs.get("created_by_user_id")

        if purpose == "lookups":
            return self._get_lookup_records(logged_in_user_id)
        elif purpose == "core":
            return self._get_core_records()
        elif purpose == "activity":
            return self._get_activity_records()
        else:
            return {
                **self._get_lookup_records(logged_in_user_id),
                **self._get_core_records(),
                **self._get_activity_records(),
            }

    def _get_lookup_records(self, logged_in_user_id):
        user = TblUser.objects.filter(pk=logged_in_user_id).values('adm0_id', 'adm1_id', 'adm2_id', 'adm3_id', 'adm4_id').first()
        user_adm0_id = user['adm0_id']
        user_adm1_id = user['adm1_id']
        user_adm2_id = user['adm2_id']
        user_adm3_id = user['adm3_id']
        user_adm4_id = user['adm4_id']
        return {
            # lkp_* tables
            "lkp_adm0": SyncLkpAdm0Serializer(LkpAdm0.objects.filter(id=user_adm0_id), many=True).data,
            "lkp_adm1": SyncLkpAdm1Serializer(LkpAdm1.objects.filter(id=user_adm1_id), many=True).data,
            "lkp_adm2": SyncLkpAdm2Serializer(LkpAdm2.objects.filter(id=user_adm2_id), many=True).data,
            "lkp_adm3": SyncLkpAdm3Serializer(LkpAdm3.objects.filter(id=user_adm3_id), many=True).data,
            "lkp_adm4": SyncLkpAdm4Serializer(LkpAdm4.objects.filter(id=user_adm4_id), many=True).data,
            "lkp_adm_hierarchy": SyncLkpAdmHierarchySerializer(LkpAdmHierarchy.objects.filter(adm0_id=user_adm0_id), many=True).data,
            "lkp_animal_type": SyncLkpAnimalTypeSerializer(LkpAnimalType.objects.all(), many=True).data,
            "lkp_breed_matrix": SyncLkpBreedMatrixSerializer(LkpBreedMatrix.objects.all(), many=True).data,
            "lkp_calf_feed_type": SyncLkpCalfFeedTypeSerializer(LkpCalfFeedType.objects.all(), many=True).data,
            "lkp_cost_category": SyncLkpCostCategorySerializer(LkpCostCategory.objects.all(), many=True).data,
            "lkp_feed_type": SyncLkpFeedTypeSerializer(LkpFeedType.objects.all(), many=True).data,
            "lkp_forage_combination": SyncLkpForageCombinationSerializer(LkpForageCombination.objects.all(), many=True).data,
            "lkp_forage_ratio": SyncLkpForageRatioSerializer(LkpForageRatio.objects.all(), many=True).data,
            "lkp_health_event_type": SyncLkpHealthEventTypeSerializer(LkpHealthEventType.objects.all(), many=True).data,
            "lkp_milk_channel": SyncLkpMilkChannelSerializer(LkpMilkChannel.objects.all(), many=True).data,
            "lkp_sale_type": SyncLkpSaleTypeSerializer(LkpSaleType.objects.all(), many=True).data,
            # tbl_form* tables
            "tbl_form": SyncTblFormSerializer(TblForm.objects.all(), many=True).data,
            "tbl_form_field": SyncTblFormFieldSerializer(TblFormField.objects.all(), many=True).data,
            "tbl_form_field_option": SyncTblFormFieldOptionSerializer(TblFormFieldOption.objects.all(), many=True).data,
            "tbl_form_type": SyncTblFormTypeSerializer(TblFormType.objects.all(), many=True).data,
        }

    def _get_core_records(self):
        return {
            "tbl_core_animal": SyncTblCoreAnimalSerializer(TblCoreAnimal.objects.all(), many=True).data,
            "tbl_core_coop_group": SyncTblCoreCoopGroupSerializer(TblCoreCoopGroup.objects.all(), many=True).data,
            "tbl_core_farm": SyncTblCoreFarmSerializer(TblCoreFarm.objects.all(), many=True).data,
            "tbl_core_herd": SyncTblCoreHerdSerializer(TblCoreHerd.objects.all(), many=True).data,
        }

    def _get_activity_records(self):
        return {
            "tbl_animal_measurement": SyncTblAnimalMeasurementSerializer(TblAnimalMeasurement.objects.all(), many=True).data,
            "tbl_breeding_costs": SyncTblBreedingCostsSerializer(TblBreedingCosts.objects.all(), many=True).data,
            "tbl_calf_feeding_plan": SyncTblCalfFeedingPlanSerializer(TblCalfFeedingPlan.objects.all(), many=True).data,
            "tbl_calf_feeding_weekly": SyncTblCalfFeedingWeeklySerializer(TblCalfFeedingWeekly.objects.all(), many=True).data,
            "tbl_concentrate_guide": SyncTblConcentrateGuideSerializer(TblConcentrateGuide.objects.all(), many=True).data,
            "tbl_farm_visit": SyncTblFarmVisitSerializer(TblFarmVisit.objects.all(), many=True).data,
            "tbl_feed_inputs": SyncTblFeedInputsSerializer(TblFeedInputs.objects.all(), many=True).data,
            "tbl_forage_preference": SyncTblForagePreferenceSerializer(TblForagePreference.objects.all(), many=True).data,
            "tbl_gap_analysis": SyncTblGapAnalysisSerializer(TblGapAnalysis.objects.all(), many=True).data,
            "tbl_herd_health_costs": SyncTblHerdHealthCostsSerializer(TblHerdHealthCosts.objects.all(), many=True).data,
            "tbl_herd_structure": SyncTblHerdStructureSerializer(TblHerdStructure.objects.all(), many=True).data,
            "tbl_labour_costs": SyncTblLabourCostsSerializer(TblLabourCosts.objects.all(), many=True).data,
            "tbl_milk_channel_price": SyncTblMilkChannelPriceSerializer(TblMilkChannelPrice.objects.all(), many=True).data,
            "tbl_milk_production": SyncTblMilkProductionSerializer(TblMilkProduction.objects.all(), many=True).data,
            "tbl_operational_costs": SyncTblOperationalCostsSerializer(TblOperationalCosts.objects.all(), many=True).data,
            "tbl_profitability_line_items": SyncTblProfitabilityLineItemsSerializer(TblProfitabilityLineItems.objects.all(), many=True).data,
            "tbl_profitability_snapshot": SyncTblProfitabilitySnapshotSerializer(TblProfitabilitySnapshot.objects.all(), many=True).data,
            "tbl_recommendations": SyncTblRecommendationsSerializer(TblRecommendations.objects.all(), many=True).data,
            "tbl_reproductive_params": SyncTblReproductiveParamsSerializer(TblReproductiveParams.objects.all(), many=True).data,
            "tbl_revenue_items": SyncTblRevenueItemsSerializer(TblRevenueItems.objects.all(), many=True).data,
            "tbl_system_assumptions": SyncTblSystemAssumptionsSerializer(TblSystemAssumptions.objects.all(), many=True).data,
        }
