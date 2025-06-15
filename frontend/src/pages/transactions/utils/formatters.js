export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
};

export const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
};

export const formatDateTimeForAPI = (date) => {
    return date.toISOString().slice(0, 19);
};