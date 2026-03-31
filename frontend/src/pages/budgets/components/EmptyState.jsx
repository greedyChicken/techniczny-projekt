import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const EmptyState = ({ onAddBudget }) => {
    return (
        <Box
            sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Typography variant="h6" gutterBottom fontWeight={700}>
                No budgets yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Create your first budget to cap spending by category and see how much room you have left.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => onAddBudget()}>
                Add budget
            </Button>
        </Box>
    );
};

export default EmptyState;
