from django.db import models
from django.utils.timezone import now


class TblCoreBuyer(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='buyer_data_id')
    field_5043 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, db_column='field_5043', blank=True, null=True, db_comment='adm0_id')
    field_5044 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, db_column='field_5044', blank=True, null=True, db_comment='adm1_id')
    field_5045 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, db_column='field_5045', blank=True, null=True, db_comment='adm2_id')
    field_5046 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, db_column='field_5046', blank=True, null=True, db_comment='adm3_id')
    field_5047 = models.ForeignKey('api_location.LkpAdm4', models.DO_NOTHING, db_column='field_5047', blank=True, null=True, db_comment='adm4_id')
    field_5048 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5048', blank=True, null=True, db_comment='buyer_type')
    field_5049 = models.TextField(blank=True, null=True, db_comment='buyer_name')
    field_5050 = models.TextField(blank=True, null=True, db_comment='buyer_phone')
    field_5051 = models.TextField(blank=True, null=True, db_comment='byuer_material')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorebuyer_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorebuyer_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_core_buyer'
