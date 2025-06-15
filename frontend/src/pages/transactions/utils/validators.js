export const validateTransactionForm = (formData) => {
    const errors = {};

    if (!formData.accountId) {
        errors.accountId = 'Please select an account';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        errors.amount = 'Please enter a valid amount greater than zero';
    }

    if (!formData.categoryId) {
        errors.categoryId = 'Please select a category';
    }

    if (!formData.date) {
        errors.date = 'Please select a date';
    }

    if (formData.description && formData.description.length > 50) {
        errors.description = 'Description must be 50 characters or less';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};