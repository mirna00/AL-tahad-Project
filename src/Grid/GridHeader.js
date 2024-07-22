import React from "react";
import { Grid } from "@mui/material";
import "../global/grid.css";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Typography: {
    fontWeight: "bold",
    fontSize: "20px",
    color: "#F01E29",
  },
  gridItem: {
    marginRight: theme.spacing(4), // Add spacing between grid items
  },
}));
const GridHeader = ({ headers }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    
      sx={{
        flex: 1,
        height: 77,
      }}
      className="header-row"
    >
      {headers.map((header, index) => (
        <Grid item xs={2} key={index} className={classes.gridItem}>
          <Typography variant="subtitle1" className={classes.Typography}>
            {header}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default GridHeader;
