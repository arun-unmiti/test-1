from rest_framework import serializers
from .models import TblUserRole, TblUser
from django.utils.timezone import datetime
from dairy_profitability_api.settings import env, MEDIA_URL


class TblUserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUserRole
        fields = "__all__"

    def to_representation(self, instance):
        representation = dict()
        representation["id"] = instance.pk
        representation["role"] = instance.name
        return representation


class TblUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUser
        fields = ["id", "email", "full_name", "password", "phone"]
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


class TblUserMgmtSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUser
        fields = "__all__"
    
    def to_representation(self, instance):
        representation = dict()
        representation["user_id"] = instance.pk
        representation["name"] = instance.full_name
        representation["email"] = instance.email
        representation["phone"] = instance.phone
        representation["role_id"] = instance.role.pk if instance.role else None
        representation["role"] = instance.role.name if instance.role else None
        representation["profile_image"] = (
            f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/{instance.profile_image}"
            if instance.profile_image 
            else f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/default_user.png"
        )
        representation["country"] = instance.adm0.name if instance.adm0 else None
        representation["adm0_id"] = instance.adm0_id
        representation["adm1_name"] = instance.adm1.name if instance.adm1 else None
        representation["adm2_name"] = instance.adm2.name if instance.adm2 else None
        primary_loc = instance.location_assignments.filter(is_primary=True, status=True).first()
        representation["primary_location"] = {
            "location_id": primary_loc.location_id,
            "location_name": primary_loc.location.name,
            "location_level": primary_loc.location_level,
            "assignment_type": primary_loc.assignment_type,
        } if primary_loc else None
        representation["previous_login"] = datetime.strftime(instance.previous_login, "%Y-%m-%d %H:%M:%S") if instance.previous_login else None
        representation["last_login"] = datetime.strftime(instance.last_login, "%Y-%m-%d %H:%M:%S") if instance.last_login else None
        representation["registered_on"] = datetime.strftime(instance.created_on, "%Y-%m-%d %H:%M:%S") if instance.created_on else None
        representation["status"] = "Active" if instance.status else "Deleted"
        return representation


class SelfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblUser

    def to_representation(self, instance):
        representation = dict()
        representation["user_id"] = instance.pk
        representation["name"] = instance.full_name
        representation["email"] = instance.email
        representation["phone"] = instance.phone
        representation["role_id"] = instance.role.pk if instance.role else None
        representation["role"] = instance.role.name if instance.role else None
        representation["profile_image"] = (
            f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/{instance.profile_image}"
            if instance.profile_image 
            else f"{env.get('API_ROOT_URL')}{MEDIA_URL}profile_images/default_user.png"
        )
        representation["previous_login"] = datetime.strftime(instance.previous_login, "%b %d, %Y %I:%M %p") if instance.previous_login else None
        representation["last_login"] = datetime.strftime(instance.last_login, "%b %d, %Y %I:%M %p") if instance.last_login else None
        return representation