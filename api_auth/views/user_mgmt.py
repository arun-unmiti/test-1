from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TblUser, TblUserRole, TblUserLocation
from api_location.models import LkpLocation
from ..serializers import TblUserMgmtSerializer
from django.utils.timezone import now, datetime, timedelta
from django.db import IntegrityError
from django.db.models import Q
from rest_framework.exceptions import AuthenticationFailed
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from ..exceptions import UnauthorizedError
from ..utils import (
    is_email_valid, is_password_valid,
    generate_random_password, send_initial_password_email, send_admin_reset_password_email,
    decode_token,
)
from dairy_profitability_api.settings import SECRET_KEY, env
from rest_framework.pagination import PageNumberPagination
from pprint import pprint



class UserMgmtView(APIView):
    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = decode_token(token)
            name = request.data.get("name")
            email = request.data.get("email")
            phone = request.data.get("phone")
            role_id = int(request.data.get("role_id")) if str(request.data.get("role_id")).isdigit() else None
            adm0_id = int(request.data.get("adm0_id")) if str(request.data.get("adm0_id")).isdigit() else None
            # Conflicting email
            already_exists = TblUser.objects.filter(email=email)
            if already_exists:
                ae_user_obj = already_exists.first()
                err_msg = (
                    "A user with this email already exists and is active"
                    if ae_user_obj.status
                    else "A user with this email already exists but deactivated, please reach out to admin to activate"
                )
                return Response({"success": 0, "message": err_msg}, status=409)
            # Missing form data + permission specific
            missing_fields = []
            if not email: missing_fields.append("Email")
            if not name: missing_fields.append("Name")
            if not role_id: missing_fields.append("Role")
            if missing_fields:
                return Response({"success": 0, "message": f"Please enter these fields - {', '.join(missing_fields)}"}, status=400)
            logged_in_user = TblUser.objects.select_related('role').get(pk=logged_in_user_id)
            role_obj = TblUserRole.objects.filter(pk=role_id).first()
            if not logged_in_user.role:
                return Response({"success": 0, "message": "You are unauthorized to add a user"}, status=403)
            actor_code = logged_in_user.role.code
            if actor_code == "ADMIN":
                pass  # can manage any role
            elif actor_code == "FIELD_OFFICER":
                if not role_obj or role_obj.code not in ("FARMER", "VIEWER"):
                    return Response({"success": 0, "message": f"You are unauthorized to add user with role {role_obj.name if role_obj else role_id}"}, status=403)
            else:
                return Response({"success": 0, "message": "You are unauthorized to add a user"}, status=403)
            if not is_email_valid(email):
                return Response({"success": 0, "message": "Please enter a valid email"}, status=400)
            if phone and not str(phone).isdigit():
                return Response({"success": 0, "message": "Please enter a valid phone number"}, status=400)
            # Valid data - create a user
            user = TblUser(
                email=email, full_name=name, phone=phone, role_id=role_id,
                adm0_id=adm0_id,
                created_on=now(), created_by_user_id=logged_in_user_id,
            )
            random_password = generate_random_password()
            user.set_password(random_password)
            user.save()

            # Assign primary location if provided
            location_id = request.data.get("location_id")
            assignment_type = request.data.get("assignment_type", "primary_ass")
            if location_id:
                loc = LkpLocation.objects.filter(pk=int(location_id), status=True).first()
                if loc:
                    TblUserLocation.objects.filter(user=user, is_primary=True, status=True).update(is_primary=False)
                    TblUserLocation.objects.create(
                        user=user,
                        location=loc,
                        location_level=loc.level,
                        assignment_type=assignment_type,
                        is_primary=True,
                        assigned_by_user_id=logged_in_user_id,
                        created_on=now(),
                    )

            # send_initial_password_email(
            #     receiver=email,
            #     name=user.full_name,
            #     role=role_obj.name if role_obj else "",
            #     initial_password=random_password
            # )
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
            decode_token(token)
            user_id = request.GET.get("user_id")
            if user_id:
                user_obj = TblUser.objects.filter(pk=user_id).first()
                data = TblUserMgmtSerializer(user_obj, many=False).data
            else:
                status_ = request.GET.get("status") if str(request.GET.get("status")) in ["active", "inactive"] else None
                page = int(request.GET.get("page")) if str(request.GET.get("page")).isdigit() else None
                size = int(request.GET.get("size")) if str(request.GET.get("size")).isdigit() else None
                search_for = request.GET.get("search_for")
                queryset = TblUser.objects.all()
                if status_:
                    status_flag = {
                        "active": True, 
                        "inactive": False
                    }
                    queryset = queryset.filter(status=status_flag[status_])

                if search_for:
                    search_criteria = Q(email__icontains=search_for) | Q(full_name__icontains=search_for)
                    queryset = queryset.filter(search_criteria)
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
            logged_in_user_id = decode_token(token)
            purpose = request.data.get("purpose")
            if not purpose or (purpose and purpose not in ["edit", "reset_password", "reactivate"]):
                return Response({"success": 0, "message": "Please choose a purpose - edit/reset_password/reactivate"}, status=400)
            user_id = request.data.get("user_id")
            user_obj = TblUser.objects.filter(pk=user_id).first()
            if not user_obj:
                return Response({"success": 0, "message": "The requested user object is not found"}, status=404)
            if purpose == "edit":
                name = request.data.get("name")
                email = request.data.get("email")
                phone = request.data.get("phone")
                role_id = int(request.data.get("role_id")) if str(request.data.get("role_id")).isdigit() else None
                adm0_id = int(request.data.get("adm0_id")) if str(request.data.get("adm0_id")).isdigit() else None
                if not user_obj.status:
                    return Response({"success": 0, "message": "User has been deleted, please reactivate to edit"}, status=404)
                missing_fields = []
                if not email: missing_fields.append("Email")
                if not name: missing_fields.append("Name")
                if not role_id: missing_fields.append("Role")
                if missing_fields:
                    return Response({"success": 0, "message": f"Please enter these fields - {', '.join(missing_fields)}"}, status=400)
                # Checking if logged in user has permissions
                logged_in_user = TblUser.objects.select_related('role').get(pk=logged_in_user_id)
                target_role_obj = TblUserRole.objects.filter(pk=role_id).first()
                if not logged_in_user.role:
                    return Response({"success": 0, "message": "You are unauthorized to edit this user"}, status=403)
                actor_code = logged_in_user.role.code
                if actor_code == "ADMIN":
                    pass  # can manage any role
                elif actor_code == "FIELD_OFFICER":
                    if not target_role_obj or target_role_obj.code not in ("FARMER", "VIEWER"):
                        return Response({"success": 0, "message": f"You are unauthorized to assign role {target_role_obj.name if target_role_obj else role_id}"}, status=403)
                else:
                    return Response({"success": 0, "message": "You are unauthorized to edit this user"}, status=403)
                if not is_email_valid(email):
                    return Response({"success": 0, "message": "Please enter a valid email"}, status=400)
                if phone and not str(phone).isdigit():
                    return Response({"success": 0, "message": "Please enter a valid phone number"}, status=400)
                already_exists = TblUser.objects.filter(email=email).exclude(pk=user_id)
                if already_exists:
                    return Response({"success": 0, "message": "A user with the registered email already exists"}, status=409)
                user_obj.full_name = name
                user_obj.email = email
                user_obj.phone = phone
                user_obj.role_id = role_id
                if adm0_id:
                    user_obj.adm0_id = adm0_id
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                return Response({"success": 1, "message": "User details have been updated successfully"}, status=200)
            if purpose == "reset_password":
                if not user_obj.status:
                    return Response({"success": 0, "message": "User has been deleted, please reactivate to reset password"}, status=404)
                admin_reset_mgmt_password = f"{env.get('ADMIN_RESET_MGMT_PASSWORD')}{now().year}"
                user_obj.set_password(admin_reset_mgmt_password)
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                send_admin_reset_password_email(
                    name=user_obj.full_name,
                    receiver=user_obj.email,
                    new_password=admin_reset_mgmt_password
                )
                return Response({"success": 1, "message": "User password has been reset successfully. Email sent to the user informing the same."}, status=200)
            if purpose == "reactivate":
                user_obj.deleted_on = None
                user_obj.deleted_by_user_id = None
                user_obj.updated_on = now()
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.status = True
                user_obj.save()
                return Response({"success": 1, "message": "User has been reactivated successfully"}, status=200)
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
            logged_in_user_id = decode_token(token)
            user_id = request.data.get("user_id")
            user_obj = TblUser.objects.filter(pk=user_id).first()
            if not user_obj:
                return Response({"success": 0, "message": "The requested user object is not found"}, status=404)
            user_obj.deleted_on = now()
            user_obj.deleted_by_user_id = logged_in_user_id
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
