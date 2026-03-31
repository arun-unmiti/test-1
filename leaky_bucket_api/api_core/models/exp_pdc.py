from django.db import models
from django.utils.timezone import now


class TblExpPdc(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='exp_pdc_data_id')
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
    crop = models.ForeignKey('api_core.TblCoreCrop', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_crop.id')
    field_5115 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
    field_5116 = models.TextField(blank=True, null=True, db_comment='crop_data_id (tbl_core_crop)')
    field_5117 = models.DateField(blank=True, null=True, db_comment='PDC_date')
    field_5118 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5118', blank=True, null=True, db_comment='PDC_method')
    field_5119 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5119', related_name='tblexppdc_field_5119_set', blank=True, null=True, db_comment='PDC_expense_type')
    field_5120 = models.IntegerField(blank=True, null=True, db_comment='PDC_amount')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexppdc_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexppdc_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_exp_pdc'
