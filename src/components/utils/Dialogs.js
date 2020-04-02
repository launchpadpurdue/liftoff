import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Grid
} from "@material-ui/core";
import { Close, PhotoLibrary } from "@material-ui/icons";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Checkbox,
  ListItemText
} from "@material-ui/core";

import React, { Component, Fragment } from "react";

import { connect } from "react-redux";

import { getFirebase } from "react-redux-firebase";

import { skillTypes, SelectMenuProps } from "../../constants";
import { deleteAccount } from "../../store/actions/authActions";
import AlertDialog from "./Dialogs/AlertDialog";
import CropDialog from "./Dialogs/CropDialog";
import ConfirmationDialog from "./Dialogs/ConfirmationDialog";
import ReauthenticateDialog from "./Dialogs/ReauthenticateDialog";
import EventDialog from "./Dialogs/EventDialog";

// // DeleteAccountDialog Definition
// function mapReauthCode(code) {
//   switch (code) {
//     case "auth/wrong-password":
//       return "Password is invalid for this account";
//     default:
//       return null;
//   }
// }

// class DeleteAccountDialog extends Component {
//   state = { authError: "", email: "", password: "" };

//   deleteAccount = () => {
//     const firebase = getFirebase(),
//       user = firebase.auth().currentUser;
//     const { email, password } = this.state;
//     if (email !== user.email) {
//       this.setState({
//         authError: "Email does not match signed in account"
//       });
//     } else {
//       const credential = firebase.auth.EmailAuthProvider.credential(
//         email,
//         password
//       );
//       user
//         .reauthenticateWithCredential(credential)
//         .then(() => {
//           this.props.deleteAccount();
//           this.closeDialog();
//         })
//         .catch(error =>
//           this.setState({ authError: mapReauthCode(error.code) })
//         );
//     }
//   };

//   onInput = event => {
//     this.setState({ [event.target.id]: event.target.value });
//   };

//   closeDialog = () => {
//     this.setState({ authError: "", email: "", password: "" });
//     this.props.onClose();
//   };

//   render() {
//     const { open } = this.props;
//     return (
//       <Dialog open={open} onClose={this.closeDialog}>
//         <DialogTitle>Reauthenticate</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             In order to delete your account, please reauthenticate with your
//             credentials
//           </DialogContentText>
//           <TextField
//             fullWidth
//             autoFocus
//             label="Email Address"
//             margin="dense"
//             type="email"
//             id="email"
//             onChange={this.onInput}
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             margin="dense"
//             type="password"
//             id="password"
//             onChange={this.onInput}
//           />
//           <Typography variant="body1" gutterBottom color="error">
//             {this.state.authError}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={this.closeDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={this.deleteAccount} color="primary">
//             Delete Account
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     deleteAccount: () => dispatch(deleteAccount())
//   };
// };

// DeleteAccountDialog = connect(null, mapDispatchToProps)(DeleteAccountDialog);

// EditProfileDialog Definition

function mapProfile(profile) {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    skills: profile.skills,
    description: profile.description,
    profilePicture: profile.profilePicture,
    image: profile.croppedImage
  };
}

class EditProfileDialog extends Component {
  state = { ...mapProfile(this.props.profile), showImageCrop: false };

  onCrop = croppedImage => {
    this.setState({ croppedImage, showImageCrop: false });
  };

  onFileSelect = event => {
    if (event.target.files.length === 0) return;
    let image = URL.createObjectURL(event.target.files[0]);
    this.setState({ image, showImageCrop: true });
    event.target.value = null;
  };

  onInput = event => {
    const property = event.target.id ? event.target.id : event.target.name,
      value = event.target.value;
    this.setState({ [property]: value });
  };

  closeDialog = profile => {
    // TODO: Validate the first and last names
    let updatedProfile = profile ? mapProfile(profile) : null;
    this.props.onClose(updatedProfile);
  };

  render() {
    const { open } = this.props;
    const {
      firstName,
      lastName,
      skills,
      description,
      profilePicture
    } = this.state;
    const { croppedImage, image, showImageCrop } = this.state;
    const showUpload = !(croppedImage || profilePicture);

    return (
      <Fragment>
        <Dialog maxWidth="sm" open={open} onClose={() => this.closeDialog()}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit the details of your profile
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  fullWidth
                  id="firstName"
                  label="First Name"
                  margin="dense"
                  onChange={this.onInput}
                  value={firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  margin="dense"
                  onChange={this.onInput}
                  value={lastName}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth margin="dense">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                onClick={() => (this.value = null)}
                type="file"
                onChange={this.onFileSelect}
              />
              {showUpload && (
                <label htmlFor="raised-button-file">
                  <Button
                    component="span"
                    fullWidth
                    startIcon={<PhotoLibrary />}
                    variant="contained"
                  >
                    Add Profile Picture
                  </Button>
                </label>
              )}
              {!showUpload && (
                <Button
                  color="secondary"
                  component="span"
                  fullWidth
                  onClick={() =>
                    this.setState({
                      image: null,
                      profilePicture: null,
                      croppedImage: null
                    })
                  }
                  startIcon={<Close />}
                  variant="contained"
                >
                  Clear Profile Picture
                </Button>
              )}
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Skills</InputLabel>
              <Select
                MenuProps={SelectMenuProps}
                input={<Input />}
                multiple
                name="skills"
                onChange={this.onInput}
                renderValue={selected => selected.join(", ")}
                value={skills}
              >
                {skillTypes.map(skill => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={skills.includes(skill)} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="description"
              label="Description"
              margin="dense"
              multiline={true}
              onChange={this.onInput}
              rowsMax={6}
              value={description}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.closeDialog()} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => this.closeDialog(this.state)}
              color="primary"
              autoFocus
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <CropDialog
          open={showImageCrop}
          onClose={this.onCrop}
          srcImage={image}
        ></CropDialog>
      </Fragment>
    );
  }
}

export {
  AlertDialog,
  ConfirmationDialog,
  CropDialog,
  ReauthenticateDialog,
  EditProfileDialog,
  EventDialog
};
