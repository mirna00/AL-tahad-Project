import React from 'react';
import Sidebar from "../../Component/Sidebar";
import { Outlet } from "react-router-dom";


function ShipComponent() {
  return (
    <div> {" "}
    <Outlet />
    {/* <Sidebar selectedMenuItem="الإدارة" /> */}
    <Sidebar selectedMenuItem="الشحن" />
    </div>
  )
}

export default ShipComponent