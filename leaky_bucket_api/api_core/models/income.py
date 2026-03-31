from django.db import models
from django.utils.timezone import now

class TblIncome(models.Model):
    data_id = models.TextField(blank=True, null=True, db_comment='exp_sales_data_id')
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
    crop = models.ForeignKey('api_core.TblCoreCrop', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_crop.id')
    buyer = models.ForeignKey('api_core.TblCoreBuyer', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_buyer.id')
    field_5151 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
    field_5152 = models.TextField(blank=True, null=True, db_comment='crop_data_id (tbl_core_crop)')
    field_5153 = models.DateField(blank=True, null=True, db_comment='sale_date')
    field_5154 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5154', blank=True, null=True, db_comment='buyer_type')
    field_5155 = models.TextField(blank=True, null=True, db_comment='buyer_data_id (tbl_core_buyer)')
    field_5156 = models.TextField(blank=True, null=True, db_comment='output_name')
    field_5157 = models.FloatField(blank=True, null=True, db_comment='quantity')
    field_5158 = models.FloatField(blank=True, null=True, db_comment='price')
    field_5060 = models.ForeignKey('api_core.LkpCropCycle', models.DO_NOTHING, db_column='field_5060', blank=True, null=True)
    field_5159 = models.TextField(blank=True, null=True, db_comment='other_sales')
    field_5160 = models.ForeignKey('api_core.LkpCropStage', models.DO_NOTHING, db_column='field_5160', blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblincome_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblincome_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_income'


# Old - Incorrect (23)
# class TblIncome(models.Model):
#     data_id = models.TextField(blank=True, null=True, db_comment='income_data_id')
#     farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_farm.id')
#     crop = models.ForeignKey('api_core.TblCoreCrop', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_crop.id')
#     supplier = models.ForeignKey('api_core.TblCoreSupplier', models.DO_NOTHING, blank=True, null=True, db_comment='tbl_core_supplier.id')
#     field_5052 = models.TextField(blank=True, null=True, db_comment='farm_data_id (tbl_core_farm)')
#     field_5053 = models.TextField(blank=True, null=True, db_comment='crop_data_id (tbl_core_crop)')
#     field_5054 = models.DateField(blank=True, null=True, db_comment='income_date')
#     field_5055 = models.ForeignKey('api_form.TblFormFieldOption', models.DO_NOTHING, db_column='field_5055', blank=True, null=True, db_comment='supplier_type')
#     field_5056 = models.TextField(blank=True, null=True, db_comment='supplier_data_id (tbl_core_supplier)')
#     field_5057 = models.TextField(blank=True, null=True, db_comment='input_name')
#     field_5058 = models.FloatField(blank=True, null=True, db_comment='quantity')
#     field_5059 = models.FloatField(blank=True, null=True, db_comment='price')
#     field_5060 = models.TextField(blank=True, null=True, db_comment='crop_activity')
#     field_5061 = models.TextField(blank=True, null=True, db_comment='other_supply')
#     latitude = models.FloatField(blank=True, null=True)
#     longitude = models.FloatField(blank=True, null=True)
#     created_on = models.DateTimeField(default=now)
#     created_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True)
#     updated_on = models.DateTimeField(blank=True, null=True)
#     updated_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblincome_updated_by_user_set', blank=True, null=True)
#     deleted_on = models.DateTimeField(blank=True, null=True)
#     deleted_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='tblincome_deleted_by_user_set', blank=True, null=True)
#     status = models.BooleanField(default=True)
#     class Meta:
#             managed = False
#             db_table = 'tbl_income'
