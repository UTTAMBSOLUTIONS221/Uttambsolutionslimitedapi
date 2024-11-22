import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user } = useAuth();

  // Redirect to /signin if user is not authenticated
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;