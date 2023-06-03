"""
The util file defines utility function related to the Spotify App.
"""

from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
import requests
from pathlib import Path
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the environment variables
env = environ.Env(
    SPOTIFY_CLIENT_ID=(str),
    SPOTIFY_CLIENT_SECRET=(str),
)

env_path = BASE_DIR / ".env"
if env_path.is_file():
    environ.Env.read_env(env_file=str(env_path))


# Base Spotify URL
BASE_URL = "https://api.spotify.com/v1/me/"


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
        "client_id": env("SPOTIFY_CLIENT_ID"),
        "client_secret": env("SPOTIFY_CLIENT_SECRET"),
    }

    # Request a Refresh Token
    response = requests.post("https://accounts.spotify.com/api/token", data=data).json()

    # Extract fields from response body
    access_token = response.get("access_token")
    token_type = response.get("token_type")
    expires_in = response.get("expires_in")

    # Create or Update the SpotifyToken and persist it in the database
    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token
    )


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    """
    Generic function that can be used to make multiple types of requests to Spotify.
    """
    # Get the access token for the user and refresh it if needed
    tokens = get_user_tokens(session_id)
    expires_in = tokens.expires_in
    if expires_in <= timezone.now():
        refresh_spotify_token(session_id)

    headers = {"Authorization": f"Bearer {tokens.access_token}"}

    # Makes a post request if post flag is true
    if post_:
        requests.post(f"{BASE_URL}{endpoint}", headers=headers)

    # Makes a put request if put flag is true
    if put_:
        requests.put(f"{BASE_URL}{endpoint}", headers=headers)

    # Make a get request
    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)

    # Return the response or handle exception if error during request
    return response


def play_song(session_id):
    """
    Execute the Spotify API request to play a song for a user and return the response.
    """
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    """
    Execute the Spotify API request to pause a song for a user and return the response.
    """
    return execute_spotify_api_request(session_id, "player/pause", put_=True)


def skip_song(session_id):
    """
    Execute the Spotify API request to skip a song for a user and return the response.
    """
    return execute_spotify_api_request(session_id, "player/next", post_=True)
