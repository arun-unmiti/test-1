from rest_framework.views import APIView
from rest_framework.response import Response
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser, TblUserDeviceId
from dairy_profitability_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, datetime
from .download import SyncDownload
from .upload import SyncUpload
import json


class SyncView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        if token and token.startswith("Bearer "):
            token = token[7:]
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        user_role = payload.get("user_role")
        return user_id, user_role


    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id, user_role = self.validate_user(token=token)
            if user_role != 2:
                return Response({"success": 0, "message": "Invalid user. Only Field Officers are allowed to log in on mobile."}, status=403)
            logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
            if not logged_in_user.status:
                return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
            purpose = request.data.get("purpose")
            if purpose in ("lookups", "core", "activity"):
                sync_download = SyncDownload()
                data = {
                    "structure": sync_download.get_structure(purpose=purpose),
                    "records": sync_download.get_records(
                        purpose=purpose,
                        created_by_user_id=logged_in_user_id,
                    ),
                }
                return Response({"success": 1, "data": data}, status=200)
            if purpose == "upload":
                form_id = int(request.data.get("form_id")) if str(request.data.get("form_id")).isdigit() else None
                querytype = request.data.get("querytype")
                action = request.data.get("action")
                row_data = request.data.get("row_data")
                errors_in_params = []
                if not form_id: errors_in_params.append("Form/Survey id is mandatory")
                if not querytype or (querytype and querytype not in ["formdata",]):
                    errors_in_params.append("Choose appropriate querytype - formdata")
                if not action or (action and action not in ["insert", "update"]):
                    errors_in_params.append("Choose the appropriate operation - insert/update")
                if errors_in_params:
                    return Response({"success": 0, "message": "Please check the errors in desc", "desc": errors_in_params}, status=400)
                sync_upload_response = SyncUpload(
                    form_id=form_id,
                    action=action, 
                    row_data=row_data,
                    logged_in_user_id=logged_in_user_id,
                ).execute()
                return sync_upload_response
            return Response({"success": 0, "message": "Invalid purpose."}, status=400)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except json.decoder.JSONDecodeError:
            return Response({"success": 0, "message": "Value for row_data is not in valid stringified-JSON, please correct"}, status=400)
        except ValueError as ve:
            return Response({"success": 0, "message": f"ValueError: {str(ve)}"}, status=400)
        except TypeError as te:
            return Response({"success": 0, "message": f"TypeError: {str(te)}"}, status=400)
        except Exception as e:
            return Response({"success": 0, "message": f"Server side error, please check POST /sync ({purpose})", "desc": str(e)}, status=500)


class TokenRegistrationView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        if token and token.startswith("Bearer "):
            token = token[7:]
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        return user_id

    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            device_id = request.data.get("device_id")
            if not device_id:
                return Response({"success": 0, "message": "device_id is required."}, status=400)
            TblUserDeviceId.objects.update_or_create(
                user_id=logged_in_user_id,
                defaults={"device_id": device_id, "status": 1},
            )
            return Response({"success": 1, "message": "Device registered successfully."}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check POST /token_registration", "desc": str(e)}, status=500)
