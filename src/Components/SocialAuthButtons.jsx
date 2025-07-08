import React from "react";
import { Button, Stack } from "@mui/material";

function SocialAuthButtons() {
  const handleGoogleLogin = () => {
    console.log("helo");

    // dispatch(googleLogin())
    //   .unwrap()
    //   .then(() => {
    //     toast.success("SignIn Successful");
    //     navigate("/");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast.error("Something went wrong, please try again later.");
    //   });
  };
  return (
    <Stack
      className="socialauthbtnsbox"
      spacing={{ xs: 1, sm: 2 }}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap", width: "450px", margin: "35px auto" }}
    >
      <Button
        onClick={handleGoogleLogin}
        className="socialauthbtn"
        sx={{ gap: "15px" }}
      >
        <img
          src="https://app.uizard.io/static/media/google.c17df322b408a9f3f31c4bc735c95e04.svg"
          alt=""
        />
        Sign up with Google
      </Button>
      <Button className="socialauthbtn" sx={{ gap: "15px" }}>
        <img
          src="https://app.uizard.io/static/media/microsoft.50b34eacfb43e03f371b3d7034d2b31d.svg"
          alt=""
        />
        Sign up with Microsoft
      </Button>
    </Stack>
  );
}

export default SocialAuthButtons;
