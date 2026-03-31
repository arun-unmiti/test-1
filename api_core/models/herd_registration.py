from django.db import models


class TblCoreHerd(models.Model):
    data_id = models.CharField(max_length=64, blank=True, null=True)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    herd_name = models.CharField(max_length=128, blank=True, null=True)
    species_id = models.IntegerField(blank=True, null=True, db_comment='FK to lkp_animal_type (species level)')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_core_herd'
        db_table_comment = 'Herd associated with a farm.'
