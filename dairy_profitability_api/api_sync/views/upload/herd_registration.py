from api_core.models import TblCoreHerd, TblCoreFarm
from api_form.models import TblFormField
from rest_framework.response import Response
from ...utils import generate_data_id
from django.utils.timezone import now
import json


class WriteHerdData:
    def __init__(self, **kwargs):
        self.row_data = kwargs.get("row_data")
        self.logged_in_user_id = kwargs.get("logged_in_user_id")
        self.model_fields = {f.name: f for f in TblCoreHerd._meta.get_fields()}
        self.form_field_numbers = TblFormField.objects.filter(form_id=2).values_list("pk", flat=True)
        self.form_fields = [f"field_{x}" for x in TblFormField.objects.filter(form_id=2).values_list("pk", flat=True)]



    def insert(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for row in self.row_data:
            if "id" in row:
                row.pop("id")
            farm_data_id = TblCoreFarm.objects.filter(pk=row.get("field_5024")).first().data_id
            new_data_row = {
                "data_id": generate_data_id(self.logged_in_user_id),
                "farm_data_id": farm_data_id,
                "created_by_user_id": self.logged_in_user_id,
                "created_on": now(),
                "status": True,
            }
            for item, value in row.items():
                if item in self.model_fields:
                    field_obj = self.model_fields.get(item)
                    if field_obj and field_obj.is_relation and value is not None:
                        related_model = field_obj.related_model
                        try:
                            value = related_model.objects.get(pk=value)
                        except related_model.DoesNotExist:
                            return Response({"success": 1, "message": f"Invalid value provided for {item}"}, status=400)
                    new_data_row[item] = value
            TblCoreHerd.objects.create(**new_data_row)
        return Response({"success": 1, "message": "Data has been entered successfully"}, status=200)


    def update(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for row in self.row_data:
            pk_ = row.get("id")
            if not pk_:
                return Response({"success": 0, "message": "Please include the row id for updating data"}, status=400) 
            existing_row = TblCoreHerd.objects.filter(pk=pk_)
            if existing_row:
                edit_data_row = {
                    "updated_by_user_id": self.logged_in_user_id,
                    "updated_on": now(),
                }
                row.pop("id")
                for item, value in row.items():
                    if item in self.model_fields:
                        field_obj = self.model_fields.get(item)
                        if field_obj and field_obj.is_relation and value is not None:
                            related_model = field_obj.related_model
                            try:
                                value = related_model.objects.get(pk=value)
                            except related_model.DoesNotExist:
                                return Response({"success": 1, "message": f"Invalid value provided for {item}"}, status=400)
                        edit_data_row[item] = value
                existing_row.update(**edit_data_row)
        return Response({"success": 1, "message": "Data has been updated successfully"}, status=200)
