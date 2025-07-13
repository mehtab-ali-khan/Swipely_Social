// Updated Feed.js - Fixed search results display
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Typography,
  Avatar,
  Box,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Alert,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Close,
  Add as AddIcon,
  Image as ImageIcon,
  EmojiEmotions as EmojiIcon,
  Gif as GifIcon,
  Poll as PollIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import uploadToCloudinary from "../../store/uploadToCloudinary";
import Posts from "./Posts";
import { useSearch } from "../../store/SearchContext";
import {
  useActivitiesCreateMutation,
  useMeRetrieveQuery,
  usePostsCreateMutation,
  usePostsListQuery,
} from "../../store/api";

function Feed() {
  const theme = useTheme();
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [postloading, setPostLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsToShow, setPostsToShow] = useState([]);
  const { data: allPosts } = usePostsListQuery({
    page: currentPage,
    pageSize: 10,
  });
  const { data: user } = useMeRetrieveQuery();
  const [activity] = useActivitiesCreateMutation();
  const [post] = usePostsCreateMutation();

  const { searchQuery, searchResults, isSearching, clearSearch } = useSearch();

  React.useMemo(() => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      return setPostsToShow(searchResults?.results || []);
    }
    return setPostsToShow(allPosts?.results || []);
  }, [searchQuery, searchResults, allPosts]);

  const showingSearchResults = searchQuery && searchQuery.trim().length >= 2;

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter content for the post!");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to post!");
      return;
    }

    try {
      setPostLoading(true);
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadToCloudinary(file);
        console.log("Uploaded image URL:", imageUrl);
      }

      await post({
        postCreateUpdate: {
          content,
          image: imageUrl,
        },
      }).unwrap();

      const actiivtycontent = "Created a new Post";
      activity({ activitiesPost: { content: actiivtycontent } }).unwrap();

      toast.success("Post created!");
      setPostLoading(false);
      setOpenCreatePost(false);
      resetForm();
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Error creating post!");
      setPostLoading(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setFile(null);
  };

  const handleClickOpenCreatePost = () => {
    setOpenCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setOpenCreatePost(false);
    resetForm();
  };

  return (
    <Box
      className="feed-container"
      sx={{
        width: "100%",
        maxWidth: 680,
        mx: "auto",
        px: { xs: 2, sm: 0 },
      }}
    >
      {/* Search Results Header */}
      {showingSearchResults && (
        <Fade in timeout={300}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.primary.main}`,
              background: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SearchIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight="600">
                    Search Results for "{searchQuery}"
                  </Typography>
                </Box>
                <IconButton
                  onClick={clearSearch}
                  size="small"
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {postsToShow?.length || 0} post
                {postsToShow?.length !== 1 ? "s" : ""} found
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      )}
      {/* Loading State for Search */}
      {isSearching && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
            mb: 3,
          }}
        >
          <CircularProgress size={32} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Searching posts...
          </Typography>
        </Box>
      )}
      {/* No Search Results */}
      {showingSearchResults &&
        !isSearching &&
        postsToShow?.results?.length === 0 && (
          <Fade in timeout={300}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                textAlign: "center",
                py: 4,
              }}
            >
              <CardContent>
                <SearchIcon
                  sx={{
                    fontSize: 48,
                    color: "text.secondary",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No posts found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms or{" "}
                  <Button
                    variant="text"
                    onClick={clearSearch}
                    sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                  >
                    browse all posts
                  </Button>
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        )}
      {/* Create Post Card - Only show when not searching */}
      {!showingSearchResults && (
        <Zoom in timeout={300}>
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
                transform: "translateY(-2px)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 12px 48px rgba(0,0,0,0.4)"
                    : "0 12px 48px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user?.profile_pic}
                  alt="User"
                  sx={{
                    width: 52,
                    height: 52,
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
                  {user?.first_name?.charAt(0).toUpperCase() || "U"}
                </Avatar>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleClickOpenCreatePost}
                  sx={{
                    py: 2,
                    px: 3,
                    borderRadius: 4,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    justifyContent: "flex-start",
                    color: "text.secondary",
                    borderColor: alpha(theme.palette.divider, 0.3),
                    background: alpha(theme.palette.action.hover, 0.02),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05),
                      transform: "translateY(-1px)",
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  }}
                >
                  What's on your mind, {user?.first_name || "there"}? ✨
                </Button>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", mt: 3, gap: 1 }}>
                <Button
                  startIcon={<ImageIcon />}
                  onClick={handleClickOpenCreatePost}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": {
                      background: alpha(theme.palette.success.main, 0.1),
                      color: "success.main",
                    },
                  }}
                >
                  Photo
                </Button>
                <Button
                  startIcon={<EmojiIcon />}
                  onClick={handleClickOpenCreatePost}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": {
                      background: alpha(theme.palette.warning.main, 0.1),
                      color: "warning.main",
                    },
                  }}
                >
                  Feeling
                </Button>
                <Button
                  startIcon={<PollIcon />}
                  onClick={handleClickOpenCreatePost}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": {
                      background: alpha(theme.palette.info.main, 0.1),
                      color: "info.main",
                    },
                  }}
                >
                  Poll
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      )}

      <Posts posts={postsToShow} user={user} />
      {/* Enhanced Create Post Dialog */}

      <Dialog
        open={openCreatePost}
        onClose={handleCloseCreatePost}
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" fontWeight="700" color="primary">
              Create Post ✨
            </Typography>
            <IconButton
              edge="end"
              onClick={handleCloseCreatePost}
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
                Sharing with everyone
              </Typography>
            </Box>
          </Box>

          <TextField
            autoFocus
            multiline
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your thoughts..."
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
              "& .MuiInputBase-input": {
                "&::placeholder": {
                  color: alpha(theme.palette.text.secondary, 0.7),
                  opacity: 1,
                },
              },
            }}
          />

          {/* Enhanced File Preview */}
          {file && (
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
                src={URL.createObjectURL(file)}
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
                onClick={() => setFile(null)}
              >
                <Close />
              </IconButton>
            </Box>
          )}

          {/* Enhanced File Input Section */}
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
              Add to your post
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <input
                accept="image/*"
                id="file-input"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-input">
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
                  Photo/Video
                </Button>
              </label>
            </Box>
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
            onClick={handlePostSubmit}
            disabled={postloading || !content.trim()}
            variant="contained"
            size="large"
            fullWidth
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
            {postloading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Publishing...</span>
              </Box>
            ) : (
              "Share Post 🚀"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Feed;
