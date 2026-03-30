import React from "react";
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import BudgetCard from "./BudgetCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const BudgetsList = ({
    budgets,
    loading,
    onEdit,
    onDelete,
    onAddBudget,
    deleteDialogOpen,
    handleConfirmDelete,
    handleCancelDelete,
}) => {
    if (loading) {
        return <LoadingState />;
    }

    if (budgets.length === 0) {
        return <EmptyState onAddBudget={onAddBudget} />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {budgets.map((budget) => (
                    <Grid item xs={12} sm={6} lg={4} key={budget.id}>
                        <BudgetCard budget={budget} onEdit={onEdit} onDelete={onDelete} />
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete budget?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This cannot be undone. This budget will be removed from your list.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCancelDelete} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BudgetsList;
