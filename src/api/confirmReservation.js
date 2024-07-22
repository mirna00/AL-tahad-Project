
import { _axios } from "./axiosApi";

export const getconfirmReservation = async () => {
  const response = await _axios.get("/api/reserv/allAcceptedReservations", {});
  return response.data;
};

export const deleteReservation = async (reservation_id) => {
  return await _axios.delete(
    `/api/reserv/rejectDeleteTripRequest/${reservation_id}`
  );
};

export const confirmReservation = async (reservation_id) => {
  return await _axios.put(`/api/reserv/confirmReservation/${reservation_id}`);
};

// export default confirmReservationApi;
