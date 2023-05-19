"""
Define the Models for the Spotify app. Models are representations of the database.
"""

from django.db import models


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
