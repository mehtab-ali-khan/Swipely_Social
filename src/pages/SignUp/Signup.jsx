import React from "react";
import Stack from "@mui/material/Stack";
import SignupPanel from "./SignupPanel";
import ClientsTestimonials from "../../Components/ClientsTestimonials";

function Signup() {
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <SignupPanel />
      <ClientsTestimonials />
    </Stack>
  );
}

export default Signup;
