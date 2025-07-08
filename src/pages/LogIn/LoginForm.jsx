import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Divider,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useLoginCreateMutation } from "../../store/generatedApi";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, isError }] = useLoginCreateMutation();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    } else {
      try {
        const result = await login({ login: { email, password } }).unwrap();
        localStorage.setItem("authToken", result.token);
        toast.success("Login successful!");
        navigate("/");
      } catch {
        toast.error("Login failed.");
      }
    }
  };

  return (
    <Stack
      className="loginform"
      color="black"
      sx={{
        width: "450px",
        margin: "0 auto",
      }}
    >
      <form action="" onSubmit={handleSubmit}>
        <Stack sx={{ gap: "15px", marginTop: "20px" }}>
          <Stack>
            <label className="label" htmlFor="Email">
              Work Email
            </label>
            <input
              className="input "
              type="email"
              id="Email"
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
              className="input "
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
          <Typography
            sx={{
              color: "gray",
              cursor: "pointer",
              "&:hover": { color: "rgb(30, 144, 255)" },
            }}
            variant="p"
          >
            Forgot password?
          </Typography>
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
            "Log in"
          )}
        </Button>
      </form>
      <Divider sx={{ marginTop: "35px" }} />
    </Stack>
  );
}

export default LoginForm;
