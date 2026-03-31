from api_core.models import TblIncome, TblCoreCrop, TblCoreFarm, TblCoreBuyer
from api_form.models import TblFormField
from rest_framework.response import Response
from ...utils import generate_data_id
from django.utils.timezone import now
from django.db.models import JSONField
import json
from api_sync.utils.utils_upload import resolve_core_ref, normalize_array

class WriteIncomeData:
    def __init__(self, **kwargs):
        self.row_data = kwargs.get("row_data")
        self.logged_in_user_id = kwargs.get("logged_in_user_id")
        self.model_fields = {f.name: f for f in TblIncome._meta.get_fields()}
        self.form_field_numbers = TblFormField.objects.filter(form_id=23).values_list("pk", flat=True)
        self.form_fields = [f"field_{x}" for x in TblFormField.objects.filter(form_id=23).values_list("pk", flat=True)]

    def insert(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for idx, row in enumerate(self.row_data or []):
            if "id" in row:
                row.pop("id")
            data_id = row.get("data_id")
            if not data_id or str(data_id).lower() == "null":
                data_id = generate_data_id(self.logged_in_user_id)

            new_data_row = {
                "data_id": data_id,
                "created_by_user_id": self.logged_in_user_id,
                "created_on": now(),
                "status": True,
            }

            farm_obj = resolve_core_ref(row, idx, "farm_id", "field_5151", TblCoreFarm, "farm")
            if isinstance(farm_obj, Response):
                return farm_obj
            new_data_row["farm_id"] = farm_obj.pk
            new_data_row["field_5151"] = farm_obj.data_id

            crop_obj = resolve_core_ref(row, idx, "crop_id", "field_5152", TblCoreCrop, "crop")
            if isinstance(crop_obj, Response):
                return crop_obj
            new_data_row["crop_id"] = crop_obj.pk
            new_data_row["field_5152"] = crop_obj.data_id

            buyer_obj = resolve_core_ref(row, idx, "buyer_id", "field_5155", TblCoreBuyer, "buyer")
            if isinstance(buyer_obj, Response):
                return buyer_obj
            new_data_row["buyer_id"] = buyer_obj.pk
            new_data_row["field_5155"] = buyer_obj.data_id

            for item, value in row.items():
                if item in ("id", "data_id"):
                    continue
                if item in self.model_fields:
                    field_obj = self.model_fields.get(item)
                    if isinstance(field_obj, JSONField):
                        value = normalize_array(value)
                    if field_obj and field_obj.is_relation and value is not None:
                        related_model = field_obj.related_model
                        try:
                            value = related_model.objects.get(pk=value)
                        except related_model.DoesNotExist:
                            return Response({"success": 0, "message": f"Invalid value provided for {item}"}, status=400)
                    new_data_row[item] = value
            TblIncome.objects.create(**new_data_row)
        return Response({"success": 1, "message": "Data has been entered successfully"}, status=200)

    def update(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for idx, row in enumerate(self.row_data or []):
            pk_ = row.get("id")
            data_id = row.get("data_id")
            if not pk_ and not data_id:
                return Response({"success": 0, "message": "Please include the row id or data_id for updating data"}, status=400)
            existing_row = (
                TblIncome.objects.filter(pk=pk_).first() if pk_
                else TblIncome.objects.filter(data_id=data_id).first() if data_id
                else None
            )
            if existing_row:
                edit_data_row = {
                    "updated_by_user_id": self.logged_in_user_id,
                    "updated_on": now(),
                }
                if "id" in row:
                    row.pop("id")
                if "data_id" in row:
                    row.pop("data_id")

                farm_obj = resolve_core_ref(row, idx, "farm_id", "field_5151", TblCoreFarm, "farm")
                if isinstance(farm_obj, Response):
                    return farm_obj
                edit_data_row["farm_id"] = farm_obj.pk
                edit_data_row["field_5151"] = farm_obj.data_id

                crop_obj = resolve_core_ref(row, idx, "crop_id", "field_5152", TblCoreCrop, "crop")
                if isinstance(crop_obj, Response):
                    return crop_obj
                edit_data_row["crop_id"] = crop_obj.pk
                edit_data_row["field_5152"] = crop_obj.data_id

                buyer_obj = resolve_core_ref(row, idx, "buyer_id", "field_5155", TblCoreBuyer, "buyer")
                if isinstance(buyer_obj, Response):
                    return buyer_obj
                edit_data_row["buyer_id"] = buyer_obj.pk
                edit_data_row["field_5155"] = buyer_obj.data_id

                for item, value in row.items():
                    if item in ("id", "data_id"):
                        continue
                    if item in self.model_fields:
                        field_obj = self.model_fields.get(item)
                        if isinstance(field_obj, JSONField):
                            value = normalize_array(value)
                        if field_obj and field_obj.is_relation and value is not None:
                            related_model = field_obj.related_model
                            try:
                                value = related_model.objects.get(pk=value)
                            except related_model.DoesNotExist:
                                return Response({"success": 0, "message": f"Invalid value provided for {item}"}, status=400)
                        edit_data_row[item] = value
                TblIncome.objects.filter(pk=existing_row.pk).update(**edit_data_row)
        return Response({"success": 1, "message": "Data has been updated successfully"}, status=200)
