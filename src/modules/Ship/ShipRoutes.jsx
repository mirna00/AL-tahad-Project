import React from 'react'
import { Route, Routes } from "react-router-dom";
import useAbility from "../../permission/useAbility";
import ShipComponent from './ShipComponent';
import ShipTrips from './Pages/ShipTrips';
import ShipTripDetails from './Pages/ShipTripDetails';
import Trucks from './Pages/allTruck';
import ArchivesTrips from './Pages/ShipArchive';
import ShipRequests from './Pages/ShipRequests';
import ShipRequstDetails from './Pages/ShipRequstDetails';
import ShipArcDetails from './Pages/ShipArcDetails';


const ShipRoutes=() =>{
    const can = useAbility();

  return (
    <div> <Routes>
    <Route path="/" element={<ShipComponent />}>
      <Route path="/" element={<ShipTrips />} />
      <Route path="/ship_trips/:id" element={<ShipTripDetails />} />
      <Route path="/طلبات_الشحن" element={<ShipRequests />} />
      <Route path="/ship_rquests/:id" element={<ShipRequstDetails />} />

      <Route path="/أرشيف_الشحن" element={<ArchivesTrips />} />
      <Route path="/أرشيف_الشحن/ship_rquests/:id" element={<ShipArcDetails />} />
      <Route path="/الشاحنات" element={<Trucks />} />

    </Route>
  </Routes></div>
  )
}

export default ShipRoutes