import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Room() {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);

  var params = useParams();
  const roomCode = params.roomCode;

  function getRoomDetails() {
    axios
      .get("/api/get-room?code=" + roomCode)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  getRoomDetails();

  return (
    <div>
      <h3>{roomCode}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>Guest Can Pause: {guestCanPause.toString()}</p>
      <p>Host: {isHost.toString()}</p>
    </div>
  );
}

export default Room;
