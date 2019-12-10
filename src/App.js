import "typeface-roboto";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { CssBaseline } from "@material-ui/core";
import Landing from "./components/landing/Landing";
import MenteeGallery from "./components/dashboard/MenteeGallery";
import MentorGallery from "./components/dashboard/MentorGallery";
import OrganizerGallery from "./components/dashboard/OrganizerGallery";
import React from "react";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import { connect } from "react-redux";
import { isLoaded } from "react-redux-firebase";

function App(props) {
  // TODO: Make a prettier loading page
  // Waits for firebase to initialize before loading any page
  if (!isLoaded(props.auth)) return <h1>Loading</h1>;
  // Load dynamic theme
  const theme = createMuiTheme(props.theme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route path="/signin" component={SignIn}></Route>
          <Route path="/signup" component={SignUp}></Route>
          <Route path="/mentees" component={MenteeGallery}></Route>
          <Route path="/mentors" component={MentorGallery}></Route>
          <Route path="/organizers" component={OrganizerGallery}></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return { auth: state.firebase.auth, theme: state.theme };
};

export default connect(mapStateToProps)(App);
