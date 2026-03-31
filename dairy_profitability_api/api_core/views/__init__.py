from rest_framework.views import APIView
from rest_framework.response import Response
from api_form.models import TblForm
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser
from dairy_profitability_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.db.models import Q
from ..models import LkpAnimalType, LkpBreedMatrix
from ..serializers import LkpAnimalTypeSerializer, LkpBreedMatrixSerializer
from .coop_group_registration import UtilCoreCoopGroup
from .farm_registration import UtilCoreFarm
from .herd_registration import UtilCoreHerd
from .animal_registration import UtilCoreAnimal


DATA_UTIL_INDEX = {
    11: UtilCoreCoopGroup,
    1: UtilCoreFarm,
    2: UtilCoreHerd,
    3: UtilCoreAnimal,
}


class CoreView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        if token and token.startswith("Bearer "):
            token = token[7:]
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        return user_id


    def _get_user_lowest_adm(self, logged_in_user_id):
        user_obj = TblUser.objects.filter(pk=logged_in_user_id).first()
        fields = ["adm0_id", "adm1_id", "adm2_id", "adm3_id", "adm4_id"]
        last_field = None
        last_value = None
        for field in fields:
            value = getattr(user_obj, field)
            if value is None:
                return [None, None]
            else:
                last_field = field
                last_value = value
        return [last_field, last_value]

    
    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
            if not logged_in_user.status:
                return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
            form_id = request.GET.get("form_id")
            form_id = int(form_id) if str(form_id).isdigit() else None
            valid_form_ids = (TblForm.objects.filter(status=1).values_list("pk", flat=True))
            if not form_id or (form_id and form_id not in valid_form_ids):
                return Response({"success": 0, "message": "Please choose a valid form_id"}, status=400)
            DataUtilClass = DATA_UTIL_INDEX[form_id]
            data_util = DataUtilClass()
            # url params
            page = int(request.GET.get("page")) if str(request.GET.get("page")).isdigit() else None
            size = int(request.GET.get("size")) if str(request.GET.get("size")).isdigit() else None
            search_for = request.GET.get("search_for")

            loc_filter_criteria = Q()
            [adm_id, adm_val] = self._get_user_lowest_adm(logged_in_user_id)
            if adm_id and adm_val:
                loc_filter_criteria = Q(**{adm_id: adm_val})  
            if form_id in valid_form_ids:
                data_id = request.GET.get("data_id")
                response = (
                    data_util.read_single(data_id=data_id)
                    if data_id
                    else data_util.read_list(
                        request=request, page=page, size=size, 
                        search_for=search_for, loc_filter_criteria=loc_filter_criteria
                    )
                )
            else:
                response = Response({"success": 0, "message": "Currently unavailable. Will serve as soon as added."}, status=400)
            return response
        except ExpiredSignatureError:
            return Response({"success": 0, "message": "Your authentication token has expired, please login again", "session_expired": True}, status=401)
        except InvalidTokenError:
            return Response({"success": 0, "message": "Your authentication token is invalid, please login again", "session_expired": True}, status=401)
        except Exception as e:
            return Response({"success": 0, "message": "Server side error, please check GET /core", "desc": str(e)}, status=500)



LOOKUP_MODEL_INDEX = {
    "breed_matrix": (LkpBreedMatrix, LkpBreedMatrixSerializer),
    "animal_type": (LkpAnimalType, LkpAnimalTypeSerializer),
}

class CoreLkpView(APIView):
    def get(self, request, lkp):
        try:
            if lkp not in LOOKUP_MODEL_INDEX:
                return Response({"success": 0, "message": "Please enter a valid core lookup table"}, status=400)
            model_ = LOOKUP_MODEL_INDEX[lkp][0]
            serializer_ = LOOKUP_MODEL_INDEX[lkp][1]
            queryset = model_.objects.all()
            data = serializer_(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
        except Exception as e:
            return Response({"success": 0, "message": f"Server side error, please check GET /core/{lkp}", "desc": str(e)}, status=500)
