import React, { Component, Fragment } from "react";
import NavBar from "../navigation/NavBar";
import Loading from "./Loading";
import { Code, School, Work, Slideshow, Group, Flag } from "@material-ui/icons";
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
import { firestoreConnect, isLoaded } from "react-redux-firebase";

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
  let event;
  switch (eventType) {
    case "meeting":
      event = {
        icon: <Work />,
        iconStyle: { background: theme.palette.primary.main, color: "#fff" }
      };
      break;
    case "workshop":
      event = {
        icon: <School />,
        iconStyle: { background: theme.palette.primary.main, color: "#fff" }
      };
      break;
    case "hacknight":
      event = {
        icon: <Code />,
        iconStyle: { background: theme.palette.primary.main, color: "#fff" }
      };
      break;
    case "demo":
      event = {
        icon: <Slideshow />,
        iconStyle: { background: theme.palette.primary.main, color: "#fff" }
      };
      break;
    case "social":
      event = {
        icon: <Group />,
        iconStyle: { background: theme.palette.primary.main, color: "#fff" }
      };
      break;
    default:
      event = {};
  }
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

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

class Events extends Component {
  timestampToDate = (timestamp, duration) => {
    const startTime = timestamp.toDate();
    // endTime = new Date(startTime.getTime() + duration * 60000);
    let dateString = `${
      days[startTime.getDay()]
    }, ${startTime.getMonth()}/${startTime.getDate()}/${startTime.getFullYear()} @ ${startTime.getHours()}`;
    return dateString;
  };

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
                date={this.timestampToDate(event.time)}
                eventType={event.type}
              >
                <h3>{event.title}</h3>
                <h4>{event.location}</h4>
                <p>{event.description}</p>
              </TimelineElement>
            );
          })}
          {/* <TimelineElement date="2011 - present" eventType="social">
            <h3 className="vertical-timeline-element-title">
              Creative Director
            </h3>
            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
            <p>
              Creative Direction, User Experience, Visual Design, Project
              Management, Team Leading
            </p>
          </TimelineElement>
          <TimelineElement date="2010 - 2011" eventType="hacknight">
            <h3 className="vertical-timeline-element-title">Art Director</h3>
            <h4 className="vertical-timeline-element-subtitle">
              San Francisco, CA
            </h4>
            <p>
              Creative Direction, User Experience, Visual Design, SEO, Online
              Marketing
            </p>
          </TimelineElement>
          <TimelineElement date="2008 - 2010" eventType="demo">
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Los Angeles, CA
            </h4>
            <p>User Experience, Visual Design</p>
          </TimelineElement>
          <TimelineElement date="2006 - 2008" eventType="meeting">
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">
              San Francisco, CA
            </h4>
            <p>User Experience, Visual Design</p>
          </TimelineElement>
          <TimelineElement date="April 2013" eventType="workshop">
            <h3 className="vertical-timeline-element-title">
              Content Marketing for Web, Mobile and Social Media
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Online Course
            </h4>
            <p>Strategy, Social Media</p>
          </TimelineElement>
          <TimelineElement date="November 2012" eventType="workshop">
            <h3 className="vertical-timeline-element-title">
              Agile Development Scrum Master
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Certification
            </h4>
            <p>Creative Direction, User Experience, Visual Design</p>
          </TimelineElement>
          <TimelineElement
            date="January 20, 2020 @ 6:00-8:00 pm"
            eventType="workshop"
          >
            <h3 className="vertical-timeline-element-title">
              Bachelor of Science in Interactive Digital Media Visual Imaging
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Bachelor Degree
            </h4>
            <p>Creative Direction, Visual Design</p>
          </TimelineElement>*/}
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
  console.log(state.firestore);
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
