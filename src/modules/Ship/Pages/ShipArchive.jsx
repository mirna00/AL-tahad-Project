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
import Paper from "@mui/material/Paper";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonitorWeightTwoToneIcon from '@mui/icons-material/MonitorWeightTwoTone';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
 
  fetchDestinations,
  fetchTrucks,
  archiveTrips,
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



const ArchivesTrips = () => {
  const classes = useStyles();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShip, setFilteredShip] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDestination, setNewDestination] = useState("");

  const queryClient = useQueryClient();

  const [validationErrors, setValidationErrors] = useState({});

  const [newTrip, setNewTrip] = useState({
    trip_number: "",
    date: dayjs(),
    destination_id: null,
    truck_id: null,
    type: "",
  });

  const {
    isLoading,
    isError,
    data: fetchShippment,
  } = useQuery("shipsTrip", archiveTrips, {
    onError: (error) => {
      // Handle the error, e.g., set an error state or display an error message
      console.error("Error fetching universities:", error);
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

 


  const { data: destinations } = useQuery("destinations", fetchDestinations);
  const { data: trucks } = useQuery("trucks", fetchTrucks);

  // Create the destination mapping
  const destinationMapping = {};
  if (destinations) {
    destinations.forEach((destination) => {
      destinationMapping[destination.id] = destination.name;
    });
  }

  const handleAddDestination = () => {
    setIsModalOpen(true);
    setNewDestination([...destinations, newDestination]);
  };

  const handleSaveDestination = (newDestination) => {
    setNewDestination([...destinations, newDestination]);
    setNewTrip({ ...newTrip, destination_id: newDestination?.id });
    setIsModalOpen(false);
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
      !fetchShippment.data ||
      !fetchShippment.data.allTrips ||
      fetchShippment.data?.allTrips.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchShippment ||
    !fetchShippment.data ||
    !fetchShippment.data.allTrips ||
    fetchShippment.data.allTrips.length === 0
  ) {
    content = <p>No trips available.</p>;
  } else {
    const filteredShip = fetchShippment.data.allTrips.filter((ship) =>
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
              <Grid
              item
                container
                direction="column"
               
              >
                <Grid item container >
                <Grid item xs={12} container  direction="row"  >
              <Typography
                variant="subtitle"
                className={classes.typography}
                color="grey"
              >
                {dayjs(ship.created_at).format("YYYY-MM-DD")}
              </Typography>
            </Grid>
            <Grid item xs={12} container  direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin:"35px"
                }}>
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
              <Grid container spacing={2}   sx={{marginLeft:"5px"}}>
                <Grid item
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
                            >{ship.type}</Typography>
                              

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
                <Grid item xs={12} container direction="row" alignItems="center">
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
                    to={`/dashboard/الشحن/أرشيف_الشحن/ship_rquests/${ship.id}`}
                    
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
        أرشيف الشحن
      </Typography>
      <div style={{ textAlign: "center" }}>
        <Autocomplete
          options={uniqueDestination || []}
          getOptionLabel={(option) => option?.destination?.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
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
     
          
        {content}
      </div>
    </div>
  );
};

export default ArchivesTrips;
