import apiClient from "./apiClient";

export const parseJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const nowInSeconds = Date.now() / 1000;
  return payload.exp < nowInSeconds;
};

export const authService = {
  /**
   * Persists token + minimal user object from JWT claims (used after Google OAuth redirect).
   */
  persistSessionFromJwt(token) {
    if (!token) return false;
    const payload = parseJwt(token);
    if (!payload?.userId || payload.sub == null || payload.sub === "") {
      return false;
    }
    if (isTokenExpired(token)) {
      return false;
    }
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ id: payload.userId, email: payload.sub })
    );
    return true;
  },

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
    const token = localStorage.getItem("token");

    if (!userStr || userStr === "undefined" || userStr === "null" || !token) {
      return null;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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