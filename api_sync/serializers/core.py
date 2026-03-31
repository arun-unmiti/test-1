from rest_framework import serializers
from api_core.models import (
    # Lookups
    LkpAnimalType, LkpBreedMatrix, LkpCalfFeedType, LkpCostCategory,
    LkpFeedType, LkpForageCombination, LkpForageRatio, LkpHealthEventType,
    LkpMilkChannel, LkpSaleType,
    # Registration
    TblCoreCoopGroup, TblCoreFarm, TblCoreHerd, TblCoreAnimal,
    # Visit
    TblFarmVisit,
    # Activity / Assessment
    TblHerdStructure, TblAnimalMeasurement, TblMilkProduction,
    TblFeedInputs, TblForagePreference,
    TblRevenueItems, TblMilkChannelPrice,
    TblBreedingCosts, TblReproductiveParams,
    TblHerdHealthCosts, TblLabourCosts, TblOperationalCosts,
    TblCalfFeedingPlan, TblCalfFeedingWeekly,
    # Profitability & Analysis
    TblProfitabilitySnapshot, TblProfitabilityLineItems,
    TblGapAnalysis, TblRecommendations,
    # Configuration
    TblSystemAssumptions, TblConcentrateGuide,
)


# ── Lookup serializers ──

class SyncLkpAnimalTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAnimalType
        fields = "__all__"


class SyncLkpBreedMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpBreedMatrix
        fields = "__all__"


class SyncLkpCalfFeedTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCalfFeedType
        fields = "__all__"


class SyncLkpCostCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCostCategory
        fields = "__all__"


class SyncLkpFeedTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpFeedType
        fields = "__all__"


class SyncLkpForageCombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpForageCombination
        fields = "__all__"


class SyncLkpForageRatioSerializer(serializers.ModelSerializer):
    forage_combination_id = serializers.IntegerField(read_only=True)
    feed_type_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = LkpForageRatio
        fields = ['id', 'forage_combination_id', 'feed_type_id', 'ratio', 'status']


class SyncLkpHealthEventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpHealthEventType
        fields = "__all__"


class SyncLkpMilkChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpMilkChannel
        fields = "__all__"


class SyncLkpSaleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpSaleType
        fields = "__all__"


# ── Table serializers ──

class SyncTblCoreCoopGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblCoreCoopGroup
        fields = "__all__"


class SyncTblCoreFarmSerializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField(read_only=True)
    coop_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblCoreFarm
        fields = [
            'id', 'data_id', 'adm0_id', 'adm1_id', 'adm2_id', 'adm3_id', 'adm4_id', 'coop_id',
            'farm_name', 'farmer_name', 'phone', 'email', 'gender_code',
            'age_group', 'farm_type', 'is_hh', 'is_coop_member', 'is_group_member',
            'cooperative_name', 'group_name',
            'reg_date', 'latitude', 'longitude', 'additional_attributes',
            'created_on', 'created_by_user_id', 'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]


class SyncTblCoreHerdSerializer(serializers.ModelSerializer):
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblCoreHerd
        fields = [
            'id', 'data_id', 'farm_id', 'herd_name', 'species_id',
            'created_on', 'created_by_user_id', 'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]


class SyncTblCoreAnimalSerializer(serializers.ModelSerializer):
    farm_id = serializers.IntegerField(read_only=True)
    herd_id = serializers.IntegerField(read_only=True)
    animal_type_id = serializers.IntegerField(read_only=True, allow_null=True)
    main_breed_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblCoreAnimal
        fields = [
            'id', 'data_id', 'farm_id', 'herd_id', 'animal_type_id',
            'tag_id', 'animal_name', 'sex', 'birthdate', 'main_breed_id',
            'breed_composition', 'entry_type', 'sire_id', 'dam_id',
            'created_on', 'created_by_user_id', 'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]


class SyncTblFarmVisitSerializer(serializers.ModelSerializer):
    farm_id = serializers.IntegerField(read_only=True)
    field_officer_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblFarmVisit
        fields = [
            'id', 'data_id', 'farm_id', 'field_officer_id',
            'visit_date', 'visit_type', 'visit_purpose', 'scenario_computed', 'notes',
            'created_on', 'created_by_user_id', 'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]


class SyncTblHerdStructureSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblHerdStructure
        fields = [
            'id', 'visit_id', 'farm_id',
            'num_lactating_cows', 'num_lactating_cows_rec', 'num_non_lactating_cows',
            'num_heifers', 'num_bulls', 'num_calves', 'herd_size_total',
            'pct_lactating_current', 'pct_lactating_recommended',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblAnimalMeasurementSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)
    animal_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblAnimalMeasurement
        fields = [
            'id', 'visit_id', 'farm_id', 'animal_id',
            'animal_type_id', 'animal_label', 'heart_girth_cm', 'weight_kg',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblMilkProductionSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblMilkProduction
        fields = [
            'id', 'visit_id', 'farm_id',
            'drying_period_days_current', 'drying_period_days_rec',
            'avg_yield_per_cow_current', 'avg_yield_per_cow_rec',
            'lactation_length_current', 'lactation_length_rec',
            'individual_cow_yields',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblFeedInputsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)
    feed_type_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblFeedInputs
        fields = [
            'id', 'visit_id', 'farm_id', 'feed_type_id',
            'sale_unit_size', 'sale_unit_label', 'price_per_unit', 'price_per_kg',
            'qty_per_cow_per_day_current', 'qty_per_cow_per_day_rec',
            'num_cows_fed', 'period_days',
            'total_cost_current', 'total_cost_recommended',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblForagePreferenceSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblForagePreference
        fields = [
            'id', 'visit_id', 'farm_id',
            'combination_id_current', 'combination_id_rec',
            'dry_matter_req_per_cow', 'created_on', 'status',
        ]


class SyncTblRevenueItemsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)
    sale_type_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblRevenueItems
        fields = [
            'id', 'visit_id', 'farm_id', 'sale_type_id',
            'qty_current', 'unit_price_current', 'num_animals_current',
            'period_days_current', 'amount_current',
            'qty_recommended', 'unit_price_recommended', 'num_animals_recommended',
            'period_days_recommended', 'amount_recommended',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblMilkChannelPriceSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)
    channel_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblMilkChannelPrice
        fields = [
            'id', 'visit_id', 'farm_id', 'channel_id',
            'price_per_litre', 'is_primary', 'created_on', 'status',
        ]


class SyncTblBreedingCostsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblBreedingCosts
        fields = [
            'id', 'visit_id', 'farm_id',
            'ai_services_per_conception_c', 'ai_services_per_conception_rec',
            'cost_per_ai_service_current', 'cost_per_ai_service_rec',
            'num_cows_for_ai', 'num_cows_for_pd', 'cost_per_pd',
            'total_ai_cost_current', 'total_ai_cost_recommended',
            'total_pd_cost_current', 'total_pd_cost_recommended',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblReproductiveParamsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblReproductiveParams
        fields = [
            'id', 'visit_id', 'farm_id',
            'days_open_current', 'days_open_recommended',
            'calving_interval_current', 'calving_interval_recommended',
            'calving_rate_current', 'calving_rate_recommended',
            'gestation_period_days',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblHerdHealthCostsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)
    health_event_type_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblHerdHealthCosts
        fields = [
            'id', 'visit_id', 'farm_id', 'health_event_type_id',
            'cost_per_animal', 'frequency_current', 'frequency_recommended',
            'num_animals_covered', 'period',
            'acaricide_sale_unit_ml', 'acaricide_price_per_bottle', 'acaricide_ml_per_spray',
            'total_cost_current', 'total_cost_recommended',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblLabourCostsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblLabourCosts
        fields = [
            'id', 'visit_id', 'farm_id',
            'num_workers_current', 'num_workers_recommended',
            'monthly_wage_current', 'monthly_wage_recommended',
            'num_managers_current', 'num_managers_recommended',
            'manager_wage_current', 'manager_wage_recommended',
            'total_labour_cost_current', 'total_labour_cost_rec',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblOperationalCostsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblOperationalCosts
        fields = [
            'id', 'visit_id', 'farm_id',
            'insured_animal_value', 'insurance_premium_rate',
            'insurance_cost_current', 'insurance_cost_recommended',
            'transport_cost_per_litre', 'transport_total_current', 'transport_total_recommended',
            'depreciation_amount', 'loan_principal', 'loan_interest_rate', 'loan_annual_cost',
            'misc_cost_current', 'misc_cost_recommended',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblCalfFeedingPlanSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblCalfFeedingPlan
        fields = [
            'id', 'visit_id', 'farm_id', 'num_calves',
            'total_milk_fed_current', 'total_milk_fed_rec', 'price_per_kg_milk',
            'total_milk_replacer_fed', 'price_per_kg_milk_replacer',
            'total_calf_pellet_fed', 'price_per_kg_calf_pellet',
            'total_calf_feed_cost',
            'created_on', 'created_by_user_id', 'updated_on', 'status',
        ]


class SyncTblCalfFeedingWeeklySerializer(serializers.ModelSerializer):
    plan_id = serializers.IntegerField(read_only=True)
    calf_feed_type_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblCalfFeedingWeekly
        fields = [
            'id', 'plan_id', 'week_number', 'calf_feed_type_id',
            'qty_kg_current', 'qty_kg_rec', 'status',
        ]


class SyncTblProfitabilitySnapshotSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblProfitabilitySnapshot
        fields = [
            'id', 'visit_id', 'farm_id', 'scenario',
            'total_revenue', 'total_cost',
            'annual_profit_loss', 'monthly_profit_loss',
            'cost_per_litre_milk', 'milk_feed_ratio', 'milk_price_feed_cost_ratio',
            'computed_on', 'status',
        ]


class SyncTblProfitabilityLineItemsSerializer(serializers.ModelSerializer):
    snapshot_id = serializers.IntegerField(read_only=True)
    cost_category_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblProfitabilityLineItems
        fields = [
            'id', 'snapshot_id', 'cost_category_id',
            'line_item_name', 'item_type', 'amount', 'sort_order', 'status',
        ]


class SyncTblGapAnalysisSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblGapAnalysis
        fields = [
            'id', 'visit_id', 'farm_id',
            'gap_days_open', 'gap_calving_interval', 'gap_calving_rate',
            'gap_lactation_length', 'gap_lactating_herd_size',
            'gap_dairy_meal_per_cow', 'gap_hay_bales_per_cow', 'gap_silage_kg_per_cow',
            'silage_acres_needed',
            'gap_annual_profit', 'gap_monthly_profit',
            'gap_cost_per_litre', 'gap_milk_feed_ratio',
            'computed_on', 'status',
        ]


class SyncTblRecommendationsSerializer(serializers.ModelSerializer):
    visit_id = serializers.IntegerField(read_only=True)
    farm_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = TblRecommendations
        fields = [
            'id', 'visit_id', 'farm_id',
            'category', 'recommendation_text', 'target_value', 'current_value',
            'unit', 'priority', 'is_actioned', 'actioned_on', 'sort_order',
            'created_on', 'status',
        ]


class SyncTblSystemAssumptionsSerializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblSystemAssumptions
        fields = [
            'id', 'assumption_key', 'assumption_value', 'data_type', 'adm0_id',
            'description', 'unit', 'is_editable_by_admin',
            'effective_from', 'effective_to',
            'created_on', 'created_by_user_id', 'updated_on', 'updated_by_user_id', 'status',
        ]


class SyncTblConcentrateGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblConcentrateGuide
        fields = "__all__"
