import React, { useState } from "react";
import * as Yup from "yup";
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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@material-ui/core";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getUser ,deleteUser } from "../../../api/UserApi";
import DangerousIcon from "@mui/icons-material/Dangerous";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const Users = () => {
  const classes = useStyles();
  const gridHeaders = ["الاسم", "العمر", "الرقم", "العنوان", "البريد الإلكتروني"," "];
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: fetchUsers,
  } = useQuery("users", getUser , {
    staleTime: 60000, // Cache data for 1 minute
    cacheTime: 300000, // Keep data in cache for 5 minutes
  });

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setDeleteSuccess(true);
    },
  });

  const handleDeleteUser = (user) => {
    setConfirmDeleteId(user.id); // Set the ID of the user to be deleted
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    deleteUserMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else if (
    !fetchUsers ||
    !fetchUsers.data ||
    fetchUsers.data.users.length === 0
  ) {
    content = <p>No users available.</p>;
  } else {
    const users = fetchUsers.data.users;
    content = (
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "120vh",
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
              {gridHeaders?.map((header, headerIndex) => (
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
            {users?.map((user, index) => (
              <TableRow
                key={user.id}
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
                        {user.name}
                      </Typography>
                    )}
                    {header === "العمر" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {user.age}
                      </Typography>
                    )}
                    {header === "الرقم" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {user.mobile_number}
                      </Typography>
                    )}
                    {header === "العنوان" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {user.address}
                      </Typography>
                    )}
                    {header === "البريد الإلكتروني" && (
                      <Typography
                        variant="subtitle"
                        className={classes.Typography}
                      >
                        {user.email}
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
                            <DangerousIcon
                              onClick={() => handleDeleteUser(user)}
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
        }}
      >
        المُستخدمين{" "}
      </Typography>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle  sx={{ m: 0, p: 2, textAlign: "center" }} id="customized-dialog-title">تأكيد الحذف</DialogTitle>
        <DialogContent >
          <DialogContentText>
            هل أنت متأكد أنك تريد حذف هذا المُستخدم؟
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
           تم حذف المُستخدم بنجاح
          </Alert>
        </Snackbar>
      )}
      {content}
    </div>
  );
};

export default Users;
