import React from "react";
import { Box } from "@mui/material";
import LoginForm from "./LoginForm";
import LoginNavbar from "./LoginNavbar";
import SocialAuthButtons from "../../Components/SocialAuthButtons";

function LoginPanel() {
  return (
    <Box className="loginpanel" sx={{ width: "50%", bgcolor: "#ffffff" }}>
      <LoginNavbar />
      <LoginForm />
      <SocialAuthButtons />
    </Box>
  );
}

export default LoginPanel;
