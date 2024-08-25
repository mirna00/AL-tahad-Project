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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useEffect } from "react";

import Autocomplete from "@mui/material/Autocomplete";

import { makeStyles } from "@material-ui/core";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

import {getDays, getArchUni } from "../../../api/university";
import { _axios } from "../../../api/axiosApi";

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

function ArchiveUni() {
    const classes = useStyles();

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
  
    const queryClient = useQueryClient();
  
    const [newTripUni, setNewTripUni] = useState({
      go_price: "",
      round_trip_price: "",
      semester_go_price: "",
      semester_round_trip_price: "",
      go_points: "",
      round_trip_points: "",
      semester_go_points: "",
      semester_round_trip_points: "",
      stations: [
        {
          name: "",
          in_time: [null],
          out_time: [null],
        },
      ],
      days: null,
    });
  
    const {
      isLoading,
      isError,
      data: fetchArchUni,
    } = useQuery("universities", getArchUni, {
      onError: (error) => {
        // Handle the error, e.g., set an error state or display an error message
        console.error("Error fetching universities:", error);
      },
    });
  
    const { data: days } = useQuery("days", getDays);
  
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState([]);
  
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await _axios.get(
    //         `/api/collage_trips/search?destination=${searchTerm}`
    //       );
    //       const newData = response.data.map((item) => item.destination);
    //       setOptions(newData);
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   };
  
    //   const delayDebounceFn = setTimeout(() => {
    //     if (searchTerm !== "") {
    //       fetchData();
    //     } else {
    //       setOptions([]);
    //     }
    //   }, 500);
  
    //   return () => clearTimeout(delayDebounceFn);
    // }, [searchTerm]);
  
 
  
 
    const arabicDays = days?.data.map((day) => ({
      id: day.id,
      name: dayTranslations[day.name] || day.name,
    }));
  
    const firstDay = days?.data[0];
    const arabicDay = dayTranslations[firstDay?.name] || firstDay?.name;
  
    const uniqueTripuni = Array.from(
      new Map(
        fetchArchUni?.data?.map((university) => [
          university.stations[0]?.name,
          university,
        ])
      ).values()
    );
  
    let content;
    if (isLoading) {
      content = <div>Loading...</div>;
    } else if (
      !fetchArchUni ||
      !fetchArchUni.data ||
      fetchArchUni.data?.length === 0
    ) {
      content = <p>No universities available.</p>;
    } else {
      const universities = fetchArchUni.data;
      content = (
        <div>
          {fetchArchUni?.data
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
                      to={`/dashboard/الجامعات/arch_trip/${university.id}`}
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
            أرشيف الرحلات الجامعيّة
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
      
  
          {content}
        </div>
      </div>
    );
  
}

export default ArchiveUni