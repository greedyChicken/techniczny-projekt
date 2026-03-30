import React from "react";
import { Typography, Box } from "@mui/material";
import { dashboardHeaderStyles } from "../styles/dashboardStyles";

const DashboardHeader = () => {
    return (
        <Box sx={dashboardHeaderStyles.wrapper}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1" sx={dashboardHeaderStyles.subtitle}>
                Welcome to your personal finance dashboard. Here's an overview of your
                financial status.
            </Typography>
        </Box>
    );
};

export default DashboardHeader;
