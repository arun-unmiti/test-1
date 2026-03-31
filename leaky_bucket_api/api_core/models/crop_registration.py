from django.db import models
from django.utils.timezone import now


class TblCoreCrop(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='crop_data_id')
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
    farmer = models.ForeignKey('api_core.TblCoreFarmer', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farmer.id')
    field_5024 = models.TextField(blank=True, null=True, db_comment='farmer_data_id (tbl_core_farmer)')
    field_5025 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
    field_5026 = models.ForeignKey('api_core.LkpCropCategory', models.DO_NOTHING, db_column='field_5026', blank=True, null=True, db_comment='crop_category')
    field_5027 = models.ForeignKey('api_core.LkpCrop', models.DO_NOTHING, db_column='field_5027', blank=True, null=True, db_comment='crop')
    field_5028 = models.TextField(blank=True, null=True, db_comment='crop_area')
    field_5029 = models.ForeignKey('api_core.LkpAreaUnits', models.DO_NOTHING, db_column='field_5029', blank=True, null=True, db_comment='area_unit')
    field_5030 = models.TextField(blank=True, null=True, db_comment='kml_file')
    field_5031 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5031', blank=True, null=True, db_comment='agronomic_arrangement')
    field_5032 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5032', related_name='tblcorecrop_field_5032_set', blank=True, null=True, db_comment='farming_method')
    field_5033 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5033', related_name='tblcorecrop_field_5033_set', blank=True, null=True, db_comment='cropping_purpose')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorecrop_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorecrop_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_core_crop'
