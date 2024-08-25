import { _axios } from "./axiosApi";



export const getUser = async () => {
  const response = await _axios.get("/api/user/all_Users");
  return response.data;
};

export const deleteUser = async (id) => {
  return await _axios.delete(`/api/user/delete/${id}`);
};

export const getComplaint = async () => {
  const response = await _axios.get(
    "/api/feedback/all"
  ); // Replace with your API endpoint
  return response.data;
};

