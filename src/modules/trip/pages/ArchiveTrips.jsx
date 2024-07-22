import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import WestRoundedIcon from "@mui/icons-material/WestRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import Face5Icon from "@mui/icons-material/Face5";
import { getTripsArchive,searchArcDestinatin } from "../../../api/TripsApi";
import Autocomplete from "@mui/material/Autocomplete";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));





const ArchiveTrips = () => {

  
 
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArchive, setFilteredArchive] = useState([]);
  // const [selectedArchive setSelectedArchive] = useState(null);

  const queryClient = useQueryClient();



  const {
    isLoading,
    isError,
    error,
    data: fetchTripsArchive,
  } = useQuery(["trips", searchQuery], 
    () => searchArcDestinatin(searchQuery));

  useEffect(() => {
    if (isLoading) {
      setFilteredArchive([]);
    } else if (isError) {
      setFilteredArchive([]);
    } else if (fetchTripsArchive && fetchTripsArchive?.data) {
      setFilteredArchive(fetchTripsArchive?.data.trips); // Access the array of trips using fetchTripsArchive.data.trips
    } else {
      setFilteredArchive([]);
    }
  }, [isLoading, isError, fetchTripsArchive]);

  useEffect(() => {
    if (fetchTripsArchive && fetchTripsArchive?.data) {
      const filtered = fetchTripsArchive?.data?.trips?.filter((trip) =>
        (trip.destination.name ?? "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
      );
      setFilteredArchive(filtered);
    } else {
      setFilteredArchive([]);
    }
  }, [searchQuery, fetchTripsArchive]);

  let  uniqueTripNum = [];
  if (Array.isArray(fetchTripsArchive?.data?.trips)) { // Access the array of trips using fetchTrips.data?.trips
    uniqueTripNum = Array.from(
      new Map(fetchTripsArchive?.data.trips.map((trip) => [trip.destination.name, trip])).values()
    );
  } else {
    console.log('fetchTrips.data.trips is not an array');
  }

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else if (
    searchQuery &&
    (!fetchTripsArchive ||
      !fetchTripsArchive?.data ||
      !fetchTripsArchive?.data?.trips ||
      fetchTripsArchive?.data?.trips?.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchTripsArchive ||
    !fetchTripsArchive?.data ||
    fetchTripsArchive?.data?.trips?.length === 0
  ) {
    content = <p>No trips available.</p>;
  } else {
    const trips = fetchTripsArchive.data.trips;
    content = (
      <>
        {filteredArchive?.map((trip, index) => (
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
                <Grid item>
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
                    marginRight: "40px",
                  }}
                ></div>
              </Grid>
              <Grid container spacing={2}>
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
                   to={`/dashboard/السفر/الأرشيف/trips/${trip.id}`}
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
        ,
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
       أرشيف رحلات السفر
      </Typography>
      <div style={{ textAlign: "center" }}>
      <Autocomplete
          options={uniqueTripNum}
          getOptionLabel={(option) => option.destination?.name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.destination?.name === value.destination.name
          }
          // value={searchQuery}
          onChange={(event, newValue) => {
            setSearchQuery(newValue ? newValue?.destination?.name || "" : "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="الوجهة"
              variant="standard"
              // fullWidth
              style={{ marginTop: "20px", width: "300px" }}
              // error={!!validationErrors.destination}
              // helperText={validationErrors.destination}
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

export default ArchiveTrips;
