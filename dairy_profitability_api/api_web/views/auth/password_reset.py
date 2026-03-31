# api_web/views/auth/password_reset.py
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now
from django.core.mail import send_mail
from django.conf import settings

from api_auth.models import TblUser


class ForgotPasswordView(APIView):
    """
    POST /web/auth/forgot-password/
    Body: { "email": "user@example.com" }
    """
    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"success": 0, "message": "Email is required"}, status=400)

        user = TblUser.objects.filter(email=email, status=True).first()
        if not user:
            # Security: never reveal whether email exists
            return Response({
                "success": 1,
                "message": "If the email exists, a password reset link has been sent."
            }, status=200)

        # Generate token (same as leaky-bucket commit)
        reset_token = str(uuid.uuid4().hex)
        user.password_reset_token = reset_token
        user.updated_on = now()
        user.save()

        # Reset link (frontend URL from settings)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"

        try:
            send_mail(
                subject="Password Reset Request - Dairy Profitability",
                message=f"""
Hello {user.full_name or 'User'},

You requested a password reset for your Dairy Profitability account.

Your reset token is: {reset_token}

Click the link below to reset your password:
{reset_link}

This link is valid for 24 hours.

If you did not request this, please ignore this email.
                """.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception:
            return Response({"success": 0, "message": "Could not send email. Please try again later."}, status=500)

        return Response({
            "success": 1,
            "message": "If the email exists, a password reset link has been sent."
        }, status=200)


class ResetPasswordView(APIView):
    """
    POST /web/auth/reset-password/
    Body: { "token": "your-token-here", "new_password": "NewStrongPass123" }
    """
    def post(self, request):
        token = request.data.get("token", "").strip()
        new_password = request.data.get("new_password", "").strip()

        if not token or not new_password:
            return Response({"success": 0, "message": "Token and new password are required"}, status=400)

        user = TblUser.objects.filter(password_reset_token=token, status=True).first()
        if not user:
            return Response({"success": 0, "message": "Invalid or expired reset token"}, status=400)

        # Reset password (same as leaky-bucket)
        user.set_password(new_password)
        user.password_reset_token = None          # clear token after use
        user.updated_on = now()
        user.save()

        return Response({
            "success": 1,
            "message": "Password has been successfully reset. You can now login with the new password."
        }, status=200)