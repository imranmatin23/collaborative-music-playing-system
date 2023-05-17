/*
 * This file defines the Home page.
 */
import React, { useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/*
 * Render the HomePage component.
 */
function HomePage() {
  // Set up navigation
  const navigate = useNavigate();

  // NOTE: functional equivalent of async componentDidMount() function
  // Since there is no second argument specifiying any dependencies,
  // this side effect is called after every render
  useEffect(() => {
    // Invoke the backend API to check if a user is already in a Room
    async function getUserInRoom() {
      axios
        .get("/api/user-in-room")
        .then((response) => {
          console.log(response);
          // If the user is in a room, redirect them to that Room's page
          if (response.data.code != null) {
            navigate(`/room/${response.data.code}`);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
    // Invoke the function to check if a user is in a room
    getUserInRoom();
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default HomePage;
