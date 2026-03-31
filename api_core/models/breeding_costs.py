from django.db import models


class TblBreedingCosts(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    ai_services_per_conception_c = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True, db_comment='Number of AI attempts per successful conception (current)')
    ai_services_per_conception_rec = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True, db_comment='Recommended: 1.5')
    cost_per_ai_service_current = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cost_per_ai_service_rec = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    num_cows_for_ai = models.IntegerField(blank=True, null=True)
    num_cows_for_pd = models.IntegerField(blank=True, null=True, db_comment='Cows diagnosed for pregnancy')
    cost_per_pd = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_comment='Cost of pregnancy diagnosis')
    total_ai_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    total_ai_cost_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    total_pd_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    total_pd_cost_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_breeding_costs'
        db_table_comment = 'AI and pregnancy diagnosis costs per visit.'


class TblReproductiveParams(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    days_open_current = models.SmallIntegerField(blank=True, null=True, db_comment='Days before cow is served after calving (current)')
    days_open_recommended = models.SmallIntegerField(blank=True, null=True, db_comment='Target: 120 days')
    calving_interval_current = models.SmallIntegerField(blank=True, null=True, db_comment='Days between calvings (current)')
    calving_interval_recommended = models.SmallIntegerField(blank=True, null=True, db_comment='Target: 390 days')
    calving_rate_current = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True, db_comment='Calvings per cow per year (current)')
    calving_rate_recommended = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    gestation_period_days = models.SmallIntegerField(blank=True, null=True, db_comment='Standard 270 days from assumptions')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_reproductive_params'
        db_table_comment = 'Reproductive performance parameters — directly affect profitability calculations.'
