import React from "react";
import {
    TablePagination,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import MobileTransactionsList from './MobileTransactionsList';
import DesktopTransactionsList from './DesktopTransactionsList';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import MobilePagination from '../../../components/MobilePagination';

const TransactionsList = ({
    transactions,
    accounts,
    loading,
    error,
    page,
    rowsPerPage,
    totalTransactions,
    expandedCards,
    onEdit,
    onDelete,
    deleteDialogOpen,
    handleConfirmDelete,
    handleCancelDelete,
    onPageChange,
    onRowsPerPageChange,
    onToggleExpand,
    onClearFilters,
    hasActiveFilters,
    isMobile,
}) => {
    const getAccountName = (accountId) => {
        const account = accounts.find((acc) => acc.id === accountId);
        return account ? account.name : "Unknown account";
    };

    if (loading) {
        return <LoadingState isMobile={isMobile} />;
    }

    if (error) {
        // Parent page shows a single Alert + Retry; avoid duplicate centered message + toast.
        return null;
    }

    if (transactions.length === 0) {
        return (
            <EmptyState
                title="No transactions yet"
                message={
                    hasActiveFilters
                        ? "Try loosening filters or add a transaction to see it here."
                        : "Add a transaction to start tracking income and expenses."
                }
                actionLabel="Add transaction"
                onAction={() => onEdit()}
                showClearFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
            />
        );
    }

    return (
        <>
            {isMobile ? (
                <MobileTransactionsList
                    transactions={transactions}
                    expandedCards={expandedCards}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleExpand={onToggleExpand}
                    getAccountName={getAccountName}
                />
            ) : (
                <DesktopTransactionsList
                    transactions={transactions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getAccountName={getAccountName}
                />
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete transaction?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This cannot be undone. This transaction will be removed from your list.
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

            {isMobile ? (
                <MobilePagination
                    count={totalTransactions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            ) : (
                <Box
                    sx={{
                        overflow: "auto",
                        width: "100%",
                        mt: 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <TablePagination
                        component="div"
                        count={totalTransactions}
                        page={page}
                        onPageChange={onPageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={onRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Rows per page:"
                        sx={{
                            borderTop: "none",
                            px: 1,
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default TransactionsList;