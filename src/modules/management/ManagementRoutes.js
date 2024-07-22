import React from "react";
import { Route, Routes } from "react-router-dom";
import ManagementComponent from "./ManagementComponent";
import Drivers from "./pages/driver";
import Bus from "./pages/bus";
import Complaint from "./pages/complaint";
import Users from "./pages/users";
import StatisticsChart from "./statistics/destination";

const ManagementRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ManagementComponent />}>
        <Route path="/" element={<StatisticsChart />} />
          <Route path="/المُستخدمين" element={<Users />} />
          <Route path="/السائقين" element={<Drivers />} />
          <Route path="/الحافلات" element={<Bus />} />
          <Route path="/الشكاوي" element={<Complaint />} />
        </Route>
      </Routes>
    </div>
  );
};

export default ManagementRoutes;
