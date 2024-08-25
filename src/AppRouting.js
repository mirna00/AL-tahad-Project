import React from "react";
import { Route, Routes } from "react-router-dom";
import ManagementRoutes from "./modules/management/ManagementRoutes";
import useAbility from "./permission/useAbility";
import NotFound from "./Pages/NotFound";
import TravelRouting from "./modules/trip/TravelRoutes";
import UniversityRoutes from "./modules/University/UniversityRoutes";
import ShipRoutes from "./modules/Ship/ShipRoutes";
import { useAuth } from "./Auth/AuthProvider";
import Login from "./Auth/Login";
import DashboardRouting from "./modules/dashboard/DashboardRouting";
import ProtectedRoute from "./guard/ProtectedRoute";
import UnProtectedRoute from "./guard/UnProtectedRoute";

const AppRouting = () => {
  const { isLoading, isAuthenticated, success } = useAuth();
  const can = useAbility();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Routes>
        <>
          <Route
            path="/"
            element={
              <UnProtectedRoute>
                <Login />
              </UnProtectedRoute>
            }
          />
          {/* <Route path="*" element={<Login />} /> */}
        </>

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRouting />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AppRouting;
