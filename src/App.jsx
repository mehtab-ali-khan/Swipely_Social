import { useMemo } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Navigate, RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import { useThemeMode } from "./store/ThemeContext";
import { createTheme, CssBaseline } from "@mui/material";

import { getDesignTokens } from "./theme/theme";
import HomePage from "./pages/Home/HomePage";
import Signup from "./pages/SignUp/Signup";
import Login from "./pages/LogIn/Login";
import "./index.css";
import Feed from "./pages/Home/Feed";
import Profile from "./pages/Home/Profile";

const HomeProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("authToken");
  return user ? children : <Navigate to="/signup" />;
};
const SignupProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("authToken");
  return !user ? children : <Navigate to="/" />;
};
const LoginProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("authToken");
  return !user ? children : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/signup",
    element: (
      <SignupProtectedRoute>
        <Signup />
      </SignupProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <LoginProtectedRoute>
        <Login />
      </LoginProtectedRoute>
    ),
  },

  {
    path: "/",
    element: (
      <HomeProtectedRoute>
        <HomePage />
      </HomeProtectedRoute>
    ),
    children: [
      { path: "", element: <Feed /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

function App() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
