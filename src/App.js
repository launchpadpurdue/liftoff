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

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red
  }
});

function App(props) {
  return isLoaded(props.auth) ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route path="/signin" component={SignIn}></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  ) : (
    <h1>Loading</h1>
  );
}

const mapStateToProps = state => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(App);
