import React from "react";
import {
  Box,
  CircularProgress,
  makeStyles,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    background: theme.palette.primary.main
  },
  loadingText: {
    color: "white",
    marginTop: theme.spacing(2)
  }
}));

export default function Loading(props) {
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress color="secondary" />
      <Typography component="h1" variant="h5" className={classes.loadingText}>
        Loading
      </Typography>
    </Box>
  );
}
