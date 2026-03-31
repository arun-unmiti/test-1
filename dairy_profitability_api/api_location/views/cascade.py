from rest_framework.views import APIView
from rest_framework.response import Response
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
import jwt

from ..models import LkpCountry, LkpLocation
from ..serializers import LkpCountrySerializer, LkpLocationSerializer
from dairy_profitability_api.settings import SECRET_KEY


def _decode(token):
    if token and token.startswith("Bearer "):
        token = token[7:]
    payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
    return payload.get("user_id")


class CountryListView(APIView):
    """GET /lkp/country — list all active countries."""

    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            _decode(token)
            countries = LkpCountry.objects.filter(is_active=True).order_by('name')
            data = LkpCountrySerializer(countries, many=True).data
            return Response({"success": 1, "data": data}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Token expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Invalid token, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - GET /lkp/country", "desc": str(e)}, status=500)


class LocationCascadeView(APIView):
    """
    GET /lkp/location
        ?adm0_id=<id>    — level-1 locations for that country
        ?parent_id=<id>  — children of that location
        ?location_id=<id> — single location
    """

    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            _decode(token)
            adm0_id = request.GET.get("adm0_id")
            parent_id = request.GET.get("parent_id")
            location_id = request.GET.get("location_id")

            if location_id:
                loc = LkpLocation.objects.filter(pk=location_id, status=True).first()
                if not loc:
                    return Response({"success": 0, "message": "Location not found"}, status=404)
                return Response({"success": 1, "data": LkpLocationSerializer(loc).data}, status=200)

            if parent_id:
                locs = LkpLocation.objects.filter(parent_id=parent_id, status=True).order_by('name')
                return Response({"success": 1, "data": LkpLocationSerializer(locs, many=True).data}, status=200)

            if adm0_id:
                locs = LkpLocation.objects.filter(adm0_id=adm0_id, level=1, status=True).order_by('name')
                return Response({"success": 1, "data": LkpLocationSerializer(locs, many=True).data}, status=200)

            return Response({"success": 0, "message": "Provide adm0_id, parent_id, or location_id"}, status=400)

        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Token expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Invalid token, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - GET /lkp/location", "desc": str(e)}, status=500)
