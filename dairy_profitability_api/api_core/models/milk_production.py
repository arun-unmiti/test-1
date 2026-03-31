from django.db import models


class TblMilkProduction(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    drying_period_days_current = models.SmallIntegerField(blank=True, null=True, db_comment='Actual drying period in days')
    drying_period_days_rec = models.SmallIntegerField(blank=True, null=True, db_comment='Recommended: 60 days')
    avg_yield_per_cow_current = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='Litres/cow/day current')
    avg_yield_per_cow_rec = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='Litres/cow/day recommended/target')
    lactation_length_current = models.SmallIntegerField(blank=True, null=True, db_comment='Days')
    lactation_length_rec = models.SmallIntegerField(blank=True, null=True)
    individual_cow_yields = models.JSONField(blank=True, null=True, db_comment='Array of {cow_label, yield_current, yield_rec}')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_milk_production'
        db_table_comment = 'Milk yield parameters per visit, current vs recommended.'
