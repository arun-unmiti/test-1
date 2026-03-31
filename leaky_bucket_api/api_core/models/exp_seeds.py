from django.db import models
from django.utils.timezone import now


class TblExpSeeds(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='exp_seeds_data_id')
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
    crop = models.ForeignKey('api_core.TblCoreCrop', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_crop.id')
    field_5067 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
    field_5068 = models.TextField(blank=True, null=True, db_comment='crop_data_id (tbl_core_crop)')
    field_5069 = models.DateField(blank=True, null=True, db_comment='seeds_date')
    field_5070 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5070', blank=True, null=True, db_comment='seeds_expense_type')
    field_5071 = models.FloatField(blank=True, null=True, db_comment='seeds_amount')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexpseeds_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexpseeds_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_exp_seeds'
