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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
  Stack,
  Paper,
  CircularProgress,
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
  settingsPageContainerSx,
  settingsAccountPaperSx,
  settingsDangerPaperSx,
} from "../styles/settingsPageStyles";
import { budgetPageHeaderStyles } from "./budgets/styles/budgetStyles";

const SectionIntro = ({ icon: Icon, title, description }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start">
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        flexShrink: 0,
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box sx={{ minWidth: 0, pt: 0.25 }}>
      <Typography variant="subtitle1" fontWeight={700} component="h2">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  </Stack>
);

const SettingsPage = () => {
  const { user, logout, updateUserContext } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
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
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!user?.registeredViaGoogle) {
      if (!profileData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
        newErrors.email = "Enter a valid email address";
      }
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const updateData = {};
      if (!user.registeredViaGoogle) {
        updateData.email = profileData.email;
      }
      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await authService.updateUser(user.id, updateData);

      if (response.user) {
        updateUserContext(response.user);
      } else {
        updateUserContext({ ...user, email: profileData.email });
      }

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
        const apiMsg = error.response?.data?.message;
        showSnackbar(apiMsg || PROFILE_SAVE_INVALID, "error");
      } else {
        showSnackbar(PROFILE_SAVE_FAILED, "error");
      }
    } finally {
      setIsSaving(false);
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

  return (
    <Container maxWidth="lg">
      <Box sx={settingsPageContainerSx}>
        <Stack spacing={3}>
          <Box sx={budgetPageHeaderStyles.wrapper}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Settings
            </Typography>
            <Typography variant="body2" sx={budgetPageHeaderStyles.subtitle}>
              Update your account email and password in one place. If you change email or password, your
              session refreshes automatically.
            </Typography>
          </Box>

          <Paper component="section" elevation={0} sx={settingsAccountPaperSx}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSaveProfile}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Stack spacing={2.5}>
                <SectionIntro
                  icon={ProfileIcon}
                  title="Profile"
                  description="Email used to sign in and identify your account."
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  type="email"
                  disabled={Boolean(user?.registeredViaGoogle)}
                  error={!!errors.email}
                  helperText={
                    errors.email ||
                    (user?.registeredViaGoogle
                      ? "Google sign-in: email stays in sync with your Google account."
                      : undefined)
                  }
                />
              </Stack>

              <Divider />

              <Stack spacing={2.5}>
                <SectionIntro
                  icon={SecurityIcon}
                  title="Security"
                  description="Change your password anytime. Leave password fields empty if you only update email."
                />
                <TextField
                  fullWidth
                  label="Current password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleProfileChange}
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
              </Stack>

              <Divider />

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  Saves profile and security changes together.
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSaving}
                  startIcon={<SaveIcon />}
                  endIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{ minWidth: { sm: 200 } }}
                >
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
              </Stack>
            </Box>
          </Paper>

          <Paper component="section" elevation={0} sx={settingsDangerPaperSx}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "error.main",
                    color: "error.contrastText",
                    flexShrink: 0,
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="error.main" component="h2">
                    Danger zone
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Deleting your account cannot be undone. All associated data will be removed.
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteDialog}
                sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
              >
                Delete account
              </Button>
            </Stack>
          </Paper>
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
