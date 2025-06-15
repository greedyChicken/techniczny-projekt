import apiClient from "./apiClient";

export const budgetService = {
  getBudgetsByUserId: async (
    userId,
    page = 0,
    size = 20,
    sort = "id"
  ) => {
    const params = {
      userId,
      page,
      size,
      sort,
    };
    const response = await apiClient.get("/budgets", { params });
    return response.data;
  },

  createBudget: async (budgetData) => {
    const response = await apiClient.post("/budgets", budgetData);
    return response.data;
  },

  updateBudget: async (budgetId, budgetData) => {
    const response = await apiClient.put(`/budgets/${budgetId}`, budgetData);
    return response.data;
  },

  deleteBudget: async (budgetId) => {
    const response = await apiClient.delete(`/budgets/${budgetId}`);
    return response.data;
  }
};
