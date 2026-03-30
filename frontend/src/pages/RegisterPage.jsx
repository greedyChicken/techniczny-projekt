import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authFormAlertSx } from "../styles/feedbackStyles";
import { authPageRootSx, authPaperSx, authTitleSx } from "../styles/authPageStyles";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const { register } = useAuth();
    const { isLoading, error, showError, clearError } = useUIState();

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
        if (!formData.email?.trim()) {
            showError("Enter your email address.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            showError("Enter a valid email address.");
            return false;
        }

        if (!formData.password) {
            showError("Choose a password.");
            return false;
        }

        if (formData.password.length < 6) {
            showError("Password must be at least 6 characters.");
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
                email: formData.email.trim(),
                password: formData.password,
                role: "USER",
            });
        } catch (err) {
            console.error("Registration error:", err);
        }
    };

    const severity = error?.severity || "error";

    return (
        <Box sx={authPageRootSx}>
            <Container component="main" maxWidth="xs" disableGutters>
                <Paper elevation={0} sx={authPaperSx}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom sx={authTitleSx}>
                        Create account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Set up your credentials. You can add accounts and budgets after signing in.
                    </Typography>

                    {error && (
                        <Alert
                            severity={severity}
                            sx={authFormAlertSx(severity)}
                            onClose={clearError}
                        >
                            {error.message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
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
                            helperText="At least 6 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
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
                            label="Confirm password"
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading("auth-register")}
                            sx={{ mt: 3, mb: 2, py: 1.25 }}
                        >
                            {isLoading("auth-register") ? "Creating account…" : "Create account"}
                        </Button>

                        <Box textAlign="center">
                            <Link component={RouterLink} to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage;
