import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ID from "../../../assets/reservation/ID.jpeg";
import sec from "../../../assets/reservation/sec.jpg";
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
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  fetchDestinations,
  RejectShipRequest,
  acceptShipRequest,
  fetchRequestsDetails,
} from "../../../api/Ship";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const ShipRequstDetails = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
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

  const {
    isLoading,
    isError,
    data: rqustsDetails,
  } = useQuery(["rqustsDetails", id], () => fetchRequestsDetails(id));

  const { data: destinationsData } = useQuery(
    "destinations",
    fetchDestinations
  );
  const requestAcceptMutation = useMutation(acceptShipRequest, {
    onSuccess: (data) => {
      console.log("accept success:", data);
      queryClient.invalidateQueries("rqustsDetails");
      navigate("/dashboard/الشحن/"); // Navigate to the new page
    },
  });
  const handleAccept = async (id) => {
    try {
      await requestAcceptMutation.mutateAsync(id);
      // Optionally, you can display a success message or update the UI
    } catch (error) {
      console.error("Error ending reservation:", error);
      // Handle the error, e.g., display an error message
    }
  };
  const RejectRequestsMutation = useMutation(RejectShipRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("rqustsDetails");
      navigate("/dashboard/الشحن/"); // Navigate to the new page
    },
    onError: (error) => {
      console.error("Error deleting reservation:", error);
      alert(
        "An error occurred while deleting the reservation. Please try again later."
      );
    },
  });

  const handleConfirmDelete = () => {
    RejectRequestsMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  const handleRefuse = (request) => {
    setConfirmDeleteId(request?.id); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };

  const handleItemClick = (item) => {
    if (item.pdf_url) {
      window.open(item.pdf_url, "_blank");
    } else {
      setCurrentItem(item);
      setIsImageModalOpen(true);
    }
  };

  useEffect(() => {
    if (destinationsData) {
      setDestinations(destinationsData);
    }
  }, [destinationsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching request details.</div>;
  }

  if (!rqustsDetails) {
    return <div>Request not found.</div>;
  }

  const request = rqustsDetails.data.shipmentRequest;
  const stuff = rqustsDetails.data.shipmentRequest.shipment_foodstuffs.map((item) => item.foodstuff.stuff);  console.log(request);

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
      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr 2fr" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Link
            to={`/dashboard/الشحن/`}
            style={{
              color: "rgb(81, 81, 255)",
              textDecoration: "none",
              fontSize: "40px",
              marginRight: "380px",
            }}
          >
            <ArrowBackIcon style={{ fontSize: "40px" }} />
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            to={`/dashboard/الشحن/ship_trips/${request.shipment_trip_id}`}
            style={{ color: "rgb(81, 81, 255)", textDecoration: "none" }}
          >
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
              الوجهة:
            </span>
            {
              destinations.find(
                (dest) => dest.destination_id === request.destination_id
              )?.name
            }
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
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
                  xs={4}
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
                      الاسم :
                    </div>{" "}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {request.user.name}
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
                  <Typography variant="subtitle" className={classes.Typography}>
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
                      {request.user.age}
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
                  <Typography variant="subtitle" className={classes.Typography}>
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
                      {request.user.mobile_number}
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
                  <Typography variant="subtitle" className={classes.Typography}>
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
                      {request.user.address}
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
                  <Typography variant="subtitle" className={classes.Typography}>
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
                      {request.user.nationality}
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
                  <Typography variant="subtitle" className={classes.Typography}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#5151ff",
                        fontWeight: "bold",
                      }}
                    >
                      الوزن:
                    </div>{" "}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {request.weight}
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
                  <Typography variant="subtitle" className={classes.Typography}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#5151ff",
                        fontWeight: "bold",
                      }}
                    >
                      المواد الغذائية:
                    </div>{" "}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
      {stuff.join(", ")}
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
                  <ImageList sx={{ width: "auto", height: "auto" }}>
                    <ImageListItem key={`ID-${request.image_of_ID}`}>
                      <img src={ID} alt="ID" loading="lazy" />

                      <ImageListItemBar
                        title="الهوية الشخصية"
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label="info about ID"
                            onClick={() =>
                              handleItemClick({
                                image_url: `http://161.35.27.202${request.image_of_ID}`,
                                pdf_url: `http://161.35.27.202${request.image_of_ID}`,
                              })
                            }
                          >
                            <InfoIcon className={classes.pdfLink} />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                    <ImageListItem
                      key={`commercial_register-${request.image_of_commercial_register}`}
                    >
                      <img src={sec} alt="ID" loading="lazy" />
                      <ImageListItemBar
                        title="سجل تجاري"
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label="info about Passport"
                            onClick={() =>
                              handleItemClick({
                                image_url: `http://161.35.27.202${request.image_of_commercial_register}`,
                                pdf_url: `http://161.35.27.202${request.image_of_commercial_register}`,
                              })
                            }
                          >
                            <InfoIcon className={classes.pdfLink} />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                    <ImageListItem
                      key={`industrial_register-${request.image_of_industrial_register}`}
                    >
                      <img src={sec} alt="industrial_register" loading="lazy" />
                      <ImageListItemBar
                        title="سجل صناعي"
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label="info about industrial_register"
                            onClick={() =>
                              handleItemClick({
                                image_url: `http://161.35.27.202${request.image_of_industrial_register}`,
                                pdf_url: `http://161.35.27.202${request.image_of_industrial_register}`,
                              })
                            }
                          >
                            <InfoIcon className={classes.pdfLink} />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                    <ImageListItem
                      key={`customs_declaration-${request.image_of_customs_declaration}`}
                    >
                      <img
                        // src={`http://161.35.27.202${request.image_of_customs_declaration}`}
                        src={sec}
                        alt="المواد الغذائية"
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title="المواد الغذائية"
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label="info about Visa"
                            onClick={() =>
                              handleItemClick({
                                image_url: `http://161.35.27.202${request.image_of_customs_declaration}`,
                                pdf_url: `http://161.35.27.202${request.image_of_customs_declaration}`,
                              })
                            }
                          >
                            <InfoIcon className={classes.pdfLink} />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                    <ImageListItem
                      key={`Visa-${request.image_of_pledge}`}
                      sx={{ marginLeft: "20" }}
                    >
                      <img src={sec} alt="تعهد" loading="lazy" />
                      <ImageListItemBar
                        title="تعهد"
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label="info about Visa"
                            onClick={() =>
                              handleItemClick({
                                image_url: `http://161.35.27.202${request.image_of_pledge}`,
                                pdf_url: `http://161.35.27.202${request.image_of_pledge}`,
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
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          maxWidth: "90%",
                          maxHeight: "90%",
                          bgcolor: "background.paper",
                          boxShadow: 24,
                          p: 4,
                        }}
                      >
                        <img
                          src={currentItem.image_url}
                          alt="Enlarged View"
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      </Box>
                    </Modal>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </div>
        </Grid>
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
        <Grid item xs={12} container direction="column" alignItems="center">
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
              {request?.price}{" "}
            </div>
          </Typography>
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          {/* Accept button */}
          <Button
            variant="contained"
            onClick={() => handleAccept(request.id)}
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
            onClick={() => handleRefuse(request)}
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
          <DialogContentText>هل أنت متأكد من رفض هذا الطلب ؟</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShipRequstDetails;
