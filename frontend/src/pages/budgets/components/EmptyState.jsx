import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { AccountBalanceWallet as BudgetIcon } from '@mui/icons-material';

const EmptyState = ({ onAddBudget }) => {
    return (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <BudgetIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                No budgets created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Create your first budget to start tracking your spending.
            </Typography>
            <Button variant="contained" onClick={() => onAddBudget()}>
                Create Budget
            </Button>
        </Paper>
    );
};

export default EmptyState;