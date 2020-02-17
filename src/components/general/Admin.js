import React, { Component, Fragment } from "react";
import NavBar from "../navigation/NavBar";
import { Footer } from "../utils/Utlities";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListItemAvatar,
  Avatar,
  Paper,
  Grid,
  Box,
  Divider,
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

class Admin extends Component {
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

  render() {
    const { auth, profile, events, mentees, mentors, organizers } = this.props;
    if (!isLoaded(profile)) return <Loading />;
    if (!auth.uid || !profile.admin) return <Redirect to="/signin"></Redirect>;
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
                <Paper>
                  <Box py={2} px={4}>
                    <Typography variant="h5">Mentees</Typography>
                  </Box>
                  <Divider />
                  <Box px={2}>
                    {mentees.length > 0 && (
                      <List>
                        {mentees.map(mentee => (
                          <ListItem key={mentee.id}>
                            <ListItemAvatar>
                              <Avatar src={mentee.profilePicture}>
                                {mentee.initials}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${mentee.firstName}  ${mentee.lastName}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end">
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {mentees.length === 0 && (
                      <Box py={2}>
                        <Typography variant="body1" align="center">
                          No mentee profiles exist
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item>
                <Paper>
                  <Box py={2} px={4}>
                    <Typography variant="h5">Mentors</Typography>
                  </Box>
                  <Divider />
                  <Box px={2}>
                    {mentors.length > 0 && (
                      <List>
                        {mentors.map(mentor => (
                          <ListItem key={mentor.id}>
                            <ListItemAvatar>
                              <Avatar src={mentor.profilePicture}>
                                {mentor.initials}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${mentor.firstName}  ${mentor.lastName}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end">
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {mentors.length === 0 && (
                      <Box py={2}>
                        <Typography variant="body1" align="center">
                          No mentor profiles exist
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item>
                <Paper>
                  <Box py={2} px={4}>
                    <Typography variant="h5">Organizers</Typography>
                  </Box>
                  <Divider />
                  <Box px={2}>
                    {organizers.length > 0 && (
                      <List>
                        {organizers.map(organizer => (
                          <ListItem key={organizer.id}>
                            <ListItemAvatar>
                              <Avatar src={organizer.profilePicture}>
                                {organizer.initials}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${organizer.firstName}  ${organizer.lastName}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end">
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {organizers.length === 0 && (
                      <Box py={2}>
                        <Typography variant="body1" align="center">
                          No organizer profiles exist
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item>
                <Paper>
                  <Box py={2} px={4}>
                    <Typography variant="h5">Events</Typography>
                  </Box>
                  <Divider />
                  <Box px={2}>
                    {events.length > 0 && (
                      <List>
                        {events.map(event => (
                          <ListItem key={event.id}>
                            <ListItemAvatar>
                              <Avatar>{this.mapEventToIcon(event.type)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={event.title}
                              secondary={event.location}
                            />
                            <ListItemSecondaryAction>
                              <IconButton>
                                <Edit />
                              </IconButton>
                              <IconButton edge="end">
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {events.length === 0 && (
                      <Box py={2}>
                        <Typography variant="body1" align="center">
                          No events profiles exist
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Divider />
                  <Box py={2} display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                    >
                      Create Event
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
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

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "events",
      orderBy: ["time", "asc"]
    },
    { collection: "users" }
  ])
)(Admin);
