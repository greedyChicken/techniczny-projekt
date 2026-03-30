import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../api/authService";
import { useUIState } from "./UIStateContext";
import {
  AUTH_LOGIN_FALLBACK,
  AUTH_REGISTER_FALLBACK,
} from "../utils/feedbackMessages";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const { showLoading, hideLoading, showError } = useUIState();

  useEffect(() => {
    const initAuth = async () => {
      showLoading('auth-init');
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error during auth initialization:", err);
        if (err.message !== 'No user found') {
          showError("Authentication failed. Please log in again.");
        }
      } finally {
        hideLoading('auth-init');
        setInitialized(true);
      }
    };

    initAuth();
  }, [showLoading, hideLoading, showError]);

  const login = async (credentials) => {
    showLoading('auth-login');
    try {
      const data = await authService.authenticate(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || AUTH_LOGIN_FALLBACK;
      showError(message);
      throw err;
    } finally {
      hideLoading('auth-login');
    }
  };

  const register = async (userData) => {
    showLoading('auth-register');
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || AUTH_REGISTER_FALLBACK;
      showError(message);
      throw err;
    } finally {
      hideLoading('auth-register');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserContext = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const value = {
    user,
    initialized,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
