from rest_framework import serializers
from ..models import TblExpSales
from django.utils.timezone import datetime


class TblExpSalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblExpSales
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
                "supplier_id": getattr(instance.supplier, "pk", None),
                "field_5052": instance.field_5052,
                "field_5053": instance.field_5053,
                "field_5054": instance.field_5054,
                "field_5055": getattr(instance.field_5055, "pk", None),
                "field_5056": instance.field_5056,
                "field_5057": instance.field_5057,
                "field_5058": instance.field_5058,
                "field_5059": instance.field_5059,
                "field_5061": instance.field_5061,
                "created_by": getattr(instance.created_by_user, "name", None),
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
            labels = {
                "field_5052": instance.field_5052,
                "field_5053": instance.field_5053,
                "field_5055": getattr(instance.field_5055, 'label', None),
                "field_5056": instance.field_5056,
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
                "supplier_id": getattr(instance.supplier, "pk", None),
                "field_5052": instance.field_5052,
                "field_5053": instance.field_5053,
                "field_5054": instance.field_5054,
                "field_5055": getattr(instance.field_5055, 'label', None),
                "field_5056": instance.field_5056,
                "field_5057": instance.field_5057,
                "field_5058": instance.field_5058,
                "field_5059": instance.field_5059,
                "field_5061": instance.field_5061,
                "latitude": instance.latitude,
                "longitude": instance.longitude,
                "created_on": datetime.strftime(instance.created_on, "%b %d, %Y %H:%M") if instance.created_on else None,
                "status": instance.status,
            }
