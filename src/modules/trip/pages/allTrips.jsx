import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import AddDestinationModal from "../../../Component/AddDestination";
import * as Yup from "yup";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@mui/material/Paper";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@material-ui/core";
import WestRoundedIcon from "@mui/icons-material/WestRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import Face5Icon from "@mui/icons-material/Face5";
import "../../../global/grid.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  getTrips,
  addTrip,
  endTrip,
  fetchBus,
  fetchDestinations,
  fetchDriver,
} from "../../../api/TripsApi";
import { Autocomplete } from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { _axios } from "../../../api/axiosApi";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const validationSchema = Yup.object().shape({
  trip_number: Yup.number()
    .required("Trip number is required")
    .positive("Trip number must be a positive number")
    .integer("Trip number must be an integer"),
  date: Yup.date().required("Date is required"),
  depature_hour: Yup.string().required("Departure hour is required"),
  arrival_hour: Yup.string().required("Arrival hour is required"),
  starting_place: Yup.string().required("Starting place is required"),
  destination_id: Yup.number()
    .required("Destination is required")
    .positive("Destination ID must be a positive number")
    .integer("Destination ID must be an integer"),
  bus_id: Yup.number()
    .required("Bus is required")
    .positive("Bus ID must be a positive number")
    .integer("Bus ID must be an integer"),
  driver: Yup.object().shape({
    id: Yup.number()
      .required("Driver ID is required")
      .positive("Driver ID must be a positive number")
      .integer("Driver ID must be an integer"),
    name: Yup.string().required("Driver name is required"),
  }),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
});
const AllTrips = () => {
  const classes = useStyles();
  const { trip_id } = useParams();

  const [driverOptions, setDriverOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [openAddDestinationModal, setOpenAddDestinationModal] = useState(false);
  const [newDestination, setNewDestination] = useState("");
  const [destination, setDestination] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isTripAdded, setTripAdded] = useState(false);
  const [TripEnd, setTripEnd] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const queryClient = useQueryClient();

  const [newTrip, setNewTrip] = useState({
    trip_number: "",
    date: dayjs(),
    depature_hour: "",
    arrival_hour: "",
    starting_place: "",
    destination_id: null,
    bus_id: null,
    driver: {
      id: null,
      name: "",
    },
    price: "",
    trip_type: "External",
  });

  const {
    isLoading,
    isError,
    error,
    data: fetchTrips,
  } = useQuery("trips", getTrips, {
    staleTime: 60000, // Cache data for 1 minute
    cacheTime: 300000, // Keep data in cache for 5 minutes
  });

  const addTripMutation = useMutation(addTrip, {
    onSuccess: (data) => {
      console.log("Add Trip success:", data);
      queryClient.invalidateQueries("trips");
      setTripAdded(true);
    },
  });

  const tripEndMutation = useMutation(endTrip, {
    onSuccess: (data) => {
      console.log("end Trip success:", data);
      queryClient.invalidateQueries("trips");
      setTripEnd(true);
    },
  });

  function formatTimeValueAMPM(timeValue) {
    if (!timeValue) return null;

    const timeDate = dayjs(timeValue, "HH:mm");
    if (!timeDate.isValid()) {
      throw new Error("Invalid time value: " + timeValue);
    }

    return timeDate.format("h:mmA");
  }

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const formattedNewTrip = {
        ...newTrip,
        bus_id: newTrip.bus_id ? Number(newTrip.bus_id) : null,
        driver_id: newTrip.driver.id,
        destination_id: newTrip.destination_id
          ? Number(newTrip.destination_id)
          : null,
        depature_hour: formatTimeValueAMPM(newTrip.depature_hour),
        arrival_hour: formatTimeValueAMPM(newTrip.arrival_hour),
        date: dayjs(newTrip.date).format("YYYY-MM-DD"),
        destination: newTrip.destination,
      };

      await validationSchema.validate(formattedNewTrip, { abortEarly: false });

      const addedTrip = await addTripMutation.mutateAsync(formattedNewTrip);
      setNewTrip({
        trip_number: "",
        date: dayjs(),
        depature_hour: dayjs(),
        arrival_hour: dayjs(),
        starting_place: "",
        destination_id: null,
        bus_id: null,
        driver: {
          id: null,
          name: "",
        },
        price: "",
        trip_type: "External",
      });
      setValidationErrors({});
      setOpenAddDialog(false);
      return addedTrip;
    } catch (error) {
      if (error.name === "ValidationError") {
        // Handle validation errors
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
        setBackendErrors({});
      } else if (error.response && error.response.data) {
        // Handle backend errors
        let backendErrorsArray = [];
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          backendErrorsArray = Object.entries(error.response.data).map(
            ([field, message]) => ({
              field,
              message,
            })
          );
        } else {
          backendErrorsArray = [{ field: 'general', message: error.response.data }];
        }
        setBackendErrors(backendErrorsArray);
        setValidationErrors({}); // Clear validation errors
    
        // Set the Snackbar state
        const errorMessages = backendErrorsArray
          .map(({ message }) => message)
          .join(", ");
        setSnackbarMessage(errorMessages);
        setSnackbarOpen(true);
      } else {
        // Handle other types of errors
        console.error("Error adding driver:", error);
      }
    }
  };

  const handleEndTrip = async (tripId) => {
    try {
      await tripEndMutation.mutateAsync(tripId);
      // Optionally, you can display a success message or update the UI
    } catch (error) {
      console.error("Error ending trip:", error);
      // Handle the error, e.g., display an error message
    }
  };

  const handleClickOpen = (trip) => {
    setSelectedTrip(trip);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data: destinations } = useQuery("destinations", fetchDestinations);
  const { data: driversData } = useQuery("drivers", fetchDriver);
  const { data: buses } = useQuery("buses", fetchBus);

  // Create the destination mapping
  const destinationMapping = {};
  if (destinations) {
    destinations.forEach((destination) => {
      destinationMapping[destination.id] = destination.name;
    });
  }
  const handleDepatureHourChange = (newValue) => {
    const timeAMPM = newValue ? dayjs(newValue).format("h:mm A") : "";
    const time24Hour = newValue ? dayjs(newValue).format("HH:mm:ss") : "";
    setNewTrip({
      ...newTrip,
      depature_hour: time24Hour,
      depature_hour_ampm: timeAMPM,
    });
  };

  const handleArrivalHourChange = (newValue) => {
    const timeAMPM = newValue ? dayjs(newValue).format("h:mm A") : "";
    const time24Hour = newValue ? dayjs(newValue).format("HH:mm:ss") : "";
    setNewTrip({
      ...newTrip,
      arrival_hour: time24Hour,
      arrival_hour_ampm: timeAMPM,
    });
  };
  useEffect(() => {
    console.log("useEffect: driversData", driversData);
    if (driversData) {
      console.log("useEffect: calling mapDrivers");
      setDriverOptions(mapDrivers(driversData.data));
    } else {
      console.log("useEffect: setting driverOptions to empty array");
      setDriverOptions([]);
    }
  }, [driversData]);

  const mapDrivers = (driversData) => {
    console.log("mapDrivers: driversData", driversData);
    if (!driversData || !driversData.drivers) {
      console.log("mapDrivers: returning empty array");
      return [];
    }

    return driversData.drivers.map((driver) => ({
      id: driver.id.toString(),
      name: driver.name,
    }));
  };

  console.log("typeof driversData", typeof driversData);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };
  let uniqueTrips = [];

  if (Array.isArray(fetchTrips?.data)) {
    // Access the array of trips using fetchTrips.data?.trips
    uniqueTrips = Array.from(
      new Map(
        fetchTrips?.data.map((trip) => [trip.destination.name, trip])
      ).values()
    );
  } else {
    console.log("fetchTrips.data.trips is not an array");
  }

  const busMapping = {};
  if (buses) {
    buses.forEach((bus) => {
      busMapping[bus.id] = bus.bus_number;
    });
    // console.log(typeof buses);
  }

  const handleSaveDestination = (newDestination) => {
    setNewDestination([...destinations, newDestination]);
    setNewTrip({ ...newTrip, destination_id: newDestination?.id });
    setIsModalOpen(false);
  };

  const handleAddDestination = () => {
    setIsModalOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else if (
    searchQuery &&
    (!fetchTrips || !fetchTrips.data || fetchTrips.data?.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (!fetchTrips || !fetchTrips.data || fetchTrips.data.length === 0) {
    content = <p>No trips available.</p>;
  } else {
    const filteredTrips = fetchTrips?.data?.filter((trip) =>
      trip.destination.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    content = (
      <>
        {filteredTrips?.map((trip, index) => (
          <Grid key={index}>
            <Paper
              sx={{
                p: 2,
                width: "700px",
                minHeight: "100px",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "20px",
              }}
            >
              <Grid
                container
                spacing={2}
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  direction="column"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "50px",
                  }}
                >
                  <Typography
                    variant="subtitle"
                    className={classes.Typography}
                    style={{ fontSize: "18px" }}
                  >
                    رقم الرحلة
                    <div>{trip.trip_number}</div>
                  </Typography>
                </Grid>
                <div
                  style={{
                    height: "100%",
                    borderLeft: "2px solid #000",
                  }}
                ></div>
              </Grid>
              <Grid container>
                <Grid item xs={4} container direction="row" alignItems="center">
                  <Typography variant="subtitle" className={classes.Typography}>
                    {trip.starting_place}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={2}
                  container
                  direction="row"
                  alignItems="center"
                  sx={{ marginRight: "10px", marginLeft: "25px" }}
                >
                  {" "}
                  <WestRoundedIcon
                    style={{ fontSize: "40px", color: "#F01E29" }}
                  />
                </Grid>
                <Grid item xs={4} container direction="row" alignItems="center">
                  <Typography variant="subtitle" className={classes.Typography}>
                    {trip.destination.name}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={6} direction="row">
                  <div style={{ display: "flex" }}>
                    <CalendarMonthIcon
                      style={{ color: "#F01E29", marginTop: "6px" }}
                    />
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      {trip.date}{" "}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} direction="row">
                  <div style={{ display: "flex" }}>
                    <Face5Icon style={{ color: "#F01E29", marginTop: "6px" }} />
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      {trip.driver.name}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} container direction="row" alignItems="center">
                  <div style={{ display: "flex", marginLeft: "5px" }}>
                    <AccessTimeIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {trip.depature_hour}
                  </Typography>
                </Grid>
                <Grid item xs={6} container direction="row" alignItems="center">
                  <div style={{ display: "flex", marginLeft: "5px" }}>
                    <AirlineSeatReclineNormalIcon
                      style={{ color: "#F01E29" }}
                    />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {trip.bus.number_of_seats}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="column"
                spacing={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Link
                    to={`/dashboard/السفر/trips/${trip.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#EBE6E4",
                        border: "1px solid #EBE6E4",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography
                        className={classes.Typography}
                        style={{ fontSize: "20px", fontWeight: "bold" }}
                      >
                        التفاصيل
                      </Typography>{" "}
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#EBE6E4",
                      border: "1px solid #EBE6E4",
                      borderRadius: "4px",
                    }}
                    onClick={() => handleClickOpen(trip)}
                  >
                    <Typography
                      className={classes.Typography}
                      style={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      الأمانات
                    </Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#EBE6E4",
                      border: "1px solid #EBE6E4",
                      borderRadius: "4px",
                    }}
                    onClick={() => handleEndTrip(trip.id)}
                  >
                    <Typography
                      className={classes.Typography}
                      style={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      تمت الرحلة
                    </Typography>{" "}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </>
    );
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
        رحلات السفر
      </Typography>
      <div style={{ textAlign: "center" }}>
        <Autocomplete
          options={uniqueTrips}
          getOptionLabel={(option) => option.destination?.name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.destination?.name === value.destination.name
          }
          // value={searchQuery}
          onChange={(event, newValue) => {
            setSearchQuery(newValue?.destination?.name || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="الوجهة"
              variant="standard"
              style={{ marginTop: "20px", width: "300px" }}
            />
          )}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
          رحلة جديدة{" "}
        </Button>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle style={{fontWeight:'bold'}} sx={{ m: 0, p: 2, textAlign: "center" }} id="customized-dialog-title" >رحلة جديدة</DialogTitle>
          <form onSubmit={handleAddTrip} autoComplete="off">
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="مكان الانطلاق"
                    value={newTrip.starting_place}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, starting_place: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.starting_place}
                    helperText={validationErrors.starting_place || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="رقم الرحلة"
                    type="number"
                    value={newTrip.trip_number}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, trip_number: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.trip_number}
                    helperText={validationErrors.trip_number}
                  />
                </Grid>
              </Grid>

              <div
                className="field"
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  marginBottom: "15px", // Add margin bottom to create space between stations
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="التاريخ"
                    value={newTrip.date}
                    onChange={(date) => setNewTrip({ ...newTrip, date })}
                    fullWidth
                    margin="normal"
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="وقت الذهاب"
                    value={
                      newTrip.depature_hour
                        ? dayjs(newTrip.depature_hour, "HH:mm")
                        : null
                    }
                    onChange={handleDepatureHourChange}
                    ampm
                    format="h:mm A"
                    style={{ position: "relative", right: "28px" }}
                    error={!!validationErrors.depature_hour}
                    helperText={validationErrors.depature_hour}
                  />
                  <TimePicker
                    label="وقت العودة"
                    value={
                      newTrip.arrival_hour
                        ? dayjs(newTrip.arrival_hour, "HH:mm")
                        : null
                    }
                    onChange={handleArrivalHourChange}
                    ampm
                    format="h:mm A"
                    error={!!validationErrors.arrival_hour}
                    helperText={validationErrors.arrival_hour}
                  />
                </LocalizationProvider>
              </div>

              <Autocomplete
                options={destinations}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                value={newTrip.destination}
                onChange={(event, newValue) => {
                  setNewTrip({
                    ...newTrip,
                    destination_id: newValue?.id || null,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الوجهة"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.destination_id}
                    helperText={validationErrors.destination_id}
                  />
                )}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDestination}
              >
                إضافة وجهة
              </Button>
              <AddDestinationModal
                open={isModalOpen}
                onClose={handleSaveDestination}
                onSave={(newDestination) => {
                  setDestination([...destinations, newDestination]);
                  handleSaveDestination(newDestination);
                }}
              />
              <Autocomplete
                options={buses}
                getOptionLabel={(option) => option.bus_number.toString()}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                value={newTrip.bus}
                onChange={(event, newValue) => {
                  setNewTrip({ ...newTrip, bus_id: newValue?.id || null });
                }}
                renderOption={(props, option) => (
                  <Box {...props} display="flex" alignItems="center">
                    <img
                      src={`http://161.35.27.202${option.image}`}
                      alt={option.bus_number.toString()}
                      style={{ width: "50px", marginRight: "16px" }}
                    />
                    <Typography>{option.bus_number.toString()}</Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الباص"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.bus_id}
                    helperText={validationErrors.bus_id}
                  />
                )}
              />
              {driverOptions.length > 0 ? (
                <Autocomplete
                  options={driverOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  // value={newTrip.driver}
                  onChange={(event, newValue) => {
                    setNewTrip({
                      ...newTrip,
                      driver: newValue || { id: null, name: "" },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="السائق"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.driver_id}
                      helperText={validationErrors.driver_id}
                    />
                  )}
                />
              ) : (
                // Display a loading state or a fallback component
                <CircularProgress />
              )}
              <TextField
                label="السعر"
                type="number"
                value={newTrip.price}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, price: e.target.value })
                }
                fullWidth
                margin="normal"
                error={!!validationErrors.price}
                helperText={validationErrors.price}
              />
            </DialogContent>
            <DialogActions>
              <Button  variant="contained"  style={{ marginRight: "10px" }} onClick={() => setOpenAddDialog(false)}>إلغاء</Button>
              <Button variant="contained" type="submit" color="primary">
                إضافة رحلة{" "}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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
        {isTripAdded && (
          <Snackbar
            open={isTripAdded}
            autoHideDuration={6000}
            onClose={() => setTripAdded(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Alert
              onClose={() => setTripAdded(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
             تم إضافة رحلة جديدة
            </Alert>
          </Snackbar>
        )}
        {TripEnd && (
          <Snackbar
            open={TripEnd}
            autoHideDuration={6000}
            onClose={() => setTripEnd(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Alert
              onClose={() => setTripEnd(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              انتقلت الرحلة إلى الأرشيف
            </Alert>
          </Snackbar>
        )}
        {content}

        <div>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, textAlign: "center" }}
              id="customized-dialog-title"
            >
              الأمانات
            </DialogTitle>
            <DialogContent dividers>
              {selectedTrip?.envelops?.length > 0 ? (
                selectedTrip.envelops.map((envelop, index) => (
                  <div style={{ marginBottom: "20px" }} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        width: "500px!important",
                        minHeight: "100px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid
                          item
                          xs={4}
                          container
                          direction="column"
                          justifyContent="center"
                        >
                          <div>
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
                                اسم المُستقبل:{" "}
                              </span>
                              {envelop.receiver_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{
                                fontWeight: "bold",
                                color: "black",
                                fontFamily: "Cairo",
                                fontSize: 15,
                              }}
                            >
                              <span style={{ color: "#F01E29" }}>
                                رقم المُستقبل:{" "}
                              </span>
                              {envelop.receiver_phone}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          container
                          direction="column"
                          justifyContent="center"
                        >
                          <div>
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
                              <span
                                style={{
                                  color: "#F01E29",
                                  marginRight: "30px",
                                }}
                              >
                                اسم المُرسل:{" "}
                              </span>
                              {envelop.user.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{
                                fontWeight: "bold",
                                color: "black",
                                fontFamily: "Cairo",
                                fontSize: 15,
                              }}
                            >
                              <span style={{ color: "#F01E29" }}>
                                رقم المُرسل:{" "}
                              </span>
                              {envelop.user.mobile_number}
                            </Typography>
                          </div>
                        </Grid>

                        <Grid item xs={4}>
                          <ButtonBase sx={{ width: "120", height: "160" }}>
                            <img
                              src={`http://161.35.27.202${envelop.image}`}
                              alt={`Envelop ${index + 1}`}
                              style={{ width: "80%" }}
                            />
                          </ButtonBase>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          container
                          textAlign="center"
                          direction="column"
                          justifyContent="center"
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
                              <span style={{ color: "#F01E29" }}>الوصف: </span>
                              {envelop.description}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                ))
              ) : (
                <div style={{ marginBottom: "20px" }}>
                  <Paper
                    sx={{
                      p: 2,
                      width: "500px!important",
                      minHeight: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      gutterBottom
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontFamily: "Cairo",
                        fontSize: 15,
                      }}
                    >
                      لايوجد أمانات لهذه الرحلة
                    </Typography>
                  </Paper>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                إغلاق
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </div>
      </div>
    </div>
  );
};

export default AllTrips;
