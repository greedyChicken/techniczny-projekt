import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUIState } from "../contexts/UIStateContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const { isLoading, error, showError, clearError } = useUIState();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email) {
      showError("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Please enter a valid email address.");
      return false;
    }

    if (!formData.password) {
      showError("Please enter a password.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: "USER",
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Paper elevation={3} sx={{ padding: 4, width: "100%", borderRadius: 2 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Create Account
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
                  {error.message}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
              />

              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                    ),
                  }}
              />

              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
              />

              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading('auth-register')}
                  sx={{ mt: 3, mb: 2 }}
              >
                {isLoading('auth-register') ? "Creating Account..." : "Create Account"}
              </Button>

              <Box textAlign="center">
                <Link component={RouterLink} to="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
};

export default RegisterPage;
