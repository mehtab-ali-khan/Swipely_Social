import React from "react";
import { Stack } from "@mui/material";
import LoginPanel from "./LoginPanel";
import ClientsTestimonials from "../../Components/ClientsTestimonials";

function Login() {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <LoginPanel />
      <ClientsTestimonials />
    </Stack>
  );
}

export default Login;
