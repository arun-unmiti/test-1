from django.db import models


class TblLabourCosts(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    num_workers_current = models.IntegerField(blank=True, null=True)
    num_workers_recommended = models.IntegerField(blank=True, null=True)
    monthly_wage_current = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    monthly_wage_recommended = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    num_managers_current = models.IntegerField(blank=True, null=True)
    num_managers_recommended = models.IntegerField(blank=True, null=True)
    manager_wage_current = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    manager_wage_recommended = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_labour_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, db_comment='Computed: (workers x wage + managers x mgmt_wage) x 12')
    total_labour_cost_rec = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_labour_costs'
        db_table_comment = 'Labour cost details: workers and managers, current vs recommended.'
