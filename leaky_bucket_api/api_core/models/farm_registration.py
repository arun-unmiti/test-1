from django.db import models
from django.utils.timezone import now


class TblCoreFarm(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='farm_data_id')
    farmer = models.ForeignKey('api_core.TblCoreFarmer', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farmer.id')
    field_5014 = models.TextField(blank=True, null=True, db_comment='farmer_data_id (tbl_core_farmer)')
    field_5015 = models.TextField(blank=True, null=True, db_comment='farm_name')
    field_5016 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, db_column='field_5016', blank=True, null=True, db_comment='adm0_id')
    field_5017 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, db_column='field_5017', blank=True, null=True, db_comment='adm1_id')
    field_5018 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, db_column='field_5018', blank=True, null=True, db_comment='adm2_id')
    field_5019 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, db_column='field_5019', blank=True, null=True, db_comment='adm3_id')
    field_5020 = models.ForeignKey('api_location.LkpAdm4', models.DO_NOTHING, db_column='field_5020', blank=True, null=True, db_comment='adm4_id')
    field_5021 = models.TextField(blank=True, null=True, db_comment='land_size')
    field_5022 = models.ForeignKey('api_core.LkpAreaUnits', models.DO_NOTHING, db_column='field_5022', blank=True, null=True, db_comment='area_unit')
    field_5023 = models.JSONField(blank=True, null=True, db_comment='kml_coordinates_array')
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorefarm_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblcorefarm_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    class Meta:
            managed = False
            db_table = 'tbl_core_farm'
