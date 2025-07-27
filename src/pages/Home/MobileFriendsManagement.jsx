import React, { useState } from "react";
import {
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
  Container,
  Fade,
  Card,
  CardContent,
  useMediaQuery,
  Zoom,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
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

// Mobile Friends Management Component
const MobileFriendsManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleArrowBack = () => {
    navigate("/");
  };

  const tabs = [
    {
      icon: <PersonAddIcon />,
      label: "Suggested",
      component: <MobileSuggestedFriends />,
    },
    {
      icon: <PersonAddAlt1Icon />,
      label: "Requests",
      component: <MobileFriendRequests />,
    },
    {
      icon: <PeopleIcon />,
      label: "Friends",
      component: <MobileFriends />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Content with scrollable header */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          py: 0,
          px: { xs: 0, sm: 3 },
        }}
      >
        {/* Header that scrolls with content */}
        <Zoom in timeout={300}>
          <Card
            sx={{
              mt: 2,
              mb: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.1"/></svg>\')',
              },
            }}
          >
            <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PeopleIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="800">
                    Friends
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Connect with people and build your network
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {/* Tabs */}
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            mb: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                minHeight: 56,
                textTransform: "none",
                fontWeight: 600,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="top"
              />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            py: 2,
          }}
        >
          <Fade in={true} timeout={300}>
            <Box>{tabs[activeTab].component}</Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

// Mobile Suggested Friends Component
const MobileSuggestedFriends = () => {
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
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredFriends =
    suggestedFriends?.filter(
      (user) => user.email !== "admin@example.com" && user.id !== me?.id
    ) || [];

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
        People you may know
      </Typography>

      <List sx={{ p: 0 }}>
        {filteredFriends.map((friend) => {
          const buttonProps = getButtonContent(friend);

          return (
            <ListItem
              key={friend.id}
              sx={{
                px: 2,
                py: 2,
                borderRadius: 2,
                mb: 1,
                bgcolor: "background.paper",
                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                transition: "all 0.2s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  width: "100%",
                  gap: "15px",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={friend.profile_pic}
                    sx={{
                      width: 56,
                      height: 56,
                      border: `2px solid ${theme.palette.background.paper}`,
                    }}
                  >
                    {!friend.profile_pic &&
                      `${friend.first_name?.[0] || ""}${friend.last_name?.[0] || ""}`.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ mb: 0.5 }}
                    >
                      {`${friend.first_name || ""} ${friend.last_name || ""}`.trim() ||
                        "Anonymous User"}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {friend.bio || "User has no bio yet."}
                    </Typography>
                  }
                />
              </Box>

              <Button
                fullWidth
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
                  py: 1,
                }}
              >
                {buttonProps.text}
              </Button>
            </ListItem>
          );
        })}
      </List>

      {filteredFriends.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <PersonAddIcon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Suggestions
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Check back later for friend suggestions
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Mobile Friend Requests Component
const MobileFriendRequests = () => {
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
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Friend requests
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
        {friendRequests?.map((request) => (
          <ListItem
            key={request.sender}
            sx={{
              px: 2,
              py: 2,
              borderRadius: 2,
              mb: 1,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                width: "100%",
                gap: "15px",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={request?.profile_pic}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {request.sender.toString()[0]}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    sx={{ mb: 0.5 }}
                  >
                    {request?.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Sent {new Date(request.created_at).toLocaleDateString()} •
                    👋
                  </Typography>
                }
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                disabled={isHandling}
                onClick={() => handleFriendRequest(request.sender, "accept")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "600",
                  py: 1,
                }}
                startIcon={<CheckIcon />}
              >
                Accept
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                disabled={isHandling}
                onClick={() => handleFriendRequest(request.sender, "decline")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "600",
                  py: 1,
                }}
                startIcon={<CloseIcon />}
              >
                Decline
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      {(!friendRequests || friendRequests.length === 0) && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <PersonAddAlt1Icon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Friend Requests
          </Typography>
          <Typography variant="body2" color="text.disabled">
            You don't have any pending friend requests
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Mobile Friends Component
const MobileFriends = () => {
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
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Your friends
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
              gap: "15px",
              px: 2,
              py: 2,
              cursor: "pointer",
              borderRadius: 2,
              mb: 1,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={friend?.profile_pic}
                sx={{
                  width: 56,
                  height: 56,
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              >
                {!friend.profile_pic &&
                  `${friend.full_name?.[0] || ""}`.toUpperCase()}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{ mb: 0.5 }}
                >
                  {friend.full_name || "Anonymous User"}
                  {/* Add visual indicator for clickable items */}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.75rem",
                      color: "primary.main",
                      ml: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    • Click to chat
                  </Typography>
                </Typography>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {friend.bio || "No bio available"} • 👥
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {(!friends || friends.length === 0) && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <PeopleIcon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Friends Yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Start connecting with people!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MobileFriendsManagement;
