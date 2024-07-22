import React from "react";
import { Route, Routes } from "react-router-dom";
import TravelComp from "./TravelComp";
import AllTrips from "./pages/allTrips";
import ToggleSwitch from "./component/switchToggle";
import Details from "./pages/details";
import useAbility from "../../permission/useAbility";
import ArchiveTrips from "./pages/ArchiveTrips";
import TripsDetails from "./pages/tripsDetails";
import DetailsArchive from "./pages/DetailsArchive";

const TravelRouting = () => {
  const can = useAbility();


  return (
    <div>
      {/* <ToggleSwitch/> */}
      <Routes>
        <Route path="/" element={<TravelComp />}>
          
          <Route path="/" element={<ToggleSwitch />} />
          <Route path="/reservations/:id" element={<Details />} />
          {/* {can("read","travel")&&(
            <Route path="/details/:id" element={<Details/>}/>
          )} */}

          <Route path="/الرحلات" element={<AllTrips />} />
          <Route path="/الأرشيف" element={<ArchiveTrips/>} />
          <Route path="/trips/:id" element={<TripsDetails />} />
          <Route path="/الأرشيف/trips/:id" element={<DetailsArchive />} />
        </Route>
      </Routes>
    </div>
  );
};

export default TravelRouting;
