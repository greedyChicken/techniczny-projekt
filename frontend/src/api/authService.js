import apiClient from "./apiClient";

export const authService = {
  authenticate: async (credentials) => {
    const response = await apiClient.post("/users/authenticate", credentials);
    saveUserData(response.data);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/users", userData);
    saveUserData(response.data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");

    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user JSON:", error);
      return null;
    }
  },

  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    await apiClient.delete(`/users/${userId}`);
    return true;
  },
};

const saveUserData = (data) => {
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
}