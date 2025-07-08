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
} from "@mui/material";
import {
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  MoreVert as MoreVertIcon,
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

// Comment Menu Component
const CommentMenu = ({ comment, user, onEditComment, onDeleteComment }) => {
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
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 120,
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ gap: 1, color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

// Comment Input Component
const CommentInput = ({
  postId,
  user,
  commentText,
  onCommentChange,
  onSubmitComment,
  isSubmitting,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitComment(postId);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar
          src={user?.profile_pic}
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            fontSize: "0.875rem",
            fontWeight: "bold",
          }}
        >
          {capitalizeFirstLetter(user?.first_name)?.charAt(0) || "U"}
        </Avatar>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="Write a comment..."
          variant="outlined"
          size="small"
          value={commentText || ""}
          onChange={(e) => onCommentChange(postId, e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "grey.50",
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
                    color: commentText?.trim() ? "primary.main" : "grey.400",
                    transition: "color 0.2s",
                  }}
                >
                  {isSubmitting ? <CircularProgress size={16} /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

// Individual Comment Component
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
}) => {
  const isOwner = user?.id === comment.userId;
  const isEditing = editingComment === comment.id;

  const handleUpdateKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onUpdateComment(comment.id);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 1.5,
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "grey.200",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar
          src={comment.user_profile_pic}
          sx={{
            width: 32,
            height: 32,
            bgcolor: "secondary.main",
            fontSize: "0.75rem",
            fontWeight: "bold",
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
              mb: 0.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                textTransform: "capitalize",
              }}
            >
              {capitalizeFirstLetter(comment.user) || "Unknown User"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {isEditing ? (
                <>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateComment(comment.id)}
                    disabled={!editText?.trim() || isUpdating}
                    sx={{ color: "success.main" }}
                  >
                    {isUpdating ? (
                      <CircularProgress size={16} />
                    ) : (
                      <CheckIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={onCancelEdit}
                    sx={{ color: "error.main" }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </>
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
                  fontSize: "0.875rem",
                  borderRadius: 2,
                },
              }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                lineHeight: 1.5,
                mb: 1,
                wordBreak: "break-word",
              }}
            >
              {comment.content}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {comment.created_at
              ? formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })
              : "Just now"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

// Comments List Component
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
  if (!comments || comments.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          No comments yet. Be the first to comment!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      {comments.map((comment) => (
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
        />
      ))}
    </Box>
  );
};

// Main Comments Component
const Comments = ({ postId, user, isExpanded, onRefetch }) => {
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
        toast.success("Comment added successfully!");
        refetchComments();
        if (onRefetch) onRefetch();
      } catch (err) {
        console.error("Error creating comment:", err);
        toast.error("Failed to add comment");
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
        toast.success("Comment updated successfully!");
        refetchComments();
        if (onRefetch) onRefetch();
      } catch (err) {
        console.error("Error updating comment:", err);
        toast.error("Failed to update comment");
      } finally {
        setIsUpdating(false);
      }
    },
    [editText, updateComment, refetchComments, onRefetch]
  );

  const handleDeleteComment = useCallback(
    async (commentId) => {
      if (!window.confirm("Are you sure you want to delete this comment?")) {
        return;
      }

      try {
        await deleteComment({ id: commentId }).unwrap();
        toast.success("Comment deleted successfully!");
        refetchComments();
        if (onRefetch) onRefetch();
      } catch (err) {
        console.error("Error deleting comment:", err);
        toast.error("Failed to delete comment");
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
        bgcolor: "grey.50",
        borderTop: "1px solid",
        borderColor: "grey.200",
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

      <Divider />

      {/* Comments List */}
      {isLoading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading comments...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="error">
            Failed to load comments. Please try again.
          </Typography>
          <Button
            size="small"
            onClick={refetchComments}
            sx={{ mt: 1 }}
            variant="outlined"
          >
            Retry
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
