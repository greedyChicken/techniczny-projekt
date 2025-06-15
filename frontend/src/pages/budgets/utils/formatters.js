export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(amount);
};

export const getBudgetStatus = (budget) => {
    const percentage = ((budget.spentAmount || 0) / budget.amount) * 100;

    if (percentage >= 100) {
        return { status: 'over', color: 'error' };
    }

    if (percentage >= 80) {
        return { status: 'warning', color: 'warning' };
    }

    return { status: 'good', color: 'success' };
};