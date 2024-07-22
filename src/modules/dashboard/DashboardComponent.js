import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../../Component/leftSidebar";

const DashboardComponent = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleSidebarItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <>
      <LeftSidebar handleSidebarItemClick={handleSidebarItemClick} />
      <Outlet />
    </>
  );
};

export default DashboardComponent;
