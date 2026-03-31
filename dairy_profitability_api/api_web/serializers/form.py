from rest_framework import serializers
from api_form.models import (
    TblFormType,
    TblForm,
    TblFormField,
    TblFormFieldOption
)


class SyncTblFormTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormType
        fields = '__all__'


class SyncTblFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblForm
        fields = '__all__'


class SyncTblFormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormField
        fields = '__all__'


class SyncTblFormFieldOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblFormFieldOption
        fields = '__all__'