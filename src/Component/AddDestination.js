import React, { useState } from "react";
import { useMutation } from "react-query";
import { TextField, Modal, Box, Button } from "@mui/material";
import { _axios } from "../api/axiosApi";
import { addDestination,fetchDestinations } from "../api/TripsApi";
import { useQueryClient ,useQuery } from "react-query";

export const AddDestinationModal = ({ open, onClose, onSave }) => {
  const [newDestination, setNewDestination] = useState("");
  const queryClient = useQueryClient();

  const { data: destinations } = useQuery("destinations", fetchDestinations);

  const { mutate: addDestinationMutate, isLoading } = useMutation(addDestination, {
    onSuccess: (data) => {
      console.log("Add Trip success:", data);
      queryClient.invalidateQueries("destinations");
      onSave(data.destination);
      onClose();
    },
  });

  const handleSave = () => {
    addDestinationMutate(newDestination);
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
          onClick={onClose}
          sx={{
            color: "common.white",
          }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default AddDestinationModal;
