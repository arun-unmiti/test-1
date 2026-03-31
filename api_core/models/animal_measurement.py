from django.db import models


class TblAnimalMeasurement(models.Model):
    visit = models.ForeignKey('api_core.TblFarmVisit', models.DO_NOTHING)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    animal = models.ForeignKey('api_core.TblCoreAnimal', models.DO_NOTHING, blank=True, null=True, db_comment='FK to tbl_core_animal — NULL if animal not yet registered')
    animal_type_id = models.IntegerField(blank=True, null=True)
    animal_label = models.CharField(max_length=64, blank=True, null=True, db_comment='Cow 1, Heifer 1, etc. as entered by field officer')
    heart_girth_cm = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, db_comment='Calculated from heart girth using breed formula')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_animal_measurement'
        db_table_comment = 'Heart girth measurements and calculated weights per visit.'
