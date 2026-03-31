# from django.db.models.signals import post_save
# from django.dispatch import receiver

# # from api_auth.models import TblUser
# # from api_sync.utils import generate_data_id
# # from api_core.models import TblCoreFarmer


# # @receiver(post_save, sender=TblUser)
# # def create_farmer_on_user_create(sender, instance, created, **kwargs):
# #     if not created:
# #         return

# #     if TblCoreFarmer.objects.filter(user_id=instance.id).exists():
# #         return

# #     TblCoreFarmer.objects.create(
# #         user_id=instance.id,
# #         data_id=generate_data_id(instance.id),
# #         created_by_user_id=instance.id,
# #     )

