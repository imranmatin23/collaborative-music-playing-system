/*
 * This file defines the CreateRoom page.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../Api";
import {
  Grid,
  FormControl,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  TextField,
  Button,
  Collapse,
  Alert,
} from "@mui/material";

/*
 * Render the CreateRoomPage component.
 *
 * NOTE: The name of the component is misleading as this component will either
 * render the Create or Update Room page depending on the update flag passed.
 */
function CreateRoomPage({
  votesToSkip = 2,
  guestCanPause = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
}) {
  // Initialize the state variables
  const [guestCanPauseState, setGuestCanPauseState] = useState(guestCanPause);
  const [votesToSkipState, setVotesToSkipState] = useState(votesToSkip);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Set up navigation
  var navigate = useNavigate();

  // Define the handler for votesToSkip state updates
  function handleVotesChange(e) {
    setVotesToSkipState(e.target.value);
  }

  // Define the handler for guestCanPause state updates
  function handleGuestCanPauseChange(e) {
    // NOTE: the event value is a string but the state expects a bool
    setGuestCanPauseState(e.target.value === "true" ? true : false);
  }

  // Define the handler for when the Room Button is pressed

  function handleRoomButtonPressed() {
    const body = {
      votes_to_skip: votesToSkipState,
      guest_can_pause: guestCanPauseState,
    };

    // Navigate the user to the page for the Room they joined if successful
    API.post("/api/create-room", body)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        navigate("/room/" + data.code);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  // Invoke the UpdateRoom backend API when the Update button is pressed
  function handleUpdateButtonPressed() {
    const body = {
      votes_to_skip: votesToSkipState,
      guest_can_pause: guestCanPauseState,
      code: roomCode,
    };

    // After the API invocation, either update the success or error message
    // and invoke the callback function required after Room Updates
    API.patch("/api/update-room", body)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setSuccessMessage("Room updated successfully!");
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setErrorMessage("Error updating room...");
      })
      .finally(() => {
        updateCallback();
      });
  }

  // Return the Create Buttons JSX
  function renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  // Return the Update Buttons JSX
  function renderUpdateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateButtonPressed}
          >
            Update Room
          </Button>
        </Grid>
      </Grid>
    );
  }

  // Return the Title JSX
  function renderTitle() {
    return update ? "Update Room" : "Create a Room";
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        {/* Depending on if the success message or error message is set, render it */}
        <Collapse in={errorMessage !== "" || successMessage !== ""}>
          {successMessage !== "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMessage("");
              }}
            >
              {successMessage}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMessage("");
              }}
            >
              {errorMessage}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {/* Render the correct title based on type of page to show (Create/Update) */}
          {renderTitle()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText sx={{ textAlign: "center" }}>
            Guest Control of Playback State
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPauseState.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          required={true}
          type="number"
          onChange={handleVotesChange}
          defaultValue={votesToSkipState}
          inputProps={{ min: 1, style: { textAlign: "center" } }}
        />
        <FormHelperText sx={{ textAlign: "center" }}>
          Votes Required to Skip Song
        </FormHelperText>
      </Grid>
      {/* Conditionally render update buttons or create buttons */}
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}

export default CreateRoomPage;
