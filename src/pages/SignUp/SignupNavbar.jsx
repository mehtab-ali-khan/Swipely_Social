import React from "react";
import { Link } from "react-router-dom";
import { Box, Toolbar, Typography } from "@mui/material";

function SignupNavbar() {
  return (
    <Toolbar
      className="signupnavbar"
      sx={{
        justifyContent: "space-between",
        padding: "3rem ",
        margin: "0 25px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          gap: "10px",
        }}
      >
        <img src="../public/logo.png" alt="" className="auth-logo" />
        <Typography
          variant="h6"
          component="div"
          color="black"
          sx={{ fontWeight: "bold", mr: 1 }}
        >
          Swipely
        </Typography>
      </Box>
      <Box sx={{ fontSize: "13px" }}>
        <Typography color="black" variant="p">
          Already have an account?{" "}
        </Typography>
        <Link className="loginpagebtn" to="/login">
          Log in
        </Link>
      </Box>
    </Toolbar>
  );
}

export default SignupNavbar;
