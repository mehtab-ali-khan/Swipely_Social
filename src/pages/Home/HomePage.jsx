import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import { Outlet } from "react-router-dom";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Navbar handleDrawerToggle={handleDrawerToggle} />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          mt: 8,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            width: { sm: 240 },
            flexShrink: 0,
          }}
        >
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            p: 2,
          }}
        >
          <Outlet />
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: 300,
            flexShrink: 0,
            height: "calc(100vh - 64px)",
          }}
        >
          <RightSidebar />
        </Box>
      </Box>
    </Box>
  );
}
