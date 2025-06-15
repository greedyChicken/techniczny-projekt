import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button, Checkbox, ListItemText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {enGB} from "date-fns/locale";

const BudgetDialog = ({
                          open,
                          editMode,
                          formData,
                          categories,
                          onClose,
                          onSubmit,
                          onInputChange,
                          onStartDateChange,
                          onEndDateChange
                      }) => {
    const expenseCategories = categories.filter(
        category => category.transactionType === 'EXPENSE'
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Budget' : 'Create New Budget'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Budget Name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={onInputChange}
                            margin="normal"
                            inputProps={{ min: '0.01', step: '0.01' }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                multiple
                                name="categoryIds"
                                value={formData.categoryIds || []}
                                onChange={onInputChange}
                                label="Category"
                                renderValue={(selected) => {
                                    const selectedNames = expenseCategories
                                        .filter(cat => selected.includes(cat.id.toString()))
                                        .map(cat => cat.name)
                                        .join(', ');
                                    return selectedNames || 'None';
                                }}
                            >
                                {expenseCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.id.toString()}>
                                        <Checkbox
                                            checked={
                                                formData.categoryIds?.includes(category.id.toString()) || false
                                            }
                                        />
                                        <ListItemText primary={category.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        <DatePicker
                            label="Start Date"
                            value={formData.startDate}
                            onChange={onStartDateChange}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal'
                                }
                            }}
                        />

                        <DatePicker
                            label="End Date"
                            value={formData.endDate}
                            onChange={onEndDateChange}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal'
                                }
                            }}
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

export default BudgetDialog;