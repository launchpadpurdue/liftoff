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
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
    cursor: "pointer",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1)
    }
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}));

const SignedInLinks = props => {
  const classes = useStyles();
  const { profile } = props;
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

  const openProfileMenu = event => {
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    props.signOut();
    closeProfileMenu();
  };

  return (
    <Fragment>
      <Tooltip title="Account" arrow>
        <Avatar
          src={profile.profilePicture}
          className={classes.avatar}
          onClick={openProfileMenu}
          aria-controls="simple-menu"
          aria-haspopup="true"
        >
          {profile.initials}
        </Avatar>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={profileAnchorEl}
        keepMounted
        open={Boolean(profileAnchorEl)}
        onClose={closeProfileMenu}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem onClick={closeProfileMenu} component={Link} to="/profile">
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
