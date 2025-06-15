import { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { budgetService } from '../../../api/budgetService';
import { categoryService } from '../../../api/categoryService';
import { validateBudgetForm } from '../utils/validators';

export const useBudgets = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        startDate: new Date(),
        endDate: new Date(),
        categoryIds: [],
    });

    useEffect(() => {
        fetchCategories();
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const data = await budgetService.getBudgetsByUserId(userId);
            const budgetsWithDates = data.content.map(budget => ({
                ...budget,
                startDate: parseISO(budget.startDate),
                endDate: parseISO(budget.endDate)
            }));
            setBudgets(budgetsWithDates);
            setError(null);
        } catch (err) {
            console.error('Error fetching budgets:', err);
            setError('Failed to load budgets. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategoryNames(userId);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please try again later.');
        }
    };

    const handleOpenDialog = (budget = null) => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        if (budget) {
            setEditingBudget(budget);
            setFormData({
                name: budget.name,
                amount: budget.amount.toString(),
                startDate: budget.startDate,
                endDate: budget.endDate,
                categoryIds: [...budget.categoryIds],
            });
        } else {
            setEditingBudget(null);
            setFormData({
                name: '',
                amount: '',
                startDate: startDate,
                endDate: endDate,
                categoryIds: [],
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingBudget(null);
        setFormData({
            name: '',
            amount: '',
            startDate: new Date(),
            endDate: new Date(),
            categoryIds: [],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "categoryIds") {
            setFormData(prev => ({
                ...prev,
                [name]: typeof value === 'string' ? value.split(',') : value
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


    const handleStartDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            startDate: date,
        }));
    };

    const handleEndDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            endDate: date,
        }));
    };

    const handleSubmit = async () => {
        const validation = validateBudgetForm(formData);
        if (!validation.isValid) {
            setError(Object.values(validation.errors)[0]);
            return;
        }

        try {
            const budgetData = {
                name: formData.name,
                amount: parseFloat(formData.amount),
                startDate: formData.startDate.toISOString(),
                endDate: formData.endDate.toISOString(),
                userId: userId,
                categoryIds: formData.categoryIds.map(id =>
                    typeof id === 'string' ? parseInt(id, 10) : id
                )
            };

            if (editingBudget) {
                setBudgets(budgets.map(b =>
                    b.id === editingBudget.id
                        ? {
                            ...b,
                            ...formData,
                            amount: parseFloat(formData.amount),
                            categoryIds: [...formData.categoryIds]
                        }
                        : b
                ));
                await budgetService.updateBudget(editingBudget.id, budgetData);
            } else {
                await budgetService.createBudget(budgetData);
                await fetchBudgets();
            }

            handleCloseDialog();
        } catch (err) {
            console.error('Error saving budget:', err);
            setError('Failed to save budget. Please try again.');
        }
    };

    const confirmDeleteBudget = (budgetId) => {
        setBudgetToDelete(budgetId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!budgetToDelete) return;

        try {
            setBudgets(budgets.filter(b => b.id !== budgetToDelete));
            await budgetService.deleteBudget(budgetToDelete);
        } catch (err) {
            console.error('Error deleting budget:', err);
            setError('Failed to delete budget. Please try again.');
        } finally {
            setDeleteDialogOpen(false);
            setBudgetToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setBudgetToDelete(null);
    };


    // Calculate summary values
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spentAmount || 0), 0);
    const overBudgetCount = budgets.filter(b => (b.spentAmount || 0) > b.amount).length;

    return {
        budgets,
        categories,
        loading,
        error,
        openDialog,
        editingBudget,
        formData,
        totalBudget,
        totalSpent,
        overBudgetCount,
        handleOpenDialog,
        handleCloseDialog,
        handleSubmit,
        // handleDelete,
        handleInputChange,
        handleStartDateChange,
        handleEndDateChange,
        setError,
        fetchBudgets,
        confirmDeleteBudget,
        deleteDialogOpen,
        handleConfirmDelete,
        handleCancelDelete,
        budgetToDelete
    };
};