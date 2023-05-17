import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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

function CreateRoomPage({
  votesToSkip = 2,
  guestCanPause = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
}) {
  const [guestCanPauseState, setGuestCanPauseState] = useState(guestCanPause);
  const [votesToSkipState, setVotesToSkipState] = useState(votesToSkip);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  var navigate = useNavigate();

  function handleVotesChange(e) {
    setVotesToSkipState(e.target.value);
  }

  function handleGuestCanPauseChange(e) {
    setGuestCanPauseState(e.target.value === "true" ? true : false);
  }

  function handleRoomButtonPressed() {
    const body = {
      votes_to_skip: votesToSkipState,
      guest_can_pause: guestCanPauseState,
    };

    axios
      .post("/api/create-room", body)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        navigate("/room/" + data.code);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  function handleUpdateButtonPressed() {
    const body = {
      votes_to_skip: votesToSkipState,
      guest_can_pause: guestCanPauseState,
      code: roomCode,
    };

    axios
      .patch("/api/update-room", body)
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

  function renderTitle() {
    return update ? "Update Room" : "Create a Room";
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
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
