
import { _axios } from "./axiosApi";

export const getTrips = async () => {
  const response = await _axios.get("/api/trip/all_trip", {});
  return response.data;
};

export const fetchDestinations = async () => {
  const response = await _axios.get(
    "/api/destination/all_destinations"
  ); // Replace with your API endpoint
  // const data = await response.json();
  return response.data;
};
export const fetchDriver = async () => {
  const response = await _axios.get("/api/driver/getDrivers"); // Replace with your API endpoint
  
  return response.data;
};
export const fetchBus = async () => {
  const response = await _axios.get("/api/bus/all_buses"); // Replace with your API endpoint
  
  return response.data;
};

export const fetchTripsDetails = async (id) => {
  // Make an API call or retrieve the data from a source using the ID
  // Replace this with your actual API call or data retrieval logic
  const response = await _axios.get(
    `/api/trip/show_trip_details/${id}`
  );
  // const data = await response.json();
  return response.data;
};

export const addTrip = async (trip) => {
  return await _axios.post("/api/trip/add_trip", trip);
};
export const endTrip = async (tripId) => {
  return await _axios.put(`/api/trip/endTrip/${tripId}`);
};

export const getTripsArchive = async (searchQuery) => {
  const response = await _axios.get("/api/trip/showArchive", {
    params: {
      search: searchQuery,
    },
  });
  return response.data;
};
export const searchArcDestinatin = async (searchQuery) => {
  const response = await _axios.post(
    "/api/trip/getTripsByDestinationInArchive",{
    params: {
      search: searchQuery,
    },
  }
  );
  return response.data;
};




// export const searchDestination = async (searchQuery) => {
//   const response = await _axios.get(
//     "/api/trip/getTripsByDestinationInAllTrips",
//     {
      
//       body: JSON.stringify({ searchQuery }),
//     }
//   );
//   // const data = await response.json();
//   return response.data;
// };



export const addDestination = async (destination) => {
  try {
    const response = await _axios.post("/api/destination/add_destination", { name: destination });
    return response.data;
  } catch (error) {
    console.error("Error adding destination:", error);
    throw error;
  }
};

export const addPassenger = async (newPassenger) => {
  try {
    const response = await _axios.post(
      `/api/reserv/addPersonFromDash/`,
      newPassenger
    );

    // Check the response status
    if (response.status === 200) {
      // Return the updated passenger data
      return response.data;
    } else {
      // Handle the error
      throw new Error(
        `Error adding passenger: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error adding passenger:", error);
    throw error;
  }
};

export const updatePassenger = async (order) => {
  try {
    const response = await _axios.put(
      `/api/reserv/updateReservationFromDash/${order.id}`,
      order
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Error updating pass: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error updating pass:", error);
    throw error;
  }
};

export const deleteTrip = async (id) => {
  return await _axios.delete(`/api/trip/deleteTrip/${id}`);
};

// export default TripsAPI;
