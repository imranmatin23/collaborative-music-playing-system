/*
 * This file defines the Room page.
 */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import API from "../Api";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "../components/MusicPlayer";

/*
 * Render the Room component.
 */
function Room() {
  // Initialize the state variables
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [song, setSong] = useState({});

  // Set up navigation
  var navigate = useNavigate();

  // Extract the URL parameters
  var params = useParams();
  const roomCode = params.roomCode;

  // Define the function to get the details about a Room from the backend
  function getRoomDetails() {
    API.get("/api/get-room?code=" + roomCode)
      .then((response) => response.data)
      // Update the state with the Room's details
      .then((data) => {
        console.log(data);
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);

        // If the user is a Host then authenticate with Spotify
        if (data.is_host) {
          authenticateSpotify();
        }
      })
      // Navigate to the Home Page if there are any errors
      .catch((error) => {
        console.error("There was an error!", error);
        leaveButtonPressed();
      });
  }

  // Authenticates a user with Spotify if not already authenticated
  function authenticateSpotify() {
    API.get("/spotify/is-authenticated")
      .then((response) => response.data)
      .then((data) => {
        console.log(data);

        // Authenticate the user with Spotify if they are not authenticated yet
        if (!data.status) {
          API.get("/spotify/get-auth-url")
            .then((response) => response.data)
            .then((data) => {
              console.log(data);
              // Redirect the user to the Spotify Authorization page
              window.location.replace(data.url);
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  // Get the current song playing for the Room and update the state of Song
  function getCurrentSong() {
    API.get("/spotify/current-song")
      .then((response) => {
        if (response.status === 204) {
          console.log("No song currently playing");
        }
        return response.data;
      })
      .then((data) => {
        // Update state of Song
        setSong(data);
      })
      // Navigate to the Home Page if there are any errors
      .catch((error) => {
        console.error("There was an error!", error);
        leaveButtonPressed();
      });
  }

  // Define the handler for when the Leave Button is pressed
  function leaveButtonPressed() {
    // Invoke the LeaveRoom API to remove the user from the Room in the backend
    API.post("/api/leave-room")
      .then((response) => response.data)
      // Navigate to the Home Page after the backend API call completes
      .then((data) => {
        console.log(data);
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  // Define a function that updates the showSettings flag
  function updateShowSettings(value) {
    setShowSettings(value);
  }

  // Return the Settings Button JSX
  function renderSettingsButton() {
    return (
      <Grid item xs={12} align={"center"}>
        {/* When the settings button is clicked toggle the showSettings flag to true */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  // Return the Settings JSX
  function renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          {/* Render the Create/Update Room Page with the current values. When
           * the callback function is invoked, the room details rendered on
           * this page are updated.
           */}
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          {/* Toggle the showSettings flag to false when the Close button is clicked */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  // Poll for Current Song every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentSong();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get Room details only after initial render
  useEffect(() => {
    getRoomDetails();
  }, []);

  // If the ShowSettings flag is true then render the settings page
  if (showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {/* Render the currently playing song in the Music Player component*/}
      <MusicPlayer {...song} />
      {/* Conditionally render the settings button if the user is the host */}
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
