from django.db import models


class TblCalfFeedingPlan(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    num_calves = models.IntegerField(blank=True, null=True)
    total_milk_fed_current = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, db_comment='Total kg of milk fed over 14-week period (current)')
    total_milk_fed_rec = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, db_comment='Recommended total e.g. 413 kg')
    price_per_kg_milk = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_milk_replacer_fed = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    price_per_kg_milk_replacer = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_calf_pellet_fed = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    price_per_kg_calf_pellet = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_calf_feed_cost = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, db_comment='Computed total calf feeding cost')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_calf_feeding_plan'
        db_table_comment = 'Calf feeding plan header. Links to weekly detail rows.'


class TblCalfFeedingWeekly(models.Model):
    plan = models.ForeignKey(TblCalfFeedingPlan, models.DO_NOTHING)
    week_number = models.PositiveIntegerField(db_comment='1 to 14')
    calf_feed_type = models.ForeignKey('api_core.LkpCalfFeedType', models.DO_NOTHING)
    qty_kg_current = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='kg fed this week (current)')
    qty_kg_rec = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='kg fed this week (recommended)')
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_calf_feeding_weekly'
        unique_together = (('plan', 'week_number', 'calf_feed_type'),)
        db_table_comment = 'Week-by-week calf feeding schedule (weeks 1-14) per feed type.'
