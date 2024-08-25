import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogContentText,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { makeStyles } from "@material-ui/core";
import { useQuery, useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getconfirmReservation,
  confirmReservation,
  deleteReservation,
  searchConfirmReservation,
} from "../../../api/confirmReservation";
import { Link, useNavigate } from "react-router-dom";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const InPrograss = () => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConfirmReservations, setFilteredConfirmReservations] =
    useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [selectedConfirmReservation, setSelectedConfirmReservation] =
    useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const classes = useStyles();

  const {
    isLoading,
    isError,
    data: fetchconfirmReservations,
  } = useQuery("reservations", getconfirmReservation, {
    staleTime: 60000, // Cache data for 1 minute
    cacheTime: 300000, // Keep data in cache for 5 minutes
  });

  const ConfirmMutation = useMutation(confirmReservation, {
    onSuccess: (data) => {
      console.log("confirm success:", data);
      queryClient.invalidateQueries("reservations");
      // navigate("/dashboard/السفر/الرحلات/${}"); // Navigate to the new page
    },
  });

  const handleConfirm = async (reservation_id) => {
    try {
      await ConfirmMutation.mutateAsync(reservation_id);
      // Optionally, you can display a success message or update the UI
    } catch (error) {
      console.error("Error ending reservation:", error);
      // Handle the error, e.g., display an error message
    }
  };

  // useEffect(() => {
  //   if (isLoading) {
  //     setFilteredConfirmReservations([]);
  //   } else if (isError) {
  //     setFilteredConfirmReservations([]);
  //   } else if (fetchconfirmReservations && fetchconfirmReservations.data) {
  //     setFilteredConfirmReservations(fetchconfirmReservations.data);
  //   } else {
  //     setFilteredConfirmReservations([]);
  //   }
  // }, [isLoading, isError, fetchconfirmReservations]);

  // useEffect(() => {
  //   if (fetchconfirmReservations && fetchconfirmReservations.data) {
  //     const filtered = fetchconfirmReservations.data.filter((confirm) =>
  //       (confirm.user.name ?? "")
  //         .toLowerCase()
  //         .includes((searchQuery || "").toLowerCase())
  //     );
  //     setFilteredConfirmReservations(filtered);
  //   } else {
  //     setFilteredConfirmReservations([]);
  //   }
  // }, [searchQuery, fetchconfirmReservations]);

  const uniqueConform = Array.from(
    new Map(
      fetchconfirmReservations?.data.map((reservation) => [
        reservation.user.name,
        reservation,
      ])
    ).values()
  );

  const deleteReservationMutation = useMutation(deleteReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries("reservations");
      setDeleteSuccess(true);
    },
    onError: (error) => {
      console.error("Error deleting reservation:", error);
      alert(
        "An error occurred while deleting the reservation. Please try again later."
      );
    },
  });

  const handleConfirmDelete = () => {
    deleteReservationMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  const handleDeleteResrvation = (reservation) => {
    setConfirmDeleteId(reservation.reservation_id); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };

  if (isLoading) {
    // Render a loading state until the data is fetched
    return <div>Loading...</div>;
  }

  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error fetching reservations.</div>;
  } else if (
    searchQuery &&
    (!fetchconfirmReservations ||
      !fetchconfirmReservations.data ||
      fetchconfirmReservations.data.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchconfirmReservations ||
    !fetchconfirmReservations.data ||
    !fetchconfirmReservations.data ||
    fetchconfirmReservations.data.length === 0
  ) {
    content = <p>No reservations available.</p>;
  } else {
    const filteredConfirmReservations = fetchconfirmReservations.data.filter(
      (confirm) =>
        confirm.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    content = (
      <div>
        {filteredConfirmReservations.map((reservation, index) => (
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
                  {dayjs(reservation.created_at).format("YYYY-MM-DD")}
                </Typography>
              </Grid>
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
                    <PaymentTwoToneIcon style={{ color: "#F01E29" }} />
                  </div>
                  <Typography variant="subtitle" className={classes.Typography}>
                    {reservation.total_price}
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
              </Grid>
              <Grid item >
                 
                  <IconButton
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteResrvation(reservation)}
                    >
                      <DeleteIcon />
                    </IconButton>
                </Grid>
              <Grid
                item
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
               
                <Grid
                  item
                  
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Link
                    to={`/dashboard/السفر/الرحلات/`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                   variant="text"
                      onClick={() => handleConfirm(reservation.reservation_id)}
                     
                    >
                      <Typography
                        className={classes.Typography}
                        style={{ fontSize: "20px"}}
                      >
                        تم التثبيت
                     
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
          options={uniqueConform}
          getOptionLabel={(option) => option.user?.name || ""}
          isOptionEqualToValue={(option, value) =>
            option?.user?.name === value.user.name
          }
          // value={searchConfirmReservation?.user?.name || ""}
          onChange={(event, newValue) => {
            setSelectedConfirmReservation(newValue);
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
      ></div>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>هل أنت متأكد من حذف الطلب؟</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      {deleteSuccess && (
        <Snackbar
          open={deleteSuccess}
          autoHideDuration={6000}
          onClose={() => setDeleteSuccess(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setDeleteSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            تم حذف الطلب
          </Alert>
        </Snackbar>
      )}
      {content}
    </div>
  );
};

export default InPrograss;
