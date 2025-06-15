export const formatCurrency = (value, currency = "PLN", locale = "pl-PL") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
};

export const formatDate = (
    date,
    options = { year: "numeric", month: "short", day: "numeric" },
    locale = "en-US"
) => {
    if (!date) return "";
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

export const formatPercentage = (value, decimalPlaces = 1) => {
    return `${value.toFixed(decimalPlaces)}%`;
};
