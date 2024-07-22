import React from "react";
import { Grid, Typography } from "@mui/material";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";

import "../global/grid.css";

const DataRow = ({ rowData , isEvenRow, onDelete ,excludeId = false}) => {
  const filteredData = excludeId ? Object.fromEntries(
    Object.entries(rowData).filter(([key]) => key !== "id")
  ) : rowData;

  return (
    <Grid
    container
    justifyContent="space-between"
    alignItems="center"
    sx={{ flex: 1, height: 77, padding: "0 16px" }}
    className={isEvenRow ? "even-row" : "odd-row"}
  >
    {Object.values(filteredData).map((data, index) => (
      <Grid item xs={2} key={index}>
        <Typography variant="subtitle1">{data}</Typography>
      </Grid>
    ))}
    <Grid item  >
      {onDelete && ( // Conditionally render the button only if onDelete prop is provided
        <IconButton
          aria-label="delete"
          onClick={() => onDelete(rowData.id)} // Pass rowData.id to onDelete function
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Grid>
  </Grid>
  );
};

export default DataRow;
