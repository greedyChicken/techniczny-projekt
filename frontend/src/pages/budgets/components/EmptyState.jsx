import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Add as AddIcon, AccountBalanceWallet as BudgetIcon } from "@mui/icons-material";
import { budgetLayoutStyles } from "../styles/budgetStyles";

const EmptyState = ({ onAddBudget }) => {
    return (
        <Box sx={budgetLayoutStyles.sectionCard}>
            <Stack alignItems="center" spacing={2} py={2}>
                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "action.hover",
                    }}
                >
                    <BudgetIcon sx={{ fontSize: 36, color: "primary.main" }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                    No budgets yet
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={420}>
                    Create a budget to cap spending by category and see how much room you have left.
                </Typography>
                <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => onAddBudget()}>
                    Create budget
                </Button>
            </Stack>
        </Box>
    );
};

export default EmptyState;
