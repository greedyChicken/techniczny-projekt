import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUIState } from "../contexts/UIStateContext";
import {
    Box, TextField, Button, Typography, Paper, Container,
    Link, InputAdornment, IconButton, Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { isLoading, error, showError, clearError } = useUIState();
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!email || !password) {
            showError("Please enter both email and password.");
            return;
        }

        try {
            await login({ email, password });
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Paper elevation={3} sx={{ padding: 4, width: "100%", borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity={error.severity} sx={{ mb: 2 }} onClose={clearError}>
                            {error.message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal" required fullWidth id="email" label="Email Address"
                            name="email" autoComplete="email" autoFocus value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal" required fullWidth name="password" label="Password"
                            type={showPassword ? "text" : "password"} id="password"
                            autoComplete="current-password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit" fullWidth variant="contained"
                            disabled={isLoading('auth-login')} sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading('auth-login') ? "Signing in..." : "Sign In"}
                        </Button>
                        <Box textAlign="center">
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
