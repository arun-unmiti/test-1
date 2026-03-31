from .farmer_registration import WriteFarmerData
from .farm_registration import WriteFarmData
from .crop_registration import WriteCropData
from .supplier_registration import WriteSupplierData
from .buyer_registration import WriteBuyerData
from .income import WriteIncomeData
from .exp_construction import WriteExpConstructionData
from .exp_seeds import WriteExpSeedsData
from .exp_field_clearing import WriteExpFieldClearingData
from .exp_tillage import WriteExpTillageData
from .exp_soil_prep import WriteExpSoilPrepData
from .exp_planting import WriteExpPlantingData
from .exp_duration import WriteExpDurationData
from .exp_irrigation import WriteExpIrrigationData
from .exp_crop_mgmt import WriteExpCropMgmtData
from .exp_pdc import WriteExpPdcData
from .exp_weed_mgmt import WriteExpWeedMgmtData
from .exp_harvest import WriteExpHarvestData
from .exp_pbs import WriteExpPbsData
from .exp_storage import WriteExpStorageData
from .exp_processing import WriteExpProcessingData
from .exp_sales import WriteExpSalesData


CORE_DATA_WRITE_INDEX = {
    1: WriteFarmerData,
    2: WriteFarmData,
    3: WriteCropData,
    4: WriteSupplierData,
    5: WriteBuyerData,
    7: WriteExpConstructionData,
    8: WriteExpSeedsData,
    9: WriteExpFieldClearingData,
    10: WriteExpTillageData,
    11: WriteExpSoilPrepData,
    12: WriteExpPlantingData,
    13: WriteExpDurationData,
    14: WriteExpIrrigationData,
    15: WriteExpCropMgmtData,
    16: WriteExpPdcData,
    17: WriteExpWeedMgmtData,
    18: WriteExpHarvestData,
    19: WriteExpPbsData,
    20: WriteExpStorageData,
    21: WriteExpProcessingData,
    22: WriteExpSalesData,
    23: WriteIncomeData,
}


class SyncUpload:
    def __init__(self, **kwargs):
        self.form_id = kwargs.get("form_id")
        self.core_data_write = CORE_DATA_WRITE_INDEX.get(self.form_id)
        self.action = kwargs.get("action")
        self.logged_in_user_id = kwargs.get("logged_in_user_id")
        self.row_data = kwargs.get("row_data")

    def execute(self):
        if self.action == "insert": 
            return self.core_data_write(
                row_data=self.row_data,
                logged_in_user_id=self.logged_in_user_id,
            ).insert()
        if self.action == "update":
            return self.core_data_write(
                row_data=self.row_data,
                logged_in_user_id=self.logged_in_user_id,
            ).update()
