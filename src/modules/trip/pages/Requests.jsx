import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useQuery, useQueryClient } from "react-query";
import { getReservation, searchReservation } from "../../../api/reservationApi";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const Requests = () => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const {
    isLoading,
    isError,
    data: fetchReservations,
  } = useQuery(["reservations", searchQuery], () =>
    searchReservation(searchQuery)
  );

  useEffect(() => {
    if (isLoading) {
      setFilteredReservations([]);
    } else if (isError) {
      setFilteredReservations([]);
    } else if (fetchReservations && fetchReservations.data) {
      setFilteredReservations(fetchReservations.data);
    } else {
      setFilteredReservations([]);
    }
  }, [isLoading, isError, fetchReservations]);

  useEffect(() => {
    if (fetchReservations && fetchReservations.data) {
      const filtered = fetchReservations.data?.filter((reservation) =>
        (reservation.user.name ?? "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
      );
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations([]);
    }
  }, [searchQuery, fetchReservations]);

  const uniqueRequists = Array.from(
    new Map(
      fetchReservations?.data?.map((reservation) => [
        reservation?.user?.name,
        reservation,
      ]) ?? []
    ).values()
  );

  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error fetching reservations.</div>;
  } else if (
    searchQuery &&
    (!fetchReservations ||
      !fetchReservations.data ||
      // !fetchReservations.data.reservations ||
      fetchReservations.data.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchReservations ||
    !fetchReservations.data ||
    // !fetchReservations.data.reservations ||
    fetchReservations.data.length === 0
  ) {
    content = <p>No reservations available.</p>;
  } else {
    content = (
      <div>
        {filteredReservations.map((reservation, index) => (
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
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <div>
                    <PersonIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {reservation.user.name}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <div>
                    <PhoneIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {reservation.user.mobile_number}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <div>
                    <LocationOnIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {reservation.destination_name}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Link
                    to={`/dashboard/السفر/reservations/${reservation.reservation_id}`}
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
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ textAlign: "left" }}>
        <Autocomplete
          options={uniqueRequists}
          getOptionLabel={(option) => option.user?.name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.user?.name === value.user.name
          }
          // value={searchReservation?.user?.name || ""}
          onChange={(event, newValue) => {
            setSelectedReservation(newValue);
            setSearchQuery(newValue ? newValue.user.name : "");
          }}
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

export default Requests;
