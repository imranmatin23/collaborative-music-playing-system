/*
 * This file defines the Info page.
 */
import React, { useState } from "react";
import { Grid, Button, Typography, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

// Create an enum for the pages
const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

/*
 * Render the Info page.
 */
function Info(props) {
  // Initialize the state variables
  const [page, setPage] = useState(pages.JOIN);

  // Define function to return the info on how the Join Page works
  function joinInfo() {
    return (
      '1/ Click "Join a Room".\n ' +
      '2/ Enter a code for a Room and click "Enter Room".\n ' +
      "3/ Depending on how the Host of the Room has configured the Room you can see the current song playing, pause/play it, and vote to skip it. If enough votes to skip the song are received, the song will be skipped!\n " +
      '4/ Leave the Room by clicking the "Leave Room" button.'
    );
  }

  // Define function to return the info on how the Create Page works
  function createInfo() {
    return (
      '1/ Click "Create a Room".\n ' +
      '2/ Configure the settings for the Room and click "Create a Room".\n ' +
      '3/ Click the "Settings" button to configure the settings for the room.\n ' +
      '4/ Leave the Room by clicking the "Leave Room" button. This will close the room for all other users in the room.\n'
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {page === pages.CREATE ? "Create a Room Page" : "Join a Room Page"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        {/* Conditionally render the Join page or Create page info */}
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>
      {/* Conditionally render the the NavigateBefore or NavigateAfter icon based on current page */}
      <Grid item xs={12} align="center">
        <IconButton
          onClick={() => {
            page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
          }}
        >
          {page === pages.CREATE ? (
            <NavigateBeforeIcon />
          ) : (
            <NavigateNextIcon />
          )}
        </IconButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default Info;
