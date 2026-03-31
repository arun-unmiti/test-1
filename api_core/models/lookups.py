from django.db import models


class LkpAnimalType(models.Model):
    name = models.CharField(max_length=64, db_comment='e.g. Lactating Cow, Non-lactating Cow, Heifer, Bull, Calf')
    code = models.CharField(unique=True, max_length=16, db_comment='Short code e.g. LAC, DRY, HEI, BUL, CAL')
    is_female = models.IntegerField(blank=True, null=True)
    min_age_months = models.SmallIntegerField(blank=True, null=True)
    max_age_months = models.SmallIntegerField(blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_animal_type'
        db_table_comment = 'Types of animals tracked in the herd.'


class LkpBreedMatrix(models.Model):
    breed_name = models.CharField(unique=True, max_length=128)
    breed_code = models.CharField(max_length=16, blank=True, null=True)
    breed_type = models.CharField(max_length=32, blank=True, null=True, db_comment='Exotic, Indigenous, Cross')
    avg_milk_yield = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='Average litres/cow/day for benchmarking')
    adm0_id = models.IntegerField(blank=True, null=True, db_comment='NULL = global breed; set to adm0_id for local breeds')
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_breed_matrix'
        db_table_comment = 'Breed reference with average production benchmarks.'


class LkpCalfFeedType(models.Model):
    name = models.CharField(max_length=64, db_comment='Milk, Milk Replacer, Calf Pellet')
    code = models.CharField(unique=True, max_length=32)
    unit = models.CharField(max_length=16, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_calf_feed_type'
        db_table_comment = 'Calf feeding options: Milk, Milk Replacer, Calf Pellet.'


class LkpCostCategory(models.Model):
    name = models.CharField(max_length=64, db_comment='Feed, Herd Health, Breeding, Labour, Others')
    code = models.CharField(unique=True, max_length=32)
    item_type = models.CharField(max_length=16, db_comment='revenue | cost')
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_cost_category'
        db_table_comment = 'P&L grouping categories for revenue and cost line items.'


class LkpFeedType(models.Model):
    name = models.CharField(max_length=128, db_comment='e.g. Dairy Meal, Hay, Silage, Mineral Lick')
    code = models.CharField(unique=True, max_length=32, db_comment='Short code e.g. DAIRY_MEAL, HAY, SILAGE')
    category = models.CharField(max_length=32, db_comment='concentrate | roughage | mineral | calf_feed')
    default_unit = models.CharField(max_length=16, blank=True, null=True, db_comment='Default measurement unit: kg, bale, litre')
    is_roughage = models.IntegerField()
    is_concentrate = models.IntegerField()
    is_mineral = models.IntegerField()
    is_calf_feed = models.IntegerField()
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_feed_type'
        db_table_comment = 'Master list of all feed inputs used in calculations.'


class LkpForageCombination(models.Model):
    name = models.CharField(max_length=128, db_comment='e.g. Hay + Silage, Hay + Nappier Grass')
    code = models.CharField(unique=True, max_length=32)
    description = models.CharField(max_length=256, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_forage_combination'
        db_table_comment = 'The 4 standard forage combinations from the Excel Assumptions sheet.'


class LkpForageRatio(models.Model):
    forage_combination = models.ForeignKey(LkpForageCombination, models.DO_NOTHING)
    feed_type = models.ForeignKey(LkpFeedType, models.DO_NOTHING)
    ratio = models.DecimalField(max_digits=5, decimal_places=4, db_comment='Proportion of this feed type in the combination. All ratios per combo must sum to 1.')
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_forage_ratio'
        unique_together = (('forage_combination', 'feed_type'),)
        db_table_comment = 'Recommended ratio of each feed type within a forage combination.'


class LkpHealthEventType(models.Model):
    name = models.CharField(max_length=128, db_comment='e.g. Deworming, Vaccination, Tick Control, Vet Visit, Clinical')
    code = models.CharField(unique=True, max_length=32)
    category = models.CharField(max_length=32, db_comment='preventive | routine | clinical')
    frequency_unit = models.CharField(max_length=16, blank=True, null=True, db_comment='year | week | month')
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_health_event_type'
        db_table_comment = 'Types of herd health events tracked in cost calculations.'


class LkpMilkChannel(models.Model):
    name = models.CharField(max_length=128, db_comment='e.g. Cooperative, Individual Buyers, Institutions')
    code = models.CharField(unique=True, max_length=32)
    description = models.CharField(max_length=256, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_milk_channel'
        db_table_comment = 'Milk buyer channels with typically different price points.'


class LkpSaleType(models.Model):
    name = models.CharField(max_length=128, db_comment='e.g. Milk, Manure, Bull Calf, Heifer, Cow, Bull')
    code = models.CharField(unique=True, max_length=32)
    category = models.CharField(max_length=32, db_comment='milk | livestock | byproduct')
    unit = models.CharField(max_length=32, blank=True, null=True, db_comment='e.g. litre, head, kg')
    sort_order = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_sale_type'
        db_table_comment = 'Revenue source types matching Excel output categories.'
