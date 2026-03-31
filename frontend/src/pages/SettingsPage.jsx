import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
  Stack,
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
import {
  PROFILE_DELETE_FAILED,
  PROFILE_DELETE_FORBIDDEN,
  PROFILE_SAVE_FAILED,
  PROFILE_SAVE_FORBIDDEN,
  PROFILE_SAVE_INVALID,
} from "../utils/feedbackMessages";
import {
  settingsLayoutSx,
  settingsHeroSx,
  settingsHeroSubtitleSx,
  settingsCardSx,
  settingsDangerCardSx,
  settingsContentStackSx,
  settingsTwoColumnGridSx,
} from "../styles/settingsPageStyles";

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
      newErrors.email = "Enter a valid email address";
    }

    if (profileData.currentPassword || profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
      }
      if (!profileData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (profileData.newPassword.length < 6) {
        newErrors.newPassword = "Use at least 6 characters";
      }
      if (!profileData.confirmPassword) {
        newErrors.confirmPassword = "Confirm your new password";
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

      updateUserContext({ ...user, email: response.email });

      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      showSnackbar("Profile saved successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 403) {
        showSnackbar(PROFILE_SAVE_FORBIDDEN, "error");
      } else if (error.response?.status === 400) {
        showSnackbar(PROFILE_SAVE_INVALID, "error");
      } else {
        showSnackbar(PROFILE_SAVE_FAILED, "error");
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
        showSnackbar(PROFILE_DELETE_FORBIDDEN, "error");
      } else {
        showSnackbar(PROFILE_DELETE_FAILED, "error");
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

  const cardHeaderAction = (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      disabled={loading}
      onClick={handleSaveProfile}
    >
      Save
    </Button>
  );

  return (
    <Container maxWidth="md">
      <Box sx={settingsLayoutSx}>
        <Stack spacing={3}>
          <Box sx={settingsHeroSx}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Settings
            </Typography>
            <Typography variant="body2" sx={settingsHeroSubtitleSx}>
              Update your email and password. Changes apply to your next sign-in.
            </Typography>
          </Box>

          <Box sx={settingsContentStackSx}>
            <Box sx={settingsTwoColumnGridSx}>
              <Card sx={settingsCardSx} elevation={0}>
                <CardHeader
                  title="Profile"
                  titleTypographyProps={{ fontWeight: 700 }}
                  avatar={<ProfileIcon color="primary" />}
                  action={cardHeaderAction}
                  sx={{ flexWrap: "wrap", gap: 1, "& .MuiCardHeader-action": { m: 0 } }}
                />
                <Divider />
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton height={56} animation="wave" sx={{ mb: 1 }} />
                      <Skeleton height={56} animation="wave" />
                    </>
                  ) : (
                    <Box component="form" noValidate>
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

              <Card sx={settingsCardSx} elevation={0}>
                <CardHeader
                  title="Security"
                  titleTypographyProps={{ fontWeight: 700 }}
                  avatar={<SecurityIcon color="primary" />}
                />
                <Divider />
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton height={56} animation="wave" sx={{ mb: 1 }} />
                      <Skeleton height={56} animation="wave" sx={{ mb: 1 }} />
                      <Skeleton height={56} animation="wave" />
                    </>
                  ) : (
                    <Box component="form" noValidate>
                      <TextField
                        fullWidth
                        label="Current password"
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
                                onClick={() => handleTogglePasswordVisibility("current")}
                                edge="end"
                                aria-label="Toggle current password visibility"
                              >
                                {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="New password"
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
                                onClick={() => handleTogglePasswordVisibility("new")}
                                edge="end"
                                aria-label="Toggle new password visibility"
                              >
                                {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Confirm new password"
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
                                onClick={() => handleTogglePasswordVisibility("confirm")}
                                edge="end"
                                aria-label="Toggle confirm password visibility"
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
            </Box>

            <Card sx={settingsDangerCardSx} elevation={0}>
              <CardHeader
                title="Danger zone"
                titleTypographyProps={{ fontWeight: 700, color: "error" }}
                avatar={<DeleteIcon color="error" />}
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Deleting your account cannot be undone. All associated data will be removed.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenDeleteDialog}
                  sx={{ mt: 2 }}
                >
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            This permanently removes your account and data. You cannot reverse this.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete account
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
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
