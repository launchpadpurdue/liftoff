import React, { ChangeEvent, Component, ReactNode } from 'react';

import { faExclamationCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    AppBar, Box, Checkbox, Container, createStyles, fade, FormControl, Grid, GridList, GridListTile,
    Hidden, Input, InputBase, ListItemText, makeStyles, MenuItem, Select, Theme, Toolbar,
    Typography, WithStyles, withStyles
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';

import firebase from '../../config/firebaseConfig';
import { MemberQuery, SelectMenuProps, skillTypes } from '../../constants';

const headerStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  }
}));

const footerStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

type HeaderProps = {
  children: ReactNode;
};
function Header({ children }: HeaderProps) {
  const classes = headerStyles();
  return (
    <header className={classes.header}>
      <Container maxWidth="sm">{children}</Container>
    </header>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright © LaunchPad ${new Date().getFullYear()}.`}
    </Typography>
  );
}

function Footer() {
  const classes = footerStyles();
  return (
    <footer className={classes.footer}>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Preparing students for launch
      </Typography>
      <Copyright />
    </footer>
  );
}

type EmptyDataProps = {
  title: string;
  message: string;
};
function EmptyData({ title, message }: EmptyDataProps) {
  return (
    <Grid
      container
      alignContent="center"
      direction="column"
      justify="center"
      spacing={4}
    >
      <Grid item container justify="center">
        <FontAwesomeIcon icon={faHourglassHalf} size="10x" />
      </Grid>
      <Grid item>
        <Typography
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6" align="center">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
}
type EmptyQueryProps = EmptyDataProps;
function EmptyQuery({ title, message }: EmptyQueryProps) {
  return (
    <Grid
      container
      alignContent="center"
      direction="column"
      justify="center"
      item
      spacing={4}
    >
      <Grid item container justify="center">
        <FontAwesomeIcon icon={faExclamationCircle} size="10x" />
      </Grid>
      <Grid item>
        <Typography
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6" align="center">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
}

const queryBarStyles = (theme: Theme) => {
  const lightMode: boolean = theme.palette.type === "light";
  const backgroundColor: string = lightMode
    ? theme.palette.grey[200]
    : theme.palette.grey[700];
  const textColor: string = theme.palette.getContrastText(backgroundColor);
  const fadeColor: string = lightMode
    ? theme.palette.common.black
    : theme.palette.common.white;
  return createStyles({
    appbar: {
      background: backgroundColor,
      color: textColor
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(fadeColor, 0.15),
      "&:hover": {
        backgroundColor: fade(fadeColor, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "auto",
        margin: theme.spacing(0, 1, 0, 1)
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "12ch",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch"
        }
      }
    },
    select: {
      margin: theme.spacing(0, 1, 0, 1),
      minWidth: 100,
      maxWidth: 200
    }
  });
};
interface QueryBarProps extends WithStyles<typeof queryBarStyles> {
  onQuery: (query: MemberQuery) => void;
}
type QueryBarState = { name: string; skills: Array<string> };

const QueryBar = withStyles(queryBarStyles)(
  class extends Component<QueryBarProps, QueryBarState> {
    state = { name: "", skills: Array<string>() };

    onInput = (event: ChangeEvent<HTMLInputElement>) => {
      this.setState({ name: event.target.value }, () => {
        this.props.onQuery({ ...this.state });
      });
    };

    onSelectInput = (event: any, child: any) => {
      this.setState({ skills: event.target.value }, () => {
        this.props.onQuery({ ...this.state });
      });
    };

    render() {
      const { classes } = this.props;
      return (
        <AppBar position="relative" className={classes.appbar}>
          <Toolbar variant="dense">
            <Box
              display="flex"
              flexGrow={1}
              alignItems="center"
              justifyContent="center"
            >
              <Hidden xsDown>
                <Typography variant="body1">Filter by Name:</Typography>
              </Hidden>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <Search />
                </div>
                <InputBase
                  onChange={this.onInput}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                />
              </div>
              <Hidden xsDown>
                <Typography variant="body1">Filter by Skill: </Typography>
              </Hidden>
              <FormControl margin="dense" className={classes.select}>
                <Select
                  MenuProps={SelectMenuProps}
                  input={<Input />}
                  multiple
                  name="skills"
                  onChange={this.onSelectInput}
                  renderValue={selected =>
                    (selected as Array<string>).join(", ")
                  }
                  value={this.state.skills}
                >
                  {skillTypes.map(skill => (
                    <MenuItem key={skill} value={skill}>
                      <Checkbox checked={this.state.skills.includes(skill)} />
                      <ListItemText primary={skill} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
        </AppBar>
      );
    }
  }
);

interface Tile {
  url: string;
  alt: string;
  cols: number;
}
type ImageGridState = {
  imageURLs: Array<string>;
  loaded: boolean;
};
class ImageGrid extends Component<{}, ImageGridState> {
  state = { imageURLs: new Array<string>(7), loaded: false };

  componentDidMount() {
    this.loadGridImages();
  }

  loadGridImages = async () => {
    // Get a refrence to Firebase Storage and get a list of files from the photoGrid folder
    const bucket = await firebase
      .storage()
      .ref()
      .child("photoGrid")
      .listAll();
    // Get the iamages from the bucket
    const gridImages = bucket.items;
    // Asynchronously get the download url's of all photos
    const imageURLs: Array<string> = await Promise.all(
      gridImages.map(image => image.getDownloadURL())
    );
    // Make the component aware of the loaded images
    this.setState({ imageURLs, loaded: true });
  };

  generateTiles = (): Array<Tile> => {
    return this.state.imageURLs.map(
      (url, index): Tile => ({
        url: url ?? index,
        alt: "LaunchPad Photo",
        cols: index % 6 === 0 ? 2 : 1
      })
    );
  };

  render() {
    const { loaded } = this.state;
    return (
      <GridList cellHeight={200} cols={3}>
        {this.generateTiles().map(tile => (
          <GridListTile key={tile.url} cols={tile.cols}>
            {loaded && <img src={tile.url} alt={tile.alt} />}
            {!loaded && <Skeleton variant="rect" style={{ height: "100%" }} />}
          </GridListTile>
        ))}
      </GridList>
    );
  }
}

export { EmptyData, EmptyQuery, Footer, Header, ImageGrid, QueryBar };
