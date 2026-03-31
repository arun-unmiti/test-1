from django.db import models
from django.utils.timezone import now


# ── New schema models (lkp_country + lkp_location replace lkp_adm0-4) ────────

class LkpCountry(models.Model):
    """Master country list — replaces lkp_adm0."""
    name = models.CharField(max_length=128)
    iso_code_2 = models.CharField(max_length=2, blank=True, null=True)
    iso_code_3 = models.CharField(max_length=3, blank=True, null=True)
    dialing_code = models.SmallIntegerField(blank=True, null=True)
    currency_code = models.CharField(max_length=3, blank=True, null=True)
    currency_name = models.CharField(max_length=64, blank=True, null=True)
    currency_symbol = models.CharField(max_length=8, blank=True, null=True)
    decimal_separator = models.CharField(max_length=3, default=".")
    thousands_separator = models.CharField(max_length=3, default=",")
    timezone = models.CharField(max_length=64, blank=True, null=True)
    language_code = models.CharField(max_length=8, blank=True, null=True)
    flag_emoji = models.CharField(max_length=8, blank=True, null=True)
    date_format = models.CharField(max_length=32, blank=True, null=True)
    max_adm_levels = models.PositiveSmallIntegerField(default=4)
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(default=now)
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_country'


class LkpLocation(models.Model):
    """Self-referential admin units — replaces lkp_adm1 through lkp_adm4."""
    name = models.CharField(max_length=128)
    adm0 = models.ForeignKey('api_location.LkpCountry', models.DO_NOTHING, db_column='adm0_id')
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    level = models.PositiveSmallIntegerField(db_comment='1=top (Region/County), 4=bottom (Village)')
    code = models.CharField(max_length=32, blank=True, null=True)
    local_name = models.CharField(max_length=128, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    path = models.CharField(max_length=1024, blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_location'


# ── Legacy models (lkp_adm0-4) kept for backward compatibility ───────────────

class LkpAdm0(models.Model):
    name = models.CharField(unique=True, max_length=128, db_comment='Country name')
    iso_code = models.CharField(max_length=2, blank=True, null=True)
    dialing_code = models.IntegerField(blank=True, null=True)
    currency = models.CharField(max_length=12, blank=True, null=True)
    timezone = models.CharField(max_length=32, blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm0_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm0_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm0'


class LkpAdm1(models.Model):
    name = models.CharField(max_length=128, db_comment='State/Province/County name')
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm1_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm1_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm1'


class LkpAdm2(models.Model):
    name = models.CharField(max_length=128, db_comment='District/Sub-county name')
    adm1 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, blank=True, null=True)
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm2_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm2_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm2'


class LkpAdm3(models.Model):
    name = models.CharField(max_length=128, db_comment='Sub-district/sub-county name')
    adm2 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, blank=True, null=True)
    adm1 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, blank=True, null=True)
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm3_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm3_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm3'



class LkpAdm4(models.Model):
    name = models.CharField(max_length=128, db_comment='Village / Ward name')
    adm3 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, blank=True, null=True)
    adm2 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, blank=True, null=True)
    adm1 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, blank=True, null=True)
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm4_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='lkpadm4_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm4'


class LkpAdmHierarchy(models.Model):
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, db_column='adm0_id')
    level = models.IntegerField()
    level_name = models.CharField(max_length=128, blank=True, null=True)
    level_plural = models.CharField(max_length=128, blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm_hierarchy'
