import React, { Component } from "react";

// Material UI Imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core";

// Redux Imports
import { connect } from "react-redux";
import { getFirebase } from "react-redux-firebase";
import { deleteAccount } from "../../store/actions/authActions";

function mapReauthCode(code) {
  switch (code) {
    case "auth/wrong-password":
      return "Password is invalid for this account";
    default:
      return null;
  }
}

class DeleteAccountDialog extends Component {
  state = { authError: "", email: "", password: "" };

  deleteAccount = () => {
    const firebase = getFirebase(),
      user = firebase.auth().currentUser;
    const { email, password } = this.state;
    console.log("HERE");
    if (email !== user.email) {
      this.setState({
        authError: "Email does not match signed in account"
      });
    } else {
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          this.props.deleteAccount();
          this.closeDialog();
        })
        .catch(error =>
          this.setState({ authError: mapReauthCode(error.code) })
        );
    }
  };

  onInput = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  closeDialog = () => {
    this.setState({ authError: "", email: "", password: "" });
    this.props.onClose();
  };

  render() {
    const { open } = this.props;
    return (
      <Dialog open={open} onClose={this.closeDialog}>
        <DialogTitle>Reauthenticate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            In order to delete your account, please reauthenticate with your
            credentials
          </DialogContentText>
          <TextField
            fullWidth
            autoFocus
            label="Email Address"
            margin="dense"
            type="email"
            id="email"
            onChange={this.onInput}
          />
          <TextField
            fullWidth
            label="Password"
            margin="dense"
            type="password"
            id="password"
            onChange={this.onInput}
          />
          <Typography variant="body1" gutterBottom color="error">
            {this.state.authError}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteAccount} color="primary">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteAccount: () => dispatch(deleteAccount())
  };
};

export default connect(null, mapDispatchToProps)(DeleteAccountDialog);
