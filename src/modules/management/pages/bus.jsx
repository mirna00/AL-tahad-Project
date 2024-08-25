import React, { useState, useEffect } from "react";
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
  Radio,
  ImageList,
  ImageListItem,
} from "@mui/material";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonBase from "@mui/material/ButtonBase";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  getBus,
  deleteBus,
  addBus,
  addImageOfSeats,
  allImageOfSeats,
} from "../../../api/busApi";

const validationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required("Image is required")
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value) return false;
      const supportedFormats = ["jpeg", "png"];
      const fileExtension = value.name.split(".").pop().toLowerCase();
      return supportedFormats.includes(fileExtension);
    }),
  number_of_seats: Yup.number()
    .required("Please enter the number of seats")
    .positive("Number of seats must be a positive number")
    .integer("Number of seats must be an integer")
    .max(99, "Number of seats must be two digits or less"),
  bus_number: Yup.number()
    .required("Please enter the bus number")
    .integer("Bus number must be an integer")
    .min(100000, "Bus number must be 6 digits")
    .max(999999, "Bus number must be 6 digits"),
  type: Yup.string().required("Please enter the bus type"),
});
const Bus = () => {
  const [formData, setFormData] = useState({
    image: null,
    type: "",
    bus_number: "",
    number_of_seats: "",
    image_of_buse_id: [],
  });

  const [img, setImg] = useState({
    image: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openaddImage, setOpenAddImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isBusAdded, setIsBusAdded] = useState(false);
  const [isImageAdded, setImageAdded] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageShow, setimageShow] = useState(null);

  
  const queryClient = useQueryClient();
  const [selectedImageId, setSelectedImageId] = useState(null);

  const {
    isLoading,
    isError,
    data: buses,
  } = useQuery("buses", getBus, {
    staleTime: 60000, // Cache data for 1 minute
    cacheTime: 300000, // Keep data in cache for 5 minutes
    onError: (error) => {
      // Handle the error, e.g., set an error state or display an error message
      console.error("Error fetching buses:", error);
    },
  });

  const { data: BusImage } = useQuery("imgBus", allImageOfSeats);

  const resetForm = () => {
    setFormData({
      image: null,
      image_of_buse_id: null,
      type: "",
      bus_number: "",
      number_of_seats: "",
    });
    setimageShow(null); // Reset the image preview
    // setImagePreview([]); // 
  };

  const { mutate } = useMutation(addBus, {
    onSuccess: () => {
      queryClient.invalidateQueries("buses");
      
      setIsBusAdded(true);
      // setSnackbarMessage("Bus added successfully");
      // setSnackbarOpen(true);
      setOpenAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error adding bus:", error);
      if (error.name === "ValidationError") {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrors);
        setBackendErrors({});
      } else if (typeof error === "object" && error !== null) {
        const backendErrorsArray = Object.entries(
          error.response.data.errors
        ).map(([field, message]) => ({
          field,
          message,
        }));
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

  const addimgSeat = useMutation(addImageOfSeats, {
    onSuccess: (newImage) => {
      // Update state with the new image
     
      // Optionally, reset preview and close dialog
      setImagePreview(URL.createObjectURL(img.image));
      setOpenAddImage(false);
      setImg({ image: null });
      setImageAdded(true)
    },
    onError: (error) => {
      console.error("Error adding bus:", error);
    },
  });

  const handleAddSimg = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", img.image);
      await addimgSeat.mutateAsync(formData);
      event.target.reset(); // Reset the file input field
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleChangeImage = (event) => {
    const selectedImage = event.target.files[0];
    setImg({ image: selectedImage });

    // Set the preview URL for the selected image
    if (selectedImage) {
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const deleteBusMutation = useMutation(deleteBus, {
    onSuccess: () => {
      queryClient.invalidateQueries("buses");
      setDeleteSuccess(true);
    },
  });

  const handleDeleteBus = (bus) => {
    setConfirmDeleteId(bus.id); // Set the ID of the bus to be deleted
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    deleteBusMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  const handleImageClick = (imageId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      image_of_buse_id: imageId,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };
  const handleClose = () => {
    setOpenAddDialog(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, files } = event.target;
  
    if (name === "image" && files.length > 0) {
      const selectedImage = files[0];
      setFormData((prevData) => ({
        ...prevData,
        image: selectedImage,
      }));
      
      // Set the image preview for the selected image
      setimageShow(URL.createObjectURL(selectedImage));
    } else if (name === "image_of_buse_id" && files.length > 0) {
      const newImageArray = Array.from(files).map((file, index) => ({
        id: index,
        image: file,
      }));
      setFormData((prevData) => ({
        ...prevData,
        image_of_buse_id: newImageArray,
      }));
      
      // Optionally, set previews for multiple images
      const previewUrls = newImageArray.map((file) => URL.createObjectURL(file.image));
      setimageShow(previewUrls); // Assume `setImagePreviews` handles multiple previews
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: event.target.value,
      }));
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("image", formData.image);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("bus_number", formData.bus_number);
    formDataToSend.append("number_of_seats", formData.number_of_seats);
    formDataToSend.append("image_of_buse_id", formData.image_of_buse_id);

    try {
      const data = await mutate(formDataToSend);
      setValidationErrors({});
      setBackendErrors({});
    } catch (error) {
      // Handle errors in the onError callback of the useMutation hook
    }
  };
  if (isLoading) {
    // Render a loading state until the data is fetched
    return <div>Loading...</div>;
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
        الباصات
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        <Button onClick={() => setOpenAddImage(true)}>صورة توضيحية</Button>

        <Dialog open={openaddImage} onClose={() => setOpenAddImage(false)}>
          <DialogTitle >إضافة صور توضيحية جديدة</DialogTitle>
          <form onSubmit={handleAddSimg}>
            <DialogContent>
              <input
                type="file"
                id="image"
                onChange={handleChangeImage}
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{
                    maxWidth: "100%",
                    marginTop: "10px",
                    display: "block",
                  }}
                />
              )}
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenAddImage(false)}>إلغاء</Button>
              <Button type="submit">إضافة</Button>
              
            </DialogActions>
          </form>
        </Dialog>

        {buses.length ? (
          buses.map((bus) => (
            <div key={bus.id} style={{ marginBottom: "20px" }}>
              <Paper
                sx={{
                  p: 2,
                  width: "500px!important", // Add !important to override conflicting styles
                  minHeight: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase sx={{ width: 128, height: 128 }}>
                      <img
                        src={`http://161.35.27.202${bus.image}`}
                        alt="Bus"
                        style={{ width: "100%" }}
                      />
                    </ButtonBase>
                  </Grid>
                  <Grid
                    item
                    xs
                    container
                    direction="column"
                    justifyContent="center"
                    spacing={2}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Cairo",
                          fontSize: 15,
                        }}
                      >
                        <span style={{ color: "#F01E29" }}>النوع: </span>
                        {bus.type}
                      </Typography>
                      <Typography
                        variant="body2"
                        gutterBottom
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Cairo",
                          fontSize: 15,
                        }}
                      >
                        <span style={{ color: "#F01E29" }}>رقم اللوحة: </span>
                        {bus.bus_number}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Cairo",
                          fontSize: 15,
                        }}
                      >
                        <span style={{ color: "#F01E29" }}>عدد الكراسي: </span>
                        {bus.number_of_seats}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <IconButton
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteBus(bus)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          ))
        ) : (
          <Typography variant="body2">لا يوجد باصات</Typography>
        )}
      </div>

      {/* for add bus */}
      <Button onClick={() => setOpenAddDialog(true)}>إضافة باص</Button>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle
         style={{fontWeight:'bold'}} sx={{ m: 0, p: 2, textAlign: "center" }} id="customized-dialog-title"
        
        >
          إضافة باص جديد
        </DialogTitle>

        <form onSubmit={handleSubmit} autoComplete="off">
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ margin: "20px" }}
          >
            <Box display="flex" flexDirection="row" gap={2}>
              <Box>
                <TextField
                  label="النوع"
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  error={!!validationErrors.type}
                  helperText={validationErrors.type}
                />
              </Box>
              <Box>
                <TextField
                  label="عدد الكراسي"
                  type="number"
                  id="number_of_seats"
                  name="number_of_seats"
                  value={formData.number_of_seats}
                  onChange={handleChange}
                  error={!!validationErrors.number_of_seats}
                  helperText={validationErrors.number_of_seats}
                />
              </Box>
              <Box>
                <TextField
                  label="رقم اللوحة"
                  type="number"
                  id="bus_number"
                  name="bus_number"
                  value={formData.bus_number}
                  onChange={handleChange}
                  error={!!validationErrors.bus_number}
                  helperText={validationErrors.bus_number}
                />
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <label htmlFor="image">Image</label>
                
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  
                
                />

{imageShow && (
                <img
                  src={imageShow}
                  alt="imageShow"
                  style={{
                    maxWidth: "100%",
                    marginTop: "10px",
                    display: "block",
                  }}
                />
              )}
              </Box>

              <Box>
                {isLoading ? (
                  <CircularProgress />
                ) : isError ? (
                  <div>Error loading bus images</div>
                ) : (
                  <Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <label htmlFor="image_of_buse_id">Image of Bus ID</label>
                    </Box>
                    <Grid container spacing={2}>
                      {BusImage?.data.imageBus?.map((image) => (
                        <Grid item xs={3} key={image.id}>
                          <img
                            src={`http://161.35.27.202${image.image}`}
                            alt={`Bus ID ${image.id}`}
                            style={{
                              cursor: "pointer",
                              maxWidth: "100%",
                              height: "auto",
                              border:
                                formData.image_of_buse_id === image.id
                                  ? "2px solid blue"
                                  : "none",
                            }}
                            onClick={() => handleImageClick(image.id)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end" // Center horizontally
              alignItems="center" // Center vertically (if needed)
              marginTop={2} // Optional: add some space above
            >
              <Button
                onClick={handleClose}
                variant="contained"
                style={{ marginRight: "10px" }}
              >
                إلغاء
              </Button>
              <Button type="submit" variant="contained">
                إضافة باص
              </Button>
            </Box>
          </Box>
        </form>
      </Dialog>
      {/* for delete  */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogContent>
          <DialogContentText>هل أنت متأكد من حذف هذا الباص؟</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button color="error" onClick={confirmDelete}>
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
            تم حذف الباص بنجاح
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
      {isBusAdded && (
        <Snackbar
          open={isBusAdded}
          autoHideDuration={6000}
          onClose={() => setIsBusAdded(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setIsBusAdded(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            تم إضافة الباص 
          </Alert>
        </Snackbar>
      )}
      {isImageAdded && (
        <Snackbar
          open={isImageAdded}
          autoHideDuration={6000}
          onClose={() => setImageAdded(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setImageAdded(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            تم إضافة صورة جديدة
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default Bus;
