import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {enGB} from "date-fns/locale";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

const TransactionDialog = ({
                               open,
                               editMode,
                               formData,
                               accounts,
                               categories,
                               onClose,
                               onSubmit,
                               onInputChange,
                               onDateChange,
                               isMobile
                           }) => {
    const getCategoriesByType = (type) => {
        return categories.filter(category => category.transactionType === type);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>
                    {editMode ? 'Edit Transaction' : 'Add New Transaction'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
                            <Select
                                labelId="transaction-type-label"
                                id="type"
                                name="type"
                                value={formData.type}
                                label="Transaction Type"
                                onChange={onInputChange}
                            >
                                <MenuItem value="INCOME">Income</MenuItem>
                                <MenuItem value="EXPENSE">Expense</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="account-label">Account</InputLabel>
                            <Select
                                labelId="account-label"
                                id="accountId"
                                name="accountId"
                                value={formData.accountId}
                                label="Account"
                                onChange={onInputChange}
                            >
                                {accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>
                                        {account.name}
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
                            inputProps={{ min: '0.01', step: '0.01' }}
                            value={formData.amount}
                            onChange={onInputChange}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="categoryId"
                                value={formData.categoryId}
                                label="Category"
                                onChange={onInputChange}
                            >
                                {formData.type === 'INCOME'
                                    ? getCategoriesByType('INCOME').map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))
                                    : getCategoriesByType('EXPENSE').map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <DatePicker
                            label="Date"
                            value={formData.date}
                            onChange={onDateChange}
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
                            value={formData.description}
                            onChange={onInputChange}
                            inputProps={{ maxLength: 50 }}
                            helperText={`${formData.description.length}/50 characters`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onSubmit} variant="contained">
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default TransactionDialog;