import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';import {
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
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import LocalAirportRoundedIcon from "@mui/icons-material/LocalAirportRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SellTwoToneIcon from "@mui/icons-material/SellTwoTone";
import DangerousIcon from "@mui/icons-material/Dangerous";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  addPassenger,
  deleteTrip,
  fetchTripsDetails,
} from "../../../api/TripsApi";
import PassengerEdit from "./PassengerEdit";
import EditIcon from "@mui/icons-material/Edit";

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
    letterSpacing: "normal !important",
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
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
  age: yup
    .number()
    .min(1, "Age must be at least 1")
    .max(99, "Age must be 99 or less")
    .required("Required"),
  mobile_number: yup
    .string()
    .matches(/^\d+$/, "Please enter a valid phone number")
    .required("Please enter a phone number"),
  address: yup.string().required("Please enter an address"),
  nationality: yup.string().required("Required"),
  seat_number: yup.number().required("Required"),
});

const TripsDetails = () => {
  const { id } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const excludedRef = useRef(null);

  // Arabic font data (replace with your actual font file)

  const gridHeaders = [
    "الاسم",
    "العمر",
    "الرقم",
    "العنوان",
    "الجنسية",
    "رقم المقعد",
    " ",
  ];

  const [newPassenger, setNewPassenger] = useState({
    name: "",
    age: "",
    mobile_number: "",
    address: "",
    nationality: "",
    seat_number: "",
    trip_id: id, // Add trip_id to newPassenger state
    user_id: "4",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPassengerAdded, setIsPassengerAdded] = useState(false);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: tripsDetails,
  } = useQuery(["trips", id], () => fetchTripsDetails(id));

  const addPassengerMutation = useMutation(addPassenger, {
    onSuccess: (data) => {
      console.log("Add driver success:", data);
      queryClient.invalidateQueries("passengers");
      setIsPassengerAdded(true);
    },
  });

  const handleAddPassenger = async (e) => {
    e.preventDefault();
    const selectedSeatNumber = newPassenger.selectedSeat;

    try {
      await validationSchema.validate(newPassenger, { abortEarly: false });

      // Pass the trip_id to the addPassengerMutation
      const addedPassenger = await addPassengerMutation.mutateAsync({
        ...newPassenger,
      });

      setNewPassenger({
        name: "",
        age: "",
        mobile_number: "",
        address: "",
        nationality: "",
        seat_number: "",
        user_id: "4",
        trip_id: id,
      });
      setValidationErrors({});
      setOpenAddDialog(false);
      return addedPassenger;
    } catch (error) {
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

  const [selectedPassenger, setSelectedPassenger] = useState(null);

  const handleUpdatePassenger = (order) => {
    setSelectedPassenger(order);
  };

  const handleCloseEditModal = () => {
    setSelectedPassenger(null);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current, {
          onclone: (clonedDocument) => {
            // Remove the edit icon buttons from the cloned document
            const editButtons = clonedDocument.querySelectorAll(
              'button[aria-label="Edit"]'
            );

            editButtons.forEach((button) => button.remove());
            // Remove the "إضافة شخص جديد" button
            const addButton = clonedDocument.querySelector(
              'button[aria-label="add"]'
            );
            if (addButton) {
              addButton.remove();
            }

            // Remove the "Export to PDF" button
            const exportButton = clonedDocument.querySelector(
              'button[aria-label="download"]'
            );
            if (exportButton) {
              exportButton.remove();
            }
          },
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", [297, 210]); // A4 size, portrait orientation

        // Add the content to the PDF
        pdf.addImage(imgData, "JPEG", 10, 10, 190, 0); // Adjust the position and size as needed

        pdf.save("download.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };
  const deleteTripMutate = useMutation(deleteTrip, {
    onSuccess: () => {
      queryClient.invalidateQueries("trips");
      setDeleteSuccess("Trip deleted successfully");
      navigate("/dashboard/السفر/الرحلات"); // Navigate to the new page
    },
    onError: (error) => {
      console.error("Error deleting trip:", error);
      if (typeof error === "object" && error !== null) {
        const backendErrorsArray = Object.entries(error.response.data).map(
          ([field, message]) => ({
            field,
            message,
          })
        );
        setBackendErrors(backendErrorsArray);
        setValidationErrors({}); // Clear validation errors

        const errorMessages = backendErrorsArray
          .map(({ message }) => message)
          .join(", ");
        setSnackbarMessage(errorMessages);
        setSnackbarOpen(true);
      } else {
        console.error("Error adding bus:", error);
      }
    },
  });
  const handleDeleteTrip = (trip) => {
    setConfirmDeleteId(trip.id); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteTripMutate.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching reservation details.</div>;
  }

  if (!tripsDetails) {
    return <div>trips not found.</div>;
  }

  const trip = tripsDetails?.data;
  const availableSeatNumber = tripsDetails?.data?.available_seat_numbers;
  // console.log(availableSeatNumber);
  const orders = trip?.orders;
  const bus = trip?.bus;
  const destination = trip?.destination;
  const driver = trip?.driver;

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
          gridTemplateColumns: "3fr 14fr 6fr",
          marginLeft: "316px",
        }}
      >
        <div style={{ display: "flex" }}>
          <Link
            to={`/dashboard/السفر/الرحلات`}
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
            width: "900px",
            minHeight: "400px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Grid ref={contentRef} item container direction="row">
            <Grid item xs={2} container direction="column" alignItems="center">
              <Typography
                variant="subtitle"
                className={classes.typography}
                color="grey"
              >
                {dayjs(trip?.date).format("YYYY-MM-DD")}
              </Typography>

              {/* <AccessTimeIcon style={{ fontSize:"18px", color: "#F01E29" }} /> */}
              <Typography
                variant="subtitle"
                className={classes.Typography}
                color="grey"
              >
                {trip?.depature_hour}
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
                  رقم الباص
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  ({bus?.type}) {bus?.bus_number}
                </div>
              </Typography>
            </Grid>

            <Grid item xs={3} container direction="column" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <LocalAirportRoundedIcon
                  style={{
                    // #5151ff
                    fontSize: "26px",
                    color: "#F01E29",
                    margin: "5px",
                  }}
                />
                <Typography variant="subtitle" className={classes.typography}>
                  {trip?.starting_place}
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
                  {destination?.name}
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
                    اسم السائق{" "}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {driver?.name}
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
                    {trip?.price}
                  </div>
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              justifyContent="flex-end"
              style={{ marginBottom: "16px" }}
            >
              <Grid item xs={6}>
                <Button
                  style={{
                    color: "#F01E29",
                    textDecoration: "underline",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  aria-label="add"
                  onClick={() => setOpenAddDialog(true)}
                >
                  <Typography
                    variant="subtitle"
                    className={classes.typography}
                    color="#F01E29"
                    fontSize="18px"
                  >
                    إضافة شخص جديد
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs={6}>
                {" "}
                <IconButton aria-label="download" onClick={handleDownloadPDF}>
                  <DownloadIcon/>
                </IconButton>
            
              </Grid>
              <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
              >
                <DialogTitle  style={{fontWeight:'bold'}} sx={{ m: 0, p: 2, textAlign: "center" }} id="customized-dialog-title">إنشاء مسافر جديد</DialogTitle>
                <form onSubmit={handleAddPassenger} autoComplete="off">
                  <DialogContent dividers>
                    <TextField
                      label="الاسم"
                      value={newPassenger.name}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          name: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                    />
                    <TextField
                      label="العمر"
                      type="number"
                      value={newPassenger.age}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          age: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.age}
                      helperText={validationErrors.age}
                    />
                    <TextField
                      label="الرقم"
                      type="number"
                      value={newPassenger.mobile_number}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          mobile_number: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.mobile_number}
                      helperText={validationErrors.mobile_number}
                    />{" "}
                    <TextField
                      label="العنوان"
                      value={newPassenger.address}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          address: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.address}
                      helperText={validationErrors.address}
                    />
                    <TextField
                      label="الجنسية"
                      value={newPassenger.nationality}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          nationality: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      error={!!validationErrors.nationality}
                      helperText={validationErrors.nationality}
                    />
                    <Autocomplete
                      options={availableSeatNumber}
                      getOptionLabel={(option) => option.toString()}
                      isOptionEqualToValue={(option, value) =>
                        option.seat_number === value.seat_number
                      }
                      // value={newPassenger.seat_number}
                      onChange={(event, newValue) => {
                        setNewPassenger((prevPassenger) => ({
                          ...prevPassenger,
                          seat_number: newValue,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="رقم المقعد"
                          style={{ marginTop: "20px", width: "300px" }}
                          error={!!validationErrors.seat_number}
                          helperText={validationErrors.seat_number}
                        />
                      )}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={() => setOpenAddDialog(false)}>
                      إلغاء
                    </Button>
                    <Button variant="contained"  style={{marginLeft:'15px'}} type="submit" color="primary">
                      إضافة مسافر
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Grid>

            {/* Table */}
            <Grid item xs={12}>
              <Table ref={contentRef}>
                {orders?.length > 0 && (
                  <TableHead
                    sx={{
                      backgroundColor: "#EBE6E4",
                      "& .MuiTableCell-head": {
                        letterSpacing: "normal !important",

                        fontWeight: "600",
                        fontSize: "22px",
                        color: "#F01E29",
                        width: `${100 / gridHeaders.length + 1}%`,
                        textAlign: "center",
                      },
                    }}
                  >
                    <TableRow>
                      {gridHeaders?.map((header, headerIndex) => (
                        <TableCell
                          key={headerIndex}
                          sx={{
                            width: `${100 / (gridHeaders.length + 1)}%`,
                            letterSpacing: "normal !important",
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {orders?.map((order, index) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        letterSpacing: "normal !important",

                        backgroundColor:
                          index % 2 === 0 ? "background.paper" : "#EBE6E4",
                        "& .MuiTableCell-root": {
                          width: `${100 / gridHeaders.length}%`,
                          textAlign: "center",
                        },
                      }}
                    >
                      {gridHeaders?.map((header, headerIndex) => (
                        <TableCell key={headerIndex}>
                          {header === "الاسم" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                              sx={{ letterSpacing: "normal !important" }}
                            >
                              {order.name}
                            </Typography>
                          )}
                          {header === "العمر" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {order.age}
                            </Typography>
                          )}
                          {header === "الرقم" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {order.mobile_number}
                            </Typography>
                          )}
                          {header === "العنوان" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                              sx={{ letterSpacing: "normal !important" }}
                            >
                              {order.address}
                            </Typography>
                          )}
                          {header === "الجنسية" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                              sx={{ letterSpacing: "normal !important" }}
                            >
                              {order.nationality}
                            </Typography>
                          )}
                          {header === "رقم المقعد" && (
                            <Typography
                              variant="subtitle"
                              className={classes.Typography}
                            >
                              {order.seat_number}
                            </Typography>
                          )}
                          <div ref={excludedRef}>
                            {header === " " && (
                              <IconButton
                                aria-label="Edit"
                                onClick={() => handleUpdatePassenger(order)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </div>
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
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد أنك تريد حذف هذه الرحلة؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      <PassengerEdit
        open={selectedPassenger !== null}
        onClose={handleCloseEditModal}
        order={selectedPassenger}
      />
      {isPassengerAdded && (
        <Snackbar
          open={isPassengerAdded}
          autoHideDuration={6000}
          onClose={() => setIsPassengerAdded(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setIsPassengerAdded(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
           تم إضافة المٌسافر بنجاح
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
    </div>
  );
};

export default TripsDetails;
