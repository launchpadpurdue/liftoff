import React, { Component } from "react";
import {
  Typography,
  makeStyles,
  GridList,
  GridListTile
} from "@material-ui/core";
import firebase from "../../config/firebaseConfig";
import { Skeleton } from "@material-ui/lab";

const footerStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright © LaunchPad ${new Date().getFullYear()}.`}
    </Typography>
  );
}

function Footer() {
  const classes = footerStyles();
  return (
    <footer className={classes.footer}>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Preparing students for launch
      </Typography>
      <Copyright />
    </footer>
  );
}

class ImageGrid extends Component {
  state = { imageUrls: new Array(7), loaded: false };

  componentDidMount() {
    this.loadGridImages();
  }

  loadGridImages = async () => {
    // Get a refrence to Firebase Storage and get a list of files from the photoGrid folder
    const bucket = await firebase
      .storage()
      .ref()
      .child("photoGrid")
      .listAll();
    // Get the iamages from the bucket
    const gridImages = bucket.items;
    // Asynchronously get the download url's of all photos
    const imageUrls = await Promise.all(
      gridImages.map(image => image.getDownloadURL())
    );
    // Make the component aware of the loaded images
    this.setState({ imageUrls, loaded: true });
  };

  generateTiles = () => {
    return this.state.imageUrls.map((url, index) => {
      return {
        url: url ? url : index,
        alt: "LaunchPad Photo",
        cols: index % 6 === 0 ? 2 : 1
      };
    });
  };

  render() {
    const { loaded } = this.state;
    return (
      <GridList cellHeight={200} cols={3}>
        {this.generateTiles().map(tile => (
          <GridListTile key={tile.url} cols={tile.cols}>
            {loaded && <img src={tile.url} alt={tile.alt} />}
            {!loaded && <Skeleton variant="rect" style={{ height: "100%" }} />}
          </GridListTile>
        ))}
      </GridList>
    );
  }
}

export { Footer, ImageGrid };
