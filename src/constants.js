import React from "react";
import {
  Slideshow,
  Work,
  School,
  Group,
  Code,
  BugReport
} from "@material-ui/icons";
import {
  faGlobe,
  faGamepad,
  faRobot,
  faDesktop,
  faBug
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";
import DateUtils from "@date-io/date-fns";

const events = {
  demo: <Slideshow />,
  hacknight: <Code />,
  meeting: <Work />,
  social: <Group />,
  workshop: <School />
};

const skills = {
  Web: faGlobe,
  IOS: faApple,
  Android: faAndroid,
  Gaming: faGamepad,
  "Machine Learning": faRobot,
  Desktop: faDesktop
};

const weekdaysStr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const dateUtils = new DateUtils();
const convertTimestamp = timestamp => {
  const dateTime = dateUtils.date(timestamp.toDate());
  const weekday = weekdaysStr[dateTime.getDay()],
    date = dateUtils.format(dateTime, dateUtils.dateFormat),
    year = dateUtils.getYear(dateTime),
    time = dateUtils.format(dateTime, dateUtils.time12hFormat);
  return `${weekday}, ${date}, ${year} @ ${time}`;
};

export const weekdays = weekdaysStr;
export const timestampString = convertTimestamp;

export const skillTypes = Object.keys(skills);
export const skillIcon = skillType => skills[skillType] ?? faBug;

export const eventTypes = Object.keys(events).sort();
export const eventIcon = eventType => events[eventType] ?? <BugReport />;
