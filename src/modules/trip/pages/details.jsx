import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ID from "../../../assets/reservation/ID.jpeg";
import Passport from "../../../assets/reservation/Syrian_Electronic_Passport.jpg";
import sec from "../../../assets/reservation/sec.jpg";
import visa from "../../../assets/reservation/visa.jpg";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Paper,
  Typography,
  Modal,
  Box,
  Button,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { makeStyles } from "@material-ui/core";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  acceptReservation,
  RejectReservation,
  fetchReservationDetails
} from "../../../api/reservationApi";
const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));


const Details = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    image_url: "",
    pdf_url: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [pdfLink, setPdfLink] = useState("");
  const handlePdfLinkClick = () => {
    window.open(pdfLink, "_blank");
  };

  const reservationAcceptMutation = useMutation(acceptReservation, {
    onSuccess: (data) => {
      console.log("accept success:", data);
      queryClient.invalidateQueries("reservations");
      navigate("/dashboard/السفر/"); // Navigate to the new page
    },
  });
  const handleAccept = async (reservation_id) => {
    try {
      await reservationAcceptMutation.mutateAsync(reservation_id);
      // Optionally, you can display a success message or update the UI
    } catch (error) {
      console.error("Error ending reservation:", error);
      // Handle the error, e.g., display an error message
    }
  };
  const RejectReservationMutation = useMutation(RejectReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries("reservations");
      setDeleteSuccess(true);
      navigate("/dashboard/السفر/"); // Navigate to the new page

    },
    onError: (error) => {
      console.error("Error deleting reservation:", error);
      alert(
        "An error occurred while deleting the reservation. Please try again later."
      );
    },
  });

  const handleConfirmDelete = () => {
    RejectReservationMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  const handleRefuse = (reservation) => {
    setConfirmDeleteId(reservation?.reservation_id); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };


  const {
    isLoading,
    isError,
    data: reservations,
  } = useQuery(["reservations", id], () => fetchReservationDetails(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching reservation details.</div>;
  }

  if (!reservations) {
    return <div>Reservation not found.</div>;
  }
  const handleItemClick = (item) => {
    if (item.pdf_url) {
      window.open(item.pdf_url, '_blank');
    } else {
      setCurrentItem(item);
      setIsImageModalOpen(true);
    }
  };

  const reservation = reservations.data[0];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px",
        overflow: "hidden", // Add this line
      }}
    >
 <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr'}}>
  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <Link to={`/dashboard/السفر/`} style={{     color: "rgb(81, 81, 255)" ,textDecoration: "none", fontSize: '40px' ,marginRight:"280px"}}>
      <ArrowBackIcon style={{fontSize:"40px"}}/>
    </Link>
  </div>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Link to={`/dashboard/السفر/trips/${reservation.trip.trip_id}`} style={{ color: "rgb(81, 81, 255)" , textDecoration: "none" }}>
      <DirectionsBusIcon />
    </Link>
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
        <Grid item xs={4} container direction="column" alignItems="center">
          <Typography variant="subtitle" className={classes.Typography}>
            <span style={{ color: "#5151ff", fontWeight: "bold" }}>
              عدد الأشخاص:
            </span>
            {reservation?.count_of_persons}
          </Typography>
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          <Typography variant="subtitle" className={classes.Typography}>
            <span style={{ color: "#5151ff", fontWeight: "bold" }}>
              الوجهة:
            </span>
            {reservation?.trip.destination_name}
          </Typography>
        </Grid>
       
      </Grid>
      <Grid container spacing={4}>
        {reservation?.orders.map((order, index) => (
          <Grid item xs={12} key={order.order_id}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "20px",
              }}
            >
              <Paper
                sx={{
                  p: 4,
                  width: "700px",
                  minHeight: "400px",
                  marginBottom: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Grid container spacing={4}>
                  <Grid
                    item
                    xs={12}
                    container
                    direction="column"
                    alignItems="center"
                    // sx={{ marginBottom: "20px" }}
                  >
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                      style={{
                        fontWeight: "bold",
                        color: "#F01E29",
                      }}
                    >
                      {`طلب ${index + 1}`}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    container
                    direction="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "#5151ff",
                          fontWeight: "bold",
                        }}
                      >
                        الاسم :
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {order.order_name}
                      </div>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    container
                    direction="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "#5151ff",
                          fontWeight: "bold",
                        }}
                      >
                        العمر:
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {order.order_age}
                      </div>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    container
                    direction="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "#5151ff",
                          fontWeight: "bold",
                        }}
                      >
                        الرقم:
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {order.order_mobile_number}
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
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "#5151ff",
                          fontWeight: "bold",
                        }}
                      >
                        السكن الحالي:
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {order.order_address}
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
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "#5151ff",
                          fontWeight: "bold",
                        }}
                      >
                        الجنسية:
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {order.order_nationality}
                      </div>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    container
                    direction="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle"
                      className={classes.Typography}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "#5151ff",
                          fontWeight: "bold",
                        }}
                      >
                        رقم المقعد :
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {order.seat_number}
                      </div>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ImageList sx={{ width: 450, height: "auto" }}>
                      <ImageListItem key={`ID-${order.order_id}`}>
                        <img
                          src={ID}
                          alt="ID"
                          loading="lazy"
                        />

                        <ImageListItemBar
                          title="ID"
                          actionIcon={
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label="info about ID"
                              onClick={() => 
                                 handleItemClick({
                                image_url: `http://161.35.27.202${order.order_image_of_ID}`,
                                pdf_url:`http://161.35.27.202${order.order_image_of_ID}`,
                              })}
                            >
                              <InfoIcon className={classes.pdfLink} />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                      <ImageListItem key={`Passport-${order.order_id}`}>
                      <img
                          src={Passport}
                          alt="ID"
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title="Passport"
                          actionIcon={
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label="info about Passport"
                              onClick={() =>
                                handleItemClick({
                                  image_url: `http://161.35.27.202${order.order_image_of_passport}`,
                                  pdf_url: `http://161.35.27.202${order.order_image_of_passport}`,
                                })
                              }
                            >
                              <InfoIcon className={classes.pdfLink} />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                      <ImageListItem
                        key={`Security Clearance-${order.order_id}`}
                      >
                        <img
                          src={sec}
                          alt="Security Clearance"
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title="Security Clearance"
                          actionIcon={
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label="info about Security Clearance"
                              onClick={() =>
                                handleItemClick({
                                  image_url: `http://161.35.27.202${order.order_image_of_security_clearance}`,
                                  pdf_url: `http://161.35.27.202${order.order_image_of_security_clearance}`,
                                })
                              }
                            >
                              <InfoIcon className={classes.pdfLink} />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                      <ImageListItem key={`Visa-${order.order_id}`}>
                        <img
                          src={visa}
                          alt="Visa"
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title="Visa"
                          actionIcon={
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              aria-label="info about Visa"
                              onClick={() =>
                                handleItemClick({
                                  image_url: `http://161.35.27.202${order.order_image_of_visa}`,
                                  pdf_url:`http://161.35.27.202${order.order_image_of_visa}`,
                                })
                              }
                            >
                              <InfoIcon className={classes.pdfLink} />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    </ImageList>
                    {isImageModalOpen && (
    <Modal
      open={isImageModalOpen}
      onClose={() => setIsImageModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90%',
          maxHeight: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <img
          src={currentItem.image_url}

          alt="Enlarged View"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
  
      </Box>
    </Modal>
  )}
                  </Grid>
                </Grid>

                
             
              </Paper>
              
            </div>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        spacing={4}
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
         <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <Typography variant="subtitle" className={classes.Typography}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#5151ff",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      التكلفة الكلية :{" "}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#F01E29",
                        fontWeight: "bold",
                      }}
                    >
                      {reservation?.total_price}{" "}
                    </div>
                  </Typography>
                </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          {/* Accept button */}
          <Button
            variant="contained"
            onClick={() => handleAccept(reservation.reservation_id)}
            sx={{ backgroundColor: "cornflowerblue", width: 200, height: 48 }}
          >
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >
              {" "}
              موافقة{" "}
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          {/* Refuse button */}
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRefuse(reservation)}
            sx={{ backgroundColor: "#F01E29", width: 200, height: 48 }}
          >
            <Typography
              style={{
                fontWeight: "bold",
              }}
            >
              {" "}
              رفض{" "}
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأكيد الرفض</DialogTitle>
        <DialogContent>
          <DialogContentText>
           متأكد من رفض الطلب ؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error">
            رفض
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
            Request Rejected successfully
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default Details;
