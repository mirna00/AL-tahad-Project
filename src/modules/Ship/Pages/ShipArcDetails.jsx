import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import Autocomplete from "@mui/material/Autocomplete";
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

} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SellTwoToneIcon from "@mui/icons-material/SellTwoTone";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  fetchShipTripDetails,
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

const ShipArcDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();

  const [selectedFoodstuff, setSelectedFoodstuff] = useState(null);

  const gridHeaders = [
    "الاسم",
    "العمر",
    "الرقم",
    "العنوان",
    "الجنسية",
    "ID",
    "الوزن",
    "السعر",
  ];

  const [newPerson, setNewPerson] = useState({
    name: "",
    age: "",
    mobile_number: "",
    address: "",
    nationality: "",
    weight: "",
    id_number: "",
    foodstuffs: [], // Initialize as an empty array
    shipment_trip_id: id, // Add trip_id to newPassenger state
    user_id: "1",
    status: "accept",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [shipPersons, setShipPersons] = useState([]);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPersonAdded, setIsPersonAdded] = useState(false);
  const [selectedFoodstuffs, setSelectedFoodstuffs] = useState([]);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: shipTripDetails,
  } = useQuery(["ship", id], () => fetchShipTripDetails(id));



  const { data: stuffs } = useQuery("sttufs", fetchStuff);

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
      <div style={{ display: "grid", gridTemplateColumns: "2fr 20fr 2fr" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Link
            to={`/dashboard/الشحن/أرشيف_الشحن`}
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
            width: "900px",
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
                  {trip.type}
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
           
            </Grid>
            <Grid item xs={12}>
              <Table>
                {trip.shipment_requests.length > 0 && (
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
                <TableBody>
                  {trip.shipment_requests.map((request, index) => (
                    <TableRow
                      key={request.id}
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
     
     
    </div>
  );
};

export default ShipArcDetails;
