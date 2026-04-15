export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
};

const pad2 = (n) => String(n).padStart(2, '0');

export const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const formatDateTimeForAPI = (date) => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
};