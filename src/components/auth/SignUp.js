import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

// React Router Imports
import { Link as RouterLink, Redirect } from "react-router-dom";

// Material UI Imports
import {
  Avatar,
  Button,
  Container,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import { LockOutlined, PhotoLibrary, Close } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";

// Redux Imports
import { connect } from "react-redux";
import { signUp } from "../../store/actions/authActions";

// Local Imports
import ImageCropper from "../utils/ImageCropper";

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

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const names = ["Web", "IOS", "Android", "Gaming", "Machine Learning", "Other"];

class SignUp extends Component {
  state = {
    // Account Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    signUpCode: "",
    image: null,
    skills: [],
    description: "",
    // Metadata State
    openCropDialog: false,
    labelWidth: 0,
    currentPage: 0,
    formErrors: {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      signUpCode: null
    }
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    });
  }

  handleChange = event => {
    const property = event.target.id ? event.target.id : event.target.name;
    const value = event.target.value;
    if (this.state.formErrors[property]) {
      this.validateField(property, value);
    }
    this.setState({ [property]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.currentPage === 0) {
      const fieldsToValidate = [
        "firstName",
        "lastName",
        "email",
        "password",
        "signUpCode"
      ];
      let validated = this.validateForm(fieldsToValidate);
      if (validated) this.setState({ currentPage: 1 });
    }
    // const fieldsToValidate = [
    //   "firstName",
    //   "lastName",
    //   "email",
    //   "password",
    //   "signUpCode"
    // ];
    // let validated = this.validateForm(fieldsToValidate);
    // TODO: Use real sign up code
    // if (validated) this.props.signUp(this.state);
  };

  handleCropDialog = croppedImageFile => {
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

  handleBlur = event => {
    let property = event.currentTarget.name,
      value = this.state[property];
    this.validateField(property, value);
  };

  validateField = (property, value) => {
    let error = null;

    switch (property) {
      case "firstName":
        error = value === "" ? "First name is empty" : null;
        break;
      case "lastName":
        error = value === "" ? "Last name is empty" : null;
        break;
      case "email":
        if (value === "") {
          error = "Email is empty";
        } else if (!emailRegex.test(value)) {
          error = "Invalid email";
        }
        break;
      case "password":
        if (value === "") {
          error = "Password is empty";
        } else if (value.length < 6) {
          error = "Password must be 6 characters";
        }
        break;
      case "signUpCode":
        error = value === "" ? "Sign up code is empty" : null;
        break;
      default:
    }
    this.setState({
      formErrors: { ...this.state.formErrors, [property]: error }
    });
  };

  validateForm = properties => {
    let formErrors = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      signUpCode: null
    };

    for (let property of properties) {
      let value = this.state[property];
      switch (property) {
        case "firstName":
          let firstNameError = value === "" ? "First name is empty" : null;
          formErrors.firstName = firstNameError;
          break;
        case "lastName":
          let lastNameError = value === "" ? "Last name is empty" : null;
          formErrors.lastName = lastNameError;
          break;
        case "email":
          let emailError = null;
          if (value === "" || value === null) {
            emailError = "Email is empty";
          } else if (!emailRegex.test(value)) {
            emailError = "Invalid email";
          }
          formErrors.email = emailError;
          break;
        case "password":
          let passwordError = null;
          if (value === "" || value === null) {
            passwordError = "Password is empty";
          } else if (value.length < 6) {
            passwordError = "Password must be 6 characters";
          }
          formErrors.password = passwordError;
          break;
        case "signUpCode":
          let signUpCodeError = value === "" ? "Sign up code is empty" : null;
          formErrors.signUpCode = signUpCodeError;
          break;
        default:
      }
    }
    this.setState({ formErrors: formErrors });
    for (let error in formErrors) {
      if (formErrors[error] !== null) return false;
    }
    return true;
  };

  renderForm = () => {};

  render() {
    if (this.props.auth.uid) return <Redirect to="/"></Redirect>;
    const { classes, authError } = this.props;

    return (
      <Fragment>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlined />
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
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className={
                    this.state.currentPage === 0 ? null : classes.input
                  }
                >
                  <TextField
                    error={Boolean(this.state.formErrors.firstName)}
                    helperText={this.state.formErrors.firstName}
                    onBlur={this.handleBlur}
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
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className={
                    this.state.currentPage === 0 ? null : classes.input
                  }
                >
                  <TextField
                    error={Boolean(this.state.formErrors.lastName)}
                    helperText={this.state.formErrors.lastName}
                    onBlur={this.handleBlur}
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
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.currentPage === 0 ? null : classes.input
                  }
                >
                  <TextField
                    error={Boolean(this.state.formErrors.email)}
                    helperText={this.state.formErrors.email}
                    onBlur={this.handleBlur}
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
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.currentPage === 0 ? null : classes.input
                  }
                >
                  <TextField
                    error={Boolean(this.state.formErrors.password)}
                    helperText={this.state.formErrors.password}
                    onBlur={this.handleBlur}
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
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.currentPage === 0 ? null : classes.input
                  }
                >
                  <TextField
                    error={Boolean(this.state.formErrors.signUpCode)}
                    helperText={this.state.formErrors.signUpCode}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    id="signUpCode"
                    label="Sign Up Code"
                    name="signUpCode"
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  className={
                    this.state.currentPage === 1 ? null : classes.input
                  }
                >
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
                        color="default"
                        fullWidth
                        size="large"
                        variant="contained"
                        startIcon={<PhotoLibrary />}
                      >
                        Add Profile Picture
                      </Button>
                    </label>
                  ) : (
                    <Button
                      size="large"
                      onClick={() =>
                        this.setState({
                          image: null
                        })
                      }
                      component="span"
                      color={"secondary"}
                      fullWidth
                      variant="contained"
                      startIcon={<Close />}
                    >
                      Clear Profile Picture
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.currentPage === 1 ? null : classes.input
                  }
                >
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
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.currentPage === 1 ? null : classes.input
                  }
                >
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
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={6}
                  className={
                    this.state.currentPage === 0 ? classes.input : null
                  }
                >
                  <Button
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                    onClick={() => this.setState({ currentPage: 0 })}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs={this.state.currentPage === 0 ? 12 : 6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submit}
                  >
                    {this.state.currentPage === 0 ? "Next" : "Sign Up"}
                  </Button>
                </Grid>
              </Grid>
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
