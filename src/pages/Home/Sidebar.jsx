import React, { useEffect } from "react";
import {
  Toolbar,
  Typography,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  Home,
  Group,
  Store,
  Tv,
  History,
  SportsEsports,
  PhotoLibrary,
  VideoLibrary,
  Message,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { generatedApi, useMeRetrieveQuery } from "../../store/generatedApi";

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  // const userData = useSelector((state) => state.user.userData);
  // const user = auth.currentUser;
  const { data: user, isError, isLoading } = useMeRetrieveQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const drawerWidth = 240;
  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(generatedApi.util.resetApiState());
    navigate("/login");
  };

  const mainItems = [
    { text: "Friends", icon: <Home /> },
    { text: "Groups", icon: <Group /> },
    { text: "Marketplace", icon: <Store /> },
    { text: "Watch", icon: <Tv /> },
    { text: "Memories", icon: <History /> },
  ];

  const shortcutItems = [
    { text: "Gaming", icon: <SportsEsports /> },
    { text: "Gallery", icon: <PhotoLibrary /> },
    { text: "Videos", icon: <VideoLibrary /> },
    { text: "Messages", icon: <Message /> },
  ];

  const drawer = (
    <div
      style={{
        height: "100%",
      }}
    >
      <Toolbar />
      <Box
        onClick={handleProfileClick}
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Avatar alt={user?.profile_pic || "User"} src={user?.profile_pic} />
        <Typography
          variant="subtitle1"
          sx={{ ml: 2, textTransform: "capitalize" }}
        >
          {user?.first_name || "User"}
        </Typography>
      </Box>
      <Divider />
      <List>
        {mainItems.map((item) => (
          <ListItem key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography
        variant="caption"
        sx={{
          px: 2,
          py: 1,
          display: "block",
        }}
      >
        Your shortcuts
      </Typography>
      <List>
        {shortcutItems.map((item) => (
          <ListItem key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
        }}
      >
        <Button
          onClick={handleLogout}
          variant="outlined"
          color=""
          fullWidth
          startIcon={<Logout />}
          sx={{ border: "1px solid grey", borderRadius: "8px" }}
        >
          Logout
        </Button>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
