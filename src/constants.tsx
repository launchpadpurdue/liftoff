import { OptionsObject } from 'notistack';
import React, { Key, ReactNode } from 'react';

import DateUtils from '@date-io/date-fns';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import {
    faBug, faDesktop, faGamepad, faGlobe, faRobot, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { BugReport, Code, Group, School, Slideshow, Work } from '@material-ui/icons';

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

export interface Preferences {
  theme: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: string;
  description: string;
  profilePicture: string;
  skills: Array<string>;
  preferences: Preferences;
}

export interface MemberQuery {
  name: string;
  skills: Array<string>;
}

export const filterMembers = (
  members: Array<Member>,
  query: MemberQuery
): Array<Member> => {
  if (!members) return [];
  if (!query) return members;
  return members.filter((member: Member) => {
    const memberName = (member.firstName + member.lastName)
      .replace(/\s/g, "")
      .toLowerCase();
    const matchesName = memberName.includes(query.name);
    if (query.skills.length === 0) return matchesName;
    for (const skill of query.skills) {
      if (member.skills.includes(skill)) {
        return matchesName;
      }
    }
    return false;
  });
};

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const DEFAULT_SNACKBAR = {
  variant: "default",
  autoHideDuration: 3000
};
export const SnackbarVariants = {
  DEFAULT: DEFAULT_SNACKBAR,
  SUCCESS: { ...DEFAULT_SNACKBAR, variant: "success" },
  ERROR: { ...DEFAULT_SNACKBAR, variant: "error" },
  WARNING: { ...DEFAULT_SNACKBAR, variant: "warning" },
  INFO: { ...DEFAULT_SNACKBAR, variant: "info" }
};

export type Notification = {
  key: Key;
  message: ReactNode;
  options: OptionsObject;
  dismissed: Boolean;
};
