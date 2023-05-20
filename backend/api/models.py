"""
Define the Models for the API app. Models are representations of the database.
"""
from django.db import models
import string
import random


def generate_unique_code():
    """
    Generates a unique k digit code that does not collide with any existing codes in the database.
    """
    length = 6

    while True:
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code


class Room(models.Model):
    """
    Define the Model for the Room Object in the database.
    """

    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
