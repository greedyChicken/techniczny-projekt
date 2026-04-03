import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import { validateTransferForm } from "../utils/validators";
import { formatCurrency } from "../utils/formatters";
import { transferService } from "../../../api/transferService.js";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const emptyForm = () => ({
    sourceAccountId: "",
    targetAccountId: "",
    amount: "",
    date: new Date(),
    description: "",
});

const TransferDialog = ({ open, onClose, accounts, editingTransfer, onSuccess, showSnackbar }) => {
    const [formData, setFormData] = useState(() => emptyForm());

    useEffect(() => {
        if (!open) return;
        if (editingTransfer) {
            setFormData({
                sourceAccountId: editingTransfer.sourceAccountId,
                targetAccountId: editingTransfer.targetAccountId,
                amount: String(editingTransfer.amount),
                date: new Date(editingTransfer.transferDate),
                description: editingTransfer.description ?? "",
            });
        } else {
            setFormData(emptyForm());
        }
    }, [open, editingTransfer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            date: date ?? new Date(),
        }));
    };

    const currencyCode =
        accounts.find((a) => a.id === Number(formData.sourceAccountId))?.currencyCode ||
        editingTransfer?.currencyCode ||
        "PLN";

    const handleSubmit = async () => {
        const validation = validateTransferForm(formData);
        if (!validation.isValid) {
            showSnackbar(validation.error, "error");
            return;
        }

        try {
            const transferDate = formData.date
                ? new Date(formData.date).toISOString()
                : new Date().toISOString();
            const amount = Number(formData.amount);

            const transferRequest = {
                sourceAccountId: Number(formData.sourceAccountId),
                targetAccountId: Number(formData.targetAccountId),
                amount: amount,
                description: formData.description || undefined,
                date: transferDate,
            };

            if (editingTransfer) {
                await transferService.update(editingTransfer.id, transferRequest);
            } else {
                await transferService.create(transferRequest);
            }

            onClose();
            onSuccess(Boolean(editingTransfer));
        } catch (err) {
            console.error("Error saving transfer:", err);
            showSnackbar(
                editingTransfer
                    ? "Failed to update transfer. Please try again."
                    : "Failed to complete transfer. Please try again.",
                "error"
            );
        }
    };

    const isEdit = Boolean(editingTransfer);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    {isEdit ? "Edit transfer" : "New transfer"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="source-account-label">From account</InputLabel>
                            <Select
                                labelId="source-account-label"
                                id="sourceAccountId"
                                name="sourceAccountId"
                                value={formData.sourceAccountId}
                                label="From account"
                                onChange={handleInputChange}
                            >
                                {accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>
                                        {account.name} - {formatCurrency(account.balance, account.currencyCode)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="target-account-label">To account</InputLabel>
                            <Select
                                labelId="target-account-label"
                                id="targetAccountId"
                                name="targetAccountId"
                                value={formData.targetAccountId}
                                label="To account"
                                onChange={handleInputChange}
                                disabled={!formData.sourceAccountId}
                            >
                                {accounts
                                    .filter((account) => account.id !== Number(formData.sourceAccountId))
                                    .map((account) => (
                                        <MenuItem key={account.id} value={account.id}>
                                            {account.name} - {formatCurrency(account.balance, account.currencyCode)}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="amount"
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">{currencyCode}</InputAdornment>
                                ),
                            }}
                            inputProps={{ min: "0.01", step: "0.01" }}
                        />
                        <DatePicker
                            label="Date"
                            value={formData.date}
                            onChange={handleDateChange}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: "normal",
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="description"
                            label="Description (optional)"
                            name="description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 50 }}
                            helperText={`${formData.description.length}/50 characters`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {isEdit ? "Save changes" : "Transfer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default TransferDialog;
