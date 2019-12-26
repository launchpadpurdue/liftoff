import React, { Component, Fragment } from "react";

import NavBar from "../navigation/NavBar";
import { connect } from "react-redux";
import {
  withStyles,
  Paper,
  Container,
  Grid,
  ButtonBase,
  Typography,
  Chip,
  Divider
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faDesktop,
  faGamepad
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faAndroid } from "@fortawesome/free-brands-svg-icons";

const styles = theme => ({
  heroContent: {
    height: "100vh",
    backgroundColor: theme.palette.background.paper
  },
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
    width: "100%",
    height: "auto",
    borderColor: theme.palette.primary.main,
    borderRadius: "50%",
    objectFit: "contain"
  },
  profileInfo: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(2)
    }
  },
  skill: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1)
  }
});

function mapSkillToIcon(skill) {
  switch (skill) {
    case "Android":
      return faAndroid;
    case "IOS":
      return faApple;
    case "ML":
      return faBrain;
    case "Gaming":
      return faGamepad;
    case "Web":
      return faDesktop;
  }
}

const skills = ["Android", "IOS", "ML", "Gaming", "Web"];

class Profile extends Component {
  render() {
    const { classes, auth, profile } = this.props;
    if (!auth.uid) return <Redirect to="/signin"></Redirect>;
    console.log(classes.skill);
    return (
      <Fragment>
        <NavBar />
        <main className={classes.layout}>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <Grid container direction="row">
                <Grid item sm={3} xs={12}>
                  <ButtonBase className={classes.image}>
                    <img
                      border={5}
                      className={classes.image}
                      alt="avatar"
                      src={profile.profilePicture}
                    />
                  </ButtonBase>
                </Grid>
                <Grid item className={classes.profileInfo} xs>
                  <Typography variant="h3" color="textPrimary" gutterBottom>
                    {profile.firstName + " " + profile.lastName}
                  </Typography>
                  <Divider></Divider>
                  <Grid item container direction="column">
                    <Typography variant="h6">Skills</Typography>
                    <Grid item container direction="row">
                      {skills.map(skill => (
                        <Chip
                          className={classes.skill}
                          icon={
                            <FontAwesomeIcon icon={mapSkillToIcon(skill)} />
                          }
                          label={skill}
                          clickable
                          color="secondary"
                        />
                      ))}
                    </Grid>
                    <Typography variant="h6">Description</Typography>
                    <Typography variant="body1">
                      {profile.description}
                    </Typography>
                  </Grid>
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
