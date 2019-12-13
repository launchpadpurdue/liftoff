import "react-image-crop/dist/ReactCrop.css";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withStyles
} from "@material-ui/core";
import React, { Component } from "react";

import ReactCrop from "react-image-crop";

const styles = {
  hidden: {
    visibility: "hidden"
  }
};

class ImageCropper extends Component {
  state = {
    hasCropped: false,
    croppedImageURL: "",
    croppedImageFile: null,
    crop: {
      aspect: 1
    }
  };

  back = () => {
    this.setState({
      hasCropped: false,
      croppedImageURL: "",
      croppedImageFile: null
    });
  };

  next = () => {
    if (this.state.hasCropped) {
      this.props.onClose(this.state.croppedImageFile);
      this.setState({
        hasCropped: false,
        croppedImageURL: "",
        croppedImageFile: null,
        crop: {
          aspect: 1
        }
      });
    } else {
      this.setState({ hasCropped: true });
    }
  };

  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedFile = await this.getCroppedImg(this.imageRef, crop);
      this.setState({
        croppedImageFile: croppedFile,
        croppedImageURL: URL.createObjectURL(croppedFile)
      });
    }
  }

  getCroppedImg(image, crop) {
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

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        const file = new File([blob], "image.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  }

  handleClose = (event, reason) => {
    this.props.onClose(null);
    this.setState({
      hasCropped: false,
      croppedImageURL: "",
      croppedImageFile: null,
      crop: {
        aspect: 1
      }
    });
  };

  render() {
    const { classes, image, open } = this.props;
    if (!image) return null;
    const imageURL = URL.createObjectURL(image);

    return (
      <Dialog
        onClose={this.handleClose}
        open={open}
        maxWidth="sm"
        className={classes.dialog}
      >
        <DialogTitle id="simple-dialog-title">Crop Profile Image</DialogTitle>
        <DialogContent>
          {!this.state.hasCropped ? (
            <ReactCrop
              src={imageURL}
              crop={this.state.crop}
              onImageLoaded={this.onImageLoaded}
              onChange={newCrop => this.setState({ crop: newCrop })}
              onComplete={this.onCropComplete}
            />
          ) : (
            <img
              height="auto"
              width="100%"
              alt="Cropped"
              src={this.state.croppedImageURL}
            ></img>
          )}
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            className={this.state.hasCropped ? null : classes.hidden}
            variant="contained"
            onClick={this.back}
          >
            Back
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={this.next}
            disabled={this.state.croppedImageFile == null}
          >
            {this.state.hasCropped ? "Finish" : "Crop"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(ImageCropper);
