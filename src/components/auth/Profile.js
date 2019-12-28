import React, { Component, Fragment } from "react";

import NavBar from "../navigation/NavBar";
import { connect } from "react-redux";
import {
  withStyles,
  Paper,
  Container,
  Grid,
  Typography,
  Chip,
  Divider,
  Button
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faGamepad,
  faBug,
  faRobot,
  faGlobe
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";
import { Edit, DeleteForever, Lock } from "@material-ui/icons";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      padding: theme.spacing(3)
    }
  },
  image: {
    width: "75%",
    height: "auto",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      height: "auto"
    },
    borderColor: theme.palette.primary.main,
    borderRadius: "50%",
    objectFit: "contain"
  },
  edit: { position: "absolute", top: 0 },
  profile: {
    [theme.breakpoints.up("xs")]: {
      marginLeft: theme.spacing(2)
    }
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  name: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  skill: {
    padding: theme.spacing(1)
  }
});

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

const skills = [
  "Android",
  "IOS",
  "Web",
  "Desktop",
  "Machine Learning",
  "Gaming"
];

class Profile extends Component {
  renderChip = skill => {
    const { classes } = this.props;
    return (
      <Chip
        key={skill}
        className={classes.skill}
        icon={<FontAwesomeIcon icon={mapSkillToIcon(skill)} />}
        label={skill}
        color="secondary"
      />
    );
  };

  render() {
    const { classes, auth, profile } = this.props;
    if (!auth.uid) return <Redirect to="/signin"></Redirect>;
    return (
      <Fragment>
        <NavBar />
        <main className={classes.layout}>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <Grid container>
                <Grid
                  item
                  sm={3}
                  xs={12}
                  container
                  justify="center"
                  alignItems="center"
                >
                  <img
                    border={5}
                    className={classes.image}
                    alt="avatar"
                    src={profile.profilePicture}
                  />
                </Grid>
                <Grid item className={classes.profile} xs>
                  <Typography variant="h3" className={classes.name}>
                    {profile.firstName + " " + profile.lastName}
                  </Typography>
                  <Divider className={classes.divider} />
                  <Grid item container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h6">Skills</Typography>{" "}
                      <Grid item container spacing={1}>
                        {skills.map(skill => (
                          <Grid item>{this.renderChip(skill)}</Grid>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography variant="h6">Description</Typography>{" "}
                      <Typography variant="body1">
                        {profile.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Container>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    startIcon={<Edit />}
                  >
                    Edit Profile
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<Lock />}
                  >
                    Reset Password
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<DeleteForever />}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </main>
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  return { auth: state.firebase.auth, profile: state.firebase.profile };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
