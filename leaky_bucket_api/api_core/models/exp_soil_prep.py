from django.db import models
from django.utils.timezone import now


# Note: tbl_exp_soil_prep does not exist in the database yet.
# Model structure is based on the pattern of similar expense tables.
class TblExpSoilPrep(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='exp_soil_prep_data_id')
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
    crop = models.ForeignKey('api_core.TblCoreCrop', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_crop.id')
    field_5083 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
    field_5084 = models.TextField(blank=True, null=True, db_comment='crop_data_id (tbl_core_crop)')
    field_5085 = models.DateField(blank=True, null=True, db_comment='fertilization_date')
    field_5086 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5086', blank=True, null=True, db_comment='fertilization_expense_type')
    field_5087 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5087', related_name='tblexpsoilprep_field_5087_set', blank=True, null=True, db_comment='fertilization_category')
    field_5088 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5088', related_name='tblexpsoilprep_field_5088_set', blank=True, null=True, db_comment='is_organic')
    field_5089 = models.TextField(blank=True, null=True, db_comment='fertilizer_name')
    field_5090 = models.FloatField(blank=True, null=True, db_comment='fertilizer_quantity')
    field_5091 = models.FloatField(blank=True, null=True, db_comment='fertilizer_price')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexpsoilprep_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexpsoilprep_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_exp_soil_prep'
