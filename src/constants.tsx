import DateUtils from "@date-io/date-fns";

import {
  faGlobe,
  faGamepad,
  faRobot,
  faDesktop,
  faBug,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";

import {
  Slideshow,
  Work,
  School,
  Group,
  Code,
  BugReport
} from "@material-ui/icons";

import React from "react";

export type FixMeLater = any;

const events: Record<string, JSX.Element> = {
  demo: <Slideshow />,
  hacknight: <Code />,
  meeting: <Work />,
  social: <Group />,
  workshop: <School />
};

const skills: Record<string, IconDefinition> = {
  Web: faGlobe,
  IOS: faApple,
  Android: faAndroid,
  Gaming: faGamepad,
  "Machine Learning": faRobot,
  Desktop: faDesktop
};

const dateUtils: DateUtils = new DateUtils();

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  description: string;
  profilePicture: string;
  role: string;
  skills: Array<string>;
  preferences: FixMeLater;
}

export const weekdays: Array<string> = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const timestampString = (
  timestamp: firebase.firestore.Timestamp
): string => {
  const dateTime: Date = dateUtils.date(timestamp.toDate());
  const weekday: string = weekdays[dateTime.getDay()];
  const date: string = dateUtils.format(dateTime, dateUtils.dateFormat);
  const year: number = dateUtils.getYear(dateTime);
  const time: string = dateUtils.format(dateTime, dateUtils.time12hFormat);
  return `${weekday}, ${date}, ${year} @ ${time}`;
};

export const skillTypes: Array<string> = Object.keys(skills);
export const skillIcon = (skillType: string): IconDefinition =>
  skills[skillType] ?? faBug;

export const eventTypes: Array<string> = Object.keys(events).sort();
export const eventIcon = (eventType: string): JSX.Element =>
  events[eventType] ?? <BugReport />;
