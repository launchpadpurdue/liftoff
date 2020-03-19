import React, { Fragment } from "react";

// Material UI Imports
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  AppBar,
  Toolbar,
  InputBase,
  fade
} from "@material-ui/core";

// Redux Imports
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

// Local Imports
import { SkeletonCard, MemberCard } from "../utils/Cards";
import NavBar from "../navigation/NavBar";
import { Footer, EmptyData, Header } from "../utils/Utlities";
import { Member, FixMeLater } from "../../constants";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: theme.spacing(8, 4, 8, 4)
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    }
  }
}));

type OrganizerGalleryProps = {
  organizers: Array<Member>;
};
function OrganizerGallery({ organizers }: OrganizerGalleryProps) {
  const classes = useStyles();
  const dataLoaded: boolean = isLoaded(organizers),
    dataEmpty: boolean = isEmpty(organizers);
  return (
    <React.Fragment>
      <NavBar />
      <main>
        <Header>
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
            Something short and leading about the collection below—its contents,
            the creator, etc. Make it short and sweet, but not too short so
            folks don&apos;t simply skip over it entirely.
          </Typography>
        </Header>
        <AppBar position="relative">
          <Toolbar variant="dense">
            <Typography variant="body1">Filter by Name</Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase
                onChange={event => console.log(event.target.value)}
                placeholder="Search Name…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>

            <Typography variant="body1">Filter by Skill</Typography>
          </Toolbar>
        </AppBar>
        <Container className={classes.cardGrid} maxWidth="md">
          {!dataLoaded && (
            <Grid container spacing={4}>
              {[1, 2, 3].map(num => (
                <SkeletonCard key={num} />
              ))}
            </Grid>
          )}
          {dataLoaded && dataEmpty && (
            <EmptyData
              title="Come back soon!"
              message="No organizers have signed up yet but come back soon to meet
            them all!"
            />
          )}
          {dataLoaded && !dataEmpty && (
            <Fragment>
              <Grid container spacing={4}>
                {organizers.map(user => (
                  <MemberCard key={user.id} member={user} />
                ))}
              </Grid>
            </Fragment>
          )}
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
