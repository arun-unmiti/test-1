from rest_framework import serializers
from .models import (
    LkpAdm0, LkpAdm1, LkpAdm2, LkpAdm3,
    LkpAdm4, LkpAdmHierarchy
)


class LkpAdm0Serializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdm0
        fields = "__all__"
    
    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
            "currency": instance.currency,
            "iso_code": instance.iso_code,
            "dialing_code": instance.dialing_code,
            "timezone": instance.timezone,
        }



class LkpAdm1Serializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdm1
        fields = "__all__"
    
    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
        }



class LkpAdm2Serializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdm2
        fields = "__all__"
    
    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
        }


class LkpAdm3Serializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdm3
        fields = "__all__"
    
    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
        }


class LkpAdm4Serializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdm4
        fields = "__all__"
    
    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
        }


class LkpAdmHierarchySerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdmHierarchy
        fields = "__all__"
    
    def to_representation(self, instance):
         return {
            "level": instance.level,
            "level_name": instance.level_name,
            "attribute_key": f"adm{instance.level}_id",
        }

