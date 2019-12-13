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
import { ColorLens, FolderShared, Info, MoreVert } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// Redux Imports
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { toggleTheme } from "../../store/actions/themeActions";

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
    marginRight: theme.spacing.unit
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

function NavBar(props) {
  const { auth } = props;
  const classes = useStyles();
  const [directoryAnchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(directoryAnchorEl),
    isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const openDirectoryMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeMobileMenu = () => {
    setMobileMoreAnchorEl(null);
  };

  const closeDirectoryMenu = () => {
    setAnchorEl(null);
    closeMobileMenu();
  };

  const openMobileMenu = event => {
    setMobileMoreAnchorEl(event.currentTarget);
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
    >
      <MenuItem onClick={openDirectoryMenu}>
        <FolderShared className={classes.icon} />
        Directory
      </MenuItem>
      <MenuItem onClick={props.toggleTheme}>
        <Info className={classes.icon} />
        About
      </MenuItem>
      <MenuItem onClick={props.toggleTheme}>
        <ColorLens className={classes.icon} />
        Theme
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.log}
            color="inherit"
            component={Link}
            to="/"
          >
            <img src="./logo.png" alt="Logo" height={32} />
          </IconButton>
          <Typography variant="h6" noWrap>
            Liftoff
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button
              color="inherit"
              onClick={openDirectoryMenu}
              startIcon={<FolderShared />}
            >
              Directory
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/"
              startIcon={<Info />}
            >
              About
            </Button>
            <Button
              color="inherit"
              onClick={props.toggleTheme}
              startIcon={<ColorLens />}
            >
              Theme
            </Button>

            {!auth.uid && <SignedOutLinks />}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton onClick={openMobileMenu} color="inherit">
              <MoreVert />
            </IconButton>
          </div>
          {auth.uid && <SignedInLinks />}
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

const mapStateToProps = state => {
  return { auth: state.firebase.auth, firebase: state.firebase };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
    toggleTheme: () => dispatch(toggleTheme())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
