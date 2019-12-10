import React, { Fragment } from "react";
import { Button, Avatar } from "@material-ui/core";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { ExitToApp } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  red: {
    color: "#fff",
    backgroundColor: red[500]
  }
}));

const SignedInLinks = props => {
  const classes = useStyles();
  const { profile } = props;
  return (
    <Fragment>
      <Button color="inherit" onClick={props.signOut} startIcon={<ExitToApp />}>
        Sign Out
      </Button>
      <Avatar src={profile.profilePicture} className={classes.red}>
        {profile.initials}
      </Avatar>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
