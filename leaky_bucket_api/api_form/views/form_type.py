from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TblFormType
from ..serializers import TblFormTypeSerializer
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser
from leaky_bucket_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, datetime


class TblFormTypeView(APIView):
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
            queryset = TblFormType.objects.filter(status=1)
            data = TblFormTypeSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check GET /form/types", "desc": str(e)}, status=500)

