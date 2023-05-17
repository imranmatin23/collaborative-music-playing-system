"""
Define the Views for the API App. These contain the backend logic for each API in the API App.

NOTE: A user is identified by their Session Key.
"""
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


class RoomView(generics.ListAPIView):
    """
    Returns a serialized list of all Rooms in the database.
    """

    # Define the Serializer to use
    serializer_class = RoomSerializer

    # Query all Room objects in the database
    queryset = Room.objects.all()


class GetRoomView(APIView):
    """
    Returns a Room if it exists in the database
    """

    # Define the Serializer to use
    serializer_class = RoomSerializer

    # This is the parameter that we need to read since
    # it is used to uniquely identify a room
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        """
        Defines the GET method for this view. Returns a serialized Room object if found.
        """
        # Read the Room Code from the request
        code = request.GET.get(self.lookup_url_kwarg)

        # Fail the request if the code parameters is not found in the request
        if code is None:
            return Response(
                {"Bad Request": "Code parameter not found in request."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Read the Room with the specified code from the database
        room = Room.objects.filter(code=code)

        # If no room is found in the database with that code fail the request
        if len(room) == 0:
            return Response(
                {"Room Not Found": "Invalid Room Code."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Serialize the first Room object returned from the database
        data = self.serializer_class(room[0]).data
        # Set the is host field if the user in the current session matches the
        # user who created the Room
        data["is_host"] = self.request.session.session_key == room[0].host

        return Response(data, status=status.HTTP_200_OK)


class JoinRoomView(APIView):
    """
    Associates a User with a Room by adding the Room Code to their Session.
    """

    # This is the parameter that we need to read since
    # it is used to uniquely identify a room
    lookup_url_kwarg = "code"

    def post(self, request, format=None):
        """
        Read a Room from the database and associate a Room Code with a User (session).
        """
        # Create a Session for the user if one does not exist already
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Read the Room Code from the request
        code = request.data.get(self.lookup_url_kwarg)

        # Fail the request if the code parameters is not found in the request
        if code is None:
            return Response(
                {"Bad Request": "Code parameter not found in request."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Read the Room with the specified code from the database
        room = Room.objects.filter(code=code)

        # If no room is found in the database with that code fail the request
        if len(room) == 0:
            return Response(
                {"Bad Request": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND
            )

        # Set the room code for the session to the code passed in
        # This ties a Session (i.e. a User) to a Room
        self.request.session["room_code"] = code

        return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)


class CreateRoomView(APIView):
    """
    Creates a Room.
    """

    # Define the Serializer to use
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        """
        Creates a Room for a User and if it already exists, updates it.
        """
        # Create a Session for the user if one does not exist already
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Serialize the request into a Room object
        serializer = self.serializer_class(data=request.data)

        # Fail the request if serailization fails
        if not serializer.is_valid():
            return Response(
                {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Extract relevant fields from the serialized Room object
        guest_can_pause = serializer.data.get("guest_can_pause")
        votes_to_skip = serializer.data.get("votes_to_skip")
        host = self.request.session.session_key

        # SELECT Room FROM Database WHERE host=current_session
        # i.e. Read the Room from the database where the current user (session)
        # is the Host
        queryset = Room.objects.filter(host=host)

        # If a Room already exists with this user as the host, update the
        # Room in the database
        if queryset.exists():
            room = queryset[0]
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=["guest_can_pause", "votes_to_skip"])
            # Associate Room with current session
            self.request.session["room_code"] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        # If a Room does not exist with this user as the host, create a new
        # Room in the database
        else:
            room = Room(
                host=host,
                guest_can_pause=guest_can_pause,
                votes_to_skip=votes_to_skip,
            )
            room.save()
            # Associate Room with current session
            self.request.session["room_code"] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {"code": self.request.session.get("room_code")}

        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({"Message": "Success"}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            code = serializer.data.get("code")

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response(
                    {"Message": "Room not found"}, status=status.HTTP_404_NOT_FOUND
                )

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response(
                    {"Message": "You are not the host of this room."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=["guest_can_pause", "votes_to_skip"])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response(
            {"Bad Request": "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST
        )
