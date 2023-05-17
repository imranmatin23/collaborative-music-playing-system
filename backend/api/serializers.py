"""
Defines the Serializers for the API App. Serializers are used to convert Model objects into JSON.
"""

from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    """
    The RoomSerializer converts a Room Object into JSON.
    """

    class Meta:
        """
        N/A
        """

        model = Room
        fields = (
            "id",
            "code",
            "host",
            "guest_can_pause",
            "votes_to_skip",
            "created_at",
        )


class CreateRoomSerializer(serializers.ModelSerializer):
    """
    The CreateRoomSerializer converts a Room Object into JSON specifically for the CreateRoom API.
    """

    class Meta:
        """
        N/A
        """

        model = Room
        fields = ("guest_can_pause", "votes_to_skip")


class UpdateRoomSerializer(serializers.ModelSerializer):
    """
    The UpdateRoomSerializer converts a Room Object into JSON specifically for the Update API.
    """

    # NOTE: This is required due to the fact that code the serializer
    # expects this to be a unique field in the database
    code = serializers.CharField(validators=[])

    class Meta:
        """
        N/A
        """

        model = Room
        fields = ("guest_can_pause", "votes_to_skip", "code")
