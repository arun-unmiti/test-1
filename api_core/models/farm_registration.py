from django.db import models


class TblCoreFarm(models.Model):
    data_id = models.CharField(max_length=64, blank=True, null=True)
    adm0 = models.ForeignKey('api_location.LkpCountry', models.DO_NOTHING, db_column='adm0_id', blank=True, null=True, db_comment='FK to lkp_location — deepest level selected')
    adm1_id = models.IntegerField(blank=True, null=True)
    adm2_id = models.IntegerField(blank=True, null=True)
    adm3_id = models.IntegerField(blank=True, null=True)
    adm4_id = models.IntegerField(blank=True, null=True)
    coop = models.ForeignKey('api_core.TblCoreCoopGroup', models.DO_NOTHING, blank=True, null=True)
    farm_name = models.CharField(max_length=256, blank=True, null=True)
    farmer_name = models.CharField(max_length=256)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=256, blank=True, null=True)
    gender_code = models.CharField(max_length=8, blank=True, null=True, db_comment='M | F | O')
    age_group = models.CharField(max_length=32, blank=True, null=True, db_comment='e.g. 18-25, 26-35, 36-50, 50+')
    farm_type = models.CharField(max_length=64, blank=True, null=True, db_comment='smallholder | commercial | semi-commercial')
    is_hh = models.IntegerField(blank=True, null=True, db_comment='Is head of household')
    is_coop_member = models.IntegerField(blank=True, null=True)
    is_group_member = models.IntegerField(blank=True, null=True)
    cooperative_name = models.CharField(max_length=255, blank=True, null=True)
    group_name = models.CharField(max_length=255, blank=True, null=True)
    reg_date = models.DateField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    additional_attributes = models.JSONField(blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_core_farm'
        db_table_comment = 'Core farmer and farm registration. One farmer = one farm record.'
