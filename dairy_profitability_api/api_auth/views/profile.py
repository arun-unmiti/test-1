from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TblUser
from dairy_profitability_api.settings import MEDIA_ROOT
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, datetime
from ..utils import is_password_valid, send_password_reset_email, decode_token
from django.core.files.storage import FileSystemStorage
import os
import uuid


class UserProfileView(APIView):
    def patch(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = decode_token(token)
            purpose = request.data.get("purpose")
            if not purpose or (purpose and purpose not in ["edit", "change_profile_image", "reset_password"]):
                return Response({"success": 0, "message": "Please choose a valid purpose - edit/change_profile_image/reset_password"}, status=400)
            user_obj = TblUser.objects.filter(pk=logged_in_user_id).first()
            if not user_obj.status:
                return Response({"success": 0, "message": "Your account has been deactivated, please contact admin to reactivate"}, status=401) 
            if purpose == "edit":
                name = request.data.get("name")
                phone = request.data.get("phone")
                email = request.data.get("email")
                already_exists = TblUser.objects.exclude(pk=user_obj.pk).filter(email=email)
                if already_exists:
                    return Response({"success": 0, "message": "This email is already registered with another user, please choose another"}, status=409)
                user_obj.full_name = name
                user_obj.phone = phone
                user_obj.email = email
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                return Response({"success": 1, "message": "Your details have been updated successfully"}, status=200)
            if purpose == "change_profile_image":
                profile_image = request.FILES.get("profile_image")
                _, file_ext = os.path.splitext(profile_image.name)
                if str(file_ext).lower() not in [".png", ".jpg", ".jpeg"]:
                    return Response({"success": 0, "message": "Please ensure to upload a JPG/PNG image"}, status=400)
                if profile_image.size > 1024 * 1024:
                    return Response({"success": 0, "message": "File size exceeds limit of 1 MB, please choose a smaller image"}, status=413)
                if user_obj.profile_image:
                    existing_image = os.path.join(MEDIA_ROOT, "profile_images", user_obj.profile_image)
                    if os.path.exists(existing_image):
                        os.remove(existing_image)
                image_storage = FileSystemStorage(location=os.path.join(MEDIA_ROOT, "profile_images"))
                image_filename = f"{user_obj.pk}_profile_image_{str(now().timestamp()).replace('.', '_')}{file_ext}"
                image_storage.save(image_filename, profile_image)
                user_obj.profile_image = image_filename
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                return Response({"success": 1, "message": None}, status=200)
            if purpose == "reset_password":
                current_password = request.data.get("current_password")
                new_password = request.data.get("new_password")
                is_valid_current_password = user_obj.check_password(current_password)
                if not is_valid_current_password:
                    return Response({"success": 0, "message": "Current password entered is incorrect"}, status=400)
                if not is_password_valid(new_password):
                    return Response({"success": 0, "message": "Please include at least one of each - uppercase letter, lowecase letter, number. Mimimum characters"}, status=400)
                user_obj.set_password(new_password)
                user_obj.updated_by_user_id = logged_in_user_id
                user_obj.updated_on = now()
                user_obj.save()
                return Response({"success": 1, "message": "Your password has been reset successfully"}, status=200)
        except Exception as e:
            return Response({
                "success": 0,
                "message": "Server side error, please check - PATCH /auth/profile",
                "desc": str(e)
            }, status=500)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            if not email:
                return Response({"success": 0, "message": "Please enter your registered email"}, status=400)
            user = TblUser.objects.filter(email=email, status=True).first()
            if not user:
                return Response({"success": 0, "message": "No active registered user with this email"}, status=404)
            password_reset_token = uuid.uuid4()
            user.password_reset_token = password_reset_token
            user.save()
            mail_result = send_password_reset_email(
                receiver=email,
                password_reset_token=password_reset_token,
                name=user.full_name
            )
            if mail_result == 1:
                return Response({"success": 1, "message": "Email with a link to reset password sent to you, please check"}, status=200)
            else:
                return Response({"success": 0, "message": "Email server is not reachable, please try later"}, status=500)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check POST /auth/forgot_password"}, status=500)


class ResetPasswordView(APIView):
    def patch(self, request):
        email = request.data.get("email")
        password_reset_token = request.data.get("password_reset_token")
        new_password = request.data.get("new_password")
        try:
            if not new_password:
                return Response({"success": 0, "message": "Please enter new password"}, status=400)
            user = TblUser.objects.filter(email=email, status=True).first()
            if not user:
                return Response({"success": 0, "message": "No active registered user with this email"}, status=404)
            if user.password_reset_token != password_reset_token:
                return Response({"success": 0, "message": "Token for set password is invalid, please request another reset link email"}, status=400)
            valid_password = is_password_valid(new_password)
            if not valid_password:
                    return Response({"success": 0, "message": "Your new password is invalid. Please include at least one of each - uppercase letter, lowecase letter, number. Mimimum 8 characters"}, status=400)
            user.set_password(new_password)
            user.updated_on = now()
            user.recent_password_reset = now()
            user.password_reset_token = None
            user.save()
            return Response({"success": 1, "message": "Password reset successfully"}, status=200)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check PATCH  /auth/reset_password"}, status=500)
