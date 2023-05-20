"""
Define the Models for the Spotify app. Models are representations of the database.
"""

from django.db import models
from api.models import Room


class SpotifyToken(models.Model):
    """
    Define the Model for the SpotifyToken Object in the database.
    """

    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)


class Vote(models.Model):
    """
    Define the Model for the Vote Object in the database.
    """

    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    # Using ForeignKey allows for storing a reference to a Room rather
    # than having to look up a Room after reading the Room Code from a Vote
    # on_delete with models.CASCADE means that we will delete this Vote if
    # the Room that it is associated with is deleted
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
