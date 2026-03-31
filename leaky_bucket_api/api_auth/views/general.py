from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TblUser, TblUserRole, TblUserDeviceId
from api_core.models import TblCoreFarmer
from ..serializers import SelfUserSerializer, TblUserRoleSerializer
from django.utils.timezone import now, datetime, timedelta
from django.db import IntegrityError
from rest_framework.exceptions import AuthenticationFailed
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from ..exceptions import NotFilledException, NotFoundException, IncorrectPasswordException
from ..utils import is_email_valid, is_password_valid
from leaky_bucket_api.settings import SECRET_KEY
from pprint import pprint


class UserRoleView(APIView):
    def get(self, request):
        try:
            queryset = TblUserRole.objects.filter(status=1)
            data = TblUserRoleSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - GET /auth/user_role",
                "desc": str(e)
            }, status=500)



class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        phone = request.data.get("phone")
        role_id = request.data.get("role_id")
        try:
            unfilled_fields = []
            if not email: unfilled_fields.append("Email")
            if not password: unfilled_fields.append("Password")
            if unfilled_fields: raise NotFilledException
            if not is_email_valid(email): 
                return Response({"success": 0, "message": "Please enter a valid email address"}, status=400)
            if not is_password_valid(password):
                return Response({"success": 0, "message": "Please include at least one of each - uppercase letter, lowecase letter, number. Mimimum characters"}, status=400)
            user = TblUser.objects.create(
                email=email, phone=phone,
                role_id=role_id, created_on=now()
            )
            user.set_password(password)
            user.save()
            return Response({"success": 1, "message": f"User {email} registered successfully"}, status=200)
        except NotFilledException:
            return Response({"success": 0, "message": f"Please fill these details: {', '.join(unfilled_fields)}"}, status=400)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - POST /auth/register",
                "desc": str(e)
            }, status=500)



class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            if not email or not password: raise NotFilledException
            user = TblUser.objects.get(email=email)
            if not user: raise NotFoundException
            if not user.status:
                return Response({"success": 0, "message": "Your account is inactive. Please contact an admin to reactivate."}, status=401)
            if not user.check_password(password): raise AuthenticationFailed
            farmer = TblCoreFarmer.objects.filter(user_id=user.id).first()
            if farmer:
                profile_fields = [
                    farmer.field_5002, farmer.field_5003, farmer.field_5004,
                    farmer.field_5005_id, farmer.field_5006, farmer.field_5007_id,
                    farmer.field_5008_id, farmer.field_5009_id, farmer.field_5010_id,
                    farmer.field_5012_id, farmer.field_5013,
                ]
                is_profile_completed = all(f is not None for f in profile_fields)
            else:
                is_profile_completed = False
            payload = {
                "user_id": user.id,
                "is_profile_completed": is_profile_completed,
                "iat": datetime.now(),
                "exp": datetime.now() + timedelta(hours=12),
            }
            token = jwt.encode(payload=payload, key=SECRET_KEY, algorithm="HS256")
            user.previous_login = user.last_login
            user.last_login = datetime.now()
            user.save() 
            return Response({"success": 1, "message": "Logged in successfully", "token": token}, status=200)
        except NotFilledException:
            return Response({"success": 0, "message": "Please enter valid email and password"}, 400)
        except (NotFoundException, TblUser.DoesNotExist):
            return Response({"success": 0, "message": f"User with email {email} does not exist"}, 404)
        except AuthenticationFailed:
            return Response({"success": 0, "message": "Incorrect password, please try again"}, status=400)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - POST /auth/login",
                "desc": str(e)
            }, status=500)



class SelfView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        exp_time = datetime.utcfromtimestamp(payload.get("exp"))
        if exp_time < datetime.now(): raise ExpiredSignatureError
        user_id = payload.get("user_id")
        return user_id

    
    def get(self, request):
        try:
            token = request.headers.get("Authorization")
            logged_in_user_id = self.validate_user(token=token)
            user = TblUser.objects.get(pk=logged_in_user_id)
            if not user: raise NotFoundException
            data = SelfUserSerializer(user, many=False).data
            return Response({"success": 1, "data": data}, status=200)
        except (NotFoundException, TblUser.DoesNotExist):
            return Response({"success": 0, "message": "User no longer exists in the database"}, status=404)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication is invalid, please login again"}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - POST /auth/self",
                "desc": str(e)
            }, status=500)



class DeviceIdView(APIView):
    def validate_user(self, token):
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        exp_time = datetime.utcfromtimestamp(payload.get("exp"))
        if exp_time < datetime.now(): raise ExpiredSignatureError
        return payload.get("user_id")
    

    def get(self, request):
        try:
            token = request.headers.get("Authorization")
            logged_in_user_id = self.validate_user(token)
            device_obj = TblUserDeviceId.objects.filter(user_id=logged_in_user_id).first()
            if not device_obj:
                return Response({"success": 0, "message": "No device is registered on this database for this user, please use POST request to add one"}, status=404)
            return Response({"success": 1, "device_id": device_obj.device_id}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again"}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - GET /auth/device_id",
                "desc": str(e)
            }, status=500)


    def post(self, request):
        try:
            token = request.headers.get("Authorization")
            logged_in_user_id = self.validate_user(token)
            device_id = request.data.get("device_id")
            if not device_id:
                return Response({"success": 0, "message": "device_id is required"}, status=400)
            TblUserDeviceId.objects.update_or_create(
                user_id=logged_in_user_id,
                defaults={"device_id": device_id, "status": True},
            )
            return Response({"success": 1, "message": "Device ID saved successfully"}, status=200)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again"}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - POST /auth/device_id",
                "desc": str(e)
            }, status=500)