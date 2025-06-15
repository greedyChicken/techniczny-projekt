import React from 'react';
import { Container, Box, Typography, Button, Fab, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import FiltersPanel from './components/FiltersPanel';
import TransactionsList from './components/TransactionsList';
import TransactionDialog from './components/TransactionDialog';
import { useTransactions } from './hooks/useTransactions.js';

const TransactionsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        // State
        transactions,
        accounts,
        categories,
        loading,
        error,
        page,
        rowsPerPage,
        totalTransactions,
        openDialog,
        editMode,
        formData,
        filters,
        filtersOpen,
        snackbar,
        expandedCards,
        // Actions
        handleOpenDialog,
        handleCloseDialog,
        handleSubmit,
        handleDeleteTransaction,
        handleChangePage,
        handleChangeRowsPerPage,
        setFiltersOpen,
        handleCloseSnackbar,
        handleInputChange,
        handleDateChange,
        handleFilterChange,
        handleDateFilterChange,
        clearFilters,
        toggleCardExpansion,
        fetchTransactions
    } = useTransactions();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
                <Box sx={{ mt: 2, mb: 4, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        gap: 1,
                        flexWrap: 'wrap'
                    }}>
                        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                            Transactions
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                size={isMobile ? "small" : "medium"}
                            >
                                {filtersOpen ? "Hide" : "Filter"}
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                Add Transaction
                            </Button>
                        </Box>
                    </Box>

                    {/* Filters */}
                    <FiltersPanel
                        open={filtersOpen}
                        filters={filters}
                        categories={categories}
                        accounts={accounts}
                        onFilterChange={handleFilterChange}
                        onDateFilterChange={handleDateFilterChange}
                        onClearFilters={clearFilters}
                        isMobile={isMobile}
                    />

                    {/* Transactions List */}
                    <TransactionsList
                        transactions={transactions}
                        accounts={accounts}
                        loading={loading}
                        error={error}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalTransactions={totalTransactions}
                        expandedCards={expandedCards}
                        onEdit={handleOpenDialog}
                        onDelete={handleDeleteTransaction}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        onToggleExpand={toggleCardExpansion}
                        onRetry={fetchTransactions}
                        onClearFilters={clearFilters}
                        hasActiveFilters={Object.values(filters).some(val => val !== '' && val !== null)}
                        isMobile={isMobile}
                    />
                </Box>

                {/* Mobile FAB */}
                {isMobile && (
                    <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                        <Fab color="primary" aria-label="add" onClick={() => handleOpenDialog()}>
                            <AddIcon />
                        </Fab>
                    </Box>
                )}

                {/* Transaction Dialog */}
                <TransactionDialog
                    open={openDialog}
                    editMode={editMode}
                    formData={formData}
                    accounts={accounts}
                    categories={categories}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                    onDateChange={handleDateChange}
                    isMobile={isMobile}
                />

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </LocalizationProvider>
    );
};

export default TransactionsPage;