import React from "react";
import { Typography, Avatar, Box, Paper, Badge } from "@mui/material";

function RightSidebar() {
  // const suggestions = [
  //   { id: 1, name: "Jane Doe", avatar: "/api/placeholder/40/40" },
  //   { id: 2, name: "Jane Doe", avatar: "/api/placeholder/40/40" },
  // ];

  const activities = [
    {
      id: 1,
      name: "Jane Doe",
      action: "changed their cover picture",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Jane Doe",
      action: "liked a post",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Jane Doe",
      action: "liked a comment",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 4,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 6,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 7,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 8,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 9,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 10,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 11,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 12,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 13,
      name: "Jane Doe",
      action: "posted",
      time: "1 min ago",
      avatar: "/api/placeholder/40/40",
    },
  ];

  return (
    <Box>
      {/* Activities */}
      <Paper className="feed-container" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Latest Activities
        </Typography>
        {activities.map((activity) => (
          <Box
            key={activity.id}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Avatar src={activity.avatar} alt={activity.name} sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2">
                <Typography component="span" fontWeight="medium">
                  {activity.name}
                </Typography>{" "}
                {activity.action}
              </Typography>
              <Typography variant="caption">{activity.time}</Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default RightSidebar;
