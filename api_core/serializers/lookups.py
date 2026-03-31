from ..models import LkpAnimalType, LkpBreedMatrix
from rest_framework import serializers


class LkpAnimalTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpAnimalType
        fields = "__all__"
    

    def to_representation(self, instance):
        return {
            "id": instance.pk,
            "animal_type": instance.animal_type,
        }


class LkpBreedMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = LkpBreedMatrix
        fields = "__all__"
    

    def to_representation(self, instance):
        return {
            "species": instance.species,
            "cattlebreed_code": instance.cattlebreed_code,
            "cattlebreed_name": instance.cattlebreed_name,
            "KE": instance.ke,
            "TZ": instance.tz,
            "ET": instance.et,
            "ZB": instance.zb,
            "NG": instance.ng,
            "UG": instance.ug,
            "NP": instance.np,
        }