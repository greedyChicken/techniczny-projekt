import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authService } from "../api/authService";

const GoogleOAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Completing sign-in…");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token || !authService.persistSessionFromJwt(token)) {
            setMessage("Sign-in could not be completed. Redirecting to login…");
            const t = setTimeout(
                () => navigate("/login?error=oauth_token", { replace: true }),
                1200
            );
            return () => clearTimeout(t);
        }
        window.location.replace("/dashboard");
    }, [searchParams, navigate]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
};

export default GoogleOAuthCallbackPage;
