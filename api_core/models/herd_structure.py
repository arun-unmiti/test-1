from django.db import models


class TblHerdStructure(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    num_lactating_cows = models.IntegerField(blank=True, null=True, db_comment='Current')
    num_lactating_cows_rec = models.IntegerField(blank=True, null=True, db_comment='Recommended')
    num_non_lactating_cows = models.IntegerField(blank=True, null=True)
    num_heifers = models.IntegerField(blank=True, null=True)
    num_bulls = models.IntegerField(blank=True, null=True)
    num_calves = models.IntegerField(blank=True, null=True)
    herd_size_total = models.IntegerField(blank=True, null=True, db_comment='Computed: sum of all categories')
    pct_lactating_current = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True, db_comment='Current % of herd that is lactating')
    pct_lactating_recommended = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True, db_comment='Target 0.66')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_herd_structure'
        db_table_comment = 'Per-visit snapshot of herd composition (counts per animal type).'
