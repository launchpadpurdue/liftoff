import React from "react";
import {
  Typography,
  makeStyles,
  GridList,
  GridListTile
} from "@material-ui/core";

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

function generateTileData(numTiles) {
  const tileData = [];
  for (let i = 0; i < numTiles; i++) {
    tileData.push({
      img: "https://dummyimage.com/300",
      title: "Image",
      cols: 1
    });
    if (i % 6 === 0) {
      tileData[i].cols = 2;
    }
  }
  return tileData;
}

function ImageGridList() {
  //   const classes = useStyles();

  return (
    <GridList cellHeight={200} cols={3}>
      {generateTileData(10).map(tile => (
        <GridListTile key={tile.img} cols={tile.cols || 1}>
          <img src={tile.img} alt={tile.title}  />
        </GridListTile>
      ))}
    </GridList>
  );
}

export { Footer, ImageGridList };
