"""
The util file defines utility function related to the Spotify App.
"""

from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
import requests
from .credentials import CLIENT_ID, CLIENT_SECRET


def get_user_tokens(session_id):
    """
    Gets the SpotifyToken associated with a user if one exists.
    """
    # Read all Spotify Tokens associated with this user
    user_tokens = SpotifyToken.objects.filter(user=session_id)

    # If there is an existing Spotify Token, return it
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(
    session_id, access_token, token_type, expires_in, refresh_token
):
    """
    Updates or creates a SpotifyToken for a user depending on if there exists
    a SpotifyToken in the database for them already or not.
    """
    # Get then SpotifyToken associated with this user
    tokens = get_user_tokens(session_id)

    # Compute the actual time when the token will expire
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    # If the user already has a SpotifyToken update it else create a new one
    # and save it to the database
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(
            update_fields=["access_token", "refresh_token", "expires_in", "token_type"]
        )
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
            token_type=token_type,
        )
        tokens.save()


def is_spotify_authenticated(session_id):
    """
    Checks if a user has a SpotifyToken already and if they do but it is
    expired it will refresh it.
    """
    # Read the user's SpotifyToken from the database
    tokens = get_user_tokens(session_id)

    # If the user does not have a SpotifyToken already return false
    if not tokens:
        return False

    # If the user's SpotifyToken is expired refresh it
    expires_in = tokens.expires_in
    if expires_in <= timezone.now():
        refresh_spotify_token(session_id)

    # Return True since the user has a valid SpotifyToken
    return True


def refresh_spotify_token(session_id):
    """
    Refresh a User's existing SpotifyToken.
    """
    # Read the user's refresh token from the database
    refresh_token = get_user_tokens(session_id).refresh_token

    # Define the Refresh Token request body
    data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    # Request a Refresh Token
    response = requests.post("https://accounts.spotify.com/api/token", data=data)

    # Extract fields from response body
    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")

    # Create or Update the SpotifyToken and persist it in the database
    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token
    )
