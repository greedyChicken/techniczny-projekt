export const validateAccountForm = (formData) => {
    const name = (formData.name ?? "").trim();
    if (name.length > 30) {
        return { isValid: false, error: "Name must be 30 characters or less" };
    }

    if (!name) {
        return { isValid: false, error: "Account name is required" };
    }

    const balanceStr =
        formData.balance === undefined || formData.balance === null
            ? ""
            : String(formData.balance).trim();
    if (balanceStr === "") {
        return { isValid: false, error: "Balance is required" };
    }

    if (isNaN(Number(formData.balance))) {
        return { isValid: false, error: "Balance must be a number" };
    }

    const institution = (formData.institutionName ?? "").trim();
    if (institution.length > 30) {
        return { isValid: false, error: "Institution name must be 30 characters or less" };
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

    if (Number(formData.sourceAccountId) === Number(formData.targetAccountId)) {
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