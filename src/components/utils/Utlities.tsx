import React, { Component, ReactNode } from "react";
import {
  Typography,
  makeStyles,
  GridList,
  GridListTile,
  Container
} from "@material-ui/core";
import firebase from "../../config/firebaseConfig";
import { Skeleton } from "@material-ui/lab";

const headerStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  }
}));

const footerStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

type HeaderProps = {
  children: ReactNode;
};
function Header({ children }: HeaderProps) {
  const classes = headerStyles();
  return (
    <header className={classes.header}>
      <Container maxWidth="md">{children}</Container>
    </header>
  );
}

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

interface Tile {
  url: string;
  alt: string;
  cols: number;
}
type ImageGridState = {
  imageURLs: Array<string>;
  loaded: boolean;
};
class ImageGrid extends Component<{}, ImageGridState> {
  state = { imageURLs: new Array<string>(7), loaded: false };

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
    const imageURLs: Array<string> = await Promise.all(
      gridImages.map(image => image.getDownloadURL())
    );
    // Make the component aware of the loaded images
    this.setState({ imageURLs, loaded: true });
  };

  generateTiles = (): Array<Tile> => {
    return this.state.imageURLs.map(
      (url, index): Tile => ({
        url: url ?? index,
        alt: "LaunchPad Photo",
        cols: index % 6 === 0 ? 2 : 1
      })
    );
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

export { Footer, Header, ImageGrid };
