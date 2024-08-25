import axios from "axios";
import { _axios } from "./axiosApi";



export const getShipTrips = async () => {
  const response = await _axios.get("/api/shipmentTrip/allShipmentTrips",{
   
});
  return response.data;
};
export const archiveTrips = async () => {
  const response = await _axios.get("/api/shipmentTrip/showArchive",{
   
});
  return response.data;
};

export const fetchShipTripDetails = async (id) => {
  // Make an API call or retrieve the data from a source using the ID
  // Replace this with your actual API call or data retrieval logic
  const response = await _axios.get(
    `/api/shipmentTrip/ShowShipmentTripDetails/${id}`
  );
  // const data = await response.json();
  return response.data;
};



export const addShipPerson = async (newPerson) => {
  try {
    const response = await _axios.post(
      `/api/shipmentRequest/addShipmentRequestFromDash`,
      newPerson
    );

    // Check the response status
    if (response.status === 200) {
      // Return the updated passenger data
      return response.data;
    } else {
      // Handle the error
      throw new Error(`Error adding passenger: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error adding passenger:", error);
    throw error;
  }
};




export const getShipRqeusts = async () => {
  const response = await _axios.get("/api/shipmentRequest/getAllShipmentRequests", {});
  return response.data;
};

export const fetchRequestsDetails = async (id) => {
  // Make an API call or retrieve the data from a source using the ID
  // Replace this with your actual API call or data retrieval logic
  const response = await _axios.get(
    `/api/shipmentRequest/ShowShipmentRequestDetails/${id}`
  );
  return response.data;
};

export const fetchDestinations = async () => {
    const response = await _axios.get("/api/destination/all_destinations",{
     
  });
    return response.data;
  };


  export const fetchTrucks = async () => {
    const response = await _axios.get("/api/shipmentTrip/allTruck",{
     
  });
    return response.data;
  };
  export const addTruck= async (truck) => {
    return await _axios.post("/api/shipmentTrip/add_truck", truck);
  };

  // export const fetchStuff = async () => {
  //   const response= await _axios.get("/api/shipmentRequest/allFoodstuffs",{
 
  // });
  // return response.data;

  // };

  export const fetchStuff = async () => {
    const response = await _axios.get('/api/shipmentRequest/allFoodstuffs');
    const data = await response.json();
    return data.map((item) => ({ id: item.id, stuff: item.name }));
  };

  export const addStuff = async (stuff) => {
    return await _axios.post("/api/shipmentRequest/add_foodstuff", stuff);
  };

  export const deleteTruck = async (id) => {
    return await _axios.delete(`/api/shipmentTrip/delete_truck/${id}`);
  };

export const addShipTrip = async (ship) => {
    return await _axios.post("/api/shipmentTrip/add_shipment_trip", ship);
  };

  export const endShipTrip = async (shipID) => {
    return await _axios.put(`/api/shipmentTrip/endShipmentTrip/${shipID}`);
  };

  export const acceptShipRequest = async (id) => {
    return await _axios.put(`/api/shipmentRequest/acceptShipmentRequest/${id}`);
  };
  
  export const RejectShipRequest = async (id) => {
    return await _axios.delete(`/api/shipmentRequest/rejectDeleteShipmentRequest/${id}`);
  };
  



