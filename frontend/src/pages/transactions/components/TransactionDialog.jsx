import React, { useEffect } from "react";
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
    Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getCategoriesByType } from "../utils/categoryHelpers";

const TYPE_INCOME = "INCOME";
const TYPE_EXPENSE = "EXPENSE";

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
    isMobile,
}) => {
    useEffect(() => {
        if (!open || !editMode) return;
        const income = getCategoriesByType(categories, TYPE_INCOME);
        const expense = getCategoriesByType(categories, TYPE_EXPENSE);
        const filtered =
            formData.type === TYPE_INCOME ? income : expense;
        const ids = filtered.map((c) => c.id);
        const match = filtered.some(
            (c) => String(c.id) === String(formData.categoryId)
        );
        // #region agent log
        fetch('http://127.0.0.1:7707/ingest/aa5f1464-405e-4693-a17e-9c44b01b2218',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'197466'},body:JSON.stringify({sessionId:'197466',runId:'post-fix',hypothesisId:'BCD',location:'TransactionDialog.jsx:useEffect',message:'edit dialog category select state',data:{formType:formData.type,formCategoryId:formData.categoryId,formCategoryIdType:typeof formData.categoryId,categoriesLen:categories.length,filteredLen:filtered.length,filteredIdsSample:ids.slice(0,5),idTypesSample:filtered.slice(0,3).map((c)=>({id:c.id,t:typeof c.id})),match},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    }, [open, editMode, formData.type, formData.categoryId, categories]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    {editMode ? "Edit transaction" : "New transaction"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="transaction-type-label">Transaction type</InputLabel>
                            <Select
                                labelId="transaction-type-label"
                                id="type"
                                name="type"
                                value={formData.type}
                                label="Transaction type"
                                onChange={onInputChange}
                            >
                                <MenuItem value={TYPE_INCOME}>Income</MenuItem>
                                <MenuItem value={TYPE_EXPENSE}>Expense</MenuItem>
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
                            inputProps={{ min: "0.01", step: "0.01" }}
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
                                {(formData.type === TYPE_INCOME
                                    ? getCategoriesByType(categories, TYPE_INCOME)
                                    : getCategoriesByType(categories, TYPE_EXPENSE)
                                ).map((category) => (
                                    <MenuItem key={category.id} value={String(category.id)}>
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
                            value={formData.description}
                            onChange={onInputChange}
                            inputProps={{ maxLength: 50 }}
                            helperText={`${formData.description.length}/50 characters`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} variant="contained">
                        {editMode ? "Save changes" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default TransactionDialog;
