import { useState, useEffect } from "react";
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
} from "@mui/material";
import { accountService } from "../../../api/accountService";
import { validateAccountForm } from "../utils/validators";
import { ACCOUNT_TYPES, CURRENCIES } from "../utils/constants";

const AccountDialog = ({ open, onClose, editMode, currentAccount, onSuccess, showSnackbar }) => {
    const [formData, setFormData] = useState({
        name: "",
        accountType: "CHECKING",
        balance: "",
        currencyCode: "PLN",
        institutionName: "",
    });

    useEffect(() => {
        if (open) {
            if (editMode && currentAccount) {
                setFormData({
                    name: currentAccount.name,
                    accountType: currentAccount.accountType,
                    balance: currentAccount.balance.toString(),
                    currencyCode: currentAccount.currencyCode,
                    institutionName: currentAccount.institutionName || "",
                });
            } else {
                setFormData({
                    name: "",
                    accountType: "CHECKING",
                    balance: "",
                    currencyCode: "PLN",
                    institutionName: "",
                });
            }
        }
    }, [open, editMode, currentAccount]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const validation = validateAccountForm(formData);
        if (!validation.isValid) {
            showSnackbar(validation.error, "error");
            return;
        }

        try {
            const accountData = {
                ...formData,
                balance: Number(formData.balance),
                userId: JSON.parse(localStorage.getItem("user")).id,
            };

            if (editMode && currentAccount) {
                await accountService.updateAccount(currentAccount.id, accountData);
            } else {
                await accountService.createAccount(accountData);
            }

            onClose();
            onSuccess();
        } catch (err) {
            console.error("Error saving account:", err);
            showSnackbar("Failed to save account. Please try again.", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editMode ? "Edit Account" : "Add New Account"}</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Account Name"
                        name="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="account-type-label">Account Type</InputLabel>
                        <Select
                            labelId="account-type-label"
                            id="accountType"
                            name="accountType"
                            value={formData.accountType}
                            label="Account Type"
                            onChange={handleInputChange}
                        >
                            {ACCOUNT_TYPES.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="balance"
                        label="Current Balance"
                        name="balance"
                        type="number"
                        value={formData.balance}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: formData.currencyCode === "USD" ? "$" : "",
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="currency-label">Currency</InputLabel>
                        <Select
                            labelId="currency-label"
                            id="currencyCode"
                            name="currencyCode"
                            value={formData.currencyCode}
                            label="Currency"
                            onChange={handleInputChange}
                        >
                            {CURRENCIES.map(currency => (
                                <MenuItem key={currency.code} value={currency.code}>
                                    {currency.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="institutionName"
                        label="Institution Name (Optional)"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {editMode ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccountDialog;