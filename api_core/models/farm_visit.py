from django.db import models


class TblFarmVisit(models.Model):
    data_id = models.CharField(max_length=64, blank=True, null=True)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    field_officer = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True, db_comment='FK to tbl_user — who conducted the visit')
    visit_date = models.DateField()
    visit_type = models.CharField(max_length=32, db_comment='initial_assessment | follow_up | annual_review')
    visit_purpose = models.CharField(max_length=64, blank=True, null=True, db_comment='profitability | health_check | breeding | general')
    scenario_computed = models.CharField(max_length=16, blank=True, null=True, db_comment='baseline | simulated | both')
    notes = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_farm_visit'
        db_table_comment = 'Field visit anchor record. All assessment data tables link to this.'
