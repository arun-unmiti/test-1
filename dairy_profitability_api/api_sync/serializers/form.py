from rest_framework import serializers
from api_form.models import TblFormType, TblForm, TblFormField, TblFormFieldOption


class SyncTblFormTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormType
        fields = "__all__"


class SyncTblFormSerializer(serializers.ModelSerializer):
    form_type_id = serializers.IntegerField(read_only=True, allow_null=True)
    created_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)
    updated_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)
    deleted_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblForm
        fields = [
            'id', 'form_title', 'description', 'form_type_id',
            'pic_min', 'pic_max', 'data_table', 'order_by',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]


class SyncTblFormFieldSerializer(serializers.ModelSerializer):
    form_id = serializers.IntegerField(read_only=True, allow_null=True)
    parent_id = serializers.IntegerField(read_only=True, allow_null=True)
    created_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)
    updated_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)
    deleted_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblFormField
        fields = [
            'id', 'form_id', 'type', 'subtype', 'attribute_key',
            'multiselect', 'ref_table', 'ref_column', 'ref_display', 'label', 'required', 'description',
            'maxlength', 'min_val', 'max_val',
            'parent_id', 'parent_value', 'inline', 'order_by',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]


class SyncTblFormFieldOptionSerializer(serializers.ModelSerializer):
    form_id = serializers.IntegerField(read_only=True, allow_null=True)
    field_id = serializers.IntegerField(read_only=True, allow_null=True)
    created_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)
    updated_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)
    deleted_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblFormFieldOption
        fields = [
            'id', 'form_id', 'field_id', 'label', 'order_by',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]
