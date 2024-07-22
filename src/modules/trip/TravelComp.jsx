import React, { useState } from "react";
import Sidebar from "../../Component/Sidebar";
import { Outlet } from "react-router-dom";

const TravelComp = () => {
  return (
    <div>
      <Outlet />

      {/* <Sidebar selectedMenuItem="الإدارة" /> */}
      <Sidebar selectedMenuItem="السفر" />
    </div>
  );
};

export default TravelComp;
