import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  var navigate = useNavigate();

  function handleTextFieldChange(e) {
    setRoomCode(e.target.value);
  }

  function handleRoomButtonPressed(e) {
    const body = {
      code: roomCode,
    };

    axios
      .post("/api/join-room", body)
      .then((response) => {
        console.log(response);
        navigate(`/room/${roomCode}`);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 404) {
          // TODO: This is not updating the state of the error message
          setError("Room not found.");
        } else {
          console.error("There was an error!", error);
        }
      });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helper={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleRoomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default RoomJoinPage;
