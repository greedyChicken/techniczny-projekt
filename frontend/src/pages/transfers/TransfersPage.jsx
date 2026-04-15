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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { SwapHoriz as TransferIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAccounts } from "../accounts/hooks/useAccounts";
import { useTransfers } from "../accounts/hooks/useTransfers";
import TransfersList from "../accounts/components/TransfersList";
import TransferDialog from "../accounts/components/TransferDialog";
import { transferService } from "../../api/transferService";
import { pageErrorAlertSx } from "../../styles/feedbackStyles";
import { financesLayoutStyles } from "../accounts/styles/financesPageStyles";

const TransfersPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transferToDelete, setTransferToDelete] = useState(null);
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

    const handleOpenNewTransfer = () => {
        setEditingTransfer(null);
        setOpenTransferDialog(true);
    };

    const handleOpenEditTransfer = (transfer) => {
        setEditingTransfer(transfer);
        setOpenTransferDialog(true);
    };

    const handleCloseTransferDialog = () => {
        setOpenTransferDialog(false);
        setEditingTransfer(null);
    };

    const handleTransferSuccess = (isUpdate) => {
        refetchAccounts();
        fetchTransfers();
        showSnackbar(
            isUpdate ? "Transfer updated successfully" : "Transfer completed successfully"
        );
    };

    const confirmDeleteTransfer = (transferId) => {
        setTransferToDelete(transferId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDeleteTransfer = async () => {
        if (transferToDelete == null) return;
        try {
            await transferService.deleteTransfer(transferToDelete);
            setDeleteDialogOpen(false);
            setTransferToDelete(null);
            refetchAccounts();
            fetchTransfers();
            showSnackbar("Transfer deleted successfully");
        } catch (err) {
            console.error("Error deleting transfer:", err);
            showSnackbar("Failed to delete transfer. Please try again.", "error");
            setDeleteDialogOpen(false);
            setTransferToDelete(null);
        }
    };

    const handleCancelDeleteTransfer = () => {
        setDeleteDialogOpen(false);
        setTransferToDelete(null);
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
                                onClick={handleOpenNewTransfer}
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
                            onMakeTransfer={handleOpenNewTransfer}
                            onEdit={handleOpenEditTransfer}
                            onDelete={confirmDeleteTransfer}
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
                    onClick={handleOpenNewTransfer}
                >
                    <TransferIcon />
                </Fab>
            )}

            <TransferDialog
                open={openTransferDialog}
                onClose={handleCloseTransferDialog}
                accounts={accounts}
                editingTransfer={editingTransfer}
                onSuccess={(isUpdate) => {
                    handleCloseTransferDialog();
                    handleTransferSuccess(isUpdate);
                }}
                showSnackbar={showSnackbar}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDeleteTransfer}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete transfer?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This cannot be undone. Balances will be adjusted to reverse this transfer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCancelDeleteTransfer} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDeleteTransfer} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
