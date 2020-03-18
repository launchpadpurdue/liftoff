import React from "react";

// Material UI Imports
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";

// FontAwesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

// Redux Imports
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

// Local Imports
import { SkeletonCard, MemberCard } from "../utils/Cards";
import NavBar from "../navigation/NavBar";
import { Footer } from "../utils/Utlities";
import { Member, FixMeLater } from "../../constants";

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  cardGrid: {
    padding: theme.spacing(8, 4, 8, 4)
  }
}));

type OrganizerGalleryProps = {
  organizers: Array<Member>;
};
function OrganizerGallery({ organizers }: OrganizerGalleryProps) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <NavBar />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Meet the Organizers
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {!organizers && [1, 2, 3].map(num => <SkeletonCard key={num} />)}
            {organizers &&
              organizers.length > 0 &&
              organizers.map(user => (
                <MemberCard key={user.id} member={user} />
              ))}
            {organizers && organizers.length === 0 && (
              <Grid
                container
                alignContent="center"
                direction="column"
                justify="center"
                item
              >
                <Grid item>
                  <FontAwesomeIcon icon={faHourglassHalf} size="10x" />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h3"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                  >
                    Come back soon!
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" align="center">
                    No organizers have signed up yet but come back soon to meet
                    them all!
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}

const mapStateToProps = (state: FixMeLater): OrganizerGalleryProps => {
  return {
    organizers: state.firestore.ordered.users
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "users",
      where: ["role", "==", "Organizer"]
    }
  ])
)(OrganizerGallery);
