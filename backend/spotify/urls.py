"""
Define the urls for the Spotify app. It decides which views map to which endpoints.
"""
from django.urls import path
from .views import *

urlpatterns = [
    # Endpoint to return Spotify user authorization url
    path("get-auth-url", AuthURL.as_view()),
    # Endpoint for Spotify to redirect to after user authorizes App with Spotify
    path("redirect", spotify_callback),
    # Endpoint to check if a user is authenticated with Spotify
    path("is-authenticated", IsAuthenticated.as_view()),
    # Endpoint to get the current song playing for the host of the room the user is in.
    path("current-song", CurrentSong.as_view()),
    # Endpoint to play a song in a Room
    path("play", PlaySong.as_view()),
    # Endpoint to pause a song in a Room
    path("pause", PauseSong.as_view()),
    # Endpoint to skip a song in a Room
    path("skip", SkipSong.as_view()),
]
