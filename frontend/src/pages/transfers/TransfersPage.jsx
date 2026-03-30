import { useState } from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    Snackbar,
    Alert,
    Fab,
} from "@mui/material";
import { SwapHoriz as TransferIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAccounts } from "../accounts/hooks/useAccounts";
import { useTransfers } from "../accounts/hooks/useTransfers";
import TransfersList from "../accounts/components/TransfersList";
import TransferDialog from "../accounts/components/TransferDialog";
import { pageErrorAlertSx } from "../../styles/feedbackStyles";
import { financesLayoutStyles } from "../accounts/styles/financesPageStyles";

const TransfersPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const { accounts, refetch: refetchAccounts } = useAccounts();
    const {
        transfers,
        loading,
        error,
        fetchTransfers,
        dismissError,
        page,
        rowsPerPage,
        totalTransfers,
        handleChangePage,
        handleChangeRowsPerPage,
    } = useTransfers();

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleTransferSuccess = () => {
        refetchAccounts();
        fetchTransfers();
        showSnackbar("Transfer completed successfully");
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
                                    Transfers
                                </Typography>
                                <Typography variant="body2" sx={financesLayoutStyles.heroSubtitle}>
                                    Move money between your accounts. Balances update after each transfer.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="inherit"
                                startIcon={<TransferIcon />}
                                onClick={() => setOpenTransferDialog(true)}
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    color: "common.white",
                                    fontWeight: 600,
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                }}
                            >
                                New transfer
                            </Button>
                        </Stack>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={pageErrorAlertSx}
                            onClose={dismissError}
                            action={
                                <Button color="inherit" size="small" onClick={() => fetchTransfers()}>
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    {!error && (
                        <TransfersList
                            transfers={transfers}
                            loading={loading}
                            onMakeTransfer={() => setOpenTransferDialog(true)}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalTransfers={totalTransfers}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </Stack>
            </Box>

            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="New transfer"
                    sx={financesLayoutStyles.fab}
                    onClick={() => setOpenTransferDialog(true)}
                >
                    <TransferIcon />
                </Fab>
            )}

            <TransferDialog
                open={openTransferDialog}
                onClose={() => setOpenTransferDialog(false)}
                accounts={accounts}
                onSuccess={() => {
                    setOpenTransferDialog(false);
                    handleTransferSuccess();
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

export default TransfersPage;
