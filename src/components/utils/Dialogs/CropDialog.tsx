import React, { Component } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';

import {
    AppBar, Button, createStyles, Dialog, DialogContent, IconButton, Slide, Theme, Toolbar,
    Typography, withStyles, WithStyles
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const cropDialogStyles = (theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative"
    },
    title: {
      flex: 1,
      marginLeft: theme.spacing(2)
    }
  });

interface CropDialogProps extends WithStyles<typeof cropDialogStyles> {
  onClose: (file: File | null) => void;
  open: boolean;
  srcImage: string;
}

type CropDialogState = {
  aspect: number;
  crop: Area;
  cropPosition: Point;
  zoom: number;
};

const SlideTransition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

class CropDialog extends Component<CropDialogProps, CropDialogState> {
  state = {
    aspect: 1,
    crop: { x: 0, y: 0, width: 0, height: 0 },
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
    if (!ctx || !crop) return;
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
      if (!blob) this.props.onClose(null);
      const croppedFile = new File([blob as Blob], "image.png", {
        type: "image/png"
      });
      this.props.onClose(croppedFile);
    }, "image/png");
  };

  // Metadata Functions for react-easy-crop

  onCropChange = (location: Point) => {
    this.setState({ cropPosition: location });
  };

  onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    this.setState({ crop: croppedAreaPixels });
  };

  onZoomChange = (zoom: number) => {
    this.setState({ zoom });
  };

  render() {
    const { classes, srcImage, onClose, open } = this.props;
    if (!srcImage) return null;
    const { crop } = this.state;
    return (
      <Dialog
        fullScreen
        onClose={() => onClose(null)}
        open={open}
        //@ts-ignore FixMeLater
        TransitionComponent={SlideTransition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => onClose(null)}
            >
              <Close />
            </IconButton>
            <Typography className={classes.title} variant="h6">
              Crop Image
            </Typography>
            <Button
              color="inherit"
              disabled={!crop}
              onClick={this.completeCrop}
            >
              Crop
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Cropper
            aspect={this.state.aspect}
            crop={this.state.cropPosition}
            image={srcImage}
            onCropChange={this.onCropChange}
            onCropComplete={this.onCropComplete}
            onZoomChange={this.onZoomChange}
            zoom={this.state.zoom}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(cropDialogStyles)(CropDialog);
