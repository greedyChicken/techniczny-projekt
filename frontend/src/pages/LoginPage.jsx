import { useState } from "react";
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

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { isLoading, error, showError, clearError } = useUIState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!email?.trim() || !password) {
            showError("Enter your email and password to continue.");
            return;
        }

        try {
            await login({ email: email.trim(), password });
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const severity = error?.severity || "error";

    return (
        <Box sx={authPageRootSx}>
            <Container component="main" maxWidth="xs" disableGutters>
                <Paper elevation={0} sx={authPaperSx}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom sx={authTitleSx}>
                        Sign in
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Welcome back. Use the email and password for your account.
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
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading("auth-login")}
                            sx={{ mt: 3, mb: 2, py: 1.25 }}
                        >
                            {isLoading("auth-login") ? "Signing in…" : "Sign in"}
                        </Button>
                        <Box textAlign="center">
                            <Link component={RouterLink} to="/register" variant="body2">
                                Need an account? Register
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
