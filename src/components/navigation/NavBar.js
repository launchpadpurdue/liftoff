import React from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Material UI Imports
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import {
  FolderShared,
  Info,
  MoreVert,
  PersonAdd,
  Event,
  SupervisorAccount
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// Redux Imports
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

// Local Imports
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  logo: {
    marginRight: theme.spacing(2)
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

function NavBar(props) {
  const { auth, profile } = props;
  const classes = useStyles();
  const [directoryAnchorEl, setDirectoryAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(directoryAnchorEl),
    isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const openMobileMenu = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const closeMobileMenu = () => {
    setMobileMoreAnchorEl(null);
  };

  const openDirectoryMenu = event => {
    setDirectoryAnchorEl(event.currentTarget);
  };

  const closeDirectoryMenu = () => {
    setDirectoryAnchorEl(null);
    closeMobileMenu();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={directoryAnchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      onClose={closeDirectoryMenu}
    >
      <MenuItem onClick={closeDirectoryMenu} component={Link} to="/mentees">
        Mentees
      </MenuItem>
      <MenuItem onClick={closeDirectoryMenu} component={Link} to="/mentors">
        Mentors
      </MenuItem>
      <MenuItem onClick={closeDirectoryMenu} component={Link} to="/organizers">
        Organizers
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={closeMobileMenu}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
    >
      {profile.admin && (
        <MenuItem onClick={closeMobileMenu} component={Link} to="/admin">
          <SupervisorAccount className={classes.icon} />
          Admin
        </MenuItem>
      )}
      <MenuItem onClick={openDirectoryMenu}>
        <FolderShared className={classes.icon} />
        Directory
      </MenuItem>
      {auth.uid && (
        <MenuItem onClick={closeMobileMenu} component={Link} to="/events">
          <Event className={classes.icon} />
          Events
        </MenuItem>
      )}
      <MenuItem onClick={closeMobileMenu} component={Link} to="/">
        <Info className={classes.icon} />
        About
      </MenuItem>
      {!auth.uid && (
        <MenuItem onClick={closeMobileMenu} component={Link} to="/signin">
          <PersonAdd className={classes.icon} />
          Sign In
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.logo}
            color="inherit"
            component={Link}
            to="/"
          >
            <img src="/logo.png" alt="LaunchPad Logo" height={32} />
          </IconButton>
          <Typography variant="h6" noWrap>
            Liftoff
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {profile.admin && (
              <Button
                color="inherit"
                component={Link}
                to="/admin"
                startIcon={<SupervisorAccount />}
              >
                Admin
              </Button>
            )}
            <Button
              color="inherit"
              onClick={openDirectoryMenu}
              startIcon={<FolderShared />}
            >
              Directory
            </Button>
            {auth.uid && (
              <Button
                color="inherit"
                component={Link}
                to="/events"
                startIcon={<Event />}
              >
                Events
              </Button>
            )}
            <Button
              color="inherit"
              component={Link}
              to="/"
              startIcon={<Info />}
            >
              About
            </Button>
            {!auth.uid && <SignedOutLinks />} {auth.uid && <SignedInLinks />}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton onClick={openMobileMenu} color="inherit">
              <MoreVert />
            </IconButton>
            {auth.uid && <SignedInLinks />}
          </div>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    firebase: state.firebase,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
