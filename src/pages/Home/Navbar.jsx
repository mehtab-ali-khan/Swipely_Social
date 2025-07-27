// Improved Responsive Navbar.js - Collapsible search for mobile
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
  Collapse,
  Slide,
} from "@mui/material";
import {
  Search as SearchIcon,
  Brightness4,
  Brightness7,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Clear as ClearIcon,
  Poll,
  Close as CloseIcon,
} from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { useThemeMode } from "../../store/ThemeContext";
import { useNavigate } from "react-router-dom";
import { generatedApi } from "../../store/generatedApi";
import { useDispatch } from "react-redux";
import { useSearch } from "../../store/SearchContext";
import { toast } from "react-toastify";
import { useMeRetrieveQuery, useSearchPostsListQuery } from "../../store/api";
import Notifications from "./Notifications.jsx";

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { mode, toggleTheme } = useThemeMode();
  const { data: user } = useMeRetrieveQuery();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

  // Close mobile search when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setMobileSearchOpen(false);
    }
  }, [isMobile]);

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
    if (isMobile && !mobileSearchOpen) {
      setMobileSearchOpen(true);
      // Auto-focus the input after animation
      setTimeout(() => {
        const input = document.querySelector("#mobile-search-input");
        if (input) input.focus();
      }, 200);
    } else {
      performSearch();
    }
  };

  const performSearch = () => {
    const trimmedInput = inputValue.trim();

    if (trimmedInput && trimmedInput.length >= 2) {
      setSearchQuery(trimmedInput);
      navigate("/");
      if (isMobile) {
        setMobileSearchOpen(false);
      }
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
    if (isMobile) {
      setMobileSearchOpen(false);
    }
  };

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
    setInputValue("");
  };

  const handleHomeClick = () => {
    setInputValue("");
    clearSearch();
    navigate("/");
    if (isMobile) {
      setMobileSearchOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
    if (e.key === "Escape" && isMobile) {
      handleMobileSearchClose();
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
        zIndex: theme.zIndex.appBar,
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
            position: "relative",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Normal Navbar Content */}
          <Slide
            direction="up"
            in={!mobileSearchOpen || !isMobile}
            timeout={{
              enter: 300,
              exit: 200,
            }}
            mountOnEnter
            unmountOnExit={false}
          >
            <Box
              sx={{
                display: mobileSearchOpen && isMobile ? "none" : "flex",
                alignItems: "center",
                justifyContent: { xs: "space-between", sm: "center" },
                gap: { xs: 2, sm: 2, md: 3 },
                width: "100%",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

              {/* Desktop/Tablet Search Bar */}
              {!isMobile && (
                <Box
                  sx={{
                    position: "relative",
                    flexGrow: 1,
                    maxWidth: { sm: 300, md: 400 },
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
                        size="medium"
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
                        <SearchIcon fontSize="medium" />
                      </IconButton>

                      <InputBase
                        placeholder="Search for posts, people..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        disabled={searchLoading}
                        sx={{
                          ml: 0.5,
                          flex: 1,
                          py: 1.5,
                          pr: 1,
                          "& .MuiInputBase-input": {
                            fontSize: "0.95rem",
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
                          size={20}
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
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
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
              )}

              {/* Right Side Controls */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 1 },
                }}
              >
                {/* Mobile Search Icon */}
                {isMobile && (
                  <IconButton
                    onClick={handleSearchButtonClick}
                    size="small"
                    sx={{
                      color: "text.primary",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                )}

                {/* Theme Toggle */}
                <IconButton
                  onClick={toggleTheme}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    color: "text.primary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {mode === "light" ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                {/* Notifications */}
                <Notifications isMobile={isMobile} />

                {/* Profile */}
                <IconButton
                  onClick={handleProfileClick}
                  sx={{
                    p: 0,
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
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
              </Box>
            </Box>
          </Slide>

          {/* Mobile Search Mode */}
          <Slide
            direction="down"
            in={mobileSearchOpen && isMobile}
            timeout={{
              enter: 300,
              exit: 200,
            }}
            mountOnEnter
            unmountOnExit
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                px: 2,
                gap: 1,
                bgcolor: "inherit",
                backdropFilter: "inherit",
                zIndex: 1,
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={handleMobileSearchClose}
                size="small"
                sx={{
                  color: "text.secondary",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Mobile Search Input */}
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
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
                      border: `2px solid ${theme.palette.primary.main}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <IconButton
                      type="submit"
                      disabled={searchLoading}
                      size="small"
                      sx={{
                        color: theme.palette.primary.main,
                        ml: 0.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          transform: "scale(1.05)",
                        },
                        "&:disabled": {
                          color: "text.disabled",
                        },
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>

                    <InputBase
                      id="mobile-search-input"
                      placeholder="Search..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      disabled={searchLoading}
                      autoFocus
                      sx={{
                        ml: 0.5,
                        flex: 1,
                        py: 1,
                        pr: 1,
                        "& .MuiInputBase-input": {
                          fontSize: "0.875rem",
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
                        size={16}
                        sx={{
                          color: theme.palette.primary.main,
                          mr: 1,
                        }}
                      />
                    )}

                    {inputValue && !searchLoading && (
                      <IconButton
                        onClick={() => setInputValue("")}
                        size="small"
                        sx={{
                          mr: 0.5,
                          color: "text.secondary",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: "error.main",
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
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
            </Box>
          </Slide>

          {/* Enhanced Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            TransitionComponent={Fade}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            sx={{
              zIndex: theme.zIndex.modal,
            }}
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
                onClick={() => {
                  navigate("/poll");
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
                  <Poll
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: 20,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="View Polls"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </MenuItem>

              {/* Friends - Only show on screens < 900px */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MenuItem
                  onClick={() => {
                    navigate("/friends");
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
                    <PeopleIcon
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Friends"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </MenuItem>
              </Box>

              {/* Activities - Only show on screens < 900px */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <MenuItem
                  onClick={() => {
                    navigate("/activities");
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
                    <LocalActivityIcon
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Activities"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </MenuItem>
              </Box>

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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
