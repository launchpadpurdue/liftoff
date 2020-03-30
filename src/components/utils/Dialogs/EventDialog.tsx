import React, { ChangeEvent, Component } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid,
    InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import firebase from '../../../config/firebaseConfig';
import { Event, eventTypes, FixMeLater } from '../../../constants';

type EventDialogProps = {
  open: boolean;
  event: Event | null;
  eventID: string | null;
  onClose: (e: Event | null, id: string | null) => void;
};

type EventDialogState = {
  event: Event;
  hasPassedData: boolean;
};

const emptyEvent = (): Event => ({
  title: "",
  description: "",
  location: "",
  time: firebase.firestore.Timestamp.fromDate(new Date()),
  type: "",
  duration: 1
});

export default class EventDialog extends Component<
  EventDialogProps,
  EventDialogState
> {
  state = { event: emptyEvent(), eventID: null, hasPassedData: false };

  static getDerivedStateFromProps(
    props: EventDialogProps,
    state: EventDialogState
  ) {
    if (props.open && !state.hasPassedData) {
      state.event = props.event ? { ...props.event } : emptyEvent();
      state.hasPassedData = true;
    }
    return state;
  }

  onInput = (changeEvent: ChangeEvent | FixMeLater) => {
    const property: FixMeLater = changeEvent.target.id
        ? changeEvent.target.id
        : changeEvent.target.name,
      value: FixMeLater = changeEvent.target.value;
    const event: FixMeLater = this.state.event;
    if ((property === "duration" && value === "") || !event) return;

    event[property] = value;
    this.setState({ event: event });
  };

  closeDialog = (event: Event | null) => {
    console.log(event, this.props.eventID);
    this.props.onClose(event, this.props.eventID);
    this.setState({
      hasPassedData: false
    });
  };

  render() {
    const { open, eventID } = this.props;
    const { event } = this.state;
    if (!open) return null;
    const { title, description, time, location, type, duration } = event;
    console.log(this.props);
    const timeAsDate = time.toDate();
    return (
      <Dialog fullWidth open={open} onClose={() => this.closeDialog(null)}>
        <DialogTitle>{eventID ? "Edit" : "Create"} Event Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {eventID ? "Edit" : "Create"} details for the event
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="title"
            margin="dense"
            defaultValue={title}
            label="Event Name"
            placeholder="ex. Pairing Night"
            onChange={this.onInput}
          />
          <TextField
            autoFocus
            fullWidth
            id="location"
            margin="dense"
            defaultValue={location}
            label="Event Location"
            placeholder="ex. LWSN B155"
            onChange={this.onInput}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              fullWidth
              placeholder="MM/DD/YYYY hh:mm"
              variant="inline"
              id="time"
              label="Event Date and Time"
              value={timeAsDate}
              autoOk
              margin="dense"
              onChange={(time: MaterialUiPickersDate) =>
                this.setState(prevState => ({
                  event: {
                    ...prevState.event,
                    time: firebase.firestore.Timestamp.fromDate(time as Date)
                  }
                }))
              }
              format="MM/dd/yyyy HH:mm"
            />
          </MuiPickersUtilsProvider>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Event Type</InputLabel>
                <Select value={type} onChange={this.onInput} name="type">
                  {eventTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ min: 1 }}
                margin="dense"
                fullWidth
                label="Duration (minutes)"
                id="duration"
                type="number"
                onInput={this.onInput}
                value={duration}
              />
            </Grid>
          </Grid>
          <TextField
            id="description"
            label="Event Description"
            margin="dense"
            placeholder="Add a description of the event"
            onChange={this.onInput}
            defaultValue={description}
            fullWidth
            rowsMax="4"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog(null)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.closeDialog(this.state.event)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
