from rest_framework import serializers
from ..models import TblIncome
from django.utils.timezone import datetime


class TblIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblIncome
        fields = "__all__"

    def to_representation(self, instance):
        is_singular = not getattr(self.parent, "many", False)
        if is_singular:
            values = {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farm_id": getattr(instance.farm, "pk", None),
                "crop_id": getattr(instance.crop, "pk", None),
                "crop_lkp_id": getattr(getattr(instance.crop, "field_5027", None), "pk", None),
                "crop_name": getattr(getattr(instance.crop, "field_5027", None), "crop_name", None),
                "buyer_id": getattr(instance.buyer, "pk", None),
                "field_5151": instance.field_5151,
                "field_5152": instance.field_5152,
                "field_5153": instance.field_5153,
                "field_5154": getattr(instance.field_5154, "pk", None),
                "field_5155": instance.field_5155,
                "field_5156": instance.field_5156,
                "field_5157": instance.field_5157,
                "field_5158": instance.field_5158,
                "field_5060": getattr(instance.field_5060, "pk", None),
                "field_5159": instance.field_5159,
                "field_5160": getattr(instance.field_5160, "pk", None),
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5151": instance.field_5151,
                "field_5152": instance.field_5152,
                "field_5154": getattr(instance.field_5154, 'label', None),
                "field_5155": instance.field_5155,
                "field_5060": getattr(instance.field_5060, 'activity', None),
                "field_5160": getattr(instance.field_5160, "crop_stage", None),
            }
            return {
                "values": values,
                "labels": labels,
            }
        else:
            return {
                "id": instance.pk,
                "data_id": instance.data_id,
                "farm_id": getattr(instance.farm, "pk", None),
                "crop_id": getattr(instance.crop, "pk", None),
                "crop_lkp_id": getattr(getattr(instance.crop, "field_5027", None), "pk", None),
                "crop_name": getattr(getattr(instance.crop, "field_5027", None), "crop_name", None),
                "buyer_id": getattr(instance.buyer, "pk", None),
                "field_5151": instance.field_5151,
                "field_5152": instance.field_5152,
                "field_5153": instance.field_5153,
                "field_5154": getattr(instance.field_5154, 'label', None),
                "field_5155": instance.field_5155,
                "field_5156": instance.field_5156,
                "field_5157": instance.field_5157,
                "field_5158": instance.field_5158,
                "field_5060": getattr(instance.field_5060, 'activity', None),
                "field_5159": instance.field_5159,
                "field_5160": getattr(instance.field_5160, "crop_stage", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
