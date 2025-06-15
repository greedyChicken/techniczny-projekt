import React, { useState, useEffect } from "react";
import {
    Paper,
    Typography,
    Divider,
    Box,
    LinearProgress,
    Chip,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import { budgetService } from "../../../api/budgetService";
import { formatCurrency } from "../utils/formatters";
import { useUIState } from "../../../contexts/UIStateContext";

const BudgetOverview = () => {
    const [budgets, setBudgets] = useState([]);
    const { showLoading, hideLoading, showError, isLoading } = useUIState();
    const loading = isLoading('budget-overview');

    useEffect(() => {
        const fetchBudgets = async () => {
            showLoading('budget-overview');
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const data = await budgetService.getBudgetsByUserId(user.id, 0, 5, "active,desc");

                const activeBudgets = (data.content || []).filter(budget => budget.active);
                setBudgets(activeBudgets.slice(0, 5)); // Show max 5 budgets
            } catch (err) {
                console.error("Error fetching budgets:", err);
            } finally {
                hideLoading('budget-overview');
            }
        };

        fetchBudgets();
    }, [showLoading, hideLoading, showError]);

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'error';
        if (percentage >= 80) return 'warning';
        return 'success';
    };

    const BudgetItem = ({ budget }) => {
        const usagePercentage = budget.amount > 0
            ? ((budget.spentAmount || 0) / budget.amount) * 100
            : 0;
        const isExceeded = usagePercentage > 100;
        const remaining = budget.amount - (budget.spentAmount || 0);

        return (
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                            {budget.name}
                        </Typography>
                        {isExceeded && (
                            <Warning color="error" fontSize="small" />
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {formatCurrency(budget.spentAmount || 0)} / {formatCurrency(budget.amount)}
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(usagePercentage, 100)}
                        color={getProgressColor(usagePercentage)}
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                    {usagePercentage > 100 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: 'error.main',
                                color: 'white',
                                px: 1,
                                borderRadius: 1,
                                fontSize: '0.75rem'
                            }}
                        >
                            +{Math.round(usagePercentage - 100)}%
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {(budget.categoryNames || []).slice(0, 2).map((category, idx) => (
                            <Chip
                                key={idx}
                                label={category}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                        {budget.categoryNames && budget.categoryNames.length > 2 && (
                            <Chip
                                label={`+${budget.categoryNames.length - 2} more`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                        {budget.allCategories && (
                            <Chip
                                label="All Categories"
                                size="small"
                                variant="outlined"
                                color="primary"
                            />
                        )}
                    </Box>
                    <Typography
                        variant="caption"
                        color={isExceeded ? 'error' : 'text.secondary'}
                        fontWeight={isExceeded ? 'bold' : 'normal'}
                    >
                        {isExceeded ? 'Exceeded' : `${formatCurrency(remaining)} left`}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Budget Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ minHeight: "300px" }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress />
                    </Box>
                ) : budgets.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <Stack spacing={2} alignItems="center">
                            <Alert severity="info">No active budgets found</Alert>
                        </Stack>
                    </Box>
                ) : (
                    <Box>
                        {budgets.map((budget) => (
                            <BudgetItem key={budget.id} budget={budget} />
                        ))}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default BudgetOverview;