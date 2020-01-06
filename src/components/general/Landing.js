import React, { Fragment } from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Material UI Imports
import {
  makeStyles,
  Container,
  Typography,
  Grid,
  Button
} from "@material-ui/core";

// Local Imports
import NavBar from "../navigation/NavBar";

const useStyles = makeStyles(theme => ({
  about: {
    marginTop: theme.spacing(6)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 1)
  },
  heroButtons: {
    marginTop: theme.spacing(1)
  },
  footer: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 0, 3)
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright © LaunchPad ${new Date().getFullYear()}.`}
    </Typography>
  );
}

export default function Landing() {
  const classes = useStyles();
  return (
    <Fragment>
      <NavBar />
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Prepare for Liftoff!{" "}
            <span role="img" aria-label="Rocket">
              🚀
            </span>
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Welcome to Liftoff, LaunchPad's portal for connecting aspiring
            mentees and experienced mentors. Find peers with similar skill sets
            and get to know the members of LaunchPad. We hope to provide an easy
            to use and convenient way to learn more about one another and foster
            a welcoming community.
          </Typography>
          <Typography variant="h6" align="center" color="textPrimary">
            Get Started
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to="/mentees"
                >
                  Meet the Mentees
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to="/mentors"
                >
                  Meet the Mentors
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to="/organizers"
                >
                  Meet the Organizers
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.about}>
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              About LaunchPad
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="textSecondary"
              paragraph
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit
              amet quam purus. Aenean at enim in leo eleifend elementum non non
              nunc. Phasellus vel congue libero. Pellentesque eu leo euismod,
              sagittis nunc at, sagittis metus. Vestibulum ipsum sapien,
              eleifend sed rutrum vitae, convallis porttitor nunc. Integer at
              molestie felis, ut volutpat ex. Maecenas eu consectetur nisi, id
              dignissim ipsum. Praesent in elit purus. Sed egestas quam pulvinar
              sem consectetur efficitur.
            </Typography>
          </div>
        </Container>
      </div>
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
    </Fragment>
  );
}
