import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/styles";
import { signUp } from "../../store/actions/authActions";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import {
  CardMedia,
  Card,
  Select,
  MenuItem,
  ListItemText,
  FormControl,
  InputLabel,
  Checkbox,
  OutlinedInput
} from "@material-ui/core";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ImageCropper from "./ImageCropper";

const LinkTemplate = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  input: {
    display: "none"
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = ["Web", "IOS", "Android", "Gaming", "Machine Learning", "Other"];

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    openCropDialog: false,
    image: null,
    imagePreview: null,
    skills: [],
    labelWidth: 0
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  handleChange = event => {
    const targetProp = event.target.id ? event.target.id : event.target.name;
    this.setState({ [targetProp]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.signUp(this.state);
  };

  handleCropDialog = (reason, imageURL) => {
    if (reason === "success") {
      console.log(imageURL);
    }
    this.setState({ openCropDialog: false });
  };

  handleFile = event => {
    this.setState({
      image: event.target.files[0],
      openCropDialog: true,
      imagePreview: URL.createObjectURL(event.target.files[0])
    });
  };

  render() {
    const { classes, authError, auth } = this.props;
    if (auth.uid) return <Redirect to="/"></Redirect>;

    return (
      <Fragment>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={this.handleSubmit}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={this.handleChange}
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={this.handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={this.handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={this.handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="description"
                    label="Description"
                    id="description"
                    multiline={true}
                    placeholder="Elaborate on your skills and self"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      ref={ref => {
                        this.InputLabelRef = ref;
                      }}
                      htmlFor="skills"
                    >
                      Skills
                    </InputLabel>
                    <Select
                      multiple
                      value={this.state.skills}
                      onChange={this.handleChange}
                      input={
                        <OutlinedInput
                          labelWidth={this.state.labelWidth}
                          name="skills"
                        />
                      }
                      renderValue={selected => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {names.map(name => (
                        <MenuItem key={name} value={name}>
                          <Checkbox
                            checked={this.state.skills.indexOf(name) > -1}
                          />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={this.handleFile}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      component="span"
                      fullWidth
                      variant="contained"
                      className={classes.button}
                      startIcon={<PhotoCameraIcon />}
                    >
                      Add Profile Picture
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  {this.state.imagePreview ? (
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={this.state.imagePreview}
                        title="Image title"
                      />
                    </Card>
                  ) : null}
                </Grid>
              </Grid>
              {authError ? (
                <Typography variant="body1" gutterBottom color="error">
                  {authError}
                </Typography>
              ) : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="signin" component={LinkTemplate} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
        <ImageCropper
          open={this.state.openCropDialog}
          onClose={this.handleCropDialog}
          imageURL={this.state.imagePreview}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: accountDetails => dispatch(signUp(accountDetails))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignUp));
