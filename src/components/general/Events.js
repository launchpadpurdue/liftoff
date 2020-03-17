import React, { Component, Fragment } from "react";
import NavBar from "../navigation/NavBar";
import { Flag } from "@material-ui/icons";
import {
  VerticalTimelineElement,
  VerticalTimeline
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Footer, Header } from "../utils/Utlities";
import { withStyles, useTheme, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { eventIcon, timestampString } from "../../constants";

const styles = theme => ({
  paper: {
    "&:before": { background: theme.palette.grey[500] },
    "& .vertical-timeline-element-icon": {
      boxShadow: `0 0 0 4px ${theme.palette.grey[500]},inset 0 2px 0 rgba(0,0,0,.08),0 3px 0 4px rgba(0,0,0,.05)`
    }
  }
});

function TimelineElement(props) {
  const theme = useTheme();
  const { children, eventType } = props;
  const event = {
    icon: eventIcon(eventType),
    iconStyle: { background: theme.palette.primary.main, color: "#fff" }
  };
  if (!children) return <VerticalTimelineElement {...event} {...props} />;
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1]
      }}
      contentArrowStyle={{ display: "none" }}
      {...event}
      {...props}
    />
  );
}

class Events extends Component {
  render() {
    const { auth, classes, events, profile } = this.props;
    if (!auth.uid || !profile.admin) return <Redirect to="/signin"></Redirect>;

    return (
      <Fragment>
        <NavBar />
        <Header>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            LaunchPad {new Date().getFullYear()} Events
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Something short and leading about the collection below—its contents,
            the creator, etc. Make it short and sweet, but not too short so
            folks don&apos;t simply skip over it entirely.
          </Typography>
        </Header>
        <VerticalTimeline className={classes.paper}>
          {events.map(event => {
            return (
              <TimelineElement
                key={event.id}
                date={timestampString(event.time)}
                eventType={event.type}
              >
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="subtitle2">{event.location} (Lasts {event.duration} minutes)</Typography>
                <Typography variant="body2" >{event.description}</Typography>
              </TimelineElement>
            );
          })}
          <TimelineElement
            iconStyle={{ background: "green", color: "#fff" }}
            icon={<Flag />}
            noCard
          />
        </VerticalTimeline>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    events: state.firestore.ordered.events ?? [],
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "events",
      orderBy: ["time", "asc"]
    }
  ])
)(withStyles(styles)(Events));
