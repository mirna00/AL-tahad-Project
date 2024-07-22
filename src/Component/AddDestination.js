import React, { useState } from "react";
import { useMutation } from "react-query";
import { TextField, Modal, Box, Button } from "@mui/material";

export const AddDestinationModal = ({ open, onClose, onSave ,destinations,setDestinations }) => {
  const [newDestination, setNewDestination] = useState("");

  const { mutate: addDestination, isLoading } = useMutation(
    async (newDestinationName) => {
      const response = await fetch(
        "http://91.144.20.117:7109/api/destination/add_destination",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newDestinationName }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: (data) => {
        // Update the destinations array with the new destination
        onSave(data);
        setNewDestination("");
        onClose();
      },
      onError: (error) => {
        console.error("Error adding destination:", error);
      },
    }
  );

  const handleSave = () => {
    addDestination(newDestination);
    onSave(newDestination);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "common.white",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <TextField
          label="New Destination"
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              background: "aliceblue",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isLoading}
          sx={{ color: "common.white" }}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            color: "common.white",
          }}
        >
          cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default AddDestinationModal;
