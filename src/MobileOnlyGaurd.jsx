import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

// Guard component for mobile-only routes
const MobileOnlyGuard = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobile) {
      // Redirect to home if accessing from desktop
      navigate("/", { replace: true });
    }
  }, [isMobile, navigate]);

  // Don't render anything on desktop
  if (!isMobile) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Alternative: Using window.innerWidth for more precise control
const MobileOnlyGuardWithWidth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth >= 900) {
        navigate("/", { replace: true });
      }
    };

    // Check on mount
    checkScreenWidth();

    // Listen for resize events
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, [navigate]);

  // Don't render on desktop
  if (window.innerWidth >= 900) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export { MobileOnlyGuard, MobileOnlyGuardWithWidth };
