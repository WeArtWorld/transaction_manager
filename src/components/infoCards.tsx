import React, { useEffect, useState } from 'react';
import axios from 'axios';


interface Artist {
    total_revenue: string;
}

interface InfoCardProps {
    title: string;
    value: string;
}

const InfoCards = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [artistCount, setArtistCount] = useState(0);

    useEffect(() => {
        const fetchArtistsData = async () => {
            try {
                const response = await axios.get('/api/artists');
                let revenue = 0;
                let count = 0;

                if (response.data) {
                    Object.values(response.data as Record<string, Artist>).forEach(artist => {
                        revenue += parseFloat(artist.total_revenue);
                        count++;
                    });
                }
                setTotalRevenue(revenue);
                setArtistCount(count);
            } catch (error) {
                console.error('Error fetching artist data:', error);
            }
        };

        fetchArtistsData();
    }, []);

    return (
        <div className='text-black' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <InfoCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            <InfoCard title="Total Artists" value={artistCount.toString()} />
            <InfoCard title="Total Artists" value={artistCount.toString()} />
        </div>
    );
};

export default InfoCards;

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
    return (
        <div style={{
            minWidth: '200px',
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '0 10px'
        }}>
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};