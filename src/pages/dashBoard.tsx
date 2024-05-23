import React from 'react';
import BarChartArtists from '../components/barChartArtists';
import BarChartVolunteers from '../components/barChartVolunteers';
import InfoCards from '../components/infoCards';
import withAuth from '../components/withAuth';

const Dashboard = () => {
    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
                <InfoCards />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '1200px', gap: '30px' }}>
                <BarChartArtists />
                <BarChartVolunteers />
            </div>
        </div>
    );
};

//export default Dashboard;
export default withAuth(Dashboard);
