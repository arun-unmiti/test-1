from api_auth.models import TblUser
from api_core.models import TblCoreFarmer, TblCoreFarm, TblCoreCrop, TblCoreBuyer, TblCoreSupplier
from api_form.models import TblFormField
from rest_framework.response import Response
from ...utils import generate_data_id
from django.utils.timezone import now
import json
from api_sync.utils.utils_upload import resolve_core_ref, normalize_array
from django.db.models import JSONField
from pprint import pprint

class WriteFarmerData:
    def __init__(self, **kwargs):
        self.row_data = kwargs.get("row_data")
        self.logged_in_user_id = kwargs.get("logged_in_user_id")
        self.model_fields = {f.name: f for f in TblCoreFarmer._meta.get_fields()}
        self.form_field_numbers = TblFormField.objects.filter(form_id=1).values_list("pk", flat=True)
        self.form_fields = [f"field_{x}" for x in TblFormField.objects.filter(form_id=1).values_list("pk", flat=True)]

    def insert(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for idx, row in enumerate(self.row_data or []):
            if "id" in row:
                row.pop("id")
            data_id = row.get("data_id")

            already_exists = TblCoreFarmer.objects.filter(user_id=self.logged_in_user_id)
            if already_exists:
                return Response({"success": 0, "message": "Already registered as a farmer, for updating existing details use action: update"}, status=409)
            
            if not data_id or str(data_id).lower() == "null":
                data_id = generate_data_id(self.logged_in_user_id)

            new_data_row = {
                "data_id": data_id,
                "created_by_user_id": self.logged_in_user_id,
                "created_on": now(),
                "status": True,
            }
            user_obj = resolve_core_ref(row, idx, "user_id", None, TblUser, "user")
            if isinstance(user_obj, Response):
                return user_obj
            new_data_row["user_id"] = user_obj.pk

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
            TblCoreFarmer.objects.create(**new_data_row)
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
                TblCoreFarmer.objects.filter(pk=pk_).first() if pk_
                else TblCoreFarmer.objects.filter(data_id=data_id).first() if data_id
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
                TblCoreFarmer.objects.filter(pk=existing_row.pk).update(**edit_data_row)
        return Response({"success": 1, "message": "Data has been updated successfully"}, status=200)
