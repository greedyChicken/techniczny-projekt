export const getCategoriesByType = (categories, type) =>
    categories.filter((c) => c.transactionType === type);
