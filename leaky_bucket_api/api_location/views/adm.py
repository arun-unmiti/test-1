from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import LkpAdm0, LkpAdm1, LkpAdm2, LkpAdm3, LkpAdm4, LkpAdmHierarchy
from ..serializers import (
    LkpAdm0Serializer, LkpAdm1Serializer, LkpAdm2Serializer,
    LkpAdm3Serializer, LkpAdm4Serializer
)
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser
from leaky_bucket_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, datetime


MODEL_SERIALIZER_MAP = {
    0: (LkpAdm0, LkpAdm0Serializer),
    1: (LkpAdm1, LkpAdm1Serializer),
    2: (LkpAdm2, LkpAdm2Serializer),
    3: (LkpAdm3, LkpAdm3Serializer),
    4: (LkpAdm4, LkpAdm4Serializer),
}

class LkpAdmView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        return user_id


    def get_parent_unit(self, parent_id, level, model_, parent_column):
        if level == 0:
            return {"current_level_units": "Countries"}
        parent_unit = {}
        first_obj = model_.objects.filter(**{parent_column: parent_id}).first()
        if first_obj:
            parent_unit["Country"] = LkpAdm0.objects.get(pk=first_obj.adm0_id).name
            if level > 1:
                upper_levels = LkpAdmHierarchy.objects.filter(adm0_id=first_obj.adm0_id, level__lt=level)
                if upper_levels:
                    for upper_level in upper_levels:
                        upper_level_field = f"adm{upper_level.level}"
                        upper_level_name = getattr(getattr(first_obj, upper_level_field, None), "name", None)
                        upper_level_name = getattr(getattr(first_obj, upper_level_field, None), "name", None)
                        parent_unit[upper_level.level_name] = upper_level_name
            parent_unit["current_level_units"] = LkpAdmHierarchy.objects.filter(adm0_id=first_obj.adm0_id, level=level).first().level_plural
            return parent_unit
        return Response({"success": 0, "message": "Please ensure the parent_id matches with the appropriate level"}, status=400)
        

    def get(self, request):
        token = request.headers.get("Authorization")
        level = request.GET.get("level")
        parent_id = request.GET.get("parent_id")
        try:
            logged_in_user_id = self.validate_user(token=token)
            logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
            if not logged_in_user.status:
                return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
            level = int(level) if str(level).isdigit() else None
            parent_id = int(parent_id) if str(parent_id).isdigit() else None
            if level not in range(0, 5):
                return Response({"success": 0, "message": "Please choose an approrpriate administrative level"}, status=400)
            if level > 0 and not parent_id:
                return Response({"success": 0, "message": "Please choose the parent level to filter the locations within"}, status=400)
            model_ = MODEL_SERIALIZER_MAP[level][0]
            serializer_ = MODEL_SERIALIZER_MAP[level][1]
            parent_column = f"adm{level-1}_id" if level > 0 else None
            queryset = (
                model_.objects.filter(**{parent_column: parent_id}, status=True) 
                if parent_column 
                else model_.objects.filter(status=True)
            )
            parent_unit = self.get_parent_unit(parent_id, level, model_, parent_column)
            if isinstance(parent_unit, Response):
                return parent_unit
            data = {
                "parent_unit": parent_unit,
                "units": serializer_(queryset, many=True).data,
            }
            return Response({"success": 1, "data": data}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check GET /location/adm", "desc": str(e)}, status=500)
