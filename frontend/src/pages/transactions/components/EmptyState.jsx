import React from "react";
import { Typography, Button, Stack, Box } from "@mui/material";
import { Add as AddIcon, Clear as ClearIcon } from "@mui/icons-material";
import { transactionLayoutStyles } from "../styles/transactionStyles";

const EmptyState = ({
    title,
    message,
    actionLabel,
    onAction,
    showClearFilters = false,
    onClearFilters,
    variant = "default",
}) => {
    const isError = variant === "error";

    return (
        <Box
            sx={{
                ...transactionLayoutStyles.sectionCard,
                textAlign: "center",
                ...(isError && {
                    borderColor: "error.light",
                    bgcolor: "rgba(239, 68, 68, 0.04)",
                }),
            }}
        >
            <Typography variant="h6" gutterBottom fontWeight={700} color={isError ? "error" : "text.primary"}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 420, mx: "auto" }}>
                {message}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="center">
                {showClearFilters && (
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={onClearFilters}
                    >
                        Clear filters
                    </Button>
                )}
                {onAction && (
                    <Button
                        variant={isError ? "outlined" : "contained"}
                        color={isError ? "error" : "primary"}
                        startIcon={!isError ? <AddIcon /> : undefined}
                        onClick={onAction}
                    >
                        {actionLabel}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default EmptyState;
