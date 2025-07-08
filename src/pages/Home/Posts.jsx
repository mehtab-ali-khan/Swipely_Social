import React, { useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  Collapse,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Comment,
  ThumbUp,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Close,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  usePostsLikeCreateMutation,
  usePostsUpdateMutation,
  usePostsDestroyMutation,
} from "../../store/generatedApi";
import uploadToCloudinary from "../../store/uploadToCloudinary";
import Comments from "./Comments";

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Post Menu Component
const PostMenu = ({ post, user, onEditPost, onDeletePost }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isOwner = user?.id === post.userId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditPost(post.id, post.content, post.image);
    handleClose();
  };

  const handleDelete = () => {
    onDeletePost(post.id);
    handleClose();
  };

  if (!isOwner) return null;

  return (
    <>
      <IconButton
        aria-label="settings"
        onClick={handleClick}
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <MoreVertIcon />
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
          Edit Post
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ gap: 1, color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Post
        </MenuItem>
      </Menu>
    </>
  );
};

// Edit Post Dialog Component
const EditPostDialog = ({
  open,
  onClose,
  post,
  user,
  onUpdatePost,
  isUpdating,
}) => {
  const [content, setContent] = useState(post?.content || "");
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(post?.image || null);

  React.useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setExistingImage(post.image || null);
      setFile(null);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please enter content for the post!");
      return;
    }

    try {
      let imageUrl = existingImage;
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      await onUpdatePost(post.id, {
        content: content.trim(),
        image: imageUrl,
      });

      onClose();
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Error updating post!");
    }
  };

  const handleRemoveImage = () => {
    setExistingImage(null);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExistingImage(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="medium">
            Edit Post
          </Typography>
          <IconButton edge="end" onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar src={user?.profile_pic} alt="User" sx={{ mr: 2 }} />
          <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
            {user?.first_name || "User"}
          </Typography>
        </Box>

        <TextField
          autoFocus
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
        />

        {/* Image Preview */}
        {(file || existingImage) && (
          <Box sx={{ mb: 3, position: "relative" }}>
            <img
              src={file ? URL.createObjectURL(file) : existingImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
              size="small"
              onClick={handleRemoveImage}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* File Input */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Add to your post
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <input
              accept="image/*"
              id="edit-file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="edit-file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddIcon />}
                size="small"
                sx={{ borderRadius: 1 }}
              >
                Photo
              </Button>
            </label>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || !content.trim()}
          variant="contained"
          fullWidth
          sx={{
            fontWeight: "bold",
            py: 1,
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          {isUpdating ? <CircularProgress size={24} /> : "Update Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function Posts({ posts, user, refetch }) {
  const [like] = usePostsLikeCreateMutation();
  const [updatePost] = usePostsUpdateMutation();
  const [deletePost] = usePostsDestroyMutation();
  const [expandedComments, setExpandedComments] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLike = async (postId) => {
    try {
      await like({ postId }).unwrap();
      toast.success("Toggled like!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle like");
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleEditPost = useCallback(
    (postId, content, image) => {
      const post = posts.find((p) => p.id === postId);
      setEditingPost(post);
    },
    [posts]
  );

  const handleUpdatePost = useCallback(
    async (postId, postData) => {
      try {
        setIsUpdating(true);
        await updatePost({
          id: postId,
          postCreateUpdate: postData,
        }).unwrap();

        toast.success("Post updated successfully!");
        refetch();
        setEditingPost(null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update post");
      } finally {
        setIsUpdating(false);
      }
    },
    [updatePost, refetch]
  );

  const handleDeletePost = useCallback(
    async (postId) => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePost({ id: postId }).unwrap();
          toast.success("Post deleted successfully!");
          refetch();
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete post");
        }
      }
    },
    [deletePost, refetch]
  );

  const handleCloseEditDialog = () => {
    setEditingPost(null);
  };

  return (
    <div>
      {posts ? (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardHeader
              avatar={
                <Avatar
                  src={user?.profile_pic}
                  alt={user?.first_name || "User"}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {capitalizeFirstLetter(user?.first_name)?.charAt(0) || "U"}
                </Avatar>
              }
              action={
                <PostMenu
                  post={post}
                  user={user}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              }
              title={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                >
                  {capitalizeFirstLetter(post.user) || "User"}
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  {post.created_at
                    ? formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </Typography>
              }
            />

            <CardContent sx={{ py: 1 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {post.content}
              </Typography>
            </CardContent>

            {post.image && (
              <CardMedia
                component="img"
                image={post.image}
                alt="Post image"
                sx={{ maxHeight: 400, objectFit: "cover" }}
              />
            )}

            <CardActions disableSpacing sx={{ px: 2 }}>
              <Button
                onClick={() => handleLike(post.id)}
                startIcon={<ThumbUp />}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "primary.50",
                  },
                }}
              >
                {post.no_of_likes || 0} Like{post.no_of_likes !== 1 ? "s" : ""}
              </Button>
              <Button
                startIcon={<Comment />}
                onClick={() => toggleComments(post.id)}
                endIcon={
                  expandedComments[post.id] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )
                }
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "primary.50",
                  },
                }}
              >
                Comments
              </Button>
            </CardActions>

            <Collapse
              in={expandedComments[post.id]}
              timeout="auto"
              unmountOnExit
            >
              <Comments
                postId={post.id}
                user={user}
                isExpanded={expandedComments[post.id]}
                onRefetch={refetch}
              />
            </Collapse>
          </Card>
        ))
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No posts available
          </Typography>
        </Box>
      )}

      {/* Edit Post Dialog */}
      <EditPostDialog
        open={!!editingPost}
        onClose={handleCloseEditDialog}
        post={editingPost}
        user={user}
        onUpdatePost={handleUpdatePost}
        isUpdating={isUpdating}
      />
    </div>
  );
}

export default Posts;
