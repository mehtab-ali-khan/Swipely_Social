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
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Person as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  FiberManualRecord as DotIcon,
  Message as MessageIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import {
  useActivitiesListQuery,
  useMeRetrieveQuery,
  useUsersListQuery,
} from "../../store/api";

const SuggestedFriends = () => {
  const theme = useTheme();
  const { data: users } = useUsersListQuery();
  const { data: me } = useMeRetrieveQuery();

  return (
    <Paper
      elevation={0}
      sx={{
        maxHeight: "45vh",
        overflow: "auto",
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <PersonAddIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="600">
          Suggested Friends
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {users
          ?.filter((user) => user.id !== me.id)
          .map((user, index) => (
            <ListItem
              key={user.id}
              sx={{
                px: 0,
                py: 1.5,
                borderBottom:
                  index < 6 // Changed from 3 to 6 since you're showing up to 7 users
                    ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                    : "none",
              }}
            >
              <ListItemAvatar>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={user.profile_pic}
                    sx={{
                      width: 48,
                      height: 48,
                      border: `2px solid ${theme.palette.background.paper}`,
                    }}
                  >
                    {/* Fallback to initials if no profile pic */}
                    {!user.profile_pic &&
                      `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()}
                  </Avatar>
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight="600">
                    {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                      "Anonymous User"}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {user.bio || "user has no bio yet."}
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

      {/* Optional: Show message if no users */}
      {(!users || users.length === 0) && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          No suggested friends available
        </Typography>
      )}
    </Paper>
  );
};
// Latest Activities Component
const LatestActivities = () => {
  const theme = useTheme();
  const { data: activities } = useActivitiesListQuery();

  return (
    <Paper
      elevation={0}
      sx={{
        maxHeight: "70vh",
        overflow: "auto",
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
        {activities?.map((activity, index) => (
          <ListItem
            key={activity?.id}
            sx={{
              px: 0,
              gap: "5px",
              py: 1.5,
              borderBottom:
                index < activities.length - 1
                  ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  : "none",
            }}
          >
            <ListItemAvatar>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={activity.userPic}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.main",
                  }}
                >
                  {!activity.userPic &&
                    `${activity.user?.[0] || ""}`.toUpperCase()}
                </Avatar>
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
                  <TrendingUpIcon
                    sx={{ fontSize: "small", color: "secondary.main" }}
                  />
                </Box>
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <Typography component="span" fontWeight="600">
                    {activity.user}
                  </Typography>{" "}
                  {activity.content.toLowerCase()}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {activity.created_at
                    ? formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                      })
                    : "Just now"}{" "}
                  • 🌟
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
// Main RightSidebar Component
function RightSidebar() {
  return (
    <Box>
      <SuggestedFriends />
      <LatestActivities />
    </Box>
  );
}

export default RightSidebar;
