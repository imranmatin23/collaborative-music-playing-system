"""
The views file contains the logic for each view in the App.
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class HealthCheckView(APIView):
    """
    Returns a reponse based on if the backend is healthy.
    """

    def get(self, request, format=None):
        """
        Reads Healthy if the backend is accessible.
        """

        return Response({"Status": "Healthy"}, status=status.HTTP_200_OK)
