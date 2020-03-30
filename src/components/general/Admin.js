import {
  Container,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListItemAvatar,
  Avatar,
  Grid,
  Box,
  Button
} from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";

import React, { Component, Fragment } from "react";

import { connect } from "react-redux";

import { Redirect } from "react-router-dom";

import { firestoreConnect } from "react-redux-firebase";

import { compose } from "redux";

import { eventIcon } from "../../constants";
import NavBar from "../navigation/NavBar";
import { ListCard } from "../utils/Cards";
import { ConfirmationDialog, EventDialog } from "../utils/Dialogs";
import { Footer } from "../utils/Utlities";
import { deleteUser } from "../../store/actions/authActions";
import {
  createEvent,
  deleteEvent,
  editEvent
} from "../../store/actions/eventActions";
import { enqueueSnackbar } from "../../store/actions/notificationActions";

class Admin extends Component {
  state = {
    currentEvent: null,
    currentEventID: null,
    currentUser: null,
    showDeleteEventDialog: false,
    showDeleteUserDialog: false,
    showEventDialog: false
  };

  showEventDialog = event => {
    if (event) {
      const selectedEvent = { ...event };
      const eventID = selectedEvent.id;
      delete selectedEvent["id"];
      this.setState({
        showEventDialog: true,
        currentEvent: selectedEvent,
        currentEventID: eventID
      });
    } else {
      this.setState({
        showEventDialog: true,
        currentEvent: null,
        currentEventID: null
      });
    }
  };

  hideEventDialog = (event, eventID) => {
    if (event) {
      eventID
        ? this.props.editEvent(event, eventID)
        : this.props.createEvent(event);
    }
    this.setState({
      showEventDialog: false,
      currentEvent: null,
      currentEventID: null
    });
  };

  showDeleteEventDialog = event => {
    this.setState({ showDeleteEventDialog: true, currentEvent: event });
  };

  onDeleteEvent = () => {
    this.props.deleteEvent(this.state.currentEvent.id);
    this.hideDeleteEventDialog();
  };

  hideDeleteEventDialog = () => {
    this.setState({ showDeleteEventDialog: false, currentEvent: null });
  };

  showDeleteUserDialog = user => {
    this.setState({ showDeleteUserDialog: true, currentUser: user });
  };

  onDeleteUser = () => {
    this.props.deleteUser(this.state.currentUser.id);
    this.hideDeleteUserDialog();
  };

  hideDeleteUserDialog = () => {
    this.setState({ showDeleteUserDialog: false, currentUser: null });
  };

  renderEventItem = event => {
    return (
      <ListItem key={event.id} style={{ paddingRight: 48 * 2 }}>
        <ListItemAvatar>
          <Avatar>{eventIcon(event.type)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={event.title} secondary={event.location} />
        <ListItemSecondaryAction>
          <Box>
            <IconButton
              onClick={() => this.showEventDialog(event)}
              edge="start"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => this.showDeleteEventDialog(event)}
              edge="end"
            >
              <Delete />
            </IconButton>
          </Box>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  renderMemberItem = member => {
    return (
      <ListItem key={member.id}>
        <ListItemAvatar>
          <Avatar src={member.profilePicture}>{member.initials}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={`${member.firstName}  ${member.lastName}`} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={() => this.showDeleteUserDialog(member)}
          >
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    const { auth, profile, events, mentees, mentors, organizers } = this.props;
    if (!auth.uid || !profile.admin) return <Redirect to="/signin"></Redirect>;
    const {
      showEventDialog,
      showDeleteEventDialog,
      showDeleteUserDialog
    } = this.state;
    return (
      <Fragment>
        <NavBar />
        <Box p={4}>
          <Container maxWidth="md">
            <Grid
              container
              direction="column"
              spacing={4}
              justify="space-around"
            >
              <Grid item>
                <ListCard
                  title="Mentees"
                  list={mentees}
                  emptyListText="No mentee profiles exist"
                  renderListItem={this.renderMemberItem}
                />
              </Grid>
              <Grid item>
                <ListCard
                  title="Mentors"
                  list={mentors}
                  emptyListText="No mentor profiles exist"
                  renderListItem={this.renderMemberItem}
                />
              </Grid>
              <Grid item>
                <ListCard
                  title="Organizers"
                  list={organizers}
                  emptyListText="No organizer profiles exist"
                  renderListItem={this.renderMemberItem}
                />
              </Grid>

              <Grid item>
                <ListCard
                  title="Events"
                  list={events}
                  emptyListText="No events exist"
                  renderListItem={this.renderEventItem}
                  footer={
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => this.showEventDialog(null)}
                    >
                      Create Event
                    </Button>
                  }
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
        <EventDialog
          open={showEventDialog}
          onClose={this.hideEventDialog}
          event={this.state.currentEvent}
          eventID={this.state.currentEventID}
        />
        <ConfirmationDialog
          open={showDeleteEventDialog}
          onConfirm={this.onDeleteEvent}
          onDismiss={this.hideDeleteEventDialog}
          title="Delete Event"
          message="Are you sure you want to delete this event?"
        />
        <ConfirmationDialog
          open={showDeleteUserDialog}
          onConfirm={this.onDeleteUser}
          onDismiss={this.hideDeleteUserDialog}
          title="Delete User"
          message="Are you sure you want to delete this user?"
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const users = state.firestore.ordered.users || [];
  return {
    auth: state.firebase.auth,
    events: state.firestore.ordered.events,
    mentors: users.filter(member => member.role === "Mentor"),
    mentees: users.filter(member => member.role === "Mentee"),
    organizers: users.filter(member => member.role === "Organizer"),
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteUser: uid => dispatch(deleteUser(uid)),
    createEvent: event => dispatch(createEvent(event)),
    deleteEvent: eventID => dispatch(deleteEvent(eventID)),
    editEvent: (event, eventID) => dispatch(editEvent(event, eventID)),
    enqueueSnackBar: test => dispatch(enqueueSnackbar(test))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "events",
      orderBy: ["time", "asc"]
    },
    { collection: "users" }
  ])
)(Admin);
