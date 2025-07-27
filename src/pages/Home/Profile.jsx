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
  Card,
  CardContent,
  IconButton,
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  PersonOutline as PersonIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { useMeRetrieveQuery, useMeUpdateMutation } from "../../store/api";
import uploadToCloudinary from "../../store/uploadToCloudinary";

const Profile = () => {
  const theme = useTheme();
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          Loading your amazing profile... ✨
        </Typography>
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
        maxWidth: 900,
        margin: "0 auto",
        padding: { xs: 0, md: 2 },
      }}
    >
      <Zoom in timeout={500}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 20px 60px rgba(0,0,0,0.4)"
                : "0 20px 60px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
            backdropFilter: "blur(20px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Cover Image Section */}
          <Box
            sx={{
              height: 280,
              background: userData?.cover_pic
                ? `url(${userData.cover_pic})`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.dark} 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: userData?.cover_pic
                  ? "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)"
                  : "none",
              },
            }}
          >
            {!userData?.cover_pic && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "white",
                  zIndex: 1,
                }}
              >
                <CameraIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, opacity: 0.9 }}>
                  Your Cover Story ✨
                </Typography>
              </Box>
            )}

            {/* Edit Button Overlay */}
            <IconButton
              onClick={handleModalOpen}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                backgroundColor: "rgba(255,255,255,0.9)",
                color: theme.palette.primary.main,
                backdropFilter: "blur(10px)",
                zIndex: 2,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,1)",
                  transform: "scale(1.1)",
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
                transition: "all 0.3s ease",
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ px: 4, pb: 4 }}>
            {/* Profile Avatar Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: -8,
                mb: 3,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={userData?.profile_pic || ""}
                  sx={{
                    width: 140,
                    height: 140,
                    border: `6px solid ${theme.palette.background.paper}`,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 12px 40px rgba(0,0,0,0.4)"
                        : "0 12px 40px rgba(0,0,0,0.15)",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    fontSize: "3rem",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {displayName?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                {/* Online Status Indicator */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    border: `3px solid ${theme.palette.background.paper}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.7rem" }}>✨</Typography>
                </Box>
              </Box>
            </Box>

            {/* User Info Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {displayName}
                </Typography>
                <Chip
                  label="👑"
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    color: "white",
                    fontWeight: "bold",
                    minWidth: 32,
                    height: 24,
                    fontSize: "1rem",
                  }}
                />
              </Box>

              <Box
                sx={{
                  maxWidth: 600,
                  margin: "0 auto",
                  p: 3,
                  borderRadius: 4,
                  background: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  position: "relative",
                  "&::before": {
                    content: '"💬"',
                    position: "absolute",
                    top: -10,
                    left: 20,
                    fontSize: "1.5rem",
                    background: theme.palette.background.paper,
                    padding: "0 8px",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    fontStyle: userData?.bio ? "normal" : "italic",
                  }}
                >
                  {userData?.bio ||
                    "This amazing person hasn't shared their story yet... ✨"}
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleModalOpen}
                startIcon={<EditIcon />}
                sx={{
                  fontWeight: "700",
                  py: 2,
                  px: 4,
                  borderRadius: 4,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    transform: "translateY(-3px)",
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Edit Profile ✨
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Zoom>

      {/* Enhanced Edit Profile Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="edit-profile-modal"
        closeAfterTransition
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: 600 },
              maxHeight: "95vh",
              overflow: "auto",
              borderRadius: 6,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 32px 80px rgba(0,0,0,0.5)"
                  : "0 32px 80px rgba(0,0,0,0.2)",
              background:
                theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`
                  : theme.palette.background.paper,
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                p: { xs: 2.5, sm: 3, md: 4 },
                pb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={userData?.profile_pic}
                    sx={{
                      width: 50,
                      height: 50,
                      border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  >
                    {displayName?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="800" color="primary">
                      Edit Your Profile ✨
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Make it shine like you do! 🌟
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleModalClose}
                  sx={{
                    color: "text.secondary",
                    background: alpha(theme.palette.action.hover, 0.1),
                    "&:hover": {
                      background: alpha(theme.palette.error.main, 0.1),
                      color: "error.main",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Modal Content */}
            <Box
              sx={{
                p: { xs: 2.5, sm: 3, md: 4 },
              }}
            >
              {error && (
                <Zoom in>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 3,
                      fontWeight: 600,
                    }}
                  >
                    {error}
                  </Alert>
                </Zoom>
              )}

              {success && (
                <Zoom in>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 3,
                      fontWeight: 600,
                    }}
                  >
                    {success}
                  </Alert>
                </Zoom>
              )}

              <form onSubmit={handleSubmit}>
                {/* Bio Input */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon /> Tell Your Story
                  </Typography>
                  <TextField
                    fullWidth
                    label="Your Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Share what makes you amazing... ✨"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                        background: alpha(theme.palette.primary.main, 0.02),
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
                </Box>

                {/* Profile Picture Upload */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PhotoCameraIcon /> Profile Picture
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: alpha(theme.palette.primary.main, 0.05),
                      border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha(theme.palette.primary.main, 0.08),
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id="profile-pic-upload"
                      name="profilePic"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="profile-pic-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.5,
                          px: 3,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                          },
                        }}
                      >
                        Choose Your Best Shot 📸
                      </Button>
                    </label>
                  </Box>

                  {previewUrls.profilePic && (
                    <Zoom in>
                      <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Avatar
                          src={previewUrls.profilePic}
                          sx={{
                            width: 120,
                            height: 120,
                            margin: "0 auto",
                            border: `4px solid ${theme.palette.primary.main}`,
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          Looking fantastic! ✨
                        </Typography>
                      </Box>
                    </Zoom>
                  )}
                </Box>

                {/* Cover Picture Upload */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ImageIcon /> Cover Picture
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: alpha(theme.palette.secondary.main, 0.05),
                      border: `2px dashed ${alpha(theme.palette.secondary.main, 0.3)}`,
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha(theme.palette.secondary.main, 0.08),
                        borderColor: theme.palette.secondary.main,
                      },
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id="cover-pic-upload"
                      name="coverPic"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="cover-pic-upload">
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
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 24px ${alpha(theme.palette.secondary.main, 0.4)}`,
                          },
                        }}
                      >
                        Choose Your Cover Story 🎨
                      </Button>
                    </label>
                  </Box>

                  {previewUrls.coverPic && (
                    <Zoom in>
                      <Box sx={{ mt: 3 }}>
                        <Box
                          sx={{
                            height: 120,
                            backgroundImage: `url(${previewUrls.coverPic})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 3,
                            border: `4px solid ${theme.palette.secondary.main}`,
                            boxShadow: `0 8px 24px ${alpha(theme.palette.secondary.main, 0.3)}`,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            fontWeight: 600,
                            color: "secondary.main",
                            textAlign: "center",
                          }}
                        >
                          Perfect cover story! 🌟
                        </Typography>
                      </Box>
                    </Zoom>
                  )}
                </Box>

                {/* Action Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    fontWeight: "700",
                    py: 2.5,
                    borderRadius: 4,
                    textTransform: "none",
                    fontSize: "1.2rem",
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.4)}`,
                    },
                    "&:disabled": {
                      background: alpha(theme.palette.action.disabled, 0.3),
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={24} color="inherit" />
                      <span>Saving your awesomeness...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckIcon />
                      <span>Save Changes ✨</span>
                    </Box>
                  )}
                </Button>
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Profile;
