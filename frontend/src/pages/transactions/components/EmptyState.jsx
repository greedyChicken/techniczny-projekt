import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';

const EmptyState = ({
                        title,
                        message,
                        actionLabel,
                        onAction,
                        showClearFilters = false,
                        onClearFilters,
                        variant = 'default'
                    }) => {
    const backgroundColor = variant === 'error' ? '#ffefef' : 'transparent';
    const titleColor = variant === 'error' ? 'error' : 'text.primary';

    return (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor }}>
            <Typography variant="h6" gutterBottom color={titleColor}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                {message}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {showClearFilters && (
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
                {onAction && (
                    <Button
                        variant={variant === 'error' ? 'outlined' : 'contained'}
                        color={variant === 'error' ? 'primary' : 'primary'}
                        startIcon={variant !== 'error' && <AddIcon />}
                        onClick={onAction}
                    >
                        {actionLabel}
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default EmptyState;