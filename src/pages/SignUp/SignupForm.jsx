import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Divider, Stack, CircularProgress } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useSignupCreateMutation } from "../../store/generatedApi";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [first_name, setfirstname] = useState("");
  const [last_name, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signup, { isLoading, isError }] = useSignupCreateMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !first_name || !last_name) {
      toast.error("Please fill in all required fields.");
      return;
    } else {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      } else {
        try {
          await signup({
            signup: {
              first_name,
              last_name,
              email,
              password,
            },
          }).unwrap();

          toast.success("Signup successful!");
          navigate("/login");
        } catch (error) {
          console.error("signup error :", error);
          toast.error("Signup failed.");
        }
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Stack
      color="black"
      className="signupform"
      sx={{
        width: "450px",
        margin: "0 auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack sx={{ gap: "15px", marginTop: "20px" }}>
          <Stack sx={{ flexDirection: "row", width: "98%", gap: "15px" }}>
            <Stack sx={{ width: "50%" }}>
              <label className="label" htmlFor="firstname">
                First Name
              </label>
              <input
                className="input"
                type="text"
                pattern="[A-Za-z ]+"
                required
                id="firstname"
                value={first_name}
                onChange={(e) => setfirstname(e.target.value)}
                placeholder="First name"
              />
            </Stack>
            <Stack sx={{ width: "50%" }}>
              <label className="label" htmlFor="lastname">
                Last Name
              </label>
              <input
                className="input"
                type="text"
                id="lastname"
                pattern="[A-Za-z ]+"
                required
                value={last_name}
                onChange={(e) => setlastname(e.target.value)}
                placeholder="Last name"
              />
            </Stack>
          </Stack>
          <Stack>
            <label className="label" htmlFor="email">
              Work Email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work Email"
              required
            />
          </Stack>
          <Stack sx={{ position: "relative" }}>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Password"
              minLength="8"
              required
            />
            <Button onClick={handleTogglePassword} className="paswordicon">
              {showPassword ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </Button>
          </Stack>
          <Stack sx={{ position: "relative" }}>
            <label className="label" htmlFor="companypassword">
              Confirm Password
            </label>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              id="companypassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <Button onClick={handleTogglePassword} className="paswordicon">
              {showPassword ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </Button>
          </Stack>
        </Stack>
        <Button
          type="submit"
          className="createaccbtn"
          sx={{
            width: "100%",
            backgroundColor: "rgb(30, 144, 255)",
            color: "white",
            textTransform: "none",
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
      <Divider sx={{ marginTop: "35px" }} />
    </Stack>
  );
}

export default SignupForm;
