import React, { useState, useEffect } from "react";
import * as yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
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
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  TableHead,
  TableBody,
  Table,
} from "@mui/material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { makeStyles } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getDriver,
  addDriver,
  updateDriver,
  deleteDriver,
  searchDriver,
} from "../../../api/DriverApi";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DriverEditModal from "./DriverEdit";

// const passwordRules = /^(?=.*[A-Z]).{5,}$/;

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .required("Required"),
  age: yup
    .number()
    .min(18, "Age must be at least 18")
    .max(99, "Age must be 99 or less")
    .required("Required"),
  mobile_number: yup
    .string()
    .matches(/^\d+$/, "Please enter a valid phone number")
    .required("Please enter a phone number"),
  address: yup.string().required("Please enter an address"),
  email: yup
    .string()
    .email("Invalid email")
    .matches(
      /^[A-Za-z0-9._%+-]+@gmail\.com$/,
      "Email must be a valid @gmail.com address"
    )
    .required("Please enter an email"),
  password: yup.string().min(5).required("Required"),
});
const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
  iconButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
  iconButton: {
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  },
}));

const Drivers = () => {
  const classes = useStyles();
  const gridHeaders = ["الاسم", "العمر", "الرقم", "العنوان", "Email", " "];
  const [newDriver, setNewDriver] = useState({
    name: "",
    age: "",
    mobile_number: "",
    address: "",
    email: "",
    password: "",
    role: "Driver",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDriverAdded, setIsDriverAdded] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: fetchdrivers,
  } = useQuery("drivers", getDriver, {
    staleTime: 60000, // Cache data for 1 minute
    cacheTime: 300000, // Keep data in cache for 5 minutes
  });

  const addDriverMutation = useMutation(addDriver, {
    onSuccess: (data) => {
      console.log("Add driver success:", data);
      queryClient.invalidateQueries("drivers");
      setIsDriverAdded(true);
    },
  });

  const deleteDriverMutation = useMutation(deleteDriver, {
    onSuccess: () => {
      queryClient.invalidateQueries("drivers");
      setDeleteSuccess(true);
    },
  });

  const uniqueDriver = Array.from(
    new Map(
      fetchdrivers?.data?.drivers.map((driver) => [driver?.name, driver])
    ).values()
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(newDriver, { abortEarly: false });
      const addedDriver = await addDriverMutation.mutateAsync(newDriver);

      setNewDriver({
        name: "",
        age: "",
        mobile_number: "",
        address: "",
        email: "",
        password: "",
        role: "Driver",
      });
      setValidationErrors({});
      setBackendErrors({});
      setOpenAddDialog(false);
      return addedDriver;
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
        const backendErrorsArray = Object.entries(error).map(
          ([field, message]) => ({
            field,
            message,
          })
        );
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
  const handleDeleteDriver = (driver) => {
    setConfirmDeleteId(driver.id); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };

  const handleUpdateDriver = (driver) => {
    setSelectedDriver(driver);
  };

  const handleCloseEditModal = () => {
    setSelectedDriver(null);
  };

  const handleConfirmDelete = () => {
    deleteDriverMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };
  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else if (
    searchQuery &&
    (!fetchdrivers ||
      !fetchdrivers.data ||
      !fetchdrivers.data.drivers ||
      fetchdrivers.data.drivers.length === 0)
  ) {
    content = <p>No search results available.</p>;
  } else if (
    !fetchdrivers ||
    !fetchdrivers.data ||
    !fetchdrivers.data.drivers ||
    fetchdrivers.data.drivers.length === 0
  ) {
    content = <p>No driver available.</p>;
  } else {
    const filteredDrivers = fetchdrivers.data.drivers.filter((driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    content = (
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "130vh",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          marginTop: "32px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
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
          <TableBody>
            {filteredDrivers.map((driver, index) => (
              <TableRow
                key={driver.id}
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
                        {driver.name}
                      </Typography>
                    )}
                    {header === "العمر" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {driver.age}
                      </Typography>
                    )}
                    {header === "الرقم" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {driver.mobile_number}
                      </Typography>
                    )}
                    {header === "العنوان" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {driver.address}
                      </Typography>
                    )}
                    {header === "Email" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {driver.email}
                      </Typography>
                    )}
                    {header === " " && (
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <IconButton>
                            <EditIcon
                              onClick={() => handleUpdateDriver(driver)}
                            />
                          </IconButton>
                          <IconButton>
                            <DangerousIcon
                              onClick={() => handleDeleteDriver(driver)}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "160px",
      }}
    >
      <Typography
        variant="h1"
        style={{
          color: "#282828",
          fontFamily: "Cairo",
          fontWeight: "bold",
          fontSize: "28px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        السائقين
      </Typography>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <Autocomplete
          options={uniqueDriver}
          getOptionLabel={(option) => option?.name || ""}
          isOptionEqualToValue={(option, value) => option?.name === value?.name}
          onChange={(event, value) => setSearchQuery(value?.name || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="الاسم"
              style={{ marginTop: "20px", width: "300px" }}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          )}
        />
      </div>

      <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
        سائق جديد
      </Button>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>إنشاء حساب سائق جديد</DialogTitle>
        <form onSubmit={handleAddDriver} autoComplete="off">
          <DialogContent>
            <TextField
              label="الاسم"
              type="text"
              value={newDriver.name}
              onChange={(e) =>
                setNewDriver({ ...newDriver, name: e.target.value })
              }
              fullWidth
              margin="normal"
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              label="العمر"
              type="number"
              value={newDriver.age}
              onChange={(e) =>
                setNewDriver({ ...newDriver, age: e.target.value })
              }
              fullWidth
              margin="normal"
              error={!!validationErrors.age}
              helperText={validationErrors.age}
            />
            <TextField
              label="الرقم"
              type="number"
              value={newDriver.mobile_number}
              onChange={(e) =>
                setNewDriver({ ...newDriver, mobile_number: e.target.value })
              }
              fullWidth
              margin="normal"
              error={
                !!validationErrors.mobile_number ||
                !!backendErrors.mobile_number
              }
              helperText={
                validationErrors.mobile_number
                  ? validationErrors.mobile_number
                  : backendErrors.mobile_number
              }
            />
            <TextField
              label="العنوان"
              type="text"
              value={newDriver.address}
              onChange={(e) =>
                setNewDriver({ ...newDriver, address: e.target.value })
              }
              fullWidth
              margin="normal"
              error={!!validationErrors.address}
              helperText={validationErrors.address}
            />
            <TextField
              label="Email"
              type="email"
              value={newDriver.email}
              onChange={(e) =>
                setNewDriver({ ...newDriver, email: e.target.value })
              }
              fullWidth
              margin="normal"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />

            <TextField
              label="كلمة السر"
              value={newDriver.password}
              onChange={(e) =>
                setNewDriver({ ...newDriver, password: e.target.value })
              }
              fullWidth
              margin="normal"
              type="password"
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>إلغاء</Button>
            <Button type="submit" color="primary">
              إضافة السائق
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد أنك تريد حذف هذا السائق؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="primary">
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
            Driver deleted successfully
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
      {isDriverAdded && (
        <Snackbar
          open={isDriverAdded}
          autoHideDuration={6000}
          onClose={() => setIsDriverAdded(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setIsDriverAdded(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Driver Added successfully
          </Alert>
        </Snackbar>
      )}
      <DriverEditModal
        open={selectedDriver !== null}
        onClose={handleCloseEditModal}
        driver={selectedDriver}
      />
      {content}
    </div>
  );
};

export default Drivers;
