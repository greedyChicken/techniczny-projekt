import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    LinearProgress,
    Chip,
    IconButton
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { formatCurrency, getBudgetStatus } from '../utils/formatters';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
    const { status, color } = getBudgetStatus(budget);
    const percentage = Math.min((budget.spentAmount / budget.amount) * 100, 100);

    return (
        <Card raised sx={{ height: '100%' }}>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            wordBreak: 'break-word'
                        }}
                    >
                        {budget.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => onEdit(budget)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(budget.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(budget.startDate, 'MMM dd')} - {format(budget.endDate, 'MMM dd, yyyy')}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                            {formatCurrency(budget.spentAmount || 0)} / {formatCurrency(budget.amount)}
                        </Typography>
                        <Typography variant="body2" color={`${color}.main`} sx={{ fontWeight: 'bold' }}>
                            {percentage.toFixed(0)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={color}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 }
                    }}
                >
                    <Chip
                        label={budget.active ? 'Active' : 'Inactive'}
                        color={budget.active ? 'success' : 'default'}
                        size="small"
                    />
                    <Chip
                        label={
                            status === 'over'
                                ? 'Over Budget'
                                : status === 'warning'
                                    ? 'Near Limit'
                                    : 'On Track'
                        }
                        color={color}
                        size="small"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default BudgetCard;