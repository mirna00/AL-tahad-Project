import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsChart = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [groupBy, setGroupBy] = useState('year');

  const { data: chartData, isLoading, isError, error } = useQuery(
    ['statistics', startDate, endDate, destinationId, groupBy],
    async () => {
      const response = await axios.post('http://91.144.20.117:7109/api/statistic/byDateAndDestenation', {
        start_date: startDate,
        end_date: endDate,
        destination_id: destinationId,
        group_by: groupBy,
      });
      return response.data.statistics?.map((item) => ({
        name: item.period.toString(),
        value: item.order_count,
      }));
    },
    {
      enabled: !!startDate && !!endDate && !!destinationId,
    }
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // const handleFilterChange = async () => {
  //   try {
  //     const response = await data(startDate, endDate, destinationId,groupBy);
  //     const chartData = response.data?.statistics?.map((item) => ({
  //       name: item.period.toString(), // Convert the period to a string
  //       value: item.order_count,
  //     }));
  //     setChartData(chartData);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  // const chartData = data?.statistics?.map((item) => ({
  //   name: item.period.toString(), // Convert the period to a string
  //   value: item.order_count,
  // }));

  return (
    <div style={{textAlign:"center"}}>
      <div style={{textAlign:"center"}}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Destination ID:
          <input
            type="text"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
          />
        </label>
        <label>
          Group By:
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
          </select>
        </label>
      </div>
      {isLoading ? (
      <p>Loading...</p>
    ) : isError ? (
      <p>Error: {error.message}</p>
    ) : (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    )}
    </div>
  );
};

export default StatisticsChart;