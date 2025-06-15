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
import {transferService} from "../../../api/transferService.js";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {enGB} from "date-fns/locale";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

const TransferDialog = ({ open, onClose, accounts, onSuccess, showSnackbar }) => {
    const [formData, setFormData] = useState({
        sourceAccountId: "",
        targetAccountId: "",
        amount: "",
        date: new Date(),
        description: "",
    });

    useEffect(() => {
        if (open) {
            setFormData({
                sourceAccountId: "",
                targetAccountId: "",
                amount: "",
                date: new Date(),
                description: "",
            });
        }
    }, [open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const validation = validateTransferForm(formData);
        if (!validation.isValid) {
            showSnackbar(validation.error, "error");
            return;
        }

        try {
            const transferDate = formData.date ? new Date(formData.date).toISOString() : new Date().toISOString();
            const amount = Number(formData.amount);

            const transferRequest = {
                sourceAccountId: Number(formData.sourceAccountId),
                targetAccountId: Number(formData.targetAccountId),
                amount: amount,
                description: formData.description,
                date: transferDate,
            };

            await transferService.create(transferRequest);

            onClose();
            onSuccess();
        } catch (err) {
            console.error("Error creating transfer:", err);
            showSnackbar("Failed to complete transfer. Please try again.", "error");
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Make Transfer</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="source-account-label">From Account</InputLabel>
                            <Select
                                labelId="source-account-label"
                                id="sourceAccountId"
                                name="sourceAccountId"
                                value={formData.sourceAccountId}
                                label="From Account"
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
                            <InputLabel id="target-account-label">To Account</InputLabel>
                            <Select
                                labelId="target-account-label"
                                id="targetAccountId"
                                name="targetAccountId"
                                value={formData.targetAccountId}
                                label="To Account"
                                onChange={handleInputChange}
                                disabled={!formData.sourceAccountId}
                            >
                                {accounts
                                    .filter(account => account.id !== Number(formData.sourceAccountId))
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
                                startAdornment: <InputAdornment position="start">PLN</InputAdornment>,
                            }}
                        />
                        <DatePicker
                            label="Date"
                            value={formData.date}
                            onChange={handleInputChange}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal'
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="description"
                            label="Description (Optional)"
                            name="description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Transfer
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default TransferDialog;