import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
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
    <div className='flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow' style={{ width: '100%', maxWidth: '600px' }}>
            <div className='flex items-center justify-center w-full p-2'>
        <Switch
          checked={metric === 'item_sold'}
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <span className='ml-2 text-lg font-medium' style={{ marginLeft: '8px' }}>{metric === 'item_sold' ? 'Items Sold' : 'Total Revenue'}</span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sortedArtists} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={120} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <Bar dataKey={metric} fill="#8884d8">
            <LabelList dataKey={metric} position="top" style={{ fill: 'black' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopArtistsChart;
