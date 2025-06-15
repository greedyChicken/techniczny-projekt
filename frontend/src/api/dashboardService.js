import apiClient from "./apiClient";

export const dashboardService = {
    getRecentTransactions: async (userId, limit = 10) => {
        const response = await apiClient.get("/transactions", {
            params: {
                userId,
                page: 0,
                size: limit,
                sort: "date,desc"
            }
        });
        return response.data;
    },

    getExpensesByCategory: async (userId, startDate, endDate) => {
        const response = await apiClient.get("/transactions/expenses-by-category", {
            params: {
                userId,
                startDate,
                endDate,
                type: "expense",
            }
        });
        return response.data;
    }
};