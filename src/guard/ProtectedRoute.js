import React from "react";
import { localStorageServices } from "../api/tokenService";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (!!localStorageServices.getToken()) return <>{children}</>;

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
