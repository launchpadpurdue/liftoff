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
import { isLoaded, firestoreConnect } from "react-redux-firebase";
import Loading from "./Loading";
import { compose } from "redux";
import {
  Delete,
  Edit,
  Work,
  School,
  Code,
  Slideshow,
  Group,
  BugReport,
  Add
} from "@material-ui/icons";
import { ListCard } from "../utils/Cards";
import { deleteUser } from "../../store/actions/authActions";
import { EventDialog } from "../utils/Dialogs";
import { createEvent, deleteEvent } from "../../store/actions/eventActions";

class Admin extends Component {
  state = { showEventDialog: false, currentEvent: null };

  hideEventDialog = result => {
    if (result) this.props.createEvent(result);
    this.setState({ showEventDialog: false, currentEvent: null });
  };

  showEventDialog = event => {
    this.setState({ showEventDialog: true, currentEvent: event });
  };

  mapEventToIcon = eventType => {
    switch (eventType) {
      case "meeting":
        return <Work />;
      case "workshop":
        return <School />;
      case "hacknight":
        return <Code />;
      case "demo":
        return <Slideshow />;
      case "social":
        return <Group />;
      default:
        return <BugReport />;
    }
  };

  renderEventItem = event => {
    return (
      <ListItem key={event.id}>
        <ListItemAvatar>
          <Avatar>{this.mapEventToIcon(event.type)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={event.title} secondary={event.location} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => this.showEventDialog(event)}>
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => this.props.deleteEvent(event.id)}
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
          <IconButton
            edge="end"
            onClick={() => this.props.deleteUser(member.id)}
          >
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    const { auth, profile, events, mentees, mentors, organizers } = this.props;
    if (!isLoaded(profile)) return <Loading />;
    if (!auth.uid || !profile.admin) return <Redirect to="/signin"></Redirect>;
    const { showEventDialog } = this.state;
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
    deleteEvent: eventID => dispatch(deleteEvent(eventID))
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
