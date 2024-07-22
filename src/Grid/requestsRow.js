import React, { useState } from "react";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";

const RequestRow = ({ reservation, index }) => {
  const { id, name, phone_number, destination } = reservation;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        <Grid>
          <Paper
            sx={{
              p: 2,
              width: "700px", // Add !important to override conflicting styles
              minHeight: "150px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              //   sx={{ flex: 1, height: 90, padding: "0 16px" }}
            >
              <Grid item xs={3}>
                {name}
              </Grid>
              <Grid item xs={3}>
                {phone_number}{" "}
              </Grid>
              <Grid item xs={3}>
                {destination}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    </div>
  );
};

export default RequestRow;
