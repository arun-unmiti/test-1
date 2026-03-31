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
            f"{env.get('API_ROOT_URL')}{MEDIA_URL}/profile_images/{instance.profile_image}"
            if instance.profile_image 
            else f"{env.get('API_ROOT_URL')}{MEDIA_URL}/profile_images/default_user.png"
        )
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
            f"{env.get('API_ROOT_URL')}{MEDIA_URL}/profile_images/{instance.profile_image}"
            if instance.profile_image 
            else f"{env.get('API_ROOT_URL')}{MEDIA_URL}/profile_images/default_user.png"
        )
        representation["previous_login"] = datetime.strftime(instance.previous_login, "%b %d, %Y %I:%M %p") if instance.previous_login else None
        representation["last_login"] = datetime.strftime(instance.last_login, "%b %d, %Y %I:%M %p") if instance.last_login else None
        return representation