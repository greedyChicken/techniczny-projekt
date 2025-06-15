export const validateBudgetForm = (formData) => {
    const errors = {};

    if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Budget name is required';
    }

    if (formData.name.trim() && formData.name.trim().length > 30) {
        errors.name = 'Budget name must be 30 characters or less';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        errors.amount = 'Please enter a valid amount greater than zero';
    }

    if (!formData.startDate) {
        errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
        errors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        errors.dateRange = 'End date must be after start date';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};