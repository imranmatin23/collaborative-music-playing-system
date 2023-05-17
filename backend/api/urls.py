from django.urls import path
from .views import RoomView, CreateRoomView, GetRoomView, JoinRoom, UserInRoom

urlpatterns = [
    path("room", RoomView.as_view()),
    path("create-room", CreateRoomView.as_view()),
    path("get-room", GetRoomView.as_view()),
    path("join-room", JoinRoom.as_view()),
    path("user-in-room", UserInRoom.as_view()),
]
