import React, { Fragment } from "react";
import { Button, Avatar } from "@material-ui/core";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { ExitToApp } from "@material-ui/icons";

const SignedInLinks = props => {
  return (
    <Fragment>
      <Button color="inherit" onClick={props.signOut} startIcon={<ExitToApp />}>
        Sign Out
      </Button>
      <Avatar src="./logo.png" />
    </Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(null, mapDispatchToProps)(SignedInLinks);
