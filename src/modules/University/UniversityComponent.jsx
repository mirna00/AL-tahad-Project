import React from "react";
import Sidebar from "../../Component/Sidebar";
import { Outlet } from "react-router-dom";

function UniversityComponent() {
  return (
    <div>
      {" "}
      <Outlet />
      {/* <Sidebar selectedMenuItem="الإدارة" /> */}
      <Sidebar selectedMenuItem="الجامعات" />
    </div>
  );
}

export default UniversityComponent;
