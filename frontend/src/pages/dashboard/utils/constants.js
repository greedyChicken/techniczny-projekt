export const DASHBOARD_CONSTANTS = {
    LOADING_KEYS: {
        SUMMARY: 'dashboard-summary',
        TRANSACTIONS: 'dashboard-transactions',
        CHARTS: 'dashboard-charts',
    },
    CHART_COLORS: [
        '#4CAF50', // green
        '#2196F3', // blue
        '#FFC107', // amber
        '#FF5722', // deep orange
        '#9C27B0', // purple
        '#00BCD4', // cyan
        '#795548', // brown
        '#607D8B', // blue grey
    ],
    DEFAULT_CURRENCY: 'USD',
    DEFAULT_LOCALE: 'en-US',
    CARD_HEIGHTS: {
        SUMMARY: '100%',
        TRANSACTIONS: '300px',
        CHARTS: '250px',
    },
};

export const TRANSACTION_TYPE_ICONS = {
    INCOME: 'trending_up',
    EXPENSE: 'trending_down',
    TRANSFER: 'swap_horiz',
    ADJUSTMENT: 'published_with_changes',
};

export const CHART_TYPES = {
    PIE: 'pie',
    BAR: 'bar',
    LINE: 'line',
    AREA: 'area',
};
