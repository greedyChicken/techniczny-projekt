export const formatCurrency = (amount, currency = "PLN") => {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: currency,
    }).format(amount);
};

export const formatAccountType = (type) => {
    return type.replace("_", " ");
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
};