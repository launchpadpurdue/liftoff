import React, { ChangeEvent, Component } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid,
    InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import firebase from '../../../config/firebaseConfig';
import { Event, eventTypes } from '../../../constants';

type EventDialogProps = {
  open: boolean;
  event: Event | null;
  eventID: string | null;
  onClose: (event: Event | null, eventID: string | null) => void;
};

type EventDialogState = {
  event: Event;
  hasLoaded: boolean;
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
  state = { event: emptyEvent(), hasLoaded: false };

  static getDerivedStateFromProps(
    props: EventDialogProps,
    state: EventDialogState
  ) {
    // If the dialog is opened but has not loaded
    if (props.open && !state.hasLoaded) {
      // Set the state Event to the props Event if it exists, otherwise an new Event
      state.event = props.event ? { ...props.event } : emptyEvent();
      // Set hasLoaded to true, so the state Event is not set again
      state.hasLoaded = true;
    }
    return state;
  }

  // Input Handlers

  onInput = (
    property: string,
    value: string | number | firebase.firestore.Timestamp
  ) => {
    // Set the given property and value on the Event in the state
    this.setState(prevState => ({
      event: {
        ...prevState.event,
        [property]: value
      }
    }));
  };

  onDateInput = (time: MaterialUiPickersDate) => {
    // Convert the MaterialUiPickersDate to a Timestamp
    const timestamp = firebase.firestore.Timestamp.fromDate(time as Date);
    // Update the Event in the state
    this.onInput("time", timestamp);
  };

  onNumberInput = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    // Retrieve the property, value, and validatity of the NumberInput
    const property = changeEvent.target.id,
      value = changeEvent.target.value,
      valid = changeEvent.target.validity.valid;
    // Update the Event in the state, if valid
    if (valid) this.onInput(property, value !== "" ? parseFloat(value) : 1);
  };

  onSelectInput = (
    changeEvent: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    // Retrieve the property and value of the Select
    const property = changeEvent.target.name as string,
      value = changeEvent.target.value as string;
    // Update the Event in the state
    this.onInput(property, value);
  };

  onTextFieldInput = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    // Retrieve the property and value of the TextField
    const property = changeEvent.target.id,
      value = changeEvent.target.value;
    // Update the Event in the state
    this.onInput(property, value);
  };

  // Dialog Handler

  closeDialog = (event: Event | null) => {
    // Call the props onClose method with the event and its potential id
    this.props.onClose(event, this.props.eventID);
    // Set hasLoaded to false to reset state
    this.setState({
      hasLoaded: false
    });
  };

  render() {
    // Retrieve props
    const { open, eventID } = this.props;
    // Retrieve the state Event fields
    const {
      event: { title, description, time, location, type, duration }
    } = this.state;
    // Convert the Event Timestamp to a Date, to work with KeyboardDateTimePicker
    const timeAsDate = time.toDate();
    return (
      <Dialog fullWidth onClose={() => this.closeDialog(null)} open={open}>
        <DialogTitle>{eventID ? "Edit" : "Create"} Event Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {eventID ? "Edit" : "Create"} details for the event
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="title"
            label="Event Name"
            margin="dense"
            onChange={this.onTextFieldInput}
            placeholder="ex. Pairing Night"
            value={title}
          />
          <TextField
            autoFocus
            fullWidth
            id="location"
            label="Event Location"
            margin="dense"
            onChange={this.onTextFieldInput}
            placeholder="ex. LWSN B155"
            value={location}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              autoOk
              format="MM/dd/yyyy HH:mm"
              fullWidth
              id="time"
              label="Event Date and Time"
              margin="dense"
              onChange={this.onDateInput}
              placeholder="MM/DD/YYYY hh:mm"
              value={timeAsDate}
              variant="inline"
            />
          </MuiPickersUtilsProvider>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Event Type</InputLabel>
                <Select name="type" onChange={this.onSelectInput} value={type}>
                  {eventTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                id="duration"
                inputProps={{ min: 1 }}
                label="Duration (minutes)"
                margin="dense"
                onChange={this.onNumberInput}
                type="number"
                value={duration}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            id="description"
            label="Event Description"
            margin="dense"
            multiline
            onChange={this.onTextFieldInput}
            placeholder="Add a description of the event"
            rowsMax="4"
            value={description}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.closeDialog(null)}>
            Cancel
          </Button>
          <Button
            autoFocus
            color="primary"
            onClick={() => this.closeDialog(this.state.event)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
