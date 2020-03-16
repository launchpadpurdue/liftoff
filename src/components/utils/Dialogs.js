import React, { Component, Fragment } from "react";

// Material UI Imports
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  withStyles,
  Grid
} from "@material-ui/core";
import { Close, PhotoLibrary } from "@material-ui/icons";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

// Material UI Imports
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

import { eventTypes, skillTypes } from "../../constants";

// Redux Imports
import { connect } from "react-redux";
import { getFirebase } from "react-redux-firebase";
import { deleteAccount } from "../../store/actions/authActions";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
// React Easy Crop Imports
import Cropper from "react-easy-crop";

// AlertDialog Definition
function AlertDialog(props) {
  const { open, onClose, title, message } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={onClose}>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Confirm Dialog Definition
function ConfirmDialog(props) {
  const { open, onConfirm, onDismiss, title, message } = props;
  return (
    <Dialog open={open} onClose={onDismiss}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss}>Cancel</Button>
        <Button autoFocus color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// CropDialog Definition
class CropDialog extends Component {
  state = {
    crop: null,
    aspect: 1,
    cropPosition: { x: 0, y: 0 },
    zoom: 1
  };

  // Crops the source image and returns it to the caller
  completeCrop = () => {
    // Get the image blob to crop and crop information
    const srcImage = this.props.srcImage;
    const crop = this.state.crop;

    // Store the blob in an image and get the scale
    const image = new Image();
    image.src = srcImage;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Create a canvas and drawing context
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    // Draw the cropped image on the canvas
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      500,
      500
    );

    // Convert the canvas back to a blob and close the dialog
    canvas.toBlob(blob => {
      if (!blob) this.props.onClose();
      const file = new File([blob], "image.png", { type: "image/png" });
      this.props.onClose(file);
    }, "image/png");
  };

  // Metadata Functions for react-easy-crop

  onCropChange = cropPosition => {
    this.setState({ cropPosition });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ crop: croppedAreaPixels });
  };

  onZoomChange = zoom => {
    this.setState({ zoom });
  };

  render() {
    const { classes, srcImage, open, onClose } = this.props;
    if (!srcImage) return null;
    const { crop } = this.state;
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={() => onClose()}
        TransitionComponent={CropDialogTransition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => onClose()}>
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Crop Image
            </Typography>
            <Button
              color="inherit"
              onClick={this.completeCrop}
              disabled={!crop}
            >
              Crop
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Cropper
            image={srcImage}
            crop={this.state.cropPosition}
            aspect={this.state.aspect}
            zoom={this.state.zoom}
            onCropChange={this.onCropChange}
            onCropComplete={this.onCropComplete}
            onZoomChange={this.onZoomChange}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

const cropDialogStyles = theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
});

const CropDialogTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

CropDialog = withStyles(cropDialogStyles)(CropDialog);

// DeleteAccountDialog Definition
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

DeleteAccountDialog = connect(null, mapDispatchToProps)(DeleteAccountDialog);

// EditProfileDialog Definition
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  }
};

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
            <TextField
              autoFocus
              fullWidth
              id="firstName"
              label="First Name"
              margin="dense"
              onChange={this.onInput}
              value={firstName}
            />
            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              margin="dense"
              onChange={this.onInput}
              value={lastName}
            />
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
                MenuProps={MenuProps}
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

class EventDialog extends Component {
  state = {
    title: "",
    description: "",
    location: "",
    time: null,
    type: "",
    duration: 1,
    ...this.props.event
  };

  onInput = event => {
    let property = event.target.id ? event.target.id : event.target.name,
      value = event.target.value;
    if (property === "duration" && value === "") return;
    this.setState({ [property]: value });
  };

  closeDialog = event => {
    let eventID;
    if (event) {
      eventID = event.id;
      delete event["id"];
    }
    this.props.onClose(event, eventID);
    this.setState({
      title: "",
      description: "",
      location: "",
      time: null,
      duration: 1
    });
  };

  render() {
    const { open, event } = this.props;
    const { title, description, time, location, type, duration } = this.state;
    return (
      <Dialog fullWidth open={open} onClose={() => this.closeDialog(null)}>
        <DialogTitle>{event ? "Edit" : "Create"} Event Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {event ? "Edit" : "Create"} details for the event
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="title"
            margin="dense"
            defaultValue={title}
            label="Event Name"
            placeholder="ex. Pairing Night"
            onChange={this.onInput}
          />
          <TextField
            autoFocus
            fullWidth
            id="location"
            margin="dense"
            defaultValue={location}
            label="Event Location"
            placeholder="ex. LWSN B155"
            onChange={this.onInput}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              fullWidth
              placeholder="MM/DD/YYYY hh:mm"
              variant="inline"
              id="time"
              label="Event Date and Time"
              value={time instanceof Date ? time : time ? time.toDate() : null}
              autoOk
              margin="dense"
              onChange={time => {
                this.setState({ time });
              }}
              format="MM/dd/yyyy HH:mm"
            />
          </MuiPickersUtilsProvider>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Event Type</InputLabel>
                <Select defaultValue={type} onChange={this.onInput} name="type">
                  {eventTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ min: 1 }}
                margin="dense"
                fullWidth
                label="Duration (minutes)"
                id="duration"
                type="number"
                onInput={this.onInput}
                value={duration}
              />
            </Grid>
          </Grid>
          <TextField
            id="description"
            label="Event Description"
            margin="dense"
            placeholder="Add a description of the event"
            onChange={this.onInput}
            defaultValue={description}
            fullWidth
            rowsMax="4"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog(null)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.closeDialog(this.state)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export {
  AlertDialog,
  ConfirmDialog,
  CropDialog,
  DeleteAccountDialog,
  EditProfileDialog,
  EventDialog
};
