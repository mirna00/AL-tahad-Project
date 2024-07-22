import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateDriver } from "../../../api/DriverApi";
import { Modal, TextField, Button } from "@material-ui/core";

const DriverEditModal = ({ open, onClose, driver }) => {
  const [driverData, setDriverData] = useState({
    id: "",
    name: "",
    age: "",
    mobile_number: "",
    address: "",
  });
  const queryClient = useQueryClient();
  const updateDriverMutation = useMutation(updateDriver, {
    onSuccess: () => {
      queryClient.invalidateQueries("drivers");
      onClose();
    },
  });

  useEffect(() => {
    if (driver) {
      setDriverData({
        id: driver.id,
        name: driver.name,
        age: driver.age,
        mobile_number: driver.mobile_number,
        address: driver.address,
        
      });
    }
  }, [driver]);

  const handleInputChange = (event) => {
    setDriverData({
      ...driverData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveDriver = () => {
    updateDriverMutation.mutate(driverData);
  };

  return (
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
        <h2>تعديل السائق</h2>
        <TextField
          name="name"
          label="الاسم"
          value={driverData.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          name="age"
          label="عمر"
          value={driverData.age}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          name="mobile_number"
          label="الرقم"
          value={driverData.mobile_number}
          onChange={handleInputChange}
          margin="normal"
        />
       
        <TextField
          name="address"
          label="العنوان "
          value={driverData.address}
          onChange={handleInputChange}
          margin="normal"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button onClick={onClose} color="secondary">
            إلفاء
          </Button>
          <Button onClick={handleSaveDriver} color="primary">
            حفظ
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DriverEditModal;
