import React, { Component, Fragment } from "react";

// React Router Imports
import { Redirect } from "react-router-dom";

// Material UI Imports
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  withStyles,
  Input,
  ListItemText
} from "@material-ui/core";
import { DeleteForever, Edit, ExitToApp, Lock } from "@material-ui/icons";

// Redux Imports
import { connect } from "react-redux";
import { getFirebase } from "react-redux-firebase";
import {
  deleteAccount,
  signOut,
  updateProfile
} from "../../store/actions/authActions";
import { setTheme } from "../../store/actions/preferenceActions";

// Local Imports
import NavBar from "../navigation/NavBar";
import ProfileCard from "./ProfileCard";

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

function mapReauthCode(code) {
  switch (code) {
    case "auth/wrong-password":
      return "Password is invalid for this account";
    default:
      return null;
  }
}
const skills = ["Web", "IOS", "Android", "Gaming", "Machine Learning", "Other"];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
const emptyProfile = {
  firstName: "",
  lastName: "",
  skills: [],
  description: ""
};

class Profile extends Component {
  state = {
    // Edit Profile State
    showEditProfile: false,
    editDetails: { ...emptyProfile },
    // Password State
    showPasswordReset: false,
    // Delete Account State
    email: "",
    password: "",
    showDeleteAccount: false,
    reauthenticateError: ""
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

  showEditProfile = () => {
    this.setState({
      showEditProfile: true,
      editDetails: { ...this.props.profile }
    });
  };

  editSkill = event => {
    const details = this.state.editDetails;
    details.skills = event.target.value;
    this.setState({ editDetails: { ...details } });
  };

  updateProfile = () => {
    // TODO: Validate the first and last names
    this.props.updateProfile(this.state.editDetails);
    this.hideEditProfile();
  };

  hideEditProfile = () => {
    this.setState({ showEditProfile: false, editDetails: emptyProfile });
  };

  onInput = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onEditProfileInput = event => {
    const editDetails = this.state.editDetails;
    editDetails[event.target.id] = event.target.value;
    this.setState({ editDetails: editDetails });
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
      .then(() => this.props.deleteAccount())
      .catch(error =>
        this.setState({ reauthenticateError: mapReauthCode(error.code) })
      );
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
        <main className={classes.layout}>
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
                    variant="contained"
                    onClick={this.showEditProfile}
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
        <Dialog
          open={this.state.showEditProfile}
          onClose={this.hideEditProfile}
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit the details of your profile
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="firstName"
              label="First Name"
              fullWidth
              onChange={this.onEditProfileInput}
              value={this.state.editDetails.firstName}
            />
            <TextField
              margin="dense"
              id="lastName"
              label="Last Name"
              fullWidth
              onChange={this.onEditProfileInput}
              value={this.state.editDetails.lastName}
            />
            <FormControl fullWidth>
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                value={this.state.editDetails.skills}
                onChange={this.editSkill}
                input={<Input />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {skills.map(skill => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox
                      checked={this.state.editDetails.skills.includes(skill)}
                    />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              fullWidth
              name="description"
              label="Description"
              id="description"
              rowsMax={6}
              multiline={true}
              placeholder="Elaborate on your skills and self"
              onChange={this.onEditProfileInput}
              value={this.state.editDetails.description}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideEditProfile} color="primary">
              Cancel
            </Button>
            <Button onClick={this.updateProfile} color="primary" autoFocus>
              Update
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
    setTheme: theme => dispatch(setTheme(theme)),
    signOut: () => dispatch(signOut()),
    updateProfile: profile => dispatch(updateProfile(profile))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
