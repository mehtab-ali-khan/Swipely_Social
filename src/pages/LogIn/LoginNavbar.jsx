import React from "react";
import { Link } from "react-router-dom";
import { Box, Toolbar, Typography } from "@mui/material";

function LoginNavbar() {
  return (
    <Toolbar
      className="loginnavbar"
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
          color="black"
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", mr: 1 }}
        >
          Swipely
        </Typography>
      </Box>
      <Box sx={{ fontSize: "13px" }}>
        <Typography color="black" variant="p">
          Not a member yet?{" "}
        </Typography>
        <Link className="loginpagebtn" to="/signup">
          Join
        </Link>
      </Box>
    </Toolbar>
  );
}

export default LoginNavbar;
