import apiClient from "./apiClient";

export const accountService = {
  getAccountsByUserId: async (userId) => {
    const response = await apiClient.get("/accounts", {
      params: {
        userId: userId
      }
    });
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await apiClient.post("/accounts", accountData);
    return response.data;
  },

  deleteAccount: async (accountId) => {
    const response = await apiClient.delete(`/accounts/${accountId}`);
    return response.data;
  },

  getSummary: async (userId) => {
    const response = await apiClient.get(`/accounts/summary`, {
      params: {
        userId: userId
      }
    });
    return response.data;
  },

  updateAccount: async (accountId, accountData) => {
    const response = await apiClient.put(`/accounts/${accountId}`, accountData)
    return response.data;
  },
};
