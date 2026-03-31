from django.db import models
from django.utils.timezone import now


class LkpCropCategory(models.Model):
    crop_category = models.CharField(max_length=128)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_crop_category'


class LkpCropGroup(models.Model):
    crop_group = models.CharField(max_length=128)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_crop_group'


class LkpCropStage(models.Model):
    crop_stage = models.CharField(max_length=128)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_crop_stage'


class LkpCropCycle(models.Model):
    crop_stage = models.ForeignKey('api_core.LkpCropStage', models.DO_NOTHING, blank=True, null=True)
    activity = models.CharField(max_length=128)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_crop_cycle'


class LkpCrop(models.Model):
    crop_group = models.ForeignKey('api_core.LkpCropGroup', models.DO_NOTHING, blank=True, null=True)
    crop_category = models.ForeignKey('api_core.LkpCropCategory', models.DO_NOTHING, blank=True, null=True)
    crop_name = models.CharField(max_length=128)
    crop_type = models.CharField(max_length=128, blank=True, null=True, db_comment='Horticulture, Annual, Perennial')
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'lkp_crop'


class LkpAreaUnits(models.Model):
    area_unit = models.TextField(blank=True, null=True)
    formula = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField()
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'lkp_area_units'
