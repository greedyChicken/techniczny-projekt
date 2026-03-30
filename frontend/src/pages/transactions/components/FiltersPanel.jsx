import React from "react";
import {
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    Collapse,
    Divider,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enGB } from "date-fns/locale";
import { getCategoriesByType } from "../utils/categoryHelpers";
import { transactionLayoutStyles } from "../styles/transactionStyles";

const TYPE_INCOME = "INCOME";
const TYPE_EXPENSE = "EXPENSE";

const FiltersPanel = ({
    open,
    filters,
    categories,
    accounts,
    onFilterChange,
    onDateFilterChange,
    onClearFilters,
    isMobile,
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Collapse in={open}>
                <Box sx={{ ...transactionLayoutStyles.sectionCard, mb: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        Filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Narrow the list by type, category, account, or date range.
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
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
                            <FormControl fullWidth size="small">
                                <InputLabel id="category-filter-label">Category</InputLabel>
                                <Select
                                    labelId="category-filter-label"
                                    id="category-filter"
                                    name="categoryId"
                                    value={filters.categoryId}
                                    label="Category"
                                    onChange={onFilterChange}
                                >
                                    <MenuItem value="">All categories</MenuItem>
                                    <Divider />
                                    <MenuItem disabled>
                                        <em>Income</em>
                                    </MenuItem>
                                    {getCategoriesByType(categories, TYPE_INCOME).map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem disabled>
                                        <em>Expense</em>
                                    </MenuItem>
                                    {getCategoriesByType(categories, TYPE_EXPENSE).map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="account-filter-label">Account</InputLabel>
                                <Select
                                    labelId="account-filter-label"
                                    id="account-filter"
                                    name="accountId"
                                    value={filters.accountId}
                                    label="Account"
                                    onChange={onFilterChange}
                                >
                                    <MenuItem value="">All accounts</MenuItem>
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
                                label="Start date"
                                value={filters.startDate}
                                onChange={(date) => onDateFilterChange("startDate", date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: "small",
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="End date"
                                value={filters.endDate}
                                onChange={(date) => onDateFilterChange("endDate", date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: "small",
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ClearIcon />}
                            onClick={onClearFilters}
                            size={isMobile ? "small" : "medium"}
                        >
                            Clear filters
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </LocalizationProvider>
    );
};

export default FiltersPanel;
