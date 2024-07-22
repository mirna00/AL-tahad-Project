import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import Autocomplete from "@mui/material/Autocomplete";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
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
  Modal,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import SubdirectoryArrowLeftRoundedIcon from "@mui/icons-material/SubdirectoryArrowLeftRounded";
import DangerousIcon from "@mui/icons-material/Dangerous";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import UniTripEdit from "./UniTripEdit";
import { deleteUniTrip, fetchTripsUniDetails } from "../../../api/university";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please enter a name"),
  age: Yup.number().required("Please enter an age"),
  mobile_number: Yup.number().required("Please enter a number"),
  address: Yup.string().required("Please enter an address"),

  nationality: Yup.string().required("Please enter a nationality"),
});

const TripsUniDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();

  const [date, setDate] = useState(null);

  const gridHeaders = [
    "الاسم",
    "العمر",
    "الرقم",
    "الايميل",
    "العنوان",
    "الجنسية",
    "النقاط",
    "النوع",
  ];

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: tripsUniDetails,
  } = useQuery(["tripUni", id], () => fetchTripsUniDetails(id));

  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleUpdateTrip = (trip) => {
    setSelectedTrip(trip);
  };

  const handleSaveTrip = () => {
    setSelectedTrip(null);
  };

  const handleCancelEditModal = () => {
    setSelectedTrip(null);
  };


  const deleteTripUniMutate = useMutation(deleteUniTrip, {
    onSuccess: () => {
      queryClient.invalidateQueries("tripUni");
      navigate("/dashboard/الجامعات/"); // Navigate to the new page
    },
  });
  const handleDeleteTrip = (trip) => {
    setConfirmDeleteId(trip.id); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteTripUniMutate.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching University Trip details.</div>;
  }

  if (!tripsUniDetails || !tripsUniDetails.data) {
    return <div>trips not found.</div>;
  }

  const trip = tripsUniDetails.data;
  const station = trip.stations;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px",
        overflow: "hidden",
      }}
    >
  <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 13fr 6fr",
          marginLeft: "316px",
        }}
      >
        <div style={{ display: "flex" }}>
          <Link
            to={`/dashboard/الجامعات/`}
            style={{
              textDecoration: "none",
              fontSize: "40px",
              marginLeft: "24px",
            }}
          >
            <ArrowBackIcon
              style={{ fontSize: "40px", color: "rgba(0, 0, 0, 0.54)" }}
            />
          </Link>
        </div>
        <div></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
         <IconButton onClick={() => handleDeleteTrip(trip)}>
      <DangerousIcon />
    </IconButton>
        </div>
      </div> 



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
        تفاصيل الرحلة
      </Typography>

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
            width: "950px",
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
                {dayjs(tripsUniDetails.data?.date).format("YYYY-MM-DD")}
              </Typography>
            </Grid>

            <Grid
              item
              xs={6}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{marginLeft:"50px", marginRight:"50px"}}
            >
              {trip?.days?.map((day) => (
                <Typography
                  key={day.id}
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    marginRight: "8px",
                    color: "#3f47b5c7",
                    fontWeight: "bold",
                  }}
                >
                  {dayTranslations[day.name]}
                </Typography>
              ))}
            </Grid>

            <Grid
              item
              xs={2}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
            
                <Typography
                 
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    // marginRight: "5px",
                    color: "#5151ff",
                    fontWeight: "bold",
                  }}
                >
                  
                 اسم السائق:
                 <Typography  className={classes.Typography}
                  style={{
                    fontSize:"20px",
                    color: "#000000",
                    fontWeight: "bold",
                  }}>
                 {trip?.driver?.name} </Typography>
                </Typography>
          
            </Grid>
            <Grid
              item
              xs={6}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ marginBottom: "20px" }}
            >
              <Grid
                item
                container
                direction="column"
                xs={6}
                alignItems="center"
              >
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "20px",
                    color: "#F01E29",
                    fontWeight: "bold",
                  }}
                >
                  محطات
                </Typography>
                {trip?.stations
                  ?.filter((station) => station.type === "Go")
                  .map((station) => (
                    <Grid
                      item
                      container
                      direction="row"
                      key={station.id}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid
                        item
                        container
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid
                          item
                          container
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                              style={{
                                color: "#5151ff",
                                fontWeight: "bold",
                              }}
                            >
                              {station.name}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          direction="column"
                          alignItems="flex-end"
                        >
                          <Grid item>
                            <Grid item>
                              <SubdirectoryArrowLeftRoundedIcon
                                style={{
                                  fontSize: "30px",
                                  color: "coral",
                                  fontWeight: "bold",
                                }}
                              />{" "}
                              <Typography
                                variant="subtitle"
                                className={classes.Typography}
                                style={{
                                  fontSize: "16px",
                                  color: "#000000c9",
                                  fontWeight: "bold",
                                  margin: "3px",
                                }}
                              >
                                وقت الانطلاق:{" "}
                                <span
                                  style={{
                                    fontSize: "15px",
                                    color: "#3f4e60d9",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {" "}
                                  {station.in_time}
                                </span>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                              style={{
                                fontSize: "16px",
                                color: "#000000c9",
                                fontWeight: "bold",
                                margin: "3px",
                              }}
                            >
                              وقت العودة:{" "}
                              <span
                                style={{
                                  fontSize: "15px",
                                  color: "#3f4e60d9",
                                  fontWeight: "bold",
                                }}
                              >
                                {" "}
                                {station.out_time}
                              </span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Grid
              item
              xs={6}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ marginBottom: "20px" }}
            >
              <Grid
                item
                xs={6}
                container
                direction=""
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  item
                  container
                  direction="column"
                  xs={12}
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle"
                    className={classes.Typography}
                    style={{
                      fontSize: "20px",
                      color: "#F01E29",
                      fontWeight: "bold",
                    }}
                  >
                    محطات العودة
                  </Typography>
                  {trip?.stations
                    ?.filter((station) => station.type === "Back")
                    .map((station) => (
                      <Grid
                        item
                        container
                        direction="row"
                        key={station.id}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Grid item container direction="column" spacing={1}>
                          <Grid item>
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                              style={{
                                color: "#5151ff",
                                fontWeight: "bold",
                              }}
                            >
                              {station.name}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            container
                            direction="row"
                            justifyContent="space-between"
                          >
                            <Grid item>
                              <SubdirectoryArrowLeftRoundedIcon
                                style={{
                                  fontSize: "30px",
                                  color: "coral",
                                  fontWeight: "bold",
                                }}
                              />
                              <Typography
                                variant="subtitle"
                                className={classes.Typography}
                                style={{
                                  fontSize: "16px",
                                  color: "#000000c9",
                                  fontWeight: "bold",
                                  margin: "3px",
                                }}
                              >
                                وقت الانطلاق:{" "}
                                <span
                                  style={{
                                    fontSize: "15px",
                                    color: "#3f4e60d9",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {" "}
                                  {station.in_time}
                                </span>
                              </Typography>
                            </Grid>

                            <Grid item>
                              <Typography
                                variant="subtitle"
                                className={classes.Typography}
                                style={{ marginTop: "8px" }}
                              >
                                &nbsp;
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: "20px" }}>
              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  سعر الذهاب اليومي :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.go_price}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  سعر الرحلة اليومية :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.round_trip_price}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  سعر الاشتراك :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.semester_round_trip_price}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  نقاط الرحلة اليومية :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.go_points}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  نقاط الذهاب والعودة لليوم :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.round_trip_points}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  نقاط الاشتراك :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.semester_round_trip_points}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  النقاط المطلوبة لليومي:{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.required_go_points}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  النقاط المطلوبة للرحلة اليومية (ذهاب وعودة) :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.required_round_trip_points}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  النقاط المطلوبة للاشتراك :{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {trip.required_semester_round_trip_points}
                  </span>
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: "20px" }}>
              <Grid item xs={6}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  عدد المقاعد الكلي:{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {trip.trips[0].total_seats}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ArrowLeftIcon
                  style={{
                    fontSize: "30px",
                    color: "coral",
                    fontWeight: "bold",
                    marginBottom: "-10px",
                  }}
                />
                <Typography
                  variant="subtitle"
                  className={classes.Typography}
                  style={{
                    fontSize: "16px",
                    color: "#000000c9",
                    fontWeight: "bold",
                    margin: "3px",
                  }}
                >
                  عدد المقاعد المحجوزة:{" "}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#3f4e60d9",
                      fontWeight: "bold",
                    }}
                  >
                    {trip.trips[0].available_seats}
                  </span>
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} >
              <Table>
                {trip.subscriptions?.length > 0 && (
                  <TableHead
                    sx={{
                      backgroundColor: "#EBE6E4",
                      "& .MuiTableCell-head": {
                        fontWeight: "600",
                        fontSize: "22px",
                        color: "#F01E29",
                        width: `${100 / gridHeaders.length + 1}%`,
                        textAlign: "center",
                      },
                    }}
                  >
                    <TableRow>
                      {gridHeaders.map((header, headerIndex) => (
                        <TableCell
                          key={headerIndex}
                          sx={{ width: `${100 / (gridHeaders.length + 1)}%` }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                )}
                <TableBody >
                  {[...trip.subscriptions].map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "background.paper" : "#EBE6E4",
                        "& .MuiTableCell-root": {
                          width: `${100 / gridHeaders.length}%`,
                          textAlign: "center",
                        },
                      }}
                    >
                      {gridHeaders.map((header, headerIndex) => (
                        <TableCell key={headerIndex}>
                          {(() => {
                            switch (header) {
                              case "الاسم":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.name}
                                  </Typography>
                                );
                              case "العمر":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.age}
                                  </Typography>
                                );
                              case "الرقم":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.mobile_number}
                                  </Typography>
                                );
                              case "الايميل":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.email}
                                  </Typography>
                                );
                              case "العنوان":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.address}
                                  </Typography>
                                );
                              case "الجنسية":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.nationality}
                                  </Typography>
                                );
                              case "النقاط":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.points}
                                  </Typography>
                                );
                              case "النوع":
                                return (
                                  <Typography
                                    variant="subtitle"
                                    className={classes.Typography}
                                  >
                                    {item.user.type}
                                  </Typography>
                                );
                              default:
                                return null;
                            }
                          })()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {trip.trips &&
                    trip.trips.length > 0 &&
                    trip.trips.map((singleTrip, tripIndex) =>
                      singleTrip.daily_collage_reservation.map(
                        (reservation, reservationIndex) => (
                          <TableRow
                            key={`${tripIndex}-${reservationIndex}`}
                            sx={{
                              backgroundColor:
                                reservationIndex % 2 === 0 ? "background.paper" : "#EBE6E4",
                              "& .MuiTableCell-root": {
                                width: `${100 / gridHeaders.length}%`,
                                textAlign: "center",
                              },
                            }}
                          >
                            {gridHeaders.map((header, headerIndex) => (
                              <TableCell key={headerIndex}>
                                {(() => {
                                  switch (header) {
                                    case "الاسم":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.name}
                                        </Typography>
                                      );
                                    case "العمر":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.age}
                                        </Typography>
                                      );
                                    case "الرقم":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.mobile_number}
                                        </Typography>
                                      );
                                    case "الايميل":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.email}
                                        </Typography>
                                      );
                                    case "العنوان":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.address}
                                        </Typography>
                                      );
                                    case "الجنسية":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.nationality}
                                        </Typography>
                                      );
                                    case "النقاط":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.user.points}
                                        </Typography>
                                      );
                                    case "النوع":
                                      return (
                                        <Typography
                                          variant="subtitle"
                                          className={classes.Typography}
                                        >
                                          {reservation.type}
                                        </Typography>
                                      );
                                    default:
                                      return null;
                                  }
                                })()}
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      )
                    )}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد أنك تريد حذف هذه الرحلة ؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      {selectedTrip && (
        <UniTripEdit
          trip={selectedTrip}
          onSave={handleSaveTrip}
          onCancel={handleCancelEditModal}
        />
      )}
    </div>
  );
};

export default TripsUniDetails;
