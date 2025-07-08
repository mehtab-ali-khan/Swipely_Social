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
  Fade,
  Zoom,
  useTheme,
  alpha,
  Chip,
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
  Image as ImageIcon,
  FavoriteBorder as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
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

// Modern Post Menu Component
const PostMenu = ({ post, user, onEditPost, onDeletePost }) => {
  const theme = useTheme();
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
          background: alpha(theme.palette.action.hover, 0.1),
          borderRadius: 2,
          "&:hover": {
            color: "primary.main",
            background: alpha(theme.palette.primary.main, 0.1),
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <MoreVertIcon />
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
            minWidth: 140,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
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
          <ListItemIcon sx={{ minWidth: 28 }}>
            <EditIcon fontSize="small" color="inherit" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight="500">
            Edit Post
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
          <ListItemIcon sx={{ minWidth: 28 }}>
            <DeleteIcon fontSize="small" color="inherit" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight="500">
            Delete Post
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

// Enhanced Edit Post Dialog Component
const EditPostDialog = ({
  open,
  onClose,
  post,
  user,
  onUpdatePost,
  isUpdating,
}) => {
  const theme = useTheme();
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
          background: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="700" color="primary">
            Edit Post ✏️
          </Typography>
          <IconButton
            edge="end"
            onClick={onClose}
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
              border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
              Editing post
            </Typography>
          </Box>
        </Box>

        <TextField
          autoFocus
          multiline
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          fullWidth
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                borderWidth: "2px",
              },
            },
          }}
        />

        {/* Enhanced Image Preview */}
        {(file || existingImage) && (
          <Box
            sx={{
              mb: 3,
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={file ? URL.createObjectURL(file) : existingImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                  transform: "scale(1.1)",
                },
              }}
              onClick={handleRemoveImage}
            >
              <Close />
            </IconButton>
          </Box>
        )}

        {/* Enhanced File Input */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: alpha(theme.palette.primary.main, 0.05),
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.08),
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Update your post
          </Typography>
          <input
            accept="image/*"
            id="edit-file-input"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="edit-file-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<ImageIcon />}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                },
              }}
            >
              Change Photo
            </Button>
          </label>
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
          onClick={handleSubmit}
          disabled={isUpdating || !content.trim()}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            fontWeight: "700",
            py: 2,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1.1rem",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            "&:disabled": {
              background: alpha(theme.palette.action.disabled, 0.3),
            },
          }}
        >
          {isUpdating ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Updating...</span>
            </Box>
          ) : (
            "Update Post ✨"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function Posts({ posts, user, refetch }) {
  const theme = useTheme();
  const [like] = usePostsLikeCreateMutation();
  const [updatePost] = usePostsUpdateMutation();
  const [deletePost] = usePostsDestroyMutation();
  const [expandedComments, setExpandedComments] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLike = async (postId) => {
    try {
      await like({ postId }).unwrap();
      toast.success("Toggled like! 💖");
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

        toast.success("Post updated successfully! ✨");
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
      if (window.confirm("Are you sure you want to delete this post? 🗑️")) {
        try {
          await deletePost({ id: postId }).unwrap();
          toast.success("Post deleted successfully! 🗑️");
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
    <Box sx={{ width: "100%" }}>
      {posts ? (
        posts.map((post, index) => (
          <Zoom in timeout={300 + index * 100} key={post.id}>
            <Card
              sx={{
                mb: 4,
                borderRadius: 4,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(0,0,0,0.3)"
                    : "0 8px 32px rgba(0,0,0,0.1)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 16px 48px rgba(0,0,0,0.4)"
                      : "0 16px 48px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={post.userPic}
                    alt={post.user || "User"}
                    sx={{
                      width: 48,
                      height: 48,
                      border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {capitalizeFirstLetter(post.user)?.charAt(0) || "U"}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: "700",
                        color: "text.primary",
                      }}
                    >
                      {capitalizeFirstLetter(post.user) || "User"}
                    </Typography>
                    <Chip
                      label="✨"
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: "white",
                        fontWeight: "bold",
                        minWidth: 28,
                        height: 20,
                      }}
                    />
                  </Box>
                }
                subheader={
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: "500",
                      mt: 0.5,
                    }}
                  >
                    {post.created_at
                      ? formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                        })
                      : "Just now"}{" "}
                    • 🌟
                  </Typography>
                }
                sx={{ pb: 1 }}
              />

              <CardContent sx={{ pt: 0, pb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    fontSize: "1.1rem",
                    color: "text.primary",
                    fontWeight: "400",
                  }}
                >
                  {post.content}
                </Typography>
              </CardContent>

              {post.image && (
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 3,
                    mx: 2,
                    mb: 2,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 32px rgba(0,0,0,0.3)"
                        : "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt="Post image"
                    sx={{
                      maxHeight: 400,
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  />
                </Box>
              )}

              <CardActions disableSpacing sx={{ px: 3, pb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={() => handleLike(post.id)}
                      startIcon={<ThumbUp />}
                      sx={{
                        color: "text.secondary",
                        textTransform: "none",
                        fontWeight: "600",
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        background: alpha(theme.palette.primary.main, 0.05),
                        "&:hover": {
                          color: "primary.main",
                          background: alpha(theme.palette.primary.main, 0.1),
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {post.no_of_likes || 0} 💖
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
                        fontWeight: "600",
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        background: alpha(theme.palette.secondary.main, 0.05),
                        "&:hover": {
                          color: "secondary.main",
                          background: alpha(theme.palette.secondary.main, 0.1),
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 16px ${alpha(theme.palette.secondary.main, 0.2)}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Comments 💬
                    </Button>
                  </Box>
                </Box>
              </CardActions>

              <Collapse
                in={expandedComments[post.id]}
                timeout="auto"
                unmountOnExit
              >
                <Box
                  sx={{
                    background: alpha(theme.palette.action.hover, 0.02),
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Comments
                    postId={post.id}
                    user={user}
                    isExpanded={expandedComments[post.id]}
                    onRefetch={refetch}
                  />
                </Box>
              </Collapse>
            </Card>
          </Zoom>
        ))
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            borderRadius: 4,
            background: alpha(theme.palette.action.hover, 0.02),
          }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ fontWeight: "600", mb: 1 }}
          >
            No posts yet 📝
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Be the first to share something amazing! ✨
          </Typography>
        </Box>
      )}

      {/* Enhanced Edit Post Dialog */}
      <EditPostDialog
        open={!!editingPost}
        onClose={handleCloseEditDialog}
        post={editingPost}
        user={user}
        onUpdatePost={handleUpdatePost}
        isUpdating={isUpdating}
      />
    </Box>
  );
}

export default Posts;
