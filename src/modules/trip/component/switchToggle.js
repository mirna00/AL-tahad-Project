import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Requests from "../pages/Requests";
import InPrograss from "../pages/acceptableRequest";

const ToggleSwitch = () => {
  const [alignment, setAlignment] = useState("الطلبات"); 
  
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const renderComponent = () => {
    switch (alignment) {
      case "الطلبات":
        return <Requests />;
      case "لم-يتم-التثبيت":
        return <InPrograss />;
      default:
        return <Requests />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px",
      }}
    >
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        sx={{
          "& .MuiToggleButton-root": {
            // border: "1px solid #ccc",
            borderRadius: "7px",
            width: "200px",
            height: "40px",
            backgroundColor: "#fde0dc", // Background color for unselected button
            color: "#F01E29",

            "&.Mui-selected": {
              backgroundColor: "#F01E29",
              color: "#fff",
              opacity: 1,
            },
            "&.Mui-selected.MuiToggleButton-root": {
              border: "1px solid #f44336", // Border color for selected button

              backgroundColor: "#F01E29", // Add background color for the selected button
            },
            "&:hover": {
              backgroundColor: "#ffebee",
            },
          },
        }}
      >
        <ToggleButton
          value="الطلبات"
          className={alignment === "الطلبات" ? "Mui-selected" : ""}
        >
          <Typography style={{fontSize:"18px", fontWeight: "600"}}> الطلبات</Typography>
        </ToggleButton>
        <ToggleButton value="لم-يتم-التثبيت">
          <Typography style={{fontSize:"18px",fontWeight: "600"}}> لم يتم التثبيت</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
      {renderComponent()}
    </div>
  );
};

export default ToggleSwitch;
