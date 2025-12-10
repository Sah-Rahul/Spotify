import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserData } from "../Context/UserContext";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuth, loading } = useUserData();

  if (loading) return <Loading />;

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
