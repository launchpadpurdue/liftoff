import React, { Component } from "react";

// Material UI Imports
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

// React Easy Crop Imports
import Cropper from "react-easy-crop";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
});

const DialogTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
        TransitionComponent={DialogTransition}
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

export default withStyles(styles)(CropDialog);
