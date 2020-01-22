import React, { Fragment } from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import ProfileCard from "./ProfileCard";
import {
  makeStyles,
  Container,
  Paper,
  CircularProgress,
  Box
} from "@material-ui/core";
import NavBar from "../navigation/NavBar";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      padding: theme.spacing(3)
    }
  }
}));

function ViewProfile(props) {
  const { user } = props;
  const classes = useStyles();
  console.log(user);
  return (
    <Fragment>
      <NavBar />
      <main>
        <Container maxWidth="lg">
          <Paper className={classes.paper}>
            {!user && (
              <Box display="flex" justifyContent="center" my={16}>
                <CircularProgress />
              </Box>
            )}
            {user && <ProfileCard profile={user} />}
          </Paper>
        </Container>
      </main>
    </Fragment>
  );
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const users = state.firestore.data.users;
  const user = users ? users[id] : null;
  return {
    user
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "users" }])
)(ViewProfile);
