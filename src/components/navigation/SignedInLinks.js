import React, { Fragment } from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Material UI Imports
import { Avatar, Tooltip, Menu, MenuItem } from "@material-ui/core";
import { ExitToApp, AccountCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

// Redux Imports
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

// Local Imports

const useStyles = makeStyles(theme => ({
  avatar: {
    color: "#fff",
    cursor: "pointer",
    backgroundColor: theme.palette.secondary.main
  },
  icon: {
    marginRight: theme.spacing.unit
  }
}));

const SignedInLinks = props => {
  const classes = useStyles();
  const { profile } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    props.signOut();
    handleClose();
  };

  return (
    <Fragment>
      <Tooltip title="Account" arrow>
        <Avatar
          src={profile.profilePicture}
          className={classes.avatar}
          onClick={handleClick}
          aria-controls="simple-menu"
          aria-haspopup="true"
        >
          {profile.initials}
        </Avatar>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          <AccountCircle className={classes.icon} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ExitToApp className={classes.icon} />
          Sign Out
        </MenuItem>
      </Menu>
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
