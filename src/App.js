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
import Landing from "./components/general/Landing";
import MenteeGallery from "./components/directories/MenteeGallery";
import MentorGallery from "./components/directories/MentorGallery";
import OrganizerGallery from "./components/directories/OrganizerGallery";
import Profile from "./components/auth/Profile";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Loading from "./components/general/Loading";
import ViewProfile from "./components/auth/ViewProfile";

function App(props) {
  // Load in the dynamic theme
  const { preferences = { theme: "light" } } = props.profile;
  props.preferences.theme.palette.type = preferences.theme;
  const theme = createMuiTheme(props.preferences.theme);

  // Wait for firebase to initialize then load the site
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoaded(props.auth) ? (
        <Router>
          <Switch>
            <Route path="/" component={Landing} exact></Route>
            <Route path="/signin" component={SignIn}></Route>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/profile" component={Profile} exact></Route>
            <Route path="/profile/:id" component={ViewProfile}></Route>
            <Route path="/mentees" component={MenteeGallery}></Route>
            <Route path="/mentors" component={MentorGallery}></Route>
            <Route path="/organizers" component={OrganizerGallery}></Route>
          </Switch>
        </Router>
      ) : (
        <Loading />
      )}
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    preferences: state.preferences,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(App);
