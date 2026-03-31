# api_web/serializers/user.py
from rest_framework import serializers
from api_auth.models import TblUser, TblUserLocation
from datetime import datetime   # Fixed correct import


class UserLocationSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    location_level = serializers.IntegerField(source='location.level', read_only=True)

    class Meta:
        model = TblUserLocation
        fields = ['id', 'location_id', 'location_name', 'location_level', 'assignment_type', 'is_primary', 'effective_from', 'effective_to']


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for the user management list view."""

    class Meta:
        model = TblUser
        fields = '__all__'

    def to_representation(self, instance):
        r = {}
        r['user_id'] = instance.pk
        r['full_name'] = instance.full_name
        r['email'] = instance.email
        r['phone'] = instance.phone
        # username removed (does not exist in new tbl_user)
        r['role_id'] = instance.role_id
        r['role_name'] = instance.role.name if instance.role else None
        r['role_code'] = instance.role.code if instance.role else None
        r['adm0_id'] = instance.adm0_id
        r['country_name'] = instance.adm0.name if instance.adm0 else None
        # Primary location assignment
        primary_loc = instance.location_assignments.filter(is_primary=True, status=True).select_related('location').first()
        if primary_loc:
            r['primary_location'] = {
                'location_id': primary_loc.location_id,
                'location_name': primary_loc.location.name,
                'location_level': primary_loc.location_level,
                'assignment_type': primary_loc.assignment_type,
            }
        else:
            r['primary_location'] = None
        r['profile_image'] = instance.profile_image
        r['previous_login'] = datetime.strftime(instance.previous_login, "%Y-%m-%d %H:%M:%S") if instance.previous_login else None
        r['last_login'] = datetime.strftime(instance.last_login, "%Y-%m-%d %H:%M:%S") if instance.last_login else None
        r['created_on'] = datetime.strftime(instance.created_on, "%Y-%m-%d %H:%M:%S") if instance.created_on else None
        # is_active removed (does not exist in new tbl_user)
        r['status'] = 'Active' if instance.status else 'Inactive'
        return r


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer for a single user — includes all location assignments."""

    class Meta:
        model = TblUser
        fields = '__all__'

    def to_representation(self, instance):
        r = {}
        r['user_id'] = instance.pk
        r['full_name'] = instance.full_name
        r['email'] = instance.email
        r['phone'] = instance.phone
        # username removed (does not exist in new tbl_user)
        r['role_id'] = instance.role_id
        r['role_name'] = instance.role.name if instance.role else None
        r['role_code'] = instance.role.code if instance.role else None
        r['adm0_id'] = instance.adm0_id
        r['country_name'] = instance.adm0.name if instance.adm0 else None
        locations = instance.location_assignments.filter(status=True).select_related('location')
        r['locations'] = UserLocationSerializer(locations, many=True).data
        r['profile_image'] = instance.profile_image
        r['previous_login'] = datetime.strftime(instance.previous_login, "%Y-%m-%d %H:%M:%S") if instance.previous_login else None
        r['last_login'] = datetime.strftime(instance.last_login, "%Y-%m-%d %H:%M:%S") if instance.last_login else None
        r['created_on'] = datetime.strftime(instance.created_on, "%Y-%m-%d %H:%M:%S") if instance.created_on else None
        # is_active removed (does not exist in new tbl_user)
        r['status'] = 'Active' if instance.status else 'Inactive'
        return r