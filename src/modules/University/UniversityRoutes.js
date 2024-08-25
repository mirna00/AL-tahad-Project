import React from "react";
import { Route, Routes } from "react-router-dom";
import useAbility from "../../permission/useAbility";
import UniversityComponent from "./UniversityComponent";
import AllUni from "./Pages/uniTrips";
import ArchiveUni from "./Pages/ArchiveUni";
import Subscribe from "./Pages/Subscribe";
import TripsUniDetails from "./Pages/TripsUniDetails";
import TripsArchUniDetails from "./Pages/TripsArchUniDetails";

const UniversityRoutes = () => {
  const can = useAbility();

  return (
    <div>
      {" "}
      <Routes>
        <Route path="/" element={<UniversityComponent />}>
          <Route path="/" element={<AllUni />} />
      
          <Route path="/uni_trips/:id" element={<TripsUniDetails />} />

          <Route path="/طلبات_الاشتراك" element={<Subscribe />} />
          <Route path="/arch_trip/:id" element={<TripsArchUniDetails />} />


          <Route path="/أرشيف_الجامعات" element={<ArchiveUni />} />
        </Route>
      </Routes>
    </div>
  );
};

export default UniversityRoutes;
