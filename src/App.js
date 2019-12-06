import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, red } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";
import "typeface-roboto";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing from "./components/landing/Landing";
import SignIn from "./components/auth/SignIn";
import { isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import MenteeGallery from "./components/dashboard/MenteeGallery";
import MentorGallery from "./components/dashboard/MentorGallery";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
    // type: "dark"
  }
});

function App(props) {
  // TODO: Make a prettier loading page
  // Waits for firebase to initialize before loading any page
  if (!isLoaded(props.auth)) return <h1>Loading</h1>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route path="/signin" component={SignIn}></Route>
          <Route path="/mentees" component={MenteeGallery}></Route>
          <Route path="/mentors" component={MentorGallery}></Route>

        </Switch>
      </Router>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(App);
