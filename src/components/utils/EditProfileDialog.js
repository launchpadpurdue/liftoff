import React, { Component, Fragment } from "react";

// Material UI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Checkbox,
  ListItemText
} from "@material-ui/core";
import { PhotoLibrary, Close } from "@material-ui/icons";
import CropDialog from "./CropDialog";

const allSkills = [
  "Web",
  "IOS",
  "Android",
  "Gaming",
  "Machine Learning",
  "Other"
];
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
    const { open, onClose } = this.props;
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
        <Dialog maxWidth="sm" open={open} onClose={onClose}>
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
                {allSkills.map(skill => (
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

export default EditProfileDialog;
