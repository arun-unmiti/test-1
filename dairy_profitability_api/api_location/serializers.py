from rest_framework import serializers
from .models import LkpCountry, LkpLocation, LkpAdmHierarchy


class LkpCountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpCountry
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
            "iso_code_2": instance.iso_code_2,
            "iso_code_3": instance.iso_code_3,
            "dialing_code": instance.dialing_code,
            "currency_code": instance.currency_code,
            "currency_name": instance.currency_name,
            "currency_symbol": instance.currency_symbol,
            "timezone": instance.timezone,
        }


class LkpLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpLocation
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "name": instance.name,
            "level": instance.level,
            "parent_id": instance.parent_id,
            "adm0_id": instance.adm0_id,
            "code": instance.code,
        }


class LkpAdmHierarchySerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAdmHierarchy
        fields = "__all__"

    def to_representation(self, instance):
        return {
            "adm0_id": instance.adm0_id,
            "level": instance.level,
            "level_name": instance.level_name,
            "level_plural": instance.level_plural,
        }