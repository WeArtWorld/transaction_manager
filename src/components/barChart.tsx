    import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Switch from '@mui/material/Switch';

const TopArtistsChart = () => {
  const [artists, setArtists] = useState([]);
  const [metric, setMetric] = useState('total_revenue');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('/api/artists');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const sortedArtists = artists.sort((a, b) => b[metric] - a[metric]).slice(0, 5);

  const handleToggle = () => {
    setMetric(metric === 'total_revenue' ? 'item_sold' : 'total_revenue');
  };

  return (
    <div>
      <Switch
        checked={metric === 'item_sold'}
        onChange={handleToggle}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <BarChart width={500} height={300} data={sortedArtists}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={metric} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TopArtistsChart;
