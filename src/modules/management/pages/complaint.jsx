import React from "react";
import { Paper, Grid, Typography,Icon,Box} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { useQuery } from "react-query";
import { getComplaint } from "../../../api/UserApi"; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
// import { ErrorOutlineRounded } from '@material-ui/icons';
import GppBadIcon from '@mui/icons-material/GppBad';




const useStyles = makeStyles((theme) => ({
  Typography: {
    color: "#000000",
    fontFamily: "Cairo",
    fontSize: "18px",
  },


 
}));

const Complaint = () => {
  const classes = useStyles();
  const { data: complaints, error, isLoading } = useQuery("complaints", getComplaint);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  
 
console.log(complaints)
  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
      style={{ width: '90%', maxWidth: '600px' }}
    >
      {complaints.data.map((complaint) => (
        <SwiperSlide key={complaint.id}>
          <Box
            p={2}
            bgcolor="#fff"
            borderRadius={10}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="300px"
          >
            <Box
              position="relative"
              width="100%"
              marginBottom={6}
            >
              <Icon
                component={GppBadIcon}
                style={{
                  color: 'red',
                  fontSize: '80px',
                  position: 'absolute',
                 
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
           
            </Box>
            <Box marginTop={8}>
                <Typography variant="h4" align="center" gutterBottom>
                  {complaint.user.name}
                </Typography>
              </Box>
            <Typography variant="body1" color="textSecondary" align="center" style={{fontSize:"20px"}} gutterBottom>
              {complaint.content}
            </Typography>
            <Typography variant="subtitle" color="textSecondary" align="center" gutterBottom>
              التاريخ: {complaint.date}
            </Typography>
            <Typography variant="subtitle" color="textSecondary" align="center" gutterBottom>
              رقم الهاتف: {complaint.user.mobile_number}
            </Typography>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  </Box>
  );
};

export default Complaint;
