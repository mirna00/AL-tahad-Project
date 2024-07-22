import { _axios } from "./axiosApi";

export const logout = async () => {
  return await _axios.post("/api/auth/logout");
};
