import React from 'react';
import { TablePagination, Box, useTheme, useMediaQuery } from '@mui/material';
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
                              onPageChange,
                              onRowsPerPageChange,
                              onToggleExpand,
                              onRetry,
                              onClearFilters,
                              hasActiveFilters,
                              isMobile
                          }) => {
    const theme = useTheme();
    useMediaQuery(theme.breakpoints.down('xs'));
    const getAccountName = (accountId) => {
        const account = accounts.find((acc) => acc.id === accountId);
        return account ? account.name : 'Unknown Account';
    };

    if (loading) {
        return <LoadingState isMobile={isMobile} />;
    }

    if (error) {
        return (
            <EmptyState
                title="Error Loading Transactions"
                message={error}
                actionLabel="Retry"
                onAction={onRetry}
                variant="error"
            />
        );
    }

    if (transactions.length === 0) {
        return (
            <EmptyState
                title="No transactions found"
                message={
                    hasActiveFilters
                        ? "Try adjusting your filters or create your first transaction to start tracking your finances."
                        : "Create your first transaction to start tracking your finances."
                }
                actionLabel="Add Transaction"
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

            {isMobile ? (
                <MobilePagination
                    count={totalTransactions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            ) : (
                <Box sx={{
                    overflow: 'auto',
                    width: '100%',
                    '.MuiTablePagination-root': {
                        overflow: 'hidden'
                    }
                }}>
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
                            borderTop: 1,
                            borderColor: 'divider',
                            mt: 2
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default TransactionsList;