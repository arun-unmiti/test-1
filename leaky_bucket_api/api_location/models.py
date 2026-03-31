from django.db import models
from django.utils.timezone import now


class LkpAdm0(models.Model):
    name = models.CharField(unique=True, max_length=128)
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
    name = models.CharField(max_length=128)
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
    name = models.CharField(max_length=128)
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
    name = models.CharField(max_length=128)
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
    name = models.CharField(max_length=128)
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
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING)
    level = models.IntegerField()
    level_name = models.CharField(max_length=128, blank=True, null=True)
    level_plural = models.CharField(max_length=128, blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_adm_hierarchy'
