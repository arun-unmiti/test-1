from django.db import models


class TblSystemAssumptions(models.Model):
    assumption_key = models.CharField(max_length=64, db_comment='e.g. recommended_pct_lactating, days_open, gestation_period')
    assumption_value = models.CharField(max_length=256, db_comment='Stored as string; app layer casts to correct type')
    data_type = models.CharField(max_length=16, db_comment='decimal | integer | string | boolean')
    adm0 = models.ForeignKey('api_location.LkpCountry', models.DO_NOTHING, blank=True, null=True, db_column='adm0_id', db_comment='NULL = global default; set for country-specific overrides')
    description = models.CharField(max_length=512, blank=True, null=True)
    unit = models.CharField(max_length=32, blank=True, null=True, db_comment='e.g. days, %, kg')
    is_editable_by_admin = models.IntegerField()
    effective_from = models.DateField(blank=True, null=True)
    effective_to = models.DateField(blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_system_assumptions'
        unique_together = (('assumption_key', 'adm0'),)
        db_table_comment = 'Global and country-specific configuration values from the Assumptions sheet.'


class TblConcentrateGuide(models.Model):
    milk_yield_min_litres = models.DecimalField(max_digits=6, decimal_places=2, db_comment='Lower bound of yield range (inclusive)')
    milk_yield_max_litres = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, db_comment='NULL = no upper bound (open-ended top tier)')
    recommended_concentrate_kg_day = models.DecimalField(max_digits=6, decimal_places=2, db_comment='Recommended kg of concentrate per cow per day')
    label = models.CharField(max_length=32, blank=True, null=True, db_comment='Display label e.g. <7 litres, 7-10 litres')
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_concentrate_guide'
        db_table_comment = 'Tiered concentrate feeding guide based on milk yield. From Assumptions sheet.'
