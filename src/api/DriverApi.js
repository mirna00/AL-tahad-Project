import { _axios } from "./axiosApi";



export const getDriver = async () => {
  const response = await _axios.get("api/driver/getDrivers");

  return response.data;
};
export const searchDriver = async (searchQuery) => {
  const response = await fetch(
    `http://91.144.20.117:7109/api/driver/searchDriver`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchQuery }),
    }
  );
  const data = await response.json();
  return data.drivers;
};

export const addDriver = async (driver) => {
  try {
    const response = await _axios.post("/api/auth/register", driver);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Handle the 422 error and return the backend errors
      throw error.response.data.errors;
    } else {
      // Handle other types of errors
      throw error;
    }
  }
};

export const updateDriver = async (driver) => {
  try {
    const response = await _axios.put(
      `/api/driver/updateDriver/${driver.id}`,
      driver
    );

    // Check the response status
    if (response.status === 200) {
      // Return the updated driver data
      return response.data;
    } else {
      // Handle the error
      throw new Error(
        `Error updating driver: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error updating driver:", error);
    throw error;
  }
};

export const deleteDriver = async (id) => {
  return await _axios.delete(`api/driver/deleteDriver/${id}`);
};

// export default _axios;
