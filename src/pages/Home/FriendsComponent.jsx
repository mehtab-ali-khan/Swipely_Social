import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Tabs,
  Tab,
  alpha,
  useTheme,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  useSuggestedFriendsListQuery,
  useFriendRequestsListQuery,
  useFriendsListQuery,
  useFriendSendRequestCreateMutation,
  useFriendRequestCreateMutation,
  useMeRetrieveQuery,
} from "../../store/api";
import { useNavigate } from "react-router-dom";

// Main Friends Management Component
const FriendsManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    {
      icon: <PersonAddIcon />,
      label: "Suggested",
      component: <SuggestedFriends />,
    },
    {
      icon: <PersonAddAlt1Icon />,
      label: "Requests",
      component: <FriendRequests />,
    },
    { icon: <PeopleIcon />, label: "Friends", component: <Friends /> },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        maxHeight: "45vh",
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          "& .MuiTabs-indicator": {
            borderRadius: 2,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            label={tab.label}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ overflow: "auto", maxHeight: "calc(45vh - 120px)" }}>
        {tabs[activeTab].component}
      </Box>
    </Paper>
  );
};

// 1. Suggested Friends Component
const SuggestedFriends = () => {
  const theme = useTheme();
  const { data: me } = useMeRetrieveQuery();
  const { data: suggestedFriends, isLoading } = useSuggestedFriendsListQuery();
  const [sendFriendRequest, { isLoading: isSending }] =
    useFriendSendRequestCreateMutation();

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest({ userId }).unwrap();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  const getButtonContent = (friend) => {
    if (friend.status == "pending") {
      return { text: "Pending", disabled: true, color: "warning" };
    }
    if (friend.status == "declined") {
      return { text: "Declined", disabled: true, color: "warning" };
    }
    return { text: "Add", disabled: false, color: "primary" };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const filteredFriends =
    suggestedFriends?.filter(
      (user) => user.email !== "admin@example.com" && user.id !== me?.id
    ) || [];

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonAddIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="600">
          Suggested Friends
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {filteredFriends.map((friend, index) => {
          const buttonProps = getButtonContent(friend);

          return (
            <ListItem
              key={friend.id}
              sx={{
                px: 0,
                py: 1.5,
                borderBottom:
                  index < filteredFriends.length - 1
                    ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                    : "none",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={friend.profile_pic}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {!friend.profile_pic &&
                    `${friend.first_name?.[0] || ""}${friend.last_name?.[0] || ""}`.toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight="600">
                    {`${friend.first_name || ""} ${friend.last_name || ""}`.trim() ||
                      "Anonymous User"}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {friend.bio || "User has no bio yet."}
                  </Typography>
                }
              />

              <Button
                size="small"
                variant={buttonProps.disabled ? "outlined" : "contained"}
                color={buttonProps.color}
                disabled={buttonProps.disabled || isSending}
                onClick={() =>
                  !buttonProps.disabled && handleSendRequest(friend.id)
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "600",
                  minWidth: 80,
                }}
              >
                {buttonProps.text}
              </Button>
            </ListItem>
          );
        })}
      </List>

      {filteredFriends.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}
        >
          No suggested friends available
        </Typography>
      )}
    </>
  );
};

// 2. Friend Requests Component
const FriendRequests = () => {
  const theme = useTheme();
  const { data: friendRequests, isLoading } = useFriendRequestsListQuery();
  const [handleRequest, { isLoading: isHandling }] =
    useFriendRequestCreateMutation();

  const handleFriendRequest = async (userId, action) => {
    try {
      await handleRequest({ userId, q: action }).unwrap();
    } catch (error) {
      console.error(`Failed to ${action} friend request:`, error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonAddAlt1Icon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="600">
          Friend Requests
        </Typography>
        {friendRequests && friendRequests.length > 0 && (
          <Chip
            label={friendRequests.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      <List sx={{ p: 0 }}>
        {friendRequests?.map((request, index) => (
          <ListItem
            key={request.sender}
            sx={{
              px: 0,
              py: 1.5,
              borderBottom:
                index < friendRequests.length - 1
                  ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  : "none",
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={request?.profile_pic}
                sx={{
                  width: 48,
                  height: 48,
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              >
                {request.sender.toString()[0]}{" "}
                {/* You might want to fetch user details */}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography variant="subtitle2" fontWeight="600">
                  {request?.name}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  Sent {new Date(request.created_at).toLocaleDateString()}
                </Typography>
              }
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                color="success"
                disabled={isHandling}
                onClick={() => handleFriendRequest(request.sender, "accept")}
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                  },
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                disabled={isHandling}
                onClick={() => handleFriendRequest(request.sender, "decline")}
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.2) },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {(!friendRequests || friendRequests.length === 0) && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}
        >
          No friend requests
        </Typography>
      )}
    </>
  );
};

// 3. Friends Component
const Friends = () => {
  const theme = useTheme();
  const { data: friends, isLoading } = useFriendsListQuery();
  const navigate = useNavigate();

  const handleClick = (userId, userName, userBio, userProfilePic) => {
    navigate(`/chat/${userId}`, {
      state: {
        name: userName,
        bio: userBio,
        profilePic: userProfilePic,
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="600">
          Friends
        </Typography>
        {friends && friends.length > 0 && (
          <Chip
            label={friends.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      <List sx={{ p: 0 }}>
        {friends?.map((friend, index) => (
          <ListItem
            key={friend.id}
            onClick={() =>
              handleClick(
                friend.id,
                friend.full_name,
                friend.bio,
                friend.profile_pic
              )
            }
            sx={{
              px: 0,
              cursor: "pointer",
              py: 1.5,
              borderBottom:
                index < friends.length - 1
                  ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  : "none",
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={friend?.profile_pic}
                sx={{
                  width: 48,
                  height: 48,
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              >
                {!friend.profile_pic &&
                  `${friend.full_name?.[0] || ""}`.toUpperCase()}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography variant="subtitle2" fontWeight="600">
                  {friend.full_name || "Anonymous User"}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {friend.bio || "No bio available"}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {(!friends || friends.length === 0) && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}
        >
          No friends yet
        </Typography>
      )}
    </>
  );
};

export default FriendsManagement;
