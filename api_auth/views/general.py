from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TblUser, TblUserRole
from ..serializers import SelfUserSerializer, TblUserRoleSerializer
from django.utils.timezone import now
from datetime import datetime, timedelta, timezone
from rest_framework.exceptions import AuthenticationFailed
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from ..exceptions import NotFilledException, NotFoundException, IncorrectPasswordException
from ..utils import is_email_valid, is_password_valid, decode_token
from dairy_profitability_api.settings import SECRET_KEY




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
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")
        phone = request.data.get("phone")
        role_id = request.data.get("role_id")
        try:
            unfilled_fields = []
            if not name: unfilled_fields.append("Name")
            if not email: unfilled_fields.append("Email")
            if not password: unfilled_fields.append("Password")
            if unfilled_fields: raise NotFilledException
            if not is_email_valid(email): 
                return Response({"success": 0, "message": "Please enter a valid email address"}, status=400)
            if not is_password_valid(password):
                return Response({"success": 0, "message": "Please include at least one of each - uppercase letter, lowecase letter, number. Mimimum characters"}, status=400)
            user = TblUser.objects.create(
                full_name=name, email=email, phone=phone,
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
            payload = {
                "user_id": user.id,
                "user_role" : user.role_id,
                "username" : user.full_name,
                "useremail" : user.email, 
                "iat": datetime.now(timezone.utc),
                "exp": datetime.now(timezone.utc) + timedelta(hours=12),
            }
            token = jwt.encode(payload=payload, key=SECRET_KEY, algorithm="HS256")
            user.previous_login = user.last_login
            user.last_login = now()
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
    def get(self, request):
        try:
            token = request.headers.get("Authorization")
            logged_in_user_id = decode_token(token)
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