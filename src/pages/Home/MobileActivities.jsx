import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  alpha,
  useTheme,
  CircularProgress,
  AppBar,
  Container,
  Fade,
  useMediaQuery,
  Zoom,
  Card,
  CardContent,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  ArrowBack as ArrowBackIcon,
  PersonAdd,
} from "@mui/icons-material";
import { useActivitiesListQuery } from "../../store/api";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

// Mobile Activities Management Component
const MobileActivities = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleArrowBack = () => {
    navigate("/");
  };

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
                <TrendingUpIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="800">
                    Activities
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Discover and engage with your community
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
        <Box
          sx={{
            py: 2,
          }}
        >
          <Fade in={true} timeout={300}>
            <Box>
              <MobileActivitiesList />
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

// Mobile Activities List Component
const MobileActivitiesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: activities, isLoading } = useActivitiesListQuery();

  // Handle activity click
  const handleActivityClick = (activity) => {
    if (activity.poll) {
      navigate(`/poll#poll-${activity.poll}`);
    } else if (activity.post) {
      navigate(`/#post-${activity.post}`);
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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
        Recent activity from your network
      </Typography>

      <List sx={{ p: 0 }}>
        {activities?.map((activity, index) => (
          <ListItem
            key={activity?.id}
            onClick={() => handleActivityClick(activity)}
            sx={{
              px: 2,
              py: 2,
              gap: "14px",
              cursor: activity.poll || activity.post ? "pointer" : "default",
              borderRadius: 2,
              mb: 1,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              "&:hover": {
                bgcolor:
                  activity.poll || activity.post
                    ? alpha(theme.palette.primary.main, 0.05)
                    : "background.paper",
                borderColor:
                  activity.poll || activity.post
                    ? alpha(theme.palette.primary.main, 0.3)
                    : alpha(theme.palette.divider, 0.3),
              },
              "&:active": {
                transform:
                  activity.poll || activity.post ? "scale(0.98)" : "none",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemAvatar>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={activity.userPic}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "primary.main",
                    border: `2px solid ${theme.palette.background.paper}`,
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
                    bgcolor: "secondary.main",
                    borderRadius: "50%",
                    p: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  <TrendingUpIcon
                    sx={{
                      fontSize: 16,
                      color: "secondary.contrastText",
                    }}
                  />
                </Box>
              </Box>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{ mb: 0.5 }}
                >
                  <Typography component="span" fontWeight="600">
                    {activity.user}
                  </Typography>{" "}
                  <Typography
                    component="span"
                    fontWeight="400"
                    color="text.secondary"
                  >
                    {activity.content.toLowerCase()}
                  </Typography>
                  {/* Add visual indicator for clickable items */}
                  {(activity.poll || activity.post) && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.75rem",
                        color: "primary.main",
                        ml: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      • Click to view
                    </Typography>
                  )}
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

      {(!activities || activities.length === 0) && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <TrendingUpIcon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Activities Yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Activities from your network will appear here
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MobileActivities;
