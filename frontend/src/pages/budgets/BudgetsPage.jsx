import React from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Alert,
    Fab,
    Stack,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import BudgetSummaryCards from "./components/BudgetSummaryCards";
import BudgetsList from "./components/BudgetsList";
import BudgetDialog from "./components/BudgetDialog";
import { useBudgets } from "./hooks/useBudgets.js";
import {
    budgetLayoutStyles,
    budgetPageHeaderStyles,
    budgetFabSx,
} from "./styles/budgetStyles";

const BudgetsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
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
        handleOpenDialog,
        handleCloseDialog,
        handleSubmit,
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
                <Box sx={budgetLayoutStyles.pageContainer}>
                    <Stack spacing={3}>
                        <Box sx={budgetPageHeaderStyles.wrapper}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                justifyContent="space-between"
                                alignItems={{ xs: "stretch", sm: "center" }}
                            >
                                <Box>
                                    <Typography variant="h4" gutterBottom fontWeight={700}>
                                        Budgets
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={budgetPageHeaderStyles.subtitle}
                                    >
                                        Track limits and spending so you stay in control.
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog()}
                                    sx={{
                                        display: { xs: "none", sm: "inline-flex" },
                                        bgcolor: "rgba(255,255,255,0.2)",
                                        color: "common.white",
                                        fontWeight: 600,
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                    }}
                                >
                                    Add budget
                                </Button>
                            </Stack>
                        </Box>

                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {!isMobile && (
                            <BudgetSummaryCards
                                totalBudget={totalBudget}
                                totalSpent={totalSpent}
                                overBudgetCount={overBudgetCount}
                            />
                        )}

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
                    </Stack>
                </Box>

                {isMobile && (
                    <Fab
                        color="primary"
                        aria-label="Add budget"
                        sx={budgetFabSx}
                        onClick={() => handleOpenDialog()}
                    >
                        <AddIcon />
                    </Fab>
                )}

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
