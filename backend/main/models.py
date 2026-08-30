import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Room(models.Model):
    class RoomType(models.TextChoices):
        OPEN_TO_ALL = 'OTA', 'Open to All'
        INVITE_ONLY = 'IO', 'Invite Only'

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rooms')
    slug = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    room_type = models.CharField(
        max_length=3, choices=RoomType.choices, default=RoomType.OPEN_TO_ALL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
