/*
 * This file defines the JoinRoom page.
 */
import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import API from "../Api";

/*
 * Render the RoomJoinPage component.
 */
function RoomJoinPage() {
  // Define the constants
  const errorString = "Room not found.";

  // Initialize the state variables
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(false);

  // Set up navigation
  var navigate = useNavigate();

  // Define the handler for TextField updates
  function handleTextFieldChange(e) {
    setRoomCode(e.target.value);
  }

  // Define the handler for when the Room Button is pressed
  function handleRoomButtonPressed(e) {
    const body = {
      code: roomCode,
    };

    // Navigate the user to the page for the Room they joined if successful
    API.post("/api/join-room", body)
      .then((response) => {
        console.log(response);
        navigate(`/room/${roomCode}`);
      })
      .catch((error) => {
        console.log(error);
        // If the error is a 404, set the error flag
        if (error.response.status === 404) {
          setError(true);
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
        {/* Decide whether or not to render an error based on the error flag */}
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error ? errorString : ""}
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
