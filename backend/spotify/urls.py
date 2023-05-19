"""
Define the urls for the Spotify app. It decides which views map to which endpoints.
"""
from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated

urlpatterns = [
    # Endpoint to return Spotify user authorization url
    path("get-auth-url", AuthURL.as_view()),
    # Endpoint for Spotify to redirect to after user authorizes App with Spotify
    path("redirect", spotify_callback),
    # Endpoint to check if a user is authenticated with Spotify
    path("is-authenticated", IsAuthenticated.as_view()),
]
