import { useState, useEffect } from 'react';
import { transactionService } from '../../../api/transactionService';
import { accountService } from '../../../api/accountService';
import { categoryService } from '../../../api/categoryService';
import { validateTransactionForm } from '../utils/validators';
import { formatDateForAPI, formatDateTimeForAPI } from '../utils/formatters';
import { loadFailedMessage } from '../../../utils/feedbackMessages';

export const useTransactions = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState(null);
    const [accountsError, setAccountsError] = useState(null);
    const [categoriesError, setCategoriesError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [formData, setFormData] = useState({
        accountId: '',
        amount: '',
        categoryId: '',
        type: 'EXPENSE',
        description: '',
        date: new Date(),
    });
    const [filters, setFilters] = useState({
        type: '',
        categoryId: '',
        startDate: null,
        endDate: null,
        accountId: '',
        searchText: '',
    });
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [expandedCards, setExpandedCards] = useState({});
    const [exportingCsv, setExportingCsv] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    const buildTransactionFilterParams = () => {
        const params = { ...filters };
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null) {
                delete params[key];
            }
        });
        if (params.startDate) {
            params.startDate = formatDateForAPI(params.startDate);
        }
        if (params.endDate) {
            params.endDate = formatDateForAPI(params.endDate);
        }
        return params;
    };

    useEffect(() => {
        fetchCategories();
        fetchAccounts();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage, filters]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategoryNames(userId);
            setCategories(data);
            setCategoriesError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategoriesError(loadFailedMessage('categories'));
        }
    };

    const fetchAccounts = async () => {
        try {
            const data = await accountService.getAccountsByUserId(userId);
            setAccounts(data);
            setAccountsError(null);
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setAccountsError(loadFailedMessage('accounts'));
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size: rowsPerPage,
                sort: 'id',
                ...buildTransactionFilterParams(),
            };

            const data = await transactionService.getTransactions(params);
            setTransactions(data.content);
            setTotalTransactions(data.totalElements);
            setTransactionsError(null);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setTransactionsError(loadFailedMessage('transactions'));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (transaction = null) => {
        if (transaction) {
            setEditMode(true);
            setCurrentTransaction(transaction);
            setFormData({
                accountId: transaction.accountId,
                amount: Math.abs(transaction.amount).toString(),
                type: transaction.type,
                categoryId:
                    transaction.categoryId != null && transaction.categoryId !== undefined
                        ? String(transaction.categoryId)
                        : '',
                description: transaction.description || '',
                date: new Date(transaction.date),
            });
        } else {
            setEditMode(false);
            setCurrentTransaction(null);
            setFormData({
                accountId: accounts.length > 0 ? accounts[0].id : '',
                amount: '',
                categoryId: '',
                type: "EXPENSE",
                description: '',
                date: new Date(),
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

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
            date,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateTransactionForm(formData);
        if (!validation.isValid) {
            showSnackbar(Object.values(validation.errors)[0], 'error');
            return;
        }

        try {
            const transactionData = {
                ...formData,
                date: formatDateTimeForAPI(formData.date),
            };

            if (editMode && currentTransaction) {
                await transactionService.updateTransaction(
                    currentTransaction.id,
                    transactionData
                );
                showSnackbar('Transaction updated successfully');
            } else {
                await transactionService.createTransaction(transactionData);
                showSnackbar('Transaction created successfully');
            }

            handleCloseDialog();
            await fetchTransactions();
        } catch (err) {
            console.error('Error saving transaction:', err);
            showSnackbar('Failed to save transaction. Please try again.', 'error');
        }
    };

    const confirmDeleteTransaction = (transactionId) => {
        setTransactionToDelete(transactionId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDeleteTransaction = async () => {
        if (transactionToDelete == null) return;

        try {
            await transactionService.deleteTransaction(transactionToDelete);
            showSnackbar('Transaction deleted successfully');
            fetchTransactions();
        } catch (err) {
            console.error('Error deleting transaction:', err);
            showSnackbar('Failed to delete transaction. Please try again.', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setTransactionToDelete(null);
        }
    };

    const handleCancelDeleteTransaction = () => {
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setPage(0);
    };

    const handleDateFilterChange = (name, date) => {
        setFilters((prev) => ({
            ...prev,
            [name]: date,
        }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            categoryId: '',
            startDate: null,
            endDate: null,
            accountId: '',
            searchText: '',
        });
        setPage(0);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const toggleCardExpansion = (transactionId) => {
        setExpandedCards((prev) => ({
            ...prev,
            [transactionId]: !prev[transactionId],
        }));
    };

    const handleExportCsv = async () => {
        setExportingCsv(true);
        try {
            const { blob, filename } = await transactionService.exportTransactionsCsv(
                buildTransactionFilterParams()
            );
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
            showSnackbar('Transactions exported to CSV');
        } catch (err) {
            console.error('Error exporting transactions:', err);
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : 'Failed to export transactions. Please try again.';
            showSnackbar(message, 'error');
        } finally {
            setExportingCsv(false);
        }
    };

    return {
        // State
        transactions,
        accounts,
        categories,
        loading,
        error: transactionsError,
        accountsError,
        categoriesError,
        dismissAccountsError: () => setAccountsError(null),
        dismissCategoriesError: () => setCategoriesError(null),
        dismissTransactionsError: () => setTransactionsError(null),
        page,
        rowsPerPage,
        totalTransactions,
        openDialog,
        editMode,
        formData,
        filters,
        filtersOpen,
        snackbar,
        expandedCards,
        exportingCsv,
        // Actions
        handleOpenDialog,
        handleCloseDialog,
        handleSubmit,
        confirmDeleteTransaction,
        deleteDialogOpen,
        handleConfirmDeleteTransaction,
        handleCancelDeleteTransaction,
        handleChangePage,
        handleChangeRowsPerPage,
        setFiltersOpen,
        handleCloseSnackbar,
        handleInputChange,
        handleDateChange,
        handleFilterChange,
        handleDateFilterChange,
        clearFilters,
        toggleCardExpansion,
        fetchTransactions,
        refetchAccounts: fetchAccounts,
        refetchCategories: fetchCategories,
        showSnackbar,
        handleExportCsv,
    };
};