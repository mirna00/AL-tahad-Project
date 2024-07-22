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

import { makeStyles } from "@material-ui/core";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getUser } from "../../../api/UserApi";

const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },
}));

const Users = () => {
  const classes = useStyles();
  const gridHeaders = ["الاسم", "العمر", "الرقم", "العنوان", "Email"];


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
            {users?.map((driver, index) => (
              <TableRow
                key={index}
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

      {content}
    </div>
  );
};

export default Users;
