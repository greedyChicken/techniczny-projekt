import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
    AccountBalanceWallet as BudgetIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    Savings as SavingsIcon,
} from "@mui/icons-material";
import { formatCurrency } from "../utils/formatters";
import { budgetSummaryCardStyles } from "../styles/budgetStyles";

const SUMMARY_ITEMS = [
    { key: "total", icon: BudgetIcon, color: "primary", label: "Total budget", currency: true },
    { key: "spent", icon: TrendingUpIcon, color: "info", label: "Total spent", currency: true },
    { key: "remaining", icon: SavingsIcon, color: "success", label: "Remaining", currency: true, valueSx: { color: "success.main" } },
    { key: "over", icon: WarningIcon, color: "error", label: "Over budget", currency: false },
];

const BudgetSummaryCards = ({ totalBudget, totalSpent, overBudgetCount }) => {
    const remaining = totalBudget - totalSpent;
    const values = {
        total: totalBudget,
        spent: totalSpent,
        remaining,
        over: overBudgetCount,
    };

    return (
        <Grid container spacing={3}>
            {SUMMARY_ITEMS.map((item) => {
                const Icon = item.icon;
                const value = values[item.key];
                return (
                    <Grid item xs={12} sm={6} md={3} key={item.key}>
                        <Card sx={budgetSummaryCardStyles.card}>
                            <CardContent sx={budgetSummaryCardStyles.content}>
                                <Box sx={budgetSummaryCardStyles.iconBadge}>
                                    <Icon color={item.color} sx={{ fontSize: 28 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                                        ...item.valueSx,
                                    }}
                                >
                                    {item.currency ? formatCurrency(value) : value}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {item.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default BudgetSummaryCards;
