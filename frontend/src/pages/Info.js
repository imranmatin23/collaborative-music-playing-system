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
  // TODO: Improve wording and content for Create page Info guide
  function joinInfo() {
    return "Welcome to the guide for how to use the Join page!";
  }

  // Define function to return the info on how the Create Page works
  // TODO: Improve wording and content for Create page Info guide
  function createInfo() {
    return "Welcome to the guide for how to use the Create page!";
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          What is Collaborative Music Playing System?
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
          {page === pages.CREATE ? "Previous Page" : "Next Page"}
          {/* TODO: Bug causing error when trying to use mui icons */}
          {/* {page === pages.CREATE ? (
            <NavigateBeforeIcon />
          ) : (
            <NavigateNextIcon />
          )} */}
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
