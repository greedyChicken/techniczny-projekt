import React from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Alert,
    Fab,
    Stack,
    Snackbar,
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
import { pageErrorAlertSx } from "../../styles/feedbackStyles";

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
        snackbar,
        handleCloseSnackbar,
    } = useBudgets();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        ...budgetLayoutStyles.pageContainer,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box sx={budgetPageHeaderStyles.wrapper}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                justifyContent: "space-between",
                                alignItems: { xs: "stretch", sm: "center" },
                            }}
                        >
                            <Box>
                                <Typography variant="h4" gutterBottom fontWeight={700}>
                                    Budgets
                                </Typography>
                                <Typography variant="body2" sx={budgetPageHeaderStyles.subtitle}>
                                    Track limits and spending so you stay in control.
                                </Typography>
                            </Box>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{
                                    width: { xs: "100%", sm: "auto" },
                                    "& > button": { width: { xs: "100%", sm: "auto" } },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog()}
                                    sx={{
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
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={pageErrorAlertSx}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box sx={budgetLayoutStyles.contentStack}>
                        {!isMobile && (
                            <BudgetSummaryCards
                                totalBudget={totalBudget}
                                totalSpent={totalSpent}
                                overBudgetCount={overBudgetCount}
                            />
                        )}

                        <Box sx={budgetLayoutStyles.sectionCard}>
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
                    </Box>
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

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: "100%", borderRadius: 2 }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </LocalizationProvider>
    );
};

export default BudgetsPage;
