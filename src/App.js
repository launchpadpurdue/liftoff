import "typeface-roboto";
import React from "react";

// React Router Imports
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Material UI Imports
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// Redux Imports
import { connect } from "react-redux";
import { isLoaded } from "react-redux-firebase";

// Local Imports
import Landing from "./components/landing/Landing";
import MenteeGallery from "./components/dashboard/MenteeGallery";
import MentorGallery from "./components/dashboard/MentorGallery";
import OrganizerGallery from "./components/dashboard/OrganizerGallery";
import Profile from "./components/auth/Profile";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

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
          <Route path="/profile" component={Profile}></Route>
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
