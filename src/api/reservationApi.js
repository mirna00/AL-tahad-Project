
import { _axios } from "./axiosApi";


export const getReservation = async (searchQuery) => {
  const response = await _axios.get("/api/reserv/getAllReservation", {
    params: {
      search: searchQuery,
    },
  });
  return response.data;
};
export const searchReservation = async (searchQuery) => {
  const response = await _axios.post(
    "/api/reserv/searchInAllReservation",{
    params: {
      search: searchQuery,
    },
  }
  );
  return response.data;
};
export const fetchReservationDetails = async (reservation_id) => {
  // Make an API call or retrieve the data from a source using the ID
  // Replace this with your actual API call or data retrieval logic
  const response = await _axios.get(
    `/api/reserv/showReservationDetails/${reservation_id}`
  );
  // const data = await response.json();
  return response.data;
};



export const acceptReservation = async (reservation_id) => {
  return await _axios.put(`/api/reserv/acceptTripRequest/${reservation_id}`);
};

export const RejectReservation = async (reservation_id) => {
  return await _axios.delete(
    `/api/reserv/rejectDeleteTripRequest/${reservation_id}`
  );
};

// export default reservationApi;
