import React from "react";

// Material UI Imports
import { Chip, Divider, Grid, makeStyles, Typography } from "@material-ui/core";

// FontAwesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faDesktop,
  faGamepad,
  faGlobe,
  faRobot
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";

const useStyles = makeStyles(theme => ({
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  image: {
    borderColor: theme.palette.primary.main,
    borderRadius: "50%",
    objectFit: "contain",
    height: "auto",
    width: "75%",
    [theme.breakpoints.up("sm")]: {
      height: "auto",
      width: "100%"
    }
  },
  name: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  profile: {
    [theme.breakpoints.up("xs")]: {
      marginLeft: theme.spacing(2)
    }
  },
  skill: {
    padding: theme.spacing(1)
  }
}));

function mapSkillToIcon(skill) {
  switch (skill) {
    case "Android":
      return faAndroid;
    case "IOS":
      return faApple;
    case "Machine Learning":
      return faRobot;
    case "Gaming":
      return faGamepad;
    case "Desktop":
      return faDesktop;
    case "Web":
      return faGlobe;
    default:
      return faBug;
  }
}

function renderChip(classes, skill) {
  return (
    <Grid item key={skill}>
      <Chip
        className={classes.skill}
        color="secondary"
        icon={<FontAwesomeIcon icon={mapSkillToIcon(skill)} />}
        label={skill}
      />
    </Grid>
  );
}

function ProfileCard(props) {
  const classes = useStyles();
  let {
    firstName = "",
    lastName = "",
    skills = [],
    description = "User has not added a description",
    profilePicture = "./profile.jpg",
    role = ""
  } = props.profile;
  if (profilePicture === "") profilePicture = "./profile.jpg";
  if (description === "")
    description = `${firstName} ${lastName} has not added a description yet`;

  return (
    <Grid container>
      <Grid item sm={3} xs={12} container justify="center" alignItems="center">
        <img
          border={5}
          className={classes.image}
          alt="avatar"
          src={profilePicture}
        />
      </Grid>
      <Grid item className={classes.profile} xs>
        <Typography variant="h3" className={classes.name}>
          {`${firstName} ${lastName}`}
        </Typography>
        <Divider className={classes.divider} />
        <Grid item container direction="column" spacing={1}>
          <Grid item container alignItems="center">
            <Typography variant="h6">{role}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Skills</Typography>
            <Grid item container spacing={1}>
              {skills.length ? (
                skills.sort().map(skill => renderChip(classes, skill))
              ) : (
                <Grid item>
                  <Typography variant="body1">{`${firstName} ${lastName} has not listed any skills yet`}</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">{description}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfileCard;
