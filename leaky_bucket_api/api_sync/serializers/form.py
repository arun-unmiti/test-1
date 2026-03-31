from rest_framework import serializers
from api_form.models import TblFormType, TblForm, TblFormField, TblFormFieldOption


class SyncTblFormTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormType
        fields = "__all__"


class SyncTblFormSerializer(serializers.ModelSerializer):
    form_type_id = serializers.IntegerField(allow_null=True)
    crop_stage_id = serializers.IntegerField(allow_null=True)
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = TblForm
        exclude = ['form_type', 'crop_stage', 'created_by_user', 'updated_by_user', 'deleted_by_user']


class SyncTblFormFieldSerializer(serializers.ModelSerializer):
    form_id = serializers.IntegerField(allow_null=True)
    parent_id = serializers.IntegerField(allow_null=True)
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = TblFormField
        exclude = ['form', 'parent', 'created_by_user', 'updated_by_user', 'deleted_by_user']


class SyncTblFormFieldOptionSerializer(serializers.ModelSerializer):
    form_id = serializers.IntegerField(allow_null=True)
    field_id = serializers.IntegerField(allow_null=True)
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = TblFormFieldOption
        exclude = ['form', 'field', 'created_by_user', 'updated_by_user', 'deleted_by_user']
