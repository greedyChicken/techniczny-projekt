import React from 'react';
import {
    Paper,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    InputAdornment,
    Button,
    Box,
    Collapse,
    Divider
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {enGB} from "date-fns/locale";

const FiltersPanel = ({
                          open,
                          filters,
                          categories,
                          accounts,
                          onFilterChange,
                          onDateFilterChange,
                          onClearFilters,
                          isMobile
                      }) => {
    const getCategoriesByType = (type) => {
        return categories.filter(category => category.transactionType === type);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Collapse in={open}>
                <Paper sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    overflow: 'hidden',
                    width: '100%'
                }}>
                    <Typography variant="h6" gutterBottom>
                        Filter Transactions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth margin="normal" size="small">
                                <InputLabel id="type-filter-label">Type</InputLabel>
                                <Select
                                    labelId="type-filter-label"
                                    id="type-filter"
                                    name="type"
                                    value={filters.type}
                                    label="Type"
                                    onChange={onFilterChange}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="INCOME">Income</MenuItem>
                                    <MenuItem value="EXPENSE">Expense</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth margin="normal" size="small">
                                <InputLabel id="category-filter-label">Category</InputLabel>
                                <Select
                                    labelId="category-filter-label"
                                    id="category-filter"
                                    name="categoryId"
                                    value={filters.categoryId}
                                    label="Category"
                                    onChange={onFilterChange}
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    <Divider />
                                    <MenuItem disabled>
                                        <em>Income</em>
                                    </MenuItem>
                                    {getCategoriesByType('INCOME').map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem disabled>
                                        <em>Expense</em>
                                    </MenuItem>
                                    {getCategoriesByType('EXPENSE').map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth margin="normal" size="small">
                                <InputLabel id="account-filter-label">Account</InputLabel>
                                <Select
                                    labelId="account-filter-label"
                                    id="account-filter"
                                    name="accountId"
                                    value={filters.accountId}
                                    label="Account"
                                    onChange={onFilterChange}
                                >
                                    <MenuItem value="">All Accounts</MenuItem>
                                    {accounts.map((account) => (
                                        <MenuItem key={account.id} value={account.id}>
                                            {account.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Start Date"
                                value={filters.startDate}
                                onChange={(date) => onDateFilterChange('startDate', date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        margin: 'normal',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="End Date"
                                value={filters.endDate}
                                onChange={(date) => onDateFilterChange('endDate', date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        margin: 'normal',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        overflow: 'hidden'
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={onClearFilters}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                </Paper>
            </Collapse>
        </LocalizationProvider>
    );
};

export default FiltersPanel;