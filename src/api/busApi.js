
import { _axios } from "./axiosApi";

const fileUpload=event=>{
  this.setState({
    selected:event.target.files[0]
  })
}


export const getBus = async () => {
  const response = await _axios.get("/api/bus/all_buses");
  return response.data;
};

export const addBus = async (formData) => {
  const { data } = await _axios.post(
    "/api/bus/add_bus",
    formData
  );
  return data;
};


export const addImageOfSeats = async (img) => {
  const { data } = await _axios.post(
    "/api/bus/add_imageOfBus",
    img
  );
  return data;
};
export const allImageOfSeats = async () => {
  const response = await _axios.get(
    "/api/bus/allImageOfBus"
  );
  return response.data;
};




export const deleteBus = async (id) => {
    return await _axios.delete(`/api/bus/deleteBus/${id}`);
  };

  // export default _axios;
  