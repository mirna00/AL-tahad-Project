import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ManagementRoutes from "../management/ManagementRoutes";
import TravelRouting from "../trip/TravelRoutes";
import useAbility from "../../permission/useAbility";
import UniversityRoutes from "../University/UniversityRoutes";
import ShipRoutes from "../Ship/ShipRoutes";
import NotFound from "../../Pages/NotFound";
import DashboardComponent from "./DashboardComponent";

const DashboardRouting = () => {
  const can = useAbility();
  useEffect(() => {
    can("read", "university");

    return () => {};
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<DashboardComponent />}>
          {can("read", "managment") && (
            <Route path="/الإدارة/*" element={<ManagementRoutes />} />
          )}
          {can("read", "travel") && (
            <Route path="/السفر/*" element={<TravelRouting />} />
          )}
          {can("read", "university") && (
            <Route path="/الجامعات/*" element={<UniversityRoutes />} />
            
          )}
          {can("read", "shipment") && (
            <Route path="/الشحن/*" element={<ShipRoutes />} />
          )}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default DashboardRouting;
