from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class TblUserRole(models.Model):
    role = models.CharField(unique=True, max_length=128)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_user_role'


class TblUserManager(BaseUserManager):
    def create_user(self, email, name, password, **kwargs):
        if not email: raise ValueError("User must have an email address")
        if not password: raise ValueError("User must have password")
        if not name: raise ValueError("User must have a name")
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.name = name
        user.phone = kwargs.get("phone")
        user.save(using=self._db)
        return user
    

class TblUser(AbstractBaseUser):
    # Use a custom backend later for composite authentication:
    # phone + otp
    # email + password
    email = models.CharField(unique=True, max_length=128)
    password = models.CharField(max_length=256, blank=True, null=True)
    phone = models.CharField(max_length=16, blank=True, null=True)
    role = models.ForeignKey('api_auth.TblUserRole', models.DO_NOTHING)
    adm0 = models.ForeignKey('api_location.LkpAdm0', models.DO_NOTHING, blank=True, null=True)
    adm1 = models.ForeignKey('api_location.LkpAdm1', models.DO_NOTHING, blank=True, null=True)
    adm2 = models.ForeignKey('api_location.LkpAdm2', models.DO_NOTHING, blank=True, null=True)
    adm3 = models.ForeignKey('api_location.LkpAdm3', models.DO_NOTHING, blank=True, null=True)
    adm4 = models.ForeignKey('api_location.LkpAdm4', models.DO_NOTHING, blank=True, null=True)
    profile_image = models.TextField(blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    previous_login = models.DateTimeField(blank=True, null=True)
    password_reset_token = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(default=now)
    created_by_user = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by_user = models.ForeignKey('self', models.DO_NOTHING, related_name='tbluser_updated_by_user_set', blank=True, null=True)
    deleted_on = models.DateTimeField(blank=True, null=True)
    deleted_by_user = models.ForeignKey('self', models.DO_NOTHING, related_name='tbluser_deleted_by_user_set', blank=True, null=True)
    status = models.BooleanField(default=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["password", "name"]
    objects = TblUserManager()

    class Meta:
        managed = False
        db_table = 'tbl_user'


class TblUserDeviceId(models.Model):
    user = models.OneToOneField('api_auth.TblUser', models.DO_NOTHING)
    device_id = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'tbl_user_device_id'
