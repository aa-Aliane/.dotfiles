¢from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    def __str__(self):
        return self.username
¢2Jfile:///home/amine/coding/web/tek-mag/backend/apps/accounts/models/user.py