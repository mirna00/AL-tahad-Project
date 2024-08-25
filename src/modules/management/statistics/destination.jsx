import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { _axios } from "../../../api/axiosApi";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../statistics/statistics.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchDestinations } from "../../../api/TripsApi";
import { TextField, Grid, Typography  } from "@material-ui/core";
import dayjs from "dayjs";

const fetchTripsCount = async (destinationId, type) => {
  try {
    const response = await _axios.get(
      `/api/statistic/tripsCountDestinationPeriod?destination_id=${destinationId}&type=${type}`
    );
    // Transform response data
    return response.data.data.map((item) => ({
      date: item.period, // Use "date" for the X-axis
      count: item.reservation_count, // Use "count" for the Bar dataKey
    }));
  } catch (error) {
    console.error("Error fetching trips count:", error);
    throw (
      (new Error("Failed to fetch trips count"), error.response.data.message)
    );
  }
};

const fetchTripsDate = async (startDateMonth, EndDateMonth, typeMonth) => {
  try {
    const response = await _axios.get(
      `/api/statistic/tripsCountPerDatePeriod?start_date=${startDateMonth}&end_date=${EndDateMonth}&type=month`
    );
    // Transform response data
    return response.data.data.map((item) => ({
      date: item.period, // Use "date" for the X-axis
      count: item.reservation_count, // Use "count" for the Bar dataKey
    }));
  } catch (error) {
    console.error("Error fetching trips count:", error);
    throw (
      (new Error("Failed to fetch trips count"), error.response.data.message)
    );
  }
};

const StatisticsChart = () => {
  const [startDate, setStartDate] = useState(dayjs()); // Set default to today
  const [endDate, setEndDate] = useState(dayjs().add(1, "day")); // Default to tomorrow
  const [destinationId, setDestinationId] = useState("");
  const [groupBy, setGroupBy] = useState("year");
  const [destination_Id, setDestination_Id] = useState("");
  const [type, setType] = useState("month");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // byDestination and date
  const {
    data: chartData,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["statistics", startDate, endDate, destinationId, groupBy],
    async () => {
      const response = await _axios.post(
        "/api/statistic/byDateAndDestenation",
        {
          start_date: startDate,
          end_date: endDate,
          destination_id: destinationId,
          group_by: groupBy,
        }
      );
      console.log(response);
      return response.data.data.statistics?.map((item) => ({
        name: item.period.toString(),
        value: item.order_count,
      }));
    },
    {
      enabled: !!startDate && !!endDate && !!destinationId,
      onError: (error) => {
        if (error.response?.status === 422) {
          console.error("Validation Error:", );
          setErrorMessage(error.response.data.message);
          
        } else {
          console.error("An error occurred:", error.response.data.message);
          setErrorMessage("An unexpected error occurred.");
   
        }
        setSnackbarOpen(true);
      },
    },
  );

  const {
    data: destinations,
    error: destinationsError,
    isLoading: isLoadingDestinations,
  } = useQuery("destinations", fetchDestinations);

  const {
    data,
    error: tripsError,
    isLoading: isLoadingTrips,
  } = useQuery(
    ["tripsCount", destination_Id, type],
    () => fetchTripsCount(destination_Id, type),
    {
      enabled: !!destination_Id, // Ensure we only run if there's a destination selected
    }
  );

  const { data: TripDate } = useQuery(["DateCount", startMonth, endMonth], () =>
    fetchTripsDate(startMonth, endMonth)
  );

  if (isLoadingDestinations) return <div>Loading ...</div>;
  if (destinationsError) return <div>Error fetching destinations</div>;

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleStartDateChangeforMonth = (newValue) => {
    setStartMonth(newValue);
  };

  const handleEndDateChangeforMonth = (newValue) => {
    setEndMonth(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div> <Typography  style={{ fontSize:'20px', textAlign:'center',marginTop:'10%', justifyContent:'center',alignContent:'center', color:"red"}}>{error.response.data.message}</Typography> </div>;
  }


  console.log(chartData);
  return (
    <div style={{ textAlign: "center" ,overflow:'hidden' }}>
      <Typography
        variant="h1"
        style={{
          color: "#282828",
          fontFamily: "Cairo",
          fontWeight: "bold",
          fontSize: "28px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        الإحصائيات
      </Typography>
    
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom:'30px'
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                  gap: "16px", // Use gap for better space management
                }}
              >
                <DatePicker
                  label="تاريخ البدء"
                  value={startDate}
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />

                <DatePicker
                  label="تاريخ الإنتهاء"
                  value={endDate}
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </LocalizationProvider>
            <FormControl
              variant="outlined"
              style={{ marginRight: "16px", width: "18%" }}
            >
              <InputLabel>الوجهة</InputLabel>
              <Select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                label="الوجهة"
              >
                {destinations?.map((destination) => (
                  <MenuItem key={destination.id} value={destination.id}>
                    {destination.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              style={{ marginRight: "16px", width: "18%" }}
            >
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                label="التاريخ"
              >
                <MenuItem value="year">السنة</MenuItem>
                <MenuItem value="month">الشهر</MenuItem>
              </Select>
            </FormControl>
            {isError && (
        <Typography style={{ color: 'red' }}>
          {errorMessage}
        </Typography>
      )}
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error: {error.message}</p>
          ) : (
            <ResponsiveContainer width="55%" height={400}  style={{ marginRight: '5%' }}>
              <LineChart data={chartData} width={500} height={300}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8"  />
              </LineChart>

              <Typography style={{ color: "red" }}>
                حسب الوجهة والتاريخ
              </Typography>
            </ResponsiveContainer>
          )}
        </Grid>
{/* second */}
        <Grid item xs={6} style={{ paddingRight: '14%' }} >
  <FormControl variant="outlined" style={{ width: '150px', marginBottom: '16px',marginLeft:'20px' }}>
    <InputLabel>الوجهة</InputLabel>
    <Select
      value={destination_Id}
      onChange={(e) => setDestination_Id(e.target.value)}
    >
      {destinations?.map((destination) => (
        <MenuItem key={destination.id} value={destination.id}>
          {destination.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl variant="outlined" style={{ width: '150px', marginBottom: '16px' }}>
 
    <Select value={type} onChange={(e) => setType(e.target.value)}>
      <MenuItem value="year">السنة</MenuItem>
      <MenuItem value="month">الشهر</MenuItem>
    </Select>
  </FormControl>

  {isLoadingTrips ? (
    <div>Loading trips count...</div>
  ) : tripsError ? (
    <div>Error fetching trips count: {tripsError.message}</div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', marginRight: '10%' }}>
      <BarChart
        width={400} // Adjust the width of the BarChart
        height={300}
        data={data}
        className="bar-chart"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8"  />
      </BarChart>
    </div>
  )}
</Grid>
        {/* third  */}

        <Grid item xs={6}>
 
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "35px",
        gap: "16px",
      }}
    >
      <DatePicker
        label="تاريخ البدء"
        value={startDate}
        onChange={handleStartDateChangeforMonth}
        renderInput={(params) => <TextField {...params} style={{ width: '150px' }} />} // Set width for DatePicker's input
        sx={{ width: '150px' }} // Set width for DatePicker
      />

      <DatePicker
        label="تاريخ الإنتهاء"
        value={endDate}
        onChange={handleEndDateChangeforMonth}
        renderInput={(params) => <TextField {...params} style={{ width: '150px' }} />} // Set width for DatePicker's input
        sx={{ width: '150px' }} // Set width for DatePicker
      />
    </div>
  </LocalizationProvider>

  {isLoadingTrips ? (
    <p>Loading trips count...</p>
  ) : tripsError ? (
    <p>Error fetching trips count: {tripsError.message}</p>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', marginRight: '9%' }}>
      <BarChart width={400} height={300} data={TripDate}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
        
      </BarChart>
     
    </div>
  )}
</Grid>
      </Grid>

     

    </div>
  );
};

export default StatisticsChart;
