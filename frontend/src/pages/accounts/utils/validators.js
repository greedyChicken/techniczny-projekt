export const validateAccountForm = (formData) => {
    if (formData.name.trim() && formData.name.trim().length > 30) {
        return {isValid: false, error: 'Name must be 30 characters or less'}
    }

    if (!formData.name.trim()) {
        return { isValid: false, error: "Account name is required" };
    }

    if (isNaN(Number(formData.balance))) {
        return { isValid: false, error: "Balance must be a number" };
    }

    if (formData.institutionName.trim() && formData.institutionName.trim().length > 30) {
        return {isValid: false, error: 'Institution name must be 30 characters or less'}
    }

    return { isValid: true };
};

export const validateTransferForm = (formData) => {
    if (!formData.sourceAccountId) {
        return { isValid: false, error: "Please select source account" };
    }

    if (!formData.targetAccountId) {
        return { isValid: false, error: "Please select target account" };
    }

    if (formData.sourceAccountId === formData.targetAccountId) {
        return { isValid: false, error: "Source and target accounts must be different" };
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        return { isValid: false, error: "Amount must be a positive number" };
    }

    if (formData.description && formData.description.length > 50) {
        return {isValid: false, error: 'Description must be 50 characters or less'}
    }

    return { isValid: true };
};