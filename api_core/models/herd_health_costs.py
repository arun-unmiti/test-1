from django.db import models


class TblHerdHealthCosts(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    health_event_type = models.ForeignKey('api_core.LkpHealthEventType', models.DO_NOTHING)
    cost_per_animal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    frequency_current = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='Events per frequency_unit (current)')
    frequency_recommended = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    num_animals_covered = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    period = models.SmallIntegerField(blank=True, null=True, db_comment='Applicable period (weeks, months, year)')
    acaricide_sale_unit_ml = models.SmallIntegerField(blank=True, null=True, db_comment='For tick control only: ml per bottle e.g. 250')
    acaricide_price_per_bottle = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acaricide_ml_per_spray = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='ml per animal per spraying event')
    total_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    total_cost_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_herd_health_costs'
        unique_together = (('visit', 'health_event_type'),)
        db_table_comment = 'Herd health cost breakdown per event type per visit.'
