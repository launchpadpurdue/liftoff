import React, { Fragment } from "react";
import NavBar from "../navigation/NavBar";
import { Flag } from "@material-ui/icons";
import {
  VerticalTimelineElement,
  VerticalTimeline
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Footer, Header } from "../utils/Utlities";
import {
  withStyles,
  useTheme,
  Typography,
  Grid,
  makeStyles
} from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { eventIcon, formatTimestamp } from "../../constants";
import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const useStyles = makeStyles(theme => ({
  noEvents: {
    padding: theme.spacing(8, 4, 8, 4)
  }
}));

function Events(props) {
  const { auth, events } = props;
  const classes = useStyles();

  if (!auth.uid) return <Redirect to="/signin"></Redirect>;
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
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Something short and leading about the collection below—its contents,
          the creator, etc. Make it short and sweet, but not too short so folks
          don&apos;t simply skip over it entirely.
        </Typography>
      </Header>
      {events.length > 0 && (
        <VerticalTimeline>
          {events.map(event => (
            <TimelineElement
              key={event.id}
              date={formatTimestamp(event.time)}
              eventType={event.type}
            >
              <Typography variant="h6">{event.title}</Typography>
              <Typography variant="subtitle2">
                {event.location} (Lasts {event.duration} minutes)
              </Typography>
              <Typography variant="body2">{event.description}</Typography>
            </TimelineElement>
          ))}
          <TimelineElement
            iconStyle={{ background: "green", color: "#fff" }}
            icon={<Flag />}
            noCard
          />
        </VerticalTimeline>
      )}
      {events.length === 0 && (
        <Grid
          className={classes.noEvents}
          container
          align="center"
          direction="column"
          justify="center"
          spacing={4}
        >
          <Grid item>
            <FontAwesomeIcon icon={faHourglassHalf} size="10x" />
          </Grid>
          <Grid item>
            <Typography
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Come back soon!
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" align="center">
              No events have been posted yet, but come back soon to view them!
            </Typography>
          </Grid>
        </Grid>
      )}
      <Footer />
    </Fragment>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    events: state.firestore.ordered.events ?? []
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
