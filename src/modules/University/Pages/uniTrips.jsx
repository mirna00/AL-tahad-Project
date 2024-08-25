import React, { useState } from "react";
import Bus from "../../../assets/buses/BUS.png";
import Bus1 from "../../../assets/buses/BUS2.png";
import Frame from "../../../assets/buses/Frame.png";

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
  ToggleButtonGroup,
  MenuItem,
  ImageList,
  ImageListItem,
  ToggleButton,
} from "@mui/material";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Select } from "@mui/material";
import "../../../global/grid.css";
import { useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { makeStyles } from "@material-ui/core";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import axios from "axios";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { addTripUni, getDays, getUni } from "../../../api/university";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { getDriver } from "./../../../api/DriverApi";
import { _axios } from "../../../api/axiosApi";

const validationSchema = Yup.object().shape({
  go_price: Yup.number().required("Go price is required"),
  round_trip_price: Yup.number().required("Round-trip price is required"),
  semester_round_trip_price: Yup.number().required(
    "Semester round-trip price is required"
  ),
  go_points: Yup.number().required("Go points is required"),
  round_trip_points: Yup.number().required("Round-trip points is required"),
  semester_round_trip_points: Yup.number().required(
    "Semester round-trip points is required"
  ),
  required_go_points: Yup.number().required("Required go points is required"),
  required_round_trip_points: Yup.number().required(
    "Required round-trip points is required"
  ),
  required_semester_round_trip_points: Yup.number().required(
    "Required semester round-trip points is required"
  ),
  driver_id: Yup.number()
    .required("Bus is required")
    .positive("Bus ID must be a positive number")
    .integer("Bus ID must be an integer"),
});

const dayTranslations = {
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const AllUni = () => {
  const classes = useStyles();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(0); // Add selected seat state
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isTripAdded, setTripAdded] = useState(false);

  const queryClient = useQueryClient();

  const [newTripUni, setNewTripUni] = useState({
    go_price: "",
    round_trip_price: "",
    semester_round_trip_price: "",
    go_points: "",
    round_trip_points: "",
    semester_round_trip_points: "",
    required_go_points: "",
    required_round_trip_points: "",
    required_semester_round_trip_points: "",
    driver_id: "null",
    stations: [
      {
        name: "",
        in_time: dayjs().format("hh:mm A"), // Set initial time to AM/PM format
        out_time:null, // Set initial time to AM/PM format
        type: "",
      },
    ],
    days: null,
    total_seats: 0, // Add total seats
  });

  const {
    isLoading,
    isError,
    data: fetchUniversities,
  } = useQuery("universities", getUni, {
    onError: (error) => {
      // Handle the error, e.g., set an error state or display an error message
      console.error("Error fetching universities:", error);
    },
  });

  const { data: days } = useQuery("days", getDays);

  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _axios.get(
          `/api/collage_trips/search?destination=${searchTerm}`
        );
        const newData = response.data.map((item) => item.destination);
        setOptions(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== "") {
        fetchData();
      } else {
        setOptions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const addTripUniMutation = useMutation(addTripUni, {
    onSuccess: (data) => {
      console.log("Add Trip success:", data);
      queryClient.invalidateQueries("universities");
      setTripAdded(true);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTripUni((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStationChange = (event, index, field) => {
    const { value } = event.target;

    // If updating time fields, format them in AM/PM
    const formattedValue =
      field === "in_time" || field === "out_time"
      ? value ? formatTimeValueAMPM(value) : null // Set to null if value is empty
      : value;

    setNewTripUni((prevState) => {
      const updatedStations = [...prevState.stations];
      updatedStations[index][field] = formattedValue;
      return {
        ...prevState,
        stations: updatedStations,
      };
    });
  };
  function formatTimeValueAMPM(timeValue) {
    if (!timeValue) return null; // Return null if no value
   
    const timeDate = dayjs(timeValue, ["hh:mm A", "HH:mm"], true);
    
    if (!timeDate.isValid()) {
        throw new Error("Invalid time value: " + timeValue);
    }

    return timeDate.format("h:mm A"); // Use h:mm A format
}

  const handletimeIn = (newValue, index) => {
    const timeAMPM = newValue ? dayjs(newValue).format("hh:mm A") : "";
  
    setNewTripUni((prevState) => {
      const updatedStations = [...prevState.stations];
      updatedStations[index].in_time = timeAMPM; // Store as AM/PM format
      return {
        ...prevState,
        stations: updatedStations,
      };
    });
  };
  
  const handletimeOut = (newValue, index) => {
    const timeAMPM = newValue ? dayjs(newValue).format("hh:mm A") : null;

    setNewTripUni((prevState) => {
        const updatedStations = [...prevState.stations];
        updatedStations[index].out_time = timeAMPM; // Should allow null
        return {
            ...prevState,
            stations: updatedStations,
        };
    });
};
  const { data: drivers } = useQuery("drivers", getDriver);

  const addStation = () => {
    setNewTripUni((prevState) => ({
      ...prevState,
      stations: [
        ...prevState.stations,
        { name: "", in_time: dayjs().format("hh:mm A"), out_time:null, type: "" },
      ],
    }));
  };
  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      console.log("newTrip:", newTripUni);
      // console.log("validationSchema:", validationSchema);
      const value = e.target.value;
      const time = dayjs(value, "hh:mm A");

      const formattedNewTrip = {
        ...newTripUni,
        driver_id: newTripUni.driver_id ? Number(newTripUni.driver_id) : null,
        days: newTripUni.days || null, // Add the selected day to the formattedNewTrip object
        in_time: newTripUni.stations.map((station) =>
          formatTimeValueAMPM(station.in_time)
        ),
        out_time: newTripUni.stations.map((station) =>
          station.out_time ? formatTimeValueAMPM(station.out_time) : null // Handle null case
        ),
      
      };
      await validationSchema.validate(newTripUni, { abortEarly: false });
      const addedTrip = await addTripUniMutation.mutateAsync(formattedNewTrip);
      setNewTripUni({
        go_price: "",
        round_trip_price: "",
        semester_round_trip_price: "",
        go_points: "",
        round_trip_points: "",
        semester_round_trip_points: "",
        required_go_points: "",
        required_round_trip_points: "",
        required_semester_round_trip_points: "",
        driver_id: null,
        stations: [
          {
            name: "",
            in_time: dayjs().format("hh:mm A"), // Set initial time to AM/PM format
            out_time: dayjs().format("hh:mm A"), // Set initial time to AM/PM format
            type: "",
          },
        ],
        days: [], // Reset the days value after adding the trip
        total_seats: 0, // Reset total seats
      });
      setSelectedSeat(0); // Reset selected seat
      setValidationErrors({});
      setOpenAddDialog(false);
      return addedTrip;
    } catch (error) {
      // console.error("Error adding driver:", error);

      if (error.name === "ValidationError") {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
        setBackendErrors({});
      } else if (typeof error === "object" && error !== null) {
        // Assume this is the backend error object
        const backendErrorsArray = Object.entries(
          error.response.data.errors
        ).map(([field, message]) => ({
          field,
          message,
        }));
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber);
    setNewTripUni((prev) => ({
      ...prev,
      total_seats: seatNumber,
    }));
  };

  const handleDeleteStation = (index) => {
    const updatedStations = [...newTripUni.stations];
    updatedStations.splice(index, 1);

    setNewTripUni((prevState) => ({
      ...prevState,
      stations: updatedStations,
    }));
  };

  const arabicDays = days?.data.map((day) => ({
    id: day.id,
    name: dayTranslations[day.name] || day.name,
  }));

  const firstDay = days?.data[0];
  const arabicDay = dayTranslations[firstDay?.name] || firstDay?.name;

  const uniqueTripuni = Array.from(
    new Map(
      fetchUniversities?.data?.map((university) => [
        university.stations[0]?.name,
        university,
      ])
    ).values()
  );

  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (
    !fetchUniversities ||
    !fetchUniversities.data ||
    fetchUniversities.data?.length === 0
  ) {
    content = <Typography>لا يوجد رحل جامعية</Typography>;
  } else {
    const universities = fetchUniversities.data;
    content = (
      <div>
        {fetchUniversities?.data
          .filter((university) =>
            university.stations.some((station) =>
              station.name.includes(searchTerm)
            )
          )
          .map((university) => (
            <Grid key={university.id}>
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
                  <Grid item>
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                      style={{ fontSize: "18px" }}
                    >
                      رقم الرحلة
                      <div>{university.stations[0]?.collage_trip_id}</div>
                    </Typography>
                  </Grid>
                  <div
                    style={{
                      height: "100%",
                      borderLeft: "2px solid #000",
                      marginRight: "40px",
                    }}
                  ></div>
                </Grid>
                <Grid container spacing={2}>
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
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      {university.stations[0]?.name}
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
                    {university?.days.map((day) => (
                      <Typography
                        key={day.id}
                        variant="subtitle"
                        className={classes.Typography}
                        style={{ marginRight: "8px" }}
                      >
                        {dayTranslations[day.name]}
                      </Typography>
                    ))}
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    container
                    direction="row"
                    alignItems="center"
                  >
                    <div style={{ display: "flex", marginLeft: "5px" }}>
                      <AccessTimeIcon style={{ color: "#F01E29" }} />
                    </div>
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      {university.stations[0].in_time}
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
                      to={`/dashboard/الجامعات/uni_trips/${university.id}`}
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
                </Grid>
              </Paper>
            </Grid>
          ))}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
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
          الرحلات الجامعيّة
        </Typography>

        <Autocomplete
          options={uniqueTripuni}
          getOptionLabel={(option) => option.stations[0]?.name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.stations[0]?.name === value?.stations[0]?.name
          }
          onChange={(event, value) =>
            setSearchTerm(value?.stations[0]?.name || "")
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Destination"
              variant="standard"
              style={{ marginTop: "20px", width: "300px" }}
              onChange={(event) => setSearchTerm(event.target.value)}
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
        <Button variant="contained" style={{marginBottom:'15px'}} onClick={() => setOpenAddDialog(true)}>
          رحلة جديدة{" "}
        </Button>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle
            style={{ fontWeight: "bold" }}
            sx={{ m: 0, p: 2, textAlign: "center" }}
            id="customized-dialog-title"
          >
            رحلة جديدة
          </DialogTitle>
          <form onSubmit={handleAddTrip} autoComplete="off">
            <DialogContent dividers>
              {newTripUni.stations.map((station, index) => (
                <div
                  key={index}
                  className="field"
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                    marginBottom: "15px", // Add margin bottom to create space between stations
                  }}
                >
                  <TextField
                    label={index === 0 ? "محطة الانطلاق" : `محطة ${index}`}
                    value={station.name}
                    onChange={(event) =>
                      handleStationChange(event, index, "name")
                    }
                    sx={{ width: "200px" }} // Adjust the width as per your requirements
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
  <TimePicker
    label={index === 0 ? "وقت الانطلاق" : "وقت انطلاق المحطة"}
    value={
      newTripUni.stations[index].in_time
        ? dayjs(newTripUni.stations[index].in_time, "hh:mm A")
        : null
    }
    onChange={(newValue) => handletimeIn(newValue, index)}
    ampm
  />
  <TimePicker
    label={index === 0 ? "وقت العودة" : "وقت عودة المحطة"}
    value={
      newTripUni.stations[index].out_time
        ? dayjs(newTripUni.stations[index].out_time, "hh:mm A")
        : null
    }
    onChange={(newValue) => handletimeOut(newValue, index)}
    ampm
  />
</LocalizationProvider>
                  <Select
                    label="Type"
                    value={station.type}
                    onChange={(event) =>
                      handleStationChange(event, index, "type")
                    }
                    sx={{ width: "120px" }}
                  >
                    <MenuItem value="Go">ذهاب</MenuItem>
                    <MenuItem value="Back">عودة</MenuItem>
                  </Select>{" "}
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexDirection: "row-reverse",
                  margin: "15px",
                }}
              >
                <Button
                  onClick={addStation}
                  variant="contained"
                  color="primary"
                >
                  <AddIcon />
                </Button>
                {newTripUni.stations.length > 1 && (
                  <Button
                    onClick={() =>
                      handleDeleteStation(newTripUni.stations.length - 1)
                    }
                    variant="contained"
                    color="error"
                    sx={{ backgroundColor: "#F01E29" }}
                  >
                    <RemoveIcon />
                  </Button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  marginBottom: "15px",
                  color: "#ccc",
                }}
              >
                <span>السعر اليومي</span>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    width: "100%",
                    marginTop: "5px",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <TextField
                  type="number"
                  name="round_trip_price"
                  value={newTripUni.round_trip_price}
                  onChange={handleChange}
                  label="ذهاب وعودة"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.round_trip_price}
                  helperText={validationErrors.round_trip_price}
                />
                <TextField
                  type="number"
                  name="go_price"
                  value={newTripUni.go_price}
                  onChange={handleChange}
                  label="ذهاب/عودة"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.go_price}
                  helperText={validationErrors.go_price}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  marginBottom: "15px",
                  color: "#ccc",
                }}
              >
                <span>الاشتراك </span>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    width: "100%",
                    marginTop: "5px",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <TextField
                  type="number"
                  name="semester_round_trip_price"
                  value={newTripUni.semester_round_trip_price}
                  onChange={handleChange}
                  label="سعر الذهاب والعودة للاشتراك"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.semester_round_trip_price}
                  helperText={validationErrors.semester_round_trip_price}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  marginBottom: "15px",
                  color: "#ccc",
                }}
              >
                <span> النقاط المكتسبة </span>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    width: "100%",
                    marginTop: "5px",
                  }}
                />
              </div>

              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <TextField
                  type="number"
                  name="go_points"
                  value={newTripUni.go_points}
                  onChange={handleChange}
                  label=" نقاط ذهاب وعودة يومي"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.go_points}
                  helperText={validationErrors.go_points}
                />
                <TextField
                  type="number"
                  name="round_trip_points"
                  value={newTripUni.round_trip_points}
                  onChange={handleChange}
                  label="نقاط ذهاب / عودة يومي "
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.round_trip_points}
                  helperText={validationErrors.round_trip_points}
                />
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <TextField
                  type="number"
                  name="semester_round_trip_points"
                  value={newTripUni.semester_round_trip_points}
                  onChange={handleChange}
                  label="نقاط ذهاب وعودة للاشتراك"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.semester_round_trip_points}
                  helperText={validationErrors.semester_round_trip_points}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  marginBottom: "15px",
                  color: "#ccc",
                }}
              >
                <span> النقاط اللازمة</span>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    width: "100%",
                    marginTop: "5px",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <TextField
                  type="number"
                  name="required_round_trip_points"
                  value={newTripUni.required_round_trip_points}
                  onChange={handleChange}
                  label=" نقاط ذهاب وعودة يومي"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.required_round_trip_points}
                  helperText={validationErrors.required_round_trip_points}
                />
                <TextField
                  type="number"
                  name="required_go_points"
                  value={newTripUni.required_go_points}
                  onChange={handleChange}
                  label="نقاط ذهاب / عودة يومي "
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.required_go_points}
                  helperText={validationErrors.required_go_points}
                />
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <TextField
                  type="number"
                  name="required_semester_round_trip_points"
                  value={newTripUni.required_semester_round_trip_points}
                  onChange={handleChange}
                  label="نقاط ذهاب وعودة للاشتراك"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    min: "0",
                    step: "any",
                  }}
                  error={!!validationErrors.required_semester_round_trip_points}
                  helperText={
                    validationErrors.required_semester_round_trip_points
                  }
                />
              </div>
              <Autocomplete
                options={drivers?.data?.drivers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={newTripUni.driver}
                onChange={(event, newValue) => {
                  setNewTripUni({
                    ...newTripUni,
                    driver_id: newValue?.id || null,
                    driver: newValue || null,
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ImageList
                    cols={1}
                    rowHeight={400}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <ImageListItem>
                      <img
                        src={Bus}
                        alt="Image 1"
                        onClick={() => handleSeatSelect(25)}
                        style={{
                          opacity: selectedSeat === 25 ? 0.5 : 1,
                          cursor: "pointer",
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </ImageListItem>
                    <ImageListItem>
                      <img
                        src={Bus1}
                        alt="Image 2"
                        onClick={() => handleSeatSelect(30)}
                        style={{
                          opacity: selectedSeat === 30 ? 0.5 : 1,
                          cursor: "pointer",
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </ImageListItem>
                    <ImageListItem>
                      <img
                        src={Frame}
                        alt="Image 3"
                        onClick={() => handleSeatSelect(40)}
                        style={{
                          opacity: selectedSeat === 40 ? 0.5 : 1,
                          cursor: "pointer",
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </ImageListItem>
                  </ImageList>
                </Grid>
              </Grid>
              <ToggleButtonGroup
                value={newTripUni.days || []}
                onChange={(event, newValue) => {
                  setNewTripUni({ ...newTripUni, days: newValue || null });
                }}
                aria-label="Days of the Week"
                fullWidth
                sx={{ my: 2 }}
              >
                {arabicDays?.map((day) => (
                  <ToggleButton value={day.id} key={day.id}>
                    <Typography>{day.name}</Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                style={{ marginLeft: "16px" }}
                onClick={() => setOpenAddDialog(false)}
              >
                <Typography>إلغاء</Typography>
              </Button>
              <Button
                variant="contained"
                style={{ marginLeft: "16px" }}
                type="submit"
                color="primary"
              >
                <Typography>إضافة رحلة جامعية</Typography>
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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
              تم إضافة رحلة جامعيّة
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
        {content}
      </div>
    </div>
  );
};

export default AllUni;
