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
  Chip,
  Divider,
  Grid,
  makeStyles,
  Tooltip,
  Typography
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

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
  },
  chipLabel: { paddingRight: 0 },
  chipRoot: { maxHeight: 32 }
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

function renderIconChip(classes, skill) {
  return (
    <Grid item key={skill}>
      <Tooltip arrow title={skill}>
        <Chip
          color="secondary"
          classes={{ label: classes.chipLabel, root: classes.chipRoot }}
          icon={
            <FontAwesomeIcon
              fixedWidth
              icon={mapSkillToIcon(skill)}
              size="lg"
            />
          }
        ></Chip>
      </Tooltip>
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
          <Typography gutterBottom component="h2" variant="h5">
            {`${firstName} ${lastName}`}
          </Typography>
          <Grid container spacing={1}>
            {skills.sort().map(skill => renderIconChip(classes, skill))}
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            size="small"
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
    firstName,
    lastName,
    skills,
    description,
    profilePicture,
    role
  } = props.profile;
  if (description === "") description = "User has not added a description yet";
  if (profilePicture === "") profilePicture = "/profile.jpg";

  return (
    <Grid container>
      <Grid item xs={12} sm={3} container alignItems="center" justify="center">
        <img
          border={5}
          className={classes.image}
          alt="User"
          src={profilePicture}
        />
      </Grid>
      <Grid item className={classes.profile} xs>
        <Typography className={classes.name} variant="h3">
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
              {skills && skills.length ? (
                skills.sort().map(skill => renderChip(classes, skill))
              ) : (
                <Grid item>
                  <Typography variant="body1">
                    User has not listed any skills yet
                  </Typography>
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
        <Skeleton className={classes.cardMedia} variant="rect" />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom component="h2" variant="h5">
            <Skeleton animation="wave" variant="text" />
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Skeleton
                width={32}
                height={32}
                animation="wave"
                variant="circle"
              />
            </Grid>
            <Grid item>
              <Skeleton
                width={32}
                height={32}
                animation="wave"
                variant="circle"
              />
            </Grid>
            <Grid item>
              <Skeleton
                width={32}
                height={32}
                animation="wave"
                variant="circle"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Skeleton animation="wave" width="40%" />
        </CardActions>
      </Card>
    </Grid>
  );
}

export { MemberCard, ProfileCard, SkeletonCard };
