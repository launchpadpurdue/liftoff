import React, { Component, Fragment } from "react";
import NavBar from "../navigation/NavBar";
import { Footer } from "../utils/Utlities";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { isLoaded } from "react-redux-firebase";
import Loading from "./Loading";

class Admin extends Component {
  render() {
    const { auth, profile, events } = this.props;
    if (!isLoaded(profile)) return <Loading />;
    if (!auth.uid || !profile.admin) return <Redirect to="/signin"></Redirect>;
    return (
      <Fragment>
        <NavBar />
        <Typography variant="h1">Admin Page</Typography>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    events: state.firestore.ordered.events,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(Admin);
