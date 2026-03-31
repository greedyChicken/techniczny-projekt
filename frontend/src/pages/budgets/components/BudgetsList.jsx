import React from "react";
import {
    Box,
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
import { budgetListGridSx } from "../styles/budgetStyles";

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
            <Box sx={budgetListGridSx}>
                {budgets.map((budget) => (
                    <BudgetCard key={budget.id} budget={budget} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </Box>

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
