from django.db import models
from django.utils.timezone import now


class TblCoreFarmer(models.Model):
    user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING)
    data_id = models.TextField(blank=True, null=True, db_comment='auto_generate')
    field_5002 = models.TextField(blank=True, null=True, db_comment='farmer_name')
    field_5003 = models.TextField(blank=True, null=True, db_comment='email')
    field_5004 = models.TextField(blank=True, null=True, db_comment='phone')
    field_5005 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5005', blank=True, null=True, db_comment='gender')
    field_5006 = models.IntegerField(blank=True, null=True, db_comment='year_birth')
    field_5007 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, db_column='field_5007', blank=True, null=True, db_comment='adm0_id')
    field_5008 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, db_column='field_5008', blank=True, null=True, db_comment='adm1_id')
    field_5009 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, db_column='field_5009', blank=True, null=True, db_comment='adm2_id')
    field_5010 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, db_column='field_5010', blank=True, null=True, db_comment='adm3_id')
    field_5011 = models.ForeignKey('api_location.LkpAdm4', models.DO_NOTHING, db_column='field_5011', blank=True, null=True, db_comment='adm4_id')
    field_5012 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5012', related_name='tblcorefarmer_field_5012_set', blank=True, null=True, db_comment='farmer_type')
    field_5013 = models.JSONField(blank=True, null=True, db_comment='certification_programs_list')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorefarmer_created_by_user_set', blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorefarmer_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorefarmer_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_core_farmer'
