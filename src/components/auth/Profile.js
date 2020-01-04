import React, { Component, Fragment } from "react";
import { getFirebase } from "react-redux-firebase";

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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
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
import { Edit, DeleteForever, Lock, ExitToApp } from "@material-ui/icons";
import { signOut, deleteAccount } from "../../store/actions/authActions";

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

function mapReauthCode(code) {
  switch (code) {
    case "auth/wrong-password":
      return "Password is invalid for this account";
    default:
      return null;
  }
}

class Profile extends Component {
  state = {
    email: "",
    password: "",
    showPasswordReset: false,
    showDeleteAccount: false,
    reauthenticateError: ""
  };

  renderChip = skill => {
    const { classes } = this.props;
    return (
      <Grid item key={skill}>
        <Chip
          className={classes.skill}
          icon={<FontAwesomeIcon icon={mapSkillToIcon(skill)} />}
          label={skill}
          color="secondary"
        />
      </Grid>
    );
  };

  resetPassword = () => {
    let firebase = getFirebase().auth();
    firebase
      .sendPasswordResetEmail(firebase.currentUser.email)
      .then(() => this.setState({ showPasswordReset: true }));
  };

  hidePasswordReset = () => {
    this.setState({ showPasswordReset: false });
  };

  showDeleteAccount = () => {
    this.setState({ showDeleteAccount: true });
  };

  hideDeleteAccount = () => {
    this.setState({
      showDeleteAccount: false,
      email: "",
      password: "",
      reauthenticateError: ""
    });
  };

  onInput = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    if (this.state.email !== user.email) {
      this.setState({
        reauthenticateError: "Email does not match signed in account"
      });
      return;
    }
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.state.email,
      this.state.password
    );
    user
      .reauthenticateWithCredential(credential)
      .then(_ => this.props.deleteAccount())
      .catch(error =>
        this.setState({ reauthenticateError: mapReauthCode(error.code) })
      );
    // this.hideDeleteAccount();
  };

  render() {
    const { classes, auth, profile } = this.props;
    if (!auth.uid) return <Redirect to="/signin"></Redirect>;
    // Assign profile info
    let {
      firstName,
      lastName,
      skills,
      description,
      profilePicture,
      role
    } = profile;
    // Fill in missing values
    firstName = firstName ? firstName : "";
    lastName = lastName ? lastName : "";
    role = role ? role : "";
    skills = skills ? skills.sort() : [];
    description = description ? description : "No description";
    profilePicture = profilePicture ? profilePicture : "./profile.jpg";
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
                      <Typography variant="body1">Role: {role}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">Skills</Typography>
                      <Grid item container spacing={1}>
                        {skills.map(skill => this.renderChip(skill))}
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography variant="h6">Description</Typography>
                      <Typography variant="body1">{description}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Container>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    startIcon={<Edit />}
                  >
                    Edit Profile
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    startIcon={<Lock />}
                    onClick={this.resetPassword}
                  >
                    Reset Password
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    onClick={this.props.signOut}
                    startIcon={<ExitToApp />}
                  >
                    Sign Out
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="secondary"
                    onClick={this.showDeleteAccount}
                    fullWidth
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
        <Dialog
          open={this.state.showPasswordReset}
          onClose={this.hidePasswordReset}
        >
          <DialogTitle>Password Reset</DialogTitle>
          <DialogContent>
            <DialogContentText>
              An email to reset your password has been sent to {auth.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hidePasswordReset} color="primary" autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.showDeleteAccount}
          onClose={this.hideDeleteAccount}
        >
          <DialogTitle>Reauthenticate</DialogTitle>
          <DialogContent>
            <DialogContentText>
              In order to delete your account, please reauthenticate with your
              credentials
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              id="email"
              onChange={this.onInput}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              id="password"
              onChange={this.onInput}
            />
            {this.state.reauthenticateError && (
              <Typography variant="body1" gutterBottom color="error">
                {this.state.reauthenticateError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideDeleteAccount} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteAccount: () => dispatch(deleteAccount()),
    signOut: () => dispatch(signOut())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
