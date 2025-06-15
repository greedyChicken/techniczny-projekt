import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import {
    AccountBalanceWallet as BudgetIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    Savings as SavingsIcon
} from '@mui/icons-material';
import { formatCurrency } from '../utils/formatters';

const BudgetSummaryCards = ({ totalBudget, totalSpent, overBudgetCount }) => {
    const remaining = totalBudget - totalSpent;

    const summaryData = [
        {
            icon: BudgetIcon,
            color: 'primary',
            value: totalBudget,
            label: 'Total Budget'
        },
        {
            icon: TrendingUpIcon,
            color: 'info',
            value: totalSpent,
            label: 'Total Spent'
        },
        {
            icon: SavingsIcon,
            color: 'success',
            value: remaining,
            label: 'Remaining',
            valueColor: 'success.main'
        },
        {
            icon: WarningIcon,
            color: 'error',
            value: overBudgetCount,
            label: 'Over Budget',
            isCurrency: false
        }
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {summaryData.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card raised>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Icon
                                    color={item.color}
                                    sx={{ fontSize: { xs: 40, sm: 48 }, mb: 2 }}
                                />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                        color: item.valueColor
                                    }}
                                >
                                    {item.isCurrency === false
                                        ? item.value
                                        : formatCurrency(item.value)
                                    }
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