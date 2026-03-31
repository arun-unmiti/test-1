from django.db import models


class TblFeedInputs(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    feed_type = models.ForeignKey('api_core.LkpFeedType', models.DO_NOTHING)
    sale_unit_size = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, db_comment='e.g. 50 for 50kg bag')
    sale_unit_label = models.CharField(max_length=32, blank=True, null=True, db_comment='e.g. 50kg bag, 5kg block')
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    qty_per_cow_per_day_current = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    qty_per_cow_per_day_rec = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True)
    num_cows_fed = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    period_days = models.SmallIntegerField(blank=True, null=True)
    total_cost_current = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, db_comment='Computed: qty x price x cows x days')
    total_cost_recommended = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_feed_inputs'
        unique_together = (('visit', 'feed_type'),)
        db_table_comment = 'Feed costs per type per visit. One row per feed type. Replaces tbl_farm_feeds.'


class TblForagePreference(models.Model):
    visit = models.OneToOneField('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    combination_id_current = models.ForeignKey('api_core.LkpForageCombination', models.DO_NOTHING, db_column='combination_id_current', blank=True, null=True, db_comment='What farmer does now')
    combination_id_rec = models.ForeignKey('api_core.LkpForageCombination', models.DO_NOTHING, db_column='combination_id_rec', related_name='tblforagepreference_combination_id_rec_set', blank=True, null=True, db_comment='Recommended combination')
    dry_matter_req_per_cow = models.DecimalField(max_digits=8, decimal_places=3, blank=True, null=True, db_comment='Dry matter requirement kg/cow/day')
    created_on = models.DateTimeField()
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_forage_preference'
        db_table_comment = 'Forage combination preference (current vs recommended) per visit.'
