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

const events = {
  demo: <Slideshow />,
  hacknight: <Code />,
  meeting: <Work />,
  social: <Group />,
  workshop: <School />
};

// const skills = ["Web", "IOS", "Android", "Gaming", "Machine Learning", "Other"];
const skills = {
  Web: faGlobe,
  IOS: faApple,
  Android: faAndroid,
  Gaming: faGamepad,
  "Machine Learning": faRobot,
  Desktop: faDesktop
};

export const skillTypes = Object.keys(skills);
export const skillIcon = skillType => skills[skillType] ?? faBug;

export const eventTypes = Object.keys(events).sort();
export const eventIcon = eventType => events[eventType] ?? <BugReport />;
