import React, { useState, useCallback, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
  Divider,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  MoreVert as MoreVertIcon,
  ChatBubbleOutline as ChatIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";
import {
  usePostsCommentsListQuery,
  usePostsCommentsCreateMutation,
  useCommentsUpdateMutation,
  useCommentsDestroyMutation,
} from "../../store/generatedApi";

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Modern Comment Menu Component
const CommentMenu = ({ comment, user, onEditComment, onDeleteComment }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isOwner = user?.id === comment.userId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditComment(comment.id, comment.content);
    handleClose();
  };

  const handleDelete = () => {
    onDeleteComment(comment.id);
    handleClose();
  };

  if (!isOwner) return null;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: "text.secondary",
          background: alpha(theme.palette.action.hover, 0.1),
          borderRadius: 2,
          width: 28,
          height: 28,
          "&:hover": {
            color: "primary.main",
            background: alpha(theme.palette.primary.main, 0.1),
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            minWidth: 130,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            gap: 1.5,
            py: 1.5,
            px: 2,
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 24 }}>
            <EditIcon fontSize="small" color="inherit" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight="500">
            Edit ✏️
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            gap: 1.5,
            py: 1.5,
            px: 2,
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            "&:hover": {
              background: alpha(theme.palette.error.main, 0.1),
              color: "error.main",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 24 }}>
            <DeleteIcon fontSize="small" color="inherit" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight="500">
            Delete 🗑️
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

// Modern Comment Input Component
const CommentInput = ({
  postId,
  user,
  commentText,
  onCommentChange,
  onSubmitComment,
  isSubmitting,
}) => {
  const theme = useTheme();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitComment(postId);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <ChatIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="h6" fontWeight="700" color="primary.main">
          Join the conversation
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={user?.profile_pic}
          sx={{
            width: 40,
            height: 40,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            fontSize: "1rem",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          {capitalizeFirstLetter(user?.first_name)?.charAt(0) || "U"}
        </Avatar>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="Share your thoughts... 💭"
          variant="outlined"
          size="small"
          value={commentText || ""}
          onChange={(e) => onCommentChange(postId, e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
              fontSize: "1rem",
              lineHeight: 1.6,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              "&:hover": {
                background: alpha(theme.palette.background.paper, 0.9),
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused": {
                background: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onSubmitComment(postId)}
                  disabled={!commentText?.trim() || isSubmitting}
                  size="small"
                  sx={{
                    background: commentText?.trim()
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      : alpha(theme.palette.action.disabled, 0.3),
                    color: commentText?.trim() ? "white" : "text.secondary",
                    borderRadius: 2,
                    width: 32,
                    height: 32,
                    "&:hover": {
                      background: commentText?.trim()
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                        : alpha(theme.palette.action.disabled, 0.3),
                      transform: commentText?.trim() ? "scale(1.1)" : "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SendIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

// Modern Individual Comment Component
const CommentItem = ({
  comment,
  user,
  onEditComment,
  onDeleteComment,
  onUpdateComment,
  onCancelEdit,
  editingComment,
  editText,
  onEditTextChange,
  isUpdating,
  index,
}) => {
  const theme = useTheme();
  const isOwner = user?.id === comment.userId;
  const isEditing = editingComment === comment.id;

  const handleUpdateKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onUpdateComment(comment.id);
    }
  };

  return (
    <Zoom in timeout={200 + index * 50}>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 3,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.1)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: "4px 4px 0 0",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            src={comment.userPic}
            sx={{
              width: 36,
              height: 36,
              border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              fontSize: "0.875rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            {capitalizeFirstLetter(comment.user)?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    textTransform: "capitalize",
                  }}
                >
                  {capitalizeFirstLetter(comment.user) || "Unknown User"}
                </Typography>
                <Chip
                  label="💬"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    color: "white",
                    fontWeight: "bold",
                    minWidth: 24,
                    height: 18,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {isEditing ? (
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => onUpdateComment(comment.id)}
                      disabled={!editText?.trim() || isUpdating}
                      sx={{
                        background: alpha(theme.palette.success.main, 0.1),
                        color: "success.main",
                        borderRadius: 2,
                        width: 28,
                        height: 28,
                        "&:hover": {
                          background: alpha(theme.palette.success.main, 0.2),
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isUpdating ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <CheckIcon fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={onCancelEdit}
                      sx={{
                        background: alpha(theme.palette.error.main, 0.1),
                        color: "error.main",
                        borderRadius: 2,
                        width: 28,
                        height: 28,
                        "&:hover": {
                          background: alpha(theme.palette.error.main, 0.2),
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <CommentMenu
                    comment={comment}
                    user={user}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                  />
                )}
              </Box>
            </Box>

            {isEditing ? (
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
                variant="outlined"
                size="small"
                onKeyPress={handleUpdateKeyPress}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1rem",
                    borderRadius: 3,
                    background: alpha(theme.palette.background.paper, 0.5),
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  lineHeight: 1.6,
                  mb: 1.5,
                  wordBreak: "break-word",
                  fontSize: "1rem",
                  fontWeight: "400",
                }}
              >
                {comment.content}
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                {comment.created_at
                  ? formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })
                  : "Just now"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                • 🕒
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
};

// Modern Comments List Component
const CommentsList = ({
  comments,
  user,
  onEditComment,
  onDeleteComment,
  onUpdateComment,
  onCancelEdit,
  editingComment,
  editText,
  onEditTextChange,
  isUpdating,
}) => {
  const theme = useTheme();

  if (!comments || comments.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          background: `linear-gradient(135deg, ${alpha(theme.palette.action.hover, 0.02)} 0%, ${alpha(theme.palette.action.hover, 0.05)} 100%)`,
          borderRadius: 3,
          mx: 2,
          mb: 2,
        }}
      >
        <EmojiIcon
          sx={{
            fontSize: 48,
            color: "text.secondary",
            mb: 2,
            opacity: 0.7,
          }}
        />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: "600", mb: 1 }}
        >
          No comments yet 💭
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Be the first to share your thoughts! ✨
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "700",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ChatIcon sx={{ color: "primary.main" }} />
          Comments ({comments.length}) 💬
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 1,
            opacity: 0.3,
          }}
        />
      </Box>
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          user={user}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onUpdateComment={onUpdateComment}
          onCancelEdit={onCancelEdit}
          editingComment={editingComment}
          editText={editText}
          onEditTextChange={onEditTextChange}
          isUpdating={isUpdating}
          index={index}
        />
      ))}
    </Box>
  );
};

// Main Comments Component
const Comments = ({ postId, user, isExpanded, onRefetch }) => {
  const theme = useTheme();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: comments,
    isLoading,
    error,
    refetch: refetchComments,
  } = usePostsCommentsListQuery({ postId }, { skip: !isExpanded });

  const [createComment] = usePostsCommentsCreateMutation();
  const [updateComment] = useCommentsUpdateMutation();
  const [deleteComment] = useCommentsDestroyMutation();

  useEffect(() => {
    if (isExpanded) {
      refetchComments();
    }
  }, [isExpanded, refetchComments]);

  const handleCommentChange = useCallback((postId, value) => {
    setCommentText(value);
  }, []);

  const handleSubmitComment = useCallback(
    async (postId) => {
      const content = commentText.trim();
      if (!content) return;

      try {
        setIsSubmitting(true);
        await createComment({
          postId,
          commentCreateUpdate: {
            content,
          },
        }).unwrap();

        setCommentText("");
        toast.success("Comment added successfully! 💬✨");
        refetchComments();
        if (onRefetch) onRefetch();
      } catch (err) {
        console.error("Error creating comment:", err);
        toast.error("Failed to add comment 😞");
      } finally {
        setIsSubmitting(false);
      }
    },
    [commentText, createComment, refetchComments, onRefetch]
  );

  const handleEditComment = useCallback((commentId, content) => {
    setEditingComment(commentId);
    setEditText(content);
  }, []);

  const handleUpdateComment = useCallback(
    async (commentId) => {
      const content = editText.trim();
      if (!content) return;

      try {
        setIsUpdating(true);
        await updateComment({
          id: commentId,
          commentCreateUpdate: {
            content,
          },
        }).unwrap();

        setEditingComment(null);
        setEditText("");
        toast.success("Comment updated successfully! ✏️✨");
        refetchComments();
        if (onRefetch) onRefetch();
      } catch (err) {
        console.error("Error updating comment:", err);
        toast.error("Failed to update comment 😞");
      } finally {
        setIsUpdating(false);
      }
    },
    [editText, updateComment, refetchComments, onRefetch]
  );

  const handleDeleteComment = useCallback(
    async (commentId) => {
      if (!window.confirm("Are you sure you want to delete this comment? 🗑️")) {
        return;
      }

      try {
        await deleteComment({ id: commentId }).unwrap();
        toast.success("Comment deleted successfully! 🗑️✨");
        refetchComments();
        if (onRefetch) onRefetch();
      } catch (err) {
        console.error("Error deleting comment:", err);
        toast.error("Failed to delete comment 😞");
      }
    },
    [deleteComment, refetchComments, onRefetch]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
    setEditText("");
  }, []);

  const handleEditTextChange = useCallback((value) => {
    setEditText(value);
  }, []);

  if (!isExpanded) return null;

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.5)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      {/* Comment Input */}
      <CommentInput
        postId={postId}
        user={user}
        commentText={commentText}
        onCommentChange={handleCommentChange}
        onSubmitComment={handleSubmitComment}
        isSubmitting={isSubmitting}
      />

      {/* Comments List */}
      {isLoading ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            background: alpha(theme.palette.action.hover, 0.02),
          }}
        >
          <CircularProgress
            size={32}
            sx={{
              color: "primary.main",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            color="primary.main"
            sx={{ fontWeight: "600", mb: 1 }}
          >
            Loading comments... 🔄
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hold on, we're fetching the conversation! ✨
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            background: alpha(theme.palette.error.main, 0.05),
            borderRadius: 3,
            mx: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            color="error.main"
            sx={{ fontWeight: "600", mb: 2 }}
          >
            Oops! Something went wrong 😞
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Failed to load comments. Please try again.
          </Typography>
          <Button
            variant="contained"
            onClick={refetchComments}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "600",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Try Again 🔄
          </Button>
        </Box>
      ) : (
        <CommentsList
          comments={comments}
          user={user}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onUpdateComment={handleUpdateComment}
          onCancelEdit={handleCancelEdit}
          editingComment={editingComment}
          editText={editText}
          onEditTextChange={handleEditTextChange}
          isUpdating={isUpdating}
        />
      )}
    </Box>
  );
};

export default Comments;
