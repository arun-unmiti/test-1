from django.db import models


class TblRevenueItems(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    sale_type = models.ForeignKey('api_core.LkpSaleType', models.DO_NOTHING)
    qty_current = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    unit_price_current = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    num_animals_current = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    period_days_current = models.SmallIntegerField(blank=True, null=True)
    amount_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, db_comment='Computed: qty x price x animals x period')
    qty_recommended = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    unit_price_recommended = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    num_animals_recommended = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    period_days_recommended = models.SmallIntegerField(blank=True, null=True)
    amount_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_revenue_items'
        unique_together = (('visit', 'sale_type'),)
        db_table_comment = 'Revenue line items per visit. Replaces tbl_farm_sales.'


class TblMilkChannelPrice(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    channel = models.ForeignKey('api_core.LkpMilkChannel', models.DO_NOTHING, db_comment='FK to lkp_milk_channel')
    price_per_litre = models.DecimalField(max_digits=10, decimal_places=2)
    is_primary = models.IntegerField(db_comment='1 = primary sales channel for this farmer')
    created_on = models.DateTimeField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_milk_channel_price'
        unique_together = (('visit', 'channel'),)
        db_table_comment = 'Milk prices per buyer channel per visit.'
