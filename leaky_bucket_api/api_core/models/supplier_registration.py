from django.db import models
from django.utils.timezone import now


class TblCoreSupplier(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='supplier_data_id')
    field_5034 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, db_column='field_5034', blank=True, null=True, db_comment='adm0_id')
    field_5035 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, db_column='field_5035', blank=True, null=True, db_comment='adm1_id')
    field_5036 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, db_column='field_5036', blank=True, null=True, db_comment='adm2_id')
    field_5037 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, db_column='field_5037', blank=True, null=True, db_comment='adm3_id')
    field_5038 = models.ForeignKey('api_location.LkpAdm4', models.DO_NOTHING, db_column='field_5038', blank=True, null=True, db_comment='adm4_id')
    field_5039 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5039', blank=True, null=True, db_comment='supplier_type')
    field_5040 = models.TextField(blank=True, null=True, db_comment='supplier_name')
    field_5041 = models.TextField(blank=True, null=True, db_comment='supplier_phone')
    field_5042 = models.TextField(blank=True, null=True, db_comment='supply_material')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcoresupplier_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcoresupplier_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_core_supplier'
