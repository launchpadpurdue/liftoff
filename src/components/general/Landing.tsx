import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Container, Grid, makeStyles, Typography } from '@material-ui/core';

import NavBar from '../navigation/NavBar';
import { Footer, Header, ImageGrid } from '../utils/Utlities';

const useStyles = makeStyles(theme => ({
  about: {
    marginTop: theme.spacing(6)
  },
  headerButtons: {
    marginTop: theme.spacing(1)
  },
  photos: {
    padding: theme.spacing(2, 0, 2)
  }
}));

export default function Landing() {
  const classes = useStyles();
  return (
    <Fragment>
      <NavBar />
      <Header>
        <Box display="flex" justifyContent="center" mb={4}>
          <img src="/logo.png" alt="LaunchPad Logo" height={128} />
        </Box>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Prepare for Liftoff!
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Welcome to Liftoff, LaunchPad's portal for connecting aspiring mentees
          and experienced mentors. Find peers with similar skill sets and get to
          know the members of LaunchPad. We hope to provide a convenient way to
          learn about one another and foster a welcoming community.
        </Typography>
        <Typography variant="h6" align="center" color="textPrimary">
          Get Started
        </Typography>
        <div className={classes.headerButtons}>
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
            sagittis nunc at, sagittis metus. Vestibulum ipsum sapien, eleifend
            sed rutrum vitae, convallis porttitor nunc. Integer at molestie
            felis, ut volutpat ex. Maecenas eu consectetur nisi, id dignissim
            ipsum. Praesent in elit purus. Sed egestas quam pulvinar sem
            consectetur efficitur.
          </Typography>
        </div>
      </Header>
      <Container maxWidth="sm" className={classes.photos}>
        <ImageGrid></ImageGrid>
      </Container>
      <Footer />
    </Fragment>
  );
}
