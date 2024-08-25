import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateDriver } from "../../../api/DriverApi";
import { Modal, TextField, Button } from "@material-ui/core";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const DriverEditModal = ({ open, onClose, driver }) => {
  const [isDriverEdited, setIsDriverEdited] = useState(false);
  const [EditSuccess, setEditSuccess] = useState(false);


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
      setEditSuccess(true);
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
    <div>
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
          <h2 style={{ textAlign: "center" }}>تعديل السائق</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse", // Change this to reverse the order
              justifyContent: "flex-start",
              marginTop: "1rem",
            }}
          >
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
          </div>
          <div style={{display:'flex'}}>
            <Button onClick={onClose} color="secondary">
              إلفاء
            </Button>
            <Button onClick={handleSaveDriver} color="primary">
              حفظ
            </Button>
          </div>
        </div>
      </Modal>

      {EditSuccess && (
        <Snackbar
          open={EditSuccess}
          autoHideDuration={6000}
          onClose={() => setEditSuccess(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setEditSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            تم تعديل السائق بنجاح
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default DriverEditModal;
