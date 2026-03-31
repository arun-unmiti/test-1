from .coop_group_registration import WriteCoopGroupData
from .farm_registration import WriteFarmData
from .herd_registration import WriteHerdData
from .animal_registration import WriteAnimalData

# To be added as we get data:
# Farm visit
# Animal measurement - milk, heart/girth measurements
# Configurations/thresholds


CORE_DATA_WRITE_INDEX = {
    11: WriteCoopGroupData,
    1: WriteFarmData,
    2: WriteHerdData,
    3: WriteAnimalData,
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
