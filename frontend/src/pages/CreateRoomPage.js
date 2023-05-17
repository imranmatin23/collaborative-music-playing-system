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
} from "@mui/material";

function CreateRoomPage() {
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

  var navigate = useNavigate();

  function handleVotesChange(e) {
    setVotesToSkip(e.target.value);
  }

  function handleGuestCanPauseChange(e) {
    setGuestCanPause(e.target.value === "true" ? true : false);
  }

  function handleRoomButtonPressed() {
    const body = {
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
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

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText sx={{ textAlign: "center" }}>
            Guest Control of Playback State
          </FormHelperText>
          <RadioGroup
            row
            defaultValue="true"
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
          defaultValue={defaultVotes}
          inputProps={{ min: 1, style: { textAlign: "center" } }}
        />
        <FormHelperText sx={{ textAlign: "center" }}>
          Votes Required to Skip Song
        </FormHelperText>
      </Grid>
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

export default CreateRoomPage;
