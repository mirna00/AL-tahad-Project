import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogContentText,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SellTwoToneIcon from "@mui/icons-material/SellTwoTone";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  fetchShipTripDetails,
  addShipPerson,
  fetchStuff,
} from "../../../api/Ship";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "20px",
    marginBottom: theme.spacing(1),
  },
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
    marginBottom: theme.spacing(1),
  },
  noDataMessage: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
  centeredContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
}));
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
  age: yup
    .number()
    .min(1, "Age must be at least 1")
    .max(99, "Age must be 99 or less")
    .required("Required"),
  mobile_number: yup
    .string()
    .matches(/^\d+$/, "Please enter a valid phone number")
    .required("Please enter a phone number"),
  address: yup.string().required("Please enter an address"),
  nationality: yup.string().required("Required"),
  weight: yup.number().min(1, "Weight must be at least 1").required("Required"),
  id_number: yup
    .string()
    .matches(/^\d{11}$/, "ID number must be exactly 11 digits")
    .required("Required"),
});

const ShipTripDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();

  const [selectedFoodstuffs, setSelectedFoodstuffs] = useState([]);

  const gridHeaders = [
    "الاسم",
    "العمر",
    "الرقم",
    "العنوان",
    "الجنسية",
    "ID",
    "الوزن",
    "السعر",
    "المواد",
  ];

  const [newPerson, setNewPerson] = useState({
    name: "",
    age: "",
    mobile_number: "",
    address: "",
    nationality: "",
    weight: "",
    id_number: "",
    foodstuffs: selectedFoodstuffs,
    user_id: 1,
    // status: "accept",
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [shipPersons, setShipPersons] = useState([]);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPersonAdded, setIsPersonAdded] = useState(false);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: shipTripDetails,
  } = useQuery(["ship", id], () => fetchShipTripDetails(id));

  const addShipPersonMutation = useMutation(addShipPerson, {
    onSuccess: (data) => {
      // Update the shipPersons state with the new person
      setShipPersons((prevShipPersons) => [...prevShipPersons, data]);
      setIsPersonAdded(true);
    },
  });

  const handleAddShipPerson = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(newPerson, { abortEarly: false });

      // Pass the trip_id to the addShipPersonMutation
      const addedPerson = await addShipPersonMutation.mutateAsync({
        ...newPerson,
        shipment_trip_id: id,
        user_id: 1,
        foodstuffs: selectedFoodstuffs,
      });

      setNewPerson({
        name: "",
        age: "",
        mobile_number: "",
        address: "",
        nationality: "",
        weight: "",
        id_number: "",
        foodstuffs: selectedFoodstuffs,
      });
      setValidationErrors({});
      setOpenAddDialog(false);
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
        setBackendErrors({});
      } else if (typeof error === "object" && error == null) {
        // Assume this is the backend error object
        const backendErrorsArray = Object.entries(
          error.response.data.message
        ).map(([field, message]) => ({
          field,
          message,
        }));
        setBackendErrors(backendErrorsArray);
        setValidationErrors({}); // Clear validation errors

        // Set the Snackbar state
        const errorMessages = backendErrorsArray.map(({ message }) => message);

        setSnackbarMessage(errorMessages);
        setSnackbarOpen(true);
      } else {
        console.error("Error :", error);
        // Handle other types of errors as needed
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching reservation details.</div>;
  }

  if (!shipTripDetails) {
    return <div>trip not found.</div>;
  }

  const trip = shipTripDetails.data.shipmentTrip;
  console.log(trip.shipment_requests.shipment_foodstuffs);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "40px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "2fr 20fr 2fr" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Link
            to={`/dashboard/الشحن/`}
            style={{
              textDecoration: "none",
              fontSize: "40px",
              marginTop: "20px",
              marginLeft: "24px",
            }}
          >
            <ArrowBackIcon style={{ fontSize: "40px", color: "#282828" }} />
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h1"
            style={{
              color: "#282828",
              fontFamily: "Cairo",
              fontWeight: "bold",
              fontSize: "28px",
              // marginTop: "20px",
            }}
          >
            تفاصيل الرحلة
          </Typography>
        </div>
        <div></div>
      </div>

      <Grid
        container
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: "1000px",
            minHeight: "400px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Grid item container direction="row">
            <Grid item xs={2} container direction="column" alignItems="center">
              <Typography
                variant="subtitle"
                className={classes.typography}
                color="grey"
              >
                {dayjs(trip?.date).format("YYYY-MM-DD")}
              </Typography>
            </Grid>

            <Grid item xs={3} container direction="column" alignItems="center">
              <Typography variant="subtitle" className={classes.typography}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#5151ff",
                    fontWeight: "bold",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginRight: "8px" }}></div>
                  رقم الرحلة
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {trip?.trip_number}
                </div>
              </Typography>
            </Grid>

            <Grid item xs={4} container direction="column" alignItems="center">
              <Typography variant="subtitle" className={classes.typography}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#5151ff",
                    fontWeight: "bold",
                    alignItems: "center",
                  }}
                >
                  الشاحنة
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {trip.truck.truck_number}({trip.truck.carrying_capacity})
                </div>
              </Typography>
            </Grid>

            <Grid item xs={3} container direction="column" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle" className={classes.typography}>
                  {trip.type === "Public"
                    ? "عام"
                    : trip.type === "Private"
                    ? "خاص"
                    : ""}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocationOnRoundedIcon
                  style={{
                    fontSize: "26px",
                    color: "#F01E29",
                    margin: "5px",
                  }}
                />
                <Typography variant="subtitle" className={classes.typography}>
                  {trip.destination.name}
                </Typography>
              </Box>
            </Grid>
            <Grid container direction="row">
              <Grid
                item
                xs={6}
                container
                direction="column"
                alignItems="center"
              >
                <Typography variant="subtitle" className={classes.typography}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "#5151ff",
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    الوزن المُتبقي
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {trip.available_weight}
                  </div>
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                container
                direction="column"
                alignItems="center"
              >
                <Typography variant="subtitle" className={classes.typography}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "#5151ff",
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    <SellTwoToneIcon
                      style={{
                        fontSize: "26px",
                        // color: "#F01E29",
                        margin: "5px",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {trip.killoPrice}
                  </div>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginBottom: "16px" }}
            >
              <Grid item xs={12}>
                <Button
                  style={{
                    color: "#F01E29",
                    textDecoration: "underline",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenAddDialog(true)}
                >
                  <Typography
                    variant="subtitle"
                    className={classes.typography}
                    color="#F01E29"
                    fontSize="18px"
                  >
                    إضافة شخص جديد
                  </Typography>
                </Button>
              </Grid>
              <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
              >
                <DialogTitle>إنشاء طلب جديد</DialogTitle>
                <form onSubmit={handleAddShipPerson} autoComplete="off">
                  <DialogContent>
                    <TextField
                      label="الاسم"
                      value={newPerson.name}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          name: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                    />
                    <TextField
                      label="عمر"
                      type="number"
                      value={newPerson.age}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          age: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.age}
                      helperText={validationErrors.age}
                    />
                    <TextField
                      label="ID"
                      type="number"
                      value={newPerson.id_number}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          id_number: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.id_number}
                      helperText={validationErrors.id_number}
                    />
                    <TextField
                      label="رقم"
                      type="number"
                      value={newPerson.mobile_number}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          mobile_number: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.mobile_number}
                      helperText={validationErrors.mobile_number}
                    />{" "}
                    <TextField
                      label="العنوان"
                      value={newPerson.address}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          address: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.address}
                      helperText={validationErrors.address}
                    />
                    <TextField
                      label="الجنسية"
                      value={newPerson.nationality}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          nationality: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.nationality}
                      helperText={validationErrors.nationality}
                    />
                    <TextField
                      label="الوزن"
                      type="number"
                      value={newPerson.weight}
                      onChange={(e) =>
                        setNewPerson({
                          ...newPerson,
                          weight: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.weight}
                      helperText={validationErrors.weight}
                    />{" "}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit" color="primary">
                      إضافة طلب
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Grid>
            <Grid item xs={12}>
              <Table>
                {trip.shipment_requests?.length > 0 && (
                  <TableHead
                    sx={{
                      backgroundColor: "#EBE6E4",
                      "& .MuiTableCell-head": {
                        fontWeight: "600",
                        fontSize: "22px",
                        color: "#F01E29",
                        width: `${100 / gridHeaders?.length + 1}%`,
                        textAlign: "center",
                      },
                    }}
                  >
                    <TableRow>
                      {gridHeaders.map((header, headerIndex) => (
                        <TableCell
                          key={headerIndex}
                          sx={{ width: `${100 / (gridHeaders?.length + 1)}%` }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {trip.shipment_requests.map((request, index) => (
                    <TableRow
                      key={request.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "background.paper" : "#EBE6E4",
                        "& .MuiTableCell-root": {
                          width: `${100 / gridHeaders?.length}%`,
                          textAlign: "center",
                        },
                      }}
                    >
                      {gridHeaders.map((header, headerIndex) => (
                        <TableCell key={headerIndex}>
                          {header === "الاسم" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.name ?? request.user.name}
                            </Typography>
                          )}
                          {header === "العمر" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.age ?? request.user.age}
                            </Typography>
                          )}
                          {header === "الرقم" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.mobile_number ??
                                request.user.mobile_number}
                            </Typography>
                          )}
                          {header === "العنوان" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.address ?? request.user.address}
                            </Typography>
                          )}
                          {header === "الجنسية" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.nationality ?? request.user.nationality}
                            </Typography>
                          )}
                          {header === "ID" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.id_number}
                            </Typography>
                          )}
                          {header === "الوزن" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.weight}
                            </Typography>
                          )}
                          {header === "السعر" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.price}
                            </Typography>
                          )}
                          {header === "المواد" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {request.shipment_foodstuffs
                                .map((foodstuff) => foodstuff.foodstuff.stuff)
                                .join(", ")}
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {isPersonAdded && (
        <Snackbar
          open={isPersonAdded}
          autoHideDuration={6000}
          onClose={() => setIsPersonAdded(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setIsPersonAdded(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            تم إضافة الشحنة بنجاح
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
    </div>
  );
};

export default ShipTripDetails;
