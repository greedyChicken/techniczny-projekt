export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(amount);
};

export const getBudgetStatus = (budget) => {
    const amount = Number(budget.amount) || 0;
    const spent = Number(budget.spentAmount) || 0;
    const percentage = amount > 0 ? (spent / amount) * 100 : 0;

    if (percentage >= 100) {
        return { status: 'over', color: 'error' };
    }

    if (percentage >= 80) {
        return { status: 'warning', color: 'warning' };
    }

    return { status: 'good', color: 'success' };
};