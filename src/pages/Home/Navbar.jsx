import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Avatar,
  Box,
  styled,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useThemeMode } from "../../store/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useMeRetrieveQuery } from "../../store/generatedApi";

const Search = styled("div")({
  position: "relative",
  borderRadius: 10,
  border: "1px solid grey",
  marginRight: 16,
  marginLeft: 0,
  width: "40vw !important",
  "@media (min-width: 600px)": {
    marginLeft: 24,
    width: "auto",
  },
});

const SearchIconWrapper = styled("div")({
  padding: "0 16px",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledInputBase = styled(InputBase)({
  width: "100%",
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: "8px 8px 8px 0",
    paddingLeft: "calc(1em + 32px)",
    transition: "width 0.2s",
    width: "100%",
    "@media (min-width: 960px)": {
      width: "20ch",
    },
  },
});

function Navbar({ handleDrawerToggle }) {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const { data: user, isError, isLoading } = useMeRetrieveQuery();
  // const user = auth.currentUser;
  // const userData = useSelector((state) => state.user.userData);
  // const searchTerm = useSelector((state) => state.search.searchTerm);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (user?.uid) {
  //     dispatch(fetchUserData(user.uid));
  //   }
  // }, [user, dispatch]);
  // const handleSearchChange = (e) => {
  //   dispatch(setSearchTerm(e.target.value));
  // };

  // const handleClearSearch = () => {
  //   dispatch(clearSearch());
  // };

  return (
    <AppBar
      position="fixed"
      color=""
      sx={{
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", margin: "0 2vw" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          onClick={() => navigate("/")}
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
        >
          SWIPELY
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search posts..."
            inputProps={{ "aria-label": "search" }}
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
          {/* {searchTerm && (
            <IconButton
              size="small"
              onClick={handleClearSearch}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )} */}
        </Search>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Avatar alt={user?.profile_pic || "User"} src={user?.profile_pic} />
            <Typography
              variant="subtitle2"
              sx={{
                ml: 1,
                textTransform: "capitalize",
                display: { xs: "none", sm: "block" },
              }}
            >
              {user?.first_name || "User"}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
