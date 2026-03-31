from rest_framework import serializers
from api_location.models import (
    LkpAdm0, LkpAdm1, LkpAdm2, LkpAdm3,
    LkpAdm4, LkpAdmHierarchy
)


class SyncLkpAdm0Serializer(serializers.ModelSerializer):
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpAdm0
        fields = [
            'id', 'name', 'iso_code', 'dialing_code', 'currency', 'timezone',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id',
            'status',
        ]


class SyncLkpAdm1Serializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField()
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpAdm1
        fields = [
            'id', 'name', 'adm0_id',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id',
            'status',
        ]


class SyncLkpAdm2Serializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField()
    adm1_id = serializers.IntegerField(allow_null=True)
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpAdm2
        fields = [
            'id', 'name', 'adm0_id', 'adm1_id',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id',
            'status',
        ]


class SyncLkpAdm3Serializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField(allow_null=True)
    adm1_id = serializers.IntegerField(allow_null=True)
    adm2_id = serializers.IntegerField(allow_null=True)
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpAdm3
        fields = [
            'id', 'name', 'adm0_id', 'adm1_id', 'adm2_id',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id',
            'status',
        ]


class SyncLkpAdm4Serializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField(allow_null=True)
    adm1_id = serializers.IntegerField(allow_null=True)
    adm2_id = serializers.IntegerField(allow_null=True)
    adm3_id = serializers.IntegerField(allow_null=True)
    created_by_user_id = serializers.IntegerField(allow_null=True)
    updated_by_user_id = serializers.IntegerField(allow_null=True)
    deleted_by_user_id = serializers.IntegerField(allow_null=True)

    class Meta:
        model = LkpAdm4
        fields = [
            'id', 'name', 'adm0_id', 'adm1_id', 'adm2_id', 'adm3_id',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id',
            'status',
        ]


class SyncLkpAdmHierarchySerializer(serializers.ModelSerializer):
    adm0_id = serializers.IntegerField()

    class Meta:
        model = LkpAdmHierarchy
        fields = ['id', 'adm0_id', 'level', 'level_name', 'level_plural', 'status']
