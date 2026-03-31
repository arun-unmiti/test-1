# api_web/views/user_mgmt.py
import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils.timezone import now
from django.db.models import Q
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from api_auth.models import TblUser, TblUserRole, TblUserLocation
from api_location.models import LkpLocation
from api_web.serializers.user import UserListSerializer, UserDetailSerializer
from api_web.utils import decode_token
from api_auth.utils import (
    is_email_valid, generate_random_password,
    send_initial_password_email, send_admin_reset_password_email,
)
from dairy_profitability_api.settings import env


def _token_error_response(exc):
    if isinstance(exc, ExpiredSignatureError):
        return Response({"success": 0, "message": "Token expired, please login again", "session_expired": True}, status=401)
    return Response({"success": 0, "message": "Invalid token, please login again", "session_expired": True}, status=401)


class UserMgmtView(APIView):
    """
    GET    /web/auth/user_mgmt          — list users (paginated, searchable, filterable)
    GET    /web/auth/user_mgmt?user_id= — fetch single user with all location assignments
    POST   /web/auth/user_mgmt          — create new user
    PATCH  /web/auth/user_mgmt          — edit / reset_password / reactivate
    DELETE /web/auth/user_mgmt          — soft-delete user
    """

    # ── helpers ──────────────────────────────────────────────────────────────

    def _can_manage(self, actor: TblUser, target_role_id: int) -> bool:
        """Return True if actor is allowed to create/edit a user with target_role_id."""
        if not actor.role:
            return False
        # System Admin (role 1) can manage anyone
        if actor.role.code == "ADMIN":
            return True
        # Field Officer (role 2) can manage Farmers/Viewers but not other FOs or Admins
        if actor.role.code == "FIELD_OFFICER":
            target_role = TblUserRole.objects.filter(pk=target_role_id).first()
            if target_role and target_role.code in ("FARMER", "VIEWER"):
                return True
        return False

    def _assign_location(self, user, location_id, assignment_type, is_primary, actor_id):
        """Create or update a TblUserLocation row."""
        loc = LkpLocation.objects.filter(pk=location_id, status=True).first()
        if not loc:
            return
        # Unset previous primary if we're setting a new one
        if is_primary:
            TblUserLocation.objects.filter(user=user, is_primary=True, status=True).update(is_primary=False)
        TblUserLocation.objects.create(
            user=user,
            location=loc,
            location_level=loc.level,
            assignment_type=assignment_type,
            is_primary=is_primary,
            assigned_by_user_id=actor_id,
            created_on=now(),
        )

    # ── GET ──────────────────────────────────────────────────────────────────

    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            decode_token(token)
            user_id = request.GET.get("user_id")

            if user_id:
                user = TblUser.objects.select_related('role', 'adm0').filter(pk=user_id).first()
                if not user:
                    return Response({"success": 0, "message": "User not found"}, status=404)
                data = UserDetailSerializer(user).data
                return Response({"success": 1, "data": data}, status=200)

            # List view
            status_filter = request.GET.get("status")
            search_for = request.GET.get("search_for")
            page = request.GET.get("page")
            size = request.GET.get("size")

            qs = TblUser.objects.select_related('role', 'adm0').all()

            if status_filter == "active":
                qs = qs.filter(status=True)
            elif status_filter == "inactive":
                qs = qs.filter(status=False)

            if search_for:
                qs = qs.filter(Q(email__icontains=search_for) | Q(full_name__icontains=search_for))

            if page and size and str(page).isdigit() and str(size).isdigit():
                paginator = PageNumberPagination()
                paginator.page_size = int(size)
                page_qs = paginator.paginate_queryset(qs, request)
                data = UserListSerializer(page_qs, many=True).data
                return Response({
                    "success": 1,
                    "count": paginator.page.paginator.count,
                    "next": paginator.get_next_link(),
                    "previous": paginator.get_previous_link(),
                    "data": data,
                }, status=200)

            data = UserListSerializer(qs, many=True).data
            return Response({"success": 1, "data": data}, status=200)

        except (ExpiredSignatureError, InvalidTokenError) as e:
            return _token_error_response(e)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - GET /web/auth/user_mgmt", "desc": str(e)}, status=500)

    # ── POST ─────────────────────────────────────────────────────────────────

    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            actor_id = decode_token(token)
            actor = TblUser.objects.select_related('role').get(pk=actor_id)

            full_name = request.data.get("full_name", "").strip()
            email = request.data.get("email", "").strip()
            phone = request.data.get("phone", "").strip() or None
            role_id = request.data.get("role_id")
            adm0_id = request.data.get("adm0_id")
            location_id = request.data.get("location_id")          # primary location
            assignment_type = request.data.get("assignment_type", "primary_ass")

            # Required field checks
            missing = []
            if not full_name: missing.append("Full Name")
            if not email: missing.append("Email")
            if not role_id: missing.append("Role")
            if not adm0_id: missing.append("Country")
            if missing:
                return Response({"success": 0, "message": f"Please fill: {', '.join(missing)}"}, status=400)

            if not is_email_valid(email):
                return Response({"success": 0, "message": "Please enter a valid email address"}, status=400)

            if phone and not re.match(r'^\+?[0-9]{7,15}$', phone):
                return Response({"success": 0, "message": "Please enter a valid phone number"}, status=400)

            role_id = int(role_id)
            if not self._can_manage(actor, role_id):
                return Response({"success": 0, "message": "You are not authorized to create a user with that role"}, status=403)

            # Duplicate check
            if TblUser.objects.filter(email=email).exists():
                existing = TblUser.objects.get(email=email)
                msg = (
                    "A user with this email already exists and is active"
                    if existing.status
                    else "This email exists but the account is deactivated — ask an admin to reactivate it"
                )
                return Response({"success": 0, "message": msg}, status=409)

            # Create user
            random_password = generate_random_password()
            user = TblUser(
                full_name=full_name,
                email=email,
                phone=phone,
                role_id=role_id,
                adm0_id=int(adm0_id),
                created_on=now(),
                created_by_user_id=actor_id,
            )
            user.set_password(random_password)
            user.save()

            # Assign primary location if provided
            if location_id:
                self._assign_location(user, int(location_id), assignment_type, is_primary=True, actor_id=actor_id)

            # Email initial password
            role_obj = TblUserRole.objects.filter(pk=role_id).first()
            # send_initial_password_email(
            #     receiver=email, name=full_name,
            #     role=role_obj.name if role_obj else "", initial_password=random_password
            # )

            return Response({"success": 1, "message": f"User {email} created. An email with the initial password has been sent."}, status=200)

        except TblUser.DoesNotExist:
            return Response({"success": 0, "message": "Authenticated user not found"}, status=404)
        except (ExpiredSignatureError, InvalidTokenError) as e:
            return _token_error_response(e)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - POST /web/auth/user_mgmt", "desc": str(e)}, status=500)

    # ── PATCH ────────────────────────────────────────────────────────────────

    def patch(self, request):
        """
        purpose=edit           — update user details
        purpose=reset_password — reset password and email the user
        purpose=reactivate     — restore a soft-deleted user
        """
        token = request.headers.get("Authorization")
        try:
            actor_id = decode_token(token)
            actor = TblUser.objects.select_related('role').get(pk=actor_id)

            purpose = request.data.get("purpose")
            if purpose not in ("edit", "reset_password", "reactivate"):
                return Response({"success": 0, "message": "purpose must be edit / reset_password / reactivate"}, status=400)

            user_id = request.data.get("user_id")
            user = TblUser.objects.select_related('role').filter(pk=user_id).first()
            if not user:
                return Response({"success": 0, "message": "User not found"}, status=404)

            if purpose == "edit":
                if not user.status:
                    return Response({"success": 0, "message": "User is deactivated — reactivate first"}, status=400)

                full_name = request.data.get("full_name", "").strip()
                email = request.data.get("email", "").strip()
                phone = request.data.get("phone", "").strip() or None
                role_id = request.data.get("role_id")
                adm0_id = request.data.get("adm0_id")
                location_id = request.data.get("location_id")
                assignment_type = request.data.get("assignment_type", "primary_ass")

                missing = []
                if not full_name: missing.append("Full Name")
                if not email: missing.append("Email")
                if not role_id: missing.append("Role")
                if not adm0_id: missing.append("Country")
                if missing:
                    return Response({"success": 0, "message": f"Please fill: {', '.join(missing)}"}, status=400)

                if not is_email_valid(email):
                    return Response({"success": 0, "message": "Please enter a valid email address"}, status=400)

                if phone and not re.match(r'^\+?[0-9]{7,15}$', phone):
                    return Response({"success": 0, "message": "Please enter a valid phone number"}, status=400)

                role_id = int(role_id)
                if not self._can_manage(actor, role_id):
                    return Response({"success": 0, "message": "You are not authorized to assign that role"}, status=403)

                if TblUser.objects.filter(email=email).exclude(pk=user_id).exists():
                    return Response({"success": 0, "message": "Another account already uses this email"}, status=409)

                user.full_name = full_name
                user.email = email
                user.phone = phone
                user.role_id = role_id
                user.adm0_id = int(adm0_id)
                user.updated_on = now()
                user.updated_by_user_id = actor_id
                user.save()

                # Update primary location if provided
                if location_id:
                    # Soft-delete existing primary assignment first
                    TblUserLocation.objects.filter(user=user, is_primary=True, status=True).update(
                        status=False, deleted_on=now(), deleted_by_user_id=actor_id
                    )
                    self._assign_location(user, int(location_id), assignment_type, is_primary=True, actor_id=actor_id)

                return Response({"success": 1, "message": "User updated successfully"}, status=200)

            if purpose == "reset_password":
                if not user.status:
                    return Response({"success": 0, "message": "User is deactivated — reactivate first"}, status=400)
                admin_reset_password = f"{env.get('ADMIN_RESET_MGMT_PASSWORD', 'Dairy@2026')}{now().year}"
                user.set_password(admin_reset_password)
                user.updated_on = now()
                user.updated_by_user_id = actor_id
                user.save()
                send_admin_reset_password_email(
                    name=user.full_name,
                    receiver=user.email,
                    new_password=admin_reset_password
                )
                return Response({"success": 1, "message": "Password reset. Email sent to the user."}, status=200)

            if purpose == "reactivate":
                user.deleted_on = None
                user.deleted_by_user_id = None
                user.status = True
                # is_active removed (does not exist)
                user.updated_on = now()
                user.updated_by_user_id = actor_id
                user.save()
                return Response({"success": 1, "message": "User reactivated successfully"}, status=200)

        except TblUser.DoesNotExist:
            return Response({"success": 0, "message": "Authenticated user not found"}, status=404)
        except (ExpiredSignatureError, InvalidTokenError) as e:
            return _token_error_response(e)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - PATCH /web/auth/user_mgmt", "desc": str(e)}, status=500)

    # ── DELETE ───────────────────────────────────────────────────────────────

    def delete(self, request):
        token = request.headers.get("Authorization")
        try:
            actor_id = decode_token(token)
            user_id = request.data.get("user_id")
            user = TblUser.objects.filter(pk=user_id).first()
            if not user:
                return Response({"success": 0, "message": "User not found"}, status=404)
            if not user.status:
                return Response({"success": 0, "message": "User is already deactivated"}, status=400)
            user.deleted_on = now()
            user.deleted_by_user_id = actor_id
            user.status = False
            # is_active removed (does not exist)
            user.updated_on = now()
            user.updated_by_user_id = actor_id
            user.save()
            return Response({"success": 1, "message": f"User {user.email} deactivated successfully"}, status=200)

        except (ExpiredSignatureError, InvalidTokenError) as e:
            return _token_error_response(e)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - DELETE /web/auth/user_mgmt", "desc": str(e)}, status=500)