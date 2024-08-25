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
  MenuItem,
  Select,
  Box,
  modal,
} from "@mui/material";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@material-ui/core";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddDestinationModal from "../../../Component/AddDestination";
import MonitorWeightTwoToneIcon from "@mui/icons-material/MonitorWeightTwoTone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  addShipTrip,
  getShipTrips,
  endShipTrip,
  fetchDestinations,
  fetchTrucks,
  addStuff,
  fetchStuff,
} from "../../../api/Ship";
import { Autocomplete } from "@mui/material";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const validationSchema = Yup.object().shape({
  trip_number: Yup.string().required("Trip number is required"),
  destination_id: Yup.string().nullable().required('Destination is required'),
    truck_id: Yup.number().nullable().required("Bus is required"),
    killoPrice: Yup.number()
      .positive("Price must be a positive number")
      .required("Price is required"),
});
const ShipTrips = () => {
  const classes = useStyles();
  const [driverOptions, setDriverOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddStuffDialog, setOpenAddStuffDialog] = useState(false);
  const [destination, setDestination] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isTripAdded, setTripAdded] = useState(false);
  const [isStuffAdded, setAddStuff] = useState(false);
  const [isTripEnd, setShipEnd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShip, setFilteredShip] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [newStuffs, setNewStuffs] = useState([{ stuff: "" }]);
  const queryClient = useQueryClient();

  const [validationErrors, setValidationErrors] = useState({});

  const [newTrip, setNewTrip] = useState({
    trip_number: "",
    date: dayjs(),
    destination_id: null,
    truck_id: null,
    type: "",
    killoPrice:""
  });

  const [newStuff, setNewStuff] = useState({
    stuff: "",
  });

  const {
    isLoading,
    isError,
    data: fetchShippment,
  } = useQuery("shipsTrip", getShipTrips, 
   
  );

  const addShipTripMutation = useMutation(addShipTrip, {
    onSuccess: (data) => {
      console.log("Add Trip success:", data);
      queryClient.invalidateQueries("shipsTrip");
      setTripAdded(true)
    },
  });

  const shipEndMutation = useMutation(endShipTrip, {
    onSuccess: (data) => {
      console.log("end Trip success:", data);
      queryClient.invalidateQueries("shipsTrip");
      setShipEnd(true)
    },
  });


  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const formattedNewTrip = {
        ...newTrip,
        destination_id: newTrip.destination_id
          ? Number(newTrip.destination_id)
          : null,
        truck_id: newTrip.truck_id ? Number(newTrip.truck_id) : null,
        date: dayjs(newTrip.date).format("YYYY-MM-DD"),
      };

      await validationSchema.validate(formattedNewTrip, { abortEarly: false });

      const addedTrip = await addShipTripMutation.mutateAsync(formattedNewTrip);
      setNewTrip({
        trip_number: "",
        date: dayjs(),
        destination_id: null,
        truck_id: null,
        type: "",
        killoPrice:""
      });
      setValidationErrors({});
      setOpenAddDialog(false);
      return addedTrip;
    } catch (error) {
      if (error.name === "ValidationError") {
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
        console.error("Error adding driver:", error);
        // Handle other types of errors as needed
      }
    }
  };

  const handleEndTrip = async (shipID) => {
    try {
      await shipEndMutation.mutateAsync(shipID);
      // Optionally, you can display a success message or update the UI
    } catch (error) {
      console.error("Error ending trip:", error);
      // Handle the error, e.g., display an error message
    }
  };

  const { data: destinations } = useQuery("destinations", fetchDestinations);
  const { data: trucks } = useQuery("trucks", fetchTrucks);
//   const { data: stuffs } = useQuery("sttufs", fetchStuff);

//   Create the destination mapping
  const destinationMapping = {};
  if (destinations) {
    destinations.forEach((destination) => {
      destinationMapping[destination.id] = destination.name;
    });
  }

  const addStuffMutation = useMutation(addStuff, {
    onSuccess: (data) => {
      console.log("Add Trip success:", data);
      queryClient.invalidateQueries("stuff");
      setAddStuff(true)
    },
  });

  const handleAddStuff = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    const addedStuffs = await Promise.all(
      newStuffs.map(async (newStuff) => {
        return await addStuffMutation.mutateAsync(newStuff);
      })
    );
    setNewStuffs([{ stuff: "" }]);
    setOpenAddStuffDialog(false);
    return addedStuffs;
  };

  const handleAddNewStuff = () => {
    setNewStuffs([...newStuffs, { stuff: "" }]);
  };

  const handleAddDestination = () => {
    setIsModalOpen(true);
    setNewDestination([...destinations, newDestination]);
  };

  const handleSaveDestination = (newDestination) => {
    setNewDestination([...destinations, newDestination]);
    setNewTrip({ ...newTrip, destination_id: newDestination?.id });
    setIsModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSearch = (event, newValue) => {
    const query = newValue ? newValue.destination.name || "" : "";
    setSearchQuery(query);
  };
  let uniqueDestination = [];

  if (Array.isArray(fetchShippment?.data?.allTrips)) {
    // Access the array of trips using fetchTrips.data?.trips
    uniqueDestination = Array.from(
      new Map(
        fetchShippment?.data.allTrips.map((ship) => [
          ship.destination.name,
          ship,
        ])
      ).values()
    );
  } else {
    console.log("fetchTrips.data.trips is not an array");
  }

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (
    searchQuery &&
    (!fetchShippment ||
      !fetchShippment?.data ||
      !fetchShippment?.data.allTrips ||
      fetchShippment.data?.allTrips?.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchShippment ||
    !fetchShippment?.data ||
    !fetchShippment?.data.allTrips ||
    fetchShippment?.data.allTrips?.length === 0
  ) {
    content = <p>لا يوجد رحل مُتاحة</p>;
  } else {
    const filteredShip = fetchShippment?.data.allTrips.filter((ship) =>
      ship.destination.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    content = (
      <>
        {filteredShip.map((ship, index) => (
          <Grid key={ship.id}>
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
              <Grid item container direction="column">
                <Grid item container>
                  <Grid item xs={12} container direction="row">
                    <Typography
                      variant="subtitle"
                      className={classes.typography}
                      color="grey"
                    >
                      {dayjs(ship.created_at).format("YYYY-MM-DD")}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "35px",
                    }}
                  >
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                      style={{ fontSize: "18px" }}
                    >
                      رقم الرحلة
                      <div>{ship.trip_number}</div>
                    </Typography>
                  </Grid>
                </Grid>
                <div
                  style={{
                    height: "100%",
                    borderLeft: "2px solid #000",
                    // marginLeft: "40px",
                  }}
                ></div>
              </Grid>
              <Grid container spacing={2} sx={{ marginLeft: "5px" }}>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="subtitle"
                    className={classes.Typography}
                    style={{
                      fontSize: "16px",
                      color: "#F01E29",
                      fontWeight: "bold",
                      marginRight: "30px",
                    }}
                  >
                  {ship.type === 'Public' ? 'عام' : ship.type === 'Private' ? 'خاص' : ''}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                >
                  <div style={{ display: "flex", marginLeft: "5px" }}>
                    <LocationOnIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {ship.destination.name}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                >
                  <div style={{ display: "flex", marginLeft: "5px" }}>
                    <CalendarMonthIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {ship.date}{" "}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                >
                  <div style={{ display: "flex", marginLeft: "5px" }}>
                    <MonitorWeightTwoToneIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {ship.truck.carrying_capacity} ({ship.available_weight})
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
                    to={`/dashboard/الشحن/ship_trips/${ship.id}`}
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
                    onClick={() => handleEndTrip(ship.id)}
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
        رحلات الشحن
      </Typography>
      <div style={{ textAlign: "center" }}>
        <Autocomplete
          options={uniqueDestination || []}
          getOptionLabel={(option) => option?.destination?.name || ""}
          isOptionEqualToValue={(option, value) => option.destination.name === value.destination.name}
          // value={searchQuery}
          onChange={handleSearch}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Search by name"
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
        <Button onClick={() => setOpenAddStuffDialog(true)}>مادة جديدة </Button>
        <Dialog
          open={openAddStuffDialog}
          onClose={() => setOpenAddStuffDialog(false)}
        >
          <DialogTitle>إضافة مواد جديدة</DialogTitle>
          <form onSubmit={handleAddStuff} autoComplete="off">
            <DialogContent>
              {newStuffs.map((newStuff, index) => (
                <TextField
                  key={index}
                  label={`مادة ${index + 1}`}
                  value={newStuff.stuff}
                  onChange={(e) => {
                    const updatedNewStuffs = [...newStuffs];
                    updatedNewStuffs[index].stuff = e.target.value;
                    setNewStuffs(updatedNewStuffs);
                  }}
                  fullWidth
                  margin="normal"
                />
              ))}
              <Button onClick={handleAddNewStuff} color="primary">
                إضافة مادة أخرى
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddStuffDialog(false)}>
                إلغاء
              </Button>
              <Button type="submit" color="primary">
                إضافة المواد
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>إضافة مادة جديدة</DialogTitle>
          <form onSubmit={handleAddStuff} autoComplete="off">
            <DialogContent>
              <TextField
                label="مادة"
                value={newStuff.stuff}
                onChange={(e) =>
                  setNewStuff({ ...newStuff, stuff: e.target.value })
                }
                fullWidth
                margin="normal"
                //   error={!!validationErrors.truck_number}
                //   helperText={validationErrors.truck_number}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>إلغاء</Button>
              <Button type="submit" color="primary">
                إضافة مادة غذائية
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
          رحلة جديدة{" "}
        </Button>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>رحلة جديدة</DialogTitle>
          <form onSubmit={handleAddTrip} autoComplete="off">
            <DialogContent>
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
                    <TextField
                    
                label="السعر للكيلو"
                value={newTrip.killoPrice}
                type="number"
                onChange={(e) =>
                  setNewTrip({ ...newTrip, killoPrice: e.target.value })
                }
                fullWidth
                margin="normal"
                error={!!validationErrors.killoPrice}
                helperText={validationErrors.killoPrice}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="التاريخ"
                  value={newTrip.date}
                  onChange={(date) => setNewTrip({ ...newTrip, date })}
                  fullWidth
                  margin="normal"
                
                />
              </LocalizationProvider>
              <Select
                label="Type"
                value={newTrip.type}
                onChange={(event) =>
                  setNewTrip({ ...newTrip, type: event.target.value })
                }
                sx={{ width: "100px" ,marginRight:"30px"}}
              >
                <MenuItem value="Public"> عام</MenuItem>
                <MenuItem value="Private">خاص </MenuItem>
              </Select>

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
                Add Destination
              </Button>
              <AddDestinationModal
                open={isModalOpen}
                onClose={handleSaveDestination}
                onSave={(newDestination) => {
                  setDestination([...destinations, newDestination]);
                  handleSaveDestination(newDestination);
                }}
                destinations={destinations}
                setDestinations={setDestination}
              />

              <Autocomplete
                options={trucks?.data.allTruck}
                getOptionLabel={(option) =>
                  `Truck #${option.truck_number} (Capacity: ${option.carrying_capacity})`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={newTrip.truck}
                onChange={(event, newValue) => {
                  setNewTrip({
                    ...newTrip,
                    truck_id: newValue?.id || null,
                    truck: newValue || null,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Truck (Capacity: ${
                      newTrip.truck?.carrying_capacity || "N/A"
                    })`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>إلغاء</Button>
              <Button type="submit" color="primary">
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
            تم إضافة شحنة بنجاح
          </Alert>
        </Snackbar>
      )}
        {isStuffAdded && (
        <Snackbar
          open={isStuffAdded}
          autoHideDuration={6000}
          onClose={() => setAddStuff(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setAddStuff(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            A Stuff successfully
          </Alert>
        </Snackbar>
      )}
      {isTripEnd && (
        <Snackbar
          open={isTripEnd}
          autoHideDuration={6000}
          onClose={() => setShipEnd(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setShipEnd(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            انتقلت الرحلة إلى أرشيف الرحلات
          </Alert>
        </Snackbar>
      )}
        {content}
      </div>
    </div>
  );
};

export default ShipTrips;
