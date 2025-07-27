// Notifications.js
import React, { useState, useEffect } from "react";
import {
  IconButton,
  useTheme,
  alpha,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Fade,
  Slide,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Favorite,
  Create,
  Comment,
  Poll,
  HowToVote,
} from "@mui/icons-material";
import { data, useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Notifications({ isMobile = false }) {
  const theme = useTheme();
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // WebSocket connection
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${authToken}`;

    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "activity_notification") {
        const notification = {
          id: data.id,
          message: data.message,
          activity_type: data.activity_type,
          timestamp: data.timestamp,
          isNew: true,
        };

        setNotifications((prev) => [notification, ...prev]);
        setHasNewNotification(true);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log("Attempting to reconnect...");
        // You might want to implement reconnection logic here
      }, 3000);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  const handleNotificationClick = () => {
    setHasNewNotification(false);
    setIsModalOpen(true);

    // Mark all notifications as read
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isNew: false }))
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsModalOpen(false);
  };

  const handleNotifyClick = (activity_type, id) => {
    setIsModalOpen(false);
    if (
      activity_type == "post_created" ||
      activity_type == "post_liked" ||
      activity_type == "post_commented"
    ) {
      navigate(`/#post-${id}`);
    } else if (
      activity_type == "poll_created" ||
      activity_type == "poll_voted"
    ) {
      navigate(`/poll#poll-${id}`);
    }
  };

  const getActivityIcon = (activityType) => {
    switch (activityType?.toLowerCase()) {
      case "post_liked":
        return <Favorite sx={{ color: "#e91e63" }} />;
      case "post_created":
        return <Create sx={{ color: theme.palette.primary.main }} />;
      case "post_commented":
        return <Comment sx={{ color: theme.palette.info.main }} />;
      case "poll_created":
        return <Poll sx={{ color: theme.palette.secondary.main }} />;
      case "poll_voted":
        return <HowToVote sx={{ color: theme.palette.success.main }} />;
      default:
        return (
          <NotificationsIcon sx={{ color: theme.palette.text.secondary }} />
        );
    }
  };

  const getActivityColor = (activityType) => {
    switch (activityType?.toLowerCase()) {
      case "post_liked":
        return "#e91e63";
      case "post_created":
        return theme.palette.primary.main;
      case "post_commented":
        return theme.palette.info.main;
      case "poll_created":
        return theme.palette.secondary.main;
      case "poll_voted":
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getActivityLabel = (activityType) => {
    switch (activityType?.toLowerCase()) {
      case "post_liked":
        return "Post Liked";
      case "post_created":
        return "New Post";
      case "post_commented":
        return "New Comment";
      case "poll_created":
        return "New Poll";
      case "poll_voted":
        return "Poll Vote";
      default:
        return (
          activityType
            ?.replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) || "Notification"
        );
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Badge
        variant="dot"
        invisible={!hasNewNotification}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.6)}`,
            animation: hasNewNotification ? "pulse 2s infinite" : "none",
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
                opacity: 1,
              },
              "50%": {
                transform: "scale(1.2)",
                opacity: 0.7,
              },
              "100%": {
                transform: "scale(1)",
                opacity: 1,
              },
            },
          },
        }}
      >
        <IconButton
          onClick={handleNotificationClick}
          size={isMobile ? "small" : "medium"}
          sx={{
            color: "text.primary",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              transform: "scale(1.05)",
            },
          }}
        >
          <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Badge>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.2)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Notifications
          <Box display="flex" gap={1}>
            {notifications.length > 0 && (
              <Button
                size="small"
                onClick={clearAllNotifications}
                sx={{
                  textTransform: "none",
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Clear All
              </Button>
            )}
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, maxHeight: "60vh", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={6}
              px={3}
            >
              <NotificationsIcon
                sx={{
                  fontSize: 64,
                  color: alpha(theme.palette.text.secondary, 0.3),
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                When you receive notifications, they'll appear here
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    onClick={() =>
                      handleNotifyClick(
                        notification.activity_type,
                        notification.id
                      )
                    }
                    sx={{
                      cursor: "pointer",
                      py: 2,
                      px: 3,
                      transition: "all 0.2s ease",
                      backgroundColor: notification.isNew
                        ? alpha(theme.palette.primary.main, 0.05)
                        : "transparent",
                      borderLeft: notification.isNew
                        ? `4px solid ${theme.palette.primary.main}`
                        : "4px solid transparent",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.action.hover,
                          0.04
                        ),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mr: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        pt: 0.5,
                      }}
                    >
                      {getActivityIcon(notification.activity_type)}
                    </Box>
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={0.5}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            color="text.primary"
                          >
                            {getActivityLabel(notification.activity_type)}
                          </Typography>
                          <Chip
                            label={formatTimestamp(notification.timestamp)}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              borderColor: alpha(
                                getActivityColor(notification.activity_type),
                                0.3
                              ),
                              color: getActivityColor(
                                notification.activity_type
                              ),
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            lineHeight: 1.4,
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ ml: 7, opacity: 0.6 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Notifications;
