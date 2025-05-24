import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { token } = useAuth();

  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
