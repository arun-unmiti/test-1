from django.db import models


class TblCoreAnimal(models.Model):
    data_id = models.CharField(max_length=64, blank=True, null=True)
    farm = models.ForeignKey('api_core.TblCoreFarm', models.DO_NOTHING)
    herd = models.ForeignKey('api_core.TblCoreHerd', models.DO_NOTHING)
    animal_type = models.ForeignKey('api_core.LkpAnimalType', models.DO_NOTHING, blank=True, null=True)
    tag_id = models.CharField(max_length=64, blank=True, null=True)
    animal_name = models.CharField(max_length=128, blank=True, null=True)
    sex = models.CharField(max_length=1, blank=True, null=True, db_comment='M | F')
    birthdate = models.DateField(blank=True, null=True)
    main_breed = models.ForeignKey('api_core.LkpBreedMatrix', models.DO_NOTHING, blank=True, null=True, db_comment='FK to lkp_breed_matrix')
    breed_composition = models.CharField(max_length=64, blank=True, null=True)
    entry_type = models.CharField(max_length=32, blank=True, null=True, db_comment='born_on_farm | purchased | donated')
    sire_id = models.IntegerField(blank=True, null=True, db_comment='Self-ref FK to tbl_core_animal')
    dam_id = models.IntegerField(blank=True, null=True, db_comment='Self-ref FK to tbl_core_animal')
    created_on = models.DateTimeField()
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_core_animal'
        db_table_comment = 'Individual animal records. Clean column names replacing field_5027-field_5062 pattern.'
