import React, { Component } from "react";

import {
  Slide,
  withStyles,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  DialogContent
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Cropper from "react-easy-crop";

const DialogTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
});

class CropDialog extends Component {
  state = {
    cropSettings: { x: 0, y: 0 },
    crop: null,
    zoom: 1,
    aspect: 1
  };

  completeCrop = () => {
    const srcImage = this.props.srcImage,
      crop = this.state.crop;
    const image = new Image();
    image.src = srcImage;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width,
      scaleY = image.naturalHeight / image.height,
      ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;

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
    canvas.toBlob(blob => {
      if (!blob) this.props.onClose();
      const file = new File([blob], "image.png", { type: "image/png" });
      this.props.onClose(file);
    }, "image/png");
  };

  onCropChange = cropSettings => {
    this.setState({ cropSettings });
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
        onClose={onClose}
        TransitionComponent={DialogTransition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}>
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
            crop={this.state.cropSettings}
            zoom={this.state.zoom}
            aspect={this.state.aspect}
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
