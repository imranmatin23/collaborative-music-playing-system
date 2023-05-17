import React, { useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();

  // NOTE: functional equivalent of async componentDidMount() function
  useEffect(() => {
    async function getUserInRoom() {
      axios
        .get("/api/user-in-room")
        .then((response) => {
          console.log(response);
          if (response.data.code != null) {
            navigate(`/room/${response.data.code}`);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
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
