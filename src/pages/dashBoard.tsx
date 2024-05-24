import React, { useState, useEffect } from 'react';
import BarChartArtists from '../components/barChartArtists';
import BarChartVolunteers from '../components/barChartVolunteers';
import InfoCards from '../components/infoCards';
import AddSalePopup from '../components/addSalePopup';
import withAuth from '../components/withAuth';
import axios, { AxiosResponse } from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Sale {
    id: string;
    article: string;
    artist_id: string;
    comment: string;
    completed_payment: boolean;
    date: string;
    payment_method: string;
    pick_up: boolean;
    price: string;
    volunteer_id: string;
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
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [topSales, setTopSales] = useState<Sale[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const fetchSalesData = async (start: Date, end: Date) => {
        try {
            const response = await axios.get(`/api/sales?start=${start.toISOString()}&end=${end.toISOString()}`);
            const data: Sale[] = response.data;
            console.log('Sales data:', data);


            const filteredData = data.filter(sale => {
                const saleDate = new Date(sale.date);
                console.log(`Sale Date: ${saleDate}, Start Date: ${start}, End Date: ${end}`);
                return saleDate >= start && saleDate <= end;
            });


            const total = filteredData.reduce((acc, sale) => acc + parseFloat(sale.price || '0'), 0);
            const topSales = filteredData.sort((a, b) => parseFloat(b.price || '0') - parseFloat(a.price || '0')).slice(0, 5);

            setTotalAmount(total);
            setTopSales(topSales);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

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
        <div className="p-5 flex flex-col items-center h-full">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => setAddSalePopupOpen(true)}
            >
                Add Sale
            </button>
            <AddSalePopup
                isOpen={isAddSalePopupOpen}
                onClose={() => setAddSalePopupOpen(false)}
                onAddSale={handleAddSale}
            />
            <div className="flex justify-center w-full max-w-5xl mb-5">
                <InfoCards totalArtists={totalArtists} totalSales={totalSales} />
            </div>
            <div className="flex justify-around w-full max-w-5xl gap-8 mb-5">
                <BarChartArtists />
                <BarChartVolunteers />
            </div>
            <div className="flex gap-4 mb-5 text-black">
                <div className="flex flex-col items-start">
                    <label>Start Date:</label>
                    <DatePicker className="p-2 border rounded" selected={startDate} onChange={(date: Date) => setStartDate(date as Date)} />
                </div>
                <div className="flex flex-col items-start">
                    <label>End Date:</label>
                    <DatePicker className="p-2 border rounded" selected={endDate} onChange={(date: Date) => setEndDate(date as Date)} />
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => fetchSalesData(startDate, endDate)}
                >
                    Fetch Data
                </button>
            </div>
            <div className="w-full max-w-5xl text-black mb-5">
                <h2 className="text-xl font-bold mb-3">Total Amount: ${totalAmount.toFixed(2)}</h2>
                <h3 className="text-lg font-semibold mb-2">Top Sales</h3>
                <ul className="list-disc list-inside">
                    {topSales.map((sale) => (
                        <li key={sale.id} className="mb-1">
                            {sale.article}: ${sale.price}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default withAuth(Dashboard);
