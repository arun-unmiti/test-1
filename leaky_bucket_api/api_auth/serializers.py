from rest_framework import serializers
from .models import TblUserRole, TblUser
from django.utils.timezone import datetime
from leaky_bucket_api.settings import env, MEDIA_URL
from api_core.models.farmer_registration import TblCoreFarmer

class TblUserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUserRole
        fields = "__all__"

    def to_representation(self, instance):
        representation = dict()
        representation["id"] = instance.pk
        representation["role"] = instance.role
        return representation



class TblUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUser
        fields = ["id",  "email", "password",]
        extra_kwargs = {"password": {"write_only": True}}
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=TblUser.objects.all(),
                fields=["email"],
                message="User with this email already registered"
            )
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance



class TblCoreFarmerSerializer(serializers.Serializer):
    name = serializers.SerializerMethodField()
    adm0 = serializers.SerializerMethodField()
    adm1 = serializers.SerializerMethodField()
    adm2 = serializers.SerializerMethodField()
    adm3 = serializers.SerializerMethodField()
    adm4 = serializers.SerializerMethodField()

    def get_name(self, instance):
        return instance.field_5002

    def _get_fk_name(self, obj, field):
        fk_obj = getattr(obj, field, None)
        return getattr(fk_obj, "name", None) if fk_obj else None

    def get_adm0(self, obj):
        return self._get_fk_name(obj, "field_5007")

    def get_adm1(self, obj):
        return self._get_fk_name(obj, "field_5008")

    def get_adm2(self, obj):
        return self._get_fk_name(obj, "field_5009")

    def get_adm3(self, obj):
        return self._get_fk_name(obj, "field_5010")

    def get_adm4(self, obj):
        return self._get_fk_name(obj, "field_5011")


class TblUserMgmtSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUser
        fields = "__all__"

    def to_representation(self, instance):
        
        representation = dict()
        representation["user_id"] = instance.pk
        representation["email"] = instance.email
        representation["phone"] = instance.phone
        representation["role_id"] = instance.role.pk
        representation["role"] = instance.role.role
        representation["adm0_id"] = instance.adm0_id
        representation["adm1_id"] = instance.adm1_id
        representation["adm2_id"] = instance.adm2_id
        representation["adm3_id"] = instance.adm3_id
        representation["adm4_id"] = instance.adm4_id
        representation["adm0"] = getattr(instance.adm0, "name", None)
        representation["adm1"] = getattr(instance.adm1, "name", None)
        representation["adm2"] = getattr(instance.adm2, "name", None)
        representation["adm3"] = getattr(instance.adm3, "name", None)
        representation["adm4"] = getattr(instance.adm4, "name", None)
        representation["profile_image"] = (
            f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/{instance.profile_image}"
            if instance.profile_image
            else f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/default_user.png"
        )
        representation["last_login"] = datetime.strftime(instance.last_login, "%Y-%m-%d %H:%M:%S") if instance.last_login else None
        representation["registered_on"] = datetime.strftime(instance.created_on, "%Y-%m-%d %H:%M:%S") if instance.created_on else None
        representation["status"] = "Active" if instance.status else "Deleted"
        farmer = TblCoreFarmer.objects.filter(user=instance).first()
        representation["is_farmer"] = farmer is not None
        representation["farmer"] = TblCoreFarmerSerializer(farmer).data if farmer else None
        
        return representation


class SelfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUser

    def to_representation(self, instance):
        representation = dict()
        representation["user_id"] = instance.pk
        representation["email"] = instance.email
        representation["phone"] = instance.phone
        representation["role_id"] = instance.role.pk
        representation["role"] = instance.role.role
        representation["adm0_id"] = instance.adm0_id
        representation["adm1_id"] = instance.adm1_id
        representation["adm2_id"] = instance.adm2_id
        representation["adm3_id"] = instance.adm3_id
        representation["adm4_id"] = instance.adm4_id
        representation["adm0"] = getattr(instance.adm0, "name", None)
        representation["adm1"] = getattr(instance.adm1, "name", None)
        representation["adm2"] = getattr(instance.adm2, "name", None)
        representation["adm3"] = getattr(instance.adm3, "name", None)
        representation["adm4"] = getattr(instance.adm4, "name", None)
        representation["profile_image"] = (
            f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/{instance.profile_image}"
            if instance.profile_image 
            else f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/default_user.png"
        )
        representation["previous_login"] = datetime.strftime(instance.previous_login, "%b %d, %Y %I:%M %p") if instance.previous_login else None
        representation["previous_login"] = datetime.strftime(instance.last_login, "%b %d, %Y %I:%M %p") if instance.last_login else None
        farmer = TblCoreFarmer.objects.filter(user=instance).first()
        representation["is_farmer"] = farmer is not None
        representation["farmer"] = TblCoreFarmerSerializer(farmer).data if farmer else None
        return representation
