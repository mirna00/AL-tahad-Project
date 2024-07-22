import React, { useState } from "react";
// import img from "../../../assets/buses/bus1.png";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogContentText,
  Box,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { addTruck, deleteTruck, fetchTrucks } from "../../../api/Ship";

const validationSchema = Yup.object().shape({
  truck_number: Yup.number()
    .required("Please enter the number of seats")
    .test('len', 'Truck number must be 6 digits', (val) => val.toString().length === 6),
  carrying_capacity: Yup.number()
    .required("Please enter the bus number")
    .positive("Carrying capacity must be positive"),
});
const Trucks = () => {
  const [newTruck, setNewTruck] = useState({
    truck_number: "",
    carrying_capacity: "",
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isTruckAdded, setTruckAdded] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, data: trucks } = useQuery("trucks", fetchTrucks, {
  
    
      staleTime: 60000, // Cache data for 1 minute
      cacheTime: 300000, // Keep data in cache for 5 minutes
    })
 


  const addTruckMutation = useMutation(addTruck, {
    onSuccess: (data) => {
      console.log("Add Trip success:", data);
      queryClient.invalidateQueries("trucks");
      setTruckAdded(true)
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(newTruck, { abortEarly: false });

      const addedTrip = await addTruckMutation.mutateAsync(newTruck);
      setNewTruck({
        truck_number: "",
        carrying_capacity: "",
      });
      setValidationErrors({});
      setOpenAddDialog(false);
      return addedTrip;
    }  catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
        setBackendErrors({});
      } else if (typeof error === "object" && error !== null) {
        // Assume this is the backend error object
        const backendErrorsArray = Object.entries(error.response.data.errors).map(
          ([field, message]) => ({
            field,
            message,
          })
        );
        setBackendErrors(backendErrorsArray);
        setValidationErrors({}); // Clear validation errors

        // Set the Snackbar state
        const errorMessages = backendErrorsArray
          .map(({ message }) => message)
         
        setSnackbarMessage(errorMessages);
        setSnackbarOpen(true);
      } else {
        console.error("Error adding driver:", error);
        // Handle other types of errors as needed
      }
    }
  };

  const deleteBusMutation = useMutation(deleteTruck, {
    onSuccess: () => {
      queryClient.invalidateQueries("trucks");
      setDeleteSuccess(true)
    },
  });

  const handleDeleteBus = (truck) => {
    setConfirmDeleteId(truck.id); // Set the ID of the bus to be deleted
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    deleteBusMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  if (isLoading) {
    // Render a loading state until the data is fetched
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Typography
        variant="h1"
        style={{
          color: "#282828",
          fontFamily: "Cairo",
          fontWeight: "bold",
          fontSize: "28px",
          marginTop: "20px",
        }}
      >
        الشاحنات
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        {trucks?.data.allTruck.length ? (
          trucks?.data.allTruck.map((truck) => (
            <div key={truck.id} style={{ marginBottom: "20px" }}>
              <Paper
                sx={{
                  p: 2,
                  width: "500px!important", // Add !important to override conflicting styles
                  minHeight: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs
                    container
                    direction="column"
                    justifyContent="center"
                    spacing={2}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Cairo",
                          fontSize: 15,
                        }}
                      >
                        <span style={{ color: "#F01E29" }}>رقم الشاحنة: </span>
                        {truck.truck_number}
                      </Typography>
                      <Typography
                        variant="body2"
                        gutterBottom
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Cairo",
                          fontSize: 15,
                        }}
                      >
                        <span style={{ color: "#F01E29" }}>
                          القدرة الاستيعابية :{" "}
                        </span>
                        {truck.carrying_capacity}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{ cursor: "pointer" }}
                      variant="body2"
                      onClick={() => handleDeleteBus(truck)}
                    >
                      Remove
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          ))
        ) : (
          <Typography variant="body2">No trucks found.</Typography>
        )}
      </div>

      {/* for add bus */}
      <Button onClick={() => setOpenAddDialog(true)}>إضافة شاحنة</Button>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>إضافة شاحنة جديدة</DialogTitle>
        <form onSubmit={handleAddTrip} autoComplete="off">
          <DialogContent>
            <TextField
              label="الشاحنة"
              type="number"
              value={newTruck.truck_number}
              onChange={(e) =>
                setNewTruck({ ...newTruck, truck_number: e.target.value })
              }
              fullWidth
              margin="normal"
              error={!!validationErrors.truck_number}
              helperText={validationErrors.truck_number}
            />
            <TextField
              label="القدرة الاستيعابية"
              type="number"
              value={newTruck.carrying_capacity}
              onChange={(e) =>
                setNewTruck({ ...newTruck, carrying_capacity: e.target.value })
              }
              fullWidth
              margin="normal"
              error={!!validationErrors.carrying_capacity}
              helperText={validationErrors.carrying_capacity || ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>إلغاء</Button>
            <Button type="submit" color="primary">
              إضافة الشاحنة
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* for delete  */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من انك تريد حذف الشاحنة ؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button color="error" onClick={confirmDelete}>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      {deleteSuccess && (
        <Snackbar
          open={deleteSuccess}
          autoHideDuration={6000}
          onClose={() => setDeleteSuccess(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setDeleteSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Truck deleted successfully
          </Alert>
        </Snackbar>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {isTruckAdded && (
        <Snackbar
          open={isTruckAdded}
          autoHideDuration={6000}
          onClose={() => setTruckAdded(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setTruckAdded(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Truck Added successfully
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default Trucks;
