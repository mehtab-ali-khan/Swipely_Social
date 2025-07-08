import { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";
import { SearchProvider } from "../../store/SearchContext";

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SearchProvider>
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            pt: 10, // Account for fixed navbar
            pb: 3,
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              {/* Main Feed Area */}
              <Grid item xs={12} md={8} lg={7}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Box sx={{ width: "100%", maxWidth: 600 }}>
                    <Outlet />
                  </Box>
                </Box>
              </Grid>

              {/* Right Sidebar - Hidden on mobile */}
              <Grid
                item
                xs={12}
                md={4}
                lg={3}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: 90, // Account for navbar height
                    height: "calc(100vh - 110px)",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                      borderRadius: 3,
                    },
                  }}
                >
                  <RightSidebar />
                </Box>
              </Grid>

              {/* Spacer for centering on large screens */}
              <Grid item lg={2} sx={{ display: { xs: "none", lg: "block" } }} />
            </Grid>
          </Container>
        </Box>
      </SearchProvider>
    </Box>
  );
};

export default HomePage;
