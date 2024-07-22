import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import MonitorWeightTwoToneIcon from "@mui/icons-material/MonitorWeightTwoTone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useQuery, useQueryClient } from "react-query";
import { getShipRqeusts, fetchDestinations } from "../../../api/Ship";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const ShipRequests = () => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setfilteredRequests] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const {
    isLoading,
    isError,
    data: fetchShipRequests,
  } = useQuery("requests", getShipRqeusts, {
    onError: (error) => {
      // Handle the error, e.g., set an error state or display an error message
      console.error("Error fetching universities:", error);
    },
  });

  const handleSearch = (event, newValue) => {
    const query = newValue ? newValue.user.name || "" : "";
    setSearchQuery(query);
  };

  const { data: destinationsData } = useQuery(
    "destinations",
    fetchDestinations
  );

  useEffect(() => {
    if (destinationsData) {
      setDestinations(destinationsData);
    }
  }, [destinationsData]);

  let uniquerequests = [];

  if (Array.isArray(fetchShipRequests?.data?.shipmentRequests)) {
    uniquerequests = Array.from(
      new Map(
        fetchShipRequests?.data?.shipmentRequests.map((rquts) => [
          rquts.user.name,
          rquts,
        ])
      ).values()
    );
  } else {
    console.log("fetchTrips.data.trips is not an array");
  }

  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error fetching reservations.</div>;
  } else if (
    searchQuery &&
    (!fetchShipRequests ||
      !fetchShipRequests.data ||
      !fetchShipRequests.data.shipmentRequests ||
      fetchShipRequests.data?.shipmentRequests.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchShipRequests ||
    !fetchShipRequests.data ||
    !fetchShipRequests.data.shipmentRequests ||
    fetchShipRequests.data.shipmentRequests.length === 0
  ) {
    content = <p>No requsts available.</p>;
  } else {
    const filteredRequests = fetchShipRequests.data.shipmentRequests.filter(
      (rquts) =>
        rquts.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    content = (
      <div>
        {filteredRequests.map((rquts, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <Paper
              sx={{
                p: 2,
                width: "700px",
                minHeight: "100px",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Grid xs={12} item direction="column">
                <Typography
                  variant="subtitle"
                  className={classes.typography}
                  color="grey"
                  style={{ fontSize: "15px" }}
                >
                  {dayjs(rquts.created_at).format("YYYY-MM-DD")}
                </Typography>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={4} direction="column" alignItems="center">
                  <div>
                    <PersonIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {rquts.user.name}
                  </Typography>
                </Grid>
                <Grid item xs={4} direction="column" alignItems="center">
                  <div>
                    <PhoneIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {rquts.user.mobile_number}
                  </Typography>
                </Grid>
                <Grid item xs={4} direction="column" alignItems="center">
                  <div>
                    <LocationOnIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {
                      destinations.find(
                        (dest) => dest.destination_id === rquts.destination_id
                      )?.name
                    }
                  </Typography>
                </Grid>
                <Grid item xs={6} direction="column" alignItems="center">
                  <div>
                    <MonitorWeightTwoToneIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {rquts.weight}
                  </Typography>
                </Grid>
                <Grid item xs={6} direction="column" alignItems="center">
                  <div>
                    <PaymentTwoToneIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {rquts.price}
                  </Typography>
                </Grid>
              </Grid>
         
              <Grid
                item
                direction="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Link
                  to={`/dashboard/الشحن/ship_rquests/${rquts.id}`}
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

              {/* </Grid> */}
            </Paper>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Autocomplete
          options={uniquerequests || []}
          getOptionLabel={(option) => option?.user?.name || ""}
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

export default ShipRequests;
