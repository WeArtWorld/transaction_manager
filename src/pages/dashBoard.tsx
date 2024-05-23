import React, { useState, useEffect } from 'react';
import BarChartArtists from '../components/barChartArtists';
import BarChartVolunteers from '../components/barChartVolunteers';
import InfoCards from '../components/infoCards';
import AddSalePopup from '../components/addSalePopup';
import withAuth from '../components/withAuth';
import axios, { AxiosResponse } from 'axios';

interface Sale {
    id: string;
    item: string;
    amount: string;
    date: string;
}

interface Artist {
    id: string;
    name: string;
    owed_amount: number;
}

const Dashboard = () => {
    const [isAddSalePopupOpen, setAddSalePopupOpen] = useState(false);
    const [sales, setSales] = useState<Sale[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get('/api/sales'); 
                setSales(response.data);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/artists'); 
                setArtists(response.data);
            } catch (error) {
                console.error('Error fetching artists:', error);
            }
        };

        fetchSales();
        fetchArtists();
    }, []);

    const totalSales = sales.length;
    const totalArtists = artists.length;

    const handleAddSale = async (sale: Omit<Sale, 'id' | 'date'>) => {
        const postData: Omit<Sale, 'id' | 'date'> & { date: string } = {
            ...sale,
            date: new Date().toISOString(),
        };

        try {
            const response: AxiosResponse<{ id: string }> = await axios.post('/api/sales', postData);
            setSales([...sales, { ...postData, id: response.data.id }]);
            setAddSalePopupOpen(false); 
            window.location.reload();
        } catch (error) {
            console.error('Error adding sale:', error);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
                <InfoCards totalArtists={totalArtists} totalSales={totalSales} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '1200px', gap: '30px' }}>
                <BarChartArtists />
                <BarChartVolunteers />
            </div>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => setAddSalePopupOpen(true)}
            >
                Add Sale
            </button>
            <AddSalePopup 
                isOpen={isAddSalePopupOpen} 
                onClose={() => setAddSalePopupOpen(false)} 
                onAddSale={handleAddSale} 
            />
        </div>
    );
};

export default withAuth(Dashboard);
