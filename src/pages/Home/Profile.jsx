import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Box,
  Typography,
  Modal,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  useMeRetrieveQuery,
  useMeUpdateMutation,
} from "../../store/generatedApi";
import uploadToCloudinary from "../../store/uploadToCloudinary";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    profilePic: null,
    coverPic: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    profilePic: "",
    coverPic: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    data: userData,
    isLoading: userLoading,
    refetch,
  } = useMeRetrieveQuery();
  const [updateProfile] = useMeUpdateMutation();

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (userData) {
      setFormData({
        bio: userData.bio || "",
        profilePic: null,
        coverPic: null,
      });
    }
  }, [userData]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setError("");
    setSuccess("");
    // Reset form data to current user data
    if (userData) {
      setFormData({
        bio: userData.bio || "",
        profilePic: null,
        coverPic: null,
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPreviewUrls({
      profilePic: "",
      coverPic: "",
    });
    setError("");
    setSuccess("");
    // Reset form data
    if (userData) {
      setFormData({
        bio: userData.bio || "",
        profilePic: null,
        coverPic: null,
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });

      const previewUrl = URL.createObjectURL(files[0]);
      setPreviewUrls((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let profilePicUrl = userData?.profile_pic;
      let coverPicUrl = userData?.cover_pic;

      if (formData.profilePic) {
        profilePicUrl = await uploadToCloudinary(formData.profilePic);
      }

      if (formData.coverPic) {
        coverPicUrl = await uploadToCloudinary(formData.coverPic);
      }

      const updateData = {
        bio: formData.bio || null,
        profile_pic: profilePicUrl || null,
        cover_pic: coverPicUrl || null,
      };

      await updateProfile({
        profileUpdate: {
          bio: updateData.bio,
          profile_pic: updateData.profile_pic,
          cover_pic: updateData.cover_pic,
        },
      }).unwrap();

      setSuccess("Profile updated successfully!");
      setLoading(false);
      refetch();
      setTimeout(() => {
        handleModalClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  // Display loading state
  if (userLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName =
    userData?.first_name && userData?.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData?.first_name || userData?.last_name || "User";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        padding: 2,
      }}
    >
      {/* Cover Image */}
      <Box
        sx={{
          height: 200,
          backgroundImage: `url(${
            userData?.cover_pic || "https://via.placeholder.com/800x200"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px",
          marginBottom: 2,
        }}
      />

      {/* Profile Image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: -5,
        }}
      >
        <Avatar
          src={userData?.profile_pic || "https://via.placeholder.com/150"}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
          }}
        />
      </Box>

      {/* Display Name and Bio */}
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Typography variant="h5" textTransform="capitalize">
          {displayName}
        </Typography>
        <Typography variant="body1" sx={{ color: "gray", marginTop: 1 }}>
          {userData?.bio || "This user hasn't added a bio yet."}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button variant="outlined" color="primary" onClick={handleModalOpen}>
          Edit Profile
        </Button>
      </Box>

      {/* Edit Profile Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="edit-profile-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" component="h2" mb={3}>
            Edit Your Profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Bio input */}
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              margin="normal"
              placeholder="Tell us about yourself..."
            />

            {/* Profile Picture Upload */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Profile Picture
              </Typography>
              <input
                accept="image/*"
                type="file"
                id="profile-pic-upload"
                name="profilePic"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="profile-pic-upload">
                <Button variant="contained" component="span">
                  Choose Profile Picture
                </Button>
              </label>

              {/* Preview */}
              {previewUrls.profilePic && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Avatar
                    src={previewUrls.profilePic}
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Preview
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Cover Picture Upload */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Cover Picture
              </Typography>
              <input
                accept="image/*"
                type="file"
                id="cover-pic-upload"
                name="coverPic"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="cover-pic-upload">
                <Button variant="contained" component="span">
                  Choose Cover Picture
                </Button>
              </label>

              {/* Preview */}
              {previewUrls.coverPic && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      height: 100,
                      backgroundImage: `url(${previewUrls.coverPic})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Preview
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleModalClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
