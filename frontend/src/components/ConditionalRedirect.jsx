import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ConditionalRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ConditionalRedirect;
