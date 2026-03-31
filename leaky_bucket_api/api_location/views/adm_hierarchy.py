from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import LkpAdmHierarchy
from ..serializers import LkpAdmHierarchySerializer
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser
from leaky_bucket_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, datetime



class LkpAdmLevelView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        return user_id


    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
            if not logged_in_user.status:
                return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
            adm0_id = request.GET.get("adm0_id")
            adm0_id = int(adm0_id) if str(adm0_id).isdigit() else None
            if not adm0_id:
                return Response({
                    "success": 0, 
                    "message": "Please choose a country to view the administrative levels"
                }, status=400)
            queryset = LkpAdmHierarchy.objects.filter(adm0_id=adm0_id, status=1)
            data = LkpAdmHierarchySerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check /location/adm_level", "desc": str(e)}, status=500)