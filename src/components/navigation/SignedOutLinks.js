import React from "react";

// React Router Imports
import { Link } from "react-router-dom";

// Material UI Imports
import { Button } from "@material-ui/core";

const SignedOutLinks = () => {
  return (
    <Button component={Link} to="/signin" color="inherit">
      Sign In
    </Button>
  );
};

export default SignedOutLinks;
