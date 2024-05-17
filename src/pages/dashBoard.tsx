import React from 'react';
import InfoCards from '../components/infoCards'
import TopArtistsChart from '../components/barChart'

const Home: React.FC = () => {
    return (
        <>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <main style={{ flexGrow: 1 }}>
                <InfoCards />
            </main>
        </div>
        <div>
        <h1>Top Artists</h1>
        <TopArtistsChart />
      </div>
      </>
    );
};

export default Home;