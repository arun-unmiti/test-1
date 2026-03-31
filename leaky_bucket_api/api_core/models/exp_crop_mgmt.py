from django.db import models
from django.utils.timezone import now


class TblExpCropMgmt(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='exp_crop_mgmt_data_id')
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
    crop = models.ForeignKey('api_core.TblCoreCrop', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_crop.id')
    field_5109 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
    field_5110 = models.TextField(blank=True, null=True, db_comment='crop_data_id (tbl_core_crop)')
    field_5111 = models.DateField(blank=True, null=True, db_comment='CM_fertilizer_date')
    field_5112 = models.TextField(blank=True, null=True, db_comment='CM_fertilizer_name')
    field_5113 = models.FloatField(blank=True, null=True, db_comment='CM_fertilizer_quantity')
    field_5114 = models.FloatField(blank=True, null=True, db_comment='CM_fertilizer_price')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexpcropmgmt_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblexpcropmgmt_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_exp_crop_mgmt'
