import { React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import EventIcon from "@material-ui/icons/Event";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import moment from "moment";
import CreateEventAPI from "./CreateEvent.api";

const useStyles = makeStyles({
  root: {
    minWidth: "50%",
  },
  title: {
    margin: "10px",
  },
  formControl: {
    minWidth: "100%",
  },
  dateTimePicker: {
    minWidth: "100%",
  },
  sendButton: {
    margin: "10px",
  },
});

const CreateEvent = () => {
  const today = new Date();
  const classes = useStyles();
  const [isSent, setIsSent] = useState(false);
  const [todayDateTime, setTodayDateTime] = useState(today);
  const [userTimeZoneInGMT, setUserTimeZoneInGMT] = useState(undefined);
  const [eventData, setEventData] = useState({});

  useEffect(() => {
    setDefaultTimeInDateTimePicker();
    setUserTimeZoneInGMT(
      moment(today).format("Z")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDefaultTimeInDateTimePicker = () => {
    if (todayDateTime) {
      setTodayDateTime(todayDateTime.setHours(20)); // set default time to 8pm (usual event timing)
      setTodayDateTime(todayDateTime.setMinutes(0));
      setEventData({
        ...eventData,
        startDateTime: moment(todayDateTime).format("MM/DD/YYYY HH:mm Z"),
      });
    }
  };

  const handleChange = (key, value) => {
    setEventData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSend = () => {
    setEventData((prevState) => ({
      ...prevState,
      startDateTime: (new Date(eventData.startDateTime).toISOString()), // convert time to iso string for consistency
    }));
    CreateEventAPI.post(eventData)
    .then(() => {
      alert('Event Posted Successfully');
    })
    .catch((e) => {
      console.log(e);
      alert('Event Creation Failed: Check console log for more details');
    })
    setIsSent(true);
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.header}
          color="primary"
          variant="h3"
          component="h2"
        >
          <EventIcon style={{ fontSize: 40 }} className={classes.icon} />
          <span className={classes.title}>Creating Event</span>
        </Typography>
        <form className={classes.form} autoComplete="off">
          <TextField
            fullWidth
            autoFocus
            id="eventTitle"
            label="Event Title"
            placeholder="eg. The Best ETO Event Ever"
            margin="normal"
            onChange={(event) => {
              if (event) handleChange(event.target.id, event.target.value);
            }}
          />

          <Grid container justify="space-around" spacing={3}>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  disablePast
                  format="dd MMM yyyy hh:mm a"
                  id="dateTimePicker"
                  label={`Event Start Date & Time (GMT${userTimeZoneInGMT})`}
                  className={classes.dateTimePicker}
                  value={eventData.startDateTime}
                  onChange={(event) => {
                    if (event) {
                      handleChange(
                        "startDateTime",
                        moment(event).format("MM/DD/YYYY HH:mm Z")
                      );
                    }
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  id="demo-simple-select-placeholder-label-label"
                >
                  Duration (Hour)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-placeholder-label-label"
                  id="durationHour"
                  name="durationHour"
                  value={eventData.durationHour ? eventData.durationHour : 0}
                  onChange={(event) => {
                    console.log(event);
                    if (event) handleChange(event.target.name, event.target.value);
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  id="demo-simple-select-placeholder-label-label"
                >
                  Duration (Minutes)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-placeholder-label-label"
                  id="durationMinutes"
                  name="durationMinutes"
                  value={eventData.durationMinutes ? eventData.durationMinutes : 0}
                  onChange={(event) => {
                    if (event) handleChange(event.target.name, event.target.value);
                  }}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={45}>45</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          className={classes.sendButton}
          onClick={handleSend}
        >
          Send
        </Button>
      </CardActions>
      {isSent && JSON.stringify(eventData)}
    </Card>
  );
};

export default CreateEvent;
