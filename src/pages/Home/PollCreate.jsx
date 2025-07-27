// CreatePoll.js - Separate Poll Component
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Typography,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  Fade,
} from "@mui/material";
import {
  Close,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
  Poll as PollIcon,
} from "@mui/icons-material";
import { useMeRetrieveQuery, usePollCreateMutation } from "../../store/api";

function CreatePoll({ open, onClose }) {
  const theme = useTheme();
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [nextOptionId, setNextOptionId] = useState(3);
  const [pollLoading, setPollLoading] = useState(false);

  const { data: user } = useMeRetrieveQuery();
  const [createPoll] = usePollCreateMutation();

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, { id: nextOptionId, text: "" }]);
      setNextOptionId(nextOptionId + 1);
    }
  };

  const handleRemovePollOption = (id) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((option) => option.id !== id));
    }
  };

  const handlePollOptionChange = (id, text) => {
    setPollOptions(
      pollOptions.map((option) =>
        option.id === id ? { ...option, text } : option
      )
    );
  };

  const resetPoll = () => {
    setPollQuestion("");
    setPollOptions([
      { id: 1, text: "" },
      { id: 2, text: "" },
    ]);
    setNextOptionId(3);
  };

  const handlePollSubmit = async (e) => {
    e.preventDefault();

    if (!pollQuestion.trim()) {
      toast.error("Please enter a poll question!");
      return;
    }

    const validOptions = pollOptions.filter(
      (option) => option.text.trim() !== ""
    );
    if (validOptions.length < 2) {
      toast.error("Please add at least 2 poll options!");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a poll!");
      return;
    }

    try {
      setPollLoading(true);

      const pollData = {
        question: pollQuestion,
        options: validOptions.map((item) => ({
          option: item.text.trim(),
        })),
      };

      await createPoll({ pollListCreate: pollData }).unwrap();

      toast.success("Poll created successfully!");
      setPollLoading(false);
      onClose();
      resetPoll();
    } catch (err) {
      console.error("Error creating poll:", err);
      toast.error("Error creating poll!");
      setPollLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetPoll();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 24px 64px rgba(0,0,0,0.5)"
              : "0 24px 64px rgba(0,0,0,0.15)",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`
              : theme.palette.background.paper,
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 4,
          py: 3,
          background: alpha(theme.palette.info.main, 0.05),
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PollIcon color="info" />
            <Typography variant="h5" fontWeight="700" color="info.main">
              Create Poll 📊
            </Typography>
          </Box>
          <IconButton
            edge="end"
            onClick={handleClose}
            size="large"
            sx={{
              color: "text.secondary",
              "&:hover": {
                background: alpha(theme.palette.error.main, 0.1),
                color: "error.main",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user?.profile_pic}
            alt="User"
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              border: `3px solid ${alpha(theme.palette.info.main, 0.3)}`,
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
            }}
          >
            {user?.first_name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ textTransform: "capitalize" }}
            >
              {user?.first_name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Creating a poll for everyone
            </Typography>
          </Box>
        </Box>

        {/* Poll Question */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Typography
            variant="h6"
            color="info.main"
            fontWeight="600"
            sx={{ mb: 2 }}
          >
            📝 Poll Question
          </Typography>

          <TextField
            autoFocus
            placeholder="Ask a question that people can vote on..."
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                "&:hover fieldset": {
                  borderColor: theme.palette.info.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.info.main,
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": {
                "&::placeholder": {
                  color: alpha(theme.palette.text.secondary, 0.7),
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Poll Options */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography
            variant="h6"
            color="primary.main"
            fontWeight="600"
            sx={{ mb: 2 }}
          >
            🗳️ Poll Options
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add options for people to choose from (minimum 2, maximum 4):
          </Typography>

          {pollOptions.map((option, index) => (
            <Box
              key={option.id}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <Chip
                label={String.fromCharCode(65 + index)} // A, B, C, D
                size="small"
                sx={{
                  mr: 2,
                  minWidth: 36,
                  height: 36,
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              />
              <TextField
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option.text}
                onChange={(e) =>
                  handlePollOptionChange(option.id, e.target.value)
                }
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              {pollOptions.length > 2 && (
                <IconButton
                  onClick={() => handleRemovePollOption(option.id)}
                  size="small"
                  sx={{
                    ml: 1,
                    color: "text.secondary",
                    "&:hover": {
                      background: alpha(theme.palette.error.main, 0.1),
                      color: "error.main",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          {pollOptions.length < 4 && (
            <Button
              onClick={handleAddPollOption}
              startIcon={<AddCircleIcon />}
              size="small"
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: "600",
                color: "primary.main",
                "&:hover": {
                  background: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Add Option
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          py: 3,
          background: alpha(theme.palette.action.hover, 0.02),
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{
            mr: 2,
            fontWeight: "600",
            py: 1.5,
            px: 4,
            borderRadius: 3,
            textTransform: "none",
            borderColor: alpha(theme.palette.text.secondary, 0.3),
            "&:hover": {
              borderColor: theme.palette.text.primary,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePollSubmit}
          disabled={pollLoading || !pollQuestion.trim()}
          variant="contained"
          size="large"
          sx={{
            fontWeight: "700",
            py: 1.5,
            px: 4,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1rem",
            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.4)}`,
            },
            "&:disabled": {
              background: alpha(theme.palette.action.disabled, 0.3),
            },
          }}
        >
          {pollLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Creating...</span>
            </Box>
          ) : (
            "Create Poll 📊"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreatePoll;
