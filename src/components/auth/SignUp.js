import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select
} from "@material-ui/core";
import React, { Component, Fragment } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ImageCropper from "./ImageCropper";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { signUp } from "../../store/actions/authActions";
import { withStyles } from "@material-ui/styles";

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
    // Account Info
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    signUpCode: null,
    image: null,
    skills: [],
    description: null,
    // Metadata State
    openCropDialog: false,
    labelWidth: 0,
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      signUpCode: ""
    }
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  handleChange = event => {
    const targetProp = event.target.id ? event.target.id : event.target.name;
    this.setState({ [targetProp]: event.target.value });
    if (this.state.targetProp == null && event.target.value === "") {
      console.log("HERE");
      this.setState({
        errors: { ...this.state.errors, [targetProp]: "Error" }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, [targetProp]: "" }
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.signUp(this.state);
  };

  handleCropDialog = croppedImageFile => {
    console.log(croppedImageFile);
    this.setState({
      openCropDialog: false,
      image: croppedImageFile
    });
  };

  handleFileSelect = event => {
    this.setState({
      image: event.target.files[0],
      openCropDialog: true
    });
    event.target.value = null;
  };

  clearImage = () => {
    this.setState({
      image: null
    });
  };

  render() {
    if (this.props.auth.uid) return <Redirect to="/"></Redirect>;
    const { classes, authError } = this.props;
    const { errors } = this.state;

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
                    error={errors.firstName !== ""}
                    helperText={errors.firstName ? "First name is empty" : ""}
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
                    error={errors.lastName !== ""}
                    helperText={errors.lastName ? "Last name is empty" : ""}
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
                    error={errors.email !== ""}
                    helperText={errors.email ? "Email is empty" : ""}
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
                    error={errors.password !== ""}
                    helperText={errors.password ? "Password is empty" : ""}
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
                    error={errors.signUpCode !== ""}
                    helperText={errors.signUpCode ? "Code is empty" : ""}
                    onChange={this.handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    id="signUpCode"
                    label="Sign Up Code"
                    name="signUpCode"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="raised-button-file"
                    multiple
                    onClick={() => (this.value = null)}
                    type="file"
                    onChange={this.handleFileSelect}
                  />
                  {!this.state.image ? (
                    <label htmlFor={"raised-button-file"}>
                      <Button
                        component="span"
                        color={"default"}
                        fullWidth
                        size="large"
                        variant="contained"
                        startIcon={<PhotoCameraIcon />}
                      >
                        Add Profile Picture
                      </Button>
                    </label>
                  ) : (
                    <Button
                      size="large"
                      onClick={this.clearImage}
                      component="span"
                      color={"secondary"}
                      fullWidth
                      variant="contained"
                      startIcon={<CloseIcon />}
                    >
                      Clear Profile Picture
                    </Button>
                  )}
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
                  <TextField
                    variant="outlined"
                    fullWidth
                    onChange={this.handleChange}
                    name="description"
                    label="Description"
                    id="description"
                    multiline={true}
                    placeholder="Elaborate on your skills and self"
                  />
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
          image={this.state.image}
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
