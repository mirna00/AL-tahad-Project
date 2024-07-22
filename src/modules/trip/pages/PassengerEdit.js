import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Modal, TextField, Button } from "@material-ui/core";
import { updatePassenger } from "../../../api/TripsApi";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchTripsDetails } from "../../../api/TripsApi";





const PassengerEdit = ({ open, onClose, order }) => {
  const { id } = useParams();

  const [PassengerData, setPassengerData] = useState({
    id: "",
    name: "",
    age: "",
    mobile_number: "",
    address: "",
    seat_number: ""
  });

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data: tripsDetails,
  } = useQuery(["trips", id], () => fetchTripsDetails(id));
  

  const updatePassengerMutation = useMutation(updatePassenger, {
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
      onClose();
    }
  });

  useEffect(() => {
    if (order) {
      setPassengerData({
        id: order.id,
        name: order.name,
        age: order.age,
        mobile_number: order.mobile_number,
        address: order.address,
        seat_number: order.seat_number
      });
    }
  }, [order]);

  const handleInputChange = (event) => {
    setPassengerData({
      ...PassengerData,
      [event.target.name]: event.target.value
    });
  };

  const handleSavePassenger = () => {
    updatePassengerMutation.mutate(PassengerData);

  };
  const availableSeatNumber=tripsDetails.data.available_seat_numbers;


  

  return(
  <Modal open={open} onClose={onClose}>
  <div
  style={{
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "2rem",
  outline: "none",
  }}
  >
  <h2>Edit Passenger</h2>
  <TextField name="name" label="Name" value={PassengerData.name} onChange={handleInputChange} margin="normal" />
  <TextField name="age" label="Age" value={PassengerData.age} onChange={handleInputChange} margin="normal" />
  <TextField name="mobile_number" label="الرقم" value={PassengerData.mobile_number} onChange={handleInputChange} margin="normal" />
  
 
      <TextField
        name="address"
        label="العنوان "
        value={PassengerData.address}
        onChange={handleInputChange}
        margin="normal"
      />
<Autocomplete
  options={availableSeatNumber}
  getOptionLabel={(option) => option.toString()}
  isOptionEqualToValue={(option, value) =>
    option.value === value.value
  }
  value={PassengerData.seat_number}
  onChange={(event, newValue) => {
    setPassengerData((prevPassenger) => ({
      ...prevPassenger,
      seat_number: newValue,
    }));
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      label="رقم المقعد"
      style={{ marginTop: "20px", width: "300px" }}
    />
  )}
/>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSavePassenger} color="primary">
          Save
        </Button>
      </div>
    </div>
  </Modal>
  );
};

export default PassengerEdit;
