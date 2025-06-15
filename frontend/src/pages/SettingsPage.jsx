import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  AccountCircle as ProfileIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  DeleteForever as DeleteIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../api/authService.js";

const SettingsPage = () => {
  const { user, logout, updateUserContext } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
    setLoading(false);
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (profileData.currentPassword || profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
      }
      if (!profileData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (profileData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      if (!profileData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      showSnackbar("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        email: profileData.email,
      };

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await authService.updateUser(user.id, updateData);

      if (updateUserContext) {
        updateUserContext({ ...user, email: response.email });
      }

      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      showSnackbar("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 403) {
        showSnackbar("You are not authorized to update this profile", "error");
      } else if (error.response?.status === 400) {
        showSnackbar("Invalid data provided", "error");
      } else {
        showSnackbar("Failed to update profile", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteUser(user.id);
      handleCloseDeleteDialog();
      logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.response?.status === 403) {
        showSnackbar("You are not authorized to delete this account", "error");
      } else {
        showSnackbar("Failed to delete account", "error");
      }
      handleCloseDeleteDialog();
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                    title="Profile"
                    avatar={<ProfileIcon color="primary" />}
                    action={
                      <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={loading}
                          onClick={handleSaveProfile}
                      >
                        Save
                      </Button>
                    }
                />
                <Divider />
                <CardContent>
                  {loading ? (
                      <>
                        <Skeleton height={60} animation="wave" />
                        <Skeleton height={60} animation="wave" />
                        <Skeleton height={60} animation="wave" />
                      </>
                  ) : (
                      <Box component="form">
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            margin="normal"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                      </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                    title="Security"
                    avatar={<SecurityIcon color="primary" />}
                />
                <Divider />
                <CardContent>
                  {loading ? (
                      <>
                        <Skeleton height={60} animation="wave" />
                        <Skeleton height={60} animation="wave" />
                        <Skeleton height={60} animation="wave" />
                      </>
                  ) : (
                      <Box component="form">
                        <TextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            value={profileData.currentPassword}
                            onChange={handleProfileChange}
                            margin="normal"
                            type={showPasswords.current ? "text" : "password"}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                            InputProps={{
                              endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility('current')}
                                        edge="end"
                                    >
                                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                              ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            value={profileData.newPassword}
                            onChange={handleProfileChange}
                            margin="normal"
                            type={showPasswords.new ? "text" : "password"}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            InputProps={{
                              endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility('new')}
                                        edge="end"
                                    >
                                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                              ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={handleProfileChange}
                            margin="normal"
                            type={showPasswords.confirm ? "text" : "password"}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                              endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePasswordVisibility('confirm')}
                                        edge="end"
                                    >
                                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                              ),
                            }}
                        />
                      </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
                <CardHeader
                    title="Danger Zone"
                    titleTypographyProps={{ color: 'error' }}
                    avatar={<DeleteIcon color="error" />}
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    Once you delete your account, there is no going back. Please be certain.
                  </Typography>
                  <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleOpenDeleteDialog}
                      sx={{ mt: 2 }}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Your Account?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account? This action cannot be
              undone and all your data will be permanently lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} autoFocus>
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} color="error">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
  );
};

export default SettingsPage;