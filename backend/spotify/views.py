"""
Define the Views for the Spotfiy App. These contain the backend logic for each API in the Spotify App.

NOTE: A user is identified by their Session Key.
"""

from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, DNS_NAME
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import requests
from .util import update_or_create_user_tokens, is_spotify_authenticated
import base64


class AuthURL(APIView):
    """
    [Step 1] Create the URL to return to the user to request authorization
    from the user so that the App can access Spotify resources on behalf of that user.
    """

    def get(self, request, format=None):
        """
        [Step 1] Create the URL to return to the user to request authorization
        from the user so that the App can access Spotify resources on behalf of that user.

        Request Body:
        client_id: The Client ID generated after registering your application.
        response_type: Set to code.
        redirect_uri: The URI to redirect to after the user grants or denies permission.
        scope:  A space-separated list of scopes. If no scopes are specified,
            authorization will be granted only to access publicly available information:
            that is, only information normally visible in the Spotify desktop, web,
            and mobile players.
        """
        # Permissions requested from the user and required for the App
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"

        # Request Body
        params = {
            "scope": scopes,
            "response_type": "code",
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
        }

        # Create Authorization URL
        url = (
            requests.Request(
                "GET", "https://accounts.spotify.com/authorize", params=params
            )
            .prepare()
            .url
        )

        return Response({"url": url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    """
    [Step 2] Callback function invoked by Spotify to request an Access Token.

    Once a User has authorized the App to access Spotify resources on their behalf,
    the App can exchange the Authorization code for an Access Token.

    This function is invoked automatically after the User authorizes the App
    because Spotfiy uses the REDIRECT_URI specified to redirect them to this endpoint.
    """
    # Read the request body
    code = request.GET.get("code")
    # Optional: Read the error code to handle an error if there was one
    error = request.GET.get("error")

    # Define the Access Token request headers
    auth_header_string_bytes = (CLIENT_ID + ":" + CLIENT_SECRET).encode("ascii")
    base64_bytes = base64.b64encode(auth_header_string_bytes)
    base64_string = base64_bytes.decode("ascii")
    headers = {"Authorization": f"Basic {base64_string}"}

    # Define the Access Token request body
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    # Request an Access Token
    response = requests.post(
        "https://accounts.spotify.com/api/token", headers=headers, data=data
    )

    # Extract fields from response body
    response = response.json()
    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    error = response.get("error")

    # Create a Session for the user if one does not exist already
    if not request.session.exists(request.session.session_key):
        request.session.create()

    # Create or Update the SpotifyToken and persist it in the database
    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token
    )

    # TODO: Currently redirects the user back to this url
    # Since we don't have the Room Code we can't go to that page. Technically
    # we could invoke the /api/user-in-room endpoint to get the room to redirect to
    # This endpoint needs to be updated based on where/how this is being hosted.
    return redirect(DNS_NAME)


class IsAuthenticated(APIView):
    """
    Returns whether a user is authenticated with Spotify or not.
    """

    def get(self, request, format=None):
        """
        Returns whether a user is authenticated with Spotify or not.
        """
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)
