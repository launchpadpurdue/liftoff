import React, { Component, Fragment } from "react";
import NavBar from "../navigation/NavBar";
import { Footer } from "../utils/Utlities";
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
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Add, Delete, Edit } from "@material-ui/icons";
import { ListCard } from "../utils/Cards";
import { deleteUser } from "../../store/actions/authActions";
import { ConfirmDialog, EventDialog } from "../utils/Dialogs";
import {
  createEvent,
  deleteEvent,
  editEvent
} from "../../store/actions/eventActions";
import { eventIcon } from "../../constants";

class Admin extends Component {
  state = {
    currentEvent: null,
    currentUser: null,
    showDeleteEventDialog: false,
    showDeleteUserDialog: false,
    showEventDialog: false
  };

  showEventDialog = event => {
    this.setState({ showEventDialog: true, currentEvent: event });
  };

  hideEventDialog = (event, eventID) => {
    if (event) {
      if (eventID) this.props.editEvent(event, eventID);
      else this.props.createEvent(event);
    }
    this.setState({ showEventDialog: false, currentEvent: null });
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
      <ListItem key={event.id}>
        <ListItemAvatar>
          <Avatar>{eventIcon(event.type)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={event.title} secondary={event.location} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => this.showEventDialog(event)}>
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => this.showDeleteEventDialog(event)}
            edge="end"
          >
            <Delete />
          </IconButton>
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
          <IconButton edge="end" onClick={this.showDeleteUserDialog}>
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
        {showEventDialog && (
          <EventDialog
            open={showEventDialog}
            onClose={this.hideEventDialog}
            event={this.state.currentEvent}
          />
        )}
        <ConfirmDialog
          open={showDeleteEventDialog}
          onConfirm={this.onDeleteEvent}
          onDismiss={this.hideDeleteEventDialog}
          title="Delete Event"
          message="Are you sure you want to delete this event?"
        />
        <ConfirmDialog
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
    editEvent: (event, eventID) => dispatch(editEvent(event, eventID))
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
