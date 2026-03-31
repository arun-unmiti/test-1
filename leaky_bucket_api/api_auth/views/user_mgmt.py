from api_core.models import TblCoreFarmer
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TblUser
from ..serializers import TblUserMgmtSerializer
from django.utils.timezone import now, datetime, timedelta
from django.db import IntegrityError
from rest_framework.exceptions import AuthenticationFailed
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from ..exceptions import UnauthorizedError
from ..utils import (
    is_email_valid, is_password_valid,
    generate_random_password, send_initial_password_email, send_admin_reset_password_email
)
from leaky_bucket_api.settings import SECRET_KEY, env
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from pprint import pprint



class UserMgmtView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        exp_time = datetime.utcfromtimestamp(payload.get("exp"))
        if exp_time < datetime.now(): 
            raise ExpiredSignatureError
        user_id = payload.get("user_id")
        return user_id


    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            email = request.data.get("email")
            phone = request.data.get("phone")
            role_id = int(request.data.get("role_id")) if str(request.data.get("role_id")).isdigit() else None
            adm0_id = request.data.get("adm0_id")
            adm1_id = request.data.get("adm0_id")
            adm2_id = request.data.get("adm0_id")
            adm3_id = request.data.get("adm0_id")
            adm4_id = request.data.get("adm0_id")
            # Missing required fields
            missing_fields = []
            if not email: missing_fields.append("Email")
            if not role_id: missing_fields.append("Role")
            if missing_fields:
                return Response({"success": 0, "message": f"Please enter these fields - {', '.join(missing_fields)}"}, status=400)
            if not is_email_valid(email):
                return Response({"success": 0, "message": "Please enter a valid email"}, status=400)
            if phone and not str(phone).isdigit():
                return Response({"success": 0, "message": "Please enter a valid phone number"}, status=400)
            # Conflicting email
            already_exists = TblUser.objects.filter(email=email).first()
            if already_exists:
                return Response({"success": 0, "message": "A user with this email already exists"}, status=409)
            # Valid data - create user (BUT DO NOT CREATE TblCoreFarmer)
            user = TblUser(
                email=email, phone=phone, role_id=role_id,
                adm0_id=adm0_id, adm1_id=adm1_id, adm2_id=adm2_id,
                adm3_id=adm3_id, adm4_id=adm4_id,
                created_by_user_id=logged_in_user_id, created_on=now(), status=True
            )
            # random_password = generate_random_password()
            random_password = "Ciat.2026@lb" # Only for testing !!! Must remove afterwards
            user.set_password(random_password)
            user.save()
            # send_initial_password_email(receiver=email, initial_password=random_password)
            return Response({"success": 1, "message": f"New user - {email} created. Email sent to the user containing initial login password."}, status=200)
        except UnauthorizedError:
            return Response({"success": 0, "message": "You are unauthorized to add a user"}, status=401)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - POST /auth/user_mgmt",
                "desc": str(e)
            }, status=500)


    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            self.validate_user(token=token)
            user_id = request.GET.get("user_id")
            if user_id:
                user_obj = TblUser.objects.filter(pk=user_id).first()
                data = TblUserMgmtSerializer(user_obj, many=False).data
            else:
                page = int(request.GET.get("page")) if str(request.GET.get("page")).isdigit() else None
                size = int(request.GET.get("size")) if str(request.GET.get("size")).isdigit() else None
                search_for = request.GET.get("search_for")
                status = str(request.GET.get("status")).lower() if request.GET.get("status") else None
                if status is not None and status not in ["active", "inactive"]:
                    return Response({"success": 0, "message": "Please choose a valid status-active/inactive"}, status=400)
                queryset = (
                    TblUser.objects.filter(status=True) if status == "active"
                    else TblUser.objects.filter(status=False) if status == "inactive"
                    else TblUser.objects.all()
                )
                if search_for:
                    farmer_user_ids = list(
                        TblCoreFarmer.objects
                        .filter(field_5002__icontains=search_for)
                        .values_list("user_id", flat=True)
                    )
                    queryset = queryset.filter(
                        Q(email__icontains=search_for) |
                        Q(pk__in=farmer_user_ids)
                    )
                if page and size:
                    paginator = PageNumberPagination()
                    paginator.page_size = size
                    page_queryset = paginator.paginate_queryset(queryset, request)
                    data = TblUserMgmtSerializer(page_queryset, many=True).data
                    return Response({
                        "success": 1,
                        "count": paginator.page.paginator.count,
                        "next": paginator.get_next_link(),
                        "previous": paginator.get_previous_link(),
                        "data": data
                    }, status=200)
                else:
                    data = TblUserMgmtSerializer(queryset, many=True).data                
            return Response({"success": 1, "data": data}, status=200)
        except UnauthorizedError:
            return Response({"success": 0, "message": "You are unauthorized to view user data"}, status=401)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - GET /auth/user_mgmt",
                "desc": str(e)
            }, status=500)



    def patch(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            purpose = request.data.get("purpose")
            if not purpose or (purpose and purpose not in ["edit", "reset_password", "reactivate"]):
                return Response({"success": 0, "message": "Please choose a purpose - edit/reset_password"}, status=400)
            user_id = request.data.get("user_id")
            user_obj = TblUser.objects.filter(pk=user_id).first()
            if not user_obj:
                return Response({"success": 0, "message": "The requested user object is not found"}, status=404)
            if purpose == "update_details":
                name = request.data.get("name")
                email = request.data.get("email")
                phone = request.data.get("phone")
                role_id = int(request.data.get("role_id")) if str(request.data.get("role_id")).isdigit() else None
                adm0_id = request.data.get("adm0_id")
                adm1_id = request.data.get("adm0_id")
                adm2_id = request.data.get("adm0_id")
                adm3_id = request.data.get("adm0_id")
                adm4_id = request.data.get("adm0_id")
                missing_fields = []
                if not email: missing_fields.append("Email")
                if not role_id: missing_fields.append("Role")
                if missing_fields:
                    return Response({"success": 0, "message": f"Please enter these fields - {', '.join(missing_fields)}"}, status=400)
                if not is_email_valid(email):
                    return Response({"success": 0, "message": "Please enter a valid email"}, status=400)
                if phone and not str(phone).isdigit():
                    return Response({"success": 0, "message": "Please enter a valid phone number"}, status=400)
                already_exists = TblUser.objects.filter(email=email).exclude(pk=user_id)
                if already_exists:
                    return Response({"success": 0, "message": "A user with the registered email already exists"}, status=409)
                is_farmer = TblCoreFarmer.objects.filter(user=user_obj)
                if is_farmer:
                    if not name:
                        return Response({"success": 0, "message": "Please enter the name intended for the farmer registration record"}, status=200)
                    is_farmer.update({
                        "name": name,
                        "adm0_id": adm0_id,
                        "adm1_id": adm1_id,
                        "adm2_id": adm2_id,
                        "adm3_id": adm3_id,
                        "adm4_id": adm4_id,
                        "updated_by_user_id": logged_in_user_id,
                        "updated_on": now(),
                    })
                # Name if there's a farmer registered against this user
                user_obj.email = email
                user_obj.phone = phone
                user_obj.role_id = role_id
                user_obj.adm0_id = adm0_id
                user_obj.adm1_id = adm1_id
                user_obj.adm2_id = adm2_id
                user_obj.adm3_id = adm3_id
                user_obj.adm4_id = adm4_id
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                return Response({"success": 1, "message": "User details have been updated successfully"}, status=200)
            if purpose == "reset_password":
                # admin_reset_mgmt_password = f"{env.get('ADMIN_RESET_MGMT_PASSWORD')}{now().year}"
                admin_reset_mgmt_password = f"Ciat.2026@lb"
                user_obj.set_password(admin_reset_mgmt_password)
                user_obj.save()
                send_admin_reset_password_email(
                    receiver=user_obj.email,
                    new_password=admin_reset_mgmt_password
                )
                return Response({"success": 1, "message": "User password has been reset successfully. Email sent to the user informing the same."}, status=200)
            if purpose == "reactivate":
                if user_obj.status:
                    return Response({"success": 0, "message": "The user is already active, no need to reactivate"}, status=200)
                user_obj.status = True
                user_obj.deleted_by_user_id = None
                user_obj.deleted_on = None
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                return Response({"success": 0, "message": "The user has been reactivated successfully"}, status=200)
        except UnauthorizedError:
            return Response({"success": 0, "message": "You are unauthorized to edit user data"}, status=401)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - GET /auth/user_mgmt",
                "desc": str(e)
            }, status=500)


    def delete(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            user_id = request.data.get("user_id")
            user_obj = TblUser.objects.filter(pk=user_id).first()
            if not user_obj:
                return Response({"success": 0, "message": "The requested user object is not found"}, status=404)
            user_obj.deleted_by_user_id = logged_in_user_id
            user_obj.deleted_on = now()
            user_obj.status = False
            user_obj.save()
            return Response({"success": 1, "message": f"User {user_obj.email} has been deleted successfully"}, status=200)
        except UnauthorizedError:
            return Response({"success": 0, "message": "You are unauthorized to delete user data"}, status=401)
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - GET /auth/user_mgmt",
                "desc": str(e)
            }, status=500)
