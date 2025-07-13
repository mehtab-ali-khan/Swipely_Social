// Improved Responsive Navbar.js - Centered content with essential elements only
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  alpha,
  Fade,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Brightness4,
  Brightness7,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../store/ThemeContext";
import { useNavigate } from "react-router-dom";
import { generatedApi } from "../../store/generatedApi";
import { useDispatch } from "react-redux";
import { useSearch } from "../../store/SearchContext";
import { toast } from "react-toastify";
import { useMeRetrieveQuery, useSearchPostsListQuery } from "../../store/api";

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { mode, toggleTheme } = useThemeMode();
  const { data: user } = useMeRetrieveQuery();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    searchQuery,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    clearSearch,
  } = useSearch();

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchPostsListQuery(
    { q: searchQuery },
    {
      skip: !searchQuery || searchQuery.trim().length < 2,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      setIsSearching(true);
      if (searchData) {
        setSearchResults(searchData);
        setIsSearching(false);
      }
      if (searchError) {
        setSearchResults([]);
        setIsSearching(false);
      }
    } else if (searchQuery === "") {
      setSearchResults(null);
      setIsSearching(false);
    }
  }, [searchData, searchQuery, searchError, setSearchResults, setIsSearching]);

  useEffect(() => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      setIsSearching(searchLoading);
    }
  }, [searchLoading, searchQuery, setIsSearching]);

  useEffect(() => {
    if (searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(generatedApi.util.resetApiState());
    handleClose();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    const trimmedInput = inputValue.trim();

    if (trimmedInput && trimmedInput.length >= 2) {
      setSearchQuery(trimmedInput);
      navigate("/");
    } else if (trimmedInput.length < 2 && trimmedInput.length > 0) {
      toast.warn("Search query must be at least 2 characters");
    } else {
      handleClearSearch();
    }
  };

  const handleClearSearch = () => {
    setInputValue("");
    clearSearch();
    navigate("/");
  };

  const handleHomeClick = () => {
    setInputValue("");
    clearSearch();
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            px: { xs: 1, sm: 2 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Logo/Brand */}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            onClick={handleHomeClick}
            sx={{
              fontWeight: 800,
              cursor: "pointer",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              minWidth: isMobile ? "80px" : "120px",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.2s ease",
              },
            }}
          >
            SWIPELY
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              position: "relative",
              flexGrow: 1,
              maxWidth: { xs: "40vw", sm: 300, md: 400 },
              minWidth: { sm: 200 },
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.04),
                  borderRadius: 3,
                  border: searchFocused
                    ? `2px solid ${theme.palette.primary.main}`
                    : "2px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.15)
                        : alpha(theme.palette.common.black, 0.06),
                  },
                }}
              >
                <IconButton
                  type="submit"
                  onClick={handleSearchButtonClick}
                  disabled={searchLoading}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    color:
                      searchFocused || inputValue
                        ? theme.palette.primary.main
                        : "text.secondary",
                    ml: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      color: "text.disabled",
                    },
                  }}
                >
                  <SearchIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>

                <InputBase
                  placeholder={
                    isMobile ? "Search..." : "Search for posts, people..."
                  }
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  disabled={searchLoading}
                  sx={{
                    ml: 0.5,
                    flex: 1,
                    py: isMobile ? 1 : 1.5,
                    pr: 1,
                    "& .MuiInputBase-input": {
                      fontSize: isMobile ? "0.875rem" : "0.95rem",
                      "&::placeholder": {
                        color: "text.secondary",
                        opacity: 0.7,
                      },
                      "&:disabled": {
                        color: "text.disabled",
                      },
                    },
                  }}
                />

                {searchLoading && (
                  <CircularProgress
                    size={isMobile ? 16 : 20}
                    sx={{
                      color: theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                )}

                {inputValue && !searchLoading && (
                  <IconButton
                    onClick={handleClearSearch}
                    size="small"
                    sx={{
                      mr: 0.5,
                      color: "text.secondary",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "error.main",
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </form>
          </Box>

          {/* Right Side Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: "text.primary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                },
              }}
            >
              {mode === "light" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Profile */}
            <IconButton
              onClick={handleProfileClick}
              sx={{
                p: 0,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s ease",
                },
              }}
            >
              <Avatar
                alt={user?.first_name || "User"}
                src={user?.profile_pic}
                sx={{
                  width: isMobile ? 32 : 40,
                  height: isMobile ? 32 : 40,
                  border: `2px solid ${theme.palette.primary.main}`,
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  boxShadow: theme.shadows[2],
                }}
              >
                {user?.first_name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </IconButton>

            {/* Enhanced Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 12,
                sx: {
                  mt: 1.5,
                  minWidth: 280,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backdropFilter: "blur(20px)",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.95)
                      : alpha(theme.palette.background.paper, 0.95),
                  "& .MuiList-root": {
                    py: 1.5,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              {/* Enhanced Profile Info */}
              <Box sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={user?.profile_pic}
                    sx={{
                      width: 56,
                      height: 56,
                      border: `3px solid ${theme.palette.primary.main}`,
                      boxShadow: theme.shadows[3],
                    }}
                  >
                    {user?.first_name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        color: "text.primary",
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      {user?.first_name || "User"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        opacity: 0.8,
                        wordBreak: "break-word",
                      }}
                    >
                      {user?.email || "user@example.com"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mx: 1.5 }} />

              {/* Enhanced Menu Items */}
              <Box sx={{ px: 1.5, py: 1 }}>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleClose();
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    mb: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PersonIcon
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="View Profile"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LogoutIcon
                      sx={{
                        color: "error.main",
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      color: "error.main",
                    }}
                  />
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
