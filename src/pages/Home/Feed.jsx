import React, { useState } from "react";
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
} from "@mui/material";
import { Close, Add as AddIcon } from "@mui/icons-material";
import {
  useMeRetrieveQuery,
  usePostsCreateMutation,
  usePostsListQuery,
} from "../../store/generatedApi";
import uploadToCloudinary from "../../store/uploadToCloudinary";
import Posts from "./Posts";

function Feed() {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [postloading, setPostLoading] = useState(false);
  const { data: posts, refetch } = usePostsListQuery();
  const { data: user } = useMeRetrieveQuery();
  const [post] = usePostsCreateMutation();

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

      toast.success("Post created!");
      setPostLoading(false);
      setOpenCreatePost(false);
      resetForm();
      refetch();
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
      sx={{ width: { xs: "100%", sm: "50vw", md: "40vw" } }}
    >
      {/* Create Post Button */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user?.profile_pic} alt="User" sx={{ mr: 2 }} />
          <Button
            variant="outlined"
            color=""
            fullWidth
            sx={{
              justifyContent: "flex-start",
              py: 1,
              borderRadius: 3,
              border: "1px solid grey",
            }}
            onClick={handleClickOpenCreatePost}
          >
            What's on your mind, {user?.first_name || "there"}?
          </Button>
        </Box>
      </Paper>

      {/* Posts List */}
      <Posts posts={posts} user={user} refetch={refetch} />

      {/* Create Post Dialog */}
      <Dialog
        open={openCreatePost}
        onClose={handleCloseCreatePost}
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="medium">
              Create Post
            </Typography>
            <IconButton edge="end" onClick={handleCloseCreatePost} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar src={user?.profile_pic} alt="User" sx={{ mr: 2 }} />
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "capitalize" }}
            >
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

          {/* File Preview */}
          {file && (
            <Box sx={{ mb: 3, position: "relative" }}>
              <img
                src={URL.createObjectURL(file)}
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
                onClick={() => setFile(null)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Styled File Input */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Add to your post
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <input
                accept="image/*"
                id="file-input"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-input">
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
            onClick={handlePostSubmit}
            disabled={postloading || !content.trim()}
            variant="contained"
            fullWidth
            sx={{
              fontWeight: "bold",
              py: 1,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            {postloading ? <CircularProgress size={24} /> : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Feed;
