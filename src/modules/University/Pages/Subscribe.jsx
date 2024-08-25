import React, { useState } from "react";

import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import {
  getSubscribe,
  handleApprove,
  handleReject,
} from "../../../api/university";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Subscribe = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  const {
    isLoading,

    data: fetchSubscribe,
  } = useQuery("sub", getSubscribe, {
    // staleTime: 60000, // Cache data for 1 minute
    // cacheTime: 300000, // Keep data in cache for 5 minutes
  });
  //   console.log(fetchSubscribe.data.user)

  const SubscribeAcceptMutation = useMutation(handleApprove, {
    onSuccess: (data) => {
      console.log("accept success:", data);
      queryClient.invalidateQueries("sub");
      setAcceptSuccess(true);
    },
  });
  const handleAccept = async (id) => {
    try {
      await SubscribeAcceptMutation.mutateAsync(id);
      // Optionally, you can display a success message or update the UI
    } catch (error) {
      console.error("Error ending reservation:", error);
      // Handle the error, e.g., display an error message
    }
  };

  const RejectSubMutation = useMutation(handleReject, {
    onSuccess: () => {
      queryClient.invalidateQueries("sub");
      setDeleteSuccess(true);
    },
  });

  const handleRefuse = (sub) => {
    setConfirmDeleteId(sub); // Set the ID of the driver to be deleted
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    RejectSubMutation.mutate(confirmDeleteId);
    setOpenDeleteDialog(false);
  };

  
  const uniqueSubscribe = Array.from(
    new Map(
      (fetchSubscribe?.data.data || []).map((user) => [user.user?.name, user])
    ).values()
  );
 
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  }
   else if (
    !fetchSubscribe.data ||
    !fetchSubscribe?.data.data ||
    fetchSubscribe?.data.data?.length === 0
  ) {
    content = <p>No Subscription available.</p>;
  } else {
    const filteredSubscribe = fetchSubscribe?.data?.data.filter((user) =>
      user.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    content = (
      <div>
        {filteredSubscribe?.map((sub) => (
          <Grid key={sub.id}>
            <Paper
              sx={{
                p: 2,
                width: "500px!important", // Add !important to override conflicting styles
                minHeight: "100px",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginBottom: "20px",
              }}
            >
              <Grid container spacing={2}>
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
                      <span style={{ color: "#F01E29" }}>الاسم : </span>

                      {sub.user.name}
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
                      <span style={{ color: "#F01E29" }}>الرقم : </span>
                      {sub.user.mobile_number}
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
                      <span style={{ color: "#F01E29" }}>
                        النقاط المُستخدمة :{" "}
                      </span>
                      {sub.used_points}
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
                      <span style={{ color: "#F01E29" }}>
                        السعر بعد الخصم :{" "}
                      </span>
                      {sub.amount}
                    </Typography>
                  </div>
                  <Grid
                    item
                    xs={4}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* Accept button */}
                    <Button
                      variant="contained"
                      onClick={() => handleAccept(sub.id)}
                      sx={{
                        backgroundColor: "cornflowerblue",
                        width: 40,
                        height: 48,
                        marginRight: "20px",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold" }}>
                        موافقة
                      </Typography>
                    </Button>
                    {/* Refuse button */}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRefuse(sub.id)}
                      sx={{
                        backgroundColor: "#F01E29",
                        width: 40,
                        height: 48,
                      }}
                    >
                      <Typography style={{ fontWeight: "bold" }}>
                        رفض
                      </Typography>
                    </Button>
                  </Grid>
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
        طلبات الاشتراك
      </Typography>
      <Autocomplete
        options={uniqueSubscribe}
        getOptionLabel={(option) => option?.user?.name || ""}
        isOptionEqualToValue={(option, value) =>
          option?.user?.name === value?.user?.name
        }
        onChange={(event, value) => setSearchQuery(value?.user.name || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="search by name"
            style={{ marginTop: "20px", width: "300px" }}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        )}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        {acceptSuccess && (
          <Snackbar
            open={acceptSuccess}
            autoHideDuration={6000}
            onClose={() => setAcceptSuccess(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Alert
              onClose={() => setAcceptSuccess(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              تم إضافة اشتراك
            </Alert>
          </Snackbar>
        )}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>تأكيد الرفض</DialogTitle>
          <DialogContent>
            <DialogContentText>متأكد من رفض الطلب ؟</DialogContentText>
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
              تم حذف اشتراك
            </Alert>
          </Snackbar>
        )}
        {content}
      </div>
    </div>
  );
};

export default Subscribe;
