from django.db import models


class TblProfitabilitySnapshot(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    scenario = models.CharField(max_length=9, db_comment='baseline = current; simulated = recommended')
    total_revenue = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    total_cost = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    annual_profit_loss = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    monthly_profit_loss = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    cost_per_litre_milk = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    milk_feed_ratio = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    milk_price_feed_cost_ratio = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    computed_on = models.DateTimeField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_profitability_snapshot'
        unique_together = (('visit', 'scenario'),)
        db_table_comment = 'Computed P&L summary per visit per scenario (baseline vs simulated).'


class TblProfitabilityLineItems(models.Model):
    snapshot = models.ForeignKey(TblProfitabilitySnapshot, models.DO_NOTHING)
    cost_category = models.ForeignKey('api_core.LkpCostCategory', models.DO_NOTHING, blank=True, null=True)
    line_item_name = models.CharField(max_length=128)
    item_type = models.CharField(max_length=7)
    amount = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    sort_order = models.SmallIntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_profitability_line_items'
        db_table_comment = 'Individual revenue and cost line items for the P&L report.'


class TblGapAnalysis(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    gap_days_open = models.SmallIntegerField(blank=True, null=True, db_comment='current - recommended')
    gap_calving_interval = models.SmallIntegerField(blank=True, null=True)
    gap_calving_rate = models.DecimalField(max_digits=6, decimal_places=4, blank=True, null=True)
    gap_lactation_length = models.SmallIntegerField(blank=True, null=True)
    gap_lactating_herd_size = models.IntegerField(blank=True, null=True, db_comment='How many more lactating cows needed')
    gap_dairy_meal_per_cow = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    gap_hay_bales_per_cow = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    gap_silage_kg_per_cow = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    silage_acres_needed = models.DecimalField(max_digits=8, decimal_places=4, blank=True, null=True, db_comment='Acres of crop needed to produce recommended silage')
    gap_annual_profit = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    gap_monthly_profit = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    gap_cost_per_litre = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    gap_milk_feed_ratio = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    computed_on = models.DateTimeField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_gap_analysis'
        db_table_comment = 'Computed gap between current and recommended values across all key metrics.'


class TblRecommendations(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    category = models.CharField(max_length=64, db_comment='milk_production | breeding | feeding | financial')
    recommendation_text = models.TextField(db_comment='Human-readable recommendation')
    target_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    current_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    unit = models.CharField(max_length=32, blank=True, null=True, db_comment='e.g. litres/cow/day, kg, months, KES')
    priority = models.CharField(max_length=6)
    is_actioned = models.IntegerField(db_comment='1 = farmer has implemented this recommendation')
    actioned_on = models.DateField(blank=True, null=True)
    sort_order = models.SmallIntegerField(blank=True, null=True)
    created_on = models.DateTimeField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_recommendations'
        db_table_comment = 'Actionable recommendations generated from gap analysis per visit.'
