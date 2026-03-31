from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.urls.exceptions import NoReverseMatch
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.exceptions import APIException
from rest_framework import status


class NotFilledException(TypeError, ValueError, ValidationError, Exception):
    pass


class NotFoundException(AttributeError, ObjectDoesNotExist, NoReverseMatch, Exception):
    pass


class IncorrectPasswordException(AuthenticationFailed):
    pass


class UnauthorizedError(Exception):
    pass


class AuthenticationFailedException(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Authentication failed."
    default_code = "authentication_failed"


class PermissionDeniedException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Permission denied."
    default_code = "permission_denied"