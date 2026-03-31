from rest_framework import serializers
from api_auth.models import TblUserLocation


class SyncTblUserLocationSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    location_id = serializers.IntegerField(read_only=True)
    assigned_by_user_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = TblUserLocation
        fields = [
            'id', 'user_id', 'location_id', 'location_level',
            'assignment_type', 'is_primary',
            'effective_from', 'effective_to',
            'assigned_by_user_id', 'assignment_note',
            'created_on', 'created_by_user_id',
            'updated_on', 'updated_by_user_id',
            'deleted_on', 'deleted_by_user_id', 'status',
        ]
