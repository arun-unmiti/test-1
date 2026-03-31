from rest_framework.views import APIView
from rest_framework.response import Response
from api_form.models import TblForm
from api_auth.exceptions import UnauthorizedError
from api_auth.models import TblUser
from leaky_bucket_api.settings import SECRET_KEY
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from ..models import LkpCropGroup, LkpCropCategory, LkpCropStage, LkpCropCycle, LkpCrop, LkpAreaUnits
from ..serializers import (
    LkpCropGroupSerializer, LkpCropCategorySerializer, LkpCropStageSerializer, 
    LkpCropCycleSerializer, LkpCropSerializer, LkpAreaUnitsSerializer,
)
import json
from .farmer_registration import UtilCoreFarmer
from .farm_registration import UtilCoreFarm
from .crop_registration import UtilCoreCrop
from .supplier_registration import UtilCoreSupplier
from .buyer_registration import UtilCoreBuyer
from .income import UtilIncome
from .exp_construction import UtilExpConstruction
from .exp_seeds import UtilExpSeeds
from .exp_field_clearing import UtilExpFieldClearing
from .exp_tillage import UtilExpTillage
from .exp_soil_prep import UtilExpSoilPrep
from .exp_planting import UtilExpPlanting
from .exp_duration import UtilExpDuration
from .exp_irrigation import UtilExpIrrigation
from .exp_crop_mgmt import UtilExpCropMgmt
from .exp_pdc import UtilExpPdc
from .exp_weed_mgmt import UtilExpWeedMgmt
from .exp_harvest import UtilExpHarvest
from .exp_pbs import UtilExpPbs
from .exp_storage import UtilExpStorage
from .exp_processing import UtilExpProcessing
from .exp_sales import UtilExpSales
from ._summary import CoreDashboardView, CoreSummaryView


DATA_UTIL_INDEX = {
    1: UtilCoreFarmer,
    2: UtilCoreFarm,
    3: UtilCoreCrop,
    4: UtilCoreSupplier,
    5: UtilCoreBuyer,
    7: UtilExpConstruction,
    8: UtilExpSeeds,
    9: UtilExpFieldClearing,
    10: UtilExpTillage,
    11: UtilExpSoilPrep,
    12: UtilExpPlanting,
    13: UtilExpDuration,
    14: UtilExpIrrigation,
    15: UtilExpCropMgmt,
    16: UtilExpPdc,
    17: UtilExpWeedMgmt,
    18: UtilExpHarvest,
    19: UtilExpPbs,
    20: UtilExpStorage,
    21: UtilExpProcessing,
    22: UtilExpSales,
    23: UtilIncome,
}


class CoreView(APIView):
    def validate_user(self, **kwargs):
        token = kwargs.get("token")
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_id = payload.get("user_id")
        return user_id


    def post(self, request):
        token = request.headers.get("Authorization")
        try:
            logged_in_user_id = self.validate_user(token=token)
            logged_in_user = TblUser.objects.get(pk=logged_in_user_id)
            if not logged_in_user.status:
                return Response({"success": 0, "message": "Your account is inactive, please reach out to admin to activate"}, status=401)
            payload = request.data if isinstance(request.data, dict) else {}
            form_id = payload.get("form_id")
            form_id = int(form_id) if str(form_id).isdigit() else None
            valid_form_ids = (TblForm.objects.filter(status=1).values_list("pk", flat=True))
            if not form_id or (form_id and form_id not in valid_form_ids):
                return Response({"success": 0, "message": "Please choose a valid form_id"}, status=400)
            if form_id not in DATA_UTIL_INDEX:
                return Response({"success": 0, "message": "Currently unavailable. Will serve as soon as added."}, status=400)
            DataUtilClass = DATA_UTIL_INDEX[form_id]
            data_util = DataUtilClass()
            # payload params
            search_for = payload.get("search_for")
            page = int(payload.get("page")) if str(payload.get("page")).isdigit() else None
            size = int(payload.get("size")) if str(payload.get("size")).isdigit() else None
            if (page and not size) or (size and not page):
                return Response({"success": 0, "message": "Please provide both page and size for pagination"}, status=400)
            adm0_id = int(payload.get("adm0_id")) if str(payload.get("adm0_id")).isdigit() else None
            adm1_id = int(payload.get("adm1_id")) if str(payload.get("adm1_id")).isdigit() else None
            adm2_id = int(payload.get("adm2_id")) if str(payload.get("adm2_id")).isdigit() else None
            adm3_id = int(payload.get("adm3_id")) if str(payload.get("adm3_id")).isdigit() else None
            adm4_id = int(payload.get("adm4_id")) if str(payload.get("adm4_id")).isdigit() else None
            crop_id_raw = payload.get("crop_id")
            crop_id = None
            if crop_id_raw:
                if isinstance(crop_id_raw, list):
                    crop_id = crop_id_raw
                else:
                    try:
                        crop_id = json.loads(crop_id_raw)
                    except Exception:
                        crop_id = None
            if crop_id is not None and not isinstance(crop_id, list):
                return Response({"success": 0, "message": "Please provide crop_id as a JSON array of numbers"}, status=400)
            if form_id in DATA_UTIL_INDEX:
                item_id = payload.get("id")
                data_id = payload.get("data_id")
                response = (
                    data_util.read_single(id=item_id, data_id=data_id)
                    if item_id or data_id
                    else data_util.read_list(
                        request=request, 
                        search_for=search_for,
                        page=page, 
                        size=size,
                        adm0_id=adm0_id,
                        adm1_id=adm1_id,
                        adm2_id=adm2_id,
                        adm3_id=adm3_id,
                        adm4_id=adm4_id,
                        crop_id=crop_id,
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
            return Response({"success": 0, "message": "Server side error, please check POST /core", "desc": str(e)}, status=500)


LOOKUP_MODEL_INDEX = {
    "crop_group": (LkpCropGroup, LkpCropGroupSerializer),
    "crop_category": (LkpCropCategory, LkpCropCategorySerializer),
    "crop_stage": (LkpCropStage, LkpCropStageSerializer),
    "crop_cycle": (LkpCropCycle, LkpCropCycleSerializer),
    "crop": (LkpCrop, LkpCropSerializer),
    "area_units": (LkpAreaUnits, LkpAreaUnitsSerializer),
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
            return Response({"success": 0, "message": "Server side error, please check GET /core/lkp", "desc": str(e)}, status=500)


