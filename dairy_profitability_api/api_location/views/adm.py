# LkpAdmView (from niranjan-dev)
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import LkpCountry, LkpLocation, LkpAdmHierarchy
from ..serializers import LkpCountrySerializer, LkpLocationSerializer
from api_auth.models import TblUser
from dairy_profitability_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError


class LkpAdmView(APIView):
    def get(self, request):
        token = request.headers.get("Authorization")
        if token and token.startswith("Bearer "):
            token = token[7:]
        level = request.GET.get("level")
        parent_id = request.GET.get("parent_id")
        adm0_id = request.GET.get("adm0_id")
        try:
            payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
            logged_in_user_id = payload.get("user_id")
            logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
            if not logged_in_user.status:
                return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
            level = int(level) if str(level).isdigit() else None
            parent_id = int(parent_id) if str(parent_id).isdigit() else None
            adm0_id = int(adm0_id) if str(adm0_id).isdigit() else None

            if level == 0:
                queryset = LkpCountry.objects.filter(is_active=1)
                data = {
                    "parent_unit": {"current_level_units": "Countries"},
                    "units": LkpCountrySerializer(queryset, many=True).data,
                }
                return Response({"success": 1, "data": data}, status=200)

            if level is None or level < 1:
                return Response({"success": 0, "message": "Please choose an appropriate administrative level"}, status=400)
            if level == 1 and not adm0_id:
                return Response({"success": 0, "message": "Please choose a country to filter locations"}, status=400)
            if level > 1 and not parent_id:
                return Response({"success": 0, "message": "Please choose the parent level to filter the locations within"}, status=400)

            if level == 1:
                queryset = LkpLocation.objects.filter(adm0_id=adm0_id, level=level, status=1, parent__isnull=True)
            else:
                queryset = LkpLocation.objects.filter(parent_id=parent_id, level=level, status=1)

            parent_unit = {}
            if adm0_id:
                country = LkpCountry.objects.filter(pk=adm0_id).first()
                if country:
                    parent_unit["Country"] = country.name
            hierarchy = LkpAdmHierarchy.objects.filter(adm0_id=adm0_id or 0, level=level).first()
            if hierarchy:
                parent_unit["current_level_units"] = hierarchy.level_plural or hierarchy.level_name

            data = {
                "parent_unit": parent_unit,
                "units": LkpLocationSerializer(queryset, many=True).data,
            }
            return Response({"success": 1, "data": data}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check GET /location/adm", "desc": str(e)}, status=500)