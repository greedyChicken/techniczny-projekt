import React from 'react';
import { Grid } from '@mui/material';
import BudgetCard from './BudgetCard';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const BudgetsList = ({ budgets, loading, onEdit, onDelete, onAddBudget, deleteDialogOpen, handleConfirmDelete, handleCancelDelete }) => {
    if (loading) {
        return <LoadingState />;
    }

    if (budgets.length === 0) {
        return <EmptyState onAddBudget={onAddBudget} />;
    }

    return (
        <Grid container spacing={3}>
            {budgets.map((budget) => (
                <Grid item xs={12} sm={6} lg={4} key={budget.id}>
                    <BudgetCard
                        budget={budget}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Grid>
            ))}

            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this budget? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default BudgetsList;