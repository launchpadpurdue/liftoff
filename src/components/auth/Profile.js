import React, { Component, Fragment } from "react";

// React Router Imports
import { Redirect } from "react-router-dom";

// Material UI Imports
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  withStyles
} from "@material-ui/core";
import { DeleteForever, Edit, ExitToApp, Lock } from "@material-ui/icons";

// Redux Imports
import { connect } from "react-redux";
import { getFirebase } from "react-redux-firebase";
import { signOut, updateProfile } from "../../store/actions/authActions";
import { setTheme } from "../../store/actions/preferenceActions";

// Local Imports
import {
  AlertDialog,
  DeleteAccountDialog,
  EditProfileDialog
} from "../utils/Dialogs";
import NavBar from "../navigation/NavBar";
import { ProfileCard } from "../utils/Cards";

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
  }
});

class Profile extends Component {
  state = {
    showDeleteAccount: false,
    showEditProfile: false,
    showPasswordReset: false
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
      showDeleteAccount: false
    });
  };

  showEditProfile = () => {
    this.setState({
      showEditProfile: true
    });
  };

  hideEditProfile = profile => {
    if (profile) this.props.updateProfile(this.props.auth.uid, profile);
    this.setState({ showEditProfile: false });
  };

  setTheme = event => {
    if (this.props.profile.preferences.theme !== event.target.value) {
      this.props.setTheme(event.target.value);
    }
  };

  render() {
    const { classes, auth, profile } = this.props;
    if (!auth.uid) return <Redirect to="/signin"></Redirect>;

    const { preferences = { theme: "light" } } = profile;
    return (
      <Fragment>
        <NavBar />
        <main>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <ProfileCard profile={profile} />
            </Paper>
          </Container>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel id="theme-select">Theme Type</InputLabel>
                    <Select
                      labelId="theme-select"
                      value={preferences.theme}
                      onChange={this.setTheme}
                    >
                      <MenuItem value={"light"}>Light</MenuItem>
                      <MenuItem value={"dark"}>Dark</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Container>
          <Container maxWidth="lg">
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="primary"
                    fullWidth
                    onClick={this.showEditProfile}
                    startIcon={<Edit />}
                    variant="contained"
                  >
                    Edit Profile
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="primary"
                    fullWidth
                    onClick={this.resetPassword}
                    startIcon={<Lock />}
                    variant="contained"
                  >
                    Reset Password
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="primary"
                    fullWidth
                    onClick={this.props.signOut}
                    startIcon={<ExitToApp />}
                    variant="contained"
                  >
                    Sign Out
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    color="secondary"
                    fullWidth
                    onClick={this.showDeleteAccount}
                    startIcon={<DeleteForever />}
                    variant="contained"
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </main>
        {profile.isLoaded && this.state.showEditProfile && (
          <EditProfileDialog
            open={this.state.showEditProfile}
            onClose={this.hideEditProfile}
            profile={profile}
          ></EditProfileDialog>
        )}
        <AlertDialog
          open={this.state.showPasswordReset}
          onClose={this.hidePasswordReset}
          title="Password Reset"
          message={` An email to reset your password has been sent to ${auth.email}`}
        />
        <DeleteAccountDialog
          open={this.state.showDeleteAccount}
          onClose={this.hideDeleteAccount}
        />
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
    setTheme: theme => dispatch(setTheme(theme)),
    signOut: () => dispatch(signOut()),
    updateProfile: (uid, profile) => dispatch(updateProfile(uid, profile))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
