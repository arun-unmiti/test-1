from django.db import models


class TblCoreCoopGroup(models.Model):
    data_id = models.CharField(max_length=64, blank=True, null=True)
    adm0_id = models.IntegerField(blank=True, null=True)
    adm1_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=256)
    type = models.CharField(max_length=64, blank=True, null=True, db_comment='cooperative | group')
    cooperative_group_type = models.JSONField(blank=True, null=True)
    cooperative_group_type_other = models.CharField(max_length=255, blank=True, null=True)
    cooperative_group_function = models.JSONField(blank=True, null=True, db_comment='Array of function codes')
    cooperative_group_function_other = models.CharField(max_length=255, blank=True, null=True)
    offers_livestock_marketing = models.IntegerField(blank=True, null=True)
    offers_livestock_products = models.IntegerField(blank=True, null=True)
    num_male_members = models.IntegerField(blank=True, null=True)
    num_female_members = models.IntegerField(blank=True, null=True)
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
        db_table = 'tbl_core_coop_group'
        db_table_comment = 'Cooperatives and farmer groups.'
