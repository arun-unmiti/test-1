from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class TblUserRole(models.Model):
    """User roles — System Admin, Field Officer, Farmer, Viewer/Analyst."""
    name = models.CharField(max_length=64)
    code = models.CharField(max_length=32, unique=True)
    permissions = models.JSONField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_user_role'


class TblUserManager(BaseUserManager):
    def create_user(self, email, full_name, password, **kwargs):
        if not email:
            raise ValueError("User must have an email address")
        if not password:
            raise ValueError("User must have a password")
        if not full_name:
            raise ValueError("User must have a name")
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.full_name = full_name
        user.phone = kwargs.get("phone")
        user.save(using=self._db)
        return user


class TblUser(AbstractBaseUser):
    """Application users — field officers, admins, farmers, viewers."""
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(unique=True, max_length=128, blank=True, null=True)
    password = models.CharField(max_length=256, blank=True, null=True, db_column='password_hash')
    phone = models.CharField(max_length=16, blank=True, null=True)
    role = models.ForeignKey('api_auth.TblUserRole', models.DO_NOTHING, blank=True, null=True)
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, blank=True, null=True, db_column='adm0_id')
    adm1 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, blank=True, null=True, db_column='adm1_id')
    adm2 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, blank=True, null=True, db_column='adm2_id')
    adm3 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, blank=True, null=True, db_column='adm3_id')
    adm4 = models.ForeignKey('api_location.LkpAdm4', models.DO_NOTHING, blank=True, null=True, db_column='adm4_id')
    profile_image = models.TextField(blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    previous_login = models.DateTimeField(blank=True, null=True)
    password_reset_token = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True, related_name='tbluser_created_by_set')
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True, related_name='tbluser_updated_by_set')
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True, related_name='tbluser_deleted_by_set')
    status = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]
    objects = TblUserManager()

    def set_password(self, raw_password):
        super().set_password(raw_password)

    def check_password(self, raw_password):
        if not self.password:
            return False
        return super().check_password(raw_password)

    class Meta:
        managed = False
        db_table = 'tbl_user'


class TblUserLocation(models.Model):
    ASSIGNMENT_CHOICES = [
        ('primary_ass', 'Primary'),
        ('secondary_ass', 'Secondary'),
        ('temporary_ass', 'Temporary'),
        ('readonly_ass', 'Read-only'),
    ]

    user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, related_name='location_assignments')
    location = models.ForeignKey('api_location.LkpLocation', models.DO_NOTHING)
    location_level = models.PositiveSmallIntegerField()
    assignment_type = models.CharField(max_length=16, choices=ASSIGNMENT_CHOICES, default='primary_ass')
    is_primary = models.BooleanField(default=False)
    effective_from = models.DateField(blank=True, null=True)
    effective_to = models.DateField(blank=True, null=True)
    assigned_by_user = models.ForeignKey('api_auth.TblUser', models.DO_NOTHING, blank=True, null=True, related_name='location_assignments_made')
    assignment_note = models.CharField(max_length=512, blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user_id = models.IntegerField(blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user_id = models.IntegerField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user_id = models.IntegerField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_user_location'


class TblUserDeviceId(models.Model):
    user = models.ForeignKey(TblUser, models.DO_NOTHING, db_column='user_id')
    device_id = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tbl_user_device_id'