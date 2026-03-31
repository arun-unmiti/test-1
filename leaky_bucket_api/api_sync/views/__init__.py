from rest_framework.views import APIView
from rest_framework.response import Response
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser, TblUserDeviceId
from leaky_bucket_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, datetime
from .download import SyncDownload
from .upload import SyncUpload
import json


class SyncView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        return user_id


    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            purpose = request.data.get("purpose")
            if purpose not in ["lookup", "core", "financial", "upload"]:
                 return Response({"success": 0, "message": "Please check the valid purpose - lookup / core / financial / upload"}, status=400)
            if purpose in ["lookup", "core", "financial"]:
                # Download - must verify Authorization token
                logged_in_user_id = self.validate_user(token=token)
                logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
                if not logged_in_user.status:
                    return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
                sync_download = SyncDownload()
                if purpose == "lookup":
                    data = {
                        "structure": sync_download.get_lookup_structure(),
                        "records": sync_download.get_lookup_records(logged_in_user_id),
                    }
                if purpose == "core":
                    data = {
                        "structure": sync_download.get_core_structure(),
                        "records": sync_download.get_core_records(logged_in_user_id),
                    }
                if purpose == "financial":
                    data = {
                        "structure": sync_download.get_financial_structure(),
                        "records": sync_download.get_financial_records(logged_in_user_id),
                    }
                return Response({"success": 1, "data": data}, status=200)
            if purpose == "upload":
                # Upload depends separately for mobile and web
                form_id = int(request.data.get("form_id")) if str(request.data.get("form_id")).isdigit() else None
                querytype = request.data.get("querytype")
                action = request.data.get("action")
                row_data = request.data.get("row_data")
                creator = request.data.get("creator")
                device_id = request.data.get("device_id")
                if creator and device_id:
                    device_obj = TblUserDeviceId.objects.filter(device_id=device_id, user_id=creator).first()
                    if not device_obj:
                        return Response({
                            "success": 0, 
                            "message": "Invalid user. For mobile client, please ensure to include valid device_id X user_id combination."
                        }, status=401)
                logged_in_user_id = (
                    device_obj.user_id
                    if creator and device_id # Mobile passes only creator + device_id
                    else self.validate_user(token=token) # Web should pass Authorization token in header
                )
                logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
                if not logged_in_user:
                    return Response({
                        "success": 0, 
                        "message": "Invalid user. For mobile client, please ensure to include valid device_id X user_id combination. For web client please include valid Authorization token"
                    }, status=401)
                if not logged_in_user.status:
                    return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
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
