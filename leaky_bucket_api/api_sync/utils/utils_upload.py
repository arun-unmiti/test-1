from rest_framework.response import Response
import json


def resolve_core_ref(row, idx, fk_key, data_key, model_cls, label):
    fk_id = row.pop(fk_key, None)
    data_id = row.pop(data_key, None) if data_key else None
    if not fk_id and not data_id:
        return Response({"success": 0, "message": f"Missing {label} id/reference for row {idx + 1}"}, status=400)
    obj = None
    if data_id:
        obj = model_cls.objects.filter(data_id=data_id).first()
    if fk_id and not obj:
        obj = model_cls.objects.filter(pk=fk_id).first()
    if not obj:
        return Response({"success": 0, "message": f"Invalid {label} id/reference for row {idx + 1}"}, status=400)
    return obj



def normalize_array(value):
    if not value:
        return []
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except Exception:
            return []
    if isinstance(value, list):
        return [int(x) for x in value if str(x).isdigit()]
    return []
