import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Divider,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import { Send as SendIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFriendsChatListQuery, useMeRetrieveQuery } from "../../store/api";

const getCurrentUserId = () => {
  const { data: me } = useMeRetrieveQuery();
  return me?.id;
};

const formatMessageTime = (timestamp) => {
  const date = parseISO(timestamp);
  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, "HH:mm")}`;
  } else {
    return format(date, "MMM dd, HH:mm");
  }
};
function ChatMessage({ message, isOwn, friendInfo }) {
  const theme = useTheme();

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: "flex",
          justifyContent: isOwn ? "flex-end" : "flex-start",
          mb: 2,
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        {!isOwn && (
          <Avatar
            src={friendInfo?.profilePic}
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.9rem",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            {friendInfo?.name?.charAt(0).toUpperCase()}
          </Avatar>
        )}

        <Box
          sx={{
            maxWidth: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: isOwn ? "flex-end" : "flex-start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: isOwn ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
              background: isOwn
                ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                : theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.8)
                  : alpha(theme.palette.grey[100], 0.8),
              color: isOwn ? "white" : theme.palette.text.primary,
              border: `1px solid ${alpha(
                isOwn ? theme.palette.primary.main : theme.palette.divider,
                0.2
              )}`,
              backdropFilter: "blur(10px)",
              boxShadow: isOwn
                ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                : `0 4px 20px ${alpha(theme.palette.grey[500], 0.1)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: isOwn
                  ? `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                  : `0 6px 25px ${alpha(theme.palette.grey[500], 0.15)}`,
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                wordBreak: "break-word",
                lineHeight: 1.5,
                fontSize: "0.95rem",
              }}
            >
              {message.message}
            </Typography>
          </Paper>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              mt: 0.5,
              fontSize: "0.75rem",
            }}
          >
            {formatMessageTime(message.timestamp)}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

function Chat() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { name, bio, profilePic } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const currentUserId = getCurrentUserId();

  const {
    data: chat,
    isLoading,
    refetch,
  } = useFriendsChatListQuery({
    friendId: userId,
  });

  // Load previous chat messages
  useEffect(
    () => {
      refetch();

      if (chat && Array.isArray(chat)) {
        setMessages(chat);
      }
    },
    [chat],
    []
  );

  // WebSocket setup
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const wsUrl = `ws://localhost:8000/ws/chat/${userId}/?token=${authToken}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Create the received message
      const newMsg = {
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.sender === newMsg.sender &&
            msg.receiver === newMsg.receiver &&
            msg.message === newMsg.message &&
            Math.abs(new Date(msg.timestamp) - new Date(newMsg.timestamp)) <
              1000 // Within 1 second
        );

        if (isDuplicate) {
          console.log("Duplicate message detected, not adding");
          return prev;
        }

        return [...prev, newMsg];
      });
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage.trim(),
      receiver: parseInt(userId),
    };

    // Send through WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageData));
    }

    // Clear the input immediately
    setNewMessage("");

    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Friend info (from location state or fallback)
  const friendInfo = {
    name: name || `User ${userId}`,
    bio: bio || "",
    profilePic: profilePic || "/api/placeholder/40/40",
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          height: "calc(100vh - 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading chat...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chat Header */}
      <Zoom in timeout={300}>
        <Card
          sx={{
            borderRadius: "20px 20px 0 0",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 2, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
                <BackIcon />
              </IconButton>

              <Avatar
                src={friendInfo.profilePic}
                sx={{
                  width: 48,
                  height: 48,
                  border: "3px solid rgba(255,255,255,0.3)",
                  fontSize: "1.2rem",
                }}
              >
                {friendInfo.name.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="700">
                  {friendInfo.name}
                </Typography>
                {friendInfo.bio && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {friendInfo.bio}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Zoom>

      {/* Messages Container */}
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          background:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-track": {
              background: alpha(theme.palette.divider, 0.1),
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              background: alpha(theme.palette.primary.main, 0.3),
              borderRadius: 3,
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.5),
              },
            },
          }}
        >
          {/* Messages */}
          {messages.map((message, index) => {
            const isOwn = message.sender === currentUserId;
            return (
              <ChatMessage
                key={`${message.timestamp}-${index}`}
                message={message}
                isOwn={isOwn}
                friendInfo={friendInfo}
              />
            );
          })}

          <div ref={messagesEndRef} />
        </CardContent>

        <Divider />

        {/* Message Input */}
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(10px)",
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: "0.95rem",
                },
              }}
            />

            <Tooltip title="Send message">
              <span>
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: "white",
                    width: 48,
                    height: 48,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      background: alpha(theme.palette.action.disabled, 0.3),
                      color: theme.palette.action.disabled,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Chat;
