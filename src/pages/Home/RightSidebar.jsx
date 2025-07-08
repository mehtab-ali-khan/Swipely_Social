import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  Button,
  useTheme,
  alpha,
  AvatarGroup,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  FiberManualRecord as DotIcon,
  Message as MessageIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

// Dummy data for friends
const friendsData = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    mutualFriends: 12,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isOnline: false,
    mutualFriends: 8,
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    mutualFriends: 15,
  },
  {
    id: 4,
    name: "David Wilson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isOnline: false,
    mutualFriends: 5,
  },
  {
    id: 5,
    name: "Emma Brown",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    isOnline: true,
    mutualFriends: 20,
  },
];

// Dummy data for activities
const activitiesData = [
  {
    id: 1,
    type: "like",
    user: "Alice Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "liked your post about weekend hiking",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    icon: <FavoriteIcon color="error" />,
  },
  {
    id: 2,
    type: "comment",
    user: "Bob Smith",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "commented on your travel photos",
    time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    icon: <CommentIcon color="primary" />,
  },
  {
    id: 3,
    type: "share",
    user: "Carol Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "shared your post about cooking tips",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: <ShareIcon color="success" />,
  },
  {
    id: 4,
    type: "like",
    user: "David Wilson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "liked your workout video",
    time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: <FavoriteIcon color="error" />,
  },
  {
    id: 5,
    type: "comment",
    user: "Emma Brown",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    content: "commented on your book review",
    time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: <CommentIcon color="primary" />,
  },
];

// Suggested Friends Component
const SuggestedFriends = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonAddIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="600">
          Suggested Friends
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {friendsData.slice(0, 4).map((friend, index) => (
          <ListItem
            key={friend.id}
            sx={{
              px: 0,
              py: 1.5,
              borderBottom:
                index < 3
                  ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  : "none",
            }}
          >
            <ListItemAvatar>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={friend.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                />
                {friend.isOnline && (
                  <DotIcon
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      fontSize: 16,
                      color: "success.main",
                    }}
                  />
                )}
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle2" fontWeight="600">
                  {friend.name}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {friend.mutualFriends} mutual friends
                </Typography>
              }
            />
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "600",
                minWidth: 80,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Add
            </Button>
          </ListItem>
        ))}
      </List>

      <Button
        fullWidth
        variant="text"
        sx={{
          mt: 1,
          textTransform: "none",
          fontWeight: "600",
          color: "primary.main",
          borderRadius: 2,
          py: 1,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        See All Suggestions
      </Button>
    </Paper>
  );
};

// Latest Activities Component
const LatestActivities = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TrendingUpIcon sx={{ mr: 1, color: "secondary.main" }} />
        <Typography variant="h6" fontWeight="600">
          Latest Activities
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {activitiesData.map((activity, index) => (
          <ListItem
            key={activity.id}
            sx={{
              px: 0,
              py: 1.5,
              borderBottom:
                index < activitiesData.length - 1
                  ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  : "none",
            }}
          >
            <ListItemAvatar>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={activity.avatar}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    bgcolor: "background.paper",
                    borderRadius: "50%",
                    p: 0.3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(activity.icon, { fontSize: "small" })}
                </Box>
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <Typography component="span" fontWeight="600">
                    {activity.user}
                  </Typography>{" "}
                  {activity.content}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      <Button
        fullWidth
        variant="text"
        sx={{
          mt: 1,
          textTransform: "none",
          fontWeight: "600",
          color: "secondary.main",
          borderRadius: 2,
          py: 1,
          "&:hover": {
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
          },
        }}
      >
        View All Activities
      </Button>
    </Paper>
  );
};

// Trending Topics Component
const TrendingTopics = () => {
  const theme = useTheme();

  const topics = [
    { name: "#Photography", posts: 1234 },
    { name: "#Travel", posts: 892 },
    { name: "#Food", posts: 756 },
    { name: "#Fitness", posts: 543 },
    { name: "#Technology", posts: 432 },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TrendingUpIcon sx={{ mr: 1, color: "warning.main" }} />
        <Typography variant="h6" fontWeight="600">
          Trending Topics
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {topics.map((topic, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
              px: 1.5,
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="600"
                color="primary.main"
              >
                {topic.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {topic.posts} posts
              </Typography>
            </Box>
            <Chip
              label={`#${index + 1}`}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: "600",
                fontSize: "0.75rem",
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Main RightSidebar Component
function RightSidebar() {
  return (
    <Box>
      <SuggestedFriends />
      <LatestActivities />
      <TrendingTopics />
    </Box>
  );
}

export default RightSidebar;
