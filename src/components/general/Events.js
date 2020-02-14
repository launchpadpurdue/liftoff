import React, { Component, Fragment } from "react";
import NavBar from "../navigation/NavBar";
import {
  Code,
  Star,
  School,
  Work,
  Slideshow,
  Group,
  Flag
} from "@material-ui/icons";
import {
  VerticalTimelineElement,
  VerticalTimeline
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Footer } from "../utils/Utlities";
import { withStyles, useTheme } from "@material-ui/core";

const styles = theme => ({
  paper: {
    "&:before": { background: theme.palette.grey[500] },
    "& .vertical-timeline-element-icon": {
      boxShadow: `0 0 0 4px ${theme.palette.grey[500]},inset 0 2px 0 rgba(0,0,0,.08),0 3px 0 4px rgba(0,0,0,.05)`
    }
  }
});

const TimelineElement = React.forwardRef((props, ref) => {
  const theme = useTheme();
  return (
    <VerticalTimelineElement
      contentStyle={
        !props.noCard
          ? {
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[1]
            }
          : {}
      }
      contentArrowStyle={{ display: "none" }}
      innerRef={ref}
      {...props}
    />
  );
});

class Events extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <NavBar />
        <VerticalTimeline className={classes.paper}>
          <TimelineElement
            date="2011 - present"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<Group />}
          >
            <h3 className="vertical-timeline-element-title">
              Creative Director
            </h3>
            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
            <p>
              Creative Direction, User Experience, Visual Design, Project
              Management, Team Leading
            </p>
          </TimelineElement>
          <TimelineElement
            date="2010 - 2011"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<Code />}
          >
            <h3 className="vertical-timeline-element-title">Art Director</h3>
            <h4 className="vertical-timeline-element-subtitle">
              San Francisco, CA
            </h4>
            <p>
              Creative Direction, User Experience, Visual Design, SEO, Online
              Marketing
            </p>
          </TimelineElement>
          <TimelineElement
            date="2008 - 2010"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<Slideshow />}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Los Angeles, CA
            </h4>
            <p>User Experience, Visual Design</p>
          </TimelineElement>
          <TimelineElement
            date="2006 - 2008"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<Work />}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">
              San Francisco, CA
            </h4>
            <p>User Experience, Visual Design</p>
          </TimelineElement>
          <TimelineElement
            date="April 2013"
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<School />}
          >
            <h3 className="vertical-timeline-element-title">
              Content Marketing for Web, Mobile and Social Media
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Online Course
            </h4>
            <p>Strategy, Social Media</p>
          </TimelineElement>
          <TimelineElement
            date="November 2012"
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<School />}
          >
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
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<School />}
          >
            <h3 className="vertical-timeline-element-title">
              Bachelor of Science in Interactive Digital Media Visual Imaging
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Bachelor Degree
            </h4>
            <p>Creative Direction, Visual Design</p>
          </TimelineElement>
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

export default withStyles(styles)(Events);
