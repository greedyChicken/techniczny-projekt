import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import { formatCurrency } from "../utils/formatters";
import { summaryCardStyles } from "../styles/dashboardStyles";

const SummaryCard = ({
                         icon: Icon,
                         value,
                         label,
                         color = "primary",
                         isLoading = false
                     }) => {
    const renderValue = () => {
        if (isLoading) {
            return <Skeleton variant="text" width={100} sx={{ mx: 'auto' }} />;
        }
        return formatCurrency(value || 0);
    };

    return (
        <Card sx={summaryCardStyles.card}>
            <CardContent sx={summaryCardStyles.content}>
                <Box sx={summaryCardStyles.iconBadge}>
                    <Icon color={color} sx={{ fontSize: 34 }} />
                </Box>
                <Typography variant="h5" component="div">
                    {renderValue()}
                </Typography>
                <Typography color="text.secondary">
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
