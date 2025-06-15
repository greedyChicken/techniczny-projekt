import { useState } from "react";
import { Container, Box, Typography, Button, Snackbar, Alert, Fab } from "@mui/material";
import { Add as AddIcon, SwapHoriz as TransferIcon } from "@mui/icons-material";
import { useAccounts } from "./hooks/useAccounts";
import { useTransfers } from "./hooks/useTransfers";
import ViewModeToggle from "./components/ViewModeToggle";
import AccountsSummary from "./components/AccountsSummary";
import AccountsList from "./components/AccountsList";
import TransfersList from "./components/TransfersList";
import AccountDialog from "./components/AccountDialog";
import TransferDialog from "./components/TransferDialog";

const AccountsPage = () => {
    const [viewMode, setViewMode] = useState("accounts");
    const [openAccountDialog, setOpenAccountDialog] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const { accounts, loading, error, refetch } = useAccounts();
    const {
        transfers,
        loading: transfersLoading,
        fetchTransfers,
        page,
        rowsPerPage,
        totalTransfers,
        handleChangePage,
        handleChangeRowsPerPage
    } = useTransfers(viewMode);

    const handleOpenAccountDialog = (account = null) => {
        if (account) {
            setEditMode(true);
            setCurrentAccount(account);
        } else {
            setEditMode(false);
            setCurrentAccount(null);
        }
        setOpenAccountDialog(true);
    };

    const handleOpenTransferDialog = () => {
        setOpenTransferDialog(true);
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleTransferComplete = () => {
        refetch();
        if (viewMode === "transfers") {
            fetchTransfers();
        }
    };

    const getTotalBalance = () => {
        return accounts.reduce((sum, account) => sum + account.balance, 0);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 2, mb: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

                    {viewMode === "accounts" && (
                        <Box sx={{
                            display: "flex",
                            gap: 2,
                            width: { xs: "100%", sm: "auto" },
                            "& > button": {
                                flex: { xs: 1, sm: "initial" }
                            }
                        }}>
                            <Button
                                variant="outlined"
                                startIcon={<TransferIcon />}
                                onClick={handleOpenTransferDialog}
                            >
                                Make Transfer
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenAccountDialog()}
                            >
                                Add Account
                            </Button>
                        </Box>
                    )}
                </Box>

                {!loading && !error && accounts.length > 0 && viewMode === "accounts" && (
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <AccountsSummary
                            totalBalance={getTotalBalance()}
                            accountCount={accounts.length}
                        />
                    </Box>
                )}

                {viewMode === "accounts" ? (
                    <AccountsList
                        accounts={accounts}
                        loading={loading}
                        error={error}
                        onRefetch={refetch}
                        onEdit={handleOpenAccountDialog}
                        onDelete={(id) => {
                            refetch();
                            showSnackbar("Account deleted successfully");
                        }}
                        showSnackbar={showSnackbar}
                    />
                ) : (
                    <TransfersList
                        transfers={transfers}
                        loading={transfersLoading}
                        accounts={accounts}
                        onMakeTransfer={handleOpenTransferDialog}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalTransfers={totalTransfers}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </Box>

            {/* Mobile Add Button */}
            {viewMode === "accounts" && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        display: { sm: "none" },
                    }}
                >
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={() => handleOpenAccountDialog()}
                    >
                        <AddIcon />
                    </Fab>
                </Box>
            )}

            <AccountDialog
                open={openAccountDialog}
                onClose={() => setOpenAccountDialog(false)}
                editMode={editMode}
                currentAccount={currentAccount}
                onSuccess={() => {
                    refetch();
                    showSnackbar(editMode ? "Account updated successfully" : "Account created successfully");
                }}
                showSnackbar={showSnackbar}
            />

            <TransferDialog
                open={openTransferDialog}
                onClose={() => setOpenTransferDialog(false)}
                accounts={accounts}
                onSuccess={() => {
                    handleTransferComplete();
                    showSnackbar("Transfer completed successfully");
                }}
                showSnackbar={showSnackbar}
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
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AccountsPage;