import React from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Material UI Imports
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  Divider,
  Chip
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

// FontAwesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAndroid, faApple } from "@fortawesome/free-brands-svg-icons";
import {
  faBug,
  faDesktop,
  faGamepad,
  faGlobe,
  faRobot
} from "@fortawesome/free-solid-svg-icons";

const cardStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "100%" // 1:1
  },
  cardContent: {
    flexGrow: 1
  }
}));

const profileStyles = makeStyles(theme => ({
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

function MemberCard(props) {
  const classes = cardStyles();
  const { member } = props;
  const { firstName, lastName, profilePicture, skills, id } = member;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={profilePicture}
          title={`${firstName} ${lastName} Picture`}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {`${firstName} ${lastName}`}
          </Typography>
          <Grid container spacing={1}>
            {skills.map(skill => (
              <Grid item key={skill}>
                <FontAwesomeIcon
                  icon={mapSkillToIcon(skill)}
                  fixedWidth
                  size="lg"
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            component={Link}
            to={`/profile/${id}`}
          >
            View Profile
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

function ProfileCard(props) {
  const classes = profileStyles();
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

function SkeletonCard() {
  const classes = cardStyles();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <Skeleton variant="rect" className={classes.cardMedia} />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            <Skeleton variant="text" animation="wave" />
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Skeleton
                variant="circle"
                width={32}
                height={32}
                animation="wave"
              />
            </Grid>
            <Grid item>
              <Skeleton
                variant="circle"
                width={32}
                height={32}
                animation="wave"
              />
            </Grid>
            <Grid item>
              <Skeleton
                variant="circle"
                width={32}
                height={32}
                animation="wave"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Skeleton width="40%" animation="wave" />
        </CardActions>
      </Card>
    </Grid>
  );
}

export { MemberCard, ProfileCard, SkeletonCard };
