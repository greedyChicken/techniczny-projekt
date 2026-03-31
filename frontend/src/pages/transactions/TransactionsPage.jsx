import React from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Fab,
    Snackbar,
    Alert,
    Stack,
} from "@mui/material";
import { Add as AddIcon, FilterList as FilterIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import FiltersPanel from "./components/FiltersPanel";
import TransactionsList from "./components/TransactionsList";
import TransactionDialog from "./components/TransactionDialog";
import { useTransactions } from "./hooks/useTransactions.js";
import { pageErrorAlertSx } from "../../styles/feedbackStyles";
import {
    transactionLayoutStyles,
    transactionPageHeaderStyles,
    transactionFabSx,
} from "./styles/transactionStyles";

const TransactionsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        transactions,
        accounts,
        categories,
        loading,
        error,
        accountsError,
        categoriesError,
        dismissAccountsError,
        dismissCategoriesError,
        dismissTransactionsError,
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
        fetchTransactions,
        refetchAccounts,
        refetchCategories,
    } = useTransactions();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg">
                <Box sx={transactionLayoutStyles.pageContainer}>
                    <Stack spacing={3}>
                        <Box sx={transactionPageHeaderStyles.wrapper}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                justifyContent="space-between"
                                alignItems={{ xs: "stretch", sm: "center" }}
                            >
                                <Box>
                                    <Typography variant="h4" gutterBottom fontWeight={700}>
                                        Transactions
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={transactionPageHeaderStyles.subtitle}
                                    >
                                        Filter, review, and add income or expenses.
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<FilterIcon />}
                                        onClick={() => setFiltersOpen(!filtersOpen)}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.5)",
                                            color: "common.white",
                                            "&:hover": {
                                                borderColor: "common.white",
                                                bgcolor: "rgba(255,255,255,0.12)",
                                            },
                                        }}
                                    >
                                        {filtersOpen ? "Hide filters" : "Filters"}
                                    </Button>
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
                                        Add transaction
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Single block under the hero (one outer gap). No Stack gap before the list when filters are collapsed. */}
                        <Stack spacing={0}>
                            {(accountsError || categoriesError || error) && (
                                <Stack spacing={1} sx={{ mb: 3 }}>
                                    {accountsError && (
                                        <Alert
                                            severity="error"
                                            sx={pageErrorAlertSx}
                                            onClose={dismissAccountsError}
                                            action={
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => refetchAccounts()}
                                                >
                                                    Retry
                                                </Button>
                                            }
                                        >
                                            {accountsError}
                                        </Alert>
                                    )}
                                    {categoriesError && (
                                        <Alert
                                            severity="error"
                                            sx={pageErrorAlertSx}
                                            onClose={dismissCategoriesError}
                                            action={
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => refetchCategories()}
                                                >
                                                    Retry
                                                </Button>
                                            }
                                        >
                                            {categoriesError}
                                        </Alert>
                                    )}
                                    {error && (
                                        <Alert
                                            severity="error"
                                            sx={pageErrorAlertSx}
                                            onClose={dismissTransactionsError}
                                            action={
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => fetchTransactions()}
                                                >
                                                    Retry
                                                </Button>
                                            }
                                        >
                                            {error}
                                        </Alert>
                                    )}
                                </Stack>
                            )}

                            <Box sx={{ mb: filtersOpen ? 3 : 0 }}>
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
                            </Box>

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
                                hasActiveFilters={Object.values(filters).some(
                                    (val) => val !== "" && val !== null
                                )}
                                isMobile={isMobile}
                            />
                        </Stack>
                    </Stack>
                </Box>

                {isMobile && (
                    <Fab
                        color="primary"
                        aria-label="Add transaction"
                        sx={transactionFabSx}
                        onClick={() => handleOpenDialog()}
                    >
                        <AddIcon />
                    </Fab>
                )}

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

export default TransactionsPage;
