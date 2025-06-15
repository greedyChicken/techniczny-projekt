import apiClient from "./apiClient";

export const transactionService = {
  getTransactions: async (filter = {}, page = 0, size = 20, sort = "id") => {
    const params = {
      ...filter,
      page,
      size,
      sort,
    };
    const response = await apiClient.get("/transactions", { params });
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await apiClient.post("/transactions", transactionData);
    return response.data;
  },

  updateTransaction: async (transactionId, transactionData) => {
    const response = await apiClient.put(
      `/transactions/${transactionId}`,
      transactionData
    );
    return response.data;
  },

  deleteTransaction: async (transactionId) => {
    await apiClient.delete(`/transactions/${transactionId}`);
    return true;
  },
};
