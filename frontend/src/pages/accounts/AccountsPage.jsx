import { useState } from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    Fab,
    Stack,
} from "@mui/material";
import { Add as AddIcon, SwapHoriz as TransferIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAccounts } from "./hooks/useAccounts";
import AccountsSummary from "./components/AccountsSummary";
import AccountsList from "./components/AccountsList";
import AccountDialog from "./components/AccountDialog";
import TransferDialog from "./components/TransferDialog";
import { financesLayoutStyles } from "./styles/financesPageStyles";
import { pageErrorAlertSx } from "../../styles/feedbackStyles";

const AccountsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const getTotalBalance = () => {
        return accounts.reduce((sum, account) => sum + account.balance, 0);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={financesLayoutStyles.pageContainer}>
                <Stack spacing={3}>
                    <Box sx={financesLayoutStyles.hero}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: "stretch", sm: "center" }}
                        >
                            <Box>
                                <Typography variant="h4" gutterBottom fontWeight={700}>
                                    Accounts
                                </Typography>
                                <Typography variant="body2" sx={financesLayoutStyles.heroSubtitle}>
                                    Manage balances and add accounts. Use transfers to move money between them.
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
                                    startIcon={<TransferIcon />}
                                    onClick={() => setOpenTransferDialog(true)}
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.2)",
                                        color: "common.white",
                                        fontWeight: 600,
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                    }}
                                >
                                    Make transfer
                                </Button>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenAccountDialog()}
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.2)",
                                        color: "common.white",
                                        fontWeight: 600,
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                    }}
                                >
                                    Add account
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={pageErrorAlertSx}
                            action={
                                <Button color="inherit" size="small" onClick={refetch}>
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    {!error && (
                        <>
                            {!loading && accounts.length > 0 && (
                                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                    <AccountsSummary
                                        totalBalance={getTotalBalance()}
                                        accountCount={accounts.length}
                                    />
                                </Box>
                            )}

                            <Box sx={financesLayoutStyles.sectionCard}>
                                <AccountsList
                                    accounts={accounts}
                                    loading={loading}
                                    onRefetch={refetch}
                                    onEdit={handleOpenAccountDialog}
                                    onDelete={() => {
                                        refetch();
                                        showSnackbar("Account deleted successfully");
                                    }}
                                    showSnackbar={showSnackbar}
                                />
                            </Box>
                        </>
                    )}
                </Stack>
            </Box>

            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="Add account"
                    sx={financesLayoutStyles.fab}
                    onClick={() => handleOpenAccountDialog()}
                >
                    <AddIcon />
                </Fab>
            )}

            <AccountDialog
                open={openAccountDialog}
                onClose={() => setOpenAccountDialog(false)}
                editMode={editMode}
                currentAccount={currentAccount}
                onSuccess={() => {
                    refetch();
                    showSnackbar(
                        editMode ? "Account updated successfully" : "Account created successfully"
                    );
                }}
                showSnackbar={showSnackbar}
            />

            <TransferDialog
                open={openTransferDialog}
                onClose={() => setOpenTransferDialog(false)}
                accounts={accounts}
                onSuccess={() => {
                    refetch();
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
                    variant="filled"
                    sx={{ width: "100%", borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AccountsPage;
