import React from "react";
import { localStorageServices } from "../api/tokenService";
import { Navigate } from "react-router-dom";

const UnProtectedRoute = ({ children }) => {
  if (!localStorageServices.getToken()) return <>{children}</>;

  return <Navigate to="/dashboard" />;
};

export default UnProtectedRoute;
