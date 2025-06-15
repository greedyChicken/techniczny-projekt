import React from "react";
import { Typography, Box } from "@mui/material";

const DashboardHeader = () => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Welcome to your personal finance dashboard. Here's an overview of your
                financial status.
            </Typography>
        </Box>
    );
};

export default DashboardHeader;
