import React from "react";
import { Box } from "@mui/material";
import SignupNavbar from "./SignupNavbar";
import SignupForm from "./SignupForm";
import SocialAuthButtons from "../../Components/SocialAuthButtons";

function SignupPanel() {
  return (
    <Box
      className="signuppanel"
      sx={{ width: "50%", height: "100vh", bgcolor: "#ffffff" }}
    >
      <SignupNavbar />
      <SignupForm />
      <SocialAuthButtons />
    </Box>
  );
}

export default SignupPanel;
