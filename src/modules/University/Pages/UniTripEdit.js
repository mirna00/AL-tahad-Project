import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Modal, TextField, Button } from "@material-ui/core";

import { updateUni } from "../../../api/university";

const UniTripEdit = ({ trip, onSave, onCancel }) => {
  const [UniData, setUniData] = useState({
    id: "",
    go_price: "",
    round_trip_price: "",
    semester_round_trip_price: "",
    go_points: "",
    round_trip_points: "",
    semester_round_trip_points: "",
    required_go_points: "",
    required_round_trip_points: "",
    required_semester_round_trip_points: "",
  });

  const queryClient = useQueryClient();

  const updateUniTripMutation = useMutation(updateUni, {
    onSuccess: () => {
      queryClient.invalidateQueries("trips");
      onCancel();
    },
  });

  useEffect(() => {
    if (trip) {
      setUniData({
        id: trip.id,
        go_price: trip.go_price || "",
        round_trip_price: trip.round_trip_price || "",
        semester_round_trip_price: trip.semester_round_trip_price || "",
        go_points: trip.go_points || "",
        round_trip_points: trip.round_trip_points || "",
        semester_round_trip_points: trip.semester_round_trip_points || "",
        required_go_points: trip.required_go_points || "",
        required_round_trip_points: trip.required_round_trip_points || "",
        required_semester_round_trip_points:
          trip.required_semester_round_trip_points || "",
      });
    } else {
      // Handle the case where trip is not available
      console.error("Missing required props in UniTripEdit component");
    }
  }, [trip]);

  const handleInputChange = (event) => {
    setUniData({
      ...UniData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveTrip = () => {
    updateUniTripMutation.mutate(UniData);
  };

  const handleCancelEdit = () => {
    onCancel();
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "2rem",
          outline: "none",
        }}
      >
        <TextField
          type="number"
          name="round_trip_price"
          value={UniData.round_trip_price}
          onChange={handleInputChange}
          label="ذهاب وعودة"
          margin="normal"
        />
        <TextField
          type="number"
          name="go_price"
          value={UniData.go_price}
          onChange={handleInputChange}
          label="ذهاب/عودة"
          margin="normal"
        />

        <TextField
          type="number"
          name="semester_round_trip_price"
          value={UniData.semester_round_trip_price}
          onChange={handleInputChange}
          label="سعر الذهاب والعودة للاشتراك"
          margin="normal"
        />

        <TextField
         type="number"
          name="go_points"
          value={UniData.go_points}
          onChange={handleInputChange}
          label=" نقاط ذهاب وعودة يومي"
          margin="normal"
        />
        <TextField
          type="number"
          name="round_trip_points"
          value={UniData.round_trip_points}
          onChange={handleInputChange}
          label="نقاط ذهاب / عودة يومي "
          margin="normal"
        />

        <TextField
          type="number"
          name="semester_round_trip_points"
          value={UniData.semester_round_trip_points}
          onChange={handleInputChange}
          label="نقاط  للاشتراك"
          margin="normal"
        />

        <TextField
          type="number"
          name="required_round_trip_points"
          value={UniData.required_round_trip_points}
          onChange={handleInputChange}
          label=" نقاط ذهاب وعودة يومي"
          margin="normal"
        />
        <TextField
          type="number"
          name="required_go_points"
          value={UniData.required_go_points}
          onChange={handleInputChange}
          label="نقاط ذهاب / عودة يومي "
          margin="normal"
        />

        <TextField
          type="number"
          name="required_semester_round_trip_points"
          value={UniData.required_semester_round_trip_points}
          onChange={handleInputChange}
          label="نقاط اللازمة للاشتراك"
          margin="normal"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button onClick={handleCancelEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveTrip} color="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UniTripEdit;
