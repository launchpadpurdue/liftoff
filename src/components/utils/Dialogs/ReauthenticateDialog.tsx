import React, { ChangeEvent, Component } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,
    Typography
} from '@material-ui/core';

import firebase from '../../../config/firebaseConfig';

// DeleteAccountDialog Definition
function mapReauthCode(code: string) {
  switch (code) {
    case "auth/wrong-password":
      return "Password is invalid for this account";
    default:
      return "Unknwong error occured";
  }
}

type ReauthenticateDialogProps = {
  open: boolean;
  onClose: (reauthenticated: boolean) => void;
};
type ReauthenticateDialogState = {
  authError: string;
  email: string;
  password: string;
};

class ReauthenticateDialog extends Component<
  ReauthenticateDialogProps,
  ReauthenticateDialogState
> {
  state = { authError: "", email: "", password: "" };

  reauthenticate = async () => {
    // Get the current user and the inputted email and password
    const user = firebase.auth().currentUser;
    if (!user) {
      this.setState({ authError: "User is not logged in" });
      return;
    }
    const { email, password } = this.state;
    if (email !== user.email) {
      // If the email does not match, report an error
      this.setState({ authError: "Email does not match signed in account" });
      return;
    }
    // Create a credential from the inputted email and password
    const userCredentials = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    try {
      // Attempt to reauthenticate the user and close the dialog
      await user.reauthenticateWithCredential(userCredentials);
      this.closeDialog(true);
    } catch (error) {
      this.setState({ authError: mapReauthCode(error.code) });
    }
  };

  onTextfieldInput = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    // Retrieve the property and value of the TextField
    const property = changeEvent.target.id,
      value = changeEvent.target.value;
    // Update the property on state
    this.setState(prevState => ({ ...prevState, [property]: value }));
  };

  closeDialog = (result: boolean) => {
    // Reset the dialog
    this.setState({ authError: "", email: "", password: "" });
    // Close the dialog
    this.props.onClose(result);
  };

  render() {
    const { open } = this.props;
    return (
      <Dialog onClose={() => this.closeDialog(false)} open={open}>
        <DialogTitle>Reauthenticate User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please reauthenticate with your credentials
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="email"
            label="Email Address"
            margin="dense"
            onChange={this.onTextfieldInput}
            type="email"
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            margin="dense"
            onChange={this.onTextfieldInput}
            type="password"
          />
          <Typography color="error" gutterBottom variant="body1">
            {this.state.authError}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.closeDialog(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={this.reauthenticate}
            variant="contained"
          >
            Reauthenticate
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ReauthenticateDialog;
