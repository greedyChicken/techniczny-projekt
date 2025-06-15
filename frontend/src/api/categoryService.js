import apiClient from "./apiClient";

export const categoryService = {
  getCategoryNames: async (userId) => {
    const response = await apiClient.get("/categories", {
      params: {
        userId: userId
      }
    });
    return response.data;
  },
};
