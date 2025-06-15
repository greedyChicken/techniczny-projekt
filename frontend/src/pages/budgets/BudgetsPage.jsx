import React from 'react';
import { Container, Box, Typography, Button, Alert, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import BudgetSummaryCards from './components/BudgetSummaryCards';
import BudgetsList from './components/BudgetsList';
import BudgetDialog from './components/BudgetDialog';
import { useBudgets } from './hooks/useBudgets.js';

const BudgetsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        // State
        budgets,
        categories,
        loading,
        error,
        openDialog,
        editingBudget,
        formData,
        totalBudget,
        totalSpent,
        overBudgetCount,
        // Actions
        handleOpenDialog,
        handleCloseDialog,
        handleSubmit,
        // handleDelete,
        handleInputChange,
        handleStartDateChange,
        handleEndDateChange,
        setError,
        confirmDeleteBudget,
        deleteDialogOpen,
        handleConfirmDelete,
        handleCancelDelete,
    } = useBudgets();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 2, mb: 4 }}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 0 },
                        }}
                    >
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Budget Management
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Track and manage your spending budgets to stay on top of your finances.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            Add Budget
                        </Button>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {!isMobile && (<BudgetSummaryCards
                        totalBudget={totalBudget}
                        totalSpent={totalSpent}
                        overBudgetCount={overBudgetCount}
                    />)}

                    {/* Budgets List */}
                    <BudgetsList
                        budgets={budgets}
                        loading={loading}
                        onEdit={handleOpenDialog}
                        onDelete={confirmDeleteBudget}
                        onAddBudget={handleOpenDialog}
                        deleteDialogOpen={deleteDialogOpen}
                        handleConfirmDelete={handleConfirmDelete}
                        handleCancelDelete={handleCancelDelete}
                    />
                </Box>

                {/* Mobile FAB */}
                {isMobile && (
                    <Fab
                        color="primary"
                        aria-label="add budget"
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                        }}
                        onClick={() => handleOpenDialog()}
                    >
                        <AddIcon />
                    </Fab>
                )}

                {/* Budget Dialog */}
                <BudgetDialog
                    open={openDialog}
                    editMode={!!editingBudget}
                    formData={formData}
                    categories={categories}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                />
            </Container>
        </LocalizationProvider>
    );
};

export default BudgetsPage;