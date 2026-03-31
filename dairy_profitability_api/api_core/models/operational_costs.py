from django.db import models


class TblOperationalCosts(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    insured_animal_value = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    insurance_premium_rate = models.DecimalField(max_digits=6, decimal_places=4, blank=True, null=True, db_comment='e.g. 0.04 = 4%')
    insurance_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    insurance_cost_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    transport_cost_per_litre = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    transport_total_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    transport_total_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    depreciation_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    loan_principal = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    loan_interest_rate = models.DecimalField(max_digits=6, decimal_places=4, blank=True, null=True)
    loan_annual_cost = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    misc_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, db_comment='5% of total costs')
    misc_cost_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_operational_costs'
        db_table_comment = 'Insurance, transport, depreciation, loan, and miscellaneous costs per visit.'
