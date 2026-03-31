from django.db import models
from django.utils.timezone import now


class TblFormType(models.Model):
    form_type = models.CharField(max_length=128)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_form_type'



class TblForm(models.Model):
    form_title = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    form_type = models.ForeignKey('api_form.TblFormType', models.DO_NOTHING, blank=True, null=True)
    crop_stage = models.ForeignKey('api_core.LkpCropStage', models.DO_NOTHING, blank=True, null=True)
    pic_min = models.IntegerField(blank=True, null=True)
    pic_max = models.IntegerField(blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblform_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblform_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_form'


class TblFormField(models.Model):
    form = models.ForeignKey('api_form.TblForm', models.DO_NOTHING, blank=True, null=True)
    type = models.CharField(max_length=64, blank=True, null=True)
    subtype = models.CharField(max_length=128, blank=True, null=True)
    attribute_key = models.TextField(blank=True, null=True)
    multiselect = models.IntegerField(blank=True, null=True)
    ref_table = models.TextField(blank=True, null=True)
    ref_column = models.TextField(blank=True, null=True)
    ref_display = models.TextField(blank=True, null=True)
    label = models.TextField(blank=True, null=True)
    required = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    maxlength = models.IntegerField(blank=True, null=True)
    min_val = models.IntegerField(blank=True, null=True)
    max_val = models.IntegerField(blank=True, null=True)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    parent_value = models.TextField(blank=True, null=True)
    inline = models.TextField(blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblformfield_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblformfield_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_form_field'


class TblFormFieldOption(models.Model):
    # form_field_multiple
    form = models.ForeignKey('api_form.TblForm', models.DO_NOTHING, blank=True, null=True)
    field = models.ForeignKey('api_form.TblFormField', models.DO_NOTHING, blank=True, null=True)
    label = models.TextField(blank=True, null=True)
    order_by = models.IntegerField(blank=True, null=True)
    selected = models.BooleanField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblformfieldoption_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblformfieldoption_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_form_field_option'
