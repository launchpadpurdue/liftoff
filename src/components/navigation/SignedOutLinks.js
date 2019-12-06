import React, { Fragment } from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { withRouter } from "react-router-dom";

const SignedOutLinks = props => {
  return (
    <Fragment>
      <Button color="inherit" onClick={() => props.history.push("/signin")}>
        Sign In
      </Button>
    </Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SignedOutLinks));
