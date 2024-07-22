import React  from "react";
import Sidebar from "../../Component/Sidebar";
import { Outlet } from 'react-router-dom';

const ManagementComponent = () => {

  return (
    <div  >
       <Outlet/>
      <Sidebar selectedMenuItem="الإدارة" />
      {/* <Sidebar selectedMenuItem="السفر" /> */}

    </div>
  );
};

export default ManagementComponent;
