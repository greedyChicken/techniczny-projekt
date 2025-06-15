import React from "react";
import { Card, CardContent, Typography, Skeleton } from "@mui/material";
import { formatCurrency } from "../utils/formatters";

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
        <Card raised sx={{ height: "100%" }}>
            <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Icon color={color} sx={{ fontSize: 48, mb: 2 }} />
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
