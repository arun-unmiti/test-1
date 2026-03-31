from api_core.models import TblCoreCoopGroup
from api_form.models import TblFormField
from rest_framework.response import Response
from ...utils import (
    generate_data_id,
    # is_required, is_integer, is_string,
    # is_valid_latitude, is_valid_longitude,
)
from django.utils.timezone import now
import json

from pprint import pprint



class WriteCoopGroupData:
    def __init__(self, **kwargs):
        self.row_data = kwargs.get("row_data")
        self.logged_in_user_id = kwargs.get("logged_in_user_id")
        self.model_fields = {f.name: f for f in TblCoreCoopGroup._meta.get_fields()}
        self.form_field_numbers = TblFormField.objects.filter(form_id=11).values_list("pk", flat=True)
        self.form_fields = [f"field_{x}" for x in TblFormField.objects.filter(form_id=11).values_list("pk", flat=True)]


    def insert(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for row in self.row_data:
            if "id" in row:  row.pop("id")
            if "data_id" in row: row.pop("data_id")
            new_data_row = {
                "data_id": generate_data_id(self.logged_in_user_id),
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
            TblCoreCoopGroup.objects.create(**new_data_row)
        return Response({"success": 1, "message": "Data has been entered successfully"}, status=200)
    

    def update(self):
        if isinstance(self.row_data, str):
            self.row_data = json.loads(self.row_data)
        for row in self.row_data:
            pk_ = row.get("id")
            data_id = row.get("data_id")
            if not pk_ or not data_id:
                return Response({"success": 0, "message": "Please include the row_id or data_id for updating data"}, status=400)
            existing_row = (
                TblCoreCoopGroup.objects.filter(pk=pk_).first() if pk_
                else TblCoreCoopGroup.objects.filter(data_id=data_id).first() if data_id
                else None
            )
            if existing_row:
                edit_data_row = {
                    "updated_by_user_id": self.logged_in_user_id,
                    "updated_on": now(),
                }
                if "id" in row:  row.pop("id")
                if "data_id" in row: row.pop("data_id")
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
    
