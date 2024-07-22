import React from "react";
import { Paper, Grid, Typography} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import { useQuery,useQueryClient } from "react-query";
import { getUser ,getComplaint } from "../../../api/UserApi"; 




const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },

  paperContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 20px",
    width: "100%",
  },
  paper: {
    p: 6,
    width: "500px",
    minHeight: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
 
}));

const Complaint = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const {
    data: complaints,
  } = useQuery("complaints",getComplaint);
  const {
    data: usersData,
  } = useQuery("users",getUser);

  const complaint = complaints?.data;
  const userMap = new Map();
  if (usersData?.data?.users) {
    for (const user of usersData.data.users) {
      userMap.set(user.id, { name: user.name, mobile_number: user.mobile_number });
    }
  }
  return (
    <div  >
      <Carousel
        animation="slide"
        interval={null}
        navButtonsAlwaysVisible
        navButtonsProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            borderRadius: 0,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
            // position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            left: "15px", // Adjust this value to position the buttons
            right: "15px", // Adjust this value to position the buttons
          },
        }}
      >
       {complaint?.map((com, index) => (
          <div key={index} className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="subtitle"
                    className={classes.Typography}
                    style={{
                      fontWeight: "bold",
                      color: "#F01E29",
                    }}
                  >
                    {`مشكلة ${index + 1}`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="subtitle" className={classes.Typography}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#5151ff",
                        fontWeight: "bold",
                      }}
                    >
                      الاسم:
                    </div>
                    {userMap.get(com.user_id)?.name || "Unknown"}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="subtitle" className={classes.Typography}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#5151ff",
                        fontWeight: "bold",
                      }}
                    >
                      الرقم :
                    </div>
                    {userMap.get(com.user_id)?.mobile_number || "Unknown"}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="subtitle" className={classes.Typography}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#5151ff",
                        fontWeight: "bold",
                      }}
                    >
                      وصف المشكلة
                    </div>
                    {com.content}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Complaint;
