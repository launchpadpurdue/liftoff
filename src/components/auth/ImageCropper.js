import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  withStyles,
  Box,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { display } from "@material-ui/system";

const styles = theme => ({
  image: {
    display: "block",
    maxWidth: "auto",
    maxHeight: ".8vh"
  },
  dialogContent: {
    display: "flex",
    alignItems: "center"
  },
  dialogActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  hidden: {
    visibility: "hidden"
  }
});

class ImageCropper extends Component {
  state = {
    hasCropped: false,
    imageURL: ""
  };

  componentDidMount() {
    console.log("SUG");
  }

  revert = () => {
    this.setState({ hasCropped: false });
  };

  proceed = () => {
    if (this.state.hasCropped) {
      this.props.onClose("success", this.state.imageURL);
      this.setState({ hasCropped: false, imageURL: "" });
    } else {
      this.setState({ hasCropped: true });
    }
  };

  render() {
    const { onClose, imageURL, open, classes } = this.props;

    const handleClose = (event, reason) => {
      console.log(event, reason);
      onClose(reason);
    };

    return (
      <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth="md">
        <DialogTitle id="simple-dialog-title">Crop Profile Image</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {!this.state.hasCropped ? (
            <img height="500vh" width="auto" alt="Cropped" src={imageURL}></img>
          ) : null}
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            variant="contained"
            className={this.state.hasCropped ? null : classes.hidden}
            onClick={this.revert}
          >
            Back
          </Button>
          <Button color="primary" variant="contained" onClick={this.proceed}>
            {this.state.hasCropped ? "Done" : "Crop"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(ImageCropper);
