
import { _axios } from "./axiosApi";


export const getUni = async () => {
  const response = await _axios.get("/api/collage_trips/all?type=upcoming");
  return response.data;
};

export const getArchUni = async () => {
  const response = await _axios.get("/api/collage_trips/all?type=archived");
  return response.data;
};

export const getDays = async () => {
  const response = await _axios.get("/api/days");
  return response.data;
};

export const getSubscribe = async () => {
  const response = await _axios.get("api/collage_trips/pendingSubscription");
  return response.data;
};

export const addTripUni = async (university) => {
  return await _axios.post("/api/collage_trips/create", university);
};

export const deleteUniTrip = async (id) => {
  return await _axios.delete(`/api/collage_trips/delete/${id}`);
};

export const fetchTripsUniDetails = async (id) => {
  // Make an API call or retrieve the data from a source using the ID
  // Replace this with your actual API call or data retrieval logic
  const response = await _axios.get(
    `/api/collage_trips/details/${id}`
  );
  // const data = await response.json();
  return response.data;
};

export const fetchTripsUniArchDetails= async (id) => {
  // Make an API call or retrieve the data from a source using the ID
  // Replace this with your actual API call or data retrieval logic
  const response = await _axios.get(
    `/api/collage_trips/archived/details/${id}`
  );
  // const data = await response.json();
  return response.data;
};

export const handleApprove = async (subscriptionId) => {
  try {
    const response = await _axios.post(
      "/api/collage_trips/acceptSubscription",
      {
        subscription_id: subscriptionId,
        status: "accepted",
      }
    );
  } catch (error) {
    console.error("Error :", error);
  }
};
export const handleReject = async (subscriptionId) => {
  try {
    const response = await _axios.post(
      "/api/collage_trips/acceptSubscription/",
      { subscription_id: subscriptionId, status: "rejected" }
    );
  } catch (error) {
    console.error("Error rejecting:", error);
  }
};

export const updateUni = async (trip) => {
  try {
    const response = await _axios .post(
      `api/collage_trips/update/${trip.id}`,
      trip
    );
  } catch (error) {
    console.error("Error rejecting:", error);
  }
};
// export default _axios;
